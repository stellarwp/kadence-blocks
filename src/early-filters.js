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
import { PresetPicker, blockPresets, activeLibrary } from './extension/preset-picker';
import { PresetActions } from './extension/preset-picker/PresetActions';
import { TokenSetPicker, selectableSets } from './extension/token-set-picker';
import { registerTokenAliasFilters } from './extension/design-tokens/register-filters';
import { registerComponentTokenFilters } from './extension/design-tokens/register-component-filters';

// Make the @kadence/helpers output helpers design-token aware by resolving `{dot.alias}` values to
// their `var(--kb-token--<id>)` reference through the library's filter seam.
registerTokenAliasFilters();

// Inject the design-token picker UI into the token-agnostic @kadence/components control seams, so a
// control that receives a `context` gets the chip/picker without the package knowing about tokens.
registerComponentTokenFilters();

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
 * Add the kbPreset and kbTokenSet attributes to any block that opts in via the `kbPreset` block support.
 *
 * kbPreset is the selected preset slug (e.g. "ghost"); an empty value means the block keeps its $default
 * look (the block preset). kbTokenSet holds the slug of a per-block token-set override (e.g. "dark"); empty
 * means the block follows the active set. The scoped CSS that re-skins the block for a selected preset and
 * the switch selectors a set override re-points through are both emitted server-side by the Design Tokens
 * projector.
 *
 * @param {Object} settings The block settings.
 *
 * @since TBD
 *
 * @return {Object} The block settings with the kbPreset and kbTokenSet attributes added.
 */
export function blockPresetAttribute(settings) {
	if (hasBlockSupport(settings, 'kbPreset')) {
		settings.attributes = assign(settings.attributes, {
			kbPreset: {
				type: 'string',
				default: '',
			},
			kbTokenSet: {
				type: 'string',
				default: '',
			},
		});
	}

	return settings;
}
addFilter('blocks.registerBlockType', 'kadence/kb-preset-attribute', blockPresetAttribute);

/**
 * Override a block's registered attribute defaults with the resolved design-token value, read
 * from window.kadenceDesignTokensAttributeDefaults (Editor\Localizer, Editor\Attribute_Default_Catalog).
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
	const catalog = window.kadenceDesignTokensAttributeDefaults;
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
 * The class a block's selected preset outputs: `kb-preset--<slug>`. The slug is sanitized, mirroring the
 * projector's PHP Style::preset_class(). Empty when nothing is selected.
 *
 * @param {string} kbPreset The kbPreset attribute (the selected preset slug).
 *
 * @since TBD
 *
 * @return {string} The preset class, or an empty string.
 */
function kbPresetClassName(kbPreset) {
	const slug = sanitizeTokenIdentifier(typeof kbPreset === 'string' ? kbPreset : '');

	return slug ? `kb-preset--${slug}` : '';
}

/**
 * Append the kb-preset--<name> class to a block's saved markup, so the projector's scoped overrides
 * apply on the front end. A no-op for blocks that do not opt in or have no preset selected.
 *
 * @param {Object} props      The save element props.
 * @param {Object} blockType  The block type.
 * @param {Object} attributes The block attributes.
 *
 * @since TBD
 *
 * @return {Object} The props, with the preset class appended when one is selected.
 */
export function blockPresetSaveClass(props, blockType, attributes) {
	if (!hasBlockSupport(blockType, 'kbPreset')) {
		return props;
	}

	const presetClass = kbPresetClassName(get(attributes, 'kbPreset', ''));

	if (presetClass) {
		props.className = props.className ? `${props.className} ${presetClass}` : presetClass;
	}

	return props;
}
addFilter('blocks.getSaveContent.extraProps', 'kadence/kb-preset-save-class', blockPresetSaveClass);

/**
 * Append the data-kb-token-set="<slug>" attribute to a block's saved markup when it is pinned to a token
 * set, so the projector's `[data-kb-token-set]` switch selectors re-point the block's canonical token vars
 * at that set on the front end. A no-op for blocks that do not opt in or follow the active set.
 *
 * @param {Object} props      The save element props.
 * @param {Object} blockType  The block type.
 * @param {Object} attributes The block attributes.
 *
 * @since TBD
 *
 * @return {Object} The props, with the data attribute appended when a set is pinned.
 */
export function blockTokenSetSaveAttr(props, blockType, attributes) {
	if (!hasBlockSupport(blockType, 'kbPreset')) {
		return props;
	}

	const slug = sanitizeTokenIdentifier(get(attributes, 'kbTokenSet', ''));

	if (slug) {
		props['data-kb-token-set'] = slug;
	}

	return props;
}
addFilter('blocks.getSaveContent.extraProps', 'kadence/kb-token-set-save-attr', blockTokenSetSaveAttr);

/**
 * Mirror the kb-preset--<name> class onto the block in the editor canvas, so a selected preset previews
 * live with the same scoped overrides the front end uses.
 *
 * @since TBD
 */
const withBlockPresetClass = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { name, attributes } = props;

		if (!hasBlockSupport(name, 'kbPreset')) {
			return <BlockListBlock {...props} />;
		}

		const presetClass = kbPresetClassName(get(attributes, 'kbPreset', ''));

		if (!presetClass) {
			return <BlockListBlock {...props} />;
		}

		const className = props.className ? `${props.className} ${presetClass}` : presetClass;

		return <BlockListBlock {...props} className={className} />;
	};
}, 'withBlockPresetClass');
addFilter('editor.BlockListBlock', 'kadence/kb-preset-class', withBlockPresetClass);

/**
 * Mirror the data-kb-token-set="<slug>" attribute onto the block in the editor canvas, so a pinned set
 * previews live with the same switch-selector re-pointing the front end uses. Added via wrapperProps so it
 * lands on the same block wrapper the preset class and scoped rules target.
 *
 * @since TBD
 */
const withBlockTokenSetAttr = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		const { name, attributes } = props;

		if (!hasBlockSupport(name, 'kbPreset')) {
			return <BlockListBlock {...props} />;
		}

		const slug = sanitizeTokenIdentifier(get(attributes, 'kbTokenSet', ''));

		if (!slug) {
			return <BlockListBlock {...props} />;
		}

		const wrapperProps = { ...(props.wrapperProps || {}), 'data-kb-token-set': slug };

		return <BlockListBlock {...props} wrapperProps={wrapperProps} />;
	};
}, 'withBlockTokenSetAttr');
addFilter('editor.BlockListBlock', 'kadence/kb-token-set-attr', withBlockTokenSetAttr);

/**
 * Add the design-token pickers to the inspector of any block that opts into kbPreset support, under a
 * "Design Tokens" panel: a "Token Set" subsection (the per-block set override) above a "Design Presets"
 * subsection (the preset picker). Selecting a set writes the kbTokenSet attribute, which the save/preview
 * filters turn into the data-kb-token-set attribute the projector's switch selectors re-point through;
 * selecting a preset writes the kbPreset attribute, which the save/preview filters turn into the
 * kb-preset--<slug> class the projector's scoped CSS hooks. An empty set follows the
 * active set; an empty preset selects the block's $default preset look. Each subsection is shown only when
 * it has something to offer (two or more sets / any presets), and the panel is skipped when neither does.
 *
 * A block whose `kbPreset` support requests `inlinePicker` renders the pickers itself (e.g. a Kadence
 * block placing them under its own Style tab), so this generic sidebar panel skips it to avoid a duplicate.
 *
 * @since TBD
 */
const withPresetPicker = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { name, attributes, setAttributes, isSelected } = props;

		if (!hasBlockSupport(name, 'kbPreset')) {
			return <BlockEdit {...props} />;
		}

		const support = getBlockSupport(name, 'kbPreset');

		if (support && typeof support === 'object' && support.inlinePicker) {
			return <BlockEdit {...props} />;
		}

		const library = get(attributes, 'kbTokenSet', '') || activeLibrary();
		const hasPresets = blockPresets(name, library).length > 0;
		const hasSets = selectableSets().length >= 2;

		if (!hasPresets && !hasSets) {
			return <BlockEdit {...props} />;
		}

		const selected = get(attributes, 'kbPreset', '');
		const selectPreset = (value) => setAttributes({ kbPreset: value });

		return (
			<>
				<BlockEdit {...props} />
				{isSelected && (
					<InspectorControls group="styles">
						<PanelBody title={__('Design Tokens', 'kadence-blocks')} initialOpen={false}>
							{hasSets && (
								<SubsectionWrap label={__('Token Set', 'kadence-blocks')}>
									<TokenSetPicker
										value={get(attributes, 'kbTokenSet', '')}
										onChange={(value) => setAttributes({ kbTokenSet: value })}
										label=""
									/>
								</SubsectionWrap>
							)}
							{hasPresets && (
								<SubsectionWrap label={__('Design Presets', 'kadence-blocks')}>
									<PresetPicker
										name={name}
										library={library}
										value={selected}
										onChange={selectPreset}
									/>
									<PresetActions
										blockName={name}
										library={library}
										selected={selected}
										onSelect={selectPreset}
										attributes={attributes}
										setAttributes={setAttributes}
									/>
								</SubsectionWrap>
							)}
						</PanelBody>
					</InspectorControls>
				)}
			</>
		);
	};
}, 'withPresetPicker');
addFilter('editor.BlockEdit', 'kadence/kb-preset-picker', withPresetPicker);

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
