<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .

namespace Tests\wpunit\Resources\Design_Tokens\Registry;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use Tests\Support\Classes\TestCase;

final class RegistrationHelperTest extends TestCase {

	private Token_Registry $registry;

	protected function setUp(): void {
		parent::setUp();

		$this->registry = $this->container->get( Token_Registry::class );
	}

	protected function tearDown(): void {
		// Token_Registry is a container singleton, so tokens these tests register (semantic.color.test-only,
		// kadence/test-block) would otherwise leak into every later test in the run. Rebind a fresh registry
		// repopulated from the declarations so the container is restored to exactly its declared state —
		// otherwise a leaked token with no baseline entry would trip the guard once SOFT-3377 binds a real
		// baseline, giving an order-dependent failure.
		$this->container->singleton( Token_Registry::class, $this->declared_registry() );

		parent::tearDown();
	}

	/**
	 * A fresh registry populated from the same declarations the Provider loads, so the container is
	 * restored to its bootstrap state without leaking test-only tokens.
	 */
	private function declared_registry(): Token_Registry {
		$registry     = new Token_Registry();
		$declarations = require KADENCE_BLOCKS_PATH . 'includes/resources/Design_Tokens/Registry/declarations.php';

		foreach ( $declarations['tokens'] as $token ) {
			$registry->register( $token );
		}

		foreach ( $declarations['variant_sets'] as $variant_set ) {
			$registry->register_variant_set( $variant_set );
		}

		return $registry;
	}

	public function testTheRegistryIsASingleton(): void {
		$this->assertSame( $this->registry, $this->container->get( Token_Registry::class ) );
	}

	public function testDeclarationsFileRegisteredTheExampleTokens(): void {
		$this->assertTrue( $this->registry->has( 'semantic.color.button-bg' ) );
		$this->assertTrue( $this->registry->has( 'semantic.color.button-text' ) );
	}

	public function testDeclarationsFileRegisteredTheButtonVariantSet(): void {
		$set = $this->registry->for_block( 'kadence/advancedbtn' );

		$this->assertNotNull( $set );
		$this->assertSame( 'kadence/advancedbtn', $set->block );
		$this->assertNotNull( $set->binding( 'button-bg' ) );
	}

	public function testHelperRegistersAgainstTheSharedRegistry(): void {
		kadence_blocks_register_design_token(
			[
				'id'    => 'semantic.color.test-only',
				'type'  => 'color',
				'label' => 'Test Only',
			]
		);

		$this->assertTrue( $this->registry->has( 'semantic.color.test-only' ) );
		$this->assertSame(
			'--kb-token--semantic--color--test-only',
			$this->registry->css_var_for( 'semantic.color.test-only' )
		);
	}

	public function testVariantSetHelperRegistersAgainstTheSharedRegistry(): void {
		kadence_blocks_register_design_variant_set(
			[
				'block'    => 'kadence/test-block',
				'bindings' => [ 'thing' => [ 'kadence_slot' => 'palette1' ] ],
			]
		);

		$set = $this->registry->for_block( 'kadence/test-block' );

		$this->assertNotNull( $set );
		$this->assertSame( 'kadence/test-block', $set->block );
		$this->assertNotNull( $set->binding( 'thing' ) );
	}

	public function testHelperFunctionsExist(): void {
		$this->assertTrue( function_exists( 'kadence_blocks_register_design_token' ) );
		$this->assertTrue( function_exists( 'kadence_blocks_register_design_variant_set' ) );
	}
}
