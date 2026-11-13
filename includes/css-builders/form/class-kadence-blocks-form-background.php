<?php
/**
 * Writes a background that is a gradient or a color, with an opacity.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a background that is a gradient or a color, with an opacity.
 *
 * @since TBD
 */
final class Kadence_Blocks_Form_Background_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the type of background.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $type;

	/**
	 * The attribute that stores the color.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $color;

	/**
	 * The attribute that stores the opacity.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $opacity;

	/**
	 * The attribute that stores the gradient.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $gradient;

	/**
	 * Whether a gradient that starts on nothing starts on transparent, or on a dark color.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $transparent_first;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $type              The attribute that stores the type of background.
	 * @param string $color             The attribute that stores the color.
	 * @param string $opacity           The attribute that stores the opacity.
	 * @param string $gradient          The attribute that stores the gradient.
	 * @param bool   $transparent_first Whether a gradient that starts on nothing starts on transparent, or on a dark color.
	 */
	public function __construct( $type, $color, $opacity, $gradient, $transparent_first ) {
		$this->type              = $type;
		$this->color             = $color;
		$this->opacity           = $opacity;
		$this->gradient          = $gradient;
		$this->transparent_first = $transparent_first;
	}

	/**
	 * Write the background.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css   = $input->css();
		$color = $input->attribute( $this->color );

		if ( 'gradient' === $input->attribute( $this->type ) ) {
			$css->add_property( 'background', ( new Kadence_Blocks_Css_Stops_Gradient() )->value( $css, $input->attribute( $this->gradient ), $this->first_color( $input ) ) );
			return;
		}

		if ( ! empty( $color ) ) {
			$css->add_property( 'background', $css->render_color( $color, $this->alpha( $input ) ) );
		}
	}

	/**
	 * The color a gradient starts on.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return string
	 */
	private function first_color( Kadence_Blocks_Css_Build_Input $input ) {
		$css   = $input->css();
		$color = $input->attribute( $this->color );
		$alpha = $this->alpha( $input );

		if ( null === $color || ( $this->transparent_first && 'transparent' === $color ) ) {
			return $this->transparent_first ? 'rgba(255,255,255,0)' : $css->render_color( '#444444', $alpha );
		}

		return $css->render_color( $color, $alpha );
	}

	/**
	 * The opacity of the color, or full opacity when none was saved.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return mixed
	 */
	private function alpha( Kadence_Blocks_Css_Build_Input $input ) {
		$opacity = $input->attribute( $this->opacity );

		return is_numeric( $opacity ) ? $opacity : 1;
	}
}
