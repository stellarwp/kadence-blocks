<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Search;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Search_Feather_Condition;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * The condition of the search CSS that tells a Feather icon from any other icon.
 */
final class SearchSectionsTest extends Free_Section_Test_Case {

	/**
	 * The condition is met for the icons that are drawn with a stroke.
	 *
	 * @dataProvider iconProvider
	 *
	 * @param mixed $icon     The stored icon name.
	 * @param bool  $expected Whether the icon is a Feather icon.
	 *
	 * @return void
	 */
	public function testFeatherCondition( $icon, bool $expected ): void {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/search/loader.php';

		$condition = new Kadence_Blocks_Search_Feather_Condition( 'icon' );

		$this->assertSame( $expected, $condition->is_met( $this->input( [ 'icon' => $icon ], new Kadence_Blocks_CSS() ) ) );
	}

	/**
	 * @return Generator
	 */
	public function iconProvider(): Generator {
		yield 'a Feather icon' => [
			'icon'     => 'fe_search',
			'expected' => true,
		];
		yield 'only the first two letters count' => [
			'icon'     => 'feather',
			'expected' => true,
		];
		yield 'another icon set' => [
			'icon'     => 'fa_search',
			'expected' => false,
		];
		yield 'a name that is too short' => [
			'icon'     => 'f',
			'expected' => false,
		];
		yield 'an empty name' => [
			'icon'     => '',
			'expected' => false,
		];
		yield 'no name' => [
			'icon'     => null,
			'expected' => false,
		];
	}
}
