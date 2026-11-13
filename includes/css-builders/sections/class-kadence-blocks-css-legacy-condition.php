<?php
/**
 * Tells whether a column still uses the old attributes of a setting.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/class-kadence-blocks-css-input-condition.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether a column still uses the old attributes of a setting.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Legacy_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The attributes that only need to be filled.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private $filled;

	/**
	 * The attributes that need to be numbers.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private $numbers;

	/**
	 * The attributes that store four numbers, one for every side.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private $lists;

	/**
	 * Create the condition.
	 *
	 * @since TBD
	 *
	 * @param array $filled  The attributes that only need to be filled.
	 * @param array $numbers The attributes that need to be numbers.
	 * @param array $lists   The attributes that store four numbers, one for every side.
	 */
	public function __construct( array $filled, array $numbers, array $lists ) {
		$this->filled  = $filled;
		$this->numbers = $numbers;
		$this->lists   = $lists;
	}

	/**
	 * The condition for a setting that was saved as one attribute for every side and device.
	 *
	 * @since TBD
	 *
	 * @param string   $property The CSS property, such as padding.
	 * @param string[] $sides    The sides.
	 *
	 * @return self
	 */
	public static function sides( $property, array $sides = [ 'top', 'bottom', 'left', 'right' ] ) {
		$numbers = [];

		foreach ( $sides as $side ) {
			foreach ( [ '', 'T', 'M' ] as $suffix ) {
				$numbers[] = $side . ucfirst( $property ) . $suffix;
			}
		}

		return new self( [], $numbers, [] );
	}

	/**
	 * Whether any of the old attributes was saved.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		return $this->any_filled( $input ) || $this->any_number( $input ) || $this->any_list( $input );
	}

	/**
	 * Whether any of the attributes that need to be filled is.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	private function any_filled( Kadence_Blocks_Css_Build_Input $input ): bool {
		foreach ( $this->filled as $attribute ) {
			if ( ! empty( $input->attribute( $attribute ) ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Whether any of the attributes that need to be numbers is.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	private function any_number( Kadence_Blocks_Css_Build_Input $input ): bool {
		foreach ( $this->numbers as $attribute ) {
			if ( is_numeric( $input->attribute( $attribute ) ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Whether any side of any of the lists is a number.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	private function any_list( Kadence_Blocks_Css_Build_Input $input ): bool {
		foreach ( $this->lists as $attribute ) {
			if ( $this->any_side( $input, $attribute ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Whether any side of a list is a number.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input     What the section needs to write its CSS.
	 * @param string                         $attribute The attribute that stores the list.
	 *
	 * @return bool
	 */
	private function any_side( Kadence_Blocks_Css_Build_Input $input, $attribute ): bool {
		foreach ( [ 0, 1, 2, 3 ] as $side ) {
			if ( is_numeric( $input->item( $attribute, $side ) ) ) {
				return true;
			}
		}

		return false;
	}
}
