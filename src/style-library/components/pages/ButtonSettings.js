/**
 * The Button preset's settings panel: the app's first use of `SettingsPanel`'s built-in Normal |
 * Hover tabs. `activeTab` is owned here (view state only — the draft always carries all five bound
 * properties regardless of which tab is active) and drives which schema `helpers/presets.js`'s
 * `buttonSettingsSchema` returns, since `SettingsPanel`'s children render function ignores the tab
 * name (the parent decides what the active tab shows).
 *
 * The footer is deliberately inert (`onDelete`/`onSave` both null) and nothing publishes to the
 * draft channel yet: registering channel actions whose `save` is a stub would make the
 * unsaved-changes guard lie about what Save does. Edits are local and discarded on navigation with
 * no prompt until the mutations flow adds the publish effect and the real handlers.
 */

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SettingsPanel } from '../templates/SettingsPanel';
import { SettingsForm } from '../organisms/SettingsForm';
import { useSettingsPanel } from '../../hooks/use-settings-panel';
import { useButtonPresets } from '../../hooks/use-button-presets';
import { buttonSettingsSchema } from '../../helpers/presets';

/**
 * The panel's state tabs, in display order.
 *
 * @since TBD
 */
const TABS = [
	{ name: 'normal', title: __('Normal', 'kadence-blocks') },
	{ name: 'hover', title: __('Hover', 'kadence-blocks') },
];

/**
 * Render the Button preset's settings panel.
 *
 * @param {Object}   props          The component props.
 * @param {Object}   props.route    The current route (`{ screen, item }`).
 * @param {Function} props.navigate The route navigator.
 * @param {Object}   props.library  The design-tokens feed hook's return value.
 *
 * @since TBD
 *
 * @return {?JSX.Element} The panel, or null while a stale `kb-item` self-heals for a tick.
 */
export function ButtonSettings({ route, navigate, library }) {
	const presets = useButtonPresets(library);
	const id = route.item;
	const initialValues = presets.initialValuesFor(id);
	const hasInitialValues = Boolean(initialValues);
	const panel = useSettingsPanel({ route, navigate, initialValues });
	const [activeTab, setActiveTab] = useState(TABS[0].name);

	// Opening a different preset must not start on Hover.
	useEffect(() => {
		setActiveTab(TABS[0].name);
	}, [id]);

	// A `kb-item` naming no preset (a stale deep link, or another screen's token id) closes the
	// panel instead of rendering broken fields — the `ScaleSettings.js` self-healing idiom. Waiting
	// on `!presets.isLoading` matters here: while the fetch is in flight, an unknown-slug draft and a
	// still-loading one look identical (both `null`), so healing eagerly would bounce a valid deep
	// link straight into the page before its fetch lands.
	useEffect(() => {
		if (id && !presets.isLoading && !hasInitialValues) {
			navigate({ item: '' });
		}
	}, [id, presets.isLoading, hasInitialValues, navigate]);

	if (!id || !hasInitialValues) {
		return null;
	}

	return (
		<SettingsPanel
			onClose={panel.close}
			tabs={TABS}
			activeTab={activeTab}
			onTabChange={setActiveTab}
			onDelete={null}
			onSave={null}
			isDirty={panel.isDirty}
		>
			<SettingsForm
				schema={buttonSettingsSchema(activeTab)}
				values={panel.draft}
				onChange={panel.setFieldValue}
			/>
		</SettingsPanel>
	);
}
