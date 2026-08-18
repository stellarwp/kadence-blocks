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
 * `useSettingsPanel`, the tabs, and the write flows, so switching presets remounts it with a
 * correct seed.
 *
 * Save writes the label and the full token map together (a rename is just a Save with only the
 * label changed), so a saved draft always equals the refreshed `initialValues` and `isDirty`
 * settles to false on its own — no extra re-seed is needed after a save (see the module's sibling
 * `ScaleSettings.js` for the same posture on scale tokens).
 */

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SettingsPanel } from '../templates/SettingsPanel';
import { SettingsForm } from '../organisms/SettingsForm';
import { useSettingsPanel } from '../../hooks/use-settings-panel';
import { useButtonScreen } from '../../hooks/use-button-screen';
import { useDraftChannel } from '../../hooks/use-draft-channel';
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
 * @param {Object}   props.screen        The `useButtonScreen` binding.
 * @param {Object}   props.initialValues The seeded draft (`{label, tokens}`) for the open preset.
 * @param {string}   props.presetLabel   The open preset's persisted label, for the channel publication.
 *
 * @since TBD
 *
 * @return {JSX.Element} The panel.
 */
function ButtonSettingsPanel({ navigate, route, screen, initialValues, presetLabel }) {
	const id = route.item;
	const panel = useSettingsPanel({ route, navigate, initialValues });
	const [activeTab, setActiveTab] = useState(TABS[0].name);
	// `screen.isBusy` covers all three write flows (add/save/delete) with a single flag, but the
	// footer needs to show the busy animation on only the button the user actually clicked — a save
	// must not make Delete look like it is deleting, and vice versa. Tracked locally rather than
	// added to the hook because only this panel's footer needs the distinction.
	const [pendingAction, setPendingAction] = useState(null);
	const channel = useDraftChannel();

	// Pulled out of `channel` rather than depending on `channel` itself — see `ScaleSettings.js`'s
	// identical comment: `publish`/`clearPublication` are individually stable, while
	// `useDraftChannelState()` returns a fresh object literal on every app render, so depending on
	// `channel` would re-fire this effect's cleanup (nulling the pending guard action) on every
	// unrelated re-render, including the one `guard()` itself triggers.
	const publish = channel?.publish;
	const clearPublication = channel?.clearPublication;

	useEffect(() => {
		if (!publish || !clearPublication || !id) {
			return undefined;
		}

		publish({ itemId: id, label: presetLabel, draft: panel.draft, isDirty: panel.isDirty });

		return () => clearPublication();
	}, [publish, clearPublication, id, presetLabel, panel.draft, panel.isDirty]);

	// Reassigned every render, never held in state (the `ScaleSettings.js` posture): these close
	// over the current `panel.draft`, so storing them in state would either loop the publish effect
	// above or hand the guard modal a stale draft. `save` is the raw promise, rejection intact — the
	// modal's own Save button is the one place that needs to see a failure.
	if (channel) {
		channel.actionsRef.current = {
			save: () => screen.savePreset(id, panel.draft, initialValues),
			discard: panel.resetDraft,
		};
	}

	// Disabling the footer buttons is a UI guard, not a real one — the handlers refuse to start a
	// second write while `screen.isBusy` is already true, since the flag covers add/save/delete
	// together and a stale click (e.g. a keyboard Enter racing the disabled-attribute repaint) could
	// otherwise still fire.
	const handleSave = () => {
		if (screen.isBusy) {
			return;
		}

		setPendingAction('save');
		screen
			.savePreset(id, panel.draft, initialValues)
			.catch(() => {})
			.finally(() => setPendingAction(null));
	};

	const handleDelete = () => {
		if (screen.isBusy) {
			return;
		}

		setPendingAction('delete');
		screen
			.deletePreset(id)
			.then(() => navigate({ item: '' }))
			.catch(() => {})
			.finally(() => setPendingAction(null));
	};

	// Close becomes guarded now that the panel publishes a real draft — the `ScaleSettings.js`
	// pattern. Delete is never guarded and never confirmed beyond the click: prompting to save a
	// draft on a preset being destroyed is nonsense.
	const handleClose = () => (channel ? channel.guard(panel.close) : panel.close());

	return (
		<SettingsPanel
			onClose={handleClose}
			tabs={TABS}
			activeTab={activeTab}
			onTabChange={setActiveTab}
			onDelete={screen.isDeletable(id) ? handleDelete : null}
			onSave={handleSave}
			isDirty={panel.isDirty}
			isBusy={screen.isBusy}
			isSaving={pendingAction === 'save'}
			isDeleting={pendingAction === 'delete'}
		>
			{screen.saveError && (
				<Notice status="error" isDismissible onRemove={screen.clearSaveError}>
					{screen.saveError.message}
				</Notice>
			)}
			{screen.deleteError && (
				<Notice status="error" isDismissible onRemove={screen.clearDeleteError}>
					{screen.deleteError.message}
				</Notice>
			)}
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
	const screen = useButtonScreen(library);
	const id = route.item;
	const initialValues = screen.initialValuesFor(id);
	const hasInitialValues = Boolean(initialValues);
	const presetLabel = screen.payload?.presets?.[id]?.label ?? id;

	// A `kb-item` naming no preset (a stale deep link, or another screen's token id) closes the
	// panel instead of rendering broken fields — the `ScaleSettings.js` self-healing idiom. Waiting
	// on `!screen.isLoading` matters here: while the fetch is in flight, an unknown-slug draft and a
	// still-loading one look identical (both `null`), so healing eagerly would bounce a valid deep
	// link straight into the page before its fetch lands. Waiting on `!screen.loadError` matters just
	// as much: a rejected fetch also leaves `initialValuesFor` returning null, and a valid `kb-item`
	// must not be mistaken for a stale one just because the request failed — that would rewrite the
	// route and make the deep link unrecoverable even after a successful retry.
	useEffect(() => {
		if (id && !screen.isLoading && !screen.loadError && !hasInitialValues) {
			navigate({ item: '' });
		}
	}, [id, screen.isLoading, screen.loadError, hasInitialValues, navigate]);

	if (!id || !hasInitialValues) {
		return null;
	}

	return (
		<ButtonSettingsPanel
			key={id}
			route={route}
			navigate={navigate}
			screen={screen}
			initialValues={initialValues}
			presetLabel={presetLabel}
		/>
	);
}
