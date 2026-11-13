<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\HeaderSection;

use Tests\wpunit\CssBuilders\Entry_Build_Test_Case;

/**
 * The CSS of the header section block: it shows on desktop and hides from tablet on.
 */
final class HeaderSectionCssTest extends Entry_Build_Test_Case {

	/**
	 * The section is a block on desktop and hidden on tablet.
	 *
	 * @return void
	 */
	public function testSectionIsHiddenOnTablet(): void {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-header-section-css.php';

		$this->assertSameCss(
			'.wp-block-kadence-header-desktopabc{display:block;}@media all and (max-width: 1024px){.wp-block-kadence-header-desktopabc{display:none;}}',
			$this->build_entry( 'Kadence_Blocks_Header_Section_Css', 'header-section', [] )
		);
	}
}
