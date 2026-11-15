<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Hooks;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Builders;
use Tests\Support\Classes\Css_Normalizer;
use Tests\Support\Classes\TestCase;
use Tests\wpunit\CssBuilders\Hooks\ThirdParty\Acme_Block;
use Tests\wpunit\CssBuilders\Hooks\ThirdParty\Acme_Glow_Section;

/**
 * What another plugin can do with the public API: build the CSS of its own block, and add to the CSS of a Kadence block.
 *
 * Everything under ThirdParty/ only uses what the README of the builders documents.
 */
final class ThirdPartyTest extends TestCase {

	/**
	 * Assert the CSS means what is expected.
	 *
	 * @param string $expected The expected CSS.
	 * @param string $actual   The CSS built.
	 *
	 * @return void
	 */
	private function assertSameCss( string $expected, string $actual ): void {
		$normalizer = new Css_Normalizer();

		$this->assertSame( $normalizer->normalize( $expected ), $normalizer->normalize( $actual ) );
	}

	/**
	 * A block of another plugin builds its CSS with its own builder, the sections of Kadence Blocks and its own sections.
	 *
	 * @return void
	 */
	public function testAnotherPluginBuildsTheCssOfItsOwnBlock(): void {
		$css = ( new Acme_Block() )->build_css(
			[
				'textColor'    => '#112233',
				'maxWidth'     => [ 600, 400, 300 ],
				'maxWidthUnit' => 'px',
				'glow'         => 8,
			],
			new Kadence_Blocks_CSS(),
			'abc',
			'def'
		);

		$this->assertSameCss(
			'.acme-box-abc{color:#112233;max-width:600px;box-shadow:0 0 8px currentColor;}@media all and (max-width: 1024px){.acme-box-abc{max-width:400px;}}@media all and (max-width: 767px){.acme-box-abc{max-width:300px;}}',
			(string) $css
		);
	}

	/**
	 * Its own section can be left out by the block's attributes, as the sections of Kadence Blocks are.
	 *
	 * @return void
	 */
	public function testItsOwnSectionWritesNothingWithoutItsAttribute(): void {
		$css = ( new Acme_Block() )->build_css( [ 'textColor' => '#112233' ], new Kadence_Blocks_CSS(), 'abc', 'def' );

		$this->assertSameCss( '.acme-box-abc{color:#112233;}', (string) $css );
	}

	/**
	 * Another plugin adds its section to a block of Kadence Blocks with the sections filter.
	 *
	 * @return void
	 */
	public function testAnotherPluginAddsASectionToAKadenceBlock(): void {
		add_filter(
			'kadence_blocks_css_sections',
			static function ( array $sections, string $block_name ) {
				if ( 'header-column' === $block_name ) {
					$sections[] = new Acme_Glow_Section();
				}

				return $sections;
			},
			10,
			2
		);

		$build = static function ( string $block_name, array $attributes ) {
			return Kadence_Blocks_Css_Builders::build( 'Kadence_Blocks_Header_Column_Css', new \Tests\wpunit\CssBuilders\Bridge\Fake_Block(), $block_name, $attributes, new Kadence_Blocks_CSS(), 'abc', 'def' );
		};

		$this->assertSameCss( '.wp-block-kadence-header-columnabc{box-shadow:0 0 5px currentColor;}', (string) $build( 'header-column', [ 'glow' => 5 ] ) );
		$this->assertSameCss( '', (string) $build( 'another-block', [ 'glow' => 5 ] ) );
	}
}
