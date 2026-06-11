<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Style;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Wp_Preset_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Wp_Preset_Target;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Binding;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;

/**
 * Builds the theme.json "styles.blocks.<block>" payload that gives a native block its on-brand baseline
 * ($default) look.
 *
 * A native block only consumes a --wp--preset variable when something sets the block's style property to
 * it. This payload does exactly that: for each bound property with a token-backed wp_preset target, it
 * points the block's matching theme.json style at the preset variable (e.g. core/button's
 * color.background => var(--wp--preset--color--button-bg)). An unstyled block then renders on-brand, and
 * the block-style variants {@see Css_Builder} re-target that same preset variable per style.
 *
 * Pure: no WordPress calls, no globals, no side effects. The WordPress wiring lives in Projector.
 *
 * @since TBD
 */
final class Default_Styles {

	/**
	 * Schema version the theme.json payload targets.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private const VERSION = 2;

	/**
	 * Maps a variant property to the theme.json "styles.blocks.<block>" path its preset drives. A property
	 * absent here has no native style slot and is skipped. Grows as more native blocks/properties are
	 * wired; declared centrally so the $default and the variant CSS agree on which preset a property feeds.
	 *
	 * @since TBD
	 *
	 * @var array<string, string[]>
	 */
	private const PROPERTY_PATHS = [
		'button-bg'   => [ 'color', 'background' ],
		'button-text' => [ 'color', 'text' ],
	];

	/**
	 * @var Token_Registry The registry the variant sets (and their bindings) are read from.
	 *
	 * @since TBD
	 */
	private Token_Registry $registry;

	/**
	 * @since TBD
	 *
	 * @param Token_Registry $registry The token registry.
	 */
	public function __construct( Token_Registry $registry ) {
		$this->registry = $registry;
	}

	/**
	 * Whether any native block contributes a $default style — the early-bail gate.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function has_styles(): bool {
		return $this->blocks() !== [];
	}

	/**
	 * The theme.json update_with() payload: a version-2 document carrying only "styles.blocks". Empty when
	 * no native block contributes a $default, so the caller can skip update_with() entirely.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	public function payload(): array {
		$blocks = $this->blocks();

		if ( $blocks === [] ) {
			return [];
		}

		return [
			'version' => self::VERSION,
			'styles'  => [ 'blocks' => $blocks ],
		];
	}

	/**
	 * The "styles.blocks" sub-tree: per native block, the theme.json styles that point its properties at
	 * their token-backed presets.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function blocks(): array {
		$blocks = [];

		foreach ( $this->registry->variant_blocks() as $block ) {
			if ( ! Style::is_native( $block ) ) {
				continue;
			}

			$set = $this->registry->for_block( $block );

			if ( $set === null ) {
				continue;
			}

			$styles = [];

			foreach ( $set->bindings as $property => $binding ) {
				if ( ! isset( self::PROPERTY_PATHS[ $property ] ) ) {
					continue;
				}

				$target = $this->preset_target( $binding );

				if ( $target === null ) {
					continue;
				}

				$styles = $this->set_path(
					$styles,
					self::PROPERTY_PATHS[ $property ],
					'var(' . Wp_Preset_Var::from( $target->category, $target->slug ) . ')'
				);
			}

			if ( $styles !== [] ) {
				$blocks[ $block ] = $styles;
			}
		}

		return $blocks;
	}

	/**
	 * The wp_preset target (category + slug) a binding's referenced token declares, or null when it has
	 * none. Inline bindings without a token reference carry no preset target here.
	 *
	 * @since TBD
	 *
	 * @param Binding $binding The variant binding.
	 *
	 * @return Wp_Preset_Target|null
	 */
	private function preset_target( Binding $binding ): ?Wp_Preset_Target {
		if ( ! $binding->is_token_ref() ) {
			return null;
		}

		$token = $this->registry->get( (string) $binding->token );

		return $token === null ? null : Wp_Preset_Target::from_token( $token );
	}

	/**
	 * Set a value at a path inside a nested array, creating intermediate arrays as needed.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $tree  The tree to write into.
	 * @param string[]             $path  The path segments.
	 * @param mixed                $value The value to set at the leaf.
	 *
	 * @return array<string, mixed>
	 */
	private function set_path( array $tree, array $path, $value ): array {
		$cursor = &$tree;

		foreach ( $path as $segment ) {
			if ( ! isset( $cursor[ $segment ] ) || ! is_array( $cursor[ $segment ] ) ) {
				$cursor[ $segment ] = [];
			}
			$cursor = &$cursor[ $segment ];
		}

		$cursor = $value;

		return $tree;
	}
}
