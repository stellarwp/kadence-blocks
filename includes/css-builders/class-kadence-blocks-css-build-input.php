<?php
/**
 * Everything a CSS section needs to write its rules.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/class-kadence-blocks-css-block-context.php';

/**
 * An immutable bundle of the block attributes, the CSS builder, the ids and the values derived while building.
 *
 * Sections never change the input. A section that works out a value later sections need, such as the base
 * selector, returns a new input from `with()`.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Build_Input {

	/**
	 * The block attributes.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private $attributes;

	/**
	 * The CSS builder, `Kadence_Blocks_CSS` or `Kadence_Blocks_Pro_CSS`.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS
	 */
	private $css;

	/**
	 * The block unique id.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $unique_id;

	/**
	 * The unique id used for the style handle.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $unique_style_id;

	/**
	 * What the builder needs from the block.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Css_Block_Context
	 */
	private $context;

	/**
	 * Values derived while building, by name.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private $derived;

	/**
	 * Create the input.
	 *
	 * @since TBD
	 *
	 * @param array                                     $attributes      The block attributes.
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css             The CSS builder.
	 * @param string                                    $unique_id       The block unique id.
	 * @param string                                    $unique_style_id The unique id used for the style handle.
	 * @param Kadence_Blocks_Css_Block_Context          $context         What the builder needs from the block.
	 * @param array                                     $derived         Values derived while building, by name.
	 */
	public function __construct( $attributes, $css, $unique_id, $unique_style_id, Kadence_Blocks_Css_Block_Context $context, array $derived = [] ) {
		$this->attributes      = $attributes;
		$this->css             = $css;
		$this->unique_id       = $unique_id;
		$this->unique_style_id = $unique_style_id;
		$this->context         = $context;
		$this->derived         = $derived;
	}

	/**
	 * The block attributes.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public function attributes() {
		return $this->attributes;
	}

	/**
	 * One block attribute, or the default when it is not set.
	 *
	 * @since TBD
	 *
	 * @param string $name    The attribute name.
	 * @param mixed  $fallback The value returned when the attribute is not set.
	 *
	 * @return mixed
	 */
	public function attribute( $name, $fallback = null ) {
		return $this->attributes[ $name ] ?? $fallback;
	}

	/**
	 * One entry of a block attribute that stores a list, or the default when it is not set.
	 *
	 * @since TBD
	 *
	 * @param string $name     The attribute name.
	 * @param int    $index    The position in the list.
	 * @param mixed  $fallback The value returned when the entry is not set.
	 *
	 * @return mixed
	 */
	public function item( $name, $index, $fallback = null ) {
		return $this->attributes[ $name ][ $index ] ?? $fallback;
	}

	/**
	 * The CSS builder.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS
	 */
	public function css() {
		return $this->css;
	}

	/**
	 * The block unique id.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function unique_id() {
		return $this->unique_id;
	}

	/**
	 * The unique id used for the style handle.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function unique_style_id() {
		return $this->unique_style_id;
	}

	/**
	 * What the builder needs from the block.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Block_Context
	 */
	public function context() {
		return $this->context;
	}

	/**
	 * A value derived while building, or the default when it was not derived.
	 *
	 * @since TBD
	 *
	 * @param string $name    The derived value name.
	 * @param mixed  $fallback The value returned when nothing was derived under that name.
	 *
	 * @return mixed
	 */
	public function derived( $name, $fallback = null ) {
		return $this->derived[ $name ] ?? $fallback;
	}

	/**
	 * A copy of this input with one more derived value.
	 *
	 * @since TBD
	 *
	 * @param string $name  The derived value name.
	 * @param mixed  $value The derived value.
	 *
	 * @return self
	 */
	public function with( $name, $value ) {
		$derived          = $this->derived;
		$derived[ $name ] = $value;

		return new self( $this->attributes, $this->css, $this->unique_id, $this->unique_style_id, $this->context, $derived );
	}

	/**
	 * A copy of this input that works on other attributes, such as the ones nested in one of the block attributes.
	 *
	 * @since TBD
	 *
	 * @param array $attributes The attributes the copy works on.
	 *
	 * @return self
	 */
	public function with_attributes( array $attributes ) {
		return new self( $attributes, $this->css, $this->unique_id, $this->unique_style_id, $this->context, $this->derived );
	}
}
