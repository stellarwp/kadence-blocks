<?php
/**
 * Writes the sides of a setting that is saved as a list, one number for every side.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the sides of a setting that is saved as a list, one number for every side.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Side_List_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The sides, in the order they are saved.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const SIDES = [ 'top', 'right', 'bottom', 'left' ];

	/**
	 * The attribute that stores the sides.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $key;

	/**
	 * The property, with `%s` for the side.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $template;

	/**
	 * The attribute that stores the unit, or null when the sides are always in pixels.
	 *
	 * @since TBD
	 *
	 * @var string|null
	 */
	private $unit;

	/**
	 * Whether a unit that is empty counts as pixels, or only a unit that was never saved.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $by_empty;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string      $key      The attribute that stores the sides.
	 * @param string      $template The property, with `%s` for the side.
	 * @param string|null $unit    The attribute that stores the unit, or null when the sides are always in pixels.
	 * @param bool        $by_empty Whether a unit that is empty counts as pixels, or only a unit that was never saved.
	 */
	public function __construct( $key, $template, $unit = null, $by_empty = false ) {
		$this->key      = $key;
		$this->template = $template;
		$this->unit     = $unit;
		$this->by_empty = $by_empty;
	}

	/**
	 * Write the sides.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( ! is_array( $input->attribute( $this->key ) ) ) {
			return;
		}

		$unit = $this->unit( $input );

		foreach ( self::SIDES as $index => $side ) {
			$value = $input->item( $this->key, $index );

			if ( is_numeric( $value ) ) {
				$input->css()->add_property( sprintf( $this->template, $side ), $value . $unit );
			}
		}
	}

	/**
	 * The unit of the sides.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return string
	 */
	private function unit( Kadence_Blocks_Css_Build_Input $input ) {
		if ( null === $this->unit ) {
			return 'px';
		}

		return $this->by_empty ? ( $input->attribute( $this->unit ) ?: 'px' ) : $input->attribute( $this->unit, 'px' );
	}
}
