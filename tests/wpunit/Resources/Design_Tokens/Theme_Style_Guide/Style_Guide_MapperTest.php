<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace Tests\wpunit\Resources\Design_Tokens\Theme_Style_Guide;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Style_Guide_Mapper;
use Tests\Support\Classes\TestCase;

final class Style_Guide_MapperTest extends TestCase {

	/**
	 * Slot slug => token id, the shape the registry hands the mapper.
	 *
	 * @var array<string, string>
	 */
	private const SLOT_TOKENS = [
		'palette1' => 'primitive.color.brand.primary',
		'palette2' => 'primitive.color.brand.secondary',
		'palette3' => 'primitive.color.neutral.900',
	];

	/**
	 * Only the palette set the theme names as active is read.
	 *
	 * @dataProvider activeSetProvider
	 *
	 * @param string $active   The set the theme renders.
	 * @param string $expected The color that set carries on palette1.
	 *
	 * @return void
	 */
	public function testMapsClaimedSlotsOfTheActiveSet( string $active, string $expected ): void {
		$values = ( new Style_Guide_Mapper() )->map( $this->snapshot( $active ), self::SLOT_TOKENS );

		$this->assertSame( $expected, $values['primitive.color.brand.primary'] );
	}

	/**
	 * Each of the theme's three palette sets, with a color unique to it.
	 *
	 * @return Generator
	 */
	public function activeSetProvider(): Generator {
		yield 'first set' => [
			'active'   => 'palette',
			'expected' => '#111111',
		];
		yield 'second set' => [
			'active'   => 'second-palette',
			'expected' => '#222222',
		];
		yield 'third set' => [
			'active'   => 'third-palette',
			'expected' => '#333333',
		];
	}

	/**
	 * A missing or empty "active" pointer means the first set, matching the theme's own fallback.
	 *
	 * @dataProvider absentActiveProvider
	 *
	 * @param array<string, mixed> $palette The decoded palette option.
	 *
	 * @return void
	 */
	public function testFallsBackToPaletteWhenActiveIsMissingOrEmpty( array $palette ): void {
		$values = ( new Style_Guide_Mapper() )->map(
			[
				'palette'  => $palette,
				'settings' => [],
			],
			self::SLOT_TOKENS
		);

		$this->assertSame( '#111111', $values['primitive.color.brand.primary'] );
	}

	/**
	 * Palette options whose "active" pointer does not name a set.
	 *
	 * @return Generator
	 */
	public function absentActiveProvider(): Generator {
		$entries = [
			[
				'color' => '#111111',
				'name'  => 'P1',
				'slug'  => 'palette1',
			],
		];

		yield 'active absent' => [ 'palette' => [ 'palette' => $entries ] ];
		yield 'active empty' => [
			'palette' => [
				'active'  => '',
				'palette' => $entries,
			],
		];
	}

	/**
	 * An "active" pointer naming a set that does not exist yields nothing, matching the empty values
	 * the theme renders in that case.
	 *
	 * @return void
	 */
	public function testYieldsNothingWhenActiveNamesAMissingSet(): void {
		$snapshot                      = $this->snapshot( 'palette' );
		$snapshot['palette']['active'] = 'fourth-palette';

		$this->assertSame( [], ( new Style_Guide_Mapper() )->map( $snapshot, self::SLOT_TOKENS ) );
	}

	/**
	 * A stored value that is not a usable color leaves the token to its baseline value.
	 *
	 * @dataProvider unusableColorProvider
	 *
	 * @param string $color The value stored on the slot.
	 *
	 * @return void
	 */
	public function testSkipsUnusableColors( string $color ): void {
		$values = ( new Style_Guide_Mapper() )->map(
			[
				'palette'  => [
					'active'  => 'palette',
					'palette' => [
						[
							'color' => $color,
							'name'  => 'P1',
							'slug'  => 'palette1',
						],
					],
				],
				'settings' => [],
			],
			self::SLOT_TOKENS
		);

		$this->assertArrayNotHasKey( 'primitive.color.brand.primary', $values );
	}

	/**
	 * Values the theme can store that must never become a token value.
	 *
	 * @return Generator
	 */
	public function unusableColorProvider(): Generator {
		yield 'complement marker' => [ 'color' => '#FfFfFf' ];
		yield 'empty' => [ 'color' => '' ];
		yield 'whitespace' => [ 'color' => '   ' ];
		yield 'css var' => [ 'color' => 'var(--global-palette1)' ];
		yield 'gradient' => [ 'color' => 'linear-gradient(#fff, #000)' ];
		yield 'bare word' => [ 'color' => 'red' ];
	}

	/**
	 * Every color notation the theme's picker can store is accepted.
	 *
	 * @dataProvider usableColorProvider
	 *
	 * @param string $color The value stored on the slot.
	 *
	 * @return void
	 */
	public function testAcceptsHexRgbaAndHsla( string $color ): void {
		$values = ( new Style_Guide_Mapper() )->map(
			[
				'palette'  => [
					'active'  => 'palette',
					'palette' => [
						[
							'color' => $color,
							'name'  => 'P1',
							'slug'  => 'palette1',
						],
					],
				],
				'settings' => [],
			],
			self::SLOT_TOKENS
		);

		$this->assertSame( $color, $values['primitive.color.brand.primary'] );
	}

	/**
	 * Color notations the theme's picker produces.
	 *
	 * @return Generator
	 */
	public function usableColorProvider(): Generator {
		yield 'hex 3' => [ 'color' => '#abc' ];
		yield 'hex 6' => [ 'color' => '#3182CE' ];
		yield 'hex 8' => [ 'color' => '#aabbccdd' ];
		yield 'rgb' => [ 'color' => 'rgb(1,2,3)' ];
		yield 'rgba' => [ 'color' => 'rgba(0,0,0,.5)' ];
		yield 'hsl' => [ 'color' => 'hsl(10 20% 30%)' ];
		yield 'hsla' => [ 'color' => 'hsla(10,20%,30%,.4)' ];
	}

	/**
	 * A claimed slot the theme's set does not carry is left out rather than mapped to an empty value.
	 *
	 * @return void
	 */
	public function testIgnoresSlotTokensNotInTheSet(): void {
		$values = ( new Style_Guide_Mapper() )->map(
			[
				'palette'  => [
					'active'  => 'palette',
					'palette' => [
						[
							'color' => '#111111',
							'name'  => 'P1',
							'slug'  => 'palette1',
						],
					],
				],
				'settings' => [],
			],
			self::SLOT_TOKENS
		);

		$this->assertSame( [ 'primitive.color.brand.primary' => '#111111' ], $values );
	}

	/**
	 * The mapper can never introduce a token id the caller did not ask for, however many slots the
	 * theme stores. That is what keeps the baseline decorator unable to add ids.
	 *
	 * @return void
	 */
	public function testProducesNoTokenIdOutsideSlotTokens(): void {
		$entries = [];

		foreach ( range( 1, 15 ) as $index ) {
			$entries[] = [
				'color' => sprintf( '#%02d0000', $index ),
				'name'  => 'P' . $index,
				'slug'  => 'palette' . $index,
			];
		}

		$values = ( new Style_Guide_Mapper() )->map(
			[
				'palette'  => [
					'active'  => 'palette',
					'palette' => $entries,
				],
				'settings' => [],
			],
			self::SLOT_TOKENS
		);

		$this->assertEmpty( array_diff( array_keys( $values ), array_values( self::SLOT_TOKENS ) ) );
		$this->assertCount( 3, $values );
	}

	/**
	 * Malformed entries in the stored set are skipped without affecting their siblings.
	 *
	 * @return void
	 */
	public function testSkipsMalformedEntries(): void {
		$values = ( new Style_Guide_Mapper() )->map(
			[
				'palette'  => [
					'active'  => 'palette',
					'palette' => [
						'not-an-array',
						[ 'color' => '#111111' ],
						[ 'slug' => 'palette2' ],
						[
							'color' => 123,
							'slug'  => 'palette2',
						],
						[
							'color' => '#333333',
							'slug'  => 'palette3',
						],
					],
				],
				'settings' => [],
			],
			self::SLOT_TOKENS
		);

		$this->assertSame( [ 'primitive.color.neutral.900' => '#333333' ], $values );
	}

	/**
	 * A slot the theme leaves unusable is not mapped, so the token keeps its shipped baseline value and
	 * the palette filter answers that slot with it.
	 *
	 * Pinned deliberately: the theme renders an empty custom property for such a slot, while the plugin
	 * renders the shipped color. That difference is a known consequence of "tokens always win" and is
	 * raised as an open question rather than changed here.
	 *
	 * @return void
	 */
	public function testAnUnusableSlotIsLeftToTheBaseline(): void {
		$values = ( new Style_Guide_Mapper() )->map(
			[
				'palette'  => [
					'active'  => 'palette',
					'palette' => [
						[
							'color' => '',
							'name'  => 'P1',
							'slug'  => 'palette1',
						],
						[
							'color' => '#333333',
							'name'  => 'P3',
							'slug'  => 'palette3',
						],
					],
				],
				'settings' => [],
			],
			self::SLOT_TOKENS
		);

		$this->assertArrayNotHasKey( 'primitive.color.brand.primary', $values );
		$this->assertSame( '#333333', $values['primitive.color.neutral.900'] );
	}

	/**
	 * A snapshot carrying all three palette sets, each with its own color on palette1.
	 *
	 * @param string $active The set to mark active.
	 *
	 * @return array{palette: array<string, mixed>, settings: array<string, mixed>}
	 */
	private function snapshot( string $active ): array {
		$set = static function ( string $color ): array {
			return [
				[
					'color' => $color,
					'name'  => 'P1',
					'slug'  => 'palette1',
				],
			];
		};

		return [
			'palette'  => [
				'active'         => $active,
				'palette'        => $set( '#111111' ),
				'second-palette' => $set( '#222222' ),
				'third-palette'  => $set( '#333333' ),
			],
			'settings' => [],
		];
	}
}
