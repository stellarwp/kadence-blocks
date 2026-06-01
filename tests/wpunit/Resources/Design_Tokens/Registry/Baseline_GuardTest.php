<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Registry;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Baseline\Always_Present_Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Baseline\Empty_Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Baseline_Guard;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Exception\Missing_Baseline_Entry;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Psr\Log\Test\TestLogger;
use Tests\Support\Classes\TestCase;

final class Baseline_GuardTest extends TestCase {

	private TestLogger $logger;

	protected function setUp(): void {
		parent::setUp();

		$this->logger = new TestLogger();
	}

	private function registry_with_one_token(): Token_Registry {
		$registry = new Token_Registry();
		$registry->register(
			[
				'id'    => 'semantic.color.button-bg',
				'type'  => 'color',
				'label' => 'Button Background',
			]
		);

		return $registry;
	}

	private function guard( Token_Registry $registry, Baseline_Document $baseline, bool $debug ): Baseline_Guard {
		return new Baseline_Guard( $registry, $baseline, $this->logger, $debug );
	}

	public function testValidBaselineDoesNotThrowOrDeactivateOrLog(): void {
		$registry = $this->registry_with_one_token();

		$this->guard( $registry, new Always_Present_Baseline_Document(), true )->run();

		$this->assertTrue( $registry->is_active() );
		$this->assertFalse( $this->logger->hasErrorRecords() );
	}

	public function testMissingEntriesUnderDebugThrows(): void {
		$registry = $this->registry_with_one_token();

		$this->expectException( Missing_Baseline_Entry::class );

		$this->guard( $registry, new Empty_Baseline_Document(), true )->run();
	}

	public function testMissingEntriesUnderDebugLogsBeforeThrowing(): void {
		$registry = $this->registry_with_one_token();

		try {
			$this->guard( $registry, new Empty_Baseline_Document(), true )->run();
			$this->fail( 'Expected Missing_Baseline_Entry to be thrown.' );
		} catch ( Missing_Baseline_Entry $e ) {
			$this->assertTrue( $this->logger->hasErrorRecords() );
			$this->assertStringContainsString( 'semantic.color.button-bg', $e->getMessage() );
		}
	}

	public function testMissingEntriesInProductionDeactivatesLogsAndRegistersNotice(): void {
		$registry = $this->registry_with_one_token();

		$before = $this->count_admin_notices();

		$this->guard( $registry, new Empty_Baseline_Document(), false )->run();

		$this->assertFalse( $registry->is_active() );
		$this->assertTrue( $this->logger->hasErrorRecords() );
		$this->assertSame( $before + 1, $this->count_admin_notices() );
	}

	private function count_admin_notices(): int {
		global $wp_filter;

		if ( ! isset( $wp_filter['admin_notices'] ) ) {
			return 0;
		}

		$count = 0;
		foreach ( $wp_filter['admin_notices']->callbacks as $callbacks ) {
			$count += count( $callbacks );
		}

		return $count;
	}
}
