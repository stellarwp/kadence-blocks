<?php
/**
 * Writes a measure of the form, such as a padding or a margin.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes a measure of the form, such as a padding or a margin.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advanced_Form_Measure_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The settings group the measure is saved in, or nothing for the form itself.
	 *
	 * @since TBD
	 *
	 * @var string|null
	 */
	private $group;

	/**
	 * The attribute that stores the measure.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $name;

	/**
	 * The CSS property.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * The arguments of the measure writer.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private $args;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string|null $group    The settings group the measure is saved in, or nothing for the form itself.
	 * @param string      $name     The attribute that stores the measure.
	 * @param string      $property The CSS property.
	 * @param array       $args     The arguments of the measure writer.
	 */
	public function __construct( $group, $name, $property, $args ) {
		$this->group    = $group;
		$this->name     = $name;
		$this->property = $property;
		$this->args     = $args;
	}

	/**
	 * Write the measure.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$settings = $input->derived( 'settings' );

		$input->css()->render_measure_output( $settings->group( $this->group ), $this->name, $this->property, $this->args );
	}
}
