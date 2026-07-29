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
import { SubsectionWrap } from '@kadence/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useDispatch, select } from '@wordpress/data';
import { VariantPicker, blockVariants, activeSet } from './extension/variant-picker';
import { VariantActions } from './extension/variant-picker/VariantActions';
import { PalettePicker, selectablePalettes } from './extension/palette-picker';
import { registerTokenAliasFilters } from './extension/design-tokens/register-filters';
import { registerColorControlFilters } from './extension/design-tokens/register-color-control-filters';

// Make the @kadence/helpers output helpers design-token aware by resolving `{dot.alias}` values to
// their `var(--kb-token--<id>)` reference through the library's filter seam.
registerTokenAliasFilters();

// Keep token-backed global-palette colors visible in the shared Kadence color controls when the
// "Use only Custom Colors" override is on, through the color control's swatch filter seam.
registerColorControlFilters();

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
 * Add the kbVariant and kbPalette attributes to any block that opts in via the `kbVariant` block support.
 *
 * kbVariant is the selected variant slug (e.g. "ghost"); an empty value means the block keeps its $default
 * look (the block preset). kbPalette holds the id of a per-block color-palette override (e.g. "dark"); empty
 * means the block follows the set's `$current` palette. Both the scoped variant CSS and the palette switch
 * layer are emitted server-side by the Design Tokens projector.
 *
 * @param {Object} settings The block settings.
 *
 * @since TBD
 *
 * @return {Object} The block settings with the kbVariant and kbPalette attributes added.
 */
export function blockVariantAttribute(settings) {
	if (hasBlockSupport(settings, 'kbVariant')) {
		settings.attributes = assign(settings.attributes, {
			kbVariant: {
				type: 'string',
				default: '',
			},
			kbPalette: {
				type: 'string',
				default: '',
			},
		});
	}

	return settings;
}
addFilter('blocks.registerBlockType', 'kadence/kb-variant-attribute', blockVariantAttribute);

/**
 * Override a block's registered attribute defaults with the resolved design-token value, read
 * from window.kadenceDesignTokensPresetDefaults (Editor\Localizer, Editor\Block_Preset_Catalog).
 * So a freshly inserted block starts at the brand's token-resolved value instead of the block's
 * own hardcoded static default — without touching the attribute's type or the block's save
 * output for existing content (which already has an explicit stored value).
 *
 * @param {Object} settings The block settings.
 * @param {string} name     The block name.
 *
 * @since TBD
 *
 * @return {Object} The block settings, with any catalog-covered attribute defaults overridden.
 */
export function blockPresetAttributeDefault(settings, name) {
	const catalog = window.kadenceDesignTokensPresetDefaults;
	const entry = catalog && catalog[name];

	if (!entry) {
		return settings;
	}

	Object.keys(entry).forEach((attribute) => {
		if (settings.attributes && settings.attributes[attribute]) {
			settings.attributes[attribute] = assign({}, settings.attributes[attribute], {
				default: entry[attribute],
			});
		}
	});

	return settings;
}
addFilter('blocks.registerBlockType', 'kadence/preset-attribute-default', blockPresetAttributeDefault);

/**
 * Sanitize a design-token slug to the identifier form the projector emits.
 *
 * Mirrors the projector's PHP Css_Builder::sanitize_identifier() sanitizer, so a slug written to a class
 * or a data attribute always matches the scoped selector / switch selector the projector emits even if it
 * carries an unexpected character.
 *
 * @param {string} slug The raw slug.
 *
 * @since TBD
 *
 * @return {string} The sanitized slug.
 */
function sanitizeTokenIdentifier(slug) {
	return (slug || '').replace(/[^A-Za-z0-9_-]+/g, '-');
}

/**
 * The class a block's selected variant outputs: `kb-variant--<slug>`. The slug is sanitized, mirroring the
 * projector's PHP Style::variant_class(). Empty when nothing is selected.
 *
 * @param {string} kbVariant The kbVariant attribute (the selected variant slug).
 *
 * @since TBD
 *
 * @return {string} The variant class, or an empty string.
 */
function kbVariantClassName(kbVariant) {
	const slug = sanitizeTokenIdentifier(typeof kbVariant === 'string' ? kbVariant : '');

	return slug ? `kb-variant--${slug}` : '';
}

/**
 * Append the kb-variant--<name> class to a block's saved markup, so the projector's scoped overrides
 * apply on the front end. A no-op for blocks that do not opt in or have no variant selected.
 *
 * @param {Object} props      The save element props.
 * @param {Object} blockType  The block type.
 * @param {Object} attributes The block attributes.
 *
 * @since TBD
 *
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
 * Append the data-kb-palette="<id>" attribute to a block's saved markup when it carries a per-block palette
 * override, so the projector's `[data-kb-palette]` switch layer re-points the block's canonical color vars
 * to that palette on the front end. A no-op for blocks that do not opt in or follow the set `$current`.
 *
 * @param {Object} props      The save element props.
 * @param {Object} blockType  The block type.
 * @param {Object} attributes The block attributes.
 *
 * @since TBD
 *
 * @return {Object} The props, with the data attribute appended when a palette is pinned.
 */
export function blockPaletteSaveAttr(props, blockType, attributes) {
	if (!hasBlockSupport(blockType, 'kbVariant')) {
		return props;
	}

	const id = sanitizeTokenIdentifier(get(attributes, 'kbPalette', ''));

	if (id) {
		props['data-kb-palette'] = id;
	}

	return props;
}
addFilter('blocks.getSaveContent.extraProps', 'kadence/kb-palette-save-attr', blockPaletteSaveAttr);

/**
 * Mirror the kb-variant--<name> class onto the block in the editor canvas, so a selected variant previews
 * live with the same scoped overrides the front end uses.
 *
 * @since TBD
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

/**
 * Mirror the data-kb-palette="<id>" attribute onto the block in the editor canvas, so a per-block palette
 * override previews live with the same switch-layer re-pointing the front end uses. Added via wrapperProps
 * so it lands on the same block wrapper the projector's `[data-kb-palette]` selector targets.
 *
 * @since TBD
 */
const withBlockPaletteAttr = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { name, attributes } = props;

		if (!hasBlockSupport(name, 'kbVariant')) {
			return <BlockListBlock {...props} />;
		}

		const id = sanitizeTokenIdentifier(get(attributes, 'kbPalette', ''));

		if (!id) {
			return <BlockListBlock {...props} />;
		}

		const wrapperProps = { ...(props.wrapperProps || {}), 'data-kb-palette': id };

		return <BlockListBlock {...props} wrapperProps={wrapperProps} />;
	};
}, 'withBlockPaletteAttr');
addFilter('editor.BlockListBlock', 'kadence/kb-palette-attr', withBlockPaletteAttr);

/**
 * Add the design-token variant picker to the inspector of any block that opts into kbVariant support, under
 * a "Design Tokens" panel with a "Design Presets" subsection. Selecting a variant writes the kbVariant
 * attribute, which the save/preview filters turn into the kb-variant--<slug> class the projector's scoped
 * CSS hooks. An empty variant selects the block's $default preset look. The panel is skipped when the block
 * has no variants for the active set.
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
		// A block whose kbVariant support requests `inlinePicker` renders the VARIANT picker itself (e.g. a
		// Kadence block under its own Style tab), so this generic panel skips only the variant subsection for
		// it — the per-block Color Palette override still surfaces here for every kbVariant block.
		const inlinePicker = Boolean(support && typeof support === 'object' && support.inlinePicker);

		const set = activeSet();
		const showVariants = !inlinePicker && blockVariants(name, set).length > 0;
		const showPalettes = selectablePalettes().length >= 2;

		if (!showVariants && !showPalettes) {
			return <BlockEdit {...props} />;
		}

		const selected = get(attributes, 'kbVariant', '');
		const selectVariant = (value) => setAttributes({ kbVariant: value });
		const selectPalette = (value) => setAttributes({ kbPalette: value });

		return (
			<>
				<BlockEdit {...props} />
				{isSelected && (
					<InspectorControls group="styles">
						<PanelBody title={__('Design Tokens', 'kadence-blocks')} initialOpen={false}>
							{showVariants && (
								<SubsectionWrap label={__('Design Presets', 'kadence-blocks')}>
									<VariantPicker name={name} set={set} value={selected} onChange={selectVariant} />
									<VariantActions
										blockName={name}
										set={set}
										selected={selected}
										onSelect={selectVariant}
										attributes={attributes}
										setAttributes={setAttributes}
									/>
								</SubsectionWrap>
							)}
							{showPalettes && (
								<SubsectionWrap label={__('Color Palette', 'kadence-blocks')}>
									{/*
									 * TODO (SOFT-3990): this dropdown is an interim per-block palette override
									 * control. The design (see the B4 Figma) integrates the palette token picker
									 * into the block's color controls — a "Stylebook | Custom" popover with a
									 * Main Palette dropdown and swatch groups, opened from a palette icon on each
									 * Color row — which requires @kadence/components changes to the color-control
									 * popover and is deferred.
									 */}
									<PalettePicker value={get(attributes, 'kbPalette', '')} onChange={selectPalette} />
								</SubsectionWrap>
							)}
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
