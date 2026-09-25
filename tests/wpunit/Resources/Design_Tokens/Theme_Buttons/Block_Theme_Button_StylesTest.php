<?php declare( strict_types=1 );
// cspell:ignore twentytwentyfour twentytwentyfive twentytwentythree twentytwentytwo .

namespace Tests\wpunit\Resources\Design_Tokens\Theme_Buttons;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Buttons\Block_Theme_Button_Styles;
use Tests\Support\Classes\TestCase;

/**
 * Covers the block-theme adapter: when a theme.json counts as readable, how the button element and block
 * become the Theme Base display values, and which core/button variations become value presets.
 */
final class Block_Theme_Button_StylesTest extends TestCase {

	/**
	 * The classes Theme Base wears on every theme.
	 *
	 * @var string
	 */
	private const THEME_CLASS = 'wp-block-button__link button kb-btn-global-inherit';

	/**
	 * The theme's button element and block become the Theme Base display values; a theme-defined variation
	 * becomes a value preset seeded with the base values under its own.
	 *
	 * @dataProvider themeDataProvider
	 *
	 * @param array<string, mixed> $theme    The theme's own styles.
	 * @param array<string, mixed> $merged   The merged styles the page renders.
	 * @param array<string, mixed> $expected The expected styles() result.
	 *
	 * @return void
	 */
	public function testReadsTheElementAndTheThemeVariations( array $theme, array $merged, array $expected ): void {
		$this->assertSame( $expected, $this->adapter( $theme, $merged )->styles() );
	}

	/**
	 * @return Generator
	 */
	public function themeDataProvider(): Generator {
		$tt24_element     = [
			'color'   => [
				'background' => 'var(--wp--preset--color--contrast)',
				'text'       => 'var(--wp--preset--color--base)',
			],
			'spacing' => [
				'padding' => [
					'top'    => '0.6rem',
					'right'  => '1rem',
					'bottom' => '0.6rem',
					'left'   => '1rem',
				],
			],
			'border'  => [
				'radius' => '.33rem',
				'color'  => 'var(--wp--preset--color--contrast)',
			],
			':hover'  => [
				'color'  => [
					'background' => 'var(--wp--preset--color--contrast-2)',
					'text'       => 'var(--wp--preset--color--base)',
				],
				'border' => [ 'color' => 'var(--wp--preset--color--contrast-2)' ],
			],
		];
		$tt24_outline     = [
			'border'  => [
				'width' => '1px',
				'style' => 'solid',
				'color' => 'currentColor',
			],
			'color'   => [
				'text'     => 'currentColor',
				'gradient' => 'transparent none',
			],
			'spacing' => [
				'padding' => [
					'top'    => 'calc(0.6rem - 1px)',
					'right'  => 'calc(1rem - 1px)',
					'bottom' => 'calc(0.6rem - 1px)',
					'left'   => 'calc(1rem - 1px)',
				],
			],
		];
		$tt24_base_values = [
			'button-bg'                 => 'var(--wp--preset--color--contrast)',
			'button-text'               => 'var(--wp--preset--color--base)',
			'button-bg-hover'           => 'var(--wp--preset--color--contrast-2)',
			'button-text-hover'         => 'var(--wp--preset--color--base)',
			'button-radius'             => [ '.33rem', '.33rem', '.33rem', '.33rem' ],
			'button-border-width'       => [ '0', '0', '0', '0' ],
			'button-border-color'       => 'var(--wp--preset--color--contrast)',
			'button-border-hover-color' => 'var(--wp--preset--color--contrast-2)',
			'button-padding'            => [ '0.6rem', '1rem', '0.6rem', '1rem' ],
		];

		// The theme's own data has no border width (twentytwentyfour/theme.json); the merged data carries
		// core's "0", and that is what the page renders, so it is what the display values show.
		$tt24_merged_element = array_replace_recursive( $tt24_element, [ 'border' => [ 'width' => '0' ] ] );

		yield 'twentytwentyfour: element plus a theme outline variation' => [
			'theme'    => [
				'elements' => [ 'button' => $tt24_element ],
				'blocks'   => [ 'core/button' => [ 'variations' => [ 'outline' => [ 'border' => [ 'width' => '1px' ] ] ] ] ],
			],
			'merged'   => [
				'elements' => [ 'button' => $tt24_merged_element ],
				'blocks'   => [ 'core/button' => [ 'variations' => [ 'outline' => $tt24_outline ] ] ],
			],
			'expected' => [
				'base'    => [
					'label'  => 'Theme Base',
					'class'  => self::THEME_CLASS,
					'values' => $tt24_base_values,
				],
				'outline' => [
					'label'  => 'Theme Outline',
					'class'  => '',
					'values' => [],
					'tokens' => [
						'button-bg'                 => 'transparent',
						'button-text'               => 'currentColor',
						'button-bg-hover'           => 'var(--wp--preset--color--contrast-2)',
						'button-text-hover'         => 'var(--wp--preset--color--base)',
						'button-radius'             => [ '.33rem', '.33rem', '.33rem', '.33rem' ],
						'button-border-width'       => [ '1px', '1px', '1px', '1px' ],
						'button-border-style'       => 'solid',
						'button-border-color'       => 'currentColor',
						'button-border-hover-color' => 'var(--wp--preset--color--contrast-2)',
						'button-padding'            => [ 'calc(0.6rem - 1px)', 'calc(1rem - 1px)', 'calc(0.6rem - 1px)', 'calc(1rem - 1px)' ],
					],
				],
			],
		];

		$tt22_block = [
			'border' => [ 'radius' => '0' ],
			'color'  => [
				'background' => 'var(--wp--preset--color--primary)',
				'text'       => 'var(--wp--preset--color--background)',
			],
		];

		yield 'twentytwentytwo: block data only, the core outline ignored' => [
			'theme'    => [ 'blocks' => [ 'core/button' => $tt22_block ] ],
			'merged'   => [
				'elements' => [
					'button' => [
						'color' => [
							'background' => '#32373c',
							'text'       => '#fff',
						],
					],
				],
				'blocks'   => [ 'core/button' => $tt22_block + [ 'variations' => [ 'outline' => [ 'border' => [ 'width' => '2px' ] ] ] ] ],
			],
			'expected' => [
				'base' => [
					'label'  => 'Theme Base',
					'class'  => self::THEME_CLASS,
					'values' => [
						'button-bg'     => 'var(--wp--preset--color--primary)',
						'button-text'   => 'var(--wp--preset--color--background)',
						'button-radius' => [ '0', '0', '0', '0' ],
					],
				],
			],
		];

		$tt25_element = [
			'color' => [
				'background' => 'var:preset|color|contrast',
				'text'       => 'var:preset|color|base',
			],
		];

		yield 'twentytwentyfive: the v3 preset shorthand is rewritten to a CSS variable' => [
			'theme'    => [ 'elements' => [ 'button' => $tt25_element ] ],
			'merged'   => [ 'elements' => [ 'button' => $tt25_element ] ],
			'expected' => [
				'base' => [
					'label'  => 'Theme Base',
					'class'  => self::THEME_CLASS,
					'values' => [
						'button-bg'   => 'var(--wp--preset--color--contrast)',
						'button-text' => 'var(--wp--preset--color--base)',
					],
				],
			],
		];

		yield 'settings only: nothing to read' => [
			'theme'    => [],
			'merged'   => [
				'elements' => [
					'button' => [
						'color' => [
							'background' => '#32373c',
							'text'       => '#fff',
						],
					],
				],
			],
			'expected' => [],
		];

		yield 'a theme variation with an empty object produces no preset' => [
			'theme'    => [
				'elements' => [ 'button' => $tt25_element ],
				'blocks'   => [ 'core/button' => [ 'variations' => [ 'outline' => [] ] ] ],
			],
			'merged'   => [
				'elements' => [ 'button' => $tt25_element ],
				'blocks'   => [ 'core/button' => [ 'variations' => [ 'outline' => [ 'border' => [ 'width' => '2px' ] ] ] ] ],
			],
			'expected' => [
				'base' => [
					'label'  => 'Theme Base',
					'class'  => self::THEME_CLASS,
					'values' => [
						'button-bg'   => 'var(--wp--preset--color--contrast)',
						'button-text' => 'var(--wp--preset--color--base)',
					],
				],
			],
		];
	}

	/**
	 * A twentytwentyfive-shaped outline variation keeps its border and padding, inherits the text color and
	 * every hover value from the base, and drops its custom css.
	 *
	 * @return void
	 */
	public function testAVariationWithCustomCssKeepsOnlyItsData(): void {
		$element = [
			'color'   => [
				'background' => 'var(--wp--preset--color--contrast)',
				'text'       => 'var(--wp--preset--color--base)',
			],
			':hover'  => [
				'color'  => [ 'background' => 'color-mix(in srgb, var(--wp--preset--color--contrast) 85%, transparent)' ],
				'border' => [ 'color' => 'transparent' ],
			],
			'spacing' => [
				'padding' => [
					'top'    => '1rem',
					'right'  => '2.25rem',
					'bottom' => '1rem',
					'left'   => '2.25rem',
				],
			],
		];
		$outline = [
			'border'  => [
				'color' => 'currentColor',
				'width' => '1px',
			],
			'css'     => '.wp-block-button__link:not(.has-background):hover {background-color:color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent);}',
			'spacing' => [
				'padding' => [
					'top'    => 'calc(1rem - 1px)',
					'right'  => 'calc(2.25rem - 1px)',
					'bottom' => 'calc(1rem - 1px)',
					'left'   => 'calc(2.25rem - 1px)',
				],
			],
		];
		$styles  = [
			'elements' => [ 'button' => $element ],
			'blocks'   => [ 'core/button' => [ 'variations' => [ 'outline' => $outline ] ] ],
		];

		$tokens = $this->adapter( $styles, $styles )->styles()['outline']['tokens'];

		$this->assertSame( [ '1px', '1px', '1px', '1px' ], $tokens['button-border-width'] );
		$this->assertSame( 'currentColor', $tokens['button-border-color'] );
		$this->assertSame( 'transparent', $tokens['button-bg'] );
		$this->assertSame( 'color-mix(in srgb, var(--wp--preset--color--contrast) 85%, transparent)', $tokens['button-bg-hover'] );
		$this->assertSame( 'transparent', $tokens['button-border-hover-color'] );
		$this->assertSame( 'var(--wp--preset--color--base)', $tokens['button-text'] );
		$this->assertArrayNotHasKey( 'button-text-hover', $tokens );
		$this->assertSame( [ 'calc(1rem - 1px)', 'calc(2.25rem - 1px)', 'calc(1rem - 1px)', 'calc(2.25rem - 1px)' ], $tokens['button-padding'] );
		$this->assertArrayNotHasKey( 'button-radius', $tokens );
		$this->assertArrayNotHasKey( 'button-border-style', $tokens );
	}

	/**
	 * A per-corner radius object is read corner by corner, and a padding object missing a side is omitted
	 * whole, since a preset value is all four slots.
	 *
	 * @return void
	 */
	public function testReadsPerCornerRadiusAndOmitsAPartialPadding(): void {
		$element = [
			'border'  => [
				'radius' => [
					'topLeft'     => '2px',
					'topRight'    => '4px',
					'bottomRight' => '6px',
					'bottomLeft'  => '8px',
				],
			],
			'spacing' => [
				'padding' => [
					'top'    => '1rem',
					'bottom' => '1rem',
				],
			],
		];
		$styles  = [ 'elements' => [ 'button' => $element ] ];

		$values = $this->adapter( $styles, $styles )->styles()['base']['values'];

		$this->assertSame( [ '2px', '4px', '6px', '8px' ], $values['button-radius'] );
		$this->assertArrayNotHasKey( 'button-padding', $values );
	}

	/**
	 * A theme.json that blanks the button element with `false` values (the Kadence theme's) reads as a
	 * theme with nothing to display: Theme Base is offered, with no values.
	 *
	 * @return void
	 */
	public function testAFalseBlankerReadsAsNoValues(): void {
		$styles = [
			'elements' => [
				'button' => [
					'color'   => [
						'background' => false,
						'text'       => false,
					],
					'spacing' => [ 'padding' => false ],
					'border'  => [ 'width' => false ],
				],
			],
		];

		$this->assertSame(
			[
				'base' => [
					'label'  => 'Theme Base',
					'class'  => self::THEME_CLASS,
					'values' => [],
				],
			],
			$this->adapter( $styles, $styles )->styles()
		);
	}

	/**
	 * Without injected data the adapter reads the active theme: the suite runs twentytwentythree, whose
	 * theme.json styles the button element, so Theme Base carries that theme's values and no variation is
	 * offered, since the theme defines none of its own.
	 *
	 * @return void
	 */
	public function testReadsTheActiveThemeThroughTheResolver(): void {
		$styles = ( new Block_Theme_Button_Styles() )->styles();

		$this->assertSame( [ 'base' ], array_keys( $styles ) );
		$this->assertSame( 'var(--wp--preset--color--primary)', $styles['base']['values']['button-bg'] );
		$this->assertSame( 'var(--wp--preset--color--contrast)', $styles['base']['values']['button-text'] );
		$this->assertSame( 'var(--wp--preset--color--contrast)', $styles['base']['values']['button-bg-hover'] );
		$this->assertSame( [ '0', '0', '0', '0' ], $styles['base']['values']['button-radius'] );
	}

	/**
	 * An adapter reading the given fixtures in place of the theme.json resolver.
	 *
	 * @param array<string, mixed> $theme  The theme's own styles.
	 * @param array<string, mixed> $merged The merged styles.
	 *
	 * @return Block_Theme_Button_Styles
	 */
	private function adapter( array $theme, array $merged ): Block_Theme_Button_Styles {
		return new Block_Theme_Button_Styles(
			static function () use ( $theme ): array {
				return $theme;
			},
			static function () use ( $merged ): array {
				return $merged;
			}
		);
	}
}
