/**
 * The Kadence panel's body: the block's own controls for a virtual block
 * backed by the Global Styles record, next to a preview.
 */
import { debounce, isEqual } from 'lodash';
import { select, useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useMemo, useRef, useState } from '@wordpress/element';
import { createBlock, getBlockType } from '@wordpress/blocks';
import { BlockEditorProvider, BlockList, InspectorControls } from '@wordpress/block-editor';
import { SlotFillProvider } from '@wordpress/components';
import { siteAttributes, toStoredForm, withStoredForm } from '../../site-styles/store';
import { useGlobalStylesEntity } from '../../site-styles/use-global-styles-record';
import { addVirtualBlock, removeVirtualBlock } from '../../site-styles/virtual-blocks';
import { SITE_STYLES_PANEL_SETTING } from '../../site-styles/use-is-site-styles-panel';
import SiteStylesPreview from './preview';

/**
 * @param {string} blockName Block name.
 * @return {Object} Attribute name => default value.
 */
function defaultAttributes(blockName) {
	const defaults = {};
	Object.entries(getBlockType(blockName)?.attributes || {}).forEach(([name, definition]) => {
		if (undefined !== definition.default) {
			defaults[name] = definition.default;
		}
	});

	return defaults;
}

/**
 * Selects the virtual block in the nested editor, so its controls show.
 *
 * @param {Object} props          Component props.
 * @param {string} props.clientId The virtual block's client ID.
 * @return {null} Nothing.
 */
function SelectVirtualBlock({ clientId }) {
	const { selectBlock } = useDispatch('core/block-editor');

	useEffect(() => {
		selectBlock(clientId);
	}, [clientId]);

	return null;
}

/**
 * @param {Object} props           Component props.
 * @param {string} props.blockName Block name.
 * @return {Element} The panel body.
 */
export default function SiteStylesPanel({ blockName }) {
	const { id, record } = useGlobalStylesEntity();
	const { editEntityRecord } = useDispatch('core');
	const parentSettings = useSelect((select) => select('core/block-editor').getSettings(), []);
	// The Site Editor's browse mode runs the editor in preview mode, which hides the block's controls.
	const settings = useMemo(
		() => ({ ...parentSettings, isPreviewMode: false, [SITE_STYLES_PANEL_SETTING]: true }),
		[parentSettings]
	);
	const site = useMemo(() => siteAttributes(record, blockName), [record, blockName]);
	const blockRef = useRef(null);
	const [blocks, setBlocks] = useState(null);

	// Create the virtual block once the record is loaded; re-derive it with the
	// same client ID when the record changes (Undo, core's Styles screen), so the
	// controls don't remount.
	useEffect(() => {
		if (!record) {
			return;
		}

		const attributes = { ...defaultAttributes(blockName), ...site };

		if (!blockRef.current) {
			blockRef.current = createBlock(blockName, attributes);
			addVirtualBlock(blockRef.current.clientId);
		} else if (
			!isEqual(blockRef.current.attributes, { ...attributes, uniqueID: blockRef.current.attributes.uniqueID })
		) {
			blockRef.current = {
				...blockRef.current,
				attributes: { ...attributes, uniqueID: blockRef.current.attributes.uniqueID },
			};
		} else {
			return;
		}

		setBlocks([blockRef.current]);
	}, [record, site, blockName]);

	useEffect(
		() => () => {
			if (blockRef.current) {
				removeVirtualBlock(blockRef.current.clientId);
			}
		},
		[]
	);

	// Writing the record re-renders every overlaid block on the canvas, which is
	// too slow for each step of a drag with many blocks on the page. The panel's
	// controls and preview follow the local block right away; the record gets
	// the latest value once changes pause, and on close.
	const writeRecord = useMemo(
		() =>
			debounce((attributes) => {
				const latest = select('core').getEditedEntityRecord('root', 'globalStyles', id);
				const definitions = getBlockType(blockName).attributes;
				const stored = toStoredForm(attributes, definitions, blockName);
				const current = toStoredForm(
					{ ...defaultAttributes(blockName), ...siteAttributes(latest, blockName) },
					definitions,
					blockName
				);

				if (!isEqual(stored, current)) {
					editEntityRecord('root', 'globalStyles', id, withStoredForm(latest, blockName, stored));
				}
			}, 150),
		[id, blockName, editEntityRecord]
	);

	useEffect(() => () => writeRecord.flush(), [writeRecord]);

	const onChange = (next) => {
		blockRef.current = next[0];
		setBlocks(next);
		writeRecord(next[0].attributes);
	};

	if (!blocks) {
		return null;
	}

	return (
		<SlotFillProvider>
			<BlockEditorProvider value={blocks} onInput={onChange} onChange={onChange} settings={settings}>
				<SelectVirtualBlock clientId={blocks[0].clientId} />
				{/* Mounts the block's edit component, which fills the controls slot. */}
				<div hidden>
					<BlockList />
				</div>
				<div className="kb-site-styles-modal__body">
					<SiteStylesPreview blockName={blockName} attributes={blocks[0].attributes} />
					<div className="kb-site-styles-modal__controls">
						<InspectorControls.Slot />
					</div>
				</div>
			</BlockEditorProvider>
		</SlotFillProvider>
	);
}
