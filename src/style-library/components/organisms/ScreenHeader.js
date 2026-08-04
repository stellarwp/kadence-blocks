/**
 * The per-screen header row: title, optional inline controls beside it, the primary action on the
 * right. Pure layout — every optional region is a slot the caller fills, and this component knows
 * nothing about what fills them (a palette selector, a delete link — all the caller's).
 *
 * `title` + `primaryAction` is the common shape — most Base Styles / Block Presets screens render
 * only those two. `inlineControl` and `destructiveAction` are exceptional (only Color Palette uses
 * them); both stay generic and optional rather than special-casing Color Palette into this
 * organism.
 */

/**
 * Internal dependencies
 */
import './ScreenHeader.scss';

/**
 * Render the screen header row.
 *
 * @param {Object}       props                     The component props.
 * @param {string}       props.title               The screen title.
 * @param {?JSX.Element} [props.inlineControl]      Control rendered beside the title (e.g. a select).
 * @param {?JSX.Element} [props.destructiveAction]  The red text-link slot beside the inline control.
 * @param {?JSX.Element} [props.primaryAction]      The primary "+ Add …" button slot.
 *
 * @since TBD
 *
 * @return {JSX.Element} The header row.
 */
export function ScreenHeader({ title, inlineControl = null, destructiveAction = null, primaryAction = null }) {
	return (
		<div className="kadence-blocks-style-library__screen-header">
			<div className="kadence-blocks-style-library__screen-header-lead">
				<h2 className="kadence-blocks-style-library__screen-header-title">{title}</h2>
				{inlineControl && (
					<span className="kadence-blocks-style-library__screen-header-inline-control">{inlineControl}</span>
				)}
				{destructiveAction && (
					<span className="kadence-blocks-style-library__screen-header-destructive">{destructiveAction}</span>
				)}
			</div>
			<div className="kadence-blocks-style-library__screen-header-trail">
				{primaryAction && (
					<span className="kadence-blocks-style-library__screen-header-primary-action">{primaryAction}</span>
				)}
			</div>
		</div>
	);
}
