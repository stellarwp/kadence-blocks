<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Hooks\ThirdParty;

use Kadence_Blocks_Css_Build_Input;
use Kadence_Blocks_Css_Section;

/**
 * A section of another plugin: it reads an attribute and adds a property under the current selector.
 */
final class Acme_Glow_Section implements Kadence_Blocks_Css_Section {

	/**
	 * Add a glow when the block asks for one.
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$glow = $input->attribute( 'glow' );

		if ( empty( $glow ) ) {
			return;
		}

		$input->css()->add_property( 'box-shadow', '0 0 ' . absint( $glow ) . 'px currentColor' );
	}
}
