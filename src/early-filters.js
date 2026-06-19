/**
 * Early Gutenberg Blocks Filters
 *
 */
import { addFilter } from '@wordpress/hooks';
import { hasBlockSupport, getBlockSupport, createBlock } from '@wordpress/blocks';
import { assign, get } from 'lodash';
import { Button, Modal, PanelBody } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { blockExists } from '@kadence/helpers';
import { createHigherOrderComponent } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useDispatch, select } from '@wordpress/data';
import { VariantPicker, blockGroups } from './extension/variant-picker';

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
 * Opt native (non-Kadence) blocks into the design-token variant system by granting them `kbVariant`
 * support, so the shared attribute, save/preview class filters and picker treat them like any opted-in
 * Kadence block. The color variant is therefore an additive `kb-variant--<slug>` class (not a
 * register_block_style() block style), so it composes with WordPress's own single-select block styles
 * (e.g. the built-in "Outline") instead of replacing one with the other.
 *
 * Registered before {@link blockVariantAttribute} so the support is present when the attribute is added.
 *
 * @param {Object} settings The block settings.
 * @param {string} name     The block name.
 *
 * @since TBD
 *
 * @return {Object} The block settings, with kbVariant support added for supported native blocks.
 */
export function enableNativeBlockVariants(settings, name) {
	if (name === 'core/button') {
		settings.supports = assign({}, settings.supports, { kbVariant: true });
	}

	return settings;
}
addFilter('blocks.registerBlockType', 'kadence/kb-variant-native-support', enableNativeBlockVariants);

/**
 * Add the kbVariant / kbVariants attributes to any block that opts in via the `kbVariant` block support.
 *
 * `kbVariant` holds the slug of the selected variant for a flat (single-axis) block (e.g. "ghost").
 * `kbVariants` is the per-group map for a multi-axis block (e.g. { color: "secondary", emphasis: "outline" }):
 * one selection per group, composing into one class per group. A block uses one or the other depending on
 * whether its catalog entry is grouped; empty in either case keeps the block's $default look (the block
 * preset). The scoped CSS that re-skins the block for a selected variant is emitted server-side by the
 * Design Tokens variant projector.
 *
 * @param {Object} settings The block settings.
 *
 * @since TBD
 *
 * @return {Object} The block settings with the kbVariant / kbVariants attributes added.
 */
export function blockVariantAttribute(settings) {
	if (hasBlockSupport(settings, 'kbVariant')) {
		settings.attributes = assign(settings.attributes, {
			kbVariant: {
				type: 'string',
				default: '',
			},
			kbVariants: {
				type: 'object',
				default: {},
			},
		});
	}

	return settings;
}
addFilter('blocks.registerBlockType', 'kadence/kb-variant-attribute', blockVariantAttribute);

/**
 * Sanitize one slug segment to the projector's PHP `Sanitizes_Css_Identifier` charset, so a class always
 * matches the scoped selector the projector emits even if a slug carries an unexpected character.
 *
 * @param {string} segment The raw slug segment.
 *
 * @since TBD
 *
 * @return {string} The sanitized segment.
 */
function sanitizeVariantSegment(segment) {
	return (segment || '').replace(/[^A-Za-z0-9_-]+/g, '-');
}

/**
 * The class a flat block's selected variant outputs, or an empty string when none is selected. Mirrors the
 * projector's PHP `Style::variant_class()`.
 *
 * @param {string} kbVariant The selected variant slug.
 *
 * @since TBD
 *
 * @return {string} The `kb-variant--<slug>` class, or an empty string.
 */
function kbVariantClassName(kbVariant) {
	const slug = sanitizeVariantSegment(kbVariant);

	return slug ? `kb-variant--${slug}` : '';
}

/**
 * The classes a grouped block's per-group selections output: one `kb-variant--<group>--<slug>` per group
 * with a non-empty selection. Mirrors the projector's PHP `Style::group_variant_class()`; each segment is
 * sanitized independently so the group and variant slugs cannot merge across the "--" delimiter.
 *
 * @param {Object} kbVariants The kbVariants map (group slug => selected variant slug).
 *
 * @since TBD
 *
 * @return {string} The space-joined classes, or an empty string.
 */
function kbVariantsClassNames(kbVariants) {
	if (!kbVariants || typeof kbVariants !== 'object') {
		return '';
	}

	return Object.keys(kbVariants)
		.map((group) => {
			const groupSlug = sanitizeVariantSegment(group);
			const variantSlug = sanitizeVariantSegment(kbVariants[group]);

			return groupSlug && variantSlug ? `kb-variant--${groupSlug}--${variantSlug}` : '';
		})
		.filter(Boolean)
		.join(' ');
}

/**
 * The full set of variant classes for a block's attributes: the flat `kbVariant` class and every grouped
 * `kbVariants` class. A block uses one attribute or the other, so the empty one contributes nothing.
 *
 * @param {Object} attributes The block attributes.
 *
 * @since TBD
 *
 * @return {string} The space-joined variant classes, or an empty string.
 */
function variantClassNames(attributes) {
	return [
		kbVariantClassName(get(attributes, 'kbVariant', '')),
		kbVariantsClassNames(get(attributes, 'kbVariants', {})),
	]
		.filter(Boolean)
		.join(' ');
}

/**
 * Append the kb-variant-- classes to a block's saved markup, so the projector's scoped overrides apply on
 * the front end. A no-op for blocks that do not opt in or have no variant selected.
 *
 * @param {Object} props      The save element props.
 * @param {Object} blockType  The block type.
 * @param {Object} attributes The block attributes.
 *
 * @since TBD
 *
 * @return {Object} The props, with the variant classes appended when a variant is selected.
 */
export function blockVariantSaveClass(props, blockType, attributes) {
	if (!hasBlockSupport(blockType, 'kbVariant')) {
		return props;
	}

	const variantClass = variantClassNames(attributes);

	if (variantClass) {
		props.className = props.className ? `${props.className} ${variantClass}` : variantClass;
	}

	return props;
}
addFilter('blocks.getSaveContent.extraProps', 'kadence/kb-variant-save-class', blockVariantSaveClass);

/**
 * Mirror the kb-variant-- classes onto the block in the editor canvas, so a selected variant previews live
 * with the same scoped overrides the front end uses.
 *
 * @since TBD
 */
const withBlockVariantClass = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { name, attributes } = props;

		if (!hasBlockSupport(name, 'kbVariant')) {
			return <BlockListBlock {...props} />;
		}

		const variantClass = variantClassNames(attributes);

		if (!variantClass) {
			return <BlockListBlock {...props} />;
		}

		const className = props.className ? `${props.className} ${variantClass}` : variantClass;

		return <BlockListBlock {...props} className={className} />;
	};
}, 'withBlockVariantClass');
addFilter('editor.BlockListBlock', 'kadence/kb-variant-class', withBlockVariantClass);

/**
 * Add a "Design Variant" picker to the inspector of any block that opts into kbVariant support and has
 * variants defined in the design-token document. A flat block renders one single-select control writing the
 * kbVariant attribute; a grouped (multi-axis) block renders one control per group, each writing its slot in
 * the kbVariants map. The save/preview filters turn either into the kb-variant-- classes the projector's
 * scoped CSS hooks; an empty value selects that axis's $default preset look.
 *
 * A block whose `kbVariant` support requests `inlinePicker` renders the picker itself (e.g. a Kadence
 * block placing it under its own Style tab), so this generic sidebar panel skips it to avoid a duplicate.
 *
 * @since TBD
 */
const withVariantPicker = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { name, attributes, setAttributes, isSelected } = props;

		if (!hasBlockSupport(name, 'kbVariant')) {
			return <BlockEdit {...props} />;
		}

		const support = getBlockSupport(name, 'kbVariant');

		if (support && typeof support === 'object' && support.inlinePicker) {
			return <BlockEdit {...props} />;
		}

		if (!blockGroups(name).length) {
			return <BlockEdit {...props} />;
		}

		return (
			<>
				<BlockEdit {...props} />
				{isSelected && (
					<InspectorControls group="styles">
						<PanelBody title={__('Design Variant', 'kadence-blocks')} initialOpen={false}>
							<VariantPicker name={name} attributes={attributes} setAttributes={setAttributes} />
						</PanelBody>
					</InspectorControls>
				)}
			</>
		);
	};
}, 'withVariantPicker');
addFilter('editor.BlockEdit', 'kadence/kb-variant-picker', withVariantPicker);

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
