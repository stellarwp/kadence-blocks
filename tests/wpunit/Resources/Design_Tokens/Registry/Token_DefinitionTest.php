<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Registry;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Definition;
use Tests\Support\Classes\TestCase;

final class Token_DefinitionTest extends TestCase {

	public function testItDerivesTheCssVarFromTheId(): void {
		$token = Token_Definition::from_array(
			[
				'id'    => 'semantic.color.button-bg',
				'type'  => 'color',
				'label' => 'Button Background',
			]
		);

		$this->assertSame( '--kb-token--semantic--color--button-bg', $token->css_var );
	}

	public function testItHonoursAnExplicitCssVarOverride(): void {
		$token = Token_Definition::from_array(
			[
				'id'      => 'semantic.color.button-bg',
				'type'    => 'color',
				'label'   => 'Button Background',
				'css_var' => '--global-palette1',
			]
		);

		$this->assertSame( '--global-palette1', $token->css_var );
	}

	public function testItDefaultsGroupAndProjections(): void {
		$token = Token_Definition::from_array(
			[
				'id'    => 'semantic.color.button-bg',
				'type'  => 'color',
				'label' => 'Button Background',
			]
		);

		$this->assertSame( '', $token->group );
		$this->assertSame( [], $token->projections );
	}

	public function testItRetainsGroupAndProjections(): void {
		$token = Token_Definition::from_array(
			[
				'id'          => 'semantic.color.button-bg',
				'type'        => 'color',
				'label'       => 'Button Background',
				'group'       => 'Brand',
				'projections' => [ 'wp_preset' => 'color' ],
			]
		);

		$this->assertSame( 'Brand', $token->group );
		$this->assertSame( [ 'wp_preset' => 'color' ], $token->projections );
	}

	public function testHasProjectionReportsDeclaredTargets(): void {
		$token = Token_Definition::from_array(
			[
				'id'          => 'semantic.color.button-bg',
				'type'        => 'color',
				'label'       => 'Button Background',
				'projections' => [ 'wp_preset' => 'color' ],
			]
		);

		$this->assertTrue( $token->has_projection( 'wp_preset' ) );
		$this->assertFalse( $token->has_projection( 'kadence_slot' ) );
	}

	/**
	 * @dataProvider missingRequiredProvider
	 *
	 * @param array<string, mixed> $definition
	 */
	public function testItThrowsWhenRequiredKeysAreMissing( array $definition ): void {
		$this->expectException( InvalidArgumentException::class );

		Token_Definition::from_array( $definition );
	}

	/**
	 * @return array<string, array{0: array<string, mixed>}>
	 */
	public function missingRequiredProvider(): array {
		return [
			'missing id'    => [
				[
					'type'  => 'color',
					'label' => 'Button Background',
				],
			],
			'missing type'  => [
				[
					'id'    => 'semantic.color.button-bg',
					'label' => 'Button Background',
				],
			],
			'missing label' => [
				[
					'id'   => 'semantic.color.button-bg',
					'type' => 'color',
				],
			],
			'empty id'      => [
				[
					'id'    => '',
					'type'  => 'color',
					'label' => 'Button Background',
				],
			],
		];
	}

	/**
	 * @dataProvider malformedIdProvider
	 */
	public function testItThrowsWhenIdHasAnInvalidCharset( string $id ): void {
		$this->expectException( InvalidArgumentException::class );

		Token_Definition::from_array(
			[
				'id'    => $id,
				'type'  => 'color',
				'label' => 'Button Background',
			]
		);
	}

	/**
	 * @return array<string, array{0: string}>
	 */
	public function malformedIdProvider(): array {
		return [
			'space'        => [ 'semantic.color.button bg' ],
			'slash'        => [ 'semantic/color/button-bg' ],
			'uppercase'    => [ 'semantic.Color.button-bg' ],
			'leading dot'  => [ '.semantic.color.button-bg' ],
			'trailing dot' => [ 'semantic.color.button-bg.' ],
		];
	}

	/**
	 * @dataProvider wrongTypeOptionalProvider
	 *
	 * @param array<string, mixed> $definition
	 */
	public function testItThrowsWhenOptionalKeysAreTheWrongType( array $definition ): void {
		$this->expectException( InvalidArgumentException::class );

		Token_Definition::from_array( $definition );
	}

	/**
	 * @return array<string, array{0: array<string, mixed>}>
	 */
	public function wrongTypeOptionalProvider(): array {
		$base = [
			'id'    => 'semantic.color.button-bg',
			'type'  => 'color',
			'label' => 'Button Background',
		];

		return [
			'non-string group'      => [ $base + [ 'group' => [ 'Brand' ] ] ],
			'non-string css_var'    => [ $base + [ 'css_var' => 123 ] ],
			'non-array projections' => [ $base + [ 'projections' => 'wp_preset' ] ],
		];
	}
}
