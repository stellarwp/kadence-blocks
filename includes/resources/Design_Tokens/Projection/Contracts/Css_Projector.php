<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Contracts;

/**
 * A projector that builds design-token CSS and appends it to KB's front-end and editor style handles.
 *
 * The shared shape of the CSS-emitting projectors (token vars, presets, block defaults):
 * each enqueues its CSS on the front end and in the editor, and exposes its unguarded builder through
 * `css()` (front end) and `editor_css()` (editor) — the strings the enqueue methods wrap behind their
 * context gates. The two are identical for a context-independent projector and differ only where the
 * editor needs a differently-scoped selector (e.g. a block whose editor markup wraps the bound element).
 * Scoped to the CSS projectors on purpose: other projectors in this namespace seed block attributes or
 * the Kadence palette rather than a style handle, so they are not CSS projectors.
 *
 * {@see \KadenceWP\KadenceBlocks\Design_Tokens\Projection\Editor_Css} aggregates the `editor_css()` of every
 * CSS projector, so a new one joins by implementing this contract and adding itself to the collection from
 * its own provider.
 *
 * @since TBD
 */
interface Css_Projector {

	/**
	 * Append the projected CSS to the front-end global-variables handle.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function enqueue_front_end(): void;

	/**
	 * Append the projected CSS to the editor global-styles handle.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function enqueue_editor(): void;

	/**
	 * The projector's CSS — the unguarded builder, since the enqueue-context gate (the block-editor page
	 * check) stays in enqueue_editor() and does not apply to a REST request.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function css(): string;

	/**
	 * The projector's EDITOR css — identical to css() for a context-independent projector, and overridden
	 * where the editor needs a differently-scoped selector (e.g. a block whose editor markup wraps the
	 * bound element in a div, so the front-end selector lands on the wrong node).
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function editor_css(): string;
}
