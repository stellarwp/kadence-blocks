<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Advanced_Form_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class AdvancedFormTest extends KadenceBlocksUnit {
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

	public function testFormCptRegistered() {
		$this->assertTrue( $this->tester->is_cpt_registered( $this->post_type ), 'Kadence Form CPT is registered' );
	}

	public function testIsScriptRegistered() {
		$this->block->register_scripts();

		$this->assertTrue( wp_script_is( 'kadence-blocks-' . $this->block_name, 'registered' ),
			'Base script is registered' );
	}

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Advanced_Form_Block();
	}


}
