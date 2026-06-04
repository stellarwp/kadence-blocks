<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Resolved_Tokens;
use Tests\Support\Classes\TestCase;

final class Resolved_TokensTest extends TestCase {

	public function testItExposesBothFlatMaps(): void {
		$by_id  = [ 'semantic.color.button-bg' => '#3182CE' ];
		$by_var = [ '--kb-token--semantic--color--button-bg' => '#3182CE' ];

		$resolved = new Resolved_Tokens( $by_id, $by_var );

		$this->assertSame( $by_id, $resolved->by_id() );
		$this->assertSame( $by_var, $resolved->by_var() );
	}

	public function testValueReturnsTheResolvedValueForAKnownId(): void {
		$resolved = new Resolved_Tokens( [ 'semantic.color.button-bg' => '#3182CE' ], [] );

		$this->assertSame( '#3182CE', $resolved->value( 'semantic.color.button-bg' ) );
	}

	public function testValueReturnsNullForAnUnknownId(): void {
		$resolved = new Resolved_Tokens( [], [] );

		$this->assertNull( $resolved->value( 'nope.not.here' ) );
	}
}
