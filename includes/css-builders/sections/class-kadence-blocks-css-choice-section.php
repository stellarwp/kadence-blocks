<?php
/**
 * Chooses between two sets of sections.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/class-kadence-blocks-css-input-condition.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/class-kadence-blocks-css-selector-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Runs one set of sections when a condition is met and another set when it is not.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Choice_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The condition.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Css_Input_Condition
	 */
	private $condition;

	/**
	 * The sections to run when the condition is met.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Css_Section[]
	 */
	private $then;

	/**
	 * The sections to run when the condition is not met.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Css_Section[]
	 */
	private $otherwise;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Input_Condition $condition The condition.
	 * @param array                              $then      The sections to run when the condition is met.
	 * @param array                              $otherwise The sections to run when it is not.
	 */
	public function __construct( $condition, array $then, array $otherwise ) {
		$this->condition = $condition;
		$this->then      = $then;
		$this->otherwise = $otherwise;
	}

	/**
	 * Run the sections of the matching side.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$sections = $this->condition->is_met( $input ) ? $this->then : $this->otherwise;

		foreach ( $sections as $section ) {
			$section->write( $input );
		}
	}
}
