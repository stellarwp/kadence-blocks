<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Schema\Vocabulary;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Sentinels;
use Tests\Support\Classes\TestCase;

final class SentinelsTest extends TestCase {

	public function testItDetectsAResetSentinel(): void {
		$this->assertTrue( Sentinels::is_reset( [ '$value' => null ] ) );
	}

	public function testAConcreteValueIsNotAReset(): void {
		$this->assertFalse( Sentinels::is_reset( [ '$value' => '#fff' ] ) );
	}

	public function testAnAbsentValueIsNotAReset(): void {
		$this->assertFalse( Sentinels::is_reset( [ '$type' => 'color' ] ) );
	}

	public function testItDetectsADisableSentinel(): void {
		$this->assertTrue( Sentinels::has_disabled( [ '$disabled' => true ] ) );
		$this->assertTrue( Sentinels::is_disabled( [ '$disabled' => true ] ) );
	}

	public function testADisabledKeyThatIsNotTrueIsPresentButInvalid(): void {
		$this->assertTrue( Sentinels::has_disabled( [ '$disabled' => 'yes' ] ) );
		$this->assertFalse( Sentinels::is_disabled( [ '$disabled' => 'yes' ] ) );
		$this->assertFalse( Sentinels::is_disabled( [ '$disabled' => false ] ) );
	}

	public function testTheKeysAreDollarPrefixed(): void {
		$this->assertSame( '$disabled', Sentinels::get_disabled_key() );
		$this->assertSame( '$value', Sentinels::get_value_key() );
	}
}
