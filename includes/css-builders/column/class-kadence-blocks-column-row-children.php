<?php
/**
 * Removes the vertical margins of the content of a column that flows from left to right and lets ratio images grow.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Removes the vertical margins of the content of a column that flows from left to right and lets ratio
 * images grow.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Row_Children_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The media state to write in.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $media;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $media The media state to write in.
	 */
	public function __construct( $media ) {
		$this->media = $media;
	}

	/**
	 * Write the margins.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css = $input->css();

		$css->set_media_state( $this->media );
		Kadence_Blocks_Column_Selector::set( $input, 'plain_children' );
		$css->add_property( 'margin-top', '0px' );
		$css->add_property( 'margin-bottom', '0px' );
		Kadence_Blocks_Column_Selector::set( $input, 'ratio' );
		$css->add_property( 'flex-grow', 1 );
	}
}
