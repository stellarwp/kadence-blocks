<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Table;

/**
 * Stands for the table block of Kadence Blocks Pro.
 */
final class Pro_Table_Block_Stub {

	/**
	 * How many times the block built its CSS.
	 *
	 * @var int
	 */
	public static $built = 0;

	/**
	 * Count the build.
	 *
	 * @return void
	 */
	public function build_css() {
		++self::$built;
	}
}
