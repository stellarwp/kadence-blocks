<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .

namespace Tests\wpunit\Resources\Design_Tokens\Editor;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Editor\Preset_Catalog;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Presets;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Preset_Resolver;
use Tests\Support\Classes\TestCase;

/**
 * Exercises the editor preset catalog against the real shipped baseline, so these assertions also
 * guard the Button preset bindings the picker offers.
 */
final class Preset_CatalogTest extends TestCase {

	private const BUTTON = 'kadence/singlebtn';

	/**
	 * @var Preset_Catalog
	 */
	private Preset_Catalog $catalog;

	/**
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->catalog = $this->container->get( Preset_Catalog::class );
		$this->store   = $this->container->get( Token_Store::class );
	}

	/**
	 * The catalog reports the active library and, per library, the shipped Button's default and its named presets as
	 * { slug, label, userCreated }, plus the picker control label and the controllable surface.
	 *
	 * @return void
	 */
	public function testItBuildsTheButtonCatalogForTheDefaultLibrary(): void {
		$catalog = $this->catalog->all();

		$this->assertSame( Token_Store::default_slug(), $catalog['active'] );
		$this->assertArrayHasKey( self::BUTTON, $catalog['libraries'][ Token_Store::default_slug() ] );

		$button = $catalog['libraries'][ Token_Store::default_slug() ][ self::BUTTON ];

		$this->assertSame( 'primary', $button['default'] );
		// The picker's control label, declared on the preset bindings in declarations.php.
		$this->assertSame( 'Style', $button['label'] );
		$this->assertSame(
			[
				[
					'slug'        => 'primary',
					'label'       => 'Primary',
					'userCreated' => false,
				],
				[
					'slug'        => 'secondary',
					'label'       => 'Secondary',
					'userCreated' => false,
				],
			],
			$button['presets']
		);
	}

	/**
	 * The per-block surface lists every bound property with its coarse input kind, so a color property reads
	 * as "color" and the radius property as "dimension".
	 *
	 * @return void
	 */
	public function testItExposesTheControllableSurface(): void {
		$properties = $this->catalog->all()['libraries'][ Token_Store::default_slug() ][ self::BUTTON ]['properties'];

		$kinds = wp_list_pluck( $properties, 'kind', 'key' );

		$this->assertSame( 'color', $kinds['button-bg'] );
		$this->assertSame( 'dimension', $kinds['button-radius'] );
	}

	/**
	 * A preset authored into a library is flagged userCreated, while the baseline presets are not.
	 *
	 * @return void
	 */
	public function testItFlagsUserCreatedPresets(): void {
		$this->store->save_document(
			'{"$extensions":{"com.kadence.designTokens":{"presets":{"kadence/singlebtn":{'
			. '"accent":{"label":"Accent","tokens":{"button-bg":"#ff0000"}}}}}}}'
		);

		$presets = $this->catalog->all()['libraries'][ Token_Store::default_slug() ][ self::BUTTON ]['presets'];
		$flags   = wp_list_pluck( $presets, 'userCreated', 'slug' );

		$this->assertTrue( $flags['accent'] );
		$this->assertFalse( $flags['primary'] );
	}

	/**
	 * A block registered but absent from a library is skipped rather than emitted empty.
	 *
	 * @return void
	 */
	public function testItSkipsABlockAbsentFromTheDocument(): void {
		// Picker-driven preset bindings (they declare a label) whose block has no presets in the baseline — the names() lookup
		// throws Unknown_Preset_Exception and the block is skipped rather than emitted empty.
		$registry = new Token_Registry();
		$registry->register_preset_bindings(
			[
				'block' => 'kadence/not-a-real-block',
				'label' => 'Style',
			]
		);

		$catalog = ( new Preset_Catalog(
			$registry,
			$this->container->get( Preset_Resolver::class ),
			$this->store,
			$this->container->get( Active_Token_Library_Store::class ),
			$this->container->get( Effective_Presets::class )
		) )->all();

		$this->assertSame( [], $catalog['libraries'][ Token_Store::default_slug() ] );
	}

	/**
	 * The Button catalog surfaces each bound property's control attribute and a per-preset resolved-value
	 * map, so the editor can key an override indicator to a control and compare against the preset value.
	 *
	 * @return void
	 */
	public function testItSurfacesControlAttrAndPerPresetValues(): void {
		$button = $this->catalog->all()['libraries'][ Token_Store::default_slug() ][ self::BUTTON ];

		$by_key = [];
		foreach ( $button['properties'] as $property ) {
			$by_key[ $property['key'] ] = $property;
		}

		$this->assertSame( 'background', $by_key['button-bg']['control_attr'] );
		$this->assertSame( 'color', $by_key['button-text']['control_attr'] );
		$this->assertSame( 'backgroundHover', $by_key['button-bg-hover']['control_attr'] );
		$this->assertSame( 'colorHover', $by_key['button-text-hover']['control_attr'] );
		$this->assertSame( 'borderRadius', $by_key['button-radius']['control_attr'] );

		// Per-preset resolved values, keyed by preset slug then property id.
		$this->assertArrayHasKey( 'primary', $button['values'] );
		$this->assertArrayHasKey( 'secondary', $button['values'] );
		$this->assertArrayHasKey( 'button-bg', $button['values']['primary'] );
		$this->assertNotSame( '', $button['values']['primary']['button-bg'] );
	}

	/**
	 * A preset whose property varies by breakpoint surfaces those overrides as flattened literals under a
	 * `responsive` map, so a control can show the inherited default for the device the editor is on.
	 *
	 * @return void
	 */
	public function testItSurfacesPerBreakpointPresetValues(): void {
		$this->seedResponsivePreset();

		$button = $this->catalog->all()['libraries'][ Token_Store::default_slug() ][ self::BUTTON ];

		$this->assertSame( '8px', $button['values']['hero']['button-radius'] );
		$this->assertSame(
			[ 'mobile' => [ 'button-radius' => '0.1875rem' ] ],
			$button['responsive']['hero']
		);
	}

	/**
	 * A preset with no per-breakpoint overrides carries an empty responsive map, so every existing preset
	 * is unchanged in the feed.
	 *
	 * @return void
	 */
	public function testAPresetWithoutBreakpointsCarriesAnEmptyResponsiveMap(): void {
		$button = $this->catalog->all()['libraries'][ Token_Store::default_slug() ][ self::BUTTON ];

		$this->assertSame( [], $button['responsive']['primary'] );
	}

	/**
	 * Persist a "hero" button preset whose radius takes an aliased override on mobile.
	 *
	 * @return void
	 */
	private function seedResponsivePreset(): void {
		$document = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'presets' => [
						self::BUTTON => [
							'hero' => [
								'label'  => 'Hero',
								'tokens' => [
									'button-radius' => [
										'$value'      => '8px',
										'$extensions' => [
											'com.kadence.designTokens' => [
												'responsive' => [ 'mobile' => '{semantic.radius.control}' ],
											],
										],
									],
								],
							],
						],
					],
				],
			],
		];

		$this->store->save_document( (string) wp_json_encode( $document ), Token_Store::default_slug() );
	}
}
