/**
 * The inspector-style settings panel: a header with a close control, optional state tabs (e.g.
 * Button's Normal/Hover), a scrollable field area, and a sticky footer holding a red-outline
 * Delete (present only for a deletable item) and a primary Save (enabled only while dirty). Pure
 * layout — the field area content is the caller's `children` (typically a `SettingsForm`); state
 * (open item, draft, dirty) lives in `hooks/use-settings-panel.js`.
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
 * Render the settings panel.
 *
 * @param {Object}         props               The component props.
 * @param {Function}       props.onClose        Close-control handler.
 * @param {?Array<Object>} [props.tabs]         `[{ name, title }]` state tabs (e.g. Normal/Hover), or null for none.
 * @param {?string}        [props.activeTab]    The active tab name (controlled), null without tabs.
 * @param {?Function}      [props.onTabChange]  Tab-change handler.
 * @param {JSX.Element}    props.children       The field area content (typically a `SettingsForm`).
 * @param {?Function}      [props.onDelete]     Footer Delete handler; null hides the button (a non-deletable item).
 * @param {?Function}      [props.onSave]       Footer Save handler; null hides the button.
 * @param {boolean}        [props.isDirty]      Enables Save when true.
 * @param {boolean}        [props.isBusy]       Disables both footer buttons while a write is in flight. Optional,
 *                                                defaults to false, so callers that never pass it are unaffected.
 * @param {boolean}        [props.isSaving]     Shows the Save button's busy animation and a "Saving…" label.
 *                                                Optional, defaults to false; distinct from `isBusy` so a delete in
 *                                                flight does not make Save look like it is saving.
 * @param {boolean}        [props.isDeleting]   Shows the Delete button's busy animation and a "Deleting…" label.
 *                                                Optional, defaults to false, for the same reason as `isSaving`.
 *
 * @since TBD
 *
 * @return {JSX.Element} The panel.
 */
export function SettingsPanel({
	onClose,
	tabs = null,
	activeTab = null,
	onTabChange,
	children,
	onDelete = null,
	onSave = null,
	isDirty = false,
	isBusy = false,
	isSaving = false,
	isDeleting = false,
}) {
	const fieldArea = <div className="kadence-blocks-style-library__settings-panel-fields">{children}</div>;

	return (
		<div className="kadence-blocks-style-library__settings-panel">
			<div className="kadence-blocks-style-library__settings-panel-header">
				<h2 className="kadence-blocks-style-library__settings-panel-title">
					{__('Settings', 'kadence-blocks')}
				</h2>
				<Button
					icon={closeSmall}
					label={__('Close', 'kadence-blocks')}
					className="kadence-blocks-style-library__settings-panel-close"
					onClick={onClose}
				/>
			</div>
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
			<div className="kadence-blocks-style-library__settings-panel-footer">
				{onDelete && (
					<Button variant="secondary" isDestructive isBusy={isDeleting} disabled={isBusy} onClick={onDelete}>
						{isDeleting ? __('Deleting…', 'kadence-blocks') : __('Delete', 'kadence-blocks')}
					</Button>
				)}
				{onSave && (
					<Button variant="primary" isBusy={isSaving} disabled={!isDirty || isBusy} onClick={onSave}>
						{isSaving ? __('Saving…', 'kadence-blocks') : __('Save', 'kadence-blocks')}
					</Button>
				)}
			</div>
		</div>
	);
}
