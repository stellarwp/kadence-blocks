<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Sections;

use Generator;
use Kadence_Blocks_Css_Sanitized_Color_Section;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * The section that writes a color the way the editor saved it, with its palette name or its token resolved.
 */
final class SanitizedColorSectionTest extends Free_Section_Test_Case {

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
	}

	/**
	 * The color is written when the attribute has a value.
	 *
	 * @dataProvider colorProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testColor( array $attributes, string $expected ): void {
		$section = new Kadence_Blocks_Css_Sanitized_Color_Section( 'color', 'tint' );

		$this->assertSameCss( $expected, $this->write_section( $section, $attributes, 'abc', '.sel' ) );
	}

	/**
	 * @return Generator
	 */
	public function colorProvider(): Generator {
		yield 'a hex color' => [
			'attributes' => [ 'tint' => '#ff0000' ],
			'expected'   => '.sel{color:#ff0000;}',
		];
		yield 'a palette color' => [
			'attributes' => [ 'tint' => 'palette3' ],
			'expected'   => '.sel{color:var(--global-palette3, #1A202C);}',
		];
		yield 'an empty color' => [
			'attributes' => [ 'tint' => '' ],
			'expected'   => '',
		];
		yield 'no color' => [
			'attributes' => [],
			'expected'   => '',
		];
	}
}
