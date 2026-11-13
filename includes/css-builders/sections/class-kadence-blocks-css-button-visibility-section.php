<?php
/**
 * Hides the text of a button, or its icon, on a device, or shows it again.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Hides the text of a button, or its icon, on a device, or shows it again.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Button_Visibility_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the flag of every device.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The position of the device in the flags.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $index;

	/**
	 * The device, or null to write on whatever device is current.
	 *
	 * @since TBD
	 *
	 * @var string|null
	 */
	private $device;

	/**
	 * The selector of what is hidden.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $selector;

	/**
	 * Whether a flag that is off shows the element again.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $shows_again;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string      $attribute   The attribute that stores the flag of every device.
	 * @param int         $index       The position of the device in the flags.
	 * @param string|null $device      The device, or null to write on whatever device is current.
	 * @param string      $selector    The selector of what is hidden, with `{id}` for the button id.
	 * @param bool        $shows_again Whether a flag that is off shows the element again.
	 */
	public function __construct( $attribute, $index, $device, $selector, $shows_again ) {
		$this->attribute   = $attribute;
		$this->index       = $index;
		$this->device      = $device;
		$this->selector    = $selector;
		$this->shows_again = $shows_again;
	}

	/**
	 * Write the display of the element.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$flag = $input->item( $this->attribute, $this->index );

		if ( null === $flag || '' === $flag ) {
			return;
		}

		$css = $input->css();

		if ( null !== $this->device ) {
			$css->set_media_state( $this->device );
		}

		( new Kadence_Blocks_Css_Selector_Section( $this->selector ) )->write( $input );

		if ( true == $flag ) {
			$css->add_property( 'display', 'none' );
			return;
		}

		if ( $this->shows_again && false == $flag ) {
			$css->add_property( 'display', 'block' );
		}
	}
}
