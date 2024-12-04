<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Table_Block;
use Tests\helpers\CSSTestHelper;
use Tests\Support\Classes\KadenceBlocksUnit;

class TableTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'table';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Table_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Table_Block();
		$this->css = new \Kadence_Blocks_CSS();
	}

	public function testStandardBackgroundCss() {
		$unique_id = '123';
		$attributes = [
			'backgroundColorEven' => 'red',
			'backgroundHoverColorEven' => 'blue',
			'uniqueID' => $unique_id,
		];

		$css_output = $this->block->build_css($attributes, $this->css, $unique_id, $unique_id);
		$css_helper = new CSSTestHelper($css_output);

		$this->assertTrue(
			$css_helper->assertCSSPropertiesEqual(
				'.kb-table'.$unique_id.' tr',
				[
					'background-color' => 'red'
				]
			)
		);

		$this->assertTrue(
			$css_helper->assertCSSPropertiesEqual(
				'.kb-table'.$unique_id.' tr:hover',
				[
					'background-color' => 'blue'
				]
			)
		);
	}

	public function testEvenOddBackgroundCss() {
		$unique_id = '123';
		$attributes = [
			'evenOddBackground' => true,
			'backgroundColorEven' => '#111',
			'backgroundHoverColorEven' => '#222',
			'backgroundColorOdd' => '#333',
			'backgroundHoverColorOdd' => '#444',
			'uniqueID' => $unique_id,
		];

		$css_output = $this->block->build_css($attributes, $this->css, $unique_id, $unique_id);
		$css_helper = new CSSTestHelper($css_output);

		$this->assertTrue(
			$css_helper->assertCSSPropertiesEqual(
				'.kb-table'.$unique_id.' tr:nth-child(even)',
				[
					'background-color' => '#111'
				]
			)
		);

		$this->assertTrue(
			$css_helper->assertCSSPropertiesEqual(
				'.kb-table'.$unique_id.' tr:nth-child(even):hover',
				[
					'background-color' => '#222'
				]
			)
		);

		$this->assertTrue(
			$css_helper->assertCSSPropertiesEqual(
				'.kb-table'.$unique_id.' tr:nth-child(odd)',
				[
					'background-color' => '#333'
				]
			)
		);

		$this->assertTrue(
			$css_helper->assertCSSPropertiesEqual(
				'.kb-table'.$unique_id.' tr:nth-child(odd):hover',
				[
					'background-color' => '#444'
				]
			)
		);
	}

	public function testNoColumnBackgroundCss() {
		$unique_id = '123';
		$attributes = [
			'columnBackgrounds' => [], // No column backgrounds
			'uniqueID' => $unique_id,
		];

		$css_output = $this->block->build_css($attributes, $this->css, $unique_id, $unique_id);

		$this->assertEmpty($css_output);
	}

	public function testNoColumnHoverBackgroundCss() {
		$unique_id = '123';
		$attributes = [
			'columnBackgroundsHover' => [], // No column backgrounds
			'uniqueID' => $unique_id,
		];

		$css_output = $this->block->build_css($attributes, $this->css, $unique_id, $unique_id);

		$this->assertEmpty($css_output);
	}

	public function testColumndBackgroundCss() {
		$unique_id = '123';
		$attributes = [
			'columnBackgrounds' => [ null, '#fff', '#444', null, 'red'], // No column backgrounds
			'uniqueID' => $unique_id,
		];

		$css_output = $this->block->build_css($attributes, $this->css, $unique_id, $unique_id);
		$css_helper = new CSSTestHelper($css_output);


		$this->assertStringNotContainsString( 'td:nth-child(1)', $css_output );
		$this->assertStringNotContainsString( 'td:nth-child(4)', $css_output );

		$this->assertTrue(
			$css_helper->assertCSSPropertiesEqual(
				'.kb-table'.$unique_id.' td:nth-child(2)',
				[
					'background-color' => '#fff'
				]
			)
		);

		$this->assertTrue(
			$css_helper->assertCSSPropertiesEqual(
				'.kb-table'.$unique_id.' td:nth-child(3)',
				[
					'background-color' => '#444'
				]
			)
		);

		$this->assertTrue(
			$css_helper->assertCSSPropertiesEqual(
				'.kb-table'.$unique_id.' td:nth-child(5)',
				[
					'background-color' => 'red'
				]
			)
		);
	}

	public function testColumndHoverBackgroundCss() {
		$unique_id = '123';
		$attributes = [
			'columnBackgroundsHover' => [ null, '#111', '#333', null, 'blue'],
			'uniqueID' => $unique_id,
		];

		$css_output = $this->block->build_css($attributes, $this->css, $unique_id, $unique_id);
		$css_helper = new CSSTestHelper($css_output);


		$this->assertStringNotContainsString( 'td:nth-child(1):hover', $css_output );
		$this->assertStringNotContainsString( 'td:nth-child(4):hover', $css_output );

		$this->assertTrue(
			$css_helper->assertCSSPropertiesEqual(
				'.kb-table'.$unique_id.' td:nth-child(2):hover',
				[
					'background-color' => '#111'
				]
			)
		);

		$this->assertTrue(
			$css_helper->assertCSSPropertiesEqual(
				'.kb-table'.$unique_id.' td:nth-child(3):hover',
				[
					'background-color' => '#333'
				]
			)
		);

		$this->assertTrue(
			$css_helper->assertCSSPropertiesEqual(
				'.kb-table'.$unique_id.' td:nth-child(5):hover',
				[
					'background-color' => 'blue'
				]
			)
		);
	}
}
