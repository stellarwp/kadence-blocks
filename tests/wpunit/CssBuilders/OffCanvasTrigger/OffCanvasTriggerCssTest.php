<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\OffCanvasTrigger;

use Generator;
use Tests\wpunit\CssBuilders\Entry_Build_Test_Case;

/**
 * The CSS of the off canvas trigger block, with the block replaced by a fake that styles by size.
 */
final class OffCanvasTriggerCssTest extends Entry_Build_Test_Case {

	private const TRIGGER = '.wp-block-kadence-off-canvas-triggerabc';

	private const TABLET = '@media all and (max-width: 1024px)';

	private const MOBILE = '@media all and (max-width: 767px)';

	/**
	 * Load the builder.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-off-canvas-trigger-css.php';
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
		$this->assertSameCss( $expected, $this->build_entry( 'Kadence_Blocks_Off_Canvas_Trigger_Css', 'off-canvas-trigger', $attributes, $this->sized_bridge() ) );
	}

	/**
	 * The triggers and the CSS they get.
	 *
	 * @return Generator
	 */
	public function buildProvider(): Generator {
		yield 'a trigger with no settings has no CSS' => [
			'attributes' => [],
			'expected'   => '',
		];

		yield 'the measures of the trigger are written for the trigger and its hover state' => [
			'attributes' => [
				'padding'      => [ 1, 2, 3, 4 ],
				'marginTablet' => [ 5, 6, 7, 8 ],
				'borderRadius' => [ 9, 9, 9, 9 ],
			],
			'expected'   => self::TRIGGER . ', ' . self::TRIGGER . ':hover{padding-top:1px;padding-right:2px;padding-bottom:3px;padding-left:4px;border-top-left-radius:9px;border-top-right-radius:9px;border-bottom-right-radius:9px;border-bottom-left-radius:9px;}'
				. self::TABLET . '{' . self::TRIGGER . ', ' . self::TRIGGER . ':hover{margin-top:5px;margin-right:6px;margin-bottom:7px;margin-left:8px;}}',
		];

		yield 'the border is written for the trigger and the hover border for the hover state' => [
			'attributes' => [
				'border'      => [
					[
						'top'  => [ '#111111', 'solid', 2 ],
						'unit' => 'px',
					],
				],
				'borderHover' => [
					[
						'left' => [ '#222222', 'dashed', 3 ],
						'unit' => 'px',
					],
				],
			],
			'expected'   => self::TRIGGER . ', ' . self::TRIGGER . ':hover{border-top:2px solid #111111;}' . self::TRIGGER . ':hover{border-left:3px dashed #222222;}'
				. self::TABLET . '{' . self::TRIGGER . ', ' . self::TRIGGER . ':hover{border-top:2px solid #111111;}' . self::TRIGGER . ':hover{border-left:3px dashed #222222;}}'
				. self::MOBILE . '{' . self::TRIGGER . ', ' . self::TRIGGER . ':hover{border-top:2px solid #111111;}' . self::TRIGGER . ':hover{border-left:3px dashed #222222;}}',
		];

		yield 'the styles of the block by size are written first, for desktop, tablet and mobile, and the media state is desktop after them' => [
			'attributes' => [
				'dynamic' => true,
				'padding' => [ 1, 1, 1, 1 ],
			],
			'expected'   => '.dynamic-Desktop{size:Desktop;}'
				. self::TABLET . '{.dynamic-Tablet{size:Tablet;}}'
				. self::MOBILE . '{.dynamic-Mobile{size:Mobile;}}'
				. self::TRIGGER . ', ' . self::TRIGGER . ':hover{padding-top:1px;padding-right:1px;padding-bottom:1px;padding-left:1px;}',
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
