<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Registry\Baseline;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Baseline\Always_Present_Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Baseline\Empty_Baseline_Document;
use Tests\Support\Classes\TestCase;

final class Baseline_StubsTest extends TestCase {

	public function testEmptyBaselineHasIsAlwaysFalse(): void {
		$baseline = new Empty_Baseline_Document();

		$this->assertFalse( $baseline->has( 'semantic.color.button-bg' ) );
		$this->assertFalse( $baseline->has( 'anything' ) );
	}

	public function testAlwaysPresentBaselineHasIsAlwaysTrue(): void {
		$baseline = new Always_Present_Baseline_Document();

		$this->assertTrue( $baseline->has( 'semantic.color.button-bg' ) );
		$this->assertTrue( $baseline->has( 'anything' ) );
	}
}
