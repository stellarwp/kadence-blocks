<?php
/**
 * Infobox media.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * The settings of the media of the info box: its icon, its style, its image and its number.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Media {

	/**
	 * The attribute that stores the settings, by name.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const ATTRIBUTES = [
		'icon'   => 'mediaIcon',
		'style'  => 'mediaStyle',
		'image'  => 'mediaImage',
		'number' => 'mediaNumber',
	];

	/**
	 * The settings, by name.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private $settings;

	/**
	 * Create the settings.
	 *
	 * @since TBD
	 *
	 * @param array $attributes The block attributes.
	 */
	public function __construct( array $attributes ) {
		$this->settings = [];

		foreach ( self::ATTRIBUTES as $name => $attribute ) {
			$saved                   = $attributes[ $attribute ][0] ?? null;
			$this->settings[ $name ] = is_array( $saved ) ? $saved : [];
		}
	}

	/**
	 * The settings of the icon.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public function icon(): array {
		return $this->settings['icon'];
	}

	/**
	 * The settings of the style.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public function style(): array {
		return $this->settings['style'];
	}

	/**
	 * The settings of the image.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public function image(): array {
		return $this->settings['image'];
	}

	/**
	 * The settings of the number.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public function number(): array {
		return $this->settings['number'];
	}
}
