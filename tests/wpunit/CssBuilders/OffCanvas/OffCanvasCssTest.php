<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\OffCanvas;

use Generator;
use Tests\wpunit\CssBuilders\Entry_Build_Test_Case;

/**
 * The CSS of the off canvas block, with the block replaced by a fake that styles by size.
 */
final class OffCanvasCssTest extends Entry_Build_Test_Case {

	private const WRAP = '.wp-block-kadence-off-canvasabc .kb-off-canvas-inner-wrap';

	private const INNER = '.wp-block-kadence-off-canvasabc .kb-off-canvas-inner';

	private const CLOSE = '.wp-block-kadence-off-canvasabc .kb-off-canvas-close';

	private const HOVER = '.wp-block-kadence-off-canvasabc .kb-off-canvas-close:hover, .wp-block-kadence-off-canvasabc .kb-off-canvas-close:focus-visible';

	private const TABLET = '@media all and (max-width: 1024px)';

	private const MOBILE = '@media all and (max-width: 767px)';

	/**
	 * Load the builder.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-off-canvas-css.php';
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
		$this->assertSameCss( $expected, $this->build_entry( 'Kadence_Blocks_Off_Canvas_Css', 'off-canvas', $attributes, $this->sized_bridge() ) );
	}

	/**
	 * The off canvases and the CSS they get.
	 *
	 * @return Generator
	 */
	public function buildProvider(): Generator {
		yield 'an off canvas with no settings has no CSS' => [
			'attributes' => [],
			'expected'   => '',
		];

		yield 'the container gets its radius and its border, the inner container its padding' => [
			'attributes' => [
				'borderRadius'  => [ 1, 2, 3, 4 ],
				'border'        => [
					[
						'bottom' => [ '#111111', 'solid', 2 ],
						'unit'   => 'px',
					],
				],
				'paddingTablet' => [ 5, 6, 7, 8 ],
			],
			'expected'   => self::WRAP . '{border-bottom:2px solid #111111;border-top-left-radius:1px;border-top-right-radius:2px;border-bottom-right-radius:3px;border-bottom-left-radius:4px;}'
				. self::TABLET . '{' . self::WRAP . '{border-bottom:2px solid #111111;}' . self::INNER . '{padding-top:5px;padding-right:6px;padding-bottom:7px;padding-left:8px;}}'
				. self::MOBILE . '{' . self::WRAP . '{border-bottom:2px solid #111111;}}',
		];

		yield 'the close icon gets its padding and its margin in their own units, its radius and its border' => [
			'attributes' => [
				'closeIconPadding'      => [ 1, 2, 3, 4 ],
				'closeIconPaddingUnit'  => 'em',
				'closeIconMargin'       => [ 5, 6, 7, 8 ],
				'closeIconMarginUnit'   => 'rem',
				'closeIconBorderRadius' => [ 9, 9, 9, 9 ],
				'closeIconBorder'       => [
					[
						'left' => [ '#333333', 'dotted', 1 ],
						'unit' => 'px',
					],
				],
			],
			'expected'   => self::CLOSE . '{padding-top:1em;padding-right:2em;padding-bottom:3em;padding-left:4em;margin-top:5rem;margin-right:6rem;margin-bottom:7rem;margin-left:8rem;border-top-left-radius:9px;border-top-right-radius:9px;border-bottom-right-radius:9px;border-bottom-left-radius:9px;border-left:1px dotted #333333;}'
				. self::TABLET . '{' . self::CLOSE . '{border-left:1px dotted #333333;}}'
				. self::MOBILE . '{' . self::CLOSE . '{border-left:1px dotted #333333;}}',
		];

		yield 'the hover border of the close icon is written for its hover and its focus' => [
			'attributes' => [
				'closeIconBorderHover' => [
					[
						'top'  => [ '#444444', 'solid', 4 ],
						'unit' => 'px',
					],
				],
			],
			'expected'   => self::HOVER . '{border-top:4px solid #444444;}'
				. self::TABLET . '{' . self::HOVER . '{border-top:4px solid #444444;}}'
				. self::MOBILE . '{' . self::HOVER . '{border-top:4px solid #444444;}}',
		];

		yield 'the styles of the block by size are written first, for desktop, tablet and mobile, and the media state is desktop after them' => [
			'attributes' => [
				'dynamic' => true,
				'padding' => [ 1, 1, 1, 1 ],
			],
			'expected'   => '.dynamic-Desktop{size:Desktop;}'
				. self::TABLET . '{.dynamic-Tablet{size:Tablet;}}'
				. self::MOBILE . '{.dynamic-Mobile{size:Mobile;}}'
				. self::INNER . '{padding-top:1px;padding-right:1px;padding-bottom:1px;padding-left:1px;}',
		];
	}

	/**
	 * A fake block that styles by size and leaves the media state on the size that it styled last.
	 *
	 * @return callable
	 */
	private function sized_bridge(): callable {
		return static function ( string $member, ...$args ) {
			if ( 'sized_dynamic_styles' !== $member ) {
				return null;
			}

			[ $css, $attributes, , $size ] = $args;

			if ( empty( $attributes['dynamic'] ) ) {
				return null;
			}

			$css->set_media_state( strtolower( $size ) );
			$css->set_selector( '.dynamic-' . $size );
			$css->add_property( 'size', $size );

			return null;
		};
	}
}
