<?php

class AdvancedFormTest extends \KadenceBlocksUnit
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
	protected $block_name = 'advanced-form';

	/**
	 * Post type for the form.
	 *
	 * @var string
	 */
	protected $post_type = 'kadence_form';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Advanced_Form_Block
	 */
	protected $block;

	protected function _before()
	{
		$this->block = new \Kadence_Blocks_Advanced_Form_Block();
	}

	protected function _after()
	{
	}

	public function testFormCptRegistered() {
		$this->assertTrue( $this->tester->is_cpt_registered( $this->post_type ), 'Kadence Form CPT is registered' );
	}

	public function testIsScriptRegistered() {
		$this->block->register_scripts();

		$this->assertTrue( wp_script_is( 'kadence-blocks-' . $this->block_name, 'registered' ), 'Base script is registered' );
	}

}
