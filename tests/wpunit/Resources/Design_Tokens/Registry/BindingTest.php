<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Registry;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Binding;
use Tests\Support\Classes\TestCase;

final class BindingTest extends TestCase {

	public function testItParsesATokenReference(): void {
		$binding = Binding::from_array( 'button-bg', [ 'token' => 'semantic.color.button-bg' ] );

		$this->assertTrue( $binding->is_token_ref() );
		$this->assertSame( 'semantic.color.button-bg', $binding->token );
		$this->assertSame( [], $binding->projections );
	}

	public function testItParsesInlineTargets(): void {
		$binding = Binding::from_array(
			'button-bg',
			[
				'kadence_slot' => 'palette3',
				'wp_preset'    => 'color',
			] 
		);

		$this->assertFalse( $binding->is_token_ref() );
		$this->assertNull( $binding->token );
		$this->assertSame(
			[
				'kadence_slot' => 'palette3',
				'wp_preset'    => 'color',
			],
			$binding->projections 
		);
	}

	public function testItAcceptsTheBlockAttrTarget(): void {
		$binding = Binding::from_array( 'button-bg', [ 'block_attr' => 'background' ] );

		$this->assertSame( [ 'block_attr' => 'background' ], $binding->projections );
	}

	public function testBlockAttrReturnsTheBoundAttributeOrNull(): void {
		$bound = Binding::from_array(
			'button-bg',
			[
				'token'      => 'semantic.color.button-bg',
				'block_attr' => 'background',
			]
		);
		$this->assertSame( 'background', $bound->block_attr() );

		// A binding with no block_attr target has no attribute to seed.
		$unbound = Binding::from_array( 'button-radius', [ 'css_var' => true ] );
		$this->assertNull( $unbound->block_attr() );
	}

	public function testItAcceptsTheCssVarFlag(): void {
		$binding = Binding::from_array( 'button-radius', [ 'css_var' => true ] );

		$this->assertSame( [ 'css_var' => true ], $binding->projections );
	}

	public function testItIgnoresUnrecognisedKeys(): void {
		$binding = Binding::from_array(
			'button-bg',
			[
				'kadence_slot' => 'palette1',
				'bogus'        => 'x',
			] 
		);

		$this->assertSame( [ 'kadence_slot' => 'palette1' ], $binding->projections );
	}

	public function testItAcceptsATokenReferenceWithAnInlineTarget(): void {
		// Both forms compose: a token reference plus a block_attr the token never carries.
		$binding = Binding::from_array(
			'button-bg',
			[
				'token'      => 'semantic.color.button-bg',
				'block_attr' => 'background',
			]
		);

		$this->assertTrue( $binding->is_token_ref() );
		$this->assertSame( 'semantic.color.button-bg', $binding->token );
		$this->assertSame( [ 'block_attr' => 'background' ], $binding->projections );
	}

	public function testItThrowsOnAnEmptyTokenReference(): void {
		$this->expectException( InvalidArgumentException::class );

		Binding::from_array( 'button-bg', [ 'token' => '' ] );
	}

	public function testItThrowsWhenNeitherFormIsPresent(): void {
		$this->expectException( InvalidArgumentException::class );

		Binding::from_array( 'button-bg', [] );
	}

	public function testItThrowsWhenAStringTargetIsNotAString(): void {
		$this->expectException( InvalidArgumentException::class );

		Binding::from_array( 'button-bg', [ 'kadence_slot' => true ] );
	}

	public function testItThrowsWhenCssVarIsNotTrue(): void {
		$this->expectException( InvalidArgumentException::class );

		Binding::from_array( 'button-radius', [ 'css_var' => false ] );
	}
}
