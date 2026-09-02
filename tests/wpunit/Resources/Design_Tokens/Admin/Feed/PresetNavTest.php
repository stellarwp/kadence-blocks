<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Admin\Feed;

use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Preset_Nav;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use Tests\Support\Classes\TestCase;

/**
 * Exercises Preset_Nav against the real shipped registry, so these assertions also guard which
 * declared preset bindings are picker-driven.
 */
final class PresetNavTest extends TestCase {

	private Token_Registry $registry;

	/**
	 * Resolve the shipped registry from the container so the shipped declarations are exercised.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->registry = $this->container->get( Token_Registry::class );
	}

	/**
	 * Every shipped nav entry carries its declared Style Library section label, never the picker
	 * control's own label — every one of these blocks declares that as "Style". The Section and Advanced
	 * Text entries are the cases that prove the point: they are `kadence/column` and
	 * `kadence/advancedheading` in code, and the nav must read the names the UI calls them. Order is
	 * registration order, which is declaration order in `declarations.php`.
	 *
	 * @return void
	 */
	public function testAllUsesTheDeclaredStyleLibraryLabel(): void {
		$entries = ( new Preset_Nav( $this->registry ) )->all();

		$this->assertSame(
			[
				[
					'block' => 'kadence/singlebtn',
					'label' => 'Button',
				],
				[
					'block' => 'kadence/image',
					'label' => 'Advanced Image',
				],
				[
					'block' => 'kadence/rowlayout',
					'label' => 'Row Layout',
				],
				[
					'block' => 'kadence/column',
					'label' => 'Section',
				],
				[
					'block' => 'kadence/single-icon',
					'label' => 'Icon',
				],
				[
					'block' => 'kadence/advancedheading',
					'label' => 'Advanced Text',
				],
			],
			$entries
		);
	}

	/**
	 * A default-look-only binding set — one with no declared label — is excluded from the nav.
	 *
	 * Exercised against a registry built here rather than a shipped block: every shipped block now
	 * declares a label, so there is no longer one to point at, but the exclusion is still the contract a
	 * third-party block relies on to wire tokens without surfacing a preset UI.
	 *
	 * @return void
	 */
	public function testAllExcludesABindingSetWithNoLabel(): void {
		$registry = new Token_Registry();
		$registry->register_preset_bindings( [ 'block' => 'my-vendor/default-look-only' ] );
		$registry->register_preset_bindings(
			[
				'block'         => 'my-vendor/picker-driven',
				'label'         => 'Style',
				'style_library' => [ 'label' => 'Picker Driven' ],
			]
		);

		$entries = ( new Preset_Nav( $registry ) )->all();

		$this->assertSame( [ 'my-vendor/picker-driven' ], array_column( $entries, 'block' ) );
	}

	/**
	 * A third-party block that declares a picker label on its preset bindings earns a nav entry
	 * with zero JS — the documented inclusion opt-in — and, when it also declares a Style Library
	 * section, that section's label is what the nav shows.
	 *
	 * @return void
	 */
	public function testAllIncludesAThirdPartyBindingSetThatDeclaresALabel(): void {
		$registry = new Token_Registry();
		$registry->register_preset_bindings(
			[
				'block'         => 'my-vendor/my-block',
				'label'         => 'Style',
				'style_library' => [ 'label' => 'My Block Style' ],
			]
		);

		$entries = ( new Preset_Nav( $registry ) )->all();

		$this->assertSame(
			[
				[
					'block' => 'my-vendor/my-block',
					'label' => 'My Block Style',
				],
			],
			$entries
		);
	}

	/**
	 * The declared Style Library section label wins over the block's registered title even when
	 * the block is registered under a different title — the section is the explicit opt-in and
	 * takes precedence over both fallbacks.
	 *
	 * @return void
	 */
	public function testAllPrefersTheDeclaredStyleLibraryLabelOverTheRegisteredBlockTitle(): void {
		register_block_type( 'my-vendor/my-block', [ 'title' => 'Registered Title' ] );

		try {
			$registry = new Token_Registry();
			$registry->register_preset_bindings(
				[
					'block'         => 'my-vendor/my-block',
					'label'         => 'Style',
					'style_library' => [ 'label' => 'Declared Label' ],
				]
			);

			$entries = ( new Preset_Nav( $registry ) )->all();

			$this->assertSame( 'Declared Label', $entries[0]['label'] );
		} finally {
			unregister_block_type( 'my-vendor/my-block' );
		}
	}

	/**
	 * With no Style Library section declared, a registered block's own title is the nav label —
	 * the second rung of the fallback chain.
	 *
	 * @return void
	 */
	public function testAllFallsBackToTheRegisteredBlockTitleWhenNoStyleLibrarySection(): void {
		register_block_type( 'my-vendor/my-block', [ 'title' => 'Registered Title' ] );

		try {
			$registry = new Token_Registry();
			$registry->register_preset_bindings(
				[
					'block' => 'my-vendor/my-block',
					'label' => 'Style',
				]
			);

			$entries = ( new Preset_Nav( $registry ) )->all();

			$this->assertSame( 'Registered Title', $entries[0]['label'] );
		} finally {
			unregister_block_type( 'my-vendor/my-block' );
		}
	}

	/**
	 * With no Style Library section and no matching block registration, the nav label humanizes
	 * the block name — the final rung of the fallback chain, so an unregistered block never shows
	 * a raw slug or the picker control's own label.
	 *
	 * @return void
	 */
	public function testAllHumanizesTheBlockNameWhenUnregisteredAndNoStyleLibrarySection(): void {
		$registry = new Token_Registry();
		$registry->register_preset_bindings(
			[
				'block' => 'my-vendor/my-unregistered-block',
				'label' => 'Style',
			]
		);

		$entries = ( new Preset_Nav( $registry ) )->all();

		$this->assertSame( 'My Unregistered Block', $entries[0]['label'] );
	}

	/**
	 * Labeled binding sets appear in the nav in the order they were registered.
	 *
	 * @return void
	 */
	public function testAllPreservesRegistrationOrder(): void {
		$registry = new Token_Registry();
		$registry->register_preset_bindings(
			[
				'block'         => 'my-vendor/second',
				'label'         => 'Style',
				'style_library' => [ 'label' => 'Second' ],
			]
		);
		$registry->register_preset_bindings(
			[
				'block'         => 'my-vendor/first',
				'label'         => 'Style',
				'style_library' => [ 'label' => 'First' ],
			]
		);

		$entries = ( new Preset_Nav( $registry ) )->all();

		$this->assertSame(
			[
				[
					'block' => 'my-vendor/second',
					'label' => 'Second',
				],
				[
					'block' => 'my-vendor/first',
					'label' => 'First',
				],
			],
			$entries
		);
	}

	/**
	 * The admin feed's presetNav key mirrors Preset_Nav::all() for the active registry.
	 *
	 * @return void
	 */
	public function testBuilderFeedContainsThePresetNavKey(): void {
		$builder = $this->container->get( Builder::class );
		$rest    = [
			'root'      => 'https://example.test/wp-json/',
			'namespace' => 'kb-design-tokens/v1',
			'nonce'     => 'abc123',
		];

		$feed = $builder->build( [], true, [], $rest, 'v1', 'default' );

		$this->assertSame( ( new Preset_Nav( $this->registry ) )->all(), $feed['presetNav'] );
	}
}
