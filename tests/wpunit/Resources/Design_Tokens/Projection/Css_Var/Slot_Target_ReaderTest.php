<?php declare( strict_types=1 );
// cspell:ignore xxs xxl xxxl .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Css_Var;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Slot_Target_Reader;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Slot\Font_Size_Target;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Slot\Gap_Target;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Slot\Spacing_Target;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use ReflectionProperty;
use Tests\Support\Classes\TestCase;

/**
 * Covers the shared scale reader: for each slot family it resolves the shipped scale from the baseline as a
 * slug => value map (the source of truth KB's legacy --global-kb-* families are fed from), and returns an
 * empty map when the registry is deactivated so callers keep their own fallback.
 */
final class Slot_Target_ReaderTest extends TestCase {

	/**
	 * @var Slot_Target_Reader
	 */
	private Slot_Target_Reader $reader;

	/**
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->reader   = $this->container->get( Slot_Target_Reader::class );
		$this->registry = $this->container->get( Token_Registry::class );
	}

	/**
	 * @return void
	 */
	protected function tearDown(): void {
		// Re-activate the registry in case a test called deactivate() on the singleton.
		$this->registry->activate();

		// Clear the Token_Resolver singleton's in-memory memo so calls to resolve() made during these
		// tests do not short-circuit object-cache checks in later test classes.
		$resolver      = $this->container->get( Token_Resolver::class );
		$memo_property = new ReflectionProperty( Token_Resolver::class, 'memo' );
		$memo_property->setAccessible( true );
		$memo_property->setValue( $resolver, [] );

		parent::tearDown();
	}

	/**
	 * The font-size family resolves every shipped slug to its primitive's fluid clamp() value.
	 *
	 * @return void
	 */
	public function testItReadsTheFontSizeScaleAsTheShippedClamps(): void {
		$this->assertEquals(
			[
				'sm'   => 'clamp(0.8rem, 0.73rem + 0.217vw, 0.9rem)',
				'md'   => 'clamp(1.1rem, 0.995rem + 0.326vw, 1.25rem)',
				'lg'   => 'clamp(1.75rem, 1.576rem + 0.543vw, 2rem)',
				'xl'   => 'clamp(2.25rem, 1.728rem + 1.63vw, 3rem)',
				'xxl'  => 'clamp(2.5rem, 1.456rem + 3.26vw, 4rem)',
				'xxxl' => 'clamp(2.75rem, 0.489rem + 7.065vw, 6rem)',
			],
			$this->reader->read( Font_Size_Target::class )
		);
	}

	/**
	 * The spacing family resolves every shipped step to its primitive length, matching KB's own scale.
	 *
	 * @return void
	 */
	public function testItReadsTheSpacingScaleAsTheShippedLengths(): void {
		$this->assertEquals(
			[
				'xxs'  => '0.5rem',
				'xs'   => '1rem',
				'sm'   => '1.5rem',
				'md'   => '2rem',
				'lg'   => '3rem',
				'xl'   => '4rem',
				'xxl'  => '5rem',
				'3xl'  => '6.5rem',
				'4xl'  => '8rem',
				'5xl'  => '10rem',
				'none' => '0',
			],
			$this->reader->read( Spacing_Target::class )
		);
	}

	/**
	 * The gap family resolves every shipped step to its primitive length, matching KB's own gap scale.
	 *
	 * @return void
	 */
	public function testItReadsTheGapScaleAsTheShippedLengths(): void {
		$this->assertEquals(
			[
				'none' => '0rem',
				'xs'   => '0.5rem',
				'sm'   => '1rem',
				'md'   => '2rem',
				'lg'   => '4rem',
			],
			$this->reader->read( Gap_Target::class )
		);
	}

	/**
	 * A deactivated registry yields an empty map for every family, so KB's own defaults survive when token
	 * projection is off.
	 *
	 * @return void
	 */
	public function testItReturnsAnEmptyMapWhenTheRegistryIsDeactivated(): void {
		$this->registry->deactivate();

		$this->assertSame( [], $this->reader->read( Font_Size_Target::class ) );
		$this->assertSame( [], $this->reader->read( Spacing_Target::class ) );
		$this->assertSame( [], $this->reader->read( Gap_Target::class ) );
	}
}
