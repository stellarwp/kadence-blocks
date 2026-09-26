<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Theme_Buttons;

use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Buttons\Contracts\Button_Style_Source;

/**
 * A block theme's button styles, read from its theme.json button element and variations. Asked after the
 * Kadence adapter and before the classic fallback.
 *
 * The theme.json reader is not wired yet, so this source offers nothing and every block theme falls
 * through to the classic Theme Button preset.
 *
 * @since TBD
 */
final class Block_Theme_Button_Styles implements Button_Style_Source {

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 */
	public function styles(): array {
		return [];
	}
}
