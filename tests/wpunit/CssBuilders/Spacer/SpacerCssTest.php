<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Spacer;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Spacer_Css;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * The whole spacer CSS, with the exact rules for a few spacers.
 */
final class SpacerCssTest extends Free_Section_Test_Case {

	private const SPACER = '.wp-block-kadence-spacer.kt-block-spacer-abc .kt-block-spacer';

	private const LINE = '.wp-block-kadence-spacer.kt-block-spacer-abc .kt-divider';

	private const STRIPE = '.wp-block-kadence-spacer.kt-block-spacer-abc .kt-divider-stripe';

	/**
	 * The CSS built for the attributes is the CSS expected.
	 *
	 * @dataProvider spacerProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testBuild( array $attributes, string $expected ): void {
		$context = new Kadence_Blocks_Css_Block_Context(
			'spacer',
			static function () {
				return null;
			}
		);
		$css     = ( new Kadence_Blocks_Spacer_Css( $context ) )->build( $attributes, new Kadence_Blocks_CSS(), 'abc', 'abc-' . md5( $expected ) );

		$this->assertSameCss( $expected, (string) $css );
	}

	/**
	 * @return Generator
	 */
	public function spacerProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-spacer-css.php';

		yield 'a spacer with a height on every device' => [
			'attributes' => [
				'spacerHeight'       => 40,
				'tabletSpacerHeight' => 30,
				'mobileSpacerHeight' => 20,
			],
			'expected'   => self::SPACER . '{height:40px;}'
				. '@media all and (max-width: 1024px){' . self::SPACER . '{height:30px!important;}}'
				. '@media all and (max-width: 767px){' . self::SPACER . '{height:20px!important;}}'
				. self::LINE . '{width:80%;}',
		];
		yield 'a line' => [
			'attributes' => [
				'dividerStyle'        => 'dashed',
				'dividerHeight'       => 3,
				'dividerColor'        => '#ff0000',
				'dividerOpacity'      => 50,
				'dividerWidth'        => 60,
				'tabletDividerHeight' => 5,
				'mobileDividerWidth'  => 90,
			],
			'expected'   => self::LINE . '{border-top-width:3px;height:1px;border-top-color:rgba(255, 0, 0, 0.50);width:60%;border-top-style:dashed;}'
				. '@media all and (max-width: 1024px){' . self::LINE . '{border-top-width:5px !important;}}'
				. '@media all and (max-width: 767px){' . self::LINE . '{width:90%!important;}}',
		];
		yield 'a stripe' => [
			'attributes' => [
				'dividerStyle'        => 'stripe',
				'dividerHeight'       => 12,
				'dividerWidth'        => 70,
				'dividerWidthUnits'   => 'px',
				'tabletDividerWidth'  => 50,
				'mobileDividerHeight' => 6,
				'mobileSpacerHeight'  => 25,
			],
			'expected'   => '@media all and (max-width: 767px){' . self::SPACER . '{height:25px!important;}' . self::STRIPE . '{height:25px !important;}}'
				. self::STRIPE . '{height:12px;width:70px;}'
				. '@media all and (max-width: 1024px){' . self::STRIPE . '{width:50px!important;}}',
		];
	}
}
