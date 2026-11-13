<?php
/**
 * Runs sections on the settings nested in one attribute.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';

/**
 * Runs sections on the settings nested in one attribute.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Scoped_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the settings as the first entry of a list.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The sections to run.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Css_Section[]
	 */
	private $sections;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute that stores the settings as the first entry of a list.
	 * @param array  $sections  The sections to run.
	 */
	public function __construct( $attribute, array $sections ) {
		$this->attribute = $attribute;
		$this->sections  = $sections;
	}

	/**
	 * Run the sections on the settings.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$settings = $input->item( $this->attribute, 0 );

		if ( ! is_array( $settings ) ) {
			return;
		}

		$scoped = $input->with_attributes( $settings );

		foreach ( $this->sections as $section ) {
			$section->write( $scoped );
		}
	}
}
