<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Native\Styles\Contracts;

/**
 * Contract for a native (non-Kadence) block's companion stylesheet.
 *
 * A native block reaches its design-token variants through the shared Variant\Css_Builder retarget (the
 * --global-* slots). Unlike a Kadence block — which already consumes those slots in its own render path /
 * SCSS — a native block has no such CSS of its own, so each implementation supplies the small stylesheet
 * that makes one native block's markup read the slots. The Projector enqueues every registered
 * implementation, so adding support for another native block is just a new implementation in the list — no
 * change to the projector or the retarget.
 *
 * @since TBD
 */
interface Styles {

	/**
	 * The companion CSS for the block, or an empty string when it contributes none.
	 *
	 * @since TBD
	 *
	 * @param bool $owns_default Whether the design system owns the block's default (no-variant) state — true
	 *                           when the active theme's palette has been replaced, so the theme's native
	 *                           styling is gone and the block is styled even without a selected variant;
	 *                           false when only a variant-selected instance should be styled.
	 *
	 * @return string
	 */
	public function css( bool $owns_default ): string;
}
