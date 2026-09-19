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
 * `description` is not part of the header block: it renders right after it, unwrapped, so a slot
 * that renders nothing leaves nothing behind.
 *
 * Inside the app shell the header block is not rendered where the screen puts it: it fills the
 * shell's header slot, which sits above the scrolling screen body, so the header stays put while
 * the screen scrolls and no screen has to split itself into a header and a body. The description
 * does not move: it stays in the screen, as the first thing that scrolls.
 */

/**
 * WordPress dependencies
 */
import { createContext, createPortal, useContext, useMemo, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './ScreenHeader.scss';

const SlotContext = createContext();

/**
 * Provide the screen header slot to everything below.
 *
 * @param {Object}      props          The component props.
 * @param {JSX.Element} props.children The tree that holds both the slot and the screens.
 *
 * @since TBD
 *
 * @return {JSX.Element} The provider.
 */
export function ScreenHeaderSlotProvider({ children }) {
	const [node, setNode] = useState(null);
	const value = useMemo(() => ({ node, setNode }), [node]);

	return <SlotContext.Provider value={value}>{children}</SlotContext.Provider>;
}

/**
 * Render the slot the active screen's header fills.
 *
 * @since TBD
 *
 * @return {JSX.Element} The slot.
 */
export function ScreenHeaderSlot() {
	const { setNode } = useContext(SlotContext);

	return <div ref={setNode} className="kadence-blocks-style-library__screen-header-slot" />;
}

/**
 * Render the screen header block.
 *
 * @param {Object}       props                     The component props.
 * @param {string}       props.title               The screen title.
 * @param {?JSX.Element} [props.inlineControl]      Control rendered beside the title (e.g. a select).
 * @param {?JSX.Element} [props.secondaryAction]    A non-destructive text-link slot beside the destructive action (e.g. Rename).
 * @param {?JSX.Element} [props.destructiveAction]  The red text-link slot beside the secondary action.
 * @param {?JSX.Element} [props.primaryAction]      The primary "+ Add …" button slot.
 * @param {?JSX.Element} [props.description]        The screen's helper copy, rendered after the header block.
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
	const slot = useContext(SlotContext);

	const header = (
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
		</div>
	);

	if (!slot) {
		return (
			<>
				{header}
				{description}
			</>
		);
	}

	return (
		<>
			{slot.node && createPortal(header, slot.node)}
			{description}
		</>
	);
}
