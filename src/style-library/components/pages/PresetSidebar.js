/**
 * The settings sidebar any preset screen renders: the draft, the state tabs, the name field, save and
 * delete, and the draft-channel publication that backs the unsaved-changes guard.
 *
 * Nothing here knows which block it is editing. A per-block page supplies the three things that
 * differ — the screen binding, the tabs, and the per-tab schema — and reuses everything else. See
 * `src/style-library/README.md`.
 *
 * Split into an outer gate and an inner panel because a preset payload is fetched, not synchronous
 * like a scale screen's `window.kadenceDesignTokens` source: on a cold load `route.item` is already
 * set at mount while the fetch is in flight, so a `useSettingsPanel` mounted directly in the gate
 * would seed its draft from a still-null `initialValues` and never re-seed once the payload lands
 * (`useSettingsPanel` only re-seeds on an `itemId` change, not on `initialValues` arriving).
 */

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { Notice } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { SettingsPanel } from '../templates/SettingsPanel';
import { SettingsForm } from '../organisms/SettingsForm';
import { useSettingsPanel } from '../../hooks/use-settings-panel';
import { useDraftChannel } from '../../hooks/use-draft-channel';
import { presetNameSchema } from '../../helpers/presets';
import { Skeleton } from '../atoms/Skeleton';

/**
 * The panel proper: mounted only once its preset's `initialValues` are known, so `useSettingsPanel`
 * always seeds from real data. Remounted (via the gate's `key={id}`) on every preset switch, which
 * both re-seeds the draft and resets the tab to the first one in a single step.
 *
 * @param {Object}   props               The component props.
 * @param {Function} props.navigate      The route navigator.
 * @param {Object}   props.route         The current route (`{ screen, item }`).
 * @param {Object}   props.screen        The preset-screen binding.
 * @param {Object}   props.initialValues The seeded draft (`{label, tokens}`) for the open preset.
 * @param {string}   props.presetLabel   The open preset's persisted label, for the channel publication.
 * @param {?Array}   [props.tabs]        `[{ name, title }]` state tabs, or null/empty for a block
 *                                       whose presets have no states — `schemaFor` is then called
 *                                       with null and should ignore its argument.
 * @param {Function} props.schemaFor     Maps the active tab name to that tab's settings schema.
 *
 * @since TBD
 *
 * @return {JSX.Element} The panel.
 */
function PresetSidebarBody({ navigate, route, screen, initialValues, presetLabel, tabs, schemaFor }) {
	const id = route.item;
	const panel = useSettingsPanel({ route, navigate, initialValues });
	// Optional chained rather than `tabs[0].name`: a block whose presets have no states passes no
	// tabs at all, and `SettingsPanel` already renders the field area bare in that case.
	const [activeTab, setActiveTab] = useState(tabs?.[0]?.name ?? null);
	// `screen.isBusy` covers all the write flows (add/save/delete) with a single flag, but the
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

	// `screen.saveError`/`screen.deleteError` live on the outer preset-screen binding, not on this
	// per-preset panel, so a failed write's error otherwise survives past the preset it happened on.
	// This component is remounted (the gate's `key={id}`) on every preset switch and on close (the
	// gate returns null once `route.item` clears), so a cleanup that clears both errors fires
	// exactly when this panel stops representing the preset the error belongs to.
	const { clearSaveError, clearDeleteError } = screen;

	useEffect(() => {
		return () => {
			clearSaveError();
			clearDeleteError();
		};
	}, [clearSaveError, clearDeleteError]);

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

	// Delete is never guarded and never confirmed beyond the click: prompting to save a draft on a
	// preset being destroyed is nonsense.
	const handleClose = () => (channel ? channel.guard(panel.close) : panel.close());

	return (
		<SettingsPanel
			onClose={handleClose}
			tabs={tabs ?? null}
			activeTab={activeTab}
			onTabChange={setActiveTab}
			beforeTabs={
				<SettingsForm schema={presetNameSchema()} values={panel.draft} onChange={panel.setFieldValue} />
			}
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
			<SettingsForm schema={schemaFor(activeTab)} values={panel.draft} onChange={panel.setFieldValue} />
		</SettingsPanel>
	);
}

/**
 * Render a preset settings panel for whichever block the caller's `screen` binding edits.
 *
 * @param {Object}   props           The component props.
 * @param {Object}   props.route     The current route (`{ screen, item }`).
 * @param {Function} props.navigate  The route navigator.
 * @param {Object}   props.screen    The preset-screen binding, from the caller's own hook.
 * @param {Object}   props.preset    The block's preset config (`presets/<block>-preset.js`), read
 *                                   for its `tabs` and `schemaFor`.
 *
 * @since TBD
 *
 * @return {?JSX.Element} The panel, or null while a stale `kb-item` self-heals for a tick, or while
 *         a valid one's presets are still loading.
 */
export function PresetSidebar({ route, navigate, screen, preset }) {
	const { tabs, schemaFor } = preset;
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

	if (id && screen.isLoading) {
		return (
			<div className="kadence-blocks-style-library__settings-panel" role="status" aria-busy="true">
				<Skeleton className="kadence-blocks-style-library__settings-panel-field" />
				<Skeleton className="kadence-blocks-style-library__settings-panel-field" />
			</div>
		);
	}

	if (!id || !hasInitialValues) {
		return null;
	}

	return (
		<PresetSidebarBody
			key={id}
			route={route}
			navigate={navigate}
			screen={screen}
			initialValues={initialValues}
			presetLabel={presetLabel}
			tabs={tabs ?? null}
			schemaFor={schemaFor}
		/>
	);
}
