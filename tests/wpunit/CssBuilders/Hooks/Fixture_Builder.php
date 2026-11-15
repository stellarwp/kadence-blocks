<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Hooks;

use Kadence_Blocks_Css_Block_Builder;
use Kadence_Blocks_Css_Selector_Section;
use Kadence_Blocks_Css_Static_Section;

/**
 * A builder like the ones other plugins write: extend the base class and list the sections.
 */
final class Fixture_Builder extends Kadence_Blocks_Css_Block_Builder {

	/**
	 * A selector and one declaration.
	 *
	 * @return \Kadence_Blocks_Css_Section[]
	 */
	protected function sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.fixture{id}' ),
			new Kadence_Blocks_Css_Static_Section( 'color', 'blue' ),
		];
	}
}
