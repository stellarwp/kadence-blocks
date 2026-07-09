<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Editor;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Editor\Block_Preset_Catalog;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Css_Renderer;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use Tests\Support\Classes\Fake_Baseline_Document;
use Tests\Support\Classes\TestCase;

/**
 * Exercises the editor per-block attribute-default catalog the block-registration filter in
 * early-filters.js reads: a resolved token converts to px and appears under its block/attribute
 * path in the entry's shape — a bare float for the scalar icon-size entry, a 4-corner float
 * array for the corner-shaped button border-radius entry — while an unresolved or unconvertible
 * token is omitted so the filter falls back to block.json's own default.
 */
final class Block_Preset_CatalogTest extends TestCase {

	/**
	 * A resolved token is emitted under its block/attribute path in the entry's shape: a bare
	 * float for the icon-size scalar entry and a 4-corner float array (the value repeated) for
	 * the button border-radius corner entry; entries whose token does not resolve or does not
	 * convert to a pixel length are omitted.
	 *
	 * @dataProvider catalogProvider
	 *
	 * @param string|null                                    $icon_value   The `$value` the `semantic.icon-size.default` leaf resolves to, or null to omit the leaf.
	 * @param string|null                                    $radius_value The `$value` the `semantic.radius.control` leaf resolves to, or null to omit the leaf.
	 * @param array<string, array<string, float|array<int, float>>> $expected     The expected catalog.
	 *
	 * @return void
	 */
	public function testCatalogEmitsEachEntryInItsShape( ?string $icon_value, ?string $radius_value, array $expected ): void {
		$catalog = $this->catalog_resolving( $icon_value, $radius_value );

		$this->assertSame( $expected, $catalog->all() );
	}

	/**
	 * `Block_Preset_Catalog` is registered against the real Token Registry on boot, so the real
	 * container resolves it with the shipped baseline's `semantic.icon-size.default` (1.5rem, i.e.
	 * 24px) and `semantic.radius.control` (0.5rem, i.e. 8px in all four corners) — proving the
	 * wiring, not just the catalog class in isolation.
	 *
	 * @return void
	 */
	public function testTheRegisteredCatalogResolvesThroughTheRealContainer(): void {
		$catalog = $this->container->get( Block_Preset_Catalog::class );

		$this->assertSame(
			[
				'kadence/single-icon' => [ 'size' => 24.0 ],
				'kadence/singlebtn'   => [ 'borderRadius' => [ 8.0, 8.0, 8.0, 8.0 ] ],
			],
			$catalog->all()
		);
	}

	/**
	 * Cases covering both entry shapes: rem conversion, px pass-through, each entry in isolation,
	 * and the omission fallbacks (no leaf, unconvertible unit).
	 *
	 * @return Generator
	 */
	public function catalogProvider(): Generator {
		yield 'both tokens resolve, rem converts to px per shape' => [
			'icon_value'   => '1.5rem',
			'radius_value' => '0.5rem',
			'expected'     => [
				'kadence/single-icon' => [ 'size' => 24.0 ],
				'kadence/singlebtn'   => [ 'borderRadius' => [ 8.0, 8.0, 8.0, 8.0 ] ],
			],
		];

		yield 'both tokens resolve, px passes through per shape' => [
			'icon_value'   => '24px',
			'radius_value' => '8px',
			'expected'     => [
				'kadence/single-icon' => [ 'size' => 24.0 ],
				'kadence/singlebtn'   => [ 'borderRadius' => [ 8.0, 8.0, 8.0, 8.0 ] ],
			],
		];

		yield 'only icon-size resolves emits just the scalar entry' => [
			'icon_value'   => '24px',
			'radius_value' => null,
			'expected'     => [ 'kadence/single-icon' => [ 'size' => 24.0 ] ],
		];

		yield 'only control radius resolves emits just the corner entry' => [
			'icon_value'   => null,
			'radius_value' => '8px',
			'expected'     => [ 'kadence/singlebtn' => [ 'borderRadius' => [ 8.0, 8.0, 8.0, 8.0 ] ] ],
		];

		yield 'no tokens resolve yields an empty catalog' => [
			'icon_value'   => null,
			'radius_value' => null,
			'expected'     => [],
		];

		yield 'unconvertible units omit both entries' => [
			'icon_value'   => '2vw',
			'radius_value' => '3vh',
			'expected'     => [],
		];
	}

	/**
	 * Build a catalog whose `semantic.icon-size.default` and `semantic.radius.control` leaves
	 * resolve to the given dimension values; a null value omits that leaf from the baseline.
	 *
	 * @param string|null $icon_value   The `$value` the `semantic.icon-size.default` leaf resolves to, or null to omit it.
	 * @param string|null $radius_value The `$value` the `semantic.radius.control` leaf resolves to, or null to omit it.
	 *
	 * @return Block_Preset_Catalog
	 */
	private function catalog_resolving( ?string $icon_value, ?string $radius_value ): Block_Preset_Catalog {
		$semantic = [];

		if ( $icon_value !== null ) {
			$semantic['icon-size'] = [
				'default' => [
					'$type'  => 'dimension',
					'$value' => $icon_value,
				],
			];
		}

		if ( $radius_value !== null ) {
			$semantic['radius'] = [
				'control' => [
					'$type'  => 'dimension',
					'$value' => $radius_value,
				],
			];
		}

		return $this->catalog_for( $semantic === [] ? [] : [ 'semantic' => $semantic ] );
	}

	/**
	 * Build a catalog over a fully-controlled baseline.
	 *
	 * @param array<string, mixed> $baseline The baseline document contents.
	 *
	 * @return Block_Preset_Catalog
	 */
	private function catalog_for( array $baseline ): Block_Preset_Catalog {
		$resolver = new Token_Resolver(
			$this->container->get( Token_Store::class ),
			new Effective_Document( new Fake_Baseline_Document( $baseline ) ),
			new Css_Renderer()
		);

		return new Block_Preset_Catalog( $resolver );
	}
}
