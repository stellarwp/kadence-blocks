<?php
/**
 * Writes the line height of the tab titles.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the line height of the tab titles.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tabs_Line_Height_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the line height.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute that stores the line height.
	 */
	public function __construct( $attribute ) {
		$this->attribute = $attribute;
	}

	/**
	 * Write the line height.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$height = $input->attribute( $this->attribute );

		if ( null === $height ) {
			return;
		}

		$input->css()->add_property( 'line-height', $height . $input->attribute( 'lineType', 'px' ) );
	}
}
