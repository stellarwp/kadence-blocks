<?php
/**
 * Writes the text color of a button, or its gradient when the text has a gradient background.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the text color of a button, or its gradient when the text has a gradient background.
 *
 * @since TBD
 */
final class Kadence_Blocks_Singlebtn_Text_Color_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the text color.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $color;

	/**
	 * The attribute that stores the text background type.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $type;

	/**
	 * The attribute that stores the text gradient.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $gradient;

	/**
	 * The selector of the text when it has a gradient.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $gradient_selector;

	/**
	 * The selector of the button.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $selector;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $color             The attribute that stores the text color.
	 * @param string $type              The attribute that stores the text background type.
	 * @param string $gradient          The attribute that stores the text gradient.
	 * @param string $gradient_selector The selector of the text when it has a gradient, with `{id}` for the button id.
	 * @param string $selector          The selector of the button, with `{id}` for the button id.
	 */
	public function __construct( $color, $type, $gradient, $gradient_selector, $selector ) {
		$this->color             = $color;
		$this->type              = $type;
		$this->gradient          = $gradient;
		$this->gradient_selector = $gradient_selector;
		$this->selector          = $selector;
	}

	/**
	 * Write the text color.
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
		$type  = $input->attribute( $this->type );

		if ( ! empty( $color ) && ( empty( $type ) || 'normal' === $type ) ) {
			$css->add_property( 'color', $css->render_color( $color ) );
			return;
		}

		if ( 'gradient' !== $type ) {
			return;
		}

		( new Kadence_Blocks_Css_Selector_Section( $this->gradient_selector ) )->write( $input );

		$css->add_property( 'background', $input->attribute( $this->gradient ) );
		$css->add_property( '-webkit-background-clip', 'text' );
		$css->add_property( '-webkit-text-fill-color', 'transparent' );

		( new Kadence_Blocks_Css_Selector_Section( $this->selector ) )->write( $input );
	}
}
