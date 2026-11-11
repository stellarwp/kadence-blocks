<?php

declare( strict_types=1 );

namespace Tests\wpunit;

use DOMDocument;
use DOMXPath;

/**
 * Checks the WPML string xpath for the Advanced Text block against saved block markup.
 */
final class WpmlConfigTest extends KadenceBlocksTestCase {

	/**
	 * Tag names the advancedheading xpath matches in the given block markup.
	 *
	 * @param string $html Saved block markup.
	 *
	 * @return string[]
	 */
	private function match_heading_xpath( string $html ): array {
		$config = simplexml_load_file( KADENCE_BLOCKS_PATH . 'wpml-config.xml' );
		$xpath  = (string) $config->xpath( '//gutenberg-block[@type="kadence/advancedheading"]/xpath[not(@type)]' )[0];

		$dom = new DOMDocument();
		$previous = libxml_use_internal_errors( true );
		$dom->loadHTML( '<html><body>' . $html . '</body></html>' );
		libxml_clear_errors();
		libxml_use_internal_errors( $previous );

		$tags = [];
		foreach ( ( new DOMXPath( $dom ) )->query( $xpath ) as $node ) {
			$tags[] = $node->nodeName;
		}

		return $tags;
	}

	public function testAdvancedheadingXpathMatchesEveryHeadingTagOnce(): void {
		$cases = [
			'h2'     => '<h2 class="kt-adv-heading_1 wp-block-kadence-advancedheading">Heading</h2>',
			'p'      => '<p class="kt-adv-heading_1 wp-block-kadence-advancedheading">Paragraph</p>',
			'div'    => '<div class="kt-adv-heading_1 wp-block-kadence-advancedheading">Div <span class="kt-highlight">text</span></div>',
			'span'   => '<span class="kt-adv-heading_1 wp-block-kadence-advancedheading">Span</span>',
			'reveal' => '<div class="kb-adv-heading-wrap_1 kadence-advanced-heading-wrapper kadence-heading-clip-animation"><h2 class="kt-adv-heading_1 wp-block-kadence-advancedheading">Reveal</h2></div>',
		];
		$expected = [
			'h2'     => [ 'h2' ],
			'p'      => [ 'p' ],
			'div'    => [ 'div' ],
			'span'   => [ 'span' ],
			'reveal' => [ 'h2' ],
		];

		foreach ( $cases as $key => $html ) {
			$this->assertSame( $expected[ $key ], $this->match_heading_xpath( $html ), $key );
		}
	}

	public function testAdvancedheadingXpathIgnoresSimilarClassNames(): void {
		$this->assertSame( [], $this->match_heading_xpath( '<div class="wp-block-kadence-advancedheading-x">Text</div>' ) );
	}
}
