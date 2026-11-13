<?php
/**
 * Builds the CSS for the testimonial block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';

/**
 * Builds the CSS for the testimonial block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonial_Css {

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
			$this->context
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
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Strict_Condition( 'media', 'icon' ),
				[
					new Kadence_Blocks_Css_Selector_Section( '.kt-testimonial-item-{id} .kt-svg-testimonial-icon svg' ),
					$this->device_size( 'tablet', 'tabletIsize' ),
					$this->device_size( 'mobile', 'mobileIsize' ),
				],
				[]
			),
		];
	}

	/**
	 * The width and the height of the icon on a device. The attributes of the icon carry the desktop size.
	 *
	 * @since TBD
	 *
	 * @param string $device    The device.
	 * @param string $attribute The attribute that stores the size.
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function device_size( string $device, string $attribute ): Kadence_Blocks_Css_Section {
		return new Kadence_Blocks_Css_Device_Section(
			$device,
			[
				new Kadence_Blocks_Css_Numeric_Unit_Section( 'width', $attribute, 'px' ),
				new Kadence_Blocks_Css_Numeric_Unit_Section( 'height', $attribute, 'px' ),
			]
		);
	}
}
