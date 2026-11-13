<?php
/**
 * Writes the font family of the title or of the content.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';

/**
 * Writes the font family, and loads it when it is a Google font.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tableofcontents_Font_Family implements Kadence_Blocks_Css_Section {

	/**
	 * The start of the attribute names.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $prefix;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $prefix The start of the attribute names: `title` or `content`.
	 */
	public function __construct( string $prefix ) {
		$this->prefix = $prefix;
	}

	/**
	 * Write the family.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$family = $input->attribute( $this->prefix . 'Typography' );

		if ( null === $family ) {
			return;
		}

		$css = $input->css();
		$css->add_property(
			'font-family',
			$css->render_font_family(
				$family,
				$this->loads_google_font( $input ),
				$input->attribute( $this->prefix . 'FontVariant', '' ),
				$input->attribute( $this->prefix . 'FontSubset', '' )
			)
		);
	}

	/**
	 * Whether the font is a Google font that was not told to stay unloaded.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	private function loads_google_font( Kadence_Blocks_Css_Build_Input $input ): bool {
		$load = $input->attribute( $this->prefix . 'LoadGoogleFont' );

		return (bool) $input->attribute( $this->prefix . 'GoogleFont' ) && ( null === $load || (bool) $load );
	}
}
