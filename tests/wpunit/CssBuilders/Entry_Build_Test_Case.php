<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;

/**
 * Shared helpers for tests of a whole CSS builder, with the block replaced by a fake.
 */
abstract class Entry_Build_Test_Case extends Free_Section_Test_Case {

	/**
	 * Build the CSS of a block with the given builder.
	 *
	 * @param string                    $builder    The class of the builder.
	 * @param string                    $block_name The name of the block.
	 * @param array<string, mixed>      $attributes The block attributes.
	 * @param callable|null             $bridge     What answers when the builder calls the block, or nothing.
	 * @param string                    $unique_id  The block unique id.
	 *
	 * @return string
	 */
	protected function build_entry( string $builder, string $block_name, array $attributes, ?callable $bridge = null, string $unique_id = 'abc' ): string {
		$context = new Kadence_Blocks_Css_Block_Context(
			$block_name,
			$bridge ?? static function () {
				return null;
			}
		);

		return (string) ( new $builder( $context ) )->build( $attributes, new Kadence_Blocks_CSS(), $unique_id, $unique_id . '-' . md5( (string) wp_json_encode( $attributes ) ) );
	}
}
