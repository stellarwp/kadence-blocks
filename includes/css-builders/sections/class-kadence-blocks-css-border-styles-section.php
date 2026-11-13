<?php
/**
 * Writes border styles.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/../class-kadence-blocks-css-section.php';
require_once __DIR__ . '/../class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the saved border styles under the current selector.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Border_Styles_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the border styles.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * Whether the border style is saved once for every side.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $single_styles;

	/**
	 * The arguments of the border styles.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private $arguments;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $attribute     The attribute that stores the border styles.
	 * @param bool   $single_styles Whether the border style is saved once for every side.
	 * @param array  $arguments     The arguments of the border styles.
	 */
	public function __construct( $attribute, $single_styles = false, array $arguments = [] ) {
		$this->attribute     = $attribute;
		$this->single_styles = $single_styles;
		$this->arguments     = $arguments;
	}

	/**
	 * Write the border styles.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$input->css()->render_border_styles( $input->attributes(), $this->attribute, $this->single_styles, $this->arguments );
	}
}
