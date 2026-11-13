<?php
/**
 * Column flex values.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Turns the saved alignments into flex values.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Flex_Values {

	/**
	 * Flex values for the main axis, by saved alignment. Anything else is centered.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const MAIN = [
		'top'           => 'flex-start',
		'bottom'        => 'flex-end',
		'space-between' => 'space-between',
		'space-around'  => 'space-around',
		'space-evenly'  => 'space-evenly',
		'stretch'       => 'stretch',
	];

	/**
	 * Flex values for the cross axis, by saved alignment. Anything else is centered.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const CROSS = [
		'top'     => 'flex-start',
		'bottom'  => 'flex-end',
		'stretch' => 'stretch',
	];

	/**
	 * Flex values for a text alignment. Anything else is centered.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const TEXT = [
		'left'  => 'flex-start',
		'right' => 'flex-end',
	];

	/**
	 * The flex value of an alignment along the main axis.
	 *
	 * @since TBD
	 *
	 * @param mixed $alignment The saved alignment.
	 *
	 * @return string
	 */
	public function main( $alignment ) {
		return $this->lookup( self::MAIN, $alignment );
	}

	/**
	 * The flex value of an alignment along the cross axis.
	 *
	 * @since TBD
	 *
	 * @param mixed $alignment The saved alignment.
	 *
	 * @return string
	 */
	public function cross( $alignment ) {
		return $this->lookup( self::CROSS, $alignment );
	}

	/**
	 * The flex value of a text alignment.
	 *
	 * @since TBD
	 *
	 * @param mixed $alignment The saved text alignment.
	 *
	 * @return string
	 */
	public function text( $alignment ) {
		return $this->lookup( self::TEXT, $alignment );
	}

	/**
	 * Find an alignment in a table, centering what is not in it.
	 *
	 * @since TBD
	 *
	 * @param array $table     The table.
	 * @param mixed $alignment The saved alignment.
	 *
	 * @return string
	 */
	private function lookup( array $table, $alignment ) {
		if ( ! is_string( $alignment ) ) {
			return 'center';
		}

		return $table[ $alignment ] ?? 'center';
	}
}
