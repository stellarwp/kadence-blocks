<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Table;

use Generator;
use Tests\wpunit\CssBuilders\Entry_Build_Test_Case;

/**
 * The CSS of the blocks of the cells of a table: the row and the data.
 */
final class TableRowDataCssTest extends Entry_Build_Test_Case {

	private const ROW = '.kb-table-container .kb-table tr.kb-table-rowabc';

	private const ROW_HOVER = '.kb-table-container  .kb-table tr.kb-table-rowabc:hover';

	private const TABLET = '@media all and (max-width: 1024px)';

	/**
	 * Load the builders.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-table-row-css.php';
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-table-data-css.php';
	}

	/**
	 * The CSS built for the attributes is the CSS expected.
	 *
	 * @dataProvider buildProvider
	 *
	 * @param string               $builder    The class of the builder.
	 * @param string               $block_name The name of the block.
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testBuild( string $builder, string $block_name, array $attributes, string $expected ): void {
		$this->assertSameCss( $expected, $this->build_entry( $builder, $block_name, $attributes ) );
	}

	/**
	 * The cells and the CSS they get.
	 *
	 * @return Generator
	 */
	public function buildProvider(): Generator {
		yield 'a row has a background, a height on every device and a hover background' => [
			'builder'    => 'Kadence_Blocks_Table_Row_Css',
			'block_name' => 'table-row',
			'attributes' => [
				'backgroundColor'      => '#111111',
				'backgroundHoverColor' => '#222222',
				'minHeight'            => 30,
				'tabletMinHeight'      => 40,
			],
			'expected'   => self::ROW . '{background-color:#111111;height:30px;}'
				. self::TABLET . '{' . self::ROW . '{height:40px;}}'
				. self::ROW_HOVER . '{background-color:#222222;}',
		];

		yield 'a row without a color has no background' => [
			'builder'    => 'Kadence_Blocks_Table_Row_Css',
			'block_name' => 'table-row',
			'attributes' => [
				'backgroundColor'      => '',
				'backgroundHoverColor' => '',
			],
			'expected'   => '',
		];

		yield 'the padding of the data is written for its cell and its header cell' => [
			'builder'    => 'Kadence_Blocks_Table_Data_Css',
			'block_name' => 'table-data',
			'attributes' => [ 'padding' => [ 1, 2, 3, 4 ] ],
			'expected'   => '.kb-table-container tr td.kb-table-dataabc, .kb-table-container tr th.kb-table-dataabc{padding-top:1px;padding-right:2px;padding-bottom:3px;padding-left:4px;}',
		];
	}
}
