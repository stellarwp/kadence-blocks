<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Contracts;

/**
 * Base for the CSS-emitting projectors: supplies the default {@see self::editor_css()} so a projector
 * whose editor output matches its front-end output — the common case — inherits it, and only a projector
 * that needs a differently-scoped editor selector (currently {@see \KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Default_Css\Projector})
 * overrides it.
 *
 * The context gates and the actual builders stay with each concrete projector: enqueue_front_end(),
 * enqueue_editor(), and css() are left for the subclass because they differ per projector (different
 * style handles, builders, and active-library plumbing).
 *
 * @since TBD
 */
abstract class Abstract_Css_Projector implements Css_Projector {

	/**
	 * The editor CSS, defaulting to the front-end {@see self::css()}: a context-independent projector emits
	 * rules that carry no dependency on the editor's markup shape (a `:root` custom-property block, or a slot
	 * var retarget), so the editor needs no separate build. A projector whose editor markup renders a binding
	 * on a different element overrides this with an editor-scoped selector.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function editor_css(): string {
		return $this->css();
	}
}
