<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Style;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Variant_Resolver;
use RuntimeException;

/**
 * Registers a WordPress block style for every native block variant, so the editor's block-styles switcher
 * offers them and adds the matching "is-style-kb-<name>" class when one is picked.
 *
 * Registration is structure only — the styling itself is the scoped CSS {@see Css_Builder} emits. A
 * deactivated registry registers nothing, leaving the block's native styles untouched. Kadence blocks are
 * skipped; they reach their variants through the kbVariant class path.
 *
 * @since TBD
 */
final class Registrar {

	/**
	 * @var Token_Registry The registry the variant sets are read from.
	 *
	 * @since TBD
	 */
	private Token_Registry $registry;

	/**
	 * @var Variant_Resolver Supplies each block's variant slugs from the document.
	 *
	 * @since TBD
	 */
	private Variant_Resolver $variants;

	/**
	 * @since TBD
	 *
	 * @param Token_Registry   $registry The token registry.
	 * @param Variant_Resolver $variants The variant resolver.
	 */
	public function __construct( Token_Registry $registry, Variant_Resolver $variants ) {
		$this->registry = $registry;
		$this->variants = $variants;
	}

	/**
	 * Register a block style for each native block's named variants. Bound to init.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function register(): void {
		if ( ! $this->registry->is_active() ) {
			return;
		}

		foreach ( $this->registry->variant_blocks() as $block ) {
			if ( ! Style::is_native( $block ) ) {
				continue;
			}

			try {
				$names = $this->variants->names( $block );
			} catch ( RuntimeException $e ) {
				// A block with bindings but no document variants yet contributes no styles.
				continue;
			}

			foreach ( $names as $variant ) {
				register_block_style(
					$block,
					[
						'name'  => Style::name( $variant ),
						'label' => $this->variants->label( $block, $variant ) ?? $this->fallback_label( $variant ),
					]
				);
			}
		}
	}

	/**
	 * A title-cased label derived from the variant slug (e.g. "ghost" => "Ghost"), used only when the
	 * document declares no label for the variant. Not translated: variant slugs are document data.
	 *
	 * @since TBD
	 *
	 * @param string $variant The variant slug.
	 *
	 * @return string
	 */
	private function fallback_label( string $variant ): string {
		return ucwords( str_replace( [ '-', '_' ], ' ', $variant ) );
	}
}
