<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Hash;

use KadenceWP\KadenceBlocks\Optimizer\Enums\Viewport;
use KadenceWP\KadenceBlocks\Optimizer\Hash\Hash_Builder;
use KadenceWP\KadenceBlocks\Optimizer\Hash\Hash_Handler;
use KadenceWP\KadenceBlocks\Optimizer\Hash\Hash_Store;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Request;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Traits\Permalink_Trait;
use Tests\Support\Classes\TestCase;

final class HashHandlerTest extends TestCase {

	use Permalink_Trait;

	private Store $store;
	private Hash_Builder $hasher;
	private Hash_Handler $hash_handler;
	private Hash_Store $hash_store;
	private int $post_id;
	private Path $path;
	private string $request_uri_cache;

	protected function setUp(): void {
		// Remove all existing shutdown actions to prevent hook interference with output buffering.
		remove_all_actions( 'shutdown' );

		parent::setUp();

		$this->request_uri_cache = $_SERVER['REQUEST_URI'];

		// Set pretty permalinks.
		update_option( 'permalink_structure', '/%postname%/' );

		$_SERVER['REQUEST_URI'] = '/test-hash-handler-post/';

		$this->store        = $this->container->get( Store::class );
		$this->hasher       = $this->container->get( Hash_Builder::class );
		$this->hash_handler = $this->container->get( Hash_Handler::class );
		$this->hash_store   = $this->container->get( Hash_Store::class );

		// Create a test post.
		$this->post_id = $this->factory()->post->create(
			[
				'post_title'  => 'Test Hash Handler Post',
				'post_status' => 'publish',
				'post_name'   => 'test-hash-handler-post',
			]
		);

		$post_path = $this->get_post_path( $this->post_id );

		$this->assertNotEmpty( $post_path );

		$this->path = new Path( $post_path );
	}

	protected function tearDown(): void {
		// Restore the original REQUEST_URI.
		$this->request_uri_cache = $_SERVER['REQUEST_URI'];

		// Clean up test data.
		if ( $this->post_id ) {
			$this->store->delete( $this->path );
			$this->hash_store->delete( $this->path, Viewport::desktop() );
		}

		// Clean up GET variables.
		unset(
			$_GET['preview'],
			$_GET['kadence_set_optimizer_hash'],
			$_GET[ Request::QUERY_NOCACHE ],
			$_GET[ Request::QUERY_TOKEN ],
			$_SERVER['REQUEST_URI'],
		);

		// Reset user.
		wp_set_current_user( 0 );

		parent::tearDown();
	}

	public function testStartBufferingStartsOutputBuffer(): void {
		$this->hash_handler->start_buffering();

		// Clear the current output buffer.
		ob_get_clean();

		$this->assertTrue( ob_get_level() > 0 );
	}

	public function testEndBufferingCapturesHtmlOnFinalPhase(): void {
		$html = '<html><body>Test content</body></html>';

		$this->hash_handler->start_buffering();

		echo $html;

		// Clear the current output buffer.
		ob_get_clean();

		$this->assertSame( $html, $this->hash_handler->html() );
	}

	public function testItAssignsNewHash(): void {
		$_GET['kadence_set_optimizer_hash'] = '1';

		$html = '<html><body>Test content</body></html>';
		$hash = $this->hasher->build_hash( $html );

		$this->store->set( $this->path, $this->create_test_analysis() );

		$this->hash_handler->start_buffering();

		echo $html;

		// Clear the current output buffer.
		ob_get_clean();

		// Assert the correct hash was set.
		add_action(
			'kadence_blocks_optimizer_set_hash',
			function ( string $set_hash, Path $path, Viewport $viewport ) use ( $hash ): void {
				$this->assertSame( $hash, $set_hash );
				$this->assertEquals( $this->path, $path );
				$this->assertEquals( Viewport::desktop(), $viewport );
			},
			10,
			3
		);

		$this->hash_handler->check_hash();

		$this->assertEquals( $hash, $this->hash_store->get( $this->path, Viewport::desktop() ) );
	}

	public function testItFallsBackToRootWithEmptyRequestUri(): void {
		$_SERVER['REQUEST_URI'] = '';

		$html     = '<html><body>Test content</body></html>';
		$hash     = $this->hasher->build_hash( $html );
		$analysis = $this->create_test_analysis();

		$this->assertTrue( $this->hash_store->set( $this->path, Viewport::desktop(), $hash ) );
		$this->store->set( $this->path, $analysis );

		$this->hash_handler->start_buffering();

		echo $html;

		// Clear the current output buffer.
		ob_get_clean();

		// Assert the correct hash was set.
		add_action(
			'kadence_blocks_optimizer_set_hash',
			function ( string $set_hash, Path $path, Viewport $viewport ) use ( $hash ): void {
				$this->assertSame( $hash, $set_hash );
				$this->assertEquals( $this->path, $path );
				$this->assertEquals( Viewport::desktop(), $viewport );
			},
			10,
			3
		);

		$this->hash_handler->check_hash();

		$this->assertTrue( did_action( 'kadence_blocks_hash_check_complete' ) === 1 );
	}

	public function testItInvalidatesAnalysisData(): void {
		$html     = '<html><body>Test content</body></html>';
		$analysis = $this->create_test_analysis();

		$this->assertTrue( $this->hash_store->set( $this->path, Viewport::desktop(), 'an old hash' ) );
		$this->store->set( $this->path, $analysis );

		$this->hash_handler->start_buffering();

		echo $html;

		// Clear the current output buffer.
		ob_get_clean();

		add_action(
			'kadence_blocks_optimizer_data_invalidated',
			function ( bool $is_stale, int $post_id ): void {
				$this->assertFalse( $is_stale );
				$this->assertSame( $this->path, $post_id );
			}
		);

		$this->assertTrue( did_action( 'kadence_blocks_optimizer_set_hash' ) === 0 );
		$this->hash_handler->check_hash();

		// Although this record still exists, our decorator will make it return null.
		$this->assertNull( $this->store->get( $this->path ) );
		$this->assertNull( $this->hash_store->get( $this->path, Viewport::desktop() ) );
	}

	public function testItBypassesHashCheckDuringOptimizerRequest(): void {
		$_GET[ Request::QUERY_NOCACHE ] = 'ga61tywbag1';
		$_GET[ Request::QUERY_TOKEN ]   = 'ka82726tgaa';

		$html     = '<html><body>Test content</body></html>';
		$hash     = $this->hasher->build_hash( $html );
		$analysis = $this->create_test_analysis();

		$this->assertTrue( $this->hash_store->set( $this->path, Viewport::desktop(), $hash ) );
		$this->store->set( $this->path, $analysis );

		$this->hash_handler->start_buffering();

		echo $html;

		// Clear the current output buffer.
		ob_get_clean();

		$this->hash_handler->check_hash();

		$this->assertTrue( did_action( 'kadence_blocks_hash_check_complete' ) === 0 );
	}

	public function testItBypassesHashCheckDuringPreviewRequest(): void {
		$_GET['preview'] = '1';

		$html     = '<html><body>Test content</body></html>';
		$hash     = $this->hasher->build_hash( $html );
		$analysis = $this->create_test_analysis();

		$this->assertTrue( $this->hash_store->set( $this->path, Viewport::desktop(), $hash ) );
		$this->store->set( $this->path, $analysis );

		$this->hash_handler->start_buffering();

		echo $html;

		// Clear the current output buffer.
		ob_get_clean();

		$this->hash_handler->check_hash();

		$this->assertTrue( did_action( 'kadence_blocks_hash_check_complete' ) === 0 );
	}

	public function testItBypassesHashCheckWhenLoggedIn(): void {
		wp_set_current_user( 1 );

		$html     = '<html><body>Test content</body></html>';
		$hash     = $this->hasher->build_hash( $html );
		$analysis = $this->create_test_analysis();

		$this->assertTrue( $this->hash_store->set( $this->path, Viewport::desktop(), $hash ) );
		$this->store->set( $this->path, $analysis );

		$this->hash_handler->start_buffering();

		echo $html;

		// Clear the current output buffer.
		ob_get_clean();

		$this->hash_handler->check_hash();

		$this->assertTrue( did_action( 'kadence_blocks_hash_check_complete' ) === 0 );
	}

	public function testItBypassesHashCheckOn404Page(): void {
		global $wp_query;

		// Simulate a 404 condition.
		$wp_query->is_404 = true;

		$html     = '<html><body>Test content</body></html>';
		$hash     = $this->hasher->build_hash( $html );
		$analysis = $this->create_test_analysis();

		$this->assertTrue( $this->hash_store->set( $this->path, Viewport::desktop(), $hash ) );
		$this->store->set( $this->path, $analysis );

		$this->hash_handler->start_buffering();

		echo $html;

		// Clear the current output buffer.
		ob_get_clean();

		$this->hash_handler->check_hash();

		$this->assertTrue( did_action( 'kadence_blocks_hash_check_complete' ) === 0 );
	}

	/**
	 * Create a test WebsiteAnalysis object.
	 *
	 * @return WebsiteAnalysis
	 */
	private function create_test_analysis(): WebsiteAnalysis {
		return WebsiteAnalysis::from(
			[
				'hash'         => null,
				'lastModified' => 'now',
				'desktop'      => [
					'criticalImages'   => [ 'image1.jpg' ],
					'backgroundImages' => [ 'bg1.jpg' ],
					'sections'         => [
						[
							'id'            => 'section1',
							'height'        => 100.0,
							'tagName'       => 'div',
							'className'     => 'test-class',
							'path'          => 'body > div',
							'isAboveFold'   => true,
							'hasImages'     => true,
							'hasBackground' => false,
						],
					],
				],
				'mobile'       => [
					'criticalImages'   => [ 'image2.jpg' ],
					'backgroundImages' => [ 'bg2.jpg' ],
					'sections'         => [
						[
							'id'            => 'section2',
							'height'        => 200.0,
							'tagName'       => 'div',
							'className'     => 'test-class-mobile',
							'path'          => 'body > div',
							'isAboveFold'   => false,
							'hasImages'     => false,
							'hasBackground' => true,
						],
					],
				],
				'images'       => [],
			]
		);
	}
}
