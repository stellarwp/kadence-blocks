<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Registry;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use Tests\Support\Classes\TestCase;

final class RegistrationHelperTest extends TestCase {

	private Token_Registry $registry;

	protected function setUp(): void {
		parent::setUp();

		$this->registry = $this->container->get( Token_Registry::class );
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
		$this->assertSame( [ 'primary', 'secondary', 'ghost' ], $set->variants );
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
				'block'    => 'kadence/testblock',
				'variants' => [ 'a', 'b' ],
			]
		);

		$set = $this->registry->for_block( 'kadence/testblock' );

		$this->assertNotNull( $set );
		$this->assertSame( [ 'a', 'b' ], $set->variants );
	}

	public function testHelperFunctionsExist(): void {
		$this->assertTrue( function_exists( 'kadence_blocks_register_design_token' ) );
		$this->assertTrue( function_exists( 'kadence_blocks_register_design_variant_set' ) );
	}
}
