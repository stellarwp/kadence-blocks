/**
 * The generic scale-screen settings panel shared by Border Radius, Border Width, Spacing, and Icon
 * Sizes: NAME + the per-screen value field, and a Delete/Save footer. Mirrors the Color Palette
 * screen's settings-panel shape — calls `useScaleScreen` as its own sibling instance (the screen
 * and its panel share state only through the feed and the route, per the settings-panel contract;
 * see `.local/style-library-reference.md` section 10).
 */

/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SettingsPanel } from '../templates/SettingsPanel';
import { SettingsForm } from '../organisms/SettingsForm';
import { useSettingsPanel } from '../../hooks/use-settings-panel';
import { useScaleScreen } from '../../hooks/use-scale-screen';
import { useDraftChannel } from '../../hooks/use-draft-channel';
import { isDeletable } from '../../helpers/token-capabilities';
import { scaleValueField } from '../../helpers/scale';

/**
 * Render a scale screen's settings panel.
 *
 * @param {Object}   props          The component props.
 * @param {Object}   props.config   The per-screen scale config.
 * @param {Object}   props.route    The current route (`{ screen, item }`).
 * @param {Function} props.navigate The route navigator.
 * @param {Object}   props.library  The design-tokens feed hook's return value.
 *
 * @since TBD
 *
 * @return {?JSX.Element} The panel, or null while a stale `kb-item` self-heals for a tick.
 */
export function ScaleSettings({ config, route, navigate, library }) {
	const scale = useScaleScreen(config, library, route, navigate);
	const channel = useDraftChannel();
	const id = route.item;
	const token = scale.tokenById(id);
	const initialValues = scale.initialValuesFor(id);
	const panel = useSettingsPanel({ route, navigate, initialValues });

	// A `kb-item` naming a token outside this screen's group (a stale deep link, or another
	// screen's/palette's id) resolves to no row here — close the panel instead of rendering broken
	// fields, the same self-healing idiom the app's own unknown-screen handling uses.
	useEffect(() => {
		if (id && !token) {
			navigate({ item: '' });
		}
	}, [id, token, navigate]);

	// Pulled out of `channel` rather than depending on `channel` itself: `useDraftChannelState()`
	// (called by `StyleLibraryApp` on every one of its renders) returns a fresh object literal each
	// time, while `publish`/`clearPublication` are individually stable (`useCallback(..., [])`).
	// Depending on `channel` would re-fire this effect's cleanup — which nulls the pending guard
	// action — on every unrelated app re-render, including the very re-render `guard()` triggers to
	// open the unsaved-changes modal, destroying the pending action before it can render. Depending
	// on the stable callbacks instead means the effect only re-runs for a real id/token/draft change
	// or an actual unmount.
	const publish = channel?.publish;
	const clearPublication = channel?.clearPublication;

	// Publishes the live draft on every change (including each keystroke) and wipes it on cleanup —
	// which fires both on unmount and on the next publish, so a stale-item self-heal or an item
	// switch never leaves a dangling publication behind. Only this panel ever publishes; the screen
	// is read-only on the channel, and the app structure guarantees a single mounted panel.
	useEffect(() => {
		if (!publish || !clearPublication || !id || !token) {
			return undefined;
		}

		publish({ itemId: id, label: token.label, draft: panel.draft, isDirty: panel.isDirty });

		return () => clearPublication();
	}, [publish, clearPublication, id, token, panel.draft, panel.isDirty]);

	// Reassigned every render, never held in state (decision 10b in the plan): these close over the
	// current `panel.draft`, so storing them in state would either loop the publish effect above
	// (new identity every render) or hand the guard modal a stale draft. `save` is the raw promise,
	// re-thrown rejection and all — the modal's own Save button is the one place that needs to see a
	// failure, unlike the panel's own Save button below, which swallows it into `scale.saveError`.
	if (channel) {
		channel.actionsRef.current = {
			save: () => scale.saveToken(id, panel.draft, initialValues),
			discard: panel.resetDraft,
		};
	}

	if (!id || !token) {
		return null;
	}

	// `scaleValueField()` forces the value field non-responsive regardless of what `config.valueField`
	// declares — primitives never take a responsive value, only presets do (see that helper's
	// docblock in `helpers/scale.js` for why the guarantee lives there and not as a per-config flag).
	const schema = {
		fields: [
			{ type: 'text', path: 'label', label: __('Name', 'kadence-blocks') },
			scaleValueField(config.valueField),
		],
	};

	const handleSave = () => {
		scale.saveToken(id, panel.draft, initialValues).catch(() => {});
	};

	const handleDelete = () => {
		scale
			.deleteToken(id)
			.then(() => navigate({ item: '' }))
			.catch(() => {});
	};

	// Delete is deliberately never guarded: destroying the token makes its draft moot, so prompting
	// "save your changes?" about a token the user just chose to delete would be nonsense — this
	// keeps calling `handleDelete` (and, through it, the raw `navigate({ item: '' })`) directly.
	const handleClose = () => (channel ? channel.guard(panel.close) : panel.close());

	return (
		<SettingsPanel
			onClose={handleClose}
			onDelete={isDeletable(token) ? handleDelete : null}
			onSave={handleSave}
			isDirty={panel.isDirty}
		>
			{scale.saveError && (
				<Notice status="error" isDismissible onRemove={scale.clearSaveError}>
					{scale.saveError.message}
				</Notice>
			)}
			{scale.deleteError && (
				<Notice status="error" isDismissible onRemove={scale.clearDeleteError}>
					{scale.deleteError.message}
				</Notice>
			)}
			<SettingsForm schema={schema} values={panel.draft} onChange={panel.setFieldValue} />
		</SettingsPanel>
	);
}
