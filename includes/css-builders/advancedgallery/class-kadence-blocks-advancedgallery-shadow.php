<?php
/**
 * Writes the shadow of the images.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-advancedgallery-shadow-entry.php';

/**
 * Writes the shadow of the images.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedgallery_Shadow_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The shadow the renderer fills in for what was not saved.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const DEFAULTS = [
		'hOffset' => '4',
		'vOffset' => '2',
		'blur'    => '14',
		'spread'  => '0',
		'color'   => '#000000',
		'opacity' => 0.2,
	];

	/**
	 * The attribute that stores the shadows.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The selectors of the images.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $selector;

	/**
	 * Whether a missing attribute falls back to the default shadow.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $with_fallback;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $attribute     The attribute that stores the shadows.
	 * @param string $selector      The selectors of the images, `{id}` stands for the block unique id.
	 * @param bool   $with_fallback Whether a missing attribute falls back to the default shadow.
	 */
	public function __construct( $attribute, $selector, $with_fallback ) {
		$this->attribute     = $attribute;
		$this->selector      = $selector;
		$this->with_fallback = $with_fallback;
	}

	/**
	 * Write the shadow.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$shadow = ( new Kadence_Blocks_Advancedgallery_Shadow_Entry( $this->attribute, $this->with_fallback ) )->first( $input );

		if ( null === $shadow ) {
			return;
		}

		$css = $input->css();

		$css->set_selector( str_replace( '{id}', $input->unique_id(), $this->selector ) );
		$css->add_property( 'box-shadow', $css->render_shadow( $shadow, self::DEFAULTS ) );
	}
}
