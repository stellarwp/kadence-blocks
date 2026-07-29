<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;

/**
 * Aggregates the design-token EDITOR CSS from every projector into one string, so the projected-CSS REST
 * endpoint can serve exactly the CSS the projectors enqueue at page load — for live re-injection into the
 * block-editor canvas when a preset (or, later, a token value) changes without a reload.
 *
 * Each source's `editor_css()` is the unguarded builder; the enqueue-context gate (the block-editor page
 * check) stays in each `enqueue_editor()` and does not apply off a block-editor page request, so it is
 * deliberately not repeated here. This aggregator applies the one gate that still matters: a deactivated
 * registry projects nothing, so it returns ''. The sources are concatenated in the order the Projection
 * provider supplies them, which mirrors the load-time enqueue — the token vars first (the foundation the
 * other layers reference), then presets, native retarget, and block defaults. Each source already fails
 * open to '' on its own, so one broken layer never suppresses the others. Multi-library (multi-palette)
 * support is preserved verbatim: the token-var and preset builders each emit every library's namespaced
 * vars plus the per-set switch selectors, unchanged.
 *
 * `editor_css()` equals `css()` for the context-independent projectors (token vars, preset) — their output
 * carries no dependency on the editor's markup shape. It differs only for the block-default projector, whose
 * editor build re-targets a block's rule at its editor-rendered element (e.g. `.editor-styles-wrapper
 * .wp-block-kadence-advancedheading .kadence-advancedheading-text` instead of the front-end
 * `.wp-block-kadence-advancedheading`) for blocks whose `useBlockProps()` wrapper div is not the element the
 * bindings style. Calling `editor_css()` here rather than `css()` is what gives a live re-injection (a token
 * change applied with no page reload) the same selector the editor's own page-load enqueue used.
 *
 * The projectors are gathered from the {@see Css_Projectors} collection, which each CSS projector's own
 * provider adds to — so a new editor-CSS projector joins from its own module, with no change to this class or
 * the Projection provider.
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
	 * The collection of CSS projectors whose editor CSS is aggregated, in load order.
	 *
	 * @since TBD
	 *
	 * @var Css_Projectors
	 */
	private Css_Projectors $projectors;

	/**
	 * @since TBD
	 *
	 * @param Token_Registry $registry   The token registry.
	 * @param Css_Projectors $projectors The collection of CSS projectors to aggregate.
	 */
	public function __construct( Token_Registry $registry, Css_Projectors $projectors ) {
		$this->registry   = $registry;
		$this->projectors = $projectors;
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

		$css = '';

		foreach ( $this->projectors->all() as $projector ) {
			$css .= $projector->editor_css();
		}

		return $css;
	}
}
