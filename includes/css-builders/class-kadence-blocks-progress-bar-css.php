<?php
/**
 * Builds the CSS for the progress bar block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/progress-bar/loader.php';

/**
 * Builds the CSS for the progress bar block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Progress_Bar_Css {

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
		return array_merge(
			$this->container_sections(),
			$this->bar_sections(),
			$this->label_sections(),
			$this->font_sections(),
			[
				new Kadence_Blocks_Css_Choice_Section( new Kadence_Blocks_Progress_Bar_Line_Mask_Condition(), [ new Kadence_Blocks_Progress_Bar_Mask_Bar_Css() ], [] ),
			]
		);
	}

	/**
	 * The sections of the width and the margin of the container.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function container_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.kb-progress-bar-container{id},  .kt-inside-inner-col > .aligncenter.kb-progress-bar-container{id}' ),
			new Kadence_Blocks_Css_Responsive_Size_Section( [ 'containerMaxWidth', 'tabletContainerMaxWidth', 'mobileContainerMaxWidth' ], 'width', 'containerMaxWidthUnits' ),
			new Kadence_Blocks_Css_Selector_Section( '.kb-progress-bar-container{id}' ),
			new Kadence_Blocks_Css_Measure_Section( 'margin', 'margin' ),
		];
	}

	/**
	 * The sections of the border radius of a line bar.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function bar_sections(): array {
		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Progress_Bar_Line_Bar_Condition(),
				[
					new Kadence_Blocks_Css_Selector_Section( '.kb-progress-bar-container{id} svg' ),
					new Kadence_Blocks_Progress_Bar_First_Radius_Css(),
					new Kadence_Blocks_Css_Item_Section( 'progressBorderRadius', 1, [ new Kadence_Blocks_Css_Device_Section( 'tablet', [ new Kadence_Blocks_Progress_Bar_Radius_Css( 1 ) ] ) ] ),
					new Kadence_Blocks_Css_Item_Section( 'progressBorderRadius', 2, [ new Kadence_Blocks_Css_Device_Section( 'mobile', [ new Kadence_Blocks_Progress_Bar_Radius_Css( 2 ) ] ) ] ),
				],
				[]
			),
		];
	}

	/**
	 * The sections of the padding, the alignment and the layout of the label.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function label_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.kb-progress-bar-container{id} .kb-progress-label-wrap' ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'labelPadding' ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Legacy_Condition( [ 'hAlign' ], [], [] ),
				[ new Kadence_Blocks_Progress_Bar_Alignment_Css( 'hAlign' ) ],
				[ new Kadence_Blocks_Css_Static_Section( 'justify-content', 'space-between' ) ]
			),
			new Kadence_Blocks_Css_Choice_Section( new Kadence_Blocks_Progress_Bar_Inside_Line_Condition(), [ new Kadence_Blocks_Css_Static_Section( 'width', '100%' ) ], [] ),
			new Kadence_Blocks_Css_Enabled_Section( 'thAlign', [ new Kadence_Blocks_Css_Device_Section( 'tablet', [ new Kadence_Blocks_Progress_Bar_Alignment_Css( 'thAlign' ) ] ) ] ),
			new Kadence_Blocks_Css_Enabled_Section( 'mhAlign', [ new Kadence_Blocks_Css_Device_Section( 'mobile', [ new Kadence_Blocks_Progress_Bar_Alignment_Css( 'mhAlign' ) ] ) ] ),
			new Kadence_Blocks_Css_Choice_Section( new Kadence_Blocks_Progress_Bar_Label_Column_Condition(), [ new Kadence_Blocks_Css_Static_Section( 'flex-direction', 'column' ) ], [] ),
		];
	}

	/**
	 * The sections of the typography of the label and of the percentage.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function font_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.kb-progress-bar-container{id} .kb-progress-label-wrap .kt-progress-label' ),
			new Kadence_Blocks_Css_Typography_Section( 'labelFont' ),
			new Kadence_Blocks_Css_Selector_Section( '.kb-progress-bar-container{id} .kb-progress-label-wrap .kt-progress-percent' ),
			new Kadence_Blocks_Progress_Bar_Number_Font_Css(),
		];
	}
}
