<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\DesignTokens;

use Codeception\TestCase\WPTestCase;
use Generator;
use Kadence_Blocks_Advancedheading_Block;
use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Projector as Css_Var_Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Palette\Projector as Palette_Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Preset\Projector as Preset_Projector;

/**
 * Pins that a block color stored as a design token reference keeps rendering
 * when the Kadence theme switches its Full Site Editing mode on and back off:
 * the block CSS keeps reading the token variable, and the token CSS that
 * defines it is unchanged and still reaches the page.
 */
final class TokenReferenceRenderTest extends WPTestCase {
	protected \IntegrationTester $tester;

	/**
	 * The variable the heading color references.
	 */
	private const VARIABLE = '--kb-token--primitive--color--brand--primary';

	/**
	 * The saved override the variable is defined with.
	 */
	private const COLOR = '#123456';

	/**
	 * An Advanced Heading whose color is a stored token reference. With the
	 * Kadence theme active, the empty color class makes it emit color CSS.
	 */
	private const HEADING = [
		'uniqueID'   => '10_token',
		'color'      => '{primitive.color.brand.primary}',
		'colorClass' => '',
	];

	/**
	 * The front-end style handle the token CSS is attached to.
	 */
	private const HANDLE = 'kadence-blocks-global-variables';

	private Token_Store $store;

	protected function setUp(): void {
		parent::setUp();

		$this->store = App::instance()->container()->get( Token_Store::class );

		$this->store->save_document(
			(string) wp_json_encode(
				[
					'primitive' => [
						'color' => [
							'brand' => [
								'primary' => [
									'$type'  => 'color',
									'$value' => self::COLOR,
								],
							],
						],
					],
				]
			)
		);
	}

	protected function tearDown(): void {
		$this->store->delete( Token_Store::default_slug() );

		parent::tearDown();
	}

	/**
	 * A heading color stored as a token reference renders the bare token variable in classic mode, in Full Site
	 * Editing mode and in classic mode again.
	 *
	 * @return void
	 */
	public function testAStoredTokenColorRendersTheTokenVariableAcrossAModeRoundTrip(): void {
		[ $classic, $fse, $classic_again ] = $this->across_a_mode_round_trip( [ $this, 'heading_css' ] );

		$declaration = 'color:var(' . self::VARIABLE . ')';

		$this->assertStringContainsString( $declaration, $classic );
		$this->assertStringContainsString( $declaration, $fse, 'Full Site Editing mode dropped the token reference.' );
		$this->assertStringContainsString( $declaration, $classic_again );
	}

	/**
	 * The token variable CSS is the same in every mode and defines the variable the heading reads with the
	 * saved value.
	 *
	 * @return void
	 */
	public function testTheTokenCssDefinesTheVariableIdenticallyAcrossAModeRoundTrip(): void {
		[ $classic, $fse, $classic_again ] = $this->across_a_mode_round_trip( [ $this, 'token_css' ] );

		$this->assertStringContainsString( self::VARIABLE . ':' . self::COLOR . ';', $classic );
		$this->assertSame( $classic, $fse );
		$this->assertSame( $classic, $classic_again );
	}

	/**
	 * The front-end enqueue attaches the variable definition to the global variables handle in every mode.
	 *
	 * @return void
	 */
	public function testTheFrontEndEnqueueAttachesTheDefinitionAcrossAModeRoundTrip(): void {
		[ $classic, $fse, $classic_again ] = $this->across_a_mode_round_trip( [ $this, 'front_end_css' ] );

		$definition = self::VARIABLE . ':' . self::COLOR . ';';

		$this->assertStringContainsString( $definition, $classic );
		$this->assertStringContainsString( $definition, $fse, 'Full Site Editing mode kept the token definition off the page.' );
		$this->assertStringContainsString( $definition, $classic_again );
	}

	/**
	 * A preset or palette projector's CSS is the same in every mode.
	 *
	 * @dataProvider projectorProvider
	 *
	 * @param string $projector The projector class.
	 *
	 * @return void
	 */
	public function testTheProjectorCssIsIdenticalAcrossAModeRoundTrip( string $projector ): void {
		$css_projector = App::instance()->container()->get( $projector );

		[ $classic, $fse, $classic_again ] = $this->across_a_mode_round_trip( [ $css_projector, 'css' ] );

		$this->assertNotSame( '', $classic );
		$this->assertSame( $classic, $fse );
		$this->assertSame( $classic, $classic_again );
	}

	/**
	 * The projectors whose CSS gives the kbPreset and kbPalette attributes their meaning.
	 *
	 * @return Generator
	 */
	public function projectorProvider(): Generator {
		yield 'preset' => [ 'projector' => Preset_Projector::class ];
		yield 'palette' => [ 'projector' => Palette_Projector::class ];
	}

	/**
	 * Reads a value in classic mode, in Full Site Editing mode and in classic mode again, each time from cold
	 * token caches the way a new request would.
	 *
	 * @param callable $read Returns the value to compare.
	 *
	 * @return array{0: string, 1: string, 2: string}
	 */
	private function across_a_mode_round_trip( callable $read ): array {
		$this->tester->forget_token_caches();
		$classic = $read();

		$this->tester->enable_fse_mode();
		$this->tester->forget_token_caches();
		$fse = $read();

		$this->tester->disable_fse_mode();
		$this->tester->forget_token_caches();

		return [ $classic, $fse, $read() ];
	}

	/**
	 * The heading's CSS.
	 *
	 * @return string
	 */
	private function heading_css(): string {
		return $this->tester->block_css( Kadence_Blocks_Advancedheading_Block::get_instance(), self::HEADING );
	}

	/**
	 * The Css_Var projector's CSS.
	 *
	 * @return string
	 */
	private function token_css(): string {
		return App::instance()->container()->get( Css_Var_Projector::class )->css();
	}

	/**
	 * Runs the front-end enqueue in fresh style and script registries.
	 *
	 * @return string The inline CSS attached to the global variables handle.
	 */
	private function front_end_css(): string {
		$this->tester->use_fresh_asset_registries();

		do_action( 'wp_enqueue_scripts' );

		$this->assertTrue( wp_style_is( self::HANDLE ), 'The global variables handle was not enqueued.' );

		return implode( '', (array) wp_styles()->get_data( self::HANDLE, 'after' ) );
	}
}
