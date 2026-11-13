<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Vector;

use Generator;
use Tests\wpunit\CssBuilders\Entry_Build_Test_Case;

/**
 * The CSS of the vector block, with the exact rules for a few vectors.
 */
final class VectorCssTest extends Entry_Build_Test_Case {

	private const BOX = '.kb-vector-containerabc';

	private const TABLET = '@media all and (max-width: 1024px)';

	private const MOBILE = '@media all and (max-width: 767px)';

	/**
	 * Load the builder.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-vector-css.php';
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
		$this->assertSameCss( $expected, $this->build_entry( 'Kadence_Blocks_Vector_Css', 'vector', $attributes ) );
	}

	/**
	 * The vectors and the CSS they get.
	 *
	 * @return Generator
	 */
	public function buildProvider(): Generator {
		yield 'a vector without an alignment is centered' => [
			'attributes' => [ 'id' => 1 ],
			'expected'   => self::BOX . '{display:flex;justify-content:center;}',
		];

		yield 'a vector with an alignment is left to its alignment' => [
			'attributes' => [ 'align' => 'left' ],
			'expected'   => '',
		];

		yield 'the margin and the padding are written for every device in the unit of the block' => [
			'attributes' => [
				'align'         => 'wide',
				'margin'        => [ 1, 2, 3, 4 ],
				'marginType'    => 'em',
				'padding'       => [ 5, 6, 7, 8 ],
				'tabletPadding' => [ 9, 10, 11, 12 ],
			],
			'expected'   => self::BOX . '{margin-top:1em;margin-right:2em;margin-bottom:3em;margin-left:4em;padding-top:5px;padding-right:6px;padding-bottom:7px;padding-left:8px;}'
				. self::TABLET . '{' . self::BOX . '{padding-top:9px;padding-right:10px;padding-bottom:11px;padding-left:12px;}}',
		];

		yield 'the maximum width of the image is written for every device' => [
			'attributes' => [
				'align'        => 'left',
				'maxWidth'     => [ 100, 200, 300 ],
				'maxWidthUnit' => '%',
			],
			'expected'   => self::BOX . ' svg{max-width:100%;}'
				. self::TABLET . '{' . self::BOX . ' svg{max-width:200%;}}'
				. self::MOBILE . '{' . self::BOX . ' svg{max-width:300%;}}',
		];

		yield 'a maximum width that is not a number is not written' => [
			'attributes' => [
				'align'    => 'left',
				'maxWidth' => [ 'wide', '', 40 ],
			],
			'expected'   => self::MOBILE . '{' . self::BOX . ' svg{max-width:40px;}}',
		];
	}
}
