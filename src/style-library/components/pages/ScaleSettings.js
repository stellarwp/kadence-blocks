/**
 * The generic scale-screen settings panel shared by Border Radius, Border Width, Spacing, and Icon
 * Sizes: NAME + the per-screen value field, and a Delete/Save footer. Mirrors the Color Palette
 * screen's settings-panel shape — calls `useScaleScreen` as its own sibling instance (the screen
 * and its panel share state only through the feed and the route, with `use-draft-channel.js` as
 * the one sanctioned exception).
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

	return (
		<SettingsPanel
			onClose={panel.close}
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
