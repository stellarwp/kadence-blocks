<?php

namespace Tests\wpunit\Blocks;

use Generator;
use Kadence_Blocks_Listitem_Block;
use Tests\wpunit\KadenceBlocksTestCase;
use WP_Block;

/**
 * Parent icon list values substituted into the icon list item markup.
 */
class ListitemParentContextTest extends KadenceBlocksTestCase {

	/**
	 * Markup the list item saves when it has no icon of its own.
	 *
	 * @var string
	 */
	private const CONTENT = '<li><img src="x.gif" alt="USE_PARENT_DEFAULT_ICON" data-width="USE_PARENT_DEFAULT_WIDTH" /></li>';

	/**
	 * A parent icon or width cannot break out of the attribute it is substituted into.
	 *
	 * @dataProvider contextProvider
	 *
	 * @param string $icon     The icon provided by the parent list.
	 * @param mixed  $width    The width provided by the parent list.
	 * @param string $expected The expected rendered markup.
	 *
	 * @return void
	 */
	public function testParentContextCannotBreakOutOfAttributes( string $icon, $width, string $expected ): void {
		$block = new WP_Block(
			[ 'blockName' => 'kadence/listitem' ],
			[
				'kadence/listIcon'      => $icon,
				'kadence/listIconWidth' => $width,
			]
		);

		$html = Kadence_Blocks_Listitem_Block::get_instance()->build_html( [], '10_cc33dd-44', self::CONTENT, $block );

		$this->assertSame( $expected, $html );
	}

	/**
	 * @return Generator
	 */
	public function contextProvider(): Generator {
		yield 'valid icon and width' => [
			'icon'     => 'fe_checkCircle',
			'width'    => 2,
			'expected' => '<li><img src="x.gif" alt="fe_checkCircle" data-width="2" /></li>',
		];

		yield 'decimal width' => [
			'icon'     => 'fas_apple-alt',
			'width'    => '1.5',
			'expected' => '<li><img src="x.gif" alt="fas_apple-alt" data-width="1.5" /></li>',
		];

		yield 'quote breakout in icon' => [
			'icon'     => 'fe_check_circle"_id_"1',
			'width'    => 2,
			'expected' => '<li><img src="x.gif" alt="fe_check_circle_id_1" data-width="2" /></li>',
		];

		yield 'quote breakout in width' => [
			'icon'     => 'fe_checkCircle',
			'width'    => '2" onerror="alert(1)',
			'expected' => '<li><img src="x.gif" alt="fe_checkCircle" data-width="2" /></li>',
		];

		yield 'empty width falls back to default' => [
			'icon'     => 'fe_checkCircle',
			'width'    => '',
			'expected' => '<li><img src="x.gif" alt="fe_checkCircle" data-width="2" /></li>',
		];
	}
}
