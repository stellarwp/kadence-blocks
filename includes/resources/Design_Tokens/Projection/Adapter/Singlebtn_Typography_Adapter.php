<?php declare( strict_types=1 );
// cspell:ignore singlebtn advancedbtn .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Adapter;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Adapter\Contracts\Abstract_Adapter;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Utils\Cast;
use Throwable;

/**
 * Fills a kadence/singlebtn instance's `typography[0]` bundle from the resolved
 * `semantic.typography.control` token, so a button follows the design system's on-brand typography with
 * no per-instance edit while any locally-set field still wins.
 *
 * Unlike {@see Icon_Size_Adapter} — which overlays a block's *registration* defaults on
 * `kadence_blocks_block_default_attributes` — a button's `typography` attribute is stored as a whole
 * object (a partially-customized button saves every field), so a registration-default overlay would be
 * all-or-nothing. This adapter instead runs on the per-instance `kadence_blocks_singlebtn_render_block_attributes`
 * filter, which fires with the block's already-merged attributes at render time. That lets it fill each
 * `typography[0]` field only when the instance left it blank, so a button that set (say) only its weight
 * keeps that weight and still picks up the token family — field-level "local wins", not object-level.
 * `Kadence_Blocks_CSS::render_typography()` then emits the CSS exactly as it does for a hand-set value,
 * so nothing in the button's render path or stylesheet changes.
 *
 * The token drives only the sub-fields it declares (the shipped baseline seeds just `fontFamily`), so a
 * field the token omits is left to inherit — activation changes only the on-brand font family until a
 * site owner overrides the token to add weight/size/style/etc.
 *
 * An {@see Adapter_Interface} like {@see Icon_Size_Adapter}, but {@see Provider} hooks it on the
 * per-instance render filter keyed by {@see get_block()} rather than dispatching it through the Token
 * Registry (whose lookup only feeds the registration-default filter this adapter must not use). It is a
 * no-op when projection is fail-closed, when the token is absent, or when it throws, so it is safe on
 * every button render.
 *
 * @since TBD
 */
final class Singlebtn_Typography_Adapter extends Abstract_Adapter {

	/**
	 * @since TBD
	 *
	 * @var string
	 */
	protected const BLOCK = 'kadence/singlebtn';

	/**
	 * The resolved-token dot-path this adapter reads.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const TOKEN = 'semantic.typography.control';

	/**
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * @since TBD
	 *
	 * @var Token_Resolver
	 */
	private Token_Resolver $resolver;

	/**
	 * @since TBD
	 *
	 * @param Token_Registry $registry The token registry (for the fail-closed guard).
	 * @param Token_Resolver $resolver The token resolver.
	 */
	public function __construct( Token_Registry $registry, Token_Resolver $resolver ) {
		$this->registry = $registry;
		$this->resolver = $resolver;
	}

	/**
	 * Fill the button's `typography[0]` bundle from the control token, returning the transformed
	 * attributes. A no-op when projection is fail-closed, the token is absent, or a failure occurs.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $attributes The button's already-merged instance attributes.
	 *
	 * @return array<string, mixed> The transformed attributes.
	 */
	public function apply( array $attributes ): array {
		// Respect the fail-closed guard: fall back to stock KB behavior rather than half-applying tokens.
		if ( ! $this->registry->is_active() ) {
			return $attributes;
		}

		try {
			$bundle = $this->resolver->resolve()->composite( self::TOKEN );

			if ( $bundle === null ) {
				return $attributes;
			}

			return $this->fill( $attributes, $bundle );
		} catch ( Throwable $e ) {
			// This runs in the render path: a faulty resolve must never fatal a page, so fail soft.
			return $attributes;
		}
	}

	/**
	 * Fill each blank `typography[0]` field from the resolved token bundle, leaving locally-set fields
	 * untouched.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $attributes The button's instance attributes.
	 * @param array<string, mixed> $bundle     The resolved control-token sub-fields (field => literal).
	 *
	 * @return array<string, mixed> The transformed attributes.
	 */
	private function fill( array $attributes, array $bundle ): array {
		$instances  = isset( $attributes['typography'] ) && is_array( $attributes['typography'] ) ? $attributes['typography'] : [];
		$typography = ( isset( $instances[0] ) && is_array( $instances[0] ) ) ? $instances[0] : [];

		if ( isset( $bundle['fontFamily'] ) && $this->is_blank( $typography['family'] ?? '' ) ) {
			$typography['family'] = $this->font_family( $bundle['fontFamily'] );
		}

		if ( isset( $bundle['fontWeight'] ) && $this->is_blank( $typography['weight'] ?? '' ) ) {
			$typography['weight'] = Cast::to_string( $bundle['fontWeight'] );
		}

		if ( isset( $bundle['fontStyle'] ) && $this->is_blank( $typography['style'] ?? '' ) ) {
			$typography['style'] = Cast::to_string( $bundle['fontStyle'] );
		}

		if ( isset( $bundle['textTransform'] ) && $this->is_blank( $typography['textTransform'] ?? '' ) ) {
			$typography['textTransform'] = Cast::to_string( $bundle['textTransform'] );
		}

		$this->fill_length( $typography, 'size', 'sizeType', $bundle['fontSize'] ?? null );
		$this->fill_length( $typography, 'lineHeight', 'lineType', $bundle['lineHeight'] ?? null );
		$this->fill_length( $typography, 'letterSpacing', 'letterType', $bundle['letterSpacing'] ?? null );

		$instances[0]            = $typography;
		$attributes['typography'] = $instances;

		return $attributes;
	}

	/**
	 * Fill a responsive-length `typography[0]` field (size/lineHeight/letterSpacing) and its unit key from
	 * a resolved token value, only when the instance left the desktop slot blank. The number lands in the
	 * desktop slot and the parsed unit in the unit key; a unit-less value (e.g. a raw line-height) leaves
	 * the unit key untouched.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $typography The button's typography[0] bundle, by reference.
	 * @param string               $value_key  The responsive value key (e.g. "size").
	 * @param string               $unit_key   The unit key (e.g. "sizeType").
	 * @param mixed                $resolved   The resolved token value, or null when the token omits it.
	 *
	 * @return void
	 */
	private function fill_length( array &$typography, string $value_key, string $unit_key, $resolved ): void {
		if ( $resolved === null ) {
			return;
		}

		$current = $typography[ $value_key ] ?? [ '', '', '' ];
		$desktop = is_array( $current ) ? ( $current[0] ?? '' ) : $current;

		if ( ! $this->is_blank( $desktop ) ) {
			return;
		}

		[ $number, $unit ] = $this->split_length( Cast::to_string( $resolved ) );

		if ( $number === '' ) {
			return;
		}

		$responsive      = is_array( $current ) ? $current : [ '', '', '' ];
		$responsive[0]   = $number;
		$typography[ $value_key ] = $responsive;

		if ( $unit !== '' ) {
			$typography[ $unit_key ] = $unit;
		}
	}

	/**
	 * Split a CSS length into its numeric portion and unit, e.g. "1.5rem" => ["1.5", "rem"] and a
	 * unit-less "1.5" => ["1.5", ""]. A value with no leading number (e.g. "normal") yields ["", ""], so
	 * the caller skips it.
	 *
	 * @since TBD
	 *
	 * @param string $length The CSS length.
	 *
	 * @return array{0:string, 1:string} The [number, unit] pair.
	 */
	private function split_length( string $length ): array {
		if ( preg_match( '/^(-?(?:\d+\.?\d*|\.\d+))([a-z%]*)$/i', trim( $length ), $matches ) !== 1 ) {
			return [ '', '' ];
		}

		return [ $matches[1], $matches[2] ];
	}

	/**
	 * Render a resolved fontFamily (a list of family names, or a single string) to the CSS family stack
	 * the `family` attribute stores, quoting any name that contains whitespace.
	 *
	 * @since TBD
	 *
	 * @param mixed $family The resolved fontFamily value.
	 *
	 * @return string
	 */
	private function font_family( $family ): string {
		if ( ! is_array( $family ) ) {
			return Cast::to_string( $family );
		}

		$names = array_map(
			static function ( $name ): string {
				// Strip any surrounding quotes an authored family already carries before re-quoting, so a
				// name that needs quoting because it contains a space (e.g. an already-quoted "Segoe UI")
				// is not double-wrapped into a broken `""Segoe UI""`.
				$name = trim( Cast::to_string( $name ) );
				$name = trim( $name, "\"'" );

				return strpos( $name, ' ' ) !== false ? '"' . $name . '"' : $name;
			},
			$family
		);

		return implode( ', ', $names );
	}

	/**
	 * Whether a stored typography value counts as blank (unset by the instance), so the token may fill it.
	 *
	 * @since TBD
	 *
	 * @param mixed $value The stored value.
	 *
	 * @return bool
	 */
	private function is_blank( $value ): bool {
		return $value === '' || $value === null;
	}
}
