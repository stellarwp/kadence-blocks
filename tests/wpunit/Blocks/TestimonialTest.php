<?php

namespace Tests\wpunit\Blocks;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Testimonial_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class TestimonialTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'testimonial';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Testimonial_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Testimonial_Block();
	}

	private const MEDIA_STYLES = [ [ 'width' => 60, 'backgroundSize' => 'cover' ] ];

	public function testIconColorIsEscaped() {
		$attributes = [ 'uniqueID' => '9_c', 'media' => 'icon', 'icon' => 'fe_star', 'ititle' => '', 'color' => 'red" onmouseover="alert(1)', 'isize' => 48 ];
		$html       = $this->invokeMethod( $this->block, 'render_media', [ $attributes, self::MEDIA_STYLES, 'inlineimage', 300 ] );

		$this->assertStringContainsString( 'kt-svg-testimonial-icon', $html );
		$this->assertStringNotContainsString( 'onmouseover="', $html );
	}

	public function testMediaImageUrlIsEscaped() {
		$attributes = [ 'uniqueID' => '9_u', 'media' => 'image', 'icon' => '', 'url' => 'https://x/a.jpg" onerror="alert(1)' ];
		$html       = $this->invokeMethod( $this->block, 'render_media', [ $attributes, self::MEDIA_STYLES, 'inlineimage', 300 ] );

		$this->assertStringContainsString( 'kt-testimonial-image', $html );
		$this->assertStringNotContainsString( 'onerror="', $html );
	}

	public function testGlobalIconClassIsEscaped() {
		$icon_styles = [ [ 'icon' => 'fe_aperture" onmouseover="alert(1)', 'stroke' => 2, 'title' => '' ] ];
		$html        = $this->invokeMethod( $this->block, 'render_icon', [ [ 'uniqueID' => '9_i' ], $icon_styles ] );

		$this->assertStringContainsString( 'kt-svg-testimonial-global-icon-icon-', $html );
		$this->assertStringNotContainsString( 'onmouseover="', $html );
	}

	public function testValidIconColorRendersUnchanged() {
		$attributes = [ 'uniqueID' => '9_c', 'media' => 'icon', 'icon' => 'fe_star', 'ititle' => '', 'color' => '#123456', 'isize' => 48 ];
		$html       = $this->invokeMethod( $this->block, 'render_media', [ $attributes, self::MEDIA_STYLES, 'inlineimage', 300 ] );

		$this->assertStringContainsString( 'color: #123456', $html );
	}

	/**
	 * An icon testimonial prints each tablet or mobile icon size it has under that device's breakpoint, as the
	 * editor previews them.
	 *
	 * @dataProvider iconSizesProvider
	 *
	 * @param array<string, mixed>  $sizes    The testimonial's tablet and mobile icon sizes.
	 * @param array<string, string> $expected The printed sizes, keyed by device.
	 *
	 * @return void
	 */
	public function testTheIconPrintsItsTabletAndMobileSizes( array $sizes, array $expected ): void {
		$css = $this->build_css(
			array_merge(
				[
					'media' => 'icon',
					'isize' => 50,
				],
				$sizes
			)
		);

		$this->assertSame( $expected, $this->icon_sizes( $css ) );
	}

	/**
	 * @return Generator
	 */
	public function iconSizesProvider(): Generator {
		yield 'tablet and mobile' => [
			'sizes'    => [
				'tabletIsize' => 40,
				'mobileIsize' => 30,
			],
			'expected' => [
				'tablet' => '40px',
				'mobile' => '30px',
			],
		];
		yield 'tablet only' => [
			'sizes'    => [
				'tabletIsize' => 40,
				'mobileIsize' => '',
			],
			'expected' => [ 'tablet' => '40px' ],
		];
		yield 'mobile only' => [
			'sizes'    => [
				'tabletIsize' => '',
				'mobileIsize' => 30,
			],
			'expected' => [ 'mobile' => '30px' ],
		];
	}

	/**
	 * A testimonial without tablet or mobile icon sizes, or without an icon, prints no icon size rules.
	 *
	 * @dataProvider noIconSizeRulesProvider
	 *
	 * @param array<string, mixed> $attributes The testimonial's attributes.
	 *
	 * @return void
	 */
	public function testNoIconSizeRulesPrint( array $attributes ): void {
		$this->assertSame( '', $this->build_css( $attributes ) );
	}

	/**
	 * @return Generator
	 */
	public function noIconSizeRulesProvider(): Generator {
		yield 'icon with a desktop size only' => [
			'attributes' => [
				'media'       => 'icon',
				'isize'       => 50,
				'tabletIsize' => '',
				'mobileIsize' => '',
			],
		];
		yield 'image' => [
			'attributes' => [
				'media'       => 'image',
				'tabletIsize' => 40,
				'mobileIsize' => 30,
			],
		];
	}

	/**
	 * Builds a testimonial's CSS from a clean slate.
	 *
	 * @param array<string, mixed> $attributes The testimonial's attributes.
	 *
	 * @return string The CSS.
	 */
	private function build_css( array $attributes ): string {
		Kadence_Blocks_CSS::$styles = [];

		return $this->block->build_css( $attributes, Kadence_Blocks_CSS::get_instance(), '9_s', '9_s' );
	}

	/**
	 * Returns the icon sizes the CSS prints, keyed by the device whose breakpoint holds them.
	 *
	 * @param string $css The CSS.
	 *
	 * @return array<string, string> The sizes, keyed tablet or mobile, in print order.
	 */
	private function icon_sizes( string $css ): array {
		$devices = [
			'1024' => 'tablet',
			'767'  => 'mobile',
		];
		preg_match_all( '/\(max-width: ?(1024|767)px\)\s*\{\s*\.kt-testimonial-item-9_s \.kt-svg-testimonial-icon svg\{width:([^;]+);height:\2;\}/', $css, $matches );

		$sizes = [];
		foreach ( $matches[1] as $index => $breakpoint ) {
			$sizes[ $devices[ $breakpoint ] ] = $matches[2][ $index ];
		}

		return $sizes;
	}
}
