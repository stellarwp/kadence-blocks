/**
 * BLOCK: Kadence Page Wizard
 */
/**
 * Import externals
 */
import {
	PopColorControl,
	KadencePanelBody,
	URLInputControl,
	ResponsiveRangeControls,
	InspectorControlTabs,
	RangeControl,
	KadenceRadioButtons,
	KadenceInspectorControls,
	KadenceBlockDefaults,
	KadenceIconPicker,
	CopyPasteAttributes,
} from '@kadence/components';
import {
	KadenceColorOutput,
	setBlockDefaults,
	getUniqueId,
	getInQueryBlock,
	getPostOrFseId,
	getPreviewSize,
	SafeParseJSON,
} from '@kadence/helpers';

import {
	AlignmentToolbar,
	InspectorControls,
	BlockControls,
	useBlockProps,
	InnerBlocks,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect, useDispatch, withDispatch, withSelect } from '@wordpress/data';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';

import { useEffect, useState, useRef } from '@wordpress/element';
import {
	TextControl,
	TextareaControl,
	Dropdown,
	Modal,
	Button,
	SelectControl,
	ToggleControl,
	ToolbarGroup,
} from '@wordpress/components';
import { KadencePageWizardAiProvider } from './context-provider';
import { useDatabase } from './database';

function KadencePageWizard(props) {
	const { attributes, className, setAttributes, clientId, onDelete, isSelected, name, context } = props;

	const [open, setOpen] = useState(false);
	const [wizardData, setWizardData] = useState({});
	const { getAiWizardData } = useDatabase();
	async function getPreviousData() {
		const response = SafeParseJSON(await getAiWizardData());
		wizardData.wizardData = response;
		console.log('wizardData', wizardData);
		setWizardData(wizardData);
	}

	useEffect(() => {
		// Get previously-saved data for modal.
		getPreviousData();
	}, []);

	const blockProps = useBlockProps({
		className,
	});
	return (
		<div {...blockProps}>
			<KadencePageWizardAiProvider value={wizardData}>
				<Button className="kb-wizard-launch" onClick={() => setOpen(true)}>
					{__('AI Page Wizard', 'kadence-blocks')}
				</Button>
				{open && (
					<Modal
						className="kb-wizard-modal"
						title={__('AI Page Wizard', 'kadence-blocks')}
						onRequestClose={(event) => {
							// No action on blur event (prevents AI modal from closing when Media Library modal opens).
							if (event?.type && event.type === 'blur') {
								return;
							}

							setOpen(false);
						}}
					></Modal>
				)}
			</KadencePageWizardAiProvider>
		</div>
	);
}

const KadencePageWizardWrapper = withDispatch((dispatch, ownProps, registry) => ({
	onDelete() {
		const { clientId } = ownProps;
		const { removeBlock } = dispatch(blockEditorStore);
		removeBlock(clientId, true);
	},
}))(KadencePageWizard);
const KadencePageWizardEdit = (props) => {
	return <KadencePageWizardWrapper {...props} />;
};
export default KadencePageWizardEdit;
