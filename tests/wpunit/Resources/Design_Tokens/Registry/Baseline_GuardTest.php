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

	/** @var \WP_Hook|null Clone of $wp_filter['admin_notices'] taken in setUp. */
	private $admin_notices_snapshot;

	protected function setUp(): void {
		parent::setUp();

		$this->logger = new TestLogger();

		// Clone admin_notices so the production path's registered callback can be removed in tearDown
		// without clobbering callbacks other code registered at bootstrap. A clone (not a reference) is
		// required because WP_Hook is mutated in place by add_action().
		global $wp_filter;
		$this->admin_notices_snapshot = isset( $wp_filter['admin_notices'] ) ? clone $wp_filter['admin_notices'] : null;
	}

	protected function tearDown(): void {
		// Restore the snapshot so the production path's admin_notices callback can't leak into sibling
		// tests via the global $wp_filter, while leaving any bootstrap-registered callbacks intact.
		global $wp_filter;
		if ( $this->admin_notices_snapshot !== null ) {
			$wp_filter['admin_notices'] = $this->admin_notices_snapshot; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- Restoring the snapshotted hook state captured in setUp() to avoid leaking into sibling tests.
		} else {
			unset( $wp_filter['admin_notices'] );
		}

		parent::tearDown();
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

	public function testItResolvesFromTheContainerAgainstTheBoundBaselineDocument(): void {
		// Exercises the real autowiring path: Token_Registry singleton, the bound Baseline_Document
		// (the shipped Json_Baseline_Document), the LoggerInterface bound by Log_Provider, and the
		// optional $throw_on_missing default. The shipped baseline has an entry for every declared
		// token, so the guard is a no-op and projection stays active.
		$registry = $this->container->get( Token_Registry::class );

		$this->container->get( Baseline_Guard::class )->run();

		$this->assertTrue( $registry->is_active() );
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
