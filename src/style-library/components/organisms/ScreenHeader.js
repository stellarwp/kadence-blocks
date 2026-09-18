/**
 * The per-screen header row: title, optional inline controls beside it, the primary action on the
 * right. Pure layout — every optional region is a slot the caller fills, and this component knows
 * nothing about what fills them (a palette selector, a rename/delete link, the screen's helper
 * copy — all the caller's).
 *
 * `title` + `primaryAction` is the common shape — most Base Styles / Block Presets screens render
 * only those two. `inlineControl`, `secondaryAction`, and `destructiveAction` are exceptional
 * (only Color Palette uses them); all three stay generic and optional rather than special-casing
 * Color Palette into this organism.
 *
 * The component is a block, not a row: the row holds the title and the actions, and `description`
 * renders under it, unwrapped, so a slot that renders nothing leaves nothing behind and the
 * block's bottom margin stays the single gap to the screen's content.
 */

/**
 * Internal dependencies
 */
import './ScreenHeader.scss';

/**
 * Render the screen header block.
 *
 * @param {Object}       props                     The component props.
 * @param {string}       props.title               The screen title.
 * @param {?JSX.Element} [props.inlineControl]      Control rendered beside the title (e.g. a select).
 * @param {?JSX.Element} [props.secondaryAction]    A non-destructive text-link slot beside the destructive action (e.g. Rename).
 * @param {?JSX.Element} [props.destructiveAction]  The red text-link slot beside the secondary action.
 * @param {?JSX.Element} [props.primaryAction]      The primary "+ Add …" button slot.
 * @param {?JSX.Element} [props.description]        The screen's helper copy, rendered under the row.
 *
 * @since TBD
 *
 * @return {JSX.Element} The header block.
 */
export function ScreenHeader({
	title,
	inlineControl = null,
	secondaryAction = null,
	destructiveAction = null,
	primaryAction = null,
	description = null,
}) {
	return (
		<div className="kadence-blocks-style-library__screen-header">
			<div className="kadence-blocks-style-library__screen-header-row">
				<div className="kadence-blocks-style-library__screen-header-lead">
					<h2 className="kadence-blocks-style-library__screen-header-title">{title}</h2>
					{inlineControl && (
						<span className="kadence-blocks-style-library__screen-header-inline-control">
							{inlineControl}
						</span>
					)}
					{secondaryAction && (
						<span className="kadence-blocks-style-library__screen-header-secondary">{secondaryAction}</span>
					)}
					{destructiveAction && (
						<span className="kadence-blocks-style-library__screen-header-destructive">
							{destructiveAction}
						</span>
					)}
				</div>
				<div className="kadence-blocks-style-library__screen-header-trail">
					{primaryAction && (
						<span className="kadence-blocks-style-library__screen-header-primary-action">
							{primaryAction}
						</span>
					)}
				</div>
			</div>
			{description}
		</div>
	);
}
