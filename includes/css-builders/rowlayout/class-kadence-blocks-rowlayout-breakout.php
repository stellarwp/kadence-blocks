<?php
/**
 * Breaks the columns of a full width row out of the content.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Breaks the columns of a full width row out of the content.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Breakout_Css implements Kadence_Blocks_Css_Section {

	/**
	 * What the site offers.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Rowlayout_Environment
	 */
	private $environment;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Rowlayout_Environment $environment What the site offers: the theme, the content width.
	 */
	public function __construct( $environment ) {
		$this->environment = $environment;
	}

	/**
	 * Write the breakout.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( ! ( new Kadence_Blocks_Rowlayout_Breakout_Condition() )->is_met( $input ) ) {
			return;
		}

		$scoped = $input->with( 'breakout', new Kadence_Blocks_Rowlayout_Breakout_Values( $input, $this->environment ) );

		foreach ( $this->sections() as $section ) {
			$section->write( $scoped );
		}
	}

	/**
	 * The sections of the breakout.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	private function sections(): array {
		return [
			new Kadence_Blocks_Rowlayout_Selector_Css( 'base' ),
			new Kadence_Blocks_Rowlayout_Breakout_Variables_Css(),
			new Kadence_Blocks_Rowlayout_Filtered_Media_Css( 'desktopOnly', [ new Kadence_Blocks_Rowlayout_Breakout_Margin_Css( 'desktop' ) ] ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Rowlayout_Media_Queries_Condition(),
				[ new Kadence_Blocks_Rowlayout_Breakout_Wide_Css( $this->environment ) ],
				[ new Kadence_Blocks_Rowlayout_Breakout_Margin_Css( 'fallback' ) ]
			),
			new Kadence_Blocks_Css_Device_Section( 'tabletOnly', [ new Kadence_Blocks_Rowlayout_Breakout_Margin_Css( 'tablet' ) ] ),
		];
	}
}
