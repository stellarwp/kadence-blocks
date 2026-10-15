<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\DesignTokens;

use Codeception\TestCase\WPTestCase;
use IntegrationTester;
use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_History_Table;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Table;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Editor_Css;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\User_Primitive_Registrar;
use KadenceWP\KadenceBlocks\StellarWP\DB\DB;

/**
 * Pins that switching the Kadence theme's Full Site Editing mode on and back
 * off never touches the stored Style Library data: the token libraries, their
 * history and the active library pointer.
 */
final class StyleLibraryDataTest extends WPTestCase {
	/**
	 * The suite actor.
	 *
	 * @since TBD
	 *
	 * @var IntegrationTester
	 */
	protected IntegrationTester $tester;

	/**
	 * The seeded library's slug.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const LIBRARY = 'fse-mode-library';

	/**
	 * The option that holds the active library slug.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const ACTIVE_OPTION = 'kadence_blocks_design_tokens_active_library';

	/**
	 * The token library store.
	 *
	 * @since TBD
	 *
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * The active library store.
	 *
	 * @since TBD
	 *
	 * @var Active_Token_Library_Store
	 */
	private Active_Token_Library_Store $active;

	protected function setUp(): void {
		parent::setUp();

		$this->store  = App::instance()->container()->get( Token_Store::class );
		$this->active = App::instance()->container()->get( Active_Token_Library_Store::class );
	}

	protected function tearDown(): void {
		$this->active->set( Token_Store::default_slug() );
		$this->store->delete( self::LIBRARY );

		parent::tearDown();
	}

	/**
	 * A mode round trip, with a request's token callbacks running in each mode, leaves the libraries, their
	 * history and the active library pointer unchanged in Full Site Editing mode and after it.
	 *
	 * @return void
	 */
	public function testAModeRoundTripLeavesTheStyleLibraryDataUnchanged(): void {
		$this->store->save_document( $this->document( '#123456' ), self::LIBRARY, 'FSE Mode Library' );
		$this->store->save_document( $this->document( '#654321' ), self::LIBRARY );
		$this->active->set( self::LIBRARY );

		$libraries = $this->rows( Token_Table::table_name( false ) );
		$history   = $this->rows( Token_History_Table::table_name( false ) );
		$pointer   = get_option( self::ACTIVE_OPTION );

		$this->assertContains( self::LIBRARY, array_column( $libraries, 'slug' ) );
		$this->assertContains( self::LIBRARY, array_column( $history, 'slug' ) );
		$this->assertSame( self::LIBRARY, $pointer );

		$this->tester->enable_fse_mode();
		$this->run_request_callbacks();
		$this->assert_unchanged( $libraries, $history, $pointer, 'in Full Site Editing mode' );

		$this->tester->disable_fse_mode();
		$this->run_request_callbacks();
		$this->assert_unchanged( $libraries, $history, $pointer, 'back in classic mode' );
	}

	/**
	 * Asserts the libraries, their history and the active library pointer match their snapshots.
	 *
	 * @param array<int, array<string, mixed>> $libraries The token library rows.
	 * @param array<int, array<string, mixed>> $history   The token history rows.
	 * @param mixed                            $pointer   The active library option.
	 * @param string                           $when      When the data is read, for the failure message.
	 *
	 * @return void
	 */
	private function assert_unchanged( array $libraries, array $history, $pointer, string $when ): void {
		$this->assertSame( $libraries, $this->rows( Token_Table::table_name( false ) ), "The token libraries changed $when." );
		$this->assertSame( $history, $this->rows( Token_History_Table::table_name( false ) ), "The token history changed $when." );
		$this->assertSame( $pointer, get_option( self::ACTIVE_OPTION ), "The active library pointer changed $when." );
	}

	/**
	 * A library document that overrides the brand primary color.
	 *
	 * @param string $color The color.
	 *
	 * @return string
	 */
	private function document( string $color ): string {
		return (string) wp_json_encode(
			[
				'primitive' => [
					'color' => [
						'brand' => [
							'primary' => [
								'$type'  => 'color',
								'$value' => $color,
							],
						],
					],
				],
			]
		);
	}

	/**
	 * Every row of a table, in insertion order.
	 *
	 * @param string $table The table name, without the prefix.
	 *
	 * @return array<int, array<string, mixed>>
	 */
	private function rows( string $table ): array {
		return (array) DB::table( $table )->orderBy( 'id' )->getAll( ARRAY_A );
	}

	/**
	 * Runs the token callbacks a request runs, from cold token caches: the init sync, the front-end and
	 * block editor enqueues, the admin head and the editor CSS.
	 *
	 * @return void
	 */
	private function run_request_callbacks(): void {
		$this->tester->forget_token_caches();
		$this->tester->use_fresh_asset_registries();

		App::instance()->container()->get( User_Primitive_Registrar::class )->sync();

		ob_start();
		do_action( 'wp_enqueue_scripts' );
		do_action( 'enqueue_block_editor_assets' );
		do_action( 'admin_head' );
		ob_end_clean();

		App::instance()->container()->get( Editor_Css::class )->css();
	}
}
