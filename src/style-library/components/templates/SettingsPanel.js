/**
 * The inspector-style settings panel: a header with a close control, optional state tabs (e.g.
 * Button's Normal/Hover), a scrollable field area, and a sticky footer holding two buttons that are
 * always present and disabled until they can act: one red-outline destructive action chosen by the
 * kind of item open — Delete for a user-created item, Reset for a shipped one (enabled once it has
 * a saved value to revert) — and a primary Save (enabled while dirty). Pure layout — the
 * field area content is the caller's `children` (typically a `SettingsForm`); state (open item,
 * draft, dirty) lives in `hooks/use-settings-panel.js`, and what each button does is the caller's
 * decision.
 */

/**
 * WordPress dependencies
 */
import { Button, TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { closeSmall } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import './SettingsPanel.scss';

/**
 * The id of the panel's title element. Only one panel is ever mounted, so a fixed id is enough for
 * the popover around it to take its accessible name from the title.
 *
 * @since TBD
 */
export const SETTINGS_PANEL_TITLE_ID = 'kadence-blocks-style-library-settings-panel-title';

/**
 * Render the settings panel.
 *
 * @param {Object}         props               The component props.
 * @param {Function}       props.onClose        Close-control and Cancel handler.
 * @param {string}         [props.title]        The header title, defaults to "Settings".
 * @param {?Array<Object>} [props.tabs]         `[{ name, title }]` state tabs (e.g. Normal/Hover), or null for none.
 * @param {?string}        [props.activeTab]    The active tab name (controlled), null without tabs.
 * @param {?Function}      [props.onTabChange]  Tab-change handler.
 * @param {?JSX.Element}   [props.beforeTabs]   Content rendered between the header and the tabs, for
 *                                              fields that belong to the item rather than to one tab
 *                                              (a preset's name is the same on Normal and Hover).
 * @param {JSX.Element}    props.children       The field area content (typically a `SettingsForm`).
 * @param {string}         [props.destructiveAction] Which destructive button the footer shows: `'delete'`
 *                                                (the default) for a user-created item, `'reset'` for a
 *                                                shipped one. A shipped item is never deletable and a
 *                                                user-created one has no shipped value to go back to, so
 *                                                the two never apply to the same item — the footer shows
 *                                                one, and shows it even while it cannot act, so the user
 *                                                learns from the disabled state rather than from a button
 *                                                that comes and goes.
 * @param {Function}       [props.onDelete]     Delete handler. Optional; defaults to a no-op.
 * @param {boolean}        [props.canDelete]    Enables Delete when true (and `destructiveAction` is `'delete'`).
 * @param {Function}       [props.onReset]      Reset handler. Optional; defaults to a no-op so a caller
 *                                                whose shipped items have no saved value to revert can leave
 *                                                it out and simply never enable the button.
 * @param {boolean}        [props.canReset]     Enables Reset when true (and `destructiveAction` is `'reset'`).
 *                                                Reset is about a SAVED value — the caller passes whether
 *                                                the open item has one to revert — never about the draft,
 *                                                which only `isDirty` reflects.
 * @param {Function}       [props.onSave]       Footer Save handler. Optional; defaults to a no-op.
 * @param {boolean}        [props.isDirty]      Enables Save when true.
 * @param {boolean}        [props.isBusy]       Disables both footer buttons while a write is in flight.
 *                                                Optional, defaults to false, so callers that never pass it are
 *                                                unaffected.
 * @param {boolean}        [props.isSaving]     Shows the Save button's busy animation and a "Saving…" label.
 *                                                Optional, defaults to false; distinct from `isBusy` so a delete
 *                                                in flight does not make Save look like it is saving.
 * @param {boolean}        [props.isDeleting]   Shows the Delete button's busy animation and a "Deleting…"
 *                                                label. Optional, defaults to false, for the same reason as
 *                                                `isSaving`.
 * @param {boolean}        [props.isResetting]  Shows the Reset button's busy animation and a "Resetting…"
 *                                                label. Optional, defaults to false, for the same reason.
 * @param {boolean}        [props.readOnly]     Renders the panel with nothing to act on: the footer keeps
 *                                                only a Close button, since a destructive action or a Save
 *                                                shown disabled would promise an edit that can never come.
 *
 * @since TBD
 *
 * @return {JSX.Element} The panel.
 */
export function SettingsPanel({
	onClose,
	title = __('Settings', 'kadence-blocks'),
	tabs = null,
	activeTab = null,
	onTabChange,
	beforeTabs = null,
	children,
	destructiveAction = 'delete',
	onDelete = () => {},
	canDelete = false,
	onReset = () => {},
	canReset = false,
	onSave = () => {},
	isDirty = false,
	isBusy = false,
	isSaving = false,
	isDeleting = false,
	isResetting = false,
	readOnly = false,
}) {
	const fieldArea = <div className="kadence-blocks-style-library__settings-panel-fields">{children}</div>;

	return (
		<div className="kadence-blocks-style-library__settings-panel">
			<div className="kadence-blocks-style-library__settings-panel-header">
				<h2 id={SETTINGS_PANEL_TITLE_ID} className="kadence-blocks-style-library__settings-panel-title">
					{title}
				</h2>
				<Button
					icon={closeSmall}
					label={__('Close', 'kadence-blocks')}
					className="kadence-blocks-style-library__settings-panel-close"
					onClick={onClose}
				/>
			</div>
			{beforeTabs && <div className="kadence-blocks-style-library__settings-panel-before-tabs">{beforeTabs}</div>}
			{tabs && tabs.length > 0 ? (
				<TabPanel
					// Remounted on an external activeTab change — TabPanel only reads initialTabName once.
					key={activeTab || tabs[0].name}
					className="kadence-blocks-style-library__settings-panel-tabs"
					tabs={tabs}
					initialTabName={activeTab || tabs[0].name}
					onSelect={onTabChange}
				>
					{() => fieldArea}
				</TabPanel>
			) : (
				fieldArea
			)}
			{readOnly ? (
				<div className="kadence-blocks-style-library__settings-panel-footer">
					<Button variant="tertiary" onClick={onClose}>
						{__('Close', 'kadence-blocks')}
					</Button>
				</div>
			) : (
				<div className="kadence-blocks-style-library__settings-panel-footer">
					{'reset' === destructiveAction ? (
						<Button
							variant="secondary"
							isDestructive
							isBusy={isResetting}
							disabled={!canReset || isBusy}
							// Keeps the button focusable (`aria-disabled` instead of the native attribute) while
							// disabled — see the `Save` button below for why a disabled-while-focused footer
							// button is never safe inside this popover.
							accessibleWhenDisabled
							onClick={onReset}
						>
							{isResetting ? __('Resetting…', 'kadence-blocks') : __('Reset', 'kadence-blocks')}
						</Button>
					) : (
						<Button
							variant="secondary"
							isDestructive
							isBusy={isDeleting}
							disabled={!canDelete || isBusy}
							accessibleWhenDisabled
							onClick={onDelete}
						>
							{isDeleting ? __('Deleting…', 'kadence-blocks') : __('Delete', 'kadence-blocks')}
						</Button>
					)}
					<Button variant="tertiary" onClick={onClose}>
						{__('Cancel', 'kadence-blocks')}
					</Button>
					{/* `accessibleWhenDisabled`, not a bare `disabled`: a native `disabled` attribute forces
				    the browser to blur the button the instant `isBusy` flips true, and a click's own
				    mousedown has already focused it right before that — the resulting blur lands with
				    nowhere to go (`document.activeElement` falls back to `<body>`), which the settings
				    popover's own focus-outside detection reads as a genuine click outside itself, closing
				    the popover through the unsaved-changes guard while the save this same click started
				    is still in flight. Keeping the button focusable (`aria-disabled` instead) avoids the
				    forced blur; WP's `Button` still blocks the click/mousedown itself while disabled. */}
					<Button
						variant="primary"
						isBusy={isSaving}
						disabled={!isDirty || isBusy}
						accessibleWhenDisabled
						onClick={onSave}
					>
						{isSaving ? __('Saving…', 'kadence-blocks') : __('Save', 'kadence-blocks')}
					</Button>
				</div>
			)}
		</div>
	);
}
