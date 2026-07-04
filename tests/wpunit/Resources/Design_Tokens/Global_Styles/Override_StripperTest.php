<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Global_Styles;

use KadenceWP\KadenceBlocks\Design_Tokens\Global_Styles\Override_Stripper;
use KadenceWP\KadenceBlocks\Design_Tokens\Global_Styles\Preset_Target;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Definition;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use Tests\Support\Classes\TestCase;
use WP_Post;

/**
 * Covers Override_Stripper against the real, shipped registry (semantic.color.button-bg is
 * wp_preset + site_editor opted-in), restoring a synced preset entry back to its canonical
 * var(--kb-token--*) form.
 */
final class Override_StripperTest extends TestCase {

	/**
	 * @var Override_Stripper
	 */
	private Override_Stripper $stripper;

	/**
	 * @var Token_Definition
	 */
	private Token_Definition $button_bg;

	/**
	 * Boot the container and resolve the stripper and token fixture shared by every test below.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->stripper = $this->container->get( Override_Stripper::class );

		$token = $this->container->get( Token_Registry::class )->get( 'semantic.color.button-bg' );
		$this->assertNotNull( $token, 'Fixture assumption: semantic.color.button-bg must be registered.' );
		$this->button_bg = $token;
	}

	/**
	 * A synced preset entry holding a literal is rewritten to var(--kb-token--*) and persisted.
	 *
	 * @return void
	 */
	public function testStripRewritesLiteralToCanonicalVarAndPersists(): void {
		$post = $this->create_global_styles_post( $this->document_with_button_bg( '#3182ce' ) );

		$this->stripper->strip( [ $this->button_bg_target() ], $post );

		$leaf = $this->stored_button_bg_value( get_post( $post->ID ) );
		$this->assertSame( $this->canonical_button_bg(), $leaf );
	}

	/**
	 * An empty $synced array performs no write — the post's content is byte-identical afterward.
	 *
	 * @return void
	 */
	public function testEmptySyncedPerformsNoWrite(): void {
		$post = $this->create_global_styles_post( $this->document_with_button_bg( '#3182ce' ) );

		$before = get_post( $post->ID );

		$this->stripper->strip( [], $post );

		$after = get_post( $post->ID );

		$this->assertSame( $before->post_content, $after->post_content );
		$this->assertSame( $before->post_modified_gmt, $after->post_modified_gmt );
	}

	/**
	 * A target whose slug is absent from the post is skipped without error, while other targets in
	 * the same call are still restored.
	 *
	 * @return void
	 */
	public function testMissingTargetIsSkippedWithoutBlockingOthers(): void {
		$post = $this->create_global_styles_post( $this->document_with_button_bg( '#3182ce' ) );

		$missing_token = $this->container->get( Token_Registry::class )->get( 'semantic.color.button-text' );
		$this->assertNotNull( $missing_token, 'Fixture assumption: semantic.color.button-text must be registered.' );

		$missing_target = new Preset_Target(
			[ 'color', 'palette', 'theme' ],
			'color',
			'button-text',
			'color',
			$missing_token
		);

		$this->stripper->strip( [ $missing_target, $this->button_bg_target() ], $post );

		$leaf = $this->stored_button_bg_value( get_post( $post->ID ) );
		$this->assertSame( $this->canonical_button_bg(), $leaf );
	}

	/**
	 * Malformed post_content (not valid JSON) leaves the post untouched rather than throwing.
	 *
	 * @return void
	 */
	public function testMalformedPostContentLeavesPostUntouched(): void {
		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => 'wp_global_styles',
				'post_content' => 'not-json',
			]
		);

		$before = get_post( $post->ID );

		$this->stripper->strip( [ $this->button_bg_target() ], $post );

		$after = get_post( $post->ID );

		$this->assertSame( $before->post_content, $after->post_content );
	}

	/**
	 * Build the Preset_Target for semantic.color.button-bg, matching Site_Editor_Preset_Locator's
	 * resolved address exactly.
	 *
	 * @return Preset_Target
	 */
	private function button_bg_target(): Preset_Target {
		return new Preset_Target(
			[ 'color', 'palette', 'theme' ],
			'color',
			'button-bg',
			'color',
			$this->button_bg
		);
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
		return 'var(' . $this->button_bg->css_var . ')';
	}

	/**
	 * Build a decoded wp_global_styles document with a single "button-bg" color preset entry.
	 *
	 * @param string $value The preset entry's color value.
	 *
	 * @return array<string, mixed>
	 */
	private function document_with_button_bg( string $value ): array {
		return [
			'settings' => [
				'color' => [
					'palette' => [
						'theme' => [
							[
								'slug'  => 'button-bg',
								'name'  => 'Button Background',
								'color' => $value,
							],
						],
					],
				],
			],
		];
	}

	/**
	 * Read the "button-bg" palette entry's color value from a post's decoded post_content.
	 *
	 * @param WP_Post $post The post to read from.
	 *
	 * @return string|null The entry's value, or null when absent.
	 */
	private function stored_button_bg_value( WP_Post $post ): ?string {
		$decoded = json_decode( $post->post_content, true );
		$entries = is_array( $decoded ) ? ( $decoded['settings']['color']['palette']['theme'] ?? null ) : null;

		if ( ! is_array( $entries ) ) {
			return null;
		}

		foreach ( $entries as $entry ) {
			if ( is_array( $entry ) && ( $entry['slug'] ?? null ) === 'button-bg' ) {
				return is_string( $entry['color'] ?? null ) ? $entry['color'] : null;
			}
		}

		return null;
	}
}
