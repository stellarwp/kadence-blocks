<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Accordion_Block;
use Kadence_Blocks_CSS;
use Tests\Support\Classes\KadenceBlocksUnit;
use Tests\helpers\CSSTestHelper;

class AccordionTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'accordion';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Accordion_Block
	 */
	protected $block;

	/**
	 * CSS instance.
	 *
	 * @var Kadence_Blocks_CSS
	 */
	protected $css;

	public function testIsScriptRegistered() {
		$this->block->register_scripts();

		$this->assertTrue( wp_script_is( 'kadence-blocks-accordion', 'registered' ), 'Block scripts registered' );
	}

	protected function setUp(): void {
		parent::setUp();

		$this->block = new Kadence_Blocks_Accordion_Block();
		$this->css = new Kadence_Blocks_CSS();
	}

	/**
	 * Test basic layout CSS generation
	 */
	public function test_column_layout_css() {
		$unique_id = '123';
		$attributes = [
			'columnLayout' => ['two-column', 'three-column', 'row'],
			'uniqueID' => $unique_id,
		];

		$css_output = $this->block->build_css($attributes, $this->css, $unique_id, $unique_id);
		$css_helper = new CSSTestHelper($css_output);

		// Test desktop styles
		$this->assertTrue(
			$css_helper->assertCSSPropertiesEqual(
				'.kt-accordion-id'.$unique_id.' .kt-accordion-inner-wrap',
				[
					'display' => 'grid',
					'grid-template-columns' => 'repeat(2,minmax(0,1fr))'
				]
			)
		);

		// Test tablet styles
		$this->assertTrue(
			$css_helper->assertMediaQueryProperties(
				'tablet',
				'.kt-accordion-id'.$unique_id.' .kt-accordion-inner-wrap',
				[
					'display' => 'grid',
					'grid-template-columns' => 'repeat(3,minmax(0,1fr))'
				]
			)
		);

		// Test mobile styles
		$this->assertTrue(
			$css_helper->assertMediaQueryProperties(
				'mobile',
				'.kt-accordion-id'.$unique_id.' .kt-accordion-inner-wrap',
				[
					'display' => 'block'
				]
			)
		);
	}
}
