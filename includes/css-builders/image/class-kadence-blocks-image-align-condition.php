<?php
/**
 * Whether the image is aligned to one of a list of alignments, or to none of them.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Whether the image is aligned to one of a list of alignments, or to none of them.
 *
 * @since TBD
 */
final class Kadence_Blocks_Image_Align_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The alignments.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private $aligns;

	/**
	 * Whether the image has to be aligned to one of them.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $expected;

	/**
	 * Create the condition.
	 *
	 * @since TBD
	 *
	 * @param string[] $aligns The alignments.
	 * @param bool     $expected Whether the image has to be aligned to one of them.
	 */
	public function __construct( array $aligns, bool $expected ) {
		$this->aligns   = $aligns;
		$this->expected = $expected;
	}

	/**
	 * Whether the alignment of the image is, or is not, in the list.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$align = $input->attribute( 'align' );
		$found = ! empty( $align ) && in_array( $align, $this->aligns, true );

		return $found === $this->expected;
	}
}
