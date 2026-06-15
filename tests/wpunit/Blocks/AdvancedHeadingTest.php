<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Advancedheading_Block;
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
		add_shortcode( $shortcode, function () use ( $resolved ) {
			return $resolved;
		} );

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
		$unique_id  = '456_efgh';
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
}
