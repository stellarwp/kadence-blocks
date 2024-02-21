<?php

namespace Tests\wpunit\blocks;
class LottieTest extends \KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'lottie';

	/**
	 * Post type for the form.
	 *
	 * @var string
	 */
	protected $post_type = 'kadence_lottie';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Lottie_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Lottie_Block();
	}

	protected function _after() {
	}

	public function testLottieCptRegistered() {
		$this->assertTrue( $this->tester->is_cpt_registered( $this->post_type ), 'Lottie CPT is registered' );
	}

	public function testIsScriptRegistered() {
		$this->block->register_scripts();

		$this->assertTrue( wp_script_is( 'kadence-blocks-lottieinteractivity-js', 'registered' ), 'Lottie interactivity registered' );
		$this->assertTrue( wp_script_is( 'kadence-blocks-dotlottie-player-js', 'registered' ), 'Lottie interactivity registered' );
	}
}
