/**
 * The Kadence panel: a modal over the Site Editor for one block's site-level styles.
 */
import { __, sprintf } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import { getBlockType } from '@wordpress/blocks';
import { Button, Modal } from '@wordpress/components';
import { STORE_NAME } from './store';
import SiteStylesPanel from './panel';

/**
 * Renders the modal while a block's panel is open.
 *
 * @return {Element|null} The modal, or nothing.
 */
export default function SiteStylesModal() {
	const blockName = useSelect((select) => select(STORE_NAME).getOpenBlockName(), []);
	const { closeSiteStyles } = useDispatch(STORE_NAME);

	if (!blockName) {
		return null;
	}

	const title = sprintf(
		/* translators: %s: block title, e.g. Single Button. */
		__('%s — site styles', 'kadence-blocks'),
		getBlockType(blockName)?.title || blockName
	);

	return (
		<Modal title={title} onRequestClose={closeSiteStyles} className="kb-site-styles-modal">
			<SiteStylesPanel blockName={blockName} />
			<div className="kb-site-styles-modal__footer">
				<span className="kb-site-styles-modal__footer-note">
					{__('Changes apply right away. Save the Site Editor to keep them, or undo them.', 'kadence-blocks')}
				</span>
				<Button variant="primary" onClick={closeSiteStyles}>
					{__('Done', 'kadence-blocks')}
				</Button>
			</div>
		</Modal>
	);
}
