<?php
/**
 * Writes one declaration per box side.
 *
 * @package Kadence Blocks
 */

/**
 * Writes `top`, `right`, `bottom` and `left` declarations from a four-value list.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Sides {

	/**
	 * The box sides, in the order the attribute list stores them.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private const SIDES = [ 'top', 'right', 'bottom', 'left' ];

	/**
	 * The CSS property the sides belong to, such as `padding`.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * Decides whether a side is written.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Css_Condition
	 */
	private $condition;

	/**
	 * Text added after the side in the property name, such as `-width` for `border-top-width`.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $suffix;

	/**
	 * Create the writer.
	 *
	 * @since TBD
	 *
	 * @param string                       $property  The CSS property the sides belong to.
	 * @param Kadence_Blocks_Css_Condition $condition Decides whether a side is written.
	 * @param string                       $suffix    Text added after the side in the property name.
	 */
	public function __construct( string $property, Kadence_Blocks_Css_Condition $condition, string $suffix = '' ) {
		$this->property  = $property;
		$this->condition = $condition;
		$this->suffix    = $suffix;
	}

	/**
	 * Write each side that passes the condition.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css    The CSS builder.
	 * @param mixed                                     $values The four stored side values, or anything else when unset.
	 * @param mixed                                     $unit   The unit appended to every side, concatenated as stored.
	 *
	 * @return void
	 */
	public function write( $css, $values, $unit ): void {
		$format = new Kadence_Blocks_Css_Unit_Format( $unit );

		foreach ( self::SIDES as $index => $side ) {
			$declaration = new Kadence_Blocks_Css_Declaration( $this->property . '-' . $side . $this->suffix, $this->condition, $format );
			$declaration->write( $css, $values[ $index ] ?? null );
		}
	}
}
