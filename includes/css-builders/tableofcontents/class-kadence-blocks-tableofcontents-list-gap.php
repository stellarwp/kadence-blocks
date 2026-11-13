<?php
/**
 * Writes the gap between the entries of the list.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';

/**
 * Writes the gap under an entry and above its sub list for one device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tableofcontents_List_Gap implements Kadence_Blocks_Css_Section {

	/**
	 * The position of the device in the list.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $index;

	/**
	 * Whether only a saved list can hold the gap.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $list_only;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param int  $index     The position of the device in the list: 0 desktop, 1 tablet, 2 mobile.
	 * @param bool $list_only Whether only a saved list can hold the gap.
	 */
	public function __construct( int $index, bool $list_only ) {
		$this->index     = $index;
		$this->list_only = $list_only;
	}

	/**
	 * Write the gap.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$gap = $input->attribute( 'listGap' );

		if ( $this->list_only && ! is_array( $gap ) ) {
			return;
		}

		$size = $input->item( 'listGap', $this->index );

		if ( empty( $size ) ) {
			return;
		}

		$css = $input->css();
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $input->unique_id() . ' .kb-table-of-content-list li' );
		$css->add_property( 'margin-bottom', $css->render_string( $size, 'px' ) );
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $input->unique_id() . ' .kb-table-of-content-list li .kb-table-of-contents-list-sub' );
		$css->add_property( 'margin-top', $css->render_string( $size, 'px' ) );
	}
}
