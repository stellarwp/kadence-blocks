/**
 * Create / edit / delete controls for a block's design-token variants.
 *
 * Renders a "Create new variant" button for every block, and, when the selected variant is a user-created
 * one, "Edit" and "Delete" buttons. Deleting the variant the set currently defaults to first reassigns the
 * default to another variant (so the default is never left dangling), then removes it. Shared by the generic
 * inspector panel and a block's inline picker so the controls stay identical wherever they surface. Renders
 * nothing when the editor lacks the REST descriptor.
 */
import { Button, Notice } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { SaveVariantModal } from './SaveVariantModal';
import { blockVariants, blockDefaultVariant, isUserVariant, removeVariant } from './index';
import { deleteVariant, setVariantDefault } from '../variants/api/client';
import { hasDesignTokensRest } from '../design-tokens/rest';
import { refreshProjectedCss } from '../design-tokens/live-css';

/**
 * The variant create/edit/delete controls.
 *
 * @param {Object}   props           The component props.
 * @param {string}   props.blockName The block name.
 * @param {string}   props.set       The token set the block is on.
 * @param {string}   props.selected  The block's currently selected variant slug ('' for the default look).
 * @param {Function} props.onSelect  Called with a variant slug to select it on the block.
 *
 * @return {Object|null} The controls, or null when the variants REST API is unavailable.
 */
export function VariantActions({ blockName, set, selected, onSelect }) {
	const [mode, setMode] = useState('none');
	const [confirming, setConfirming] = useState(false);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState('');

	if (!hasDesignTokensRest()) {
		return null;
	}

	const canManage = selected !== '' && isUserVariant(blockName, set, selected);

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
