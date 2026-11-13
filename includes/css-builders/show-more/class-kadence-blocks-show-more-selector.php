<?php
/**
 * Show more selectors.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;


/**
 * The selectors of the parts of the show more block. `{id}` stands for the block unique id.
 *
 * @since TBD
 */
final class Kadence_Blocks_Show_More_Selector {

	/**
	 * The selector of the block.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const ROOT = '.kb-block-show-more-container{id}';

	/**
	 * The selector of the block while it is open.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const OPEN = '.kb-block-show-more-container{id}.kb-smc-open';

	/**
	 * The part that selects the buttons of the block.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const BUTTONS = ' > .wp-block-kadence-advancedbtn';

	/**
	 * The part that selects the column of the block.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const COLUMN = ' > .wp-block-kadence-column';

	/**
	 * The block.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	public static function root() {
		return [ self::ROOT ];
	}

	/**
	 * The excerpt for screen readers.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	public static function excerpt() {
		return [ self::ROOT . ' > .kb-show-more-sr-excerpt' ];
	}

	/**
	 * The group of buttons.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	public static function buttons() {
		return [ self::ROOT . self::BUTTONS ];
	}

	/**
	 * The column that holds the content.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	public static function column() {
		return [ self::ROOT . self::COLUMN ];
	}

	/**
	 * The button that closes the content.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	public static function second_button() {
		return self::button_pair( self::ROOT, ':nth-child(2)', 2 );
	}

	/**
	 * The button that opens the content, in a state that is open from the start.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	public static function expanded_first_button() {
		return self::button_pair( self::ROOT, ':first-child', 1 );
	}

	/**
	 * The column while the block is open.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	public static function open_column() {
		return [ self::OPEN . self::COLUMN ];
	}

	/**
	 * The button that opens the content, while the block is open.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	public static function open_first_button() {
		return self::button_pair( self::OPEN, ':nth-child(1)', 1 );
	}

	/**
	 * The button that closes the content, while the block is open.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	public static function open_second_button() {
		return self::button_pair( self::OPEN, ':nth-child(2)', 2 );
	}

	/**
	 * The button that closes the content, while the block is open and the buttons are full width.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	public static function open_full_width_second_button() {
		return [ self::OPEN . self::BUTTONS . '.kt-force-btn-fullwidth .kt-btn-wrap:nth-child(2)' ];
	}

	/**
	 * The selectors of one button, for the button block and for the single button block.
	 *
	 * @since TBD
	 *
	 * @param string $base             The selector of the block.
	 * @param string $wrapper_position The position pseudo-class of the button wrapper.
	 * @param int    $position         The position of the single button among its type.
	 *
	 * @return string[]
	 */
	private static function button_pair( $base, $wrapper_position, $position ) {
		return [
			$base . self::BUTTONS . ' .kt-btn-wrap' . $wrapper_position,
			$base . self::BUTTONS . ' .wp-block-kadence-singlebtn:nth-of-type(' . $position . ')',
		];
	}
}
