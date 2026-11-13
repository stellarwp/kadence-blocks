<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Sections;

use Generator;
use Kadence_Blocks_Css_Device_Keys;
use Tests\Support\Classes\TestCase;

/**
 * The names of the attributes that store a value on every device.
 */
final class DeviceKeysTest extends TestCase {

	/**
	 * Load the classes.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
	}

	/**
	 * The arguments name the Tablet and Mobile twins of an attribute, and the unit only when there is one.
	 *
	 * @dataProvider argumentsProvider
	 *
	 * @param string               $name      The attribute on desktop.
	 * @param string|null          $unit_name The attribute of the unit.
	 * @param array<string, mixed> $expected  The arguments expected.
	 *
	 * @return void
	 */
	public function testArguments( string $name, ?string $unit_name, array $expected ): void {
		$this->assertSame( $expected, Kadence_Blocks_Css_Device_Keys::arguments( $name, $unit_name ) );
	}

	/**
	 * The attributes and the arguments they get.
	 *
	 * @return Generator
	 */
	public function argumentsProvider(): Generator {
		yield 'an attribute without a unit' => [
			'name'      => 'padding',
			'unit_name' => null,
			'expected'  => [
				'desktop_key' => 'padding',
				'tablet_key'  => 'paddingTablet',
				'mobile_key'  => 'paddingMobile',
			],
		];

		yield 'an attribute with a unit' => [
			'name'      => 'closeIconMargin',
			'unit_name' => 'closeIconMarginUnit',
			'expected'  => [
				'desktop_key' => 'closeIconMargin',
				'tablet_key'  => 'closeIconMarginTablet',
				'mobile_key'  => 'closeIconMarginMobile',
				'unit_key'    => 'closeIconMarginUnit',
			],
		];
	}
}
