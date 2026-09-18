<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace Tests\wpunit\Resources\Design_Tokens\Registry\Baseline;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Document_Path;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Mutator;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Baseline\Theme_Style_Guide_Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Style_Guide_Mapper;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Style_Guide_Overlay;
use Tests\Support\Classes\Fake_Baseline_Document;
use Tests\Support\Classes\Fake_Style_Guide_Source;
use Tests\Support\Classes\TestCase;

final class Theme_Style_Guide_Baseline_DocumentTest extends TestCase {

	private Token_Registry $registry;

	protected function setUp(): void {
		parent::setUp();

		$this->registry = $this->container->get( Token_Registry::class );
	}

	/**
	 * has() delegates to the inner document: a re-valued id stays true, an unknown id stays false.
	 *
	 * @dataProvider hasProvider
	 *
	 * @param string $id       The token id.
	 * @param bool   $expected Whether the inner baseline defines it.
	 *
	 * @return void
	 */
	public function testHasDelegatesToTheInnerDocument( string $id, bool $expected ): void {
		$document = $this->decorated( Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#111111' ] ) );

		$this->assertSame( $expected, $document->has( $id ) );
	}

	/**
	 * Ids the hand-written inner baseline does and does not define.
	 *
	 * @return Generator
	 */
	public function hasProvider(): Generator {
		yield 'defined and re-valued' => [
			'id'       => 'primitive.color.brand.primary',
			'expected' => true,
		];
		yield 'defined, not re-valued' => [
			'id'       => 'primitive.color.neutral.900',
			'expected' => true,
		];
		yield 'not defined' => [
			'id'       => 'primitive.color.brand.extra',
			'expected' => false,
		];
	}

	/**
	 * A theme value lands on an existing leaf's $value and keeps the leaf's $type and siblings.
	 *
	 * @return void
	 */
	public function testRevaluesAnExistingLeafKeepingItsType(): void {
		$document = $this->decorated( Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#111111' ] ) )->document();
		$leaf     = Document_Path::node_at( $document, 'primitive.color.brand.primary' );

		$this->assertSame( '#111111', $leaf['$value'] );
		$this->assertSame( 'color', $leaf['$type'] );
		$this->assertSame( 'Brand Primary', $leaf['$description'] );
	}

	/**
	 * A slot the theme does not carry leaves its baseline value untouched.
	 *
	 * @return void
	 */
	public function testLeavesUnmappedLeavesAlone(): void {
		$document = $this->decorated( Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#111111' ] ) )->document();
		$leaf     = Document_Path::node_at( $document, 'primitive.color.neutral.900' );

		$this->assertSame( '#1A202C', $leaf['$value'] );
	}

	/**
	 * A theme value whose id has no leaf in the inner document is dropped — no token id is ever added.
	 *
	 * @return void
	 */
	public function testNeverAddsATokenId(): void {
		// palette2 maps to primitive.color.brand.secondary, which this inner baseline does not define.
		$source   = Fake_Style_Guide_Source::with_palette(
			[
				'palette1' => '#111111',
				'palette2' => '#222222',
			]
		);
		$document = $this->decorated( $source )->document();

		$this->assertNull( Document_Path::node_at( $document, 'primitive.color.brand.secondary' ) );
	}

	/**
	 * The $default palette swatch pointing at a re-valued token carries the theme value; other swatches
	 * keep theirs, so the Style Library shows the theme's colors and "reset swatch" restores them.
	 *
	 * @return void
	 */
	public function testRevaluesTheDefaultPaletteSwatches(): void {
		$document = $this->decorated( Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#111111' ] ) )->document();
		$swatches = $document['$extensions']['com.kadence.designTokens']['colorPalettes']['brand']['groups'][0]['swatches'];
		$by_token = array_column( $swatches, null, 'token' );

		$this->assertSame( '#111111', $by_token['primitive.color.brand.primary']['$value'] );
		$this->assertSame( '#1A202C', $by_token['primitive.color.neutral.900']['$value'] );
	}

	/**
	 * An empty inner document (a missing or unreadable baseline.json) stays empty, so the guard still
	 * fails closed rather than being handed a partial baseline.
	 *
	 * @return void
	 */
	public function testEmptyInnerDocumentStaysEmpty(): void {
		$document = new Theme_Style_Guide_Baseline_Document(
			new Fake_Baseline_Document( [] ),
			$this->overlay( Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#111111' ] ) ),
			$this->container->get( Mutator::class )
		);

		$this->assertSame( [], $document->document() );
	}

	/**
	 * With no theme the decorated document equals the inner document byte for byte, so a non-Kadence
	 * site resolves exactly as it did before this layer existed.
	 *
	 * @return void
	 */
	public function testEqualsInnerDocumentWithoutATheme(): void {
		$inner     = new Fake_Baseline_Document( $this->inner_document() );
		$decorated = new Theme_Style_Guide_Baseline_Document(
			$inner,
			$this->overlay( new Fake_Style_Guide_Source( null ) ),
			$this->container->get( Mutator::class )
		);

		$this->assertSame( $inner->document(), $decorated->document() );
	}

	/**
	 * A changed Style Guide rebuilds the memoized document rather than serving the previous one.
	 *
	 * @return void
	 */
	public function testRebuildsWhenTheSignatureChanges(): void {
		$source    = Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#111111' ] );
		$overlay   = $this->overlay( $source );
		$decorated = new Theme_Style_Guide_Baseline_Document(
			new Fake_Baseline_Document( $this->inner_document() ),
			$overlay,
			$this->container->get( Mutator::class )
		);

		$first = Document_Path::node_at( $decorated->document(), 'primitive.color.brand.primary' );
		$this->assertSame( '#111111', $first['$value'] );

		$source->set( Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#999999' ] )->snapshot() );
		$overlay->flush();

		$second = Document_Path::node_at( $decorated->document(), 'primitive.color.brand.primary' );
		$this->assertSame( '#999999', $second['$value'] );
	}

	/**
	 * The decorator over a hand-written inner baseline.
	 *
	 * @param Fake_Style_Guide_Source $source The Style Guide source.
	 *
	 * @return Baseline_Document
	 */
	private function decorated( Fake_Style_Guide_Source $source ): Baseline_Document {
		return new Theme_Style_Guide_Baseline_Document(
			new Fake_Baseline_Document( $this->inner_document() ),
			$this->overlay( $source ),
			$this->container->get( Mutator::class )
		);
	}

	/**
	 * An overlay over the given source, with the real mapper and the real registry.
	 *
	 * @param Fake_Style_Guide_Source $source The Style Guide source.
	 *
	 * @return Style_Guide_Overlay
	 */
	private function overlay( Fake_Style_Guide_Source $source ): Style_Guide_Overlay {
		return new Style_Guide_Overlay( $source, new Style_Guide_Mapper(), $this->registry );
	}

	/**
	 * A small baseline: two color leaves and a $default color palette naming both.
	 *
	 * Deliberately omits primitive.color.brand.secondary, which palette2 claims, so the "never adds an
	 * id" rule has something to drop.
	 *
	 * @return array<string, mixed>
	 */
	private function inner_document(): array {
		return [
			'primitive'   => [
				'color' => [
					'brand'   => [
						'primary' => [
							'$type'        => 'color',
							'$value'       => '#3182CE',
							'$description' => 'Brand Primary',
						],
					],
					'neutral' => [
						'900' => [
							'$type'  => 'color',
							'$value' => '#1A202C',
						],
					],
				],
			],
			'$extensions' => [
				Extensions::get_namespace() => [
					Extensions::get_section_color_palettes() => [
						Extensions::get_default_key() => 'brand',
						'brand'                       => [
							Extensions::get_groups_key() => [
								[
									Extensions::get_swatches_key() => [
										[
											Extensions::get_swatch_token_key() => 'primitive.color.brand.primary',
											'$value' => '#3182CE',
										],
										[
											Extensions::get_swatch_token_key() => 'primitive.color.neutral.900',
											'$value' => '#1A202C',
										],
									],
								],
							],
						],
					],
				],
			],
		];
	}
}
