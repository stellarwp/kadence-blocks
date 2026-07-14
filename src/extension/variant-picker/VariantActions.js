/**
 * Create / edit / delete controls for a block's design-token variants, plus the design-system actions:
 * a highlight-edits toggle and a reset-all that clears every mapped override for the block.
 *
 * Renders a "Create new variant" button for every block, and, when the selected variant is a user-created
 * one, "Edit" and "Delete" buttons. Deleting the variant the set currently defaults to first reassigns the
 * default to another variant (so the default is never left dangling), then removes it. Shared by the generic
 * inspector panel and a block's inline picker so the controls stay identical wherever they surface. Renders
 * nothing when the editor lacks the REST descriptor.
 */
import { Button, Notice, ToggleControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { SaveVariantModal } from './SaveVariantModal';
import { blockVariants, blockDefaultVariant, isUserVariant, removeVariant } from './index';
import { deleteVariant, setVariantDefault } from '../variants/api/client';
import { hasDesignTokensRest } from '../design-tokens/rest';
import { refreshProjectedCss } from '../design-tokens/live-css';
import { TOKEN_INDICATORS_STORE } from '../token-indicators/store';
import { mappedAttrsFor, resetAttrPatch } from '../token-indicators';

/**
 * The variant create/edit/delete controls, plus the design-system actions: a highlight-edits toggle and a
 * reset-all that clears every mapped override for the block.
 *
 * @param {Object}   props               The component props.
 * @param {string}   props.blockName     The block name.
 * @param {string}   props.set           The token set the block is on.
 * @param {string}   props.selected      The block's currently selected variant slug ('' for the default look).
 * @param {Function} props.onSelect      Called with a variant slug to select it on the block.
 * @param {Object}   props.attributes    The block's current attributes (for reset-all).
 * @param {Function} props.setAttributes The block's setAttributes (for reset-all).
 *
 * @return {Object|null} The controls, or null when the variants REST API is unavailable.
 */
export function VariantActions({ blockName, set, selected, onSelect, attributes, setAttributes }) {
	const [mode, setMode] = useState('none');
	const [confirming, setConfirming] = useState(false);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState('');

	const highlighting = useSelect((select) => select(TOKEN_INDICATORS_STORE).isHighlightingEdits(), []);
	const { setHighlightEdits } = useDispatch(TOKEN_INDICATORS_STORE);

	if (!hasDesignTokensRest()) {
		return null;
	}

	const canManage = selected !== '' && isUserVariant(blockName, set, selected);

	/**
	 * Clear every mapped override for the block, so all mapped controls fall back to the selected
	 * variant's values (served by the existing scoped CSS), then refresh the live preview.
	 *
	 * @return {void}
	 */
	const onResetAll = () => {
		const patch = mappedAttrsFor(blockName, set).reduce(
			(acc, { attr, kind }) => Object.assign(acc, resetAttrPatch(attr, kind)),
			{}
		);

		setAttributes(patch);
		refreshProjectedCss();
	};

	/**
	 * Delete the selected user variant, first moving the default off it when it is the current default.
	 *
	 * @return {void}
	 */
	const onDelete = () => {
		setBusy(true);
		setError('');

		const isDefault = blockDefaultVariant(blockName, set) === selected;
		const fallback = blockVariants(blockName, set)
			.map((variant) => variant.slug)
			.find((slug) => slug !== selected);

		const reassign = isDefault && fallback ? setVariantDefault(blockName, fallback, set) : Promise.resolve();

		reassign
			.then(() => deleteVariant(blockName, selected, set))
			.then(() => {
				removeVariant(blockName, set, selected);
				refreshProjectedCss();
				onSelect('');
				setConfirming(false);
				setBusy(false);
			})
			.catch((caught) => {
				setError(caught?.message || __('Could not delete the variant.', 'kadence-blocks'));
				setBusy(false);
			});
	};

	return (
		<>
			{error !== '' && (
				<Notice status="error" onRemove={() => setError('')}>
					{error}
				</Notice>
			)}

			<Button variant="secondary" onClick={() => setMode('create')}>
				{__('Create new variant', 'kadence-blocks')}
			</Button>

			{canManage && !confirming && (
				<>
					<Button variant="tertiary" onClick={() => setMode('edit')}>
						{__('Edit variant', 'kadence-blocks')}
					</Button>
					<Button variant="tertiary" isDestructive onClick={() => setConfirming(true)}>
						{__('Delete variant', 'kadence-blocks')}
					</Button>
				</>
			)}

			{canManage && confirming && (
				<>
					<p>
						{sprintf(
							/* translators: %s: variant slug. */
							__('Delete the "%s" variant? This cannot be undone.', 'kadence-blocks'),
							selected
						)}
					</p>
					<Button variant="tertiary" onClick={() => setConfirming(false)} disabled={busy}>
						{__('Cancel', 'kadence-blocks')}
					</Button>
					<Button variant="primary" isDestructive isBusy={busy} onClick={onDelete}>
						{__('Delete', 'kadence-blocks')}
					</Button>
				</>
			)}

			<ToggleControl
				label={__('Highlight edits', 'kadence-blocks')}
				help={__('Emphasize controls that override the selected variant.', 'kadence-blocks')}
				checked={highlighting}
				onChange={(on) => setHighlightEdits(on)}
			/>

			<Button variant="tertiary" onClick={onResetAll}>
				{__('Reset all to variant', 'kadence-blocks')}
			</Button>

			{mode !== 'none' && (
				<SaveVariantModal
					blockName={blockName}
					set={set}
					source={selected}
					editSlug={mode === 'edit' ? selected : ''}
					onClose={() => setMode('none')}
					onSaved={(slug) => onSelect(slug)}
				/>
			)}
		</>
	);
}
