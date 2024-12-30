<?php

namespace Tests\Support\Classes;

use Codeception\TestCase\WPTestCase;
use Tests\wpunit\KadenceBlocksTestCase;

abstract class KadenceBlocksUnit extends KadenceBlocksTestCase
{

	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = '';

	public function testBlockIsRegistered()
	{
		if (!empty($this->block_name)) {
			$this->assertTrue($this->tester->is_block_registered('kadence/' . $this->block_name),
				$this->block_name . ' block is registered');
		} else {
			$this->addWarning('This block is missing a defined $block_name value.');
		}
	}

	public function testCustomAchorRendered()
	{
		// Exclude non-dynamic blocks.
		$exclude = ['testimonial', 'testimonials', 'tabs', 'spacer', 'rowlayout', 'image', 'form', 'countdown', 'column', 'advancedgallery', 'advancedbtn', 'navigation-link', 'singlebtn', 'accordion', 'videopopup'];

		if (!empty($this->block_name) && !in_array($this->block_name, $exclude) && $this->tester->block_supports_anchor('kadence/' . $this->block_name) ) {
			$uniqueID = '123_abcd';
			$attrs = ['anchor' => 'my-custom-anchor-123', 'uniqueID' => $uniqueID];
			$attrs = $this->block->get_attributes_with_defaults( $uniqueID, $attrs );

			$block_instance = $this->generate_block_instance('kadence/' . $this->block_name, $attrs);

			$html = $this->block->build_html($attrs, $uniqueID, '', $block_instance);

			$this->assertStringContainsString('id="my-custom-anchor-123"', $html, $this->block_name . ' anchor rendered');
		}
	}

	function generate_block_instance($block_name, $attributes = [], $inner_blocks = [])
	{
		// Generate inner blocks (if any)
		$inner_block_objects = array_map(function ($block_data) {
			return generate_block_instance($block_data['blockName'], $block_data['attrs'] ?? [], $block_data['innerBlocks'] ?? []);
		}, $inner_blocks);

		return new \WP_Block([
			'blockName' => $block_name,
			'attrs' => $attributes,
			'innerBlocks' => $inner_block_objects,
			'innerHTML' => '',
			'innerContent' => [],
		]);
	}

}

