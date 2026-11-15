<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Hooks\ThirdParty;

use Kadence_Blocks_Css_Block_Builder;
use Kadence_Blocks_Css_Color_Section;
use Kadence_Blocks_Css_Responsive_Range_Section;
use Kadence_Blocks_Css_Selector_Section;

/**
 * The builder of the Acme box: a selector, two sections of Kadence Blocks and one of its own.
 */
final class Acme_Box_Css extends Kadence_Blocks_Css_Block_Builder {

	/**
	 * The sections of the box, in the order they are written.
	 *
	 * @return \Kadence_Blocks_Css_Section[]
	 */
	protected function sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.acme-box-{id}' ),
			new Kadence_Blocks_Css_Color_Section( 'color', 'textColor' ),
			new Kadence_Blocks_Css_Responsive_Range_Section( 'maxWidth', 'max-width', 'maxWidthUnit' ),
			new Acme_Glow_Section(),
		];
	}
}
