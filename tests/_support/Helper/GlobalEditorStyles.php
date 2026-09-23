<?php

declare( strict_types=1 );

namespace Helper;

use Codeception\Module;
use Codeception\TestInterface;

/**
 * Captures the editor CSS `kadence_blocks_add_global_gutenberg_inline_styles()`
 * registers and compares it with a stored copy under
 * `tests/_data/global-editor-styles/`.
 */
final class GlobalEditorStyles extends Module {

	/**
	 * Whether the current test registered the editor styles.
	 */
	private bool $registered = false;

	public function _after( TestInterface $test ): void {
		if ( ! $this->registered ) {
			return;
		}

		wp_deregister_style( 'kadence-blocks-global-editor-styles' );

		$this->registered = false;
	}

	/**
	 * @param string $name File name, without extension, in `tests/_data/global-editor-styles/`.
	 */
	public function assert_global_editor_css_matches( string $name ): void {
		$this->assertStringEqualsFile( codecept_data_dir( 'global-editor-styles/' . $name . '.css' ), $this->global_editor_css() );
	}

	/**
	 * Runs the editor styles callback and returns the CSS it registers.
	 *
	 * @return string
	 */
	private function global_editor_css(): string {
		wp_deregister_style( 'kadence-blocks-global-editor-styles' );

		kadence_blocks_add_global_gutenberg_inline_styles();
		$this->registered = true;

		return implode( "\n", wp_styles()->get_data( 'kadence-blocks-global-editor-styles', 'after' ) );
	}
}
