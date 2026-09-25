<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Theme_Buttons;

use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Buttons\Contracts\Button_Style_Source;

/**
 * The one button style every theme offers when no adapter can read its button data: "Theme Button",
 * painted by the same classes the Button's Theme Base mode has always put on the element, so a button on
 * it renders exactly as a theme-styled button does today. Asked last, and it always answers.
 *
 * @since TBD
 */
final class Classic_Button_Styles implements Button_Style_Source {

	/**
	 * The classes the theme's own stylesheet paints a button with.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const THEME_CLASS = 'wp-block-button__link button kb-btn-global-inherit';

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 */
	public function styles(): array {
		return [
			'base' => [
				'label'  => __( 'Theme Button', 'kadence-blocks' ),
				'class'  => self::THEME_CLASS,
				'values' => [],
			],
		];
	}
}
