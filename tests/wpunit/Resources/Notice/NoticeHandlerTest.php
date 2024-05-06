<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Notice;

use KadenceWP\KadenceBlocks\Notice\Notice_Handler;
use KadenceWP\KadenceBlocks\StellarWP\Uplink\Notice\Notice;
use Tests\Support\Classes\TestCase;

final class NoticeHandlerTest extends TestCase {

	private Notice_Handler $notice_handler;

	protected function setUp(): void {
		parent::setUp();

		$this->notice_handler = $this->container->get( Notice_Handler::class );
	}

	public function test_it_stores_and_retrieves_notices(): void {
		$notice_1 = new Notice(
			Notice::INFO,
			__( 'Notice 1 message', 'kadence-blocks' )
		);

		$notice_2 = new Notice(
			Notice::ERROR,
			__( 'Notice 2 message', 'kadence-blocks' )
		);

		$this->notice_handler->add( $notice_1 );

		$this->assertCount( 1, $this->notice_handler->all() );

		$this->notice_handler->add( $notice_2 );

		$this->assertCount( 2, $this->notice_handler->all() );

		$all = $this->notice_handler->all();

		$this->assertSame( $notice_1, $all[0] );
		$this->assertSame( $notice_2, $all[1] );

		$this->notice_handler->clear();

		$this->assertCount( 0, $this->notice_handler->all() );
	}
}
