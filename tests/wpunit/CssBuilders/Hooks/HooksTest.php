<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Hooks;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Builders;
use Kadence_Blocks_Css_Selector_Section;
use Kadence_Blocks_Rowlayout_Block;
use Kadence_Blocks_Css_Static_Section;
use Tests\Support\Classes\Css_Normalizer;
use Tests\Support\Classes\TestCase;
use Tests\wpunit\CssBuilders\Bridge\Fake_Block;

/**
 * The hooks that let other code change how the CSS of a block is built.
 *
 * They are public: their names and arguments only ever grow. See the README of the builders.
 */
final class HooksTest extends TestCase {

	private const BUILDER = 'Kadence_Blocks_Header_Column_Css';

	/**
	 * Build a block's CSS the way `build_css()` does.
	 *
	 * @param string               $builder    The builder class.
	 * @param array<string, mixed> $attributes The block attributes.
	 *
	 * @return string|null
	 */
	private function build( string $builder = self::BUILDER, array $attributes = [ 'a' => 1 ] ) {
		return Kadence_Blocks_Css_Builders::build( $builder, new Fake_Block(), 'header-column', $attributes, new Kadence_Blocks_CSS(), 'abc', 'def' );
	}

	/**
	 * Assert the CSS means what is expected.
	 *
	 * @param string $expected The expected CSS.
	 * @param string $actual   The CSS built.
	 *
	 * @return void
	 */
	private function assertSameCss( string $expected, string $actual ): void {
		$normalizer = new Css_Normalizer();

		$this->assertSame( $normalizer->normalize( $expected ), $normalizer->normalize( $actual ) );
	}

	/**
	 * Without a callback the filter changes nothing.
	 *
	 * @return void
	 */
	public function testNothingChangesWithoutCallbacks(): void {
		$this->assertSameCss( '', (string) $this->build() );
	}

	/**
	 * A section added by a filter writes after the others.
	 *
	 * @return void
	 */
	public function testSectionsCanBeAdded(): void {
		add_filter(
			'kadence_blocks_css_sections',
			static function ( array $sections ) {
				$sections[] = new Kadence_Blocks_Css_Static_Section( 'display', 'none' );

				return $sections;
			}
		);

		$this->assertSameCss( '.wp-block-kadence-header-columnabc{display:none;}', (string) $this->build() );
	}

	/**
	 * Sections can be removed, and then nothing is written.
	 *
	 * @return void
	 */
	public function testSectionsCanBeRemoved(): void {
		add_filter( 'kadence_blocks_css_sections', '__return_empty_array' );

		$this->assertSameCss( '', (string) $this->build() );
	}

	/**
	 * Sections can be replaced as a whole, and the filter knows which block it is for.
	 *
	 * @return void
	 */
	public function testSectionsCanBeReplacedAndTheFilterKnowsTheBlock(): void {
		$seen = [];

		add_filter(
			'kadence_blocks_css_sections',
			static function ( array $sections, string $block_name, array $attributes ) use ( &$seen ) {
				$seen = [ $block_name, $attributes ];

				return [ new Kadence_Blocks_Css_Selector_Section( '.mine{id}' ), new Kadence_Blocks_Css_Static_Section( 'color', 'red' ) ];
			},
			10,
			3
		);

		$this->assertSameCss( '.mineabc{color:red;}', (string) $this->build() );
		$this->assertSame( [ 'header-column', [ 'a' => 1 ] ], $seen );
	}

	/**
	 * Something that is not a section is dropped with a notice, and the rest still writes.
	 *
	 * @return void
	 */
	public function testItemsThatAreNotSectionsAreDropped(): void {
		$this->setExpectedIncorrectUsage( 'kadence_blocks_css_sections' );

		add_filter(
			'kadence_blocks_css_sections',
			static function ( array $sections ) {
				return array_merge( [ 'nope', new Kadence_Blocks_Css_Static_Section( 'display', 'none' ) ], $sections );
			}
		);

		$this->assertSameCss( '.wp-block-kadence-header-columnabc{display:none;}', (string) $this->build() );
	}

	/**
	 * A filter that does not return a list leaves the sections as they were, with a notice.
	 *
	 * @return void
	 */
	public function testAFilterThatReturnsNoListKeepsTheSections(): void {
		$this->setExpectedIncorrectUsage( 'kadence_blocks_css_sections' );

		add_filter( 'kadence_blocks_css_sections', '__return_false' );

		$this->assertSameCss( '', (string) $this->build() );
	}

	/**
	 * The builder of a block can be replaced by the builder of a plugin, which is the way to build the CSS of a new block.
	 *
	 * @return void
	 */
	public function testBuilderClassCanBeReplaced(): void {
		$seen = [];

		add_filter(
			'kadence_blocks_css_builder_class',
			static function ( string $class_name, string $block_name, $block ) use ( &$seen ) {
				$seen = [ $class_name, $block_name, get_class( $block ) ];

				return Fixture_Builder::class;
			},
			10,
			3
		);

		$this->assertSameCss( '.fixtureabc{color:blue;}', (string) $this->build() );
		$this->assertSame( [ self::BUILDER, 'header-column', Fake_Block::class ], $seen );
	}

	/**
	 * A replacement that does not exist fails as loudly as a missing builder.
	 *
	 * @return void
	 */
	public function testAMissingReplacementThrows(): void {
		add_filter(
			'kadence_blocks_css_builder_class',
			static function () {
				return 'Not_A_Builder_Class';
			}
		);

		$this->expectException( \RuntimeException::class );

		$this->build();
	}

	/**
	 * The built action tells what was built, with the CSS, once per build.
	 *
	 * @return void
	 */
	public function testBuiltActionFires(): void {
		$calls = [];

		add_action(
			'kadence_blocks_css_built',
			static function ( string $block_name, array $attributes, $output, string $unique_id ) use ( &$calls ) {
				$calls[] = [ $block_name, $attributes, $output, $unique_id ];
			},
			10,
			4
		);

		$this->build( Fixture_Builder::class );

		$this->assertCount( 1, $calls );
		$this->assertSame( 'header-column', $calls[0][0] );
		$this->assertSame( [ 'a' => 1 ], $calls[0][1] );
		$this->assertSameCss( '.fixtureabc{color:blue;}', (string) $calls[0][2] );
		$this->assertSame( 'abc', $calls[0][3] );
	}

	/**
	 * Builders that write their own sections, such as the row layout, get the same filter.
	 *
	 * @return void
	 */
	public function testBuildersOutsideTheBaseClassAreFilteredToo(): void {
		$build = static function () {
			return Kadence_Blocks_Css_Builders::build(
				'Kadence_Blocks_Rowlayout_Css',
				Kadence_Blocks_Rowlayout_Block::get_instance(),
				'rowlayout',
				[
					'uniqueID' => 'x',
					'padding'  => [ 1, 2, 3, 4 ],
				],
				new Kadence_Blocks_CSS(),
				'abc',
				'def'
			);
		};

		$this->assertNotSame( '', (string) $build() );

		add_filter( 'kadence_blocks_css_sections', '__return_empty_array' );

		$this->assertSame( '', (string) $build() );
	}
}
