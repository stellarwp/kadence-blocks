<?php
/**
 * Tells whether a list of the settings in the first item of an attribute has any value.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether a list of the settings in the first item of an attribute has any value.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Nested_Filled_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The attribute that stores the settings.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $container;

	/**
	 * The key of the list.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $key;

	/**
	 * Whether a missing list counts as an empty one.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $guarded;

	/**
	 * Create the condition.
	 *
	 * @since TBD
	 *
	 * @param string $container  The attribute that stores the settings.
	 * @param string $key     The key of the list.
	 * @param bool   $guarded Whether a missing list counts as an empty one.
	 */
	public function __construct( $container, $key, $guarded ) {
		$this->container = $container;
		$this->key       = $key;
		$this->guarded   = $guarded;
	}

	/**
	 * Whether the list has a value. An unguarded list that is missing in saved settings is an error, as it
	 * always was.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$settings = $input->item( $this->container, 0 );

		if ( null === $settings ) {
			return false;
		}

		if ( $this->guarded && ! isset( $settings[ $this->key ] ) ) {
			return false;
		}

		return (bool) array_filter( $settings[ $this->key ] );
	}
}
