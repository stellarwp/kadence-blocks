<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Identity;

use ErrorException;
use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Identity_Aligned_Layout_Condition;
use Kadence_Blocks_Identity_Vertical_Align_Css;
use Tests\wpunit\CssBuilders\Entry_Build_Test_Case;

/**
 * The CSS of the identity block, with the exact rules for a few identities, and the classes it is made of.
 */
final class IdentityCssTest extends Entry_Build_Test_Case {

	private const TABLET = '@media all and (max-width: 1024px)';

	private const MOBILE = '@media all and (max-width: 767px)';

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-identity-css.php';
	}

	/**
	 * The CSS built for the attributes is the CSS expected.
	 *
	 * @dataProvider buildProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testBuild( array $attributes, string $expected ): void {
		$this->assertSameCss( $expected, $this->build_entry( 'Kadence_Blocks_Identity_Css', 'identity', $attributes ) );
	}

	/**
	 * @return Generator
	 */
	public function buildProvider(): Generator {
		yield 'a logo next to the text aligns the text, and the spacing and the typography are written' => [
			'attributes' => [
				'layout'            => 'logo-left',
				'textVerticalAlign' => 'center',
				'padding'           => [ 1, 2, 3, 4 ],
				'margin'            => [ 5, 6, 7, 8 ],
				'titleTypography'   => [
					[
						'size'          => [ 20, 18, 16 ],
						'sizeType'      => 'px',
						'textTransform' => 'uppercase',
					],
				],
				'taglineTypography' => [
					[
						'size'     => [ 10, '', '' ],
						'sizeType' => 'em',
					],
				],
			],
			'expected'   => '.kb-identityabc{padding-top:1px;padding-right:2px;padding-bottom:3px;padding-left:4px;margin-top:5px;margin-right:6px;margin-bottom:7px;margin-left:8px;}'
				. '.kb-identityabc a{text-decoration:inherit;color:inherit;}'
				. '.kb-identityabc .wp-block-site-title{font-size:20px;text-transform:uppercase;}'
				. '.kb-identityabc .wp-block-site-tagline{font-size:10em;}'
				. '.kb-identityabc .kb-identity-layout-container{align-items:center;}'
				. self::TABLET . '{.kb-identityabc .wp-block-site-title{font-size:18px;}}'
				. self::MOBILE . '{.kb-identityabc .wp-block-site-title{font-size:16px;}}',
		];

		yield 'a logo above the text leaves the text alone' => [
			'attributes' => [
				'layout'            => 'logo-top',
				'textVerticalAlign' => 'center',
			],
			'expected'   => '.kb-identityabc a{text-decoration:inherit;color:inherit;}',
		];
	}

	/**
	 * The text is aligned for the four layouts that put the logo next to it, and for no other.
	 *
	 * @dataProvider layoutProvider
	 *
	 * @param mixed $layout   The saved layout.
	 * @param bool  $expected Whether the text is aligned.
	 *
	 * @return void
	 */
	public function testAlignedLayout( $layout, bool $expected ): void {
		$this->assertSame(
			$expected,
			( new Kadence_Blocks_Identity_Aligned_Layout_Condition() )->is_met( $this->input( [ 'layout' => $layout ], new Kadence_Blocks_CSS() ) )
		);
	}

	/**
	 * @return Generator
	 */
	public function layoutProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/identity/loader.php';

		foreach ( [ 'logo-left', 'logo-right', 'logo-right-stacked', 'logo-left-stacked' ] as $layout ) {
			yield $layout => [
				'layout'   => $layout,
				'expected' => true,
			];
		}

		yield 'a logo above the text' => [
			'layout'   => 'logo-top',
			'expected' => false,
		];

		yield 'a layout that is not text' => [
			'layout'   => 0,
			'expected' => false,
		];

		yield 'no layout saved' => [
			'layout'   => null,
			'expected' => false,
		];
	}

	/**
	 * A layout nobody saved is a warning, as it always was, and the text is not aligned.
	 *
	 * @return void
	 */
	public function testMissingLayoutWarns(): void {
		// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_set_error_handler -- The warning is what is pinned.
		set_error_handler(
			static function ( int $number, string $message ): bool {
				throw new ErrorException( $message, 0, $number );
			}
		);

		try {
			$this->expectException( ErrorException::class );
			$this->expectExceptionMessageMatches( '/layout/' );

			( new Kadence_Blocks_Identity_Aligned_Layout_Condition() )->is_met( $this->input( [], new Kadence_Blocks_CSS() ) );
		} finally {
			restore_error_handler();
		}
	}

	/**
	 * The vertical alignment writes the saved alignment, and a missing one is a warning that writes nothing.
	 *
	 * @return void
	 */
	public function testVerticalAlign(): void {
		$section = new Kadence_Blocks_Identity_Vertical_Align_Css();

		$this->assertSameCss( '.s{align-items:flex-end;}', $this->write_section( $section, [ 'textVerticalAlign' => 'flex-end' ], 'abc', '.s' ) );

		// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_set_error_handler -- The warning is what is pinned.
		set_error_handler(
			static function () {
				return true;
			}
		);

		try {
			$this->assertSame( '', $this->write_section( $section, [], 'abc', '.s' ) );
		} finally {
			restore_error_handler();
		}
	}
}
