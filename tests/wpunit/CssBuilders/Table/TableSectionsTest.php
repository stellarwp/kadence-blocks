<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Table;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Table_Column_Background_Css;
use Kadence_Blocks_Table_Column_Backgrounds_Css;
use Kadence_Blocks_Table_Column_Settings_Css;
use Kadence_Blocks_Table_Column_Width_Css;
use Kadence_Blocks_Table_Environment;
use Kadence_Blocks_Table_Pro_Styles_Css;
use Kadence_Blocks_Table_Selector_Css;
use Kadence_Blocks_Table_Site_Environment;

/**
 * The sections of the table CSS, one by one.
 */
final class TableSectionsTest extends Table_Test_Case {

	private const TABLET = '@media all and (max-width: 1024px)';

	private const MOBILE = '@media all and (max-width: 767px)';

	private const CELLS = '.kb-table-container .kb-table';

	/**
	 * A section writes the CSS expected for the attributes.
	 *
	 * @dataProvider sectionProvider
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 * @param string                     $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testSection( Kadence_Blocks_Css_Section $section, array $attributes, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_table( $section, $attributes ) );
	}

	/**
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		$this->load();

		yield 'a selector with the escaped unique id' => [
			'section'    => new Kadence_Blocks_Table_Selector_Css( '.kb-table{id} tr, .kb-table{id} th' ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'a column with a width in percent' => [
			'section'    => new Kadence_Blocks_Table_Column_Width_Css( 1, [ 'width' => 20 ] ),
			'attributes' => [],
			'expected'   => '.kb-tableabc tr > *:nth-child(2){width:20%;}',
		];
		yield 'a column with a width and a unit on every device' => [
			'section'    => new Kadence_Blocks_Table_Column_Width_Css(
				0,
				[
					'width'       => 100,
					'unit'        => 'px',
					'widthTablet' => 50,
					'unitTablet'  => 'em',
					'widthMobile' => 40,
				]
			),
			'attributes' => [],
			'expected'   => '.kb-tableabc tr > *:nth-child(1){width:100px;}' . self::TABLET . '{.kb-tableabc tr > *:nth-child(1){width:50em;}}' . self::MOBILE . '{.kb-tableabc tr > *:nth-child(1){width:40em;}}',
		];
		yield 'a column whose mobile width has its own unit' => [
			'section'    => new Kadence_Blocks_Table_Column_Width_Css(
				0,
				[
					'width'       => 10,
					'widthMobile' => 40,
					'unitMobile'  => 'vw',
				]
			),
			'attributes' => [],
			'expected'   => '.kb-tableabc tr > *:nth-child(1){width:10%;}' . self::MOBILE . '{.kb-tableabc tr > *:nth-child(1){width:40vw;}}',
		];
		yield 'a unit of tablet is only kept when it has a width' => [
			'section'    => new Kadence_Blocks_Table_Column_Width_Css(
				0,
				[
					'unit'        => 'px',
					'unitTablet'  => 'em',
					'widthMobile' => 40,
				]
			),
			'attributes' => [],
			'expected'   => self::MOBILE . '{.s{width:40px;}}',
		];
		yield 'a column with an empty width writes nothing' => [
			'section'    => new Kadence_Blocks_Table_Column_Width_Css( 0, [ 'width' => '' ] ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'a column saved as a string writes nothing' => [
			'section'    => new Kadence_Blocks_Table_Column_Width_Css( 0, 'abc' ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'no column settings' => [
			'section'    => new Kadence_Blocks_Table_Column_Settings_Css(),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'column settings saved as a string' => [
			'section'    => new Kadence_Blocks_Table_Column_Settings_Css(),
			'attributes' => [ 'columnSettings' => 'abc' ],
			'expected'   => '',
		];
		yield 'only automatic columns leave the layout alone' => [
			'section'    => new Kadence_Blocks_Table_Column_Settings_Css(),
			'attributes' => [ 'columnSettings' => [ [ 'useAuto' => true ], [ 'useAuto' => 1 ] ] ],
			'expected'   => '',
		];
		yield 'a fixed column fixes the layout' => [
			'section'    => new Kadence_Blocks_Table_Column_Settings_Css(),
			'attributes' => [ 'columnSettings' => [ [ 'useAuto' => true ], [ 'width' => 30 ] ] ],
			'expected'   => '.kb-tableabc tr > *:nth-child(2){width:30%;}.kb-tableabc{table-layout:fixed;width:100%;}',
		];
		yield 'a column with no width still fixes the layout' => [
			'section'    => new Kadence_Blocks_Table_Column_Settings_Css(),
			'attributes' => [ 'columnSettings' => [ [ 'unit' => 'px' ] ] ],
			'expected'   => '.kb-tableabc{table-layout:fixed;width:100%;}',
		];
		yield 'the background of a column' => [
			'section'    => new Kadence_Blocks_Table_Column_Background_Css( 1, '#f00', '' ),
			'attributes' => [],
			'expected'   => self::CELLS . 'abc td:nth-of-type(2){background-color:#f00;}' . self::CELLS . 'abc th:nth-of-type(2){background-color:#f00;}',
		];
		yield 'the background of a column when the first column holds the headers' => [
			'section'    => new Kadence_Blocks_Table_Column_Background_Css( 1, '#f00', ':hover' ),
			'attributes' => [ 'isFirstColumnHeader' => true ],
			'expected'   => self::CELLS . 'abc td:nth-of-type(1):hover{background-color:#f00;}' . self::CELLS . 'abc th:nth-of-type(2):hover{background-color:#f00;}',
		];
		yield 'the backgrounds of the columns skip the ones with no color' => [
			'section'    => new Kadence_Blocks_Table_Column_Backgrounds_Css( 'columnBackgrounds', '' ),
			'attributes' => [ 'columnBackgrounds' => [ '', '#00f', '0', null ] ],
			'expected'   => self::CELLS . 'abc td:nth-of-type(2){background-color:#00f;}' . self::CELLS . 'abc th:nth-of-type(2){background-color:#00f;}',
		];
		yield 'no backgrounds of the columns' => [
			'section'    => new Kadence_Blocks_Table_Column_Backgrounds_Css( 'columnBackgrounds', '' ),
			'attributes' => [],
			'expected'   => '',
		];
	}

	/**
	 * The selector set is the one with the unique id escaped, whatever follows is written under it.
	 *
	 * @return void
	 */
	public function testSelectorHasTheEscapedUniqueId(): void {
		$css = new Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test' );

		( new Kadence_Blocks_Table_Selector_Css( '.kb-table{id} tr, .kb-table{id} th' ) )->write( $this->table_input( [], $css ) );
		$css->add_property( 'color', 'red' );

		$this->assertSameCss( '.kb-tableabc tr, .kb-tableabc th{color:red;}', $css->css_output() );
	}

	/**
	 * A column of the table fails the way it always did when its position cannot be added to.
	 *
	 * @return void
	 */
	public function testColumnWithAPositionThatIsNoNumberFails(): void {
		$this->expectException( \TypeError::class );

		$this->write_table( new Kadence_Blocks_Table_Column_Width_Css( 'a', [ 'width' => 5 ] ) );
	}

	/**
	 * The backgrounds of the columns saved as a string cannot be walked: nothing is written, with a warning as it always had.
	 *
	 * @return void
	 */
	public function testBackgroundsSavedAsStringWriteNothing(): void {
		$warnings = 0;

		set_error_handler(
			static function () use ( &$warnings ) {
				++$warnings;

				return true;
			}
		);

		$css = $this->write_table( new Kadence_Blocks_Table_Column_Backgrounds_Css( 'columnBackgrounds', '' ), [ 'columnBackgrounds' => 'abc' ] );

		restore_error_handler();

		$this->assertSame( '', $css );
		$this->assertSame( 1, $warnings );
	}

	/**
	 * The CSS of the Pro table is written first, through what the site offers, with the ids the block was given.
	 *
	 * @return void
	 */
	public function testProStylesAreWrittenByTheEnvironment(): void {
		$environment = new class() implements Kadence_Blocks_Table_Environment {
			/**
			 * What the environment was asked to write.
			 *
			 * @var array<int, mixed>
			 */
			public $asked = [];

			/**
			 * Remember what was asked.
			 *
			 * @param array              $attributes      The block attributes.
			 * @param Kadence_Blocks_CSS $css             The CSS builder.
			 * @param string             $unique_id       The block unique id.
			 * @param string             $unique_style_id The unique id used for the style handle.
			 *
			 * @return void
			 */
			public function write_pro_styles( $attributes, $css, $unique_id, $unique_style_id ): void {
				$this->asked = [ $attributes, $unique_id, $unique_style_id ];
			}
		};

		$this->write_table( new Kadence_Blocks_Table_Pro_Styles_Css( $environment ), [ 'a' => 1 ] );

		$this->assertSame( [ [ 'a' => 1 ], 'raw', 'raw' ], $environment->asked );
	}

	/**
	 * The site writes the Pro table only when Kadence Blocks Pro is active and has the block.
	 *
	 * @dataProvider siteProvider
	 *
	 * @param string $plugin_class The class that tells the plugin is active.
	 * @param string $block_class  The class of the Pro table block.
	 * @param int    $expected     How many times the Pro block built its CSS.
	 *
	 * @return void
	 */
	public function testSiteWritesProStylesWhenProIsActive( string $plugin_class, string $block_class, int $expected ): void {
		Pro_Table_Block_Stub::$built = 0;

		( new Kadence_Blocks_Table_Site_Environment( $plugin_class, $block_class ) )->write_pro_styles( [], new Kadence_Blocks_CSS(), 'raw', 'raw' );

		$this->assertSame( $expected, Pro_Table_Block_Stub::$built );
	}

	/**
	 * @return Generator
	 */
	public function siteProvider(): Generator {
		yield 'both are there' => [
			'plugin_class' => Pro_Plugin_Stub::class,
			'block_class'  => Pro_Table_Block_Stub::class,
			'expected'     => 1,
		];
		yield 'the plugin is not there' => [
			'plugin_class' => 'Kadence_Blocks_Missing_Plugin',
			'block_class'  => Pro_Table_Block_Stub::class,
			'expected'     => 0,
		];
		yield 'the block is not there' => [
			'plugin_class' => Pro_Plugin_Stub::class,
			'block_class'  => 'Kadence_Blocks_Missing_Block',
			'expected'     => 0,
		];
	}

	/**
	 * The site in the tests has no Kadence Blocks Pro, so the real environment writes nothing.
	 *
	 * @return void
	 */
	public function testTheRealSiteHasNoProTable(): void {
		$css = new Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test' );

		( new Kadence_Blocks_Table_Site_Environment() )->write_pro_styles( [], $css, 'raw', 'raw' );

		$this->assertSame( '', $css->css_output() );
	}

	/**
	 * Load the classes the providers build their data from, as the providers run before the set up.
	 *
	 * @return void
	 */
	private function load(): void {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/table/loader.php';
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
	}
}
