<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Default_Css\Projector as Block_Default_Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Projector as Css_Var_Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Native\Projector as Native_Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Variant\Projector as Variant_Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;

/**
 * Aggregates the design-token EDITOR CSS from every projector into one string, so the projected-CSS REST
 * endpoint can serve exactly the CSS the projectors enqueue at page load — for live re-injection into the
 * block-editor canvas when a variant (or, later, a token value) changes without a reload.
 *
 * Each projector's `css()` is the unguarded builder; the enqueue-context gate (the block-editor page check)
 * stays in each `enqueue_editor()` and does not apply off a block-editor page request, so it is deliberately
 * not repeated here. This aggregator applies the one gate that still matters: a deactivated registry projects
 * nothing, so it returns ''. The concatenation order mirrors the load-time enqueue — the token vars first (the
 * foundation the other layers reference), then variants, native retarget, and block defaults. Each projector
 * already fails open to '' on its own, so one broken layer never suppresses the others. Multi-set (multi-
 * palette) support is preserved verbatim: the token-var and variant builders each emit every set's namespaced
 * vars plus the per-set switch selectors, unchanged.
 *
 * @since TBD
 */
final class Editor_Css {

	/**
	 * The token registry, for the fail-closed gate.
	 *
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * The token-var projector (the `--kb-token--*` custom properties, every set).
	 *
	 * @since TBD
	 *
	 * @var Css_Var_Projector
	 */
	private Css_Var_Projector $css_var;

	/**
	 * The variant projector (per-variant vars + scoped retarget rules, every set).
	 *
	 * @since TBD
	 *
	 * @var Variant_Projector
	 */
	private Variant_Projector $variant;

	/**
	 * The native-block projector (core/button companion CSS).
	 *
	 * @since TBD
	 *
	 * @var Native_Projector
	 */
	private Native_Projector $native;

	/**
	 * The block-default projector (block-default dimension CSS for the active set).
	 *
	 * @since TBD
	 *
	 * @var Block_Default_Projector
	 */
	private Block_Default_Projector $block_default;

	/**
	 * @since TBD
	 *
	 * @param Token_Registry          $registry      The token registry.
	 * @param Css_Var_Projector       $css_var       The token-var projector.
	 * @param Variant_Projector       $variant       The variant projector.
	 * @param Native_Projector        $native        The native-block projector.
	 * @param Block_Default_Projector $block_default The block-default projector.
	 */
	public function __construct(
		Token_Registry $registry,
		Css_Var_Projector $css_var,
		Variant_Projector $variant,
		Native_Projector $native,
		Block_Default_Projector $block_default
	) {
		$this->registry      = $registry;
		$this->css_var       = $css_var;
		$this->variant       = $variant;
		$this->native        = $native;
		$this->block_default = $block_default;
	}

	/**
	 * The combined design-token editor CSS, or an empty string when the registry is deactivated.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function css(): string {
		if ( ! $this->registry->is_active() ) {
			return '';
		}

		return $this->css_var->css()
			. $this->variant->css()
			. $this->native->css()
			. $this->block_default->css();
	}
}
