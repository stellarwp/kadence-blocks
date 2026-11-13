<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\ShowMore;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Show_More_Css;
use Kadence_Blocks_Show_More_Fade_Out;
use Kadence_Blocks_Show_More_Max_Height;
use Kadence_Blocks_Show_More_Selector;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * The classes that build the CSS of the show more block, one at a time, and the builder that runs them.
 */
final class ShowMoreSectionsTest extends Free_Section_Test_Case {

	/**
	 * The selector of the block, as the CSS shows it for the unique id `abc`.
	 *
	 * @var string
	 */
	private const ROOT = '.kb-block-show-more-containerabc';

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-show-more-css.php';
	}

	/**
	 * The selectors of the parts of the block.
	 *
	 * @dataProvider selectorProvider
	 *
	 * @param string   $part     The method that names the part.
	 * @param string[] $expected The selectors expected.
	 *
	 * @return void
	 */
	public function testSelectors( string $part, array $expected ): void {
		$this->assertSame( $expected, Kadence_Blocks_Show_More_Selector::$part() );
	}

	/**
	 * @return Generator
	 */
	public function selectorProvider(): Generator {
		$root   = '.kb-block-show-more-container{id}';
		$open   = $root . '.kb-smc-open';
		$button = ' > .wp-block-kadence-advancedbtn';

		yield 'root' => [
			'part'     => 'root',
			'expected' => [ $root ],
		];
		yield 'excerpt' => [
			'part'     => 'excerpt',
			'expected' => [ $root . ' > .kb-show-more-sr-excerpt' ],
		];
		yield 'buttons' => [
			'part'     => 'buttons',
			'expected' => [ $root . $button ],
		];
		yield 'column' => [
			'part'     => 'column',
			'expected' => [ $root . ' > .wp-block-kadence-column' ],
		];
		yield 'second button' => [
			'part'     => 'second_button',
			'expected' => [ $root . $button . ' .kt-btn-wrap:nth-child(2)', $root . $button . ' .wp-block-kadence-singlebtn:nth-of-type(2)' ],
		];
		yield 'expanded first button' => [
			'part'     => 'expanded_first_button',
			'expected' => [ $root . $button . ' .kt-btn-wrap:first-child', $root . $button . ' .wp-block-kadence-singlebtn:nth-of-type(1)' ],
		];
		yield 'open column' => [
			'part'     => 'open_column',
			'expected' => [ $open . ' > .wp-block-kadence-column' ],
		];
		yield 'open first button' => [
			'part'     => 'open_first_button',
			'expected' => [ $open . $button . ' .kt-btn-wrap:nth-child(1)', $open . $button . ' .wp-block-kadence-singlebtn:nth-of-type(1)' ],
		];
		yield 'open second button' => [
			'part'     => 'open_second_button',
			'expected' => [ $open . $button . ' .kt-btn-wrap:nth-child(2)', $open . $button . ' .wp-block-kadence-singlebtn:nth-of-type(2)' ],
		];
		yield 'open full width second button' => [
			'part'     => 'open_full_width_second_button',
			'expected' => [ $open . $button . '.kt-force-btn-fullwidth .kt-btn-wrap:nth-child(2)' ],
		];
	}

	/**
	 * The height limit is the saved height in the saved unit, the default height when none was saved and pixels when no unit was saved.
	 *
	 * @dataProvider maxHeightProvider
	 *
	 * @param string               $attribute  The attribute that stores the height.
	 * @param int|null             $fallback   The height when none was saved.
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testMaxHeight( string $attribute, ?int $fallback, array $attributes, string $expected ): void {
		$this->assertSame( $expected, $this->write_section( new Kadence_Blocks_Show_More_Max_Height( $attribute, $fallback ), $attributes, 'abc', '.x' ) );
	}

	/**
	 * @return Generator
	 */
	public function maxHeightProvider(): Generator {
		yield 'a saved height and unit' => [
			'attribute'  => 'heightDesktop',
			'fallback'   => 250,
			'attributes' => [
				'heightDesktop' => 300,
				'heightType'    => 'vh',
			],
			'expected'   => '.x{max-height:300vh;}',
		];
		yield 'the default height' => [
			'attribute'  => 'heightDesktop',
			'fallback'   => 250,
			'attributes' => [ 'heightType' => 'em' ],
			'expected'   => '.x{max-height:250em;}',
		];
		yield 'a height saved as null' => [
			'attribute'  => 'heightDesktop',
			'fallback'   => 250,
			'attributes' => [ 'heightDesktop' => null ],
			'expected'   => '.x{max-height:250px;}',
		];
		yield 'a height of zero' => [
			'attribute'  => 'heightDesktop',
			'fallback'   => 250,
			'attributes' => [ 'heightDesktop' => 0 ],
			'expected'   => '.x{max-height:0px;}',
		];
		yield 'the height of a device' => [
			'attribute'  => 'heightTablet',
			'fallback'   => null,
			'attributes' => [ 'heightTablet' => '150' ],
			'expected'   => '.x{max-height:150px;}',
		];
	}

	/**
	 * The fade out masks the end of the content: the saved size is how much of the content stays clear.
	 *
	 * @dataProvider fadeOutProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param int                  $clear      The percentage of the content that stays clear.
	 *
	 * @return void
	 */
	public function testFadeOut( array $attributes, int $clear ): void {
		$mask = 'linear-gradient(to bottom, black ' . $clear . '%, transparent 100%)';

		$this->assertSame( '.x{-webkit-mask-image:' . $mask . ';mask-image:' . $mask . ';}', $this->write_section( new Kadence_Blocks_Show_More_Fade_Out(), $attributes, 'abc', '.x' ) );
	}

	/**
	 * @return Generator
	 */
	public function fadeOutProvider(): Generator {
		yield 'a size' => [
			'attributes' => [ 'fadeOutSize' => 30 ],
			'clear'      => 70,
		];
		yield 'a size in text' => [
			'attributes' => [ 'fadeOutSize' => '20' ],
			'clear'      => 80,
		];
		yield 'a size of zero' => [
			'attributes' => [ 'fadeOutSize' => 0 ],
			'clear'      => 100,
		];
		yield 'a size over a hundred' => [
			'attributes' => [ 'fadeOutSize' => 150 ],
			'clear'      => 50,
		];
		yield 'no size' => [
			'attributes' => [],
			'clear'      => 50,
		];
		yield 'a size saved as null' => [
			'attributes' => [ 'fadeOutSize' => null ],
			'clear'      => 50,
		];
	}

	/**
	 * A block that starts closed limits its column, hides the button that closes it, and has the styles of its open state.
	 *
	 * @return void
	 */
	public function testBuilderOfAClosedBlock(): void {
		$buttons = self::ROOT . ' > .wp-block-kadence-advancedbtn';
		$open    = self::ROOT . '.kb-smc-open > .wp-block-kadence-advancedbtn';
		$column  = self::ROOT . ' > .wp-block-kadence-column';
		$expect  = self::ROOT . ' > .kb-show-more-sr-excerpt{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;}'
			. $buttons . '{margin-top:1em;}'
			. $buttons . ' .kt-btn-wrap:nth-child(2), ' . $buttons . ' .wp-block-kadence-singlebtn:nth-of-type(2){display:none;}'
			. $column . '{max-height:250px;overflow-y:hidden;}'
			. self::ROOT . '.kb-smc-open > .wp-block-kadence-column{max-height:none;-webkit-mask-image:none;mask-image:none;overflow-y:unset;}'
			. $open . ' .kt-btn-wrap:nth-child(1), ' . $open . ' .wp-block-kadence-singlebtn:nth-of-type(1){display:none;}'
			. $open . ' .kt-btn-wrap:nth-child(2), ' . $open . ' .wp-block-kadence-singlebtn:nth-of-type(2){display:inline-flex;}'
			. $open . '.kt-force-btn-fullwidth .kt-btn-wrap:nth-child(2){display:block;}';

		$this->assertSameCss( $expect, $this->build( $this->closed_block(), 'closed' ) );
	}

	/**
	 * Spacing, limits per device and the fade out are written, and a switch that is off hides the button that closes the open block.
	 *
	 * @return void
	 */
	public function testBuilderOfALimitedAndFadedBlock(): void {
		$attributes = array_merge(
			$this->closed_block(),
			[
				'marginDesktop' => [ 1, 2, 3, 4 ],
				'paddingMobile' => [ 5, '', '', '' ],
				'heightTablet'  => 200,
				'heightMobile'  => 100,
				'heightType'    => 'vh',
				'enableFadeOut' => true,
				'fadeOutSize'   => 30,
				'showHideMore'  => false,
			]
		);
		$css        = $this->build( $attributes, 'limited' );
		$column     = self::ROOT . ' > .wp-block-kadence-column';
		$mask       = 'linear-gradient(to bottom, black 70%, transparent 100%)';
		$open       = self::ROOT . '.kb-smc-open > .wp-block-kadence-advancedbtn';

		$this->assertStringContainsString( self::ROOT . '{margin-top:1px;margin-right:2px;margin-bottom:3px;margin-left:4px;}', $css );
		$this->assertStringContainsString( $column . '{max-height:250vh;overflow-y:hidden;}', $css );
		$this->assertStringContainsString( '@media all and (max-width: 1024px){' . $column . '{max-height:200vh;}}', $css );
		$this->assertStringContainsString( '@media all and (max-width: 767px){' . self::ROOT . '{padding-top:5px;}' . $column . '{max-height:100vh;}}', $css );
		$this->assertStringContainsString( $column . '{-webkit-mask-image:' . $mask . ';mask-image:' . $mask . ';}', $css );
		$this->assertStringContainsString( $open . ' .kt-btn-wrap:nth-child(2), ' . $open . ' .wp-block-kadence-singlebtn:nth-of-type(2){display:none;}', $css );
	}

	/**
	 * A device that starts open has no limit and no fade out, and no button that opens it.
	 *
	 * @return void
	 */
	public function testBuilderOfDevicesThatStartOpen(): void {
		$css    = $this->build(
			array_merge(
				$this->closed_block(),
				[
					'defaultExpandedDesktop' => true,
					'defaultExpandedMobile'  => true,
				] 
			),
			'open' 
		);
		$column = self::ROOT . ' > .wp-block-kadence-column';
		$first  = self::ROOT . ' > .wp-block-kadence-advancedbtn .kt-btn-wrap:first-child, ' . self::ROOT . ' > .wp-block-kadence-advancedbtn .wp-block-kadence-singlebtn:nth-of-type(1)';

		$this->assertStringContainsString( $column . '{max-height:none;-webkit-mask-image:none;mask-image:none;}' . $first . '{display:none;}', $css );
		$this->assertStringContainsString( '@media all and (max-width: 767px){' . $column . '{max-height:none;-webkit-mask-image:none;mask-image:none;}' . $first . '{display:none;}}', $css );
		$this->assertStringNotContainsString( '@media all and (max-width: 1024px)', $css );
	}

	/**
	 * A tablet that starts open, with a mobile that does not, limits the mobile again, fades it again and shows its button.
	 *
	 * @return void
	 */
	public function testBuilderOfATabletThatStartsOpenAndAMobileThatDoesNot(): void {
		$css    = $this->build(
			array_merge(
				$this->closed_block(),
				[
					'defaultExpandedTablet' => true,
					'enableFadeOut'         => true,
					'heightDesktop'         => 180,
					'heightType'            => 'em',
				] 
			),
			'tablet' 
		);
		$column = self::ROOT . ' > .wp-block-kadence-column';
		$mask   = 'linear-gradient(to bottom, black 50%, transparent 100%)';
		$first  = self::ROOT . ' > .wp-block-kadence-advancedbtn .kt-btn-wrap:first-child, ' . self::ROOT . ' > .wp-block-kadence-advancedbtn .wp-block-kadence-singlebtn:nth-of-type(1)';

		$this->assertStringContainsString( '@media all and (max-width: 1024px){' . $column . '{max-height:none;-webkit-mask-image:none;mask-image:none;}}', $css );
		$this->assertStringContainsString( '@media all and (max-width: 767px){' . $column . '{max-height:180em;overflow-y:hidden;-webkit-mask-image:' . $mask . ';mask-image:' . $mask . ';}' . $first . '{display:inline;}}', $css );
	}

	/**
	 * A tablet and a mobile that both start open leave the mobile open.
	 *
	 * @return void
	 */
	public function testBuilderOfATabletAndAMobileThatStartOpen(): void {
		$css = $this->build(
			array_merge(
				$this->closed_block(),
				[
					'defaultExpandedTablet' => true,
					'defaultExpandedMobile' => true,
				] 
			),
			'both' 
		);

		$this->assertStringNotContainsString( 'display:inline;', $css );
		$this->assertStringNotContainsString( 'overflow-y:hidden;-webkit-mask-image', $css );
	}

	/**
	 * The attributes of a show more block that starts closed, as the block saves them.
	 *
	 * @return array<string, mixed>
	 */
	private function closed_block(): array {
		return [
			'showHideMore'           => true,
			'defaultExpandedMobile'  => false,
			'defaultExpandedTablet'  => false,
			'defaultExpandedDesktop' => false,
			'heightDesktop'          => 250,
			'heightTablet'           => '',
			'heightMobile'           => '',
			'heightType'             => 'px',
			'enableFadeOut'          => false,
			'fadeOutSize'            => 50,
			'marginDesktop'          => [ '', '', '', '' ],
			'marginTablet'           => [ '', '', '', '' ],
			'marginMobile'           => [ '', '', '', '' ],
			'marginUnit'             => 'px',
			'paddingDesktop'         => [ '', '', '', '' ],
			'paddingTablet'          => [ '', '', '', '' ],
			'paddingMobile'          => [ '', '', '', '' ],
			'paddingUnit'            => 'px',
		];
	}

	/**
	 * Build the CSS of a show more block with the unique id `abc`.
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $style_id   The unique id of the style handle, different in every test.
	 *
	 * @return string
	 */
	private function build( array $attributes, string $style_id ): string {
		$context = new Kadence_Blocks_Css_Block_Context(
			'show-more',
			static function () {
				return null;
			}
		);

		return (string) ( new Kadence_Blocks_Show_More_Css( $context ) )->build( $attributes, new Kadence_Blocks_CSS(), 'abc', $style_id );
	}
}
