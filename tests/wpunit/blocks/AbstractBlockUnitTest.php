<?php

abstract class KadenceBlocksUnit extends \Codeception\Test\Unit {

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

	public function testBlockIsRegistered() {
		if( !empty( $this->block_name ) ) {
			$this->assertTrue( $this->tester->is_block_registered( 'kadence/' . $this->block_name ), $this->block_name . ' block is registered' );
		} else {
			$this->addWarning( 'This block is missing a defined $block_name value.' );
		}
	}

}

