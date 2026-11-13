<?php
/**
 * One conditional CSS declaration.
 *
 * @package Kadence Blocks
 */

/**
 * A single CSS property that is written only when its condition passes.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Declaration {

	/**
	 * The CSS property name.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * Decides whether the declaration is written.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Css_Condition
	 */
	private $condition;

	/**
	 * Turns the attribute value into the CSS value.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Css_Value_Format
	 */
	private $format;

	/**
	 * Create the declaration.
	 *
	 * @since TBD
	 *
	 * @param string                          $property  The CSS property name.
	 * @param Kadence_Blocks_Css_Condition    $condition Decides whether the declaration is written.
	 * @param Kadence_Blocks_Css_Value_Format $format    Turns the attribute value into the CSS value.
	 */
	public function __construct( string $property, Kadence_Blocks_Css_Condition $condition, Kadence_Blocks_Css_Value_Format $format ) {
		$this->property  = $property;
		$this->condition = $condition;
		$this->format    = $format;
	}

	/**
	 * Write the declaration to the current selector when the condition passes.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css   The CSS builder.
	 * @param mixed                                     $value The raw attribute value, null when it was never set.
	 *
	 * @return void
	 */
	public function write( $css, $value ): void {
		if ( ! $this->condition->is_met( $value ) ) {
			return;
		}

		$css->add_property( $this->property, $this->format->format( $value ) );
	}
}
