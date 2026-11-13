<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Videopopup;

use Kadence_Blocks_CSS;

/**
 * A fake Pro video popup block that records how it was called.
 */
final class Fake_Pro_Video_Popup_Block {

	/**
	 * The arguments of the last build_css call.
	 *
	 * @var array<int, mixed>
	 */
	public static $arguments = [];

	/**
	 * Record the call and write a rule.
	 *
	 * @param array              $attributes      The block attributes.
	 * @param Kadence_Blocks_CSS $css             The CSS builder.
	 * @param string             $unique_id       The block unique id.
	 * @param string             $unique_style_id The unique id used for the style handle.
	 *
	 * @return void
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ): void {
		self::$arguments = [ $attributes, $unique_id, $unique_style_id ];

		$css->set_selector( '.pro' );
		$css->add_property( 'color', 'red' );
	}
}
