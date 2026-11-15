<?php declare( strict_types=1 );

namespace Tests\wpunit;

use Generator;
use Tests\Support\Classes\Legacy_Content;
use Tests\Support\Classes\TestCase;

/**
 * Blocks saved by older versions of the plugin build the same CSS, load the same fonts and queue the same assets as they did
 * before the builders were split into classes.
 *
 * Each file in `tests/_data/legacy/` has, for one block, attributes shaped like the ones older releases saved (taken from the
 * attribute definitions of the release tags, with realistic values) and what the original builders did with them, as saved by
 * and as prepared by WordPress when it renders the block. Record new files with the original code, not with the current one.
 *
 * Recorded from the original code on PHP 8: that code compares loosely (0 == 'row') and differs on PHP 7.4, where the original and the new
 * code still give identical output (checked by running both trees on 7.4 side by side).
 *
 * @requires PHP >= 8.0
 */
final class LegacyContentTest extends TestCase {

	/**
	 * The block gives the result the original builder gave.
	 *
	 * @dataProvider caseProvider
	 *
	 * @param string                    $name       The block name.
	 * @param array<string, mixed>      $attributes The saved attributes.
	 * @param bool                      $prepare    Whether WordPress fills in the defaults first.
	 * @param array<int, string>        $expected   What the original builder gave.
	 *
	 * @return void
	 */
	public function testBlockGivesTheResultOfTheOriginalBuilder( string $name, array $attributes, bool $prepare, array $expected ): void {
		$attributes = $prepare ? Legacy_Content::prepared( $name, $attributes ) : $attributes;

		$this->assertSame( $expected, Legacy_Content::signature( $name, $attributes ), 'The CSS, the fonts or the queued assets of an old block changed.' );
	}

	/**
	 * Every recorded case, as saved and as prepared.
	 *
	 * @return Generator
	 */
	public static function caseProvider(): Generator {
		foreach ( (array) glob( codecept_data_dir( 'legacy/*.json' ) ) as $file ) {
			$data = json_decode( (string) file_get_contents( $file ), true ); // phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown -- Local file.

			foreach ( $data['cases'] as $index => $case ) {
				foreach ( [
					'saved'    => false,
					'prepared' => true,
				] as $variant => $prepare ) {
					yield $data['block'] . ' #' . $index . ' (' . $case['tag'] . ') ' . $variant => [
						'name'       => $data['block'],
						'attributes' => $case['attributes'],
						'prepare'    => $prepare,
						'expected'   => $data['expected'][ $variant ][ $index ],
					];
				}
			}
		}
	}
}
