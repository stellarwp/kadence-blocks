<?php
/**
 * Values of the breakout.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-environment.php';

/**
 * Values of the breakout.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Breakout_Values {

	/**
	 * What the site offers.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Rowlayout_Environment
	 */
	private $environment;

	/**
	 * What the section needs to write its CSS.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Css_Build_Input
	 */
	private $input;

	/**
	 * The padding on the left and the right, by side.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private $paddings;

	/**
	 * Create the values.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input       $input       What the section needs to write its CSS.
	 * @param Kadence_Blocks_Rowlayout_Environment $environment What the site offers: the theme, the content width.
	 */
	public function __construct( Kadence_Blocks_Css_Build_Input $input, $environment ) {
		$this->input       = $input;
		$this->environment = $environment;
		$this->paddings    = [
			'left'  => $this->padding_of( 3 ),
			'right' => $this->padding_of( 1 ),
		];
	}

	/**
	 * The content width the row inherits.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function inherit_width() {
		$width = $this->environment->content_width();

		if ( null === $width ) {
			return 'var(--wp--style--global--content-size)';
		}

		return $this->environment->has_kadence_theme() ? 'var( --global-content-width, ' . absint( $width ) . 'px )' : absint( $width ) . 'px';
	}

	/**
	 * The padding of a side.
	 *
	 * @since TBD
	 *
	 * @param string $side `left` or `right`.
	 *
	 * @return string
	 */
	public function padding( $side ) {
		return $this->paddings[ $side ];
	}

	/**
	 * The padding at a position of the saved padding: what the editor saved, or the padding of the theme.
	 *
	 * @since TBD
	 *
	 * @param int $index The position in the saved padding.
	 *
	 * @return string
	 */
	private function padding_of( $index ) {
		$css     = $this->input->css();
		$padding = $this->input->item( 'padding', $index );
		$unit    = $this->input->attribute( 'paddingUnit' );

		if ( is_numeric( $padding ) ) {
			return $padding . ( ! empty( $unit ) ? $unit : 'px' );
		}

		if ( null !== $padding && $css->is_variable_value( $padding ) ) {
			return $css->get_variable_value( $padding );
		}

		return $this->environment->has_kadence_theme() ? 'var(--global-content-edge-padding)' : '0px';
	}
}
