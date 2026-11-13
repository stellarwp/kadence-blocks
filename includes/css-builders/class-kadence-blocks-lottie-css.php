<?php
/**
 * Builds the CSS for the lottie block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/lottie/loader.php';

/**
 * Builds the CSS for the lottie block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Lottie_Css {

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
		$input = new Kadence_Blocks_Css_Build_Input(
			$attributes,
			$css,
			$unique_id,
			$unique_style_id,
			$this->context,
			[
				'width' => Kadence_Blocks_Lottie_Width::resolve( $attributes ),
			]
		);

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
		return [
			new Kadence_Blocks_Css_Selector_Section( '.kb-lottie-container{id}' ),
			new Kadence_Blocks_Css_Measure_Section( 'margin', 'margin', $this->measure_arguments( 'margin' ) ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'padding', $this->measure_arguments( 'padding' ) ),
			new Kadence_Blocks_Css_Choice_Section( new Kadence_Blocks_Css_Empty_Condition( 'useRatio' ), $this->fixed_sections(), $this->ratio_sections() ),
		];
	}

	/**
	 * The attributes that store a measure on every device.
	 *
	 * @since TBD
	 *
	 * @param string $name The name of the measure: margin or padding.
	 *
	 * @return array<string, string>
	 */
	private function measure_arguments( string $name ): array {
		return [
			'desktop_key' => $name . 'Desktop',
			'tablet_key'  => $name . 'Tablet',
			'mobile_key'  => $name . 'Mobile',
			'unit_key'    => $name . 'Unit',
		];
	}

	/**
	 * The sections of an animation that has the width of its container.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function fixed_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.kb-lottie-container{id} dotlottie-player' ),
			new Kadence_Blocks_Lottie_Max_Width_Css(),
		];
	}

	/**
	 * The sections of an animation that keeps its ratio.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function ratio_sections(): array {
		return [
			new Kadence_Blocks_Lottie_Max_Width_Css(),
			new Kadence_Blocks_Css_Static_Section( 'margin', '0 auto' ),
			new Kadence_Blocks_Css_Selector_Section( '.kb-lottie-container{id} .kb-is-ratio-animation' ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Numeric_Attribute_Condition( 'ratio' ),
				[ new Kadence_Blocks_Css_Suffixed_Section( 'padding-bottom', 'ratio', '%' ) ],
				[ new Kadence_Blocks_Css_Static_Section( 'padding-bottom', '100%' ) ]
			),
		];
	}
}
