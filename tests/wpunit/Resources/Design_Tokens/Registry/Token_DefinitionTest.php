<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Registry;

use Generator;
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
	 *
	 * @param string $id
	 *
	 * @return void
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
			'underscore'   => [ 'semantic.color.button_bg' ],
			'leading dot'  => [ '.semantic.color.button-bg' ],
			'trailing dot' => [ 'semantic.color.button-bg.' ],
			'camelCase'    => [ 'semantic.color.buttonBg' ],
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

	/**
	 * @return void
	 */
	public function testFromUserPrimitiveProducesUserCreatedToken(): void {
		$token = Token_Definition::from_user_primitive( 'user.color.primary-blue', 'color', 'Primary Blue' );

		$this->assertTrue( $token->is_user_created() );
		$this->assertSame( 'user.color.primary-blue', $token->id );
		$this->assertSame( 'color', $token->type );
		$this->assertSame( 'Primary Blue', $token->label );
	}

	/**
	 * @return void
	 */
	public function testFromArrayProducesNonUserCreatedToken(): void {
		$token = Token_Definition::from_array(
			[
				'id'    => 'semantic.color.button-bg',
				'type'  => 'color',
				'label' => 'Button Background',
			]
		);

		$this->assertFalse( $token->is_user_created() );
	}

	/**
	 * @return void
	 */
	public function testFromUserPrimitiveThrowsOnInvalidId(): void {
		$this->expectException( InvalidArgumentException::class );

		Token_Definition::from_user_primitive( 'user.color.primaryBlue', 'color' );
	}

	/**
	 * @dataProvider userPrimitiveLabelDerivationProvider
	 *
	 * @param string $id
	 * @param string $expected_label
	 *
	 * @return void
	 */
	public function testFromUserPrimitiveDerivesLabelFromTerminalSlug( string $id, string $expected_label ): void {
		$token = Token_Definition::from_user_primitive( $id, 'color' );

		$this->assertSame( $expected_label, $token->label );
	}

	/**
	 * @return Generator
	 */
	public function userPrimitiveLabelDerivationProvider(): Generator {
		yield 'hyphenated slug' => [
			'id'             => 'user.color.primary-blue',
			'expected_label' => 'Primary Blue',
		];
		yield 'single segment' => [
			'id'             => 'primary',
			'expected_label' => 'Primary',
		];
		yield 'multi-word slug' => [
			'id'             => 'user.color.brand-accent-dark',
			'expected_label' => 'Brand Accent Dark',
		];
	}

	/**
	 * @return void
	 */
	public function testFromUserPrimitiveUsesExplicitLabelWhenProvided(): void {
		$token = Token_Definition::from_user_primitive( 'user.color.primary-blue', 'color', 'My Custom Label' );

		$this->assertSame( 'My Custom Label', $token->label );
	}
}
