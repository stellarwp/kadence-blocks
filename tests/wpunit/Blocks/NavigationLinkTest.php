<?php
/**
 * cSpell:ignore scriptable
 */

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Navigation_Link_Block;
use Tests\Support\Classes\KadenceBlocksUnit;
use WP_HTML_Tag_Processor;

class NavigationItemTest extends KadenceBlocksUnit {
	/**
	 * @var WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'navigation-link';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Navigation_Link_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new Kadence_Blocks_Navigation_Link_Block();

		// The media markup comes from core, so stub it to keep these tests on the block's own output.
		add_filter( 'wp_get_attachment_image', [ $this, 'stub_attachment_image' ] );
	}

	protected function _after() {
		remove_filter( 'wp_get_attachment_image', [ $this, 'stub_attachment_image' ] );
	}

	public function stub_attachment_image() {
		return '<img src="https://example.com/x.jpg" alt="" />';
	}

	private function render( array $attributes ): string {
		$attributes = array_merge(
			[
				'uniqueID'   => '9_nav',
				'label'      => 'Home',
				'mediaType'  => 'image',
				'mediaImage' => [
					[
						'id'      => 1,
						'url'     => 'https://example.com/x.jpg',
						'subtype' => 'jpeg',
						'width'   => 200,
						'height'  => 200,
					],
				],
			],
			$attributes
		);

		return do_blocks( '<!-- wp:kadence/navigation-link ' . wp_json_encode( $attributes ) . ' /-->' );
	}

	/**
	 * Collects every attribute a browser would parse out of the markup that can trigger script.
	 */
	private function scriptableAttributes( string $html ): array {
		$processor = new WP_HTML_Tag_Processor( $html );
		$found     = [];

		while ( $processor->next_tag() ) {
			$names = (array) $processor->get_attribute_names_with_prefix( 'on' );

			if ( null !== $processor->get_attribute( 'autofocus' ) ) {
				$names[] = 'autofocus';
			}

			foreach ( $names as $name ) {
				$found[] = $processor->get_tag() . '[' . $name . ']';
			}
		}

		return $found;
	}

	public function testImageRatioClassIsEscaped() {
		$html = $this->render( [ 'imageRatio' => 'land169" tabindex="0" autofocus onfocus="alert(1)' ] );

		$this->assertSame( [], $this->scriptableAttributes( $html ) );
		// Proves the value reached the class attribute rather than the branch being skipped.
		$this->assertStringContainsString( 'kb-navigation-link-image-ratio-land169&quot;', $html );
	}

	public function testHighlightLabelAndDescriptionCannotCreateEventHandlers() {
		$html = $this->render(
			[
				'imageRatio'     => 'land169',
				'highlightLabel' => 'New <img src=x onerror=alert(1)>',
				'description'    => 'Details <svg onload=alert(2)></svg>',
			]
		);

		$this->assertSame( [], $this->scriptableAttributes( $html ) );
	}

	public function testHighlightLabelAndDescriptionKeepInlineFormatting() {
		$html = $this->render(
			[
				'imageRatio'     => 'land169',
				'highlightLabel' => 'Sale <strong>50%</strong>',
				'description'    => 'Read <em>more</em>',
			]
		);

		$this->assertStringContainsString( 'Sale <strong>50%</strong>', $html );
		$this->assertStringContainsString( 'Read <em>more</em>', $html );
	}
}
