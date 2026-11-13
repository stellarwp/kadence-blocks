<?php
/**
 * Facts about the background of the row.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Facts about the background of the row.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Background_Facts {

	/**
	 * What the section needs to write its CSS.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Css_Build_Input
	 */
	private $input;

	/**
	 * Create the facts.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 */
	public function __construct( Kadence_Blocks_Css_Build_Input $input ) {
		$this->input = $input;
	}

	/**
	 * The type of background the editor chose, normal unless saved otherwise.
	 *
	 * @since TBD
	 *
	 * @return mixed
	 */
	public function type() {
		$type = $this->input->attribute( 'backgroundSettingTab' );

		return ! empty( $type ) ? $type : 'normal';
	}

	/**
	 * Whether the background is written inline, which asks for important rules.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function is_inline(): bool {
		return true === $this->input->attribute( 'backgroundInline' );
	}

	/**
	 * Whether the row has an image that moves with a parallax effect.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function has_parallax_image(): bool {
		return ! empty( $this->input->attribute( 'bgImg' ) ) && 'parallax' === $this->input->attribute( 'bgImgAttachment' );
	}

	/**
	 * Whether the normal background of the row is a parallax image.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function has_main_parallax(): bool {
		return 'normal' === $this->type() && $this->has_parallax_image();
	}

	/**
	 * Whether the tablet background is a parallax image.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function has_tablet_parallax(): bool {
		$tablet = $this->tablet();

		return ! empty( $tablet['bgImg'] ) && 'parallax' === ( $tablet['bgImgAttachment'] ?? null );
	}

	/**
	 * The background of tablet.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public function tablet(): array {
		return $this->responsive( 'tabletBackground' );
	}

	/**
	 * The background of mobile.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public function mobile(): array {
		return $this->responsive( 'mobileBackground' );
	}

	/**
	 * The background saved for a device.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute that stores it.
	 *
	 * @return array
	 */
	private function responsive( $attribute ): array {
		$background = $this->input->item( $attribute, 0 );

		return is_array( $background ) ? $background : [];
	}
}
