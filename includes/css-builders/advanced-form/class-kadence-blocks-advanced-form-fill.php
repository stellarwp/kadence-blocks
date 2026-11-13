<?php
/**
 * Writes a gradient or a color of the form.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/class-kadence-blocks-advanced-form-settings.php';

/**
 * Writes a gradient or a color of the form.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advanced_Form_Fill_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The settings group the fill is saved in.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $group;

	/**
	 * The attribute that says whether the fill is a gradient.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $type_key;

	/**
	 * The attribute that stores the gradient.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $gradient_key;

	/**
	 * The attribute that stores the color.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $color_key;

	/**
	 * The CSS property.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $group        The settings group the fill is saved in.
	 * @param string $type_key     The attribute that says whether the fill is a gradient.
	 * @param string $gradient_key The attribute that stores the gradient.
	 * @param string $color_key    The attribute that stores the color.
	 * @param string $property     The CSS property.
	 */
	public function __construct( $group, $type_key, $gradient_key, $color_key, $property ) {
		$this->group        = $group;
		$this->type_key     = $type_key;
		$this->gradient_key = $gradient_key;
		$this->color_key    = $color_key;
		$this->property     = $property;
	}

	/**
	 * Write the fill.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$settings = $input->derived( 'settings' );
		$group    = $settings->group( $this->group );
		$css      = $input->css();

		if ( isset( $group[ $this->type_key ] ) && 'gradient' === $group[ $this->type_key ] ) {
			$css->add_property( $this->property, $group[ $this->gradient_key ] );
			return;
		}

		$css->render_color_output( $group, $this->color_key, $this->property );
	}
}
