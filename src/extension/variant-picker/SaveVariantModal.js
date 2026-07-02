/**
 * "Create new variant" modal.
 *
 * Clones an existing variant's surface for a block: the user picks a variant to clone from, edits the value
 * of each bound property, names the variant, and saves. The new variant is written through the variants REST
 * endpoint (which aliases matching literals, validates the full surface, and rejects dangling aliases), then
 * appended to the in-memory catalog and selected on the block. Works for any block that registers a variant
 * set — it seeds from an existing variant's values, so it needs no per-block knowledge.
 */
import { Modal, TextControl, SelectControl, Button, Notice, Spinner } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { get } from 'lodash';
import { blockProperties, appendVariant } from './index';
import { getBlockVariants, createVariant } from '../variants/api/client';
import { deriveSlug, dedupeSlug } from '../variants/slug';

/**
 * Whether a value can render as a color swatch (a concrete hex/rgb, not an alias or empty).
 *
 * @param {*} value The value to test.
 * @return {boolean} True when it looks like a color a swatch can render.
 */
function isColorValue(value) {
	return typeof value === 'string' && /^(#|rgb|hsl)/i.test(value.trim());
}

/**
 * Build the initial property => value map for a source variant's tokens across the block's surface.
 *
 * @param {Array}  properties The block's surface ([{ key }]).
 * @param {Object} tokens     The source variant's property => value token map.
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
 * The create-new-variant modal.
 *
 * @param {Object}   props           The component props.
 * @param {string}   props.blockName The block name, e.g. "kadence/advancedbtn".
 * @param {string}   props.set       The token set the block is on.
 * @param {string}   [props.source]  The variant slug to clone from initially.
 * @param {Function} props.onClose   Called to dismiss the modal.
 * @param {Function} props.onCreated Called with the new variant slug after a successful save.
 *
 * @return {Object} The modal element.
 */
export function SaveVariantModal({ blockName, set, source, onClose, onCreated }) {
	const properties = blockProperties(blockName, set);

	const [status, setStatus] = useState('loading');
	const [error, setError] = useState('');
	const [variants, setVariants] = useState({});
	const [sourceSlug, setSourceSlug] = useState(source || '');
	const [label, setLabel] = useState('');
	const [values, setValues] = useState({});

	// Load the block's variants for the set, then seed the form from the chosen (or default) source variant.
	useEffect(() => {
		let cancelled = false;

		getBlockVariants(blockName, set)
			.then((payload) => {
				if (cancelled) {
					return;
				}

				const map = get(payload, 'variants', {}) || {};
				const initialSource =
					source && map[source] ? source : get(payload, 'default', Object.keys(map)[0] || '');

				setVariants(map);
				setSourceSlug(initialSource);
				setValues(seedValues(properties, get(map, [initialSource, 'tokens'], {})));
				setStatus('ready');
			})
			.catch((caught) => {
				if (!cancelled) {
					setError(caught?.message || __('Could not load the block variants.', 'kadence-blocks'));
					setStatus('error');
				}
			});

		return () => {
			cancelled = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [blockName, set]);

	const existingSlugs = Object.keys(variants);
	const slug = dedupeSlug(deriveSlug(label), existingSlugs);
	const canSave = status !== 'saving' && label.trim() !== '' && properties.length > 0;

	/**
	 * Reseed the form values when the user chooses a different variant to clone from.
	 *
	 * @param {string} next The newly chosen source variant slug.
	 * @return {void}
	 */
	const onChooseSource = (next) => {
		setSourceSlug(next);
		setValues(seedValues(properties, get(variants, [next, 'tokens'], {})));
	};

	/**
	 * Write the new variant, then append it to the catalog and select it on the block.
	 *
	 * @return {void}
	 */
	const onSave = () => {
		setStatus('saving');
		setError('');

		createVariant(blockName, { variant: slug, label: label.trim(), tokens: values }, set)
			.then(() => {
				appendVariant(blockName, set, { slug, label: label.trim(), userCreated: true });
				onCreated(slug);
				onClose();
			})
			.catch((caught) => {
				setError(caught?.message || __('Could not save the variant.', 'kadence-blocks'));
				setStatus('ready');
			});
	};

	return (
		<Modal
			title={__('Create new variant', 'kadence-blocks')}
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
						label={__('Variant name', 'kadence-blocks')}
						value={label}
						onChange={setLabel}
						help={
							label.trim() !== ''
								? sprintf(/* translators: %s: variant slug. */ __('Slug: %s', 'kadence-blocks'), slug)
								: ''
						}
					/>

					{existingSlugs.length > 0 && (
						<SelectControl
							label={__('Clone values from', 'kadence-blocks')}
							value={sourceSlug}
							options={existingSlugs.map((existing) => ({
								label: get(variants, [existing, 'label'], existing),
								value: existing,
							}))}
							onChange={onChooseSource}
						/>
					)}

					{properties.map((property) => (
						<div key={property.key} className="kb-save-variant-modal__field">
							<TextControl
								label={property.key}
								value={values[property.key] || ''}
								onChange={(next) => setValues({ ...values, [property.key]: next })}
							/>
							{property.kind === 'color' && isColorValue(values[property.key]) && (
								<span
									className="kb-save-variant-modal__swatch"
									style={{
										backgroundColor: values[property.key],
										display: 'inline-block',
										width: '20px',
										height: '20px',
										borderRadius: '3px',
										border: '1px solid rgba(0, 0, 0, 0.2)',
										verticalAlign: 'middle',
									}}
									aria-hidden="true"
								/>
							)}
						</div>
					))}

					<div className="kb-save-variant-modal__actions">
						<Button variant="tertiary" onClick={onClose} disabled={status === 'saving'}>
							{__('Cancel', 'kadence-blocks')}
						</Button>
						<Button variant="primary" onClick={onSave} isBusy={status === 'saving'} disabled={!canSave}>
							{__('Create variant', 'kadence-blocks')}
						</Button>
					</div>
				</>
			)}
		</Modal>
	);
}
