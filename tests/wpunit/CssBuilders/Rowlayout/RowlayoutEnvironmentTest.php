<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Rowlayout;

use Generator;
use Kadence_Blocks_Rowlayout_Breakout_Css;
use Kadence_Blocks_Rowlayout_Compat_Margin_Css;
use Kadence_Blocks_Rowlayout_Environment;
use Kadence_Blocks_Rowlayout_Inherited_Width_Css;
use Kadence_Blocks_Rowlayout_Site_Environment;

/**
 * The parts of the row layout that depend on the site: the theme, the content width, full site editing and GeneratePress.
 */
final class RowlayoutEnvironmentTest extends Rowlayout_Test_Case {

	private const BASE = '.kb-row-layout-idabc';

	private const VARIABLE_RIGHT = '--breakout-negative-margin-right:calc( ( ( ( var(--global-vw, 100vw) - ( %s - ( %s*2 ) ) ) / 2 ) *-1) + -1px);';

	private const VARIABLE_LEFT = '--breakout-negative-margin-left:calc( ( ( ( var(--global-vw, 100vw) - ( %s - ( %s*2 ) ) ) / 2 ) *-1) + -1px);';

	/**
	 * GeneratePress gets a margin that keeps its own styles from breaking the row.
	 *
	 * @dataProvider compatProvider
	 *
	 * @param bool   $generatepress Whether GeneratePress is active.
	 * @param string $expected      The CSS expected.
	 *
	 * @return void
	 */
	public function testCompatMargin( bool $generatepress, string $expected ): void {
		$section = new Kadence_Blocks_Rowlayout_Compat_Margin_Css( $this->environment( $generatepress ) );

		$this->assertSameCss( $expected, $this->write_row( $section, [ 'kbVersion' => 2 ] ) );
	}

	/**
	 * A row that inherits the width of the content takes it from the theme, or from the global styles.
	 *
	 * @dataProvider widthProvider
	 *
	 * @param Kadence_Blocks_Rowlayout_Environment $environment The site.
	 * @param string                               $expected    The CSS expected.
	 *
	 * @return void
	 */
	public function testInheritedWidth( Kadence_Blocks_Rowlayout_Environment $environment, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_row( new Kadence_Blocks_Rowlayout_Inherited_Width_Css( $environment ) ) );
	}

	/**
	 * A full width row breaks its columns out of the content, the way the site and the editor settings allow.
	 *
	 * @dataProvider breakoutProvider
	 *
	 * @param Kadence_Blocks_Rowlayout_Environment $environment The site.
	 * @param array<string, mixed>                 $attributes  The block attributes.
	 * @param bool                                 $media       Whether the site outputs media queries.
	 * @param string                               $expected    The CSS expected.
	 *
	 * @return void
	 */
	public function testBreakout( Kadence_Blocks_Rowlayout_Environment $environment, array $attributes, bool $media, string $expected ): void {
		$this->answers['get_global_styles_content_size_length'] = '1100px';

		if ( ! $media ) {
			add_filter( 'kadence_blocks_css_output_media_queries', '__return_false' );
		}

		$css = $this->write_row( new Kadence_Blocks_Rowlayout_Breakout_Css( $environment ), $attributes );

		remove_filter( 'kadence_blocks_css_output_media_queries', '__return_false' );

		$this->assertSameCss( $expected, $css );
	}

	/**
	 * Nothing breaks out unless the row inherits the width, is full width, has two columns that are not stacked and asks for it.
	 *
	 * @dataProvider notBreakingOutProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 *
	 * @return void
	 */
	public function testNoBreakout( array $attributes ): void {
		$section = new Kadence_Blocks_Rowlayout_Breakout_Css( $this->environment( false, false, 960 ) );

		$this->assertSame( '', $this->write_row( $section, $attributes ) );
	}

	/**
	 * The site environment tells what the site really offers.
	 *
	 * @return void
	 */
	public function testSiteEnvironment(): void {
		$kept        = $GLOBALS['content_width'] ?? null;
		$environment = new Kadence_Blocks_Rowlayout_Site_Environment();

		$GLOBALS['content_width'] = 777;

		$this->assertSame( 777, $environment->content_width() );
		$this->assertSame( class_exists( 'GeneratePress_CSS' ), $environment->has_generatepress() );
		$this->assertSame( class_exists( 'Kadence\Theme' ), $environment->has_kadence_theme() );
		$this->assertSame( kadence_blocks_is_fse_mode(), $environment->is_fse_mode() );

		unset( $GLOBALS['content_width'] );

		$this->assertNull( $environment->content_width() );

		$GLOBALS['content_width'] = $kept;
	}

	/**
	 * @return Generator
	 */
	public function compatProvider(): Generator {
		yield 'GeneratePress' => [
			'generatepress' => true,
			'expected'      => '{margin-bottom:0px;}',
		];
		yield 'another theme' => [
			'generatepress' => false,
			'expected'      => '',
		];
	}

	/**
	 * @return Generator
	 */
	public function widthProvider(): Generator {
		yield 'no content width' => [
			'environment' => $this->environment(),
			'expected'    => '{max-width:var(--wp--style--global--content-size);}',
		];
		yield 'a content width' => [
			'environment' => $this->environment( false, false, '960px' ),
			'expected'    => '{max-width:960px;}',
		];
		yield 'the Kadence theme' => [
			'environment' => $this->environment( false, true, 960 ),
			'expected'    => '{max-width:var( --global-content-width, 960px );padding-left:var(--global-content-edge-padding);padding-right:var(--global-content-edge-padding);}',
		];
	}

	/**
	 * @return Generator
	 */
	public function breakoutProvider(): Generator {
		$attributes = [
			'kbVersion'       => 2,
			'inheritMaxWidth' => true,
			'align'           => 'full',
			'columns'         => 2,
			'breakoutLeft'    => true,
			'breakoutRight'   => true,
			'padding'         => [ '', 20, '', 30 ],
			'paddingUnit'     => 'em',
		];
		$inner      = self::BASE . ' > .kt-row-column-wrap';
		$first      = $inner . ' > .wp-block-kadence-column:nth-child(1 of *:not(style))';
		$second     = $inner . ' > .wp-block-kadence-column:nth-child(2 of *:not(style))';
		$tablet     = $inner . ':not(.kt-tab-layout-row) > .wp-block-kadence-column:nth-child(%d of *:not(style))';
		$tablet_css = '@media all and (min-width: 768px) and (max-width: 1024px){' . sprintf( $tablet, 1 ) . '{margin-inline-start:calc( 30em *-1 );}' . sprintf( $tablet, 2 ) . '{margin-inline-end:calc( 20em *-1 );}}';
		$only       = '@media all and (min-width: 1025px){' . $first . '{margin-inline-start:calc( 30em *-1 );}' . $second . '{margin-inline-end:calc( 20em *-1 );}}';
		$variables  = self::BASE . '{' . sprintf( self::VARIABLE_RIGHT, '960px', '20em' ) . sprintf( self::VARIABLE_LEFT, '960px', '30em' ) . '}';

		yield 'the width of the theme starts the media query' => [
			'environment' => $this->environment( false, false, 960 ),
			'attributes'  => $attributes,
			'media'       => true,
			'expected'    => $variables . $only
				. '@media all and (min-width:960px){' . $first . ':not(.specificity){margin-inline-start:var(--breakout-negative-margin-left);}' . $second . ':not(.specificity){margin-inline-end:var(--breakout-negative-margin-right);}}'
				. $tablet_css,
		];
		yield 'the width of the global styles starts the media query in full site editing' => [
			'environment' => $this->environment( false, false, 960, true ),
			'attributes'  => $attributes,
			'media'       => true,
			'expected'    => $variables . $only
				. '@media all and (min-width:1100px){' . $first . ':not(.specificity){margin-inline-start:var(--breakout-negative-margin-left);}' . $second . ':not(.specificity){margin-inline-end:var(--breakout-negative-margin-right);}}'
				. $tablet_css,
		];
		yield 'no width to start from, so only desktop breaks out' => [
			'environment' => $this->environment(),
			'attributes'  => $attributes,
			'media'       => true,
			'expected'    => str_replace( '960px', 'var(--wp--style--global--content-size)', $variables ) . $only
				. '@media all and (min-width: 1025px){' . $first . '{margin-inline-start:var(--breakout-negative-margin-left);}' . $second . '{margin-inline-end:var(--breakout-negative-margin-right);}}'
				. $tablet_css,
		];
		yield 'the Kadence theme and the paddings of the theme' => [
			'environment' => $this->environment( false, true, 960 ),
			'attributes'  => [ 'padding' => [ '', null, '', null ] ] + $attributes,
			'media'       => true,
			'expected'    => self::BASE . '{' . sprintf( self::VARIABLE_RIGHT, 'var( --global-content-width, 960px )', 'var(--global-content-edge-padding)' ) . sprintf( self::VARIABLE_LEFT, 'var( --global-content-width, 960px )', 'var(--global-content-edge-padding)' ) . '}'
				. '@media all and (min-width: 1025px){' . $first . '{margin-inline-start:calc( var(--global-content-edge-padding) *-1 );}' . $second . '{margin-inline-end:calc( var(--global-content-edge-padding) *-1 );}}'
				. '@media all and (min-width:960px){' . $first . ':not(.specificity){margin-inline-start:var(--breakout-negative-margin-left);}' . $second . ':not(.specificity){margin-inline-end:var(--breakout-negative-margin-right);}}'
				. '@media all and (min-width: 768px) and (max-width: 1024px){' . sprintf( $tablet, 1 ) . '{margin-inline-start:calc( var(--global-content-edge-padding) *-1 );}' . sprintf( $tablet, 2 ) . '{margin-inline-end:calc( var(--global-content-edge-padding) *-1 );}}',
		];
		yield 'a padding that is a spacing variable, and only the left column breaks out' => [
			'environment' => $this->environment( false, false, 960 ),
			'attributes'  => [
				'padding'       => [ '', 'sm', '', '' ],
				'breakoutRight' => false,
			] + $attributes,
			'media'       => true,
			'expected'    => self::BASE . '{' . sprintf( self::VARIABLE_RIGHT, '960px', 'var(--global-kb-spacing-sm, 1.5rem)' ) . sprintf( self::VARIABLE_LEFT, '960px', '0px' ) . '}'
				. '@media all and (min-width: 1025px){' . $first . '{margin-inline-start:calc( 0px *-1 );}}'
				. '@media all and (min-width:960px){' . $first . ':not(.specificity){margin-inline-start:var(--breakout-negative-margin-left);}}'
				. '@media all and (min-width: 768px) and (max-width: 1024px){' . sprintf( $tablet, 1 ) . '{margin-inline-start:calc( 0px *-1 );}}',
		];
		// With the media queries switched off the CSS builder does not write the tablet rules at all.
		yield 'without media queries the margins fall back to the padding' => [
			'environment' => $this->environment( false, false, 960 ),
			'attributes'  => $attributes,
			'media'       => false,
			'expected'    => $variables
				. $first . '{margin-inline-start:calc( 30em *-1 );}' . $second . '{margin-inline-end:calc( 20em *-1 );}'
				. $first . ':not(.specificity){margin-inline-start:var(--breakout-negative-margin-left, calc( 30em *-1 ) );}' . $second . ':not(.specificity){margin-inline-end:var(--breakout-negative-margin-right, calc( 20em *-1 ));}',
		];
	}

	/**
	 * @return Generator
	 */
	public function notBreakingOutProvider(): Generator {
		$attributes = [
			'inheritMaxWidth' => true,
			'align'           => 'full',
			'columns'         => 2,
			'breakoutLeft'    => true,
		];

		yield 'width not inherited' => [ [ 'inheritMaxWidth' => false ] + $attributes ];
		yield 'not full width' => [ [ 'align' => 'wide' ] + $attributes ];
		yield 'three columns' => [ [ 'columns' => 3 ] + $attributes ];
		yield 'stacked' => [ [ 'colLayout' => 'row' ] + $attributes ];
		yield 'no breakout asked for' => [ [ 'breakoutLeft' => false ] + $attributes ];
	}
}
