<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Theme_Buttons;

use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Buttons\Classic_Button_Styles;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Buttons\Discovery;
use Tests\Support\Classes\Fake_Button_Style_Source;
use Tests\Support\Classes\TestCase;

/**
 * Covers the theme button discovery: adapter order, the filter, and the prefixing, sanitizing and
 * labeling every discovered style goes through.
 */
final class DiscoveryTest extends TestCase {

	/**
	 * @return void
	 */
	protected function tearDown(): void {
		remove_all_filters( 'kadence_blocks_theme_button_styles' );

		parent::tearDown();
	}

	/**
	 * Every discovered style is prefixed, sanitized and labeled; an entry without classes is dropped.
	 *
	 * @return void
	 */
	public function testPrefixesSanitizesAndLabelsDiscoveredStyles(): void {
		$source    = new Fake_Button_Style_Source(
			[
				'base'      => [
					'label'  => 'Theme Base',
					'class'  => 'button kb-btn-global-inherit',
					'values' => [],
				],
				'Fancy One' => [
					'class'  => 'is-style-fancy',
					'values' => [],
				],
				'ghost'     => [
					'label'  => 'Ghost',
					'values' => [],
				],
			]
		);
		$discovery = new Discovery( $source );

		$styles = $discovery->styles();

		$this->assertSame( [ 'theme-base', 'theme-fancy-one' ], array_keys( $styles ) );
		$this->assertSame( 'Fancy One', $styles['theme-fancy-one']['label'] );
		$this->assertSame( 'is-style-fancy', $styles['theme-fancy-one']['class'] );
		$this->assertSame( [], $styles['theme-fancy-one']['tokens'] );
	}

	/**
	 * An entry with no label is listed under its slug turned into words.
	 *
	 * @return void
	 */
	public function testHumanizesTheSlugOfAnUnlabeledEntry(): void {
		$styles = ( new Discovery( new Fake_Button_Style_Source( [ 'call_to_action' => [ 'class' => 'is-style-cta' ] ] ) ) )->styles();

		$this->assertSame( 'Call To Action', $styles['theme-call-to-action']['label'] );
	}

	/**
	 * An entry with no classes survives when it declares tokens: that is the value preset kind, painted
	 * through the preset projector rather than by the theme's stylesheet.
	 *
	 * @return void
	 */
	public function testKeepsAClasslessEntryThatDeclaresTokens(): void {
		$styles = ( new Discovery(
			new Fake_Button_Style_Source(
				[
					'pill' => [
						'label'  => 'Pill',
						'tokens' => [ 'button-radius' => '999px' ],
					],
				] 
			) 
		) )->styles();

		$this->assertSame( [ 'theme-pill' ], array_keys( $styles ) );
		$this->assertSame( '', $styles['theme-pill']['class'] );
		$this->assertSame( [ 'button-radius' => '999px' ], $styles['theme-pill']['tokens'] );
	}

	/**
	 * The first adapter with an answer wins; the ones after it are not consulted.
	 *
	 * @return void
	 */
	public function testTheFirstAdapterWithAnAnswerWins(): void {
		$discovery = new Discovery(
			new Fake_Button_Style_Source(),
			new Fake_Button_Style_Source( self::KADENCE_LIKE ),
			new Classic_Button_Styles()
		);

		$this->assertSame( [ 'theme-base', 'theme-secondary' ], array_keys( $discovery->styles() ) );
	}

	/**
	 * When no adapter answers, the classic fallback offers the one Theme Button preset.
	 *
	 * @return void
	 */
	public function testFallsBackToTheClassicThemeButton(): void {
		$styles = ( new Discovery( new Fake_Button_Style_Source(), new Classic_Button_Styles() ) )->styles();

		$this->assertSame( [ 'theme-base' ], array_keys( $styles ) );
		$this->assertSame( 'Theme Button', $styles['theme-base']['label'] );
		$this->assertSame( 'wp-block-button__link button kb-btn-global-inherit', $styles['theme-base']['class'] );
		$this->assertSame( [], $styles['theme-base']['values'] );
	}

	/**
	 * The filter can add, relabel and remove entries before prefixing.
	 *
	 * @return void
	 */
	public function testTheFilterShapesTheList(): void {
		add_filter(
			'kadence_blocks_theme_button_styles',
			static function ( array $styles ): array {
				unset( $styles['secondary'] );
				$styles['base']['label'] = 'House Button';
				$styles['pill']          = [
					'label'  => 'Pill',
					'class'  => 'is-style-pill',
					'values' => [],
				];

				return $styles;
			}
		);

		$styles = ( new Discovery( new Fake_Button_Style_Source( self::KADENCE_LIKE ) ) )->styles();

		$this->assertSame( [ 'theme-base', 'theme-pill' ], array_keys( $styles ) );
		$this->assertSame( 'House Button', $styles['theme-base']['label'] );
	}

	/**
	 * The filter receives the active theme's stylesheet slug, so a compatibility plugin can answer for
	 * one theme only.
	 *
	 * @return void
	 */
	public function testTheFilterReceivesTheActiveStylesheet(): void {
		$seen = null;

		add_filter(
			'kadence_blocks_theme_button_styles',
			static function ( array $styles, string $theme ) use ( &$seen ): array {
				$seen = $theme;

				return $styles;
			},
			10,
			2
		);

		( new Discovery( new Fake_Button_Style_Source( self::KADENCE_LIKE ) ) )->styles();

		$this->assertSame( get_stylesheet(), $seen );
	}

	/**
	 * A filter that returns something other than an array, or entries that are not arrays, leaves nothing
	 * to offer rather than breaking discovery.
	 *
	 * @return void
	 */
	public function testIgnoresAMalformedFilterResult(): void {
		add_filter( 'kadence_blocks_theme_button_styles', '__return_false' );

		$this->assertSame( [], ( new Discovery( new Fake_Button_Style_Source( self::KADENCE_LIKE ) ) )->styles() );
	}

	/**
	 * A Kadence-shaped answer: base and secondary, today's classes, no values.
	 *
	 * @var array<string, array{label: string, class: string, values: array<string, mixed>}>
	 */
	private const KADENCE_LIKE = [
		'base'      => [
			'label'  => 'Theme Base',
			'class'  => 'wp-block-button__link button kb-btn-global-inherit',
			'values' => [],
		],
		'secondary' => [
			'label'  => 'Theme Secondary',
			'class'  => 'wp-block-button__link button button-style-secondary kb-btn-global-inherit',
			'values' => [],
		],
	];
}
