<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Registry;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Binding;
use Tests\Support\Classes\TestCase;

final class BindingTest extends TestCase {

	/**
	 * @return void
	 */
	public function testItParsesATokenReference(): void {
		$binding = Binding::from_array( 'button-bg', [ 'token' => 'semantic.color.button-bg' ] );

		$this->assertTrue( $binding->is_token_ref() );
		$this->assertSame( 'semantic.color.button-bg', $binding->token );
		$this->assertSame( [], $binding->projections );
	}

	/**
	 * @return void
	 */
	public function testItParsesInlineTargets(): void {
		$binding = Binding::from_array(
			'button-bg',
			[
				'kadence_slot' => 'palette3',
				'block_attr'   => 'background',
			]
		);

		$this->assertFalse( $binding->is_token_ref() );
		$this->assertNull( $binding->token );
		$this->assertSame(
			[
				'kadence_slot' => 'palette3',
				'block_attr'   => 'background',
			],
			$binding->projections
		);
	}

	/**
	 * @return void
	 */
	public function testItAcceptsTheBlockAttrTarget(): void {
		$binding = Binding::from_array( 'button-bg', [ 'block_attr' => 'background' ] );

		$this->assertSame( [ 'block_attr' => 'background' ], $binding->projections );
	}

	/**
	 * @return void
	 */
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
		$unbound = Binding::from_array( 'button-radius', [ 'css_var' => 'kb-btn-radius' ] );
		$this->assertNull( $unbound->block_attr() );
	}

	/**
	 * @return void
	 */
	public function testItAcceptsTheCssPropAndSelectorTargets(): void {
		$binding = Binding::from_array(
			'borderRadius',
			[
				'token'        => 'semantic.radius.media',
				'css_prop'     => 'border-radius',
				'css_selector' => ' img',
			]
		);

		$this->assertSame( 'border-radius', $binding->css_prop() );
		$this->assertSame( ' img', $binding->css_selector() );
	}

	/**
	 * @return void
	 */
	public function testCssPropAndSelectorReturnNullWhenAbsent(): void {
		// A binding with no css_prop/css_selector feeds no block-default rule.
		$binding = Binding::from_array( 'button-radius', [ 'css_var' => 'kb-btn-radius' ] );

		$this->assertNull( $binding->css_prop() );
		$this->assertNull( $binding->css_selector() );
	}

	/**
	 * @return void
	 */
	public function testItThrowsWhenCssPropIsNotAString(): void {
		$this->expectException( InvalidArgumentException::class );

		Binding::from_array( 'borderRadius', [ 'css_prop' => true ] );
	}

	/**
	 * @return void
	 */
	public function testItAcceptsACssVarTarget(): void {
		$binding = Binding::from_array( 'button-radius', [ 'css_var' => 'kb-btn-radius' ] );

		$this->assertSame( 'kb-btn-radius', $binding->css_var() );
		$this->assertSame( [ 'css_var' => 'kb-btn-radius' ], $binding->projections );
	}

	/**
	 * @return void
	 */
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

	/**
	 * @return void
	 */
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

	/**
	 * @return void
	 */
	public function testItThrowsOnAnEmptyTokenReference(): void {
		$this->expectException( InvalidArgumentException::class );

		Binding::from_array( 'button-bg', [ 'token' => '' ] );
	}

	/**
	 * @return void
	 */
	public function testItThrowsWhenNeitherFormIsPresent(): void {
		$this->expectException( InvalidArgumentException::class );

		Binding::from_array( 'button-bg', [] );
	}

	/**
	 * @return void
	 */
	public function testItThrowsWhenAStringTargetIsNotAString(): void {
		$this->expectException( InvalidArgumentException::class );

		Binding::from_array( 'button-bg', [ 'kadence_slot' => true ] );
	}

	/**
	 * @return void
	 */
	public function testItThrowsWhenCssVarIsNotAString(): void {
		$this->expectException( InvalidArgumentException::class );

		Binding::from_array( 'button-radius', [ 'css_var' => false ] );
	}
}
