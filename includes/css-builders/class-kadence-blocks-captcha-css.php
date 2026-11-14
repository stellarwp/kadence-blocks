<?php
/**
 * Builds the CSS for the captcha block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Builds the CSS for the captcha block: the width limits of a field, and hiding the recaptcha badge when asked to.
 *
 * @since TBD
 */
final class Kadence_Blocks_Captcha_Css extends Kadence_Blocks_Form_Field_Css {

	/**
	 * The sections a captcha adds after the width limits.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	protected function extra_sections(): array {
		return [
			new Kadence_Blocks_Css_Enabled_Section(
				'hideRecaptcha',
				[
					new Kadence_Blocks_Css_Selector_Section( '.grecaptcha-badge' ),
					new Kadence_Blocks_Css_Static_Section( 'visibility', 'hidden' ),
				]
			),
		];
	}
}
