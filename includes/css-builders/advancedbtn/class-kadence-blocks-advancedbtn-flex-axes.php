<?php
/**
 * Advanced Buttons flex axes.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * The CSS properties that move the buttons along the horizontal and the vertical axis, which swap when
 * the buttons stack in a column.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedbtn_Flex_Axes {

	/**
	 * The property that aligns the buttons horizontally.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $horizontal;

	/**
	 * The property that aligns the buttons vertically.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $vertical;

	/**
	 * Create the axes.
	 *
	 * @since TBD
	 *
	 * @param string $horizontal The property that aligns the buttons horizontally.
	 * @param string $vertical   The property that aligns the buttons vertically.
	 */
	public function __construct( $horizontal = 'justify-content', $vertical = 'align-items' ) {
		$this->horizontal = $horizontal;
		$this->vertical   = $vertical;
	}

	/**
	 * The axes after a flex direction was chosen: a column swaps them, a row restores them, anything else
	 * keeps them.
	 *
	 * @since TBD
	 *
	 * @param mixed $orientation The chosen flex direction.
	 *
	 * @return self
	 */
	public function with_orientation( $orientation ) {
		if ( in_array( $orientation, [ 'column', 'column-reverse' ], true ) ) {
			return new self( 'align-items', 'justify-content' );
		}

		if ( in_array( $orientation, [ 'row', 'row-reverse' ], true ) ) {
			return new self( 'justify-content', 'align-items' );
		}

		return $this;
	}

	/**
	 * The property that aligns the buttons horizontally.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function horizontal() {
		return $this->horizontal;
	}

	/**
	 * The property that aligns the buttons vertically.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function vertical() {
		return $this->vertical;
	}

	/**
	 * The value of the horizontal property for an alignment, or null when it is not known. Space between
	 * becomes a centered row when the buttons stack.
	 *
	 * @since TBD
	 *
	 * @param mixed $alignment The chosen alignment.
	 *
	 * @return string|null
	 */
	public function horizontal_value( $alignment ) {
		if ( 'space-between' === $alignment ) {
			return 'align-items' === $this->horizontal ? 'center' : 'space-between';
		}

		return $this->lookup(
			[
				'left'   => 'flex-start',
				'center' => 'center',
				'right'  => 'flex-end',
			],
			$alignment 
		);
	}

	/**
	 * The value of the vertical property for an alignment, or null when it is not known.
	 *
	 * @since TBD
	 *
	 * @param mixed $alignment The chosen alignment.
	 *
	 * @return string|null
	 */
	public function vertical_value( $alignment ) {
		return $this->lookup(
			[
				'top'    => 'flex-start',
				'center' => 'center',
				'bottom' => 'flex-end',
			],
			$alignment 
		);
	}

	/**
	 * Look an alignment up in a table of values.
	 *
	 * @since TBD
	 *
	 * @param string[] $values    The values by alignment.
	 * @param mixed    $alignment The chosen alignment.
	 *
	 * @return string|null
	 */
	private function lookup( $values, $alignment ) {
		if ( ! is_string( $alignment ) ) {
			return null;
		}

		return $values[ $alignment ] ?? null;
	}
}
