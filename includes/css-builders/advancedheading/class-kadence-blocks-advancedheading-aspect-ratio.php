<?php
/**
 * Writes the aspect ratio of the inline image.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the aspect ratio of the inline image.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedheading_Aspect_Ratio_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The aspect ratio of every ratio name.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const RATIOS = [
		'land43'  => '4 / 3',
		'land32'  => '3 / 2',
		'land169' => '16 / 9',
		'land21'  => '2 / 1',
		'land31'  => '3 / 1',
		'land41'  => '4 / 1',
		'port34'  => '3 / 4',
		'port23'  => '2 / 3',
		'port916' => '9 / 16',
		'square'  => '1 / 1',
	];

	/**
	 * Write the aspect ratio.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$ratio = $input->attribute( 'ratio' );

		if ( empty( $input->attribute( 'useRatio' ) ) || empty( $ratio ) ) {
			return;
		}

		$aspect_ratio = $this->aspect_ratio( $ratio );

		if ( empty( $aspect_ratio ) ) {
			return;
		}

		$input->css()->add_property( 'aspect-ratio', $aspect_ratio );
		$input->css()->add_property( 'object-fit', 'cover' );
	}

	/**
	 * The aspect ratio of a ratio name. The first name the value loosely equals wins, like a switch would
	 * pick it.
	 *
	 * @since TBD
	 *
	 * @param mixed $ratio The saved ratio.
	 *
	 * @return string
	 */
	private function aspect_ratio( $ratio ): string {
		foreach ( self::RATIOS as $name => $aspect_ratio ) {
			// phpcs:ignore Universal.Operators.StrictComparisons.LooseEqual
			if ( $ratio == $name ) {
				return $aspect_ratio;
			}
		}

		return '';
	}
}
