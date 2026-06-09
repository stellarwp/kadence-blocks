/**
 * Early Gutenberg Blocks Filters
 *
 */
import { addFilter } from '@wordpress/hooks';
import { hasBlockSupport, getBlockSupport, createBlock } from '@wordpress/blocks';
import { assign, get } from 'lodash';
import { Button, Modal } from '@wordpress/components';
import { blockExists } from '@kadence/helpers';
import { createHigherOrderComponent } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useDispatch, select } from '@wordpress/data';

/**
 * Add animation attributes
 *
 * @param {Array} settings The block settings.
 * @return {Array} The block settings with animation added.
 */
export function blockMetadataAttribute(settings) {
	if (hasBlockSupport(settings, 'kbMetadata')) {
		settings.attributes = assign(settings.attributes, {
			metadata: {
				type: 'object',
				default: {
					name: '',
				},
			},
		});

		const contentLabel = getBlockSupport(settings, 'kbContentLabel');

		settings.__experimentalLabel = (attributes, { context }) => {
			const { metadata } = attributes;

			// In the list view, use the block's content as the label.
			// If the content is empty, fall back to the default label.
			if (context === 'list-view' && get(metadata, 'name', '') !== '') {
				return metadata.name;
			} else if (context === 'list-view' && undefined !== contentLabel && get(attributes, contentLabel) !== '') {
				// Accordion pane block is stored as an array, doing this instead of deprecation on parent accordion.
				if (get(settings, 'name') === 'kadence/pane' && get(attributes, contentLabel) instanceof Array) {
					return convertArrayTitleToString(get(attributes, contentLabel));
				}

				return get(attributes, contentLabel);
			}
		};
	}

	return settings;
}

function convertArrayTitleToString(arr) {
	let result = '';

	arr.forEach((item) => {
		if (typeof item === 'string') {
			result += item;
		} else if (item.props && item.props.children) {
			result += convertArrayTitleToString(item.props.children);
		}
	});

	return result;
}

addFilter('blocks.registerBlockType', 'kadence/block-label', blockMetadataAttribute);

/**
 * Add the kbVariant attribute to any block that opts in via the `kbVariant` block support.
 *
 * The attribute holds the slug of the selected design-token variant (e.g. "ghost"); empty means the
 * block keeps its $default look (the block preset). The scoped CSS that re-skins the block for a
 * selected variant is emitted server-side by the Design Tokens variant projector.
 *
 * @param {Object} settings The block settings.
 * @return {Object} The block settings with the kbVariant attribute added.
 */
export function blockVariantAttribute(settings) {
	if (hasBlockSupport(settings, 'kbVariant')) {
		settings.attributes = assign(settings.attributes, {
			kbVariant: {
				type: 'string',
				default: '',
			},
		});
	}

	return settings;
}
addFilter('blocks.registerBlockType', 'kadence/kb-variant-attribute', blockVariantAttribute);

/**
 * The class a selected variant outputs, or an empty string when none is selected.
 *
 * @param {string} kbVariant The selected variant slug.
 * @return {string} The `kb-variant--<slug>` class, or an empty string.
 */
function kbVariantClassName(kbVariant) {
	// Mirror the projector's PHP ident() sanitizer, so the output class always matches the scoped selector
	// the projector emits even if a slug carries an unexpected character.
	const slug = (kbVariant || '').replace(/[^A-Za-z0-9_-]+/g, '-');

	return slug ? `kb-variant--${slug}` : '';
}

/**
 * Append the kb-variant--<name> class to a block's saved markup, so the projector's scoped overrides
 * apply on the front end. A no-op for blocks that do not opt in or have no variant selected.
 *
 * @param {Object} props      The save element props.
 * @param {Object} blockType  The block type.
 * @param {Object} attributes The block attributes.
 * @return {Object} The props, with the variant class appended when one is selected.
 */
export function blockVariantSaveClass(props, blockType, attributes) {
	if (!hasBlockSupport(blockType, 'kbVariant')) {
		return props;
	}

	const variantClass = kbVariantClassName(get(attributes, 'kbVariant', ''));

	if (variantClass) {
		props.className = props.className ? `${props.className} ${variantClass}` : variantClass;
	}

	return props;
}
addFilter('blocks.getSaveContent.extraProps', 'kadence/kb-variant-save-class', blockVariantSaveClass);

/**
 * Mirror the kb-variant--<name> class onto the block in the editor canvas, so a selected variant previews
 * live with the same scoped overrides the front end uses.
 */
const withBlockVariantClass = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { name, attributes } = props;

		if (!hasBlockSupport(name, 'kbVariant')) {
			return <BlockListBlock {...props} />;
		}

		const variantClass = kbVariantClassName(get(attributes, 'kbVariant', ''));

		if (!variantClass) {
			return <BlockListBlock {...props} />;
		}

		const className = props.className ? `${props.className} ${variantClass}` : variantClass;

		return <BlockListBlock {...props} className={className} />;
	};
}, 'withBlockVariantClass');
addFilter('editor.BlockListBlock', 'kadence/kb-variant-class', withBlockVariantClass);

const kadenceHeaderTemplatePartNotice = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const isHeaderTemplate = select('core/editor').getEditedPostAttribute('area') === 'header';
		const blocks = select('core/block-editor').getBlocks();
		const firstBlock = get(blocks, ['0', 'clientId']);
		const [tmpHideNotice, setTmpHideNotice] = useState(false);

		const [isOpen, setOpen] = useState(false);
		const closeModal = () => setOpen(false);

		const showNotice = isHeaderTemplate && props.clientId === firstBlock && !blockExists(blocks, 'kadence/header');
		const { getEntityRecord } = select('core');
		const { saveEntityRecord } = useDispatch('core');
		const { removeBlocks, insertBlock } = useDispatch('core/block-editor');

		const siteSettings = getEntityRecord('root', 'site');
		const isNoticeDismissed = get(siteSettings, 'kadence_blocks_header_notice_dismissed', false);

		const deleteBlocksAndInsert = () => {
			removeBlocks(blocks.map((block) => block.clientId));
			insertBlock(createBlock('kadence/header', {}));
			saveEntityRecord('root', 'site', {
				kadence_blocks_header_notice_dismissed: true,
			});
			setTmpHideNotice(true);
			closeModal();
		};
		return (
			<>
				{isOpen && (
					<Modal title={__('Replace header', 'kadence-blocks')} onRequestClose={closeModal}>
						<p>{__('This will replace your header with a Kadence Header block.', 'kadence-blocks')}</p>
						<div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
							<Button isPrimary={true} onClick={deleteBlocksAndInsert}>
								{__('Replace', 'kadence-blocks')}
							</Button>
							<Button isSecondary={true} onClick={closeModal}>
								{__('Cancel', 'kadence-blocks')}
							</Button>
						</div>
					</Modal>
				)}
				{showNotice && !tmpHideNotice && !isNoticeDismissed && (
					<div
						style={{
							height: '30px',
							padding: '15px',
							backgroundColor: '#fef8ef',
							borderBottom: '1px solid rgb(155, 155, 155, 0.6)',
							borderLeft: '4px solid #f1b849',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: '5px',
						}}
					>
						{__('Try the Kadence Header block!', 'kadence-blocks')}
						<div>
							<Button
								isPrimary={true}
								style={{ marginRight: '15px' }}
								onClick={() => {
									setOpen(true);
								}}
							>
								{__('Replace with Kadence Header', 'kadence-blocks')}
							</Button>
							<Button
								isSecondary={true}
								onClick={() => {
									setTmpHideNotice(true);
									saveEntityRecord('root', 'site', {
										kadence_blocks_header_notice_dismissed: true,
									});
								}}
							>
								{__('Dismiss', 'kadence-blocks')}
							</Button>
						</div>
					</div>
				)}
				<BlockEdit {...props} />
			</>
		);
	};
}, 'withTemplatePartNotice');

if (!window.wpWidgets) {
	addFilter('editor.BlockEdit', 'kadence-blocks/with-template-part-notice', kadenceHeaderTemplatePartNotice);
}
