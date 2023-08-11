<?php

namespace Tests\wpunit\blocks;

class AccordionBlockTest extends \Codeception\Test\Unit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	protected $css;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Accordion_Block();
		$this->css = new \Kadence_Blocks_CSS();
	}

	protected function _after() {
	}

	public function testContentBorderCss() {
		$this->assertEquals(
			$this->block->build_css(
				array( 'contentBorder' => array( '1', '2', '3', '4') ),
				$this->css,
				'my_unique_id',
				'my_unique_style_id'
			),
			'.kt-accordion-idmy_unique_id .kt-accordion-panel-inner{border-top-width:1px;border-right-width:2px;border-bottom-width:3px;border-left-width:4px;}'
		);
	}
}
