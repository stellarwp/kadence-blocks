/**
 * "Save as a new preset" modal.
 *
 * A single input to name the preset. Saving clones the current (source) preset's token values under the
 * new name through the presets REST endpoint, then updates the in-memory catalog and selects the new
 * preset on the block. Editing a preset's values happens in a separate UI, so this modal only captures a
 * name. It seeds from an existing preset's values, so it needs no per-block knowledge and works for any
 * block that registers a preset set.
 */
import { Modal, TextControl, Button, Notice, Spinner } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { get } from 'lodash';
import { blockProperties, appendVariant } from './index';
import { getBlockVariants, createVariant } from '../variants/api/client';
import { refreshProjectedCss } from '../design-tokens/live-css';
import { deriveSlug, dedupeSlug } from '../variants/slug';

/**
 * Build the property => value token map for a source preset across the block's surface, filling any
 * property the source does not define with an empty value.
 *
 * @param {Array}  properties The block's surface ([{ key }]).
 * @param {Object} tokens     The source preset's property => value token map.
 *
 * @since TBD
 *
 * @return {Object} The seeded values keyed by property.
 */
function seedValues(properties, tokens) {
	const values = {};

	properties.forEach((property) => {
		values[property.key] = get(tokens, property.key, '');
	});

	return values;
}

/**
 * The "save as a new preset" modal.
 *
 * @param {Object}   props           The component props.
 * @param {string}   props.blockName The block name, e.g. "kadence/singlebtn".
 * @param {string}   props.set       The token set the block is on.
 * @param {string}   [props.source]  The preset slug to clone the saved values from.
 * @param {Function} props.onClose   Called to dismiss the modal.
 * @param {Function} props.onSaved   Called with the new preset slug after a successful save.
 *
 * @since TBD
 *
 * @return {Object} The modal element.
 */
export function SaveVariantModal({ blockName, set, source, onClose, onSaved }) {
	const properties = blockProperties(blockName, set);

	const [status, setStatus] = useState('loading');
	const [error, setError] = useState('');
	const [existingSlugs, setExistingSlugs] = useState([]);
	const [sourceTokens, setSourceTokens] = useState({});
	const [label, setLabel] = useState('');

	// Load the block's presets for the set, so the new preset clones the source (or default) preset's
	// token values and the generated slug is deduped against the existing ones.
	useEffect(() => {
		let cancelled = false;

		getBlockVariants(blockName, set)
			.then((payload) => {
				if (cancelled) {
					return;
				}

				const map = get(payload, 'variants', {}) || {};
				const seedSlug = source && map[source] ? source : get(payload, 'default', Object.keys(map)[0] || '');

				setExistingSlugs(Object.keys(map));
				setSourceTokens(get(map, [seedSlug, 'tokens'], {}));
				setStatus('ready');
			})
			.catch((caught) => {
				if (!cancelled) {
					setError(caught?.message || __('Could not load the block presets.', 'kadence-blocks'));
					setStatus('error');
				}
			});

		return () => {
			cancelled = true;
		};
	}, [blockName, set, source]);

	const slug = dedupeSlug(deriveSlug(label), existingSlugs);
	const canSave = status !== 'saving' && label.trim() !== '' && properties.length > 0;

	/**
	 * Write the new preset from the source preset's values, then update the catalog and select it.
	 *
	 * @since TBD
	 *
	 * @return {void}
	 */
	const onSave = () => {
		setStatus('saving');
		setError('');

		createVariant(
			blockName,
			{ variant: slug, label: label.trim(), tokens: seedValues(properties, sourceTokens) },
			set
		)
			.then(() => {
				appendVariant(blockName, set, { slug, label: label.trim(), userCreated: true });
				refreshProjectedCss();
				onSaved(slug);
				onClose();
			})
			.catch((caught) => {
				setError(caught?.message || __('Could not save the preset.', 'kadence-blocks'));
				setStatus('ready');
			});
	};

	return (
		<Modal
			title={__('Save as a new preset', 'kadence-blocks')}
			onRequestClose={onClose}
			className="kb-save-variant-modal"
		>
			{status === 'loading' && <Spinner />}

			{status === 'error' && (
				<Notice status="error" isDismissible={false}>
					{error}
				</Notice>
			)}

			{(status === 'ready' || status === 'saving') && (
				<>
					{error !== '' && (
						<Notice status="error" onRemove={() => setError('')}>
							{error}
						</Notice>
					)}

					<TextControl
						label={__('Preset name', 'kadence-blocks')}
						value={label}
						onChange={setLabel}
						help={
							label.trim() !== ''
								? sprintf(/* translators: %s: preset slug. */ __('Slug: %s', 'kadence-blocks'), slug)
								: ''
						}
					/>

					<div className="kb-save-variant-modal__actions">
						<Button variant="tertiary" onClick={onClose} disabled={status === 'saving'}>
							{__('Cancel', 'kadence-blocks')}
						</Button>
						<Button variant="primary" onClick={onSave} isBusy={status === 'saving'} disabled={!canSave}>
							{__('Save preset', 'kadence-blocks')}
						</Button>
					</div>
				</>
			)}
		</Modal>
	);
}
