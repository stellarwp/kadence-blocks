<?php
/**
 * Facade the build_css methods use to write conditional declarations.
 *
 * @package Kadence Blocks
 */

/**
 * Short, readable entry points for the declarations `build_css()` methods repeat most.
 *
 * Each method hands the work to a small single-purpose class; this class only picks which.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Writer {

	/**
	 * The CSS builder every declaration is written to.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS
	 */
	private $css;

	/**
	 * Create the writer.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css The CSS builder every declaration is written to.
	 */
	public function __construct( $css ) {
		$this->css = $css;
	}

	/**
	 * Write the value as is when it is not empty.
	 *
	 * @since TBD
	 *
	 * @param string $property The CSS property.
	 * @param mixed  $value    The raw attribute value.
	 *
	 * @return void
	 */
	public function not_empty( string $property, $value ): void {
		$this->write( $property, $value, new Kadence_Blocks_Css_Not_Empty_Condition(), new Kadence_Blocks_Css_Raw_Format() );
	}

	/**
	 * Write the value with a unit appended when it is not empty.
	 *
	 * @since TBD
	 *
	 * @param string $property The CSS property.
	 * @param mixed  $value    The raw attribute value.
	 * @param mixed  $unit     The unit to append, concatenated as stored.
	 *
	 * @return void
	 */
	public function not_empty_with_unit( string $property, $value, $unit ): void {
		$this->write( $property, $value, new Kadence_Blocks_Css_Not_Empty_Condition(), new Kadence_Blocks_Css_Unit_Format( $unit ) );
	}

	/**
	 * Write the value rendered as a color when it is not empty.
	 *
	 * @since TBD
	 *
	 * @param string $property The CSS property.
	 * @param mixed  $value    The raw attribute value.
	 *
	 * @return void
	 */
	public function not_empty_color( string $property, $value ): void {
		$this->write( $property, $value, new Kadence_Blocks_Css_Not_Empty_Condition(), new Kadence_Blocks_Css_Color_Format( $this->css ) );
	}

	/**
	 * Write the value rendered as a string when it is not empty.
	 *
	 * @since TBD
	 *
	 * @param string $property The CSS property.
	 * @param mixed  $value    The raw attribute value.
	 *
	 * @return void
	 */
	public function not_empty_string( string $property, $value ): void {
		$this->write( $property, $value, new Kadence_Blocks_Css_Not_Empty_Condition(), new Kadence_Blocks_Css_String_Format( $this->css ) );
	}

	/**
	 * Write the value rendered as a font weight when it is not empty.
	 *
	 * @since TBD
	 *
	 * @param string $property The CSS property.
	 * @param mixed  $value    The raw attribute value.
	 *
	 * @return void
	 */
	public function not_empty_font_weight( string $property, $value ): void {
		$this->write( $property, $value, new Kadence_Blocks_Css_Not_Empty_Condition(), new Kadence_Blocks_Css_Font_Weight_Format( $this->css ) );
	}

	/**
	 * Write the value sanitized as a color when it is not empty.
	 *
	 * @since TBD
	 *
	 * @param string $property The CSS property.
	 * @param mixed  $value    The raw attribute value.
	 *
	 * @return void
	 */
	public function not_empty_sanitized_color( string $property, $value ): void {
		$this->write( $property, $value, new Kadence_Blocks_Css_Not_Empty_Condition(), new Kadence_Blocks_Css_Sanitized_Color_Format( $this->css ) );
	}

	/**
	 * Write a color with its opacity when the color is not empty.
	 *
	 * @since TBD
	 *
	 * @param string $property The CSS property.
	 * @param mixed  $color    The raw color attribute.
	 * @param mixed  $opacity  The raw opacity attribute, full opacity when it is not numeric.
	 *
	 * @return void
	 */
	public function color_with_opacity( string $property, $color, $opacity ): void {
		$declaration = new Kadence_Blocks_Css_Color_Opacity_Declaration( $property );
		$declaration->write( $this->css, $color, $opacity );
	}

	/**
	 * Write the value with a unit appended when it is numeric, zero included.
	 *
	 * @since TBD
	 *
	 * @param string $property The CSS property.
	 * @param mixed  $value    The raw attribute value.
	 * @param mixed  $unit     The unit to append, concatenated as stored.
	 *
	 * @return void
	 */
	public function numeric_with_unit( string $property, $value, $unit ): void {
		$this->write( $property, $value, new Kadence_Blocks_Css_Numeric_Condition(), new Kadence_Blocks_Css_Unit_Format( $unit ) );
	}

	/**
	 * Write each numeric side of a four-value list, such as padding or margin.
	 *
	 * @since TBD
	 *
	 * @param string $property The CSS property the sides belong to.
	 * @param mixed  $values   The four stored side values.
	 * @param mixed  $unit     The unit appended to every side, concatenated as stored.
	 * @param string $suffix   Text added after the side in the property name, such as `-width`.
	 *
	 * @return void
	 */
	public function numeric_sides( string $property, $values, $unit, string $suffix = '' ): void {
		$sides = new Kadence_Blocks_Css_Sides( $property, new Kadence_Blocks_Css_Numeric_Condition(), $suffix );
		$sides->write( $this->css, $values, $unit );
	}

	/**
	 * Hand one declaration to its class.
	 *
	 * @since TBD
	 *
	 * @param string                          $property  The CSS property.
	 * @param mixed                           $value     The raw attribute value.
	 * @param Kadence_Blocks_Css_Condition    $condition Decides whether the declaration is written.
	 * @param Kadence_Blocks_Css_Value_Format $format    Turns the attribute value into the CSS value.
	 *
	 * @return void
	 */
	private function write( string $property, $value, Kadence_Blocks_Css_Condition $condition, Kadence_Blocks_Css_Value_Format $format ): void {
		$declaration = new Kadence_Blocks_Css_Declaration( $property, $condition, $format );
		$declaration->write( $this->css, $value );
	}
}
