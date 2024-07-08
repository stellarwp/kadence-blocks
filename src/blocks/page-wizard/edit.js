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
	Spinner,
	Button,
	SelectControl,
	ToggleControl,
	ToolbarGroup,
} from '@wordpress/components';
import { KadencePageWizardAiProvider } from './context-provider';
import { AboutYourPage } from './pages';
import { KadencePageAiWizard } from './wizard';
import { useDatabase } from './database';
import { KadenceK } from './components/icons';
const pages = [
	{
		id: 'about-your-site',
		content: <AboutYourPage />,
		step: 'page-info',
		required: ['pageTitle', 'pageDescription'],
	},
];

function KadencePageWizard(props) {
	const { attributes, className, setAttributes, clientId, onDelete, isSelected, importContent, name, context } =
		props;
	const [wizardData, setWizardData] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [isImporting, setIsImporting] = useState(false);
	const { getAiWizardData } = useDatabase();
	async function getPreviousData() {
		const response = SafeParseJSON(await getAiWizardData());
		wizardData.wizardData = response;
		console.log('wizardData', wizardData);
		setWizardData(wizardData);
		setIsLoading(false);
	}

	useEffect(() => {
		// Get previously-saved data for modal.
		getPreviousData();
	}, []);

	const blockProps = useBlockProps({
		className,
	});
	async function processImportContent(blockCode) {
		const response = await processPattern(blockCode, imageCollection);
		if (response === 'failed') {
			console.log('Import Process Failed when processing data through rest api.');
		} else {
			importContent(response, clientId);
			setIsImporting(false);
		}
	}
	async function onClose() {
		onDelete();
	}
	if (isLoading) {
		return (
			<div {...blockProps}>
				<Spinner></Spinner>
			</div>
		);
	}
	return (
		<div {...blockProps}>
			<KadencePageWizardAiProvider value={wizardData}>
				<KadencePageAiWizard
					logo={<KadenceK />}
					pages={pages}
					onClose={onClose}
					onPrimaryClick={processImportContent}
					primaryButtonText={__('Import Content', 'kadence-blocks')}
				/>
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
	importContent(blockcode) {
		const { clientId } = ownProps;
		const { replaceBlocks } = dispatch(blockEditorStore);
		replaceBlocks(
			clientId,
			rawHandler({
				HTML: blockcode,
				mode: 'BLOCKS',
				canUserUseUnfilteredHTML,
			})
		);
	},
}))(KadencePageWizard);
const KadencePageWizardEdit = (props) => {
	return <KadencePageWizardWrapper {...props} />;
};
export default KadencePageWizardEdit;
