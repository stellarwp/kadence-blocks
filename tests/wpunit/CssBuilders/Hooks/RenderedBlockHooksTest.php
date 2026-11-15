<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Hooks;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Selector_Section;
use Kadence_Blocks_Css_Static_Section;
use Kadence_Blocks_Google_Fonts;
use Tests\wpunit\KadenceBlocksTestCase;

/**
 * The hooks of the CSS builders work when a real block is rendered, the way a page or a template renders it.
 *
 * HooksTest builds the CSS of a block directly; here WordPress parses the block markup, calls the render callback of the block,
 * and the CSS of the block ends up in the store of the CSS builder, where the page prints it from.
 */
final class RenderedBlockHooksTest extends KadenceBlocksTestCase {

	private const MARKUP = '<!-- wp:kadence/singlebtn {"uniqueID":"hk1-aa","text":"Hooked","color":"#ff0000"} /-->';

	/**
	 * Start from an empty store of CSS.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->reset_css();
	}

	/**
	 * Leave an empty store of CSS.
	 *
	 * @return void
	 */
	protected function tearDown(): void {
		$this->reset_css();

		parent::tearDown();
	}

	/**
	 * Empty what the CSS builder collected.
	 *
	 * @return void
	 */
	private function reset_css(): void {
		Kadence_Blocks_CSS::$styles        = [];
		Kadence_Blocks_CSS::$head_styles   = [];
		Kadence_Blocks_CSS::$custom_styles = [];

		Kadence_Blocks_CSS::get_instance()->clear();

		Kadence_Blocks_Google_Fonts::$gfonts        = [];
		Kadence_Blocks_Google_Fonts::$footer_gfonts = [];
	}

	/**
	 * Render the block and return all the CSS the blocks stored.
	 *
	 * @return string
	 */
	private function render_and_collect_css(): string {
		do_blocks( self::MARKUP );

		return implode( '', Kadence_Blocks_CSS::$styles ) . implode( '', Kadence_Blocks_CSS::$head_styles ) . implode( '', Kadence_Blocks_CSS::$custom_styles );
	}

	/**
	 * A block renders its CSS without any hook, which is what the other tests compare with.
	 *
	 * @return void
	 */
	public function testTheBlockStoresItsCss(): void {
		$css = $this->render_and_collect_css();

		$this->assertStringContainsString( 'hk1-aa', $css );
		$this->assertStringNotContainsString( 'hooked-order', $css );
	}

	/**
	 * A section a filter adds is part of the CSS the rendered block stores.
	 *
	 * @return void
	 */
	public function testASectionAddedByAFilterReachesTheRenderedBlock(): void {
		add_filter(
			'kadence_blocks_css_sections',
			static function ( array $sections, string $block_name ) {
				if ( 'singlebtn' === $block_name ) {
					$sections[] = new Kadence_Blocks_Css_Selector_Section( '.hooked-order-{id}' );
					$sections[] = new Kadence_Blocks_Css_Static_Section( 'order', '3' );
				}

				return $sections;
			},
			10,
			2
		);

		$css = $this->render_and_collect_css();

		$this->assertStringContainsString( '.hooked-order-hk1-aa{order:3;}', $css );
		$this->assertStringContainsString( 'hk1-aa', $css );
	}

	/**
	 * A builder that replaces the one of the block writes the CSS of the rendered block.
	 *
	 * @return void
	 */
	public function testABuilderReplacedByAFilterBuildsTheRenderedBlock(): void {
		add_filter(
			'kadence_blocks_css_builder_class',
			static function ( string $builder_class, string $block_name ) {
				return 'singlebtn' === $block_name ? Fixture_Builder::class : $builder_class;
			},
			10,
			2
		);

		$css = $this->render_and_collect_css();

		$this->assertStringContainsString( '.fixturehk1-aa{color:blue;}', $css );
	}

	/**
	 * The built action fires for the rendered block, with its name and the saved attributes.
	 *
	 * @return void
	 */
	public function testTheBuiltActionFiresForTheRenderedBlock(): void {
		$seen = [];

		add_action(
			'kadence_blocks_css_built',
			static function ( string $block_name, array $attributes ) use ( &$seen ) {
				$seen[] = [ $block_name, $attributes['text'] ?? null ];
			},
			10,
			2
		);

		$this->render_and_collect_css();

		$this->assertContains( [ 'singlebtn', 'Hooked' ], $seen );
	}
}
