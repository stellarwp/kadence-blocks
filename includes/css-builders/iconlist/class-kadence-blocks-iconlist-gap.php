<?php
/**
 * Writes a gap of the list, with a value for each device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a gap of the list, with a value for each device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Iconlist_Gap_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The CSS property.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * The attributes that store the gap for desktop, tablet and mobile.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private $names;

	/**
	 * Whether an empty value counts as not set.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $filled;

	/**
	 * The desktop gap when it was not set.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $fallback;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string   $property The CSS property.
	 * @param string[] $names    The attributes that store the gap for desktop, tablet and mobile.
	 * @param bool     $filled   Whether an empty value counts as not set.
	 * @param string   $fallback The desktop gap when it was not set.
	 */
	public function __construct( $property, $names, $filled, $fallback ) {
		$this->property = $property;
		$this->names    = $names;
		$this->filled   = $filled;
		$this->fallback = $fallback;
	}

	/**
	 * Write the gap.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$gap = [
			0 => $this->read( $input, $this->names[0], $this->fallback ),
			1 => $this->read( $input, $this->names[1], '' ),
			2 => $this->read( $input, $this->names[2], '' ),
		];

		$input->css()->render_responsive_range( [ $this->names[0] => $gap ], $this->names[0], $this->property );
	}

	/**
	 * Read the gap of one device.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input    What the section needs to write its CSS.
	 * @param string                         $name     The attribute.
	 * @param string                         $fallback What to use when it was not set.
	 *
	 * @return mixed
	 */
	private function read( Kadence_Blocks_Css_Build_Input $input, $name, $fallback ) {
		$value = $input->attribute( $name );

		if ( $this->filled ) {
			return ! empty( $value ) ? $value : '';
		}

		return $value ?? $fallback;
	}
}
