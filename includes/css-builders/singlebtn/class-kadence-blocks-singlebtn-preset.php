<?php
/**
 * Writes what a block preset gives the button, through the block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes what a block preset gives the button, through the block.
 *
 * @since TBD
 */
final class Kadence_Blocks_Singlebtn_Preset_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The block method that writes the preset.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $member;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $member The block method that writes the preset.
	 */
	public function __construct( $member ) {
		$this->member = $member;
	}

	/**
	 * Write the preset.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$input->context()->call( $this->member, $input->css(), $input->attributes() );
	}
}
