<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Global_Styles;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Set_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Global_Styles\Global_Styles_Sync_Listener;
use KadenceWP\KadenceBlocks\Design_Tokens\Global_Styles\Preset_Target;
use Tests\Support\Classes\TestCase;
use WP_Post;

/**
 * Covers Global_Styles_Sync_Listener against the real, shipped registry (semantic.color.button-bg
 * and semantic.color.button-text are both wp_preset + site_editor opted-in) and a real
 * wp_global_styles post row, since the listener is bound to wp_update_post()'s own
 * wp_after_insert_post hook rather than anything the REST server needs to be booted for.
 */
final class Global_Styles_Sync_ListenerTest extends TestCase {

	/**
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @var Active_Set_Store
	 */
	private Active_Set_Store $active;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->store  = $this->container->get( Token_Store::class );
		$this->active = $this->container->get( Active_Set_Store::class );
	}

	/**
	 * Editing a token-backed color preset to a literal syncs the translated value to the active
	 * token set's document.
	 *
	 * @return void
	 */
	public function testEditingTokenBackedPresetSyncsLiteralToStore(): void {
		$post = $this->create_global_styles_post( $this->document_with_button_bg( $this->canonical_button_bg() ) );

		wp_update_post(
			[
				'ID'           => $post->ID,
				'post_content' => wp_json_encode( $this->document_with_button_bg( '#3182ce' ) ),
			]
		);

		$leaf = $this->stored_leaf( 'semantic', 'color', 'button-bg' );

		$this->assertSame( 'color', $leaf['$type'] ?? null );
		$this->assertSame( '#3182ce', $leaf['$value'] ?? null );
	}

	/**
	 * A post of a different post type never triggers a store write, even when its content carries
	 * the exact same preset shape a wp_global_styles post would.
	 *
	 * @return void
	 */
	public function testDifferentPostTypeDoesNotTriggerStoreWrite(): void {
		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => 'post',
				'post_content' => wp_json_encode( $this->document_with_button_bg( $this->canonical_button_bg() ) ),
			]
		);

		wp_update_post(
			[
				'ID'           => $post->ID,
				'post_content' => wp_json_encode( $this->document_with_button_bg( '#3182ce' ) ),
			]
		);

		$this->assertSame( '', $this->store->get_document( $this->active->get() ) );
	}

	/**
	 * An ad-hoc preset slug that no opted-in token backs is left untouched even when its value
	 * changes.
	 *
	 * @return void
	 */
	public function testAdHocPresetDoesNotTouchStore(): void {
		$post = $this->create_global_styles_post( $this->document_with_ad_hoc_preset( '#111111' ) );

		wp_update_post(
			[
				'ID'           => $post->ID,
				'post_content' => wp_json_encode( $this->document_with_ad_hoc_preset( '#222222' ) ),
			]
		);

		$this->assertSame( '', $this->store->get_document( $this->active->get() ) );
	}

	/**
	 * A second, self-triggered pass whose new value already equals the canonical var(--kb-token--*)
	 * form (the Restorer restore) does not write to the store again.
	 *
	 * @return void
	 */
	public function testValueAlreadyCanonicalDoesNotRewriteStore(): void {
		$post = $this->create_global_styles_post( $this->document_with_button_bg( $this->canonical_button_bg() ) );

		wp_update_post(
			[
				'ID'           => $post->ID,
				'post_content' => wp_json_encode( $this->document_with_button_bg( '#3182ce' ) ),
			]
		);

		$version_after_sync = $this->store->get_version( $this->active->get() );

		// Simulate Restorer restoring the preset entry back to the canonical var() form.
		wp_update_post(
			[
				'ID'           => $post->ID,
				'post_content' => wp_json_encode( $this->document_with_button_bg( $this->canonical_button_bg() ) ),
			]
		);

		$this->assertSame( $version_after_sync, $this->store->get_version( $this->active->get() ) );
	}

	/**
	 * A malformed literal for one changed preset is caught and logged rather than thrown, and does
	 * not block a second, valid changed preset in the same payload from syncing.
	 *
	 * @return void
	 */
	public function testMalformedLiteralIsCaughtAndDoesNotBlockOtherPresets(): void {
		$post = $this->create_global_styles_post(
			$this->document_with_button_presets( $this->canonical_button_bg(), $this->canonical_button_text() )
		);

		wp_update_post(
			[
				'ID'           => $post->ID,
				'post_content' => wp_json_encode(
					$this->document_with_button_presets( 'not-a-real-color-value', '#654321' )
				),
			]
		);

		$this->assertNull( $this->stored_leaf( 'semantic', 'color', 'button-bg' ) );

		$leaf = $this->stored_leaf( 'semantic', 'color', 'button-text' );
		$this->assertSame( '#654321', $leaf['$value'] ?? null );
	}

	/**
	 * The synced action fires once per successful sync, carrying the synced Preset_Target list.
	 *
	 * @return void
	 */
	public function testSyncedActionFiresWithSyncedTargets(): void {
		$captured = [];

		add_action(
			Global_Styles_Sync_Listener::synced_action(),
			static function ( array $synced ) use ( &$captured ): void {
				$captured = $synced;
			}
		);

		$post = $this->create_global_styles_post( $this->document_with_button_bg( $this->canonical_button_bg() ) );

		wp_update_post(
			[
				'ID'           => $post->ID,
				'post_content' => wp_json_encode( $this->document_with_button_bg( '#3182ce' ) ),
			]
		);

		$this->assertCount( 1, $captured );
		$this->assertInstanceOf( Preset_Target::class, $captured[0] );
		$this->assertSame( 'button-bg', $captured[0]->slug );
	}

	/**
	 * The full wp_after_insert_post → sync → synced_action → restore chain lands both halves of the
	 * two-way sync in the same request: the token store holds the user's literal, and the CPT is
	 * restored to var(--kb-token--*).
	 *
	 * @return void
	 */
	public function testFullChainSyncsStoreAndRestoresCanonicalVarInSameRequest(): void {
		$post = $this->create_global_styles_post( $this->document_with_button_bg( $this->canonical_button_bg() ) );

		wp_update_post(
			[
				'ID'           => $post->ID,
				'post_content' => wp_json_encode( $this->document_with_button_bg( '#3182ce' ) ),
			]
		);

		$leaf = $this->stored_leaf( 'semantic', 'color', 'button-bg' );
		$this->assertSame( '#3182ce', $leaf['$value'] ?? null );

		$restored = get_post( $post->ID );
		$decoded  = json_decode( $restored->post_content, true );
		$entries  = is_array( $decoded ) ? ( $decoded['settings']['color']['palette']['theme'] ?? null ) : null;

		$this->assertIsArray( $entries );
		$this->assertSame( $this->canonical_button_bg(), $entries[0]['color'] ?? null );
	}

	/**
	 * A second save carrying the exact same literal that was already synced and restored to
	 * var(--kb-token--*) does not re-sync or bump the store's version, even though the post's
	 * $post_before reflects the restored canonical form rather than the literal from the prior
	 * save.
	 *
	 * @return void
	 */
	public function testUnchangedLiteralOnSubsequentSaveDoesNotRewriteStore(): void {
		$post = $this->create_global_styles_post( $this->document_with_button_bg( $this->canonical_button_bg() ) );

		wp_update_post(
			[
				'ID'           => $post->ID,
				'post_content' => wp_json_encode( $this->document_with_button_bg( '#3182ce' ) ),
			]
		);

		$version_after_sync = $this->store->get_version( $this->active->get() );

		// The Site Editor client is unaware Restorer already rewrote the CPT to the canonical
		// var() form, so a subsequent, unrelated save resends the same literal it originally
		// submitted.
		wp_update_post(
			[
				'ID'           => $post->ID,
				'post_content' => wp_json_encode( $this->document_with_button_bg( '#3182ce' ) ),
			]
		);

		$this->assertSame( $version_after_sync, $this->store->get_version( $this->active->get() ) );
	}

	/**
	 * Create a wp_global_styles post row with the given decoded post_content.
	 *
	 * @param array<string, mixed> $document The decoded theme.json-shaped document.
	 *
	 * @return WP_Post
	 */
	private function create_global_styles_post( array $document ): WP_Post {
		return self::factory()->post->create_and_get(
			[
				'post_type'    => 'wp_global_styles',
				'post_content' => wp_json_encode( $document ),
			]
		);
	}

	/**
	 * The canonical, in-sync var() form for the semantic.color.button-bg token.
	 *
	 * @return string
	 */
	private function canonical_button_bg(): string {
		return 'var(--kb-token--semantic--color--button-bg)';
	}

	/**
	 * The canonical, in-sync var() form for the semantic.color.button-text token.
	 *
	 * @return string
	 */
	private function canonical_button_text(): string {
		return 'var(--kb-token--semantic--color--button-text)';
	}

	/**
	 * Build a decoded wp_global_styles document with a single "button-bg" color preset entry.
	 *
	 * @param string $value The preset entry's color value.
	 *
	 * @return array<string, mixed>
	 */
	private function document_with_button_bg( string $value ): array {
		return $this->document_with_color_presets(
			[
				[
					'slug'  => 'button-bg',
					'name'  => 'Button Background',
					'color' => $value,
				],
			]
		);
	}

	/**
	 * Build a decoded wp_global_styles document with both "button-bg" and "button-text" color
	 * preset entries.
	 *
	 * @param string $button_bg_value   The "button-bg" preset entry's color value.
	 * @param string $button_text_value The "button-text" preset entry's color value.
	 *
	 * @return array<string, mixed>
	 */
	private function document_with_button_presets( string $button_bg_value, string $button_text_value ): array {
		return $this->document_with_color_presets(
			[
				[
					'slug'  => 'button-bg',
					'name'  => 'Button Background',
					'color' => $button_bg_value,
				],
				[
					'slug'  => 'button-text',
					'name'  => 'Button Text',
					'color' => $button_text_value,
				],
			]
		);
	}

	/**
	 * Build a decoded wp_global_styles document with a single ad-hoc (non-token-backed) color
	 * preset entry.
	 *
	 * @param string $value The preset entry's color value.
	 *
	 * @return array<string, mixed>
	 */
	private function document_with_ad_hoc_preset( string $value ): array {
		return $this->document_with_color_presets(
			[
				[
					'slug'  => 'my-custom-color',
					'name'  => 'My Custom Color',
					'color' => $value,
				],
			]
		);
	}

	/**
	 * Build a decoded wp_global_styles document with the given settings.color.palette.theme entries.
	 *
	 * @param array<int, array<string, string>> $entries The palette entries.
	 *
	 * @return array<string, mixed>
	 */
	private function document_with_color_presets( array $entries ): array {
		return [
			'settings' => [
				'color' => [
					'palette' => [
						'theme' => $entries,
					],
				],
			],
		];
	}

	/**
	 * Read a DTCG leaf from the active token set's stored document by dot-path segments.
	 *
	 * @param string ...$segments The dot-path segments to the leaf.
	 *
	 * @return array<string, mixed>|null The leaf, or null when absent.
	 */
	private function stored_leaf( string ...$segments ): ?array {
		$raw = $this->store->get_document( $this->active->get() );

		if ( $raw === '' ) {
			return null;
		}

		$decoded = json_decode( $raw, true );
		$cursor  = is_array( $decoded ) ? $decoded : null;

		foreach ( $segments as $segment ) {
			if ( ! is_array( $cursor ) || ! isset( $cursor[ $segment ] ) ) {
				return null;
			}
			$cursor = $cursor[ $segment ];
		}

		return is_array( $cursor ) ? $cursor : null;
	}
}
