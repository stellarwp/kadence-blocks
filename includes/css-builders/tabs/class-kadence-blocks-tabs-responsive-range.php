<?php
/**
 * Writes a value that has one setting for every device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a value that has one setting for every device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tabs_Responsive_Range_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The CSS property.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * The name the settings are grouped by.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $name;

	/**
	 * The attributes that store the setting of desktop, tablet and mobile.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private $attributes;

	/**
	 * The setting of every device when the editor saved none.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private $fallbacks;

	/**
	 * The unit of the settings, or empty for the one the editor saved.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $unit;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $property   The CSS property.
	 * @param string $name       The name the settings are grouped by.
	 * @param array  $attributes The attributes that store the setting of desktop, tablet and mobile.
	 * @param array  $fallbacks  The setting of every device when the editor saved none.
	 * @param string $unit       The unit of the settings, or empty for the one the editor saved.
	 */
	public function __construct( $property, $name, array $attributes, array $fallbacks, $unit ) {
		$this->property   = $property;
		$this->name       = $name;
		$this->attributes = $attributes;
		$this->fallbacks  = $fallbacks;
		$this->unit       = $unit;
	}

	/**
	 * Write the value.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$settings = [];

		foreach ( $this->attributes as $index => $attribute ) {
			$settings[] = $input->attribute( $attribute, $this->fallbacks[ $index ] );
		}

		$input->css()->render_responsive_range( [ $this->name => $settings ], $this->name, $this->property, $this->unit );
	}
}
