<?php
/**
 * Whether a border still stores the legacy widths, that are not responsive.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/../class-kadence-blocks-css-build-input.php';
require_once __DIR__ . '/class-kadence-blocks-css-input-condition.php';

/**
 * Whether a border still stores the legacy widths, that are not responsive.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Legacy_Border_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The attribute that stores the legacy list.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The name of the derived settings that store the list, or null for the attributes.
	 *
	 * @since TBD
	 *
	 * @var string|null
	 */
	private $derived;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string      $attribute The attribute that stores the legacy list.
	 * @param string|null $derived   The name of the derived settings that store the list, or null for the attributes.
	 */
	public function __construct( $attribute, $derived = null ) {
		$this->attribute = $attribute;
		$this->derived   = $derived;
	}

	/**
	 * The list is set and not the list of four empty sides.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$settings = null === $this->derived ? $input->attributes() : $input->derived( $this->derived );
		$sides    = $settings[ $this->attribute ] ?? null;

		return ! empty( $sides ) && [ '', '', '', '' ] !== $sides;
	}
}
