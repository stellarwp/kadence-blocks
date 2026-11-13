<?php
/**
 * Builds the CSS for the posts block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/posts/loader.php';

/**
 * Builds the CSS for the posts block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Posts_Css {

	/**
	 * The selector of the title of a post.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const TITLE = '.kb-posts-id-{id} .entry.loop-entry .entry-header .entry-title';

	/**
	 * What this builder needs from the block.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Css_Block_Context
	 */
	private $context;

	/**
	 * Create the builder.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Block_Context $context What this builder needs from the block.
	 */
	public function __construct( Kadence_Blocks_Css_Block_Context $context ) {
		$this->context = $context;
	}

	/**
	 * Build the block CSS.
	 *
	 * @since TBD
	 *
	 * @param array                                     $attributes      The block attributes.
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css             The CSS builder.
	 * @param string                                    $unique_id       The block unique id.
	 * @param string                                    $unique_style_id The unique id used for the style handle.
	 *
	 * @return string|null
	 */
	public function build( $attributes, $css, $unique_id, $unique_style_id ) {
		$input = new Kadence_Blocks_Css_Build_Input( $attributes, $css, $unique_id, $unique_style_id, $this->context );

		$css->set_style_id( 'kb-' . $this->context->block_name() . $unique_style_id );

		foreach ( $this->sections() as $section ) {
			$section->write( $input );
		}

		return $css->css_output();
	}

	/**
	 * The sections of the block CSS, in the order they are written.
	 *
	 * The sections share one CSS builder, its current selector and its media state, so their order matters.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function sections(): array {
		$environment = new Kadence_Blocks_Posts_Site_Environment();

		return [
			new Kadence_Blocks_Css_Selector_Section( self::TITLE ),
			new Kadence_Blocks_Css_Scoped_Section( 'titleFont', $this->title_sections( 0, true ) ),
			$this->loop_style_section( $environment ),
			new Kadence_Blocks_Css_Device_Section( 'tablet', [ new Kadence_Blocks_Css_Selector_Section( self::TITLE ), new Kadence_Blocks_Css_Scoped_Section( 'titleFont', $this->title_sections( 1, false ) ) ] ),
			new Kadence_Blocks_Css_Device_Section( 'mobile', [ new Kadence_Blocks_Css_Selector_Section( self::TITLE ), new Kadence_Blocks_Css_Scoped_Section( 'titleFont', $this->title_sections( 2, false ) ) ] ),
			new Kadence_Blocks_Css_Selector_Section( '.kb-posts-id-{id} .kb-post-list-item' ),
			new Kadence_Blocks_Css_Static_Section( 'display', 'grid' ),
		];
	}

	/**
	 * The sections of the font of the title for one device.
	 *
	 * @since TBD
	 *
	 * @param int  $index          The position of the device.
	 * @param bool $with_transform Whether the text transform is written too.
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function title_sections( int $index, bool $with_transform ): array {
		$sections = [
			new Kadence_Blocks_Posts_Title_Font_Size_Css( $index ),
			new Kadence_Blocks_Posts_Title_Line_Height_Css( $index ),
			new Kadence_Blocks_Posts_Title_Letter_Spacing_Css( $index ),
		];

		if ( $with_transform ) {
			$sections[] = new Kadence_Blocks_Css_Value_Section( 'text-transform', 'textTransform' );
		}

		return $sections;
	}

	/**
	 * The section of the look of the loop: unboxed, or the padding of the older Kadence themes.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Posts_Environment $environment What the site offers.
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function loop_style_section( Kadence_Blocks_Posts_Environment $environment ): Kadence_Blocks_Css_Section {
		return new Kadence_Blocks_Css_Choice_Section(
			new Kadence_Blocks_Css_Strict_Condition( 'loopStyle', 'unboxed' ),
			[ new Kadence_Blocks_Css_Choice_Section( new Kadence_Blocks_Posts_Theme_Condition( $environment ), $this->unboxed_sections(), [] ) ],
			[
				new Kadence_Blocks_Css_Choice_Section(
					new Kadence_Blocks_Posts_Old_Theme_Condition( $environment ),
					[
						new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-posts.kb-posts-id-{id} .entry.loop-entry > .entry-content-wrap' ),
						new Kadence_Blocks_Css_Static_Section( 'padding', '2rem' ),
					],
					[]
				),
			]
		);
	}

	/**
	 * The sections that strip the box of an unboxed loop.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function unboxed_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.kb-posts-id-{id} .loop-entry' ),
			new Kadence_Blocks_Css_Static_Section( 'background', 'transparent' ),
			new Kadence_Blocks_Css_Static_Section( 'box-shadow', 'none' ),
			new Kadence_Blocks_Css_Selector_Section( '.kb-posts-id-{id} .loop-entry > .entry-content-wrap' ),
			new Kadence_Blocks_Css_Static_Section( 'padding', '0px' ),
			new Kadence_Blocks_Css_Selector_Section( '.kb-posts-id-{id} .loop-entry .post-thumbnail' ),
			new Kadence_Blocks_Css_Static_Section( 'margin-bottom', '1em' ),
		];
	}
}
