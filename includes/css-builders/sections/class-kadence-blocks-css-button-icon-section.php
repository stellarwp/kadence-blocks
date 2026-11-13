<?php
/**
 * Writes the icon of a button: its color, padding and size, and its color on hover.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the icon of a button: its color, padding and size, and its color on hover.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Button_Icon_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The selector of the icon.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SELECTOR = '.kb-btn{id}.kb-button .kb-svg-icon-wrap';

	/**
	 * The selector of the icon on hover and focus.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const HOVER_SELECTOR = '.kb-btn{id}.kb-button:hover .kb-svg-icon-wrap, .kb-btn{id}.kb-button:focus .kb-svg-icon-wrap';

	/**
	 * The CSS properties that get the icon size.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private $size_properties;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param array $size_properties The CSS properties that get the icon size.
	 */
	public function __construct( array $size_properties ) {
		$this->size_properties = $size_properties;
	}

	/**
	 * Write the icon rules.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		foreach ( $this->sections() as $section ) {
			$section->write( $input );
		}
	}

	/**
	 * The sections of the icon, in the order they are written.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	private function sections(): array {
		$sections = [
			new Kadence_Blocks_Css_Selector_Section( self::SELECTOR ),
			new Kadence_Blocks_Css_Color_Section( 'color', 'iconColor' ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'iconPadding', [ 'unit_key' => 'iconPaddingUnit' ] ),
		];

		foreach ( $this->size_properties as $property ) {
			$sections[] = new Kadence_Blocks_Css_Responsive_Range_Section( 'iconSize', $property, 'iconSizeUnit' );
		}

		$sections[] = new Kadence_Blocks_Css_Selector_Section( self::HOVER_SELECTOR );
		$sections[] = new Kadence_Blocks_Css_Color_Section( 'color', 'iconColorHover' );

		return $sections;
	}
}
