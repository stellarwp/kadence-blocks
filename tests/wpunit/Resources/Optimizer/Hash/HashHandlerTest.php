<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Hash;

use DateTimeImmutable;
use DateTimeZone;
use KadenceWP\KadenceBlocks\Optimizer\Enums\Viewport;
use KadenceWP\KadenceBlocks\Optimizer\Hash\Hash_Builder;
use KadenceWP\KadenceBlocks\Optimizer\Hash\Hash_Handler;
use KadenceWP\KadenceBlocks\Optimizer\Hash\Hash_Store;
use KadenceWP\KadenceBlocks\Optimizer\Request;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use Tests\Support\Classes\TestCase;

final class HashHandlerTest extends TestCase {

	private Store $store;
	private Hash_Builder $hasher;
	private Hash_Handler $hash_handler;
	private Hash_Store $hash_store;
	private int $post_id;

	protected function setUp(): void {
		// Remove all existing shutdown actions to prevent hook interference with output buffering.
		remove_all_actions( 'shutdown' );

		parent::setUp();

		$this->store        = $this->container->get( Store::class );
		$this->hasher       = $this->container->get( Hash_Builder::class );
		$this->hash_handler = $this->container->get( Hash_Handler::class );
		$this->hash_store   = $this->container->get( Hash_Store::class );

		// Create a test post.
		$this->post_id = $this->factory()->post->create(
			[
				'post_title'  => 'Test Post',
				'post_status' => 'publish',
			]
		);

		// Set up global post and query.
		global $post, $wp_query, $wp_the_query;
		$post                    = get_post( $this->post_id );
		$wp_query->is_main_query = true;
		$wp_the_query            = $wp_query;
	}

	protected function tearDown(): void {
		// Clean up test data.
		if ( $this->post_id ) {
			$this->store->delete( $this->post_id );
			$this->hash_store->delete( $this->post_id, Viewport::desktop() );
		}

		// Clean up globals.
		global $post, $wp_query;
		$post                    = null;
		$wp_query->is_main_query = false;

		// Clean up GET variables.
		unset(
			$_GET['preview'],
			$_GET['kadence_set_optimizer_hash'],
			$_GET[ Request::QUERY_NOCACHE ],
			$_GET[ Request::QUERY_TOKEN ]
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

		$this->store->set( $this->post_id, $this->create_test_analysis() );

		$this->hash_handler->start_buffering();

		echo $html;

		// Clear the current output buffer.
		ob_get_clean();

		// Assert the correct hash was set.
		add_action(
			'kadence_blocks_optimizer_set_hash',
			function ( string $set_hash, int $post_id, Viewport $viewport ) use ( $hash ): void {
				$this->assertSame( $hash, $set_hash );
				$this->assertSame( $this->post_id, $post_id );
				$this->assertEquals( Viewport::desktop(), $viewport );
			},
			10,
			3
		);

		$this->hash_handler->check_hash();

		$this->assertSame( $hash, $this->hash_store->get( $this->post_id, Viewport::desktop() ) );
	}

	public function testItInvalidatesAnalysisData(): void {
		$html     = '<html><body>Test content</body></html>';
		$analysis = $this->create_test_analysis();

		$this->assertTrue( $this->hash_store->set( $this->post_id, Viewport::desktop(), 'an old hash' ) );
		$this->store->set( $this->post_id, $analysis );

		$this->hash_handler->start_buffering();

		echo $html;

		// Clear the current output buffer.
		ob_get_clean();

		$last_modified = new DateTimeImmutable( '1902-12-13', new DateTimeZone( 'UTC' ) );

		add_action(
			'kadence_blocks_optimizer_data_invalidated',
			function ( DateTimeImmutable $new_last_modified, int $post_id ) use ( $last_modified ): void {
				$this->assertSame( $last_modified, $new_last_modified );
				$this->assertSame( $this->post_id, $post_id );
			}
		);

		$this->assertTrue( did_action( 'kadence_blocks_optimizer_set_hash' ) === 0 );
		$this->hash_handler->check_hash();

		// Although this record still exists, our decorator will make it return null.
		$this->assertNull( $this->store->get( $this->post_id ) );
		$this->assertNull( $this->hash_store->get( $this->post_id, Viewport::desktop() ) );
	}

	public function testItBypassesHashCheckWithoutPostGlobal(): void {
		global $post;

		$post = null;

		$html     = '<html><body>Test content</body></html>';
		$hash     = $this->hasher->build_hash( $html );
		$analysis = $this->create_test_analysis();

		$this->assertTrue( $this->hash_store->set( $this->post_id, Viewport::desktop(), $hash ) );
		$this->store->set( $this->post_id, $analysis );

		$this->hash_handler->start_buffering();

		echo $html;

		// Clear the current output buffer.
		ob_get_clean();

		$this->hash_handler->check_hash();

		$this->assertTrue( did_action( 'kadence_blocks_hash_check_complete' ) === 0 );
	}

	public function testItBypassesHashCheckWhenNotInMainQuery(): void {
		global $wp_the_query;

		$wp_the_query = null;

		$html     = '<html><body>Test content</body></html>';
		$hash     = $this->hasher->build_hash( $html );
		$analysis = $this->create_test_analysis();

		$this->assertTrue( $this->hash_store->set( $this->post_id, Viewport::desktop(), $hash ) );
		$this->store->set( $this->post_id, $analysis );

		$this->hash_handler->start_buffering();

		echo $html;

		// Clear the current output buffer.
		ob_get_clean();

		$this->hash_handler->check_hash();

		$this->assertTrue( did_action( 'kadence_blocks_hash_check_complete' ) === 0 );
	}

	public function testItBypassesHashCheckDuringOptimizerRequest(): void {
		$_GET[ Request::QUERY_NOCACHE ] = 'ga61tywbag1';
		$_GET[ Request::QUERY_TOKEN ]   = 'ka82726tgaa';

		$html     = '<html><body>Test content</body></html>';
		$hash     = $this->hasher->build_hash( $html );
		$analysis = $this->create_test_analysis();

		$this->assertTrue( $this->hash_store->set( $this->post_id, Viewport::desktop(), $hash ) );
		$this->store->set( $this->post_id, $analysis );

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

		$this->assertTrue( $this->hash_store->set( $this->post_id, Viewport::desktop(), $hash ) );
		$this->store->set( $this->post_id, $analysis );

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

		$this->assertTrue( $this->hash_store->set( $this->post_id, Viewport::desktop(), $hash ) );
		$this->store->set( $this->post_id, $analysis );

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
