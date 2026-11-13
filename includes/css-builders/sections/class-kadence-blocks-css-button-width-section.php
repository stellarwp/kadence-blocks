<?php
/**
 * Writes the width of a button: the fixed width, or an initial width inside menus.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-css-button-fixed-width-condition.php';
require_once __DIR__ . '/class-kadence-blocks-css-responsive-range-section.php';

/**
 * Writes the width of a button: the fixed width, or an initial width inside menus.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Button_Width_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The selector of a button with a fixed width.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $fixed_selector;

	/**
	 * The selector of a button that is not a fixed width.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $auto_selector;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $fixed_selector The selector of a button with a fixed width, with `{id}` for the button id.
	 * @param string $auto_selector  The selector of a button that is not a fixed width, with `{id}` for the button id.
	 */
	public function __construct( $fixed_selector, $auto_selector ) {
		$this->fixed_selector = $fixed_selector;
		$this->auto_selector  = $auto_selector;
	}

	/**
	 * Write the width.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		( new Kadence_Blocks_Css_Choice_Section(
			new Kadence_Blocks_Css_Button_Fixed_Width_Condition(),
			[
				new Kadence_Blocks_Css_Selector_Section( $this->fixed_selector ),
				new Kadence_Blocks_Css_Responsive_Range_Section( 'width', 'width', 'widthUnit' ),
			],
			[
				new Kadence_Blocks_Css_Selector_Section( $this->auto_selector ),
				new Kadence_Blocks_Css_Static_Section( 'width', 'initial' ),
			]
		) )->write( $input );
	}
}
