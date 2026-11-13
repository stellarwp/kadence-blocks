<?php declare( strict_types=1 );

namespace Tests\wpunit\CssWriters;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Declaration;
use Kadence_Blocks_Css_Not_Empty_Condition;
use Kadence_Blocks_Css_Raw_Format;
use Kadence_Blocks_Css_Unit_Format;
use Tests\Support\Classes\TestCase;

/**
 * A declaration writes its property only when the condition passes.
 */
final class DeclarationTest extends TestCase {

	/**
	 * The CSS builder the declaration writes to.
	 *
	 * @var Kadence_Blocks_CSS
	 */
	private $css;

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
		$this->css = new Kadence_Blocks_CSS();
		$this->css->set_style_id( 'declaration-test' );
		$this->css->set_selector( '.a' );
	}

	/**
	 * A passing value is written with the configured format.
	 *
	 * @return void
	 */
	public function testWritesWhenTheConditionPasses(): void {
		$declaration = new Kadence_Blocks_Css_Declaration( 'letter-spacing', new Kadence_Blocks_Css_Not_Empty_Condition(), new Kadence_Blocks_Css_Unit_Format( 'px' ) );
		$declaration->write( $this->css, 2 );

		$this->assertSame( '.a{letter-spacing:2px;}', $this->css->css_output() );
	}

	/**
	 * A failing value writes nothing, not even the selector.
	 *
	 * @return void
	 */
	public function testWritesNothingWhenTheConditionFails(): void {
		$declaration = new Kadence_Blocks_Css_Declaration( 'text-transform', new Kadence_Blocks_Css_Not_Empty_Condition(), new Kadence_Blocks_Css_Raw_Format() );
		$declaration->write( $this->css, '' );
		$declaration->write( $this->css, null );

		$this->assertSame( '', $this->css->css_output() );
	}

	/**
	 * Declarations are written under the media state that is active, like every other property.
	 *
	 * @return void
	 */
	public function testHonoursTheActiveMediaState(): void {
		$this->css->set_media_state( 'tablet' );
		$this->css->set_selector( '.a' );
		$declaration = new Kadence_Blocks_Css_Declaration( 'font-style', new Kadence_Blocks_Css_Not_Empty_Condition(), new Kadence_Blocks_Css_Raw_Format() );
		$declaration->write( $this->css, 'italic' );
		$this->css->set_media_state( 'desktop' );

		$output = $this->css->css_output();

		$this->assertStringContainsString( '@media', $output );
		$this->assertStringContainsString( '.a{font-style:italic;}', $output );
	}
}
