<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace Tests\wpunit\Resources\Design_Tokens\Registry\Baseline;

use KadenceWP\KadenceBlocks\Design_Tokens\Document\Mutator;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Baseline\Theme_Button_Presets_Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Baseline\Theme_Style_Guide_Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Buttons\Discovery;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Buttons\Theme_Button_Styles_Overlay;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Style_Guide_Mapper;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Style_Guide_Overlay;
use Tests\Support\Classes\Fake_Baseline_Document;
use Tests\Support\Classes\Fake_Button_Style_Source;
use Tests\Support\Classes\Fake_Style_Guide_Source;
use Tests\Support\Classes\TestCase;

/**
 * Covers the decorator that writes the theme's button styles onto the baseline as Button presets.
 */
final class Theme_Button_Presets_Baseline_DocumentTest extends TestCase {

	private const BUTTON = 'kadence/singlebtn';

	/**
	 * A Kadence-shaped answer: base and secondary, today's classes, one display value on base.
	 *
	 * @var array<string, array{label: string, class: string, values: array<string, mixed>}>
	 */
	private const KADENCE_LIKE = [
		'base'      => [
			'label'  => 'Theme Base',
			'class'  => 'wp-block-button__link button kb-btn-global-inherit',
			'values' => [ 'button-bg' => '{primitive.color.brand.primary}' ],
		],
		'secondary' => [
			'label'  => 'Theme Secondary',
			'class'  => 'wp-block-button__link button button-style-secondary kb-btn-global-inherit',
			'values' => [],
		],
	];

	/**
	 * Every discovered style becomes a preset node after the shipped ones, carrying its label, classes,
	 * display values and an empty token map.
	 *
	 * @return void
	 */
	public function testAddsAPresetNodePerDiscoveredStyle(): void {
		$node = $this->button_node( $this->decorated( new Fake_Button_Style_Source( self::KADENCE_LIKE ) )->document() );

		$this->assertSame( [ '$default', 'default', 'theme-base', 'theme-secondary' ], array_keys( $node ) );
		$this->assertSame(
			[
				'label'       => 'Theme Base',
				'themeClass'  => 'wp-block-button__link button kb-btn-global-inherit',
				'themeValues' => [ 'button-bg' => '{primitive.color.brand.primary}' ],
				'tokens'      => [],
			],
			$node['theme-base']
		);
		$this->assertSame( 'wp-block-button__link button button-style-secondary kb-btn-global-inherit', $node['theme-secondary']['themeClass'] );
	}

	/**
	 * The shipped presets and the block's `$default` are left exactly as they were.
	 *
	 * @return void
	 */
	public function testLeavesTheShippedPresetsAlone(): void {
		$inner = $this->inner_document();
		$node  = $this->button_node( $this->decorated( new Fake_Button_Style_Source( self::KADENCE_LIKE ) )->document() );

		$this->assertSame( 'default', $node['$default'] );
		$this->assertSame( $this->button_node( $inner )['default'], $node['default'] );
	}

	/**
	 * has() delegates to the inner document: no token id is ever added by a preset node.
	 *
	 * @return void
	 */
	public function testHasDelegatesToTheInnerDocument(): void {
		$document = $this->decorated( new Fake_Button_Style_Source( self::KADENCE_LIKE ) );

		$this->assertTrue( $document->has( 'primitive.color.brand.primary' ) );
		$this->assertFalse( $document->has( 'primitive.color.brand.extra' ) );
	}

	/**
	 * When the theme offers nothing the decorated document equals the inner document byte for byte.
	 *
	 * @return void
	 */
	public function testEqualsTheInnerDocumentWithoutStyles(): void {
		$inner     = new Fake_Baseline_Document( $this->inner_document() );
		$decorated = new Theme_Button_Presets_Baseline_Document( $inner, $this->overlay( new Fake_Button_Style_Source() ) );

		$this->assertSame( $inner->document(), $decorated->document() );
	}

	/**
	 * An empty inner document (a missing or unreadable baseline.json) stays empty, so the guard still
	 * fails closed rather than being handed a partial baseline.
	 *
	 * @return void
	 */
	public function testEmptyInnerDocumentStaysEmpty(): void {
		$decorated = new Theme_Button_Presets_Baseline_Document(
			new Fake_Baseline_Document( [] ),
			$this->overlay( new Fake_Button_Style_Source( self::KADENCE_LIKE ) )
		);

		$this->assertSame( [], $decorated->document() );
	}

	/**
	 * An inner document with no Button presets gains none: a preset node needs the block's `$default`,
	 * which only the shipped baseline provides.
	 *
	 * @return void
	 */
	public function testAddsNothingWhenTheInnerDocumentHasNoButtonPresets(): void {
		$inner     = [ 'primitive' => $this->inner_document()['primitive'] ];
		$decorated = new Theme_Button_Presets_Baseline_Document(
			new Fake_Baseline_Document( $inner ),
			$this->overlay( new Fake_Button_Style_Source( self::KADENCE_LIKE ) )
		);

		$this->assertSame( $inner, $decorated->document() );
	}

	/**
	 * A changed style list is reflected on the next read rather than a previous list being served.
	 *
	 * @return void
	 */
	public function testFollowsAChangedStyleList(): void {
		$source    = new Fake_Button_Style_Source( self::KADENCE_LIKE );
		$overlay   = $this->overlay( $source );
		$decorated = new Theme_Button_Presets_Baseline_Document( new Fake_Baseline_Document( $this->inner_document() ), $overlay );

		$this->assertArrayHasKey( 'theme-secondary', $this->button_node( $decorated->document() ) );

		$source->set( [ 'base' => self::KADENCE_LIKE['base'] ] );
		$overlay->flush();

		$node = $this->button_node( $decorated->document() );

		$this->assertArrayNotHasKey( 'theme-secondary', $node );
		$this->assertArrayHasKey( 'theme-base', $node );
	}

	/**
	 * A change to the inner document (the Style Guide re-valuing a token) is reflected on the next read, so
	 * a Customizer save is never hidden behind a copy this decorator took earlier in the request.
	 *
	 * @return void
	 */
	public function testFollowsAChangedInnerDocument(): void {
		$palette   = Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#111111' ] );
		$overlay   = new Style_Guide_Overlay( $palette, new Style_Guide_Mapper(), $this->container->get( Token_Registry::class ) );
		$inner     = new Theme_Style_Guide_Baseline_Document(
			new Fake_Baseline_Document( $this->inner_document() ),
			$overlay,
			$this->container->get( Mutator::class )
		);
		$decorated = new Theme_Button_Presets_Baseline_Document( $inner, $this->overlay( new Fake_Button_Style_Source( self::KADENCE_LIKE ) ) );

		$this->assertSame( '#111111', $decorated->document()['primitive']['color']['brand']['primary']['$value'] );

		$palette->set( Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#999999' ] )->snapshot() );
		$overlay->flush();

		$this->assertSame( '#999999', $decorated->document()['primitive']['color']['brand']['primary']['$value'] );
		$this->assertArrayHasKey( 'theme-base', $this->button_node( $decorated->document() ) );
	}

	/**
	 * The container's baseline carries the theme presets: the suite runs a theme no adapter reads, so it is
	 * the classic fallback's Theme Button.
	 *
	 * @return void
	 */
	public function testTheContainerBaselineCarriesTheThemePresets(): void {
		$node = $this->button_node( $this->baseline_document()->document() );

		$this->assertSame( 'Theme Button', $node['theme-base']['label'] );
		$this->assertSame( 'wp-block-button__link button kb-btn-global-inherit', $node['theme-base']['themeClass'] );
		$this->assertSame( [], $node['theme-base']['tokens'] );
	}

	/**
	 * The decorator over a hand-written inner baseline.
	 *
	 * @param Fake_Button_Style_Source $source The theme button style source.
	 *
	 * @return Baseline_Document
	 */
	private function decorated( Fake_Button_Style_Source $source ): Baseline_Document {
		return new Theme_Button_Presets_Baseline_Document( new Fake_Baseline_Document( $this->inner_document() ), $this->overlay( $source ) );
	}

	/**
	 * An overlay over a discovery reading only the given source.
	 *
	 * @param Fake_Button_Style_Source $source The source.
	 *
	 * @return Theme_Button_Styles_Overlay
	 */
	private function overlay( Fake_Button_Style_Source $source ): Theme_Button_Styles_Overlay {
		return new Theme_Button_Styles_Overlay( new Discovery( $source ) );
	}

	/**
	 * The Button's preset node of a document.
	 *
	 * @param array<string, mixed> $document The document.
	 *
	 * @return array<string, mixed>
	 */
	private function button_node( array $document ): array {
		return $document['$extensions']['com.kadence.designTokens']['presets'][ self::BUTTON ];
	}

	/**
	 * A small baseline: one color leaf and the Button's shipped default preset.
	 *
	 * @return array<string, mixed>
	 */
	private function inner_document(): array {
		return [
			'primitive'   => [
				'color' => [
					'brand' => [
						'primary' => [
							'$type'  => 'color',
							'$value' => '#3182CE',
						],
					],
				],
			],
			'$extensions' => [
				'com.kadence.designTokens' => [
					'presets' => [
						self::BUTTON => [
							'$default' => 'default',
							'default'  => [
								'label'  => 'Default',
								'tokens' => [ 'button-bg' => '{primitive.color.brand.primary}' ],
							],
						],
					],
				],
			],
		];
	}
}
