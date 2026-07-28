<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Block_Preset;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Mutator;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Preset\Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Presets;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Preset_Resolver;
use Tests\Support\Classes\Fake_Baseline_Document;
use Tests\Support\Classes\TestCase;

/**
 * Exercises the block-preset projector against a flat preset collection — the no-picker "default preset"
 * case the projector serves. A controllable fixture baseline supplies a single `$default` preset of literal
 * values, and a synthetic binding set supplies the `block_attr` bindings; together they prove the
 * property -> attribute mapping and the overlay semantics.
 */
final class ProjectorTest extends TestCase {

	private const BUTTON = 'kadence/preset-btn';

	private Preset_Resolver $resolver;

	protected function setUp(): void {
		parent::setUp();

		// A flat preset block: one $default preset of literal values, so resolve_default() is deterministic.
		$document = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'presets' => [
						self::BUTTON => [
							'$default' => 'primary',
							'primary'  => [
								'label'  => 'Primary',
								'tokens' => [
									'button-bg'     => '#3633e1',
									'button-text'   => '#ffffff',
									'button-radius' => '0.5rem',
								],
							],
						],
					],
				],
			],
		];

		$presets = new Effective_Presets(
			new Fake_Baseline_Document( $document ),
			$this->container->get( Token_Store::class ),
			$this->container->get( Mutator::class )
		);

		$this->resolver = new Preset_Resolver( $presets, $this->container->get( Token_Resolver::class ) );
	}

	public function testItMapsThePresetValuesOntoTheBoundBlockAttributes(): void {
		$defaults = $this->projector( $this->button_set() )->add_preset_defaults( [], self::BUTTON );

		// Button's $default is "primary": button-bg -> #3633e1, button-text -> #ffffff.
		$this->assertSame( '#3633e1', $defaults['background'] );
		$this->assertSame( '#ffffff', $defaults['color'] );
		// button-radius has no block_attr, so it never reaches an attribute default.
		$this->assertArrayNotHasKey( 'button-radius', $defaults );
		$this->assertArrayNotHasKey( 'radius', $defaults );
	}

	public function testThePresetWinsOverBlockJsonDefaultsButLeavesOthersIntact(): void {
		$defaults = $this->projector( $this->button_set() )->add_preset_defaults(
			[
				'padding'    => '10px',          // not bound by the preset: must survive untouched.
				'background' => 'rebeccapurple', // bound to button-bg: the preset must overwrite it.
			],
			self::BUTTON
		);

		// The preset overwrites a default it binds...
		$this->assertSame( '#3633e1', $defaults['background'] );
		// ...adds a binding the incoming defaults did not carry...
		$this->assertSame( '#ffffff', $defaults['color'] );
		// ...and leaves an unrelated default untouched, proving an overlay merge rather than a wholesale
		// replace (a buggy projector returning only its preset would drop "padding" here).
		$this->assertSame( '10px', $defaults['padding'] );
	}

	public function testItIsANoopWhenProjectionIsFailClosed(): void {
		// The baseline guard deactivates projection on a broken token library; the projector must then fall
		// back to KB's own defaults even for a block that does have a binding set.
		$registry = $this->button_set();
		$registry->deactivate();

		$defaults = $this->projector( $registry )->add_preset_defaults( [ 'padding' => '10px' ], self::BUTTON );

		$this->assertSame( [ 'padding' => '10px' ], $defaults );
	}

	public function testItIsANoopForABlockWithNoBindingSet(): void {
		// An empty registry knows no binding set for the block.
		$defaults = $this->projector( new Token_Registry() )->add_preset_defaults( [ 'padding' => '10px' ], self::BUTTON );

		$this->assertSame( [ 'padding' => '10px' ], $defaults );
	}

	public function testItIsANoopWhenTheDocumentDefinesNoDefault(): void {
		// Registered structure for a block the baseline has no presets for: resolving the default throws,
		// and the projector swallows it and returns the defaults untouched.
		$registry = new Token_Registry();
		$registry->register_preset_bindings(
			[
				'block'    => 'kadence/not-in-baseline',
				'bindings' => [
					'button-bg' => [
						'token'      => 'semantic.color.button-bg',
						'block_attr' => 'background',
					],
				],
			]
		);

		$defaults = $this->projector( $registry )->add_preset_defaults( [ 'padding' => '10px' ], 'kadence/not-in-baseline' );

		$this->assertSame( [ 'padding' => '10px' ], $defaults );
	}

	public function testTheFilterIsRegistered(): void {
		// The Projection\Block_Preset\Provider wires the projector into KB's render path on boot.
		$this->assertNotFalse( has_filter( 'kadence_blocks_block_default_attributes' ) );
	}

	/**
	 * Build the projector with a given registry and the real (baseline-backed) preset resolver.
	 */
	private function projector( Token_Registry $registry ): Projector {
		return new Projector( $registry, $this->resolver, $this->container->get( Active_Token_Library_Store::class ) );
	}

	/**
	 * A registry holding a Button binding set whose bindings declare the `block_attr` targets the shipped
	 * declarations omit until SOFT-3406.
	 */
	private function button_set(): Token_Registry {
		$registry = new Token_Registry();
		$registry->register_preset_bindings(
			[
				'block'    => self::BUTTON,
				'bindings' => [
					'button-bg'     => [
						'token'      => 'semantic.color.button-bg',
						'block_attr' => 'background',
					],
					'button-text'   => [
						'token'      => 'semantic.color.button-text',
						'block_attr' => 'color',
					],
					'button-radius' => [ 'css_var' => 'kb-btn-radius' ], // no block_attr -> skipped.
				],
			]
		);

		return $registry;
	}
}
