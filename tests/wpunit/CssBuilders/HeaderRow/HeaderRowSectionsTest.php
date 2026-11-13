<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\HeaderRow;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Css_Build_Input;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Css_Sized_Dynamic_Section;
use Kadence_Blocks_Header_Row_Background_Css;
use Kadence_Blocks_Header_Row_Dimension_Css;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * The sections of the header row CSS, one by one.
 *
 * The dynamic styles of each size come from the block, which is faked here: the header row reads no site data of its own.
 */
final class HeaderRowSectionsTest extends Free_Section_Test_Case {

	private const SELECTOR = '.wp-block-kadence-header-rowabc';

	/**
	 * A section writes the CSS expected for the attributes.
	 *
	 * @dataProvider sectionProvider
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 * @param string                     $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testSection( Kadence_Blocks_Css_Section $section, array $attributes, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_section( $section, $attributes, 'abc', self::SELECTOR ) );
	}

	/**
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/header-row/loader.php';

		yield from $this->dimensionProvider();
		yield from $this->backgroundProvider();
	}

	/**
	 * @return Generator
	 */
	private function dimensionProvider(): Generator {
		yield 'a size is written with its unit' => [
			'section'    => new Kadence_Blocks_Header_Row_Dimension_Css( 'min-height', 'height', 'unit' ),
			'attributes' => [
				'height' => 40,
				'unit'   => 'vh',
			],
			'expected'   => self::SELECTOR . '{min-height:40vh;}',
		];
		yield 'a size without a unit is in pixels' => [
			'section'    => new Kadence_Blocks_Header_Row_Dimension_Css( 'max-width', 'width', 'unit' ),
			'attributes' => [ 'width' => '900' ],
			'expected'   => self::SELECTOR . '{max-width:900px;}',
		];
		yield 'a size with an empty unit is in pixels' => [
			'section'    => new Kadence_Blocks_Header_Row_Dimension_Css( 'max-width', 'width', 'unit' ),
			'attributes' => [
				'width' => 5,
				'unit'  => '',
			],
			'expected'   => self::SELECTOR . '{max-width:5px;}',
		];
	}

	/**
	 * @return Generator
	 */
	private function backgroundProvider(): Generator {
		yield 'a color background is written as a variable' => [
			'section'    => new Kadence_Blocks_Header_Row_Background_Css( 'background', '--kb-header-row-bg' ),
			'attributes' => [
				'background' => [
					'type'  => 'normal',
					'color' => '#112233',
				],
			],
			'expected'   => self::SELECTOR . '{--kb-header-row-bg:#112233;}',
		];
		yield 'a missing background writes nothing' => [
			'section'    => new Kadence_Blocks_Header_Row_Background_Css( 'background', '--kb-header-row-bg' ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'a background that is not a list writes nothing' => [
			'section'    => new Kadence_Blocks_Header_Row_Background_Css( 'background', '--kb-header-row-bg' ),
			'attributes' => [ 'background' => 'red' ],
			'expected'   => '',
		];
	}

	/**
	 * The block is asked for the dynamic styles of each size, in order, and the media state goes back to desktop.
	 *
	 * @return void
	 */
	public function testSizedStylesAreAskedForEachSize(): void {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/header-row/loader.php';

		$calls   = [];
		$css     = new Kadence_Blocks_CSS();
		$context = new Kadence_Blocks_Css_Block_Context(
			'header-row',
			static function ( $member, ...$arguments ) use ( &$calls ) {
				$calls[] = [ $member, $arguments[1], $arguments[2], $arguments[3] ];
				$arguments[0]->set_media_state( 'mobile' );

				return null;
			}
		);
		$input   = new Kadence_Blocks_Css_Build_Input( [ 'layoutConfig' => 'single' ], $css, 'abc', 'abc', $context );

		( new Kadence_Blocks_Css_Sized_Dynamic_Section() )->write( $input );

		$this->assertSame(
			[
				[ 'sized_dynamic_styles', [ 'layoutConfig' => 'single' ], 'abc', 'Desktop' ],
				[ 'sized_dynamic_styles', [ 'layoutConfig' => 'single' ], 'abc', 'Tablet' ],
				[ 'sized_dynamic_styles', [ 'layoutConfig' => 'single' ], 'abc', 'Mobile' ],
			],
			$calls
		);

		$css->set_style_id( 'sized-test' );
		$css->set_selector( '.after' );
		$css->add_property( 'color', 'red' );

		$this->assertSameCss( '.after{color:red;}', $css->css_output() );
	}
}
