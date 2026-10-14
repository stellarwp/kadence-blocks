<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Editor;

use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Style_Library\Asset_Loader;
use KadenceWP\KadenceBlocks\Design_Tokens\Editor\Localizer;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use Tests\Support\Classes\TestCase;

/**
 * Exercises the dual-handle pickable-token attachment: the block editor's early-filters bundle, and
 * the Style Library admin bundle, so the settings panel's token-select field reads the same pool the
 * editor token picker reads.
 */
final class LocalizerTest extends TestCase {

	/**
	 * The editor early-filters bundle handle the pickable pool is also attached to.
	 *
	 * @var string
	 */
	private const EDITOR_HANDLE = 'kadence-blocks-early-filters-js';

	/**
	 * The token registry, for the fail-closed gate.
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * Resolves the registry from the container and reactivates it after each test so state does not
	 * leak into later test classes.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->registry = $this->container->get( Token_Registry::class );
	}

	/**
	 * Reactivates the registry and dequeues every handle this suite registered, so state does not leak
	 * into later test classes.
	 *
	 * @return void
	 */
	protected function tearDown(): void {
		$this->registry->activate();

		foreach ( [ self::EDITOR_HANDLE, Asset_Loader::get_script_handle() ] as $handle ) {
			if ( wp_script_is( $handle, 'registered' ) ) {
				wp_dequeue_script( $handle );
				wp_deregister_script( $handle );
			}
		}

		parent::tearDown();
	}

	/**
	 * The pickable pool reaches the editor early-filters bundle when it is the enqueued handle.
	 *
	 * @return void
	 */
	public function testPickableFeedAttachesToTheEditorHandle(): void {
		$this->enqueue( self::EDITOR_HANDLE );

		$this->localizer()->localize_pickable();

		$inline = $this->inline_script( self::EDITOR_HANDLE );
		$this->assertNotNull( $inline, 'The pickable pool should attach to the editor handle.' );
		$this->assertStringContainsString( 'window.kadenceDesignTokensPickable', $inline );
	}

	/**
	 * The pickable pool reaches the Style Library admin bundle when it is the enqueued handle, giving
	 * the settings panel's token-select field the same pool the editor token picker reads.
	 *
	 * @return void
	 */
	public function testPickableFeedAttachesToTheStyleLibraryHandle(): void {
		$this->enqueue( Asset_Loader::get_script_handle() );

		$this->localizer()->localize_pickable();

		$inline = $this->inline_script( Asset_Loader::get_script_handle() );
		$this->assertNotNull( $inline, 'The pickable pool should attach to the Style Library handle.' );
		$this->assertStringContainsString( 'window.kadenceDesignTokensPickable', $inline );
	}

	/**
	 * A single call attaches the pickable pool exactly once to whichever handle is enqueued, never
	 * duplicating the assignment in the inline script data.
	 *
	 * @return void
	 */
	public function testPickableFeedAttachesOnlyOncePerRequest(): void {
		$this->enqueue( self::EDITOR_HANDLE );

		$this->localizer()->localize_pickable();

		$inline = $this->inline_script( self::EDITOR_HANDLE );
		$this->assertNotNull( $inline );
		$this->assertSame( 1, substr_count( $inline, 'window.kadenceDesignTokensPickable' ) );
	}

	/**
	 * Neither handle enqueued means nothing is attached.
	 *
	 * @return void
	 */
	public function testPickableFeedAttachesNothingWhenNeitherHandleIsOnThePage(): void {
		$this->localizer()->localize_pickable();

		$this->assertNull( $this->inline_script( self::EDITOR_HANDLE ) );
		$this->assertNull( $this->inline_script( Asset_Loader::get_script_handle() ) );
	}

	/**
	 * A deactivated registry fails closed: no pickable pool is attached even when a handle is enqueued.
	 *
	 * @return void
	 */
	public function testPickableFeedFailsClosedWhenTheRegistryIsInactive(): void {
		$this->registry->deactivate();
		$this->enqueue( self::EDITOR_HANDLE );

		$this->localizer()->localize_pickable();

		$this->assertNull( $this->inline_script( self::EDITOR_HANDLE ) );
	}

	/**
	 * Registers and enqueues a fake script under the given handle.
	 *
	 * @param string $handle The script handle to enqueue.
	 *
	 * @return void
	 */
	private function enqueue( string $handle ): void {
		wp_register_script( $handle, 'https://example.test/' . $handle . '.js', [], '1', true );
		wp_enqueue_script( $handle );
	}

	/**
	 * The inline 'before' script data attached to a handle, joined into one string, or null when none
	 * was attached.
	 *
	 * @param string $handle The script handle to inspect.
	 *
	 * @return string|null
	 */
	private function inline_script( string $handle ): ?string {
		$data = wp_scripts()->get_data( $handle, 'before' );

		if ( ! is_array( $data ) || $data === [] ) {
			return null;
		}

		return implode( "\n", array_filter( $data, 'is_string' ) );
	}

	/**
	 * The localizer, resolved from the container.
	 *
	 * @return Localizer
	 */
	private function localizer(): Localizer {
		return $this->container->get( Localizer::class );
	}
}
