<?php declare( strict_types=1 );

namespace Tests\wpunit\CssWriters;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Css_Build_Input;
use Tests\Support\Classes\TestCase;

/**
 * The build input carries what a CSS section needs and never changes in place.
 */
final class BuildInputTest extends TestCase {

	/**
	 * The input under test.
	 *
	 * @var Kadence_Blocks_Css_Build_Input
	 */
	private $input;

	/**
	 * The CSS builder the input carries.
	 *
	 * @var Kadence_Blocks_CSS
	 */
	private $css;

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
		$this->css   = new Kadence_Blocks_CSS();
		$context     = new Kadence_Blocks_Css_Block_Context(
			'infobox',
			static function ( $member ) {
				return 'called ' . $member;
			} 
		);
		$this->input = new Kadence_Blocks_Css_Build_Input( [ 'color' => 'red' ], $this->css, 'abc', 'abc-style', $context );
	}

	/**
	 * The accessors return what the input was built with.
	 *
	 * @return void
	 */
	public function testAccessorsReturnTheConstructorValues(): void {
		$this->assertSame( [ 'color' => 'red' ], $this->input->attributes() );
		$this->assertSame( $this->css, $this->input->css() );
		$this->assertSame( 'abc', $this->input->unique_id() );
		$this->assertSame( 'abc-style', $this->input->unique_style_id() );
		$this->assertSame( 'infobox', $this->input->context()->block_name() );
	}

	/**
	 * A single attribute falls back to the default when it was never set.
	 *
	 * @return void
	 */
	public function testAttributeFallsBackToTheDefault(): void {
		$this->assertSame( 'red', $this->input->attribute( 'color', 'blue' ) );
		$this->assertSame( 'blue', $this->input->attribute( 'missing', 'blue' ) );
		$this->assertNull( $this->input->attribute( 'missing' ) );
	}

	/**
	 * Adding a derived value returns a new input and leaves the original untouched.
	 *
	 * @return void
	 */
	public function testWithReturnsACopyAndKeepsTheOriginalUntouched(): void {
		$copy = $this->input->with( 'selector', '.kt-info-boxabc' );

		$this->assertSame( '.kt-info-boxabc', $copy->derived( 'selector' ) );
		$this->assertNull( $this->input->derived( 'selector' ) );
		$this->assertSame( 'fallback', $this->input->derived( 'selector', 'fallback' ) );
		$this->assertSame( $this->input->attributes(), $copy->attributes() );
		$this->assertSame( $this->css, $copy->css() );
	}

	/**
	 * The context reaches the block helpers through the bridge it was given.
	 *
	 * @return void
	 */
	public function testContextCallsTheBridge(): void {
		$this->assertSame( 'called class_id', $this->input->context()->call( 'class_id' ) );
	}
}
