<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders;

use Kadence_Blocks_Css_Build_Input;
use Kadence_Blocks_Css_Section;

/**
 * A section that writes one known rule, so tests can tell whether a wrapper ran it.
 */
final class Free_Recording_Section implements Kadence_Blocks_Css_Section {

	/**
	 * Write `.ran{ran:1;}` under whatever media state is active.
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$input->css()->set_selector( '.ran' );
		$input->css()->add_property( 'ran', '1' );
	}
}
