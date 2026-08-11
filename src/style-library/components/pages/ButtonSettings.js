/**
 * The Button preset's settings panel: the app's first use of `SettingsPanel`'s built-in Normal |
 * Hover tabs. `activeTab` is view state only — the draft always carries all five bound properties
 * regardless of which tab is active — and drives which schema `helpers/presets.js`'s
 * `buttonSettingsSchema` returns, since `SettingsPanel`'s children render function ignores the tab
 * name (the parent decides what the active tab shows).
 *
 * Split into an outer/inner pair because `useButtonPresets`' payload is fetched, not synchronous
 * like every other screen's `window.kadenceDesignTokens` source: on a cold load `route.item` is
 * already set at mount while the fetch is still in flight, so a `useSettingsPanel` mounted directly
 * here would seed its draft from a still-null `initialValues` and never re-seed once the payload
 * lands (`useSettingsPanel` only re-seeds on an `itemId` change, not on `initialValues` arriving).
 * `ButtonSettings` owns the fetch, the stale-item self-heal, and the loading/no-data gate;
 * `ButtonSettingsPanel` — mounted only once real values exist, `key`ed on the preset id — owns
 * `useSettingsPanel` and the tabs, so switching presets remounts it with a correct seed.
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
 * The panel proper: mounted only once its preset's `initialValues` are known, so `useSettingsPanel`
 * always seeds from real data. Remounted (via the caller's `key={id}`) on every preset switch,
 * which both re-seeds the draft and resets the tab to Normal in one step.
 *
 * @param {Object}   props               The component props.
 * @param {Function} props.navigate      The route navigator.
 * @param {Object}   props.route         The current route (`{ screen, item }`).
 * @param {Object}   props.initialValues The seeded draft (`{label, tokens}`) for the open preset.
 *
 * @since TBD
 *
 * @return {JSX.Element} The panel.
 */
function ButtonSettingsPanel({ navigate, route, initialValues }) {
	const panel = useSettingsPanel({ route, navigate, initialValues });
	const [activeTab, setActiveTab] = useState(TABS[0].name);

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
 * @return {?JSX.Element} The panel, or null while a stale `kb-item` self-heals for a tick, or while
 *         a valid one's presets are still loading.
 */
export function ButtonSettings({ route, navigate, library }) {
	const presets = useButtonPresets(library);
	const id = route.item;
	const initialValues = presets.initialValuesFor(id);
	const hasInitialValues = Boolean(initialValues);

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

	return <ButtonSettingsPanel key={id} route={route} navigate={navigate} initialValues={initialValues} />;
}
