<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Testimonial;

use Generator;
use Tests\wpunit\CssBuilders\Entry_Build_Test_Case;

/**
 * The CSS of the testimonial block, with the exact rules for a few testimonials.
 */
final class TestimonialCssTest extends Entry_Build_Test_Case {

	private const ICON = '.kt-testimonial-item-abc .kt-svg-testimonial-icon svg';

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-testimonial-css.php';
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
		$this->assertSameCss( $expected, $this->build_entry( 'Kadence_Blocks_Testimonial_Css', 'testimonial', $attributes ) );
	}

	/**
	 * @return Generator
	 */
	public function buildProvider(): Generator {
		yield 'an icon is sized on the tablet and the mobile, a size of zero included' => [
			'attributes' => [
				'media'       => 'icon',
				'tabletIsize' => '30',
				'mobileIsize' => 0,
			],
			'expected'   => '@media all and (max-width: 1024px){' . self::ICON . '{width:30px;height:30px;}}'
				. '@media all and (max-width: 767px){' . self::ICON . '{width:0px;height:0px;}}',
		];

		yield 'a device without a number as its size is left alone' => [
			'attributes' => [
				'media'       => 'icon',
				'tabletIsize' => 'wide',
				'mobileIsize' => 12.5,
				'isize'       => 40,
			],
			'expected'   => '@media all and (max-width: 767px){' . self::ICON . '{width:12.5px;height:12.5px;}}',
		];

		yield 'an image has no icon to size' => [
			'attributes' => [
				'media'       => 'image',
				'tabletIsize' => 30,
			],
			'expected'   => '',
		];

		yield 'a testimonial that sets no media has nothing to write' => [
			'attributes' => [],
			'expected'   => '',
		];
	}
}
