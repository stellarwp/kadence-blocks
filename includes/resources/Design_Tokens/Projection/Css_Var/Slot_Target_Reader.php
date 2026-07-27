<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Slot\Contracts\Target;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use Throwable;

/**
 * Resolves a slot family's shipped scale to a slug => value map, so Kadence Blocks' legacy
 * `--global-kb-<family>-*` variable families can be fed from the design tokens instead of a hardcoded
 * copy (see includes/init.php and class-kadence-blocks-editor-assets.php).
 *
 * The single source of a scale is the baseline: each slug's value comes from resolving the primitive that
 * backs it (Target::get_primitive_id()), so the shipped literals live once. For spacing/gap that primitive
 * is the projection-holding token itself; for font-size it is the primitive the semantic aliases, so the
 * value is the fluid clamp() rather than the semantic's flat base.
 *
 * Fails open to an empty array when the registry is inactive or a stored document cannot be resolved, so a
 * caller keeps its own fallback and a broken token store never suppresses KB's own scale.
 *
 * @since TBD
 */
final class Slot_Target_Reader {

	/**
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * @var Token_Resolver
	 */
	private Token_Resolver $resolver;

	/**
	 * Owns the active-set pointer, so the scale follows the active set (e.g. a switched palette) the same
	 * way the projected CSS does.
	 *
	 * @since TBD
	 *
	 * @var Active_Token_Library_Store
	 */
	private Active_Token_Library_Store $active;

	/**
	 * @since TBD
	 *
	 * @param Token_Registry   $registry
	 * @param Token_Resolver   $resolver
	 * @param Active_Token_Library_Store $active
	 */
	public function __construct( Token_Registry $registry, Token_Resolver $resolver, Active_Token_Library_Store $active ) {
		$this->registry = $registry;
		$this->resolver = $resolver;
		$this->active   = $active;
	}

	/**
	 * The resolved scale for a slot family as a slug => value map.
	 *
	 * @since TBD
	 *
	 * @param class-string<Target> $target_class The slot target defining the family's projection key,
	 *                                           shipped slugs and backing primitive ids.
	 *
	 * @return array<string,string> Slug => resolved scale value (a length, or a clamp() string for a fluid
	 *                              family).
	 */
	public function read( string $target_class ): array {
		if ( ! $this->registry->is_active() ) {
			return [];
		}

		try {
			// Resolve the active set (not just the default) so the scale follows a switched set, matching
			// how the projected slot overrides resolve.
			$resolved = $this->resolver->resolve( $this->active->get() );
		} catch ( Throwable $e ) {
			return [];
		}

		$scale = [];

		foreach ( $this->registry->by_projection( $target_class::get_projection_key() ) as $token ) {
			$target = $target_class::from_token( $token );
			if ( $target === null ) {
				continue;
			}

			$value = $resolved->value( $target_class::get_primitive_id( $target->slot() ) );
			if ( is_string( $value ) && $value !== '' ) {
				$scale[ $target->slot() ] = $value;
			}
		}

		return $scale;
	}
}
