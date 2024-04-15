<?php

namespace Tests\wpunit\Classes;

use Kadence_Blocks_Table_Of_Contents;
use Codeception\TestCase\WPTestCase;
use Tests\wpunit\KadenceBlocksTestCase;

class TableOfContentsClassTest extends KadenceBlocksTestCase {
	protected $classInstance;

	protected function _before()
	{
		$this->classInstance = Kadence_Blocks_Table_Of_Contents::get_instance();
	}

	protected function _after()
	{
		// Reset the instance
		$this->invokeMethod( $this->classInstance, 'reset_instance' );
	}

	public function testConvertTextToAnchor() {
		$convertedText = $this->invokeMethod( $this->classInstance, 'convert_text_to_anchor' , [ 'Hello World' ] );
		$this->assertEquals('hello-world', $convertedText);
	}

	public function testGetHeadingsFromContent() {
		$content = "<h1>Test Heading</h1>";
		$attributes = [];
		$headings = $this->invokeMethod( $this->classInstance, 'table_of_contents_get_headings_from_content', [ $content, 1, 1, $attributes ] );

		$this->assertCount(1, $headings);
		$this->assertEquals('Test Heading', $headings[0]['content']);
		$this->assertEquals(1, $headings[0]['level']);
	}

	/**
	 * Test headings are included
	 *
	 * @return void
	 */
	public function testSimpleHeadingsExtraction()
	{
		$content = <<<HTML
			<h1>Heading 1</h1>
			<h2>Heading 2</h2>
			<h3>Heading 3</h3>
		HTML;

		$post = $this->factory->post->create_and_get([
			'post_content' => $content,
		]);

		$attributes = [
			'allowedHeaders' => [0 => ['h1' => true, 'h2' => true, 'h3' => true]]
		];
		$result = $this->invokeMethod( $this->classInstance, 'table_of_contents_get_headings', [ $post, $attributes ] );

		$this->assertIsArray($result, 'Heading results should be an array');
		$this->assertCount(3, $result, 'There should be three headings extracted');
		$this->assertEquals('Heading 1', $result[0]['content']);
		$this->assertEquals(1, $result[0]['level']);
		$this->assertEquals('Heading 2', $result[1]['content']);
		$this->assertEquals(2, $result[1]['level']);
		$this->assertEquals('Heading 3', $result[2]['content']);
		$this->assertEquals(3, $result[2]['level']);
	}

	/**
	 * Test headings can use data-toc-include attribute to include specific headings
	 *
	 * @return void
	 */
	public function testGetHeadingsWithAttributesAndDataTocInclude() {
		$content = <<<HTML
            <h1>Heading 1</h1>
            <h2>Heading 2</h2>
            <h2 data-toc-include="true">Included Heading 2</h2>
            <h3>Heading 3</h3>
HTML;
		$post = $this->factory->post->create_and_get([
			'post_content' => $content,
		]);

		// Only allow h1 and h3 through attributes, but h2 has data-toc-include
		$attributes = [
			'allowedHeaders' => [0 => ['h1' => true, 'h2' => false, 'h3' => true]]
		];

		$result = $this->invokeMethod( $this->classInstance, 'table_of_contents_get_headings', [ $post, $attributes ] );
		$this->assertCount(3, $result, 'Expected three headings to be included.');

		// Check if the included h2 heading is indeed in the result, despite being disallowed by attributes
		$foundIncludedH2 = false;
		foreach ($result as $heading) {
			if ($heading['content'] === 'Included Heading 2') {
				$foundIncludedH2 = true;
				break;
			}
		}
		$this->assertTrue($foundIncludedH2, 'The h2 heading with data-toc-include was not included as expected.');
	}

	/**
	 * Test headings can use data-toc-include attribute to exclude specific headings
	 *
	 * @return void
	 */
	public function testGetHeadingsWithAttributesAndDataTocExclude() {
		$content = <<<HTML
            <h1>Heading 1</h1>
            <h2>Heading 2</h2>
            <h3 data-toc-include="false">Heading 3</h3>
HTML;
		$post = $this->factory->post->create_and_get([
			'post_content' => $content,
		]);

		$attributes = [
			'allowedHeaders' => [0 => ['h1' => true, 'h2' => true, 'h3' => true]]
		];

		$result = $this->invokeMethod( $this->classInstance, 'table_of_contents_get_headings', [ $post, $attributes ] );

		$this->assertCount(2, $result, 'Expected three headings to be included.');

		// Check if the included h3 heading is excluded in the result
		$foundIncludedH3 = false;
		foreach ($result as $heading) {
			if ($heading['content'] === 'Heading 3') {
				$foundIncludedH3 = true;
				break;
			}
		}
		$this->assertFalse($foundIncludedH3, 'The h3 heading with data-toc-include set to false was included.');
	}

	/**
	 * Test headings can use data-alt-title attribute
	 *
	 * @return void
	 */
	public function testGetHeadingsWithAttributesAndDataAltTitle() {
		$content = <<<HTML
			<h1 data-alt-title="My custom title">Heading 1</h1>
			<h2>Heading 2</h2>
		HTML;

		$post = $this->factory->post->create_and_get([
			'post_content' => $content,
		]);

		$attributes = [
			'allowedHeaders' => [0 => ['h1' => true, 'h2' => true, 'h3' => true]]
		];

		$result = $this->invokeMethod( $this->classInstance, 'table_of_contents_get_headings', [ $post, $attributes ] );

		$this->assertIsArray($result, 'Heading results should be an array');
		$this->assertCount(2, $result, 'There should be three headings extracted');
		$this->assertEquals('My custom title', $result[0]['content']);
		$this->assertEquals(1, $result[0]['level']);
		$this->assertEquals('Heading 2', $result[1]['content']);
		$this->assertEquals(2, $result[1]['level']);
	}
}
