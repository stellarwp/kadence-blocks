<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Schema\Vocabulary;

use Generator;
use ReflectionMethod;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Responsive;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;
use Tests\Support\Classes\TestCase;

final class ResponsiveTest extends TestCase {

	/**
	 * Only the dimension and lineHeight scalar types are responsive-capable; single-value and composite
	 * types are not.
	 *
	 * @dataProvider capableProvider
	 *
	 * @param string $type     The token $type.
	 * @param bool   $expected Whether the type may carry the responsive / clamp shape.
	 *
	 * @return void
	 */
	public function testIsResponsiveCapable( string $type, bool $expected ): void {
		$this->assertSame( $expected, Responsive::is_responsive_capable( $type ) );
	}

	/**
	 * @return Generator
	 */
	public function capableProvider(): Generator {
		yield 'dimension' => [
			'type'     => Token_Type::get_type_dimension(),
			'expected' => true,
		];
		yield 'lineHeight' => [
			'type'     => Token_Type::get_type_line_height(),
			'expected' => true,
		];
		yield 'fontFamily' => [
			'type'     => Token_Type::get_type_font_family(),
			'expected' => false,
		];
		yield 'fontWeight' => [
			'type'     => Token_Type::get_type_font_weight(),
			'expected' => false,
		];
		yield 'color' => [
			'type'     => Token_Type::get_type_color(),
			'expected' => false,
		];
		yield 'shadow' => [
			'type'     => Token_Type::get_type_shadow(),
			'expected' => false,
		];
	}

	/**
	 * The extension readers return the responsive / clamp maps from a leaf, and report their presence.
	 *
	 * @return void
	 */
	public function testItReadsTheResponsiveShapeFromALeaf(): void {
		$leaf = [
			'$type'       => 'dimension',
			'$value'      => '1.125rem',
			'$extensions' => [
				'com.kadence.designTokens' => [
					'responsive' => [
						'tablet' => '1rem',
						'mobile' => '0.9rem',
					],
				],
			],
		];

		$this->assertTrue( Responsive::has_responsive( $leaf ) );
		$this->assertFalse( Responsive::has_clamp( $leaf ) );
		$this->assertSame(
			[
				'tablet' => '1rem',
				'mobile' => '0.9rem',
			],
			Responsive::responsive_of( $leaf )
		);
		$this->assertNull( Responsive::clamp_of( $leaf ) );
	}

	/**
	 * The clamp reader returns the structured clamp map from a leaf.
	 *
	 * @return void
	 */
	public function testItReadsTheClampShapeFromALeaf(): void {
		$leaf = [
			'$type'       => 'dimension',
			'$value'      => 'clamp(1.1rem, 0.995rem + 0.326vw, 1.25rem)',
			'$extensions' => [
				'com.kadence.designTokens' => [
					'clamp' => [
						'min'       => '1.1rem',
						'preferred' => '0.995rem + 0.326vw',
						'max'       => '1.25rem',
					],
				],
			],
		];

		$this->assertTrue( Responsive::has_clamp( $leaf ) );
		$this->assertFalse( Responsive::has_responsive( $leaf ) );
		$this->assertSame( '0.995rem + 0.326vw', Responsive::clamp_of( $leaf )[ Responsive::get_clamp_preferred_key() ] );
	}

	/**
	 * A flat leaf (no $extensions) reports no responsive / clamp shape and yields null readers, so it is
	 * interpreted identically to a leaf that predates responsive support.
	 *
	 * @return void
	 */
	public function testAFlatLeafHasNoShape(): void {
		$leaf = [
			'$type'  => 'dimension',
			'$value' => '1.125rem',
		];

		$this->assertFalse( Responsive::has_responsive( $leaf ) );
		$this->assertFalse( Responsive::has_clamp( $leaf ) );
		$this->assertNull( Responsive::responsive_of( $leaf ) );
		$this->assertNull( Responsive::clamp_of( $leaf ) );
		$this->assertSame( [], $this->extensionOf( $leaf ) );
	}

	/**
	 * A leaf whose only extension is a foreign vendor namespace is not read as a responsive / clamp shape.
	 *
	 * @return void
	 */
	public function testAForeignNamespaceIsIgnored(): void {
		$leaf = [
			'$type'       => 'dimension',
			'$value'      => '1rem',
			'$extensions' => [
				'com.example.other' => [ 'responsive' => [ 'tablet' => '0.9rem' ] ],
			],
		];

		$this->assertFalse( Responsive::has_responsive( $leaf ) );
		$this->assertSame( [], $this->extensionOf( $leaf ) );
	}

	/**
	 * The breakpoint keys are tablet then mobile, in cascade order.
	 *
	 * @return void
	 */
	public function testTheBreakpointKeys(): void {
		$this->assertSame( [ 'tablet', 'mobile' ], Responsive::get_breakpoint_keys() );
	}

	/**
	 * Invoke the private Responsive::extension_of() via reflection, so its behavior stays directly covered
	 * even though it is no longer part of the public reader seam.
	 *
	 * @param array<string, mixed> $leaf The decoded token leaf.
	 *
	 * @return array<string, mixed> The module leaf-extension map.
	 */
	private function extensionOf( array $leaf ): array {
		$method = new ReflectionMethod( Responsive::class, 'extension_of' );
		$method->setAccessible( true );

		return $method->invoke( null, $leaf );
	}
}
