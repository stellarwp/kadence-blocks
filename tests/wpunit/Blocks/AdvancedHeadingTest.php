<?php
// cspell:ignore fontvariants -- the array key `maybe_add_google_font()` stores variants under.

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Advancedheading_Block;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Google_Fonts;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use Tests\Support\Classes\KadenceBlocksUnit;

class AdvancedHeadingTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'advancedheading';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Advancedheading_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Advancedheading_Block();
	}

	/**
	 * A plain heading (no icon/gradient) with a dynamic link must derive its href from the
	 * (per-post) link attribute, not from the saved $content markup.
	 *
	 * In FSE query loops the saved markup is resolved once with the first post's context and
	 * reused for every item, so $content arrives with a stale, already-baked href. build_html()
	 * must overwrite it from $attributes['link'] (which still holds the per-post shortcode),
	 * matching the single button block and the heading's icon/gradient path.
	 *
	 * @see Dynamic Link URL wrong in FSE archive Query Loop (Advanced Heading).
	 */
	public function testPlainHeadingResolvesDynamicLinkFromAttributeNotBakedContent() {
		$shortcode = 'kb_test_dynamic_link';
		$resolved  = 'https://example.com/correct-per-post/';
		add_shortcode(
			$shortcode,
			function () use ( $resolved ) {
				return $resolved;
			}
		);

		$unique_id  = '123_abcd';
		$link_value = '[' . $shortcode . ']';
		$attributes = [
			'uniqueID' => $unique_id,
			'link'     => $link_value,
		];

		// Simulate the query-loop bug: $content arrives with a stale href baked to a different
		// (first) post, while the link attribute still carries the per-post shortcode.
		$stale_url     = 'https://example.com/stale-first-post/';
		$saved_content = '<a class="kb-advanced-heading-link" href="' . $stale_url . '"><h2 class="kt-adv-heading' . $unique_id . '">Title</h2></a>';

		$block_instance = $this->generate_block_instance( 'kadence/' . $this->block_name, $attributes );

		$html = $this->block->build_html( $attributes, $unique_id, $saved_content, $block_instance );

		remove_shortcode( $shortcode );

		$this->assertStringContainsString( 'href="' . $resolved . '"', $html, 'Dynamic link should be resolved from the per-post attribute.' );
		$this->assertStringNotContainsString( $stale_url, $html, 'Stale baked href should be overwritten.' );
		$this->assertStringNotContainsString( $link_value, $html, 'Raw link shortcode should not survive in the output.' );
	}

	/**
	 * A static (non-shortcode) link must pass through build_html untouched.
	 */
	public function testPlainHeadingLeavesStaticLinkUntouched() {
		$unique_id  = '456_1234';
		$static_url = 'https://example.com/static/';
		$attributes = [
			'uniqueID' => $unique_id,
			'link'     => $static_url,
		];

		$saved_content = '<h2 class="kt-adv-heading' . $unique_id . '"><a class="kb-advanced-heading-link" href="' . $static_url . '">Title</a></h2>';

		$block_instance = $this->generate_block_instance( 'kadence/' . $this->block_name, $attributes );

		$html = $this->block->build_html( $attributes, $unique_id, $saved_content, $block_instance );

		$this->assertStringContainsString( 'href="' . $static_url . '"', $html, 'Static link should be preserved.' );
	}

	/**
	 * A heading taking its family from a preset requests that preset's weight alongside it, so the
	 * browser loads the real face rather than synthesizing one over the upright default.
	 *
	 * @return void
	 */
	public function testAPresetFamilyIsRequestedAtThePresetsOwnWeight(): void {
		$fonts = $this->buildCssForSeededPreset( '700', [] );

		$this->assertArrayHasKey( 'Inter', $fonts, 'The preset family should be enqueued.' );
		$this->assertSame( [ '700' ], $fonts['Inter']['fontvariants'], 'The preset weight should be requested.' );
	}

	/**
	 * A weight of 400 is asked for as `regular`, the variant spelling the rest of the plugin uses for
	 * the upright default.
	 *
	 * @return void
	 */
	public function testAPresetWeightOfFourHundredIsRequestedAsRegular(): void {
		$fonts = $this->buildCssForSeededPreset( '400', [] );

		$this->assertSame( [ 'regular' ], $fonts['Inter']['fontvariants'] );
	}

	/**
	 * A variant the block states itself is a direct statement about the face and outranks the preset's
	 * weight, matching the precedence the rendered `font-weight` already follows.
	 *
	 * @return void
	 */
	public function testAnInstanceFontVariantOutranksThePresetWeight(): void {
		$fonts = $this->buildCssForSeededPreset( '700', [ 'fontVariant' => '300italic' ] );

		$this->assertSame( [ '300italic' ], $fonts['Inter']['fontvariants'] );
	}

	/**
	 * A weight the block sets itself is what the CSS emits, so it is also what gets requested — the
	 * preset's weight applies only where the block states none.
	 *
	 * @return void
	 */
	public function testAnInstanceFontWeightOutranksThePresetWeight(): void {
		$fonts = $this->buildCssForSeededPreset( '700', [ 'fontWeight' => '300' ] );

		$this->assertSame( [ '300' ], $fonts['Inter']['fontvariants'] );
	}

	/**
	 * A preset that names no weight asks for no variant, leaving the family to load exactly as it did
	 * before the weight was bridged rather than requesting a face nothing named.
	 *
	 * @return void
	 */
	public function testAPresetWithNoWeightRequestsNoVariant(): void {
		$fonts = $this->buildCssForSeededPreset( null, [] );

		$this->assertArrayHasKey( 'Inter', $fonts, 'The family should still be enqueued.' );
		$this->assertSame( [], $fonts['Inter']['fontvariants'], 'No variant should be requested.' );
	}

	/**
	 * Seed a preset carrying a family (and optionally a weight), build the block's CSS for a heading
	 * with no family of its own, and return the Google fonts the build collected.
	 *
	 * @param string|null          $weight The preset's font weight, or null to set none.
	 * @param array<string, mixed> $extra  Extra block attributes, for the precedence cases.
	 *
	 * @return array<string, array<string, mixed>> The collected Google fonts, keyed by family.
	 */
	private function buildCssForSeededPreset( ?string $weight, array $extra ): array {
		$tokens = [ 'typography' => 'Inter' ];

		if ( null !== $weight ) {
			$tokens['fontWeight'] = $weight;
		}

		$document = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'presets' => [
						'kadence/advancedheading' => [
							'preset-font-test' => [
								'label'  => 'Font Test',
								'tokens' => $tokens,
							],
						],
					],
				],
			],
		];

		/** @var Token_Store $store */
		$store = kadence_blocks()->get( Token_Store::class );
		$store->save_document( (string) wp_json_encode( $document ), Token_Store::default_slug() );

		$css = new Kadence_Blocks_CSS();
		$css->clear();
		Kadence_Blocks_Google_Fonts::$gfonts = [];

		// `typography` is deliberately absent: the preset bridge fires only where the block names no
		// family of its own, which is the whole case under test.
		$attributes = array_merge(
			[
				'uniqueID' => '789_1234',
				'kbPreset' => 'preset-font-test',
			],
			$extra
		);

		$this->block->build_css( $attributes, $css, '789_1234', '789_1234' );

		// Read the collector rather than the builder: `build_css` ends in `css_output()`, which hands the
		// fonts it gathered to `Kadence_Blocks_Google_Fonts` and then clears its own list, so by the time
		// this returns the builder holds nothing. The collector is also what actually prints the tag.
		return Kadence_Blocks_Google_Fonts::$gfonts;
	}
}
