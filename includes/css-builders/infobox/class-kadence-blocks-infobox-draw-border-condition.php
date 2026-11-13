<?php
/**
 * Tells whether the media draws its border on hover.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the media draws its border on hover.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Draw_Border_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The animations of an image that draw its border.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const IMAGE_ANIMATIONS = [ 'drawborder', 'grayscale-border-draw' ];

	/**
	 * Whether the hover animation of the media that is shown draws its border.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$media = $input->derived( 'media' );
		$type  = $input->attribute( 'mediaType' );

		return ( ( 'icon' === $type || null === $type ) && 'drawborder' === ( $media->icon()['hoverAnimation'] ?? null ) )
			|| ( 'number' === $type && 'drawborder' === ( $media->number()['hoverAnimation'] ?? null ) )
			|| ( 'image' === $type && in_array( $media->image()['hoverAnimation'] ?? null, self::IMAGE_ANIMATIONS, true ) );
	}
}
