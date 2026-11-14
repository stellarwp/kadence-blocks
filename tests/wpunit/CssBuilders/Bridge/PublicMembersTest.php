<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Bridge;

use Tests\wpunit\KadenceBlocksTestCase;

/**
 * Every block member the CSS builders reach through the bridge is public, so the bridge never needs reflection.
 */
final class PublicMembersTest extends KadenceBlocksTestCase {

	/**
	 * Each member named in a `call( 'member' )` in the builders is a public method of some block.
	 *
	 * @return void
	 */
	public function testBridgedMembersArePublicMethods(): void {
		$blocks  = $this->source( KADENCE_BLOCKS_PATH . 'includes/blocks' );
		$members = $this->bridged_members( KADENCE_BLOCKS_PATH . 'includes/css-builders' );
		$missing = [];

		foreach ( $members as $member ) {
			if ( ! preg_match( '/public (static )?function ' . preg_quote( $member, '/' ) . '\s*\(/', $blocks ) ) {
				$missing[] = $member;
			}
		}

		$this->assertNotEmpty( $members );
		$this->assertSame( [], $missing, 'These members reached through the bridge are not public methods of a block.' );
	}

	/**
	 * The member names passed as the first argument of `->call(` in the PHP files of a directory.
	 *
	 * @param string $directory The directory.
	 *
	 * @return string[]
	 */
	private function bridged_members( string $directory ): array {
		$source = $this->source( $directory );

		// Direct calls, and member names handed to a preset section, which calls them later.
		preg_match_all( "/->call\(\s*'([A-Za-z_0-9]+)'/", $source, $direct );
		preg_match_all( "/_Preset_Css\(\s*'([A-Za-z_0-9]+)'/", $source, $presets );

		return array_values( array_unique( array_merge( $direct[1], $presets[1] ) ) );
	}

	/**
	 * The concatenated source of the PHP files of a directory.
	 *
	 * @param string $directory The directory.
	 *
	 * @return string
	 */
	private function source( string $directory ): string {
		$source = '';
		$files  = new \RecursiveIteratorIterator( new \RecursiveDirectoryIterator( $directory, \FilesystemIterator::SKIP_DOTS ) );

		foreach ( $files as $file ) {
			$source .= 'php' === $file->getExtension() ? (string) file_get_contents( $file->getPathname() ) : ''; // phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown -- Local source files.
		}

		return $source;
	}
}
