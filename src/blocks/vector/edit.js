/**
 * BLOCK: Kadence Vector
 */

/**
 * Import Css
 */
import './editor.scss';
import metadata from './block.json';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { useBlockProps, BlockControls } from '@wordpress/block-editor';
const { rest_url } = kadence_blocks_params;
import { has } from 'lodash';

const { apiFetch } = wp;
import { TextareaControl, Modal, Button, Notice, TextControl, Spinner } from '@wordpress/components';

/**
 * Internal dependencies
 */
import classnames from 'classnames';
import {
	KadenceSelectPosts,
	KadencePanelBody,
	InspectorControlTabs,
	KadenceInspectorControls,
	ResponsiveMeasureRangeControl,
	CopyPasteAttributes,
	ResponsiveRangeControls,
} from '@kadence/components';
import { setBlockDefaults, mouseOverVisualizer, getUniqueId, getPostOrFseId } from '@kadence/helpers';
import BackendStyles from './backend-styles';

const defaultSVG =
	'<svg height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 496.016 496.016" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path style="fill:#1C769B;" d="M0.008,248c0,98.16,57.04,183,139.768,223.184L21.472,147.072C7.728,177.904,0.008,212.04,0.008,248 z"></path> <path style="fill:#1C769B;" d="M252.36,269.688l-74.416,216.224c22.232,6.536,45.712,10.104,70.064,10.104 c28.872,0,56.576-4.992,82.352-14.056c-0.656-1.072-1.272-2.184-1.768-3.416L252.36,269.688z"></path> <path style="fill:#1C769B;" d="M415.432,235.496c0-30.664-11.024-51.88-20.448-68.392c-12.584-20.456-24.376-37.752-24.376-58.168 c0-22.808,17.288-44.032,41.648-44.032c1.104,0,2.144,0.152,3.2,0.208C371.368,24.68,312.568,0,248.008,0 c-86.656,0-162.864,44.456-207.2,111.776c5.824,0.184,11.304,0.304,15.952,0.304c25.928,0,66.104-3.152,66.104-3.152 c13.36-0.8,14.928,18.856,1.568,20.424c0,0-13.432,1.584-28.384,2.376l90.312,268.616l54.28-162.768l-38.616-105.848 c-13.376-0.792-26.032-2.376-26.032-2.376c-13.36-0.792-11.8-21.216,1.584-20.424c0,0,40.952,3.152,65.32,3.152 c25.936,0,66.096-3.152,66.096-3.152c13.376-0.8,14.944,18.856,1.576,20.424c0,0-13.448,1.584-28.376,2.376l89.624,266.576 l24.76-82.648C407.256,281.336,415.432,256.712,415.432,235.496z"></path> <path style="fill:#1C769B;" d="M467.312,154.52c0,25.16-4.704,53.448-18.872,88.832l-75.744,219 c73.728-42.976,123.312-122.864,123.312-214.344c0-43.128-11.016-83.664-30.376-118.992 C466.712,136.92,467.312,145.384,467.312,154.52z"></path> </g> <path style="fill:#2795B7;" d="M370.616,108.928c0-22.808,17.288-44.032,41.648-44.032c1.104,0,2.144,0.152,3.2,0.208 C371.368,24.68,312.568,0,248.008,0c-86.656,0-162.864,44.456-207.2,111.776c5.824,0.184,11.304,0.304,15.952,0.304 c25.928,0,66.104-3.152,66.104-3.152c13.36-0.8,14.928,18.856,1.568,20.424c0,0-13.432,1.584-28.384,2.376l34.44,102.432 c23.432,8.272,48.816,12.824,75.328,12.824c11.032,0,21.872-0.792,32.472-2.304l2.36-7.096l-38.616-105.848 C188.656,130.944,176,129.36,176,129.36c-13.36-0.792-11.8-21.216,1.584-20.424c0,0,40.952,3.152,65.32,3.152 c25.936,0,66.096-3.152,66.096-3.152c13.376-0.8,14.944,18.856,1.576,20.424c0,0-13.448,1.584-28.376,2.376l29.84,88.768 c30.288-16.288,55.952-39.288,74.664-66.88C377.688,138.656,370.616,124.72,370.616,108.928z"></path> <path style="fill:#3FB5D1;" d="M248.008,0c-77.816,0-147.128,35.92-192.6,91.984c39.912,8.296,83.744,12.896,129.744,12.896 c87.104,0,166.464-16.456,226.136-43.448C367.672,23.216,310.56,0,248.008,0z"></path> </g></svg>';

export function Edit(props) {
	const { attributes, setAttributes, className, clientId } = props;

	const {
		uniqueID,
		align,
		maxWidth,
		maxWidthUnit,
		tabletPadding,
		padding,
		mobilePadding,
		paddingUnit,
		tabletMargin,
		margin,
		mobileMargin,
		marginUnit,
		id,
	} = attributes;

	const { previewDevice } = useSelect((select) => {
		return {
			previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
		};
	}, []);

	const [rerenderKey, setRerenderKey] = useState('static');
	const [vectorCacheKey, setVectorCacheKey] = useState(Math.random());
	const [svgContent, setSvgContent] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const paddingMouseOver = mouseOverVisualizer();
	const marginMouseOver = mouseOverVisualizer();

	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { isUniqueID, isUniqueBlock, parentData } = useSelect(
		(select) => {
			return {
				isUniqueID: (value) => select('kadenceblocks/data').isUniqueID(value),
				isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
				parentData: {
					rootBlock: select('core/block-editor').getBlock(
						select('core/block-editor').getBlockHierarchyRootClientId(clientId)
					),
					postId: select('core/editor')?.getCurrentPostId() ? select('core/editor')?.getCurrentPostId() : '',
					reusableParent: select('core/block-editor').getBlockAttributes(
						select('core/block-editor').getBlockParentsByBlockName(clientId, 'core/block').slice(-1)[0]
					),
					editedPostId: select('core/edit-site') ? select('core/edit-site').getEditedPostId() : false,
				},
			};
		},
		[clientId]
	);

	const [activeTab, setActiveTab] = useState('general');
	const [isOpen, setOpen] = useState(false);
	const [vectorError, setVectorError] = useState(false);
	const [title, setTitle] = useState('');

	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

	const nonTransAttrs = ['id'];

	const blockProps = useBlockProps({
		className: classnames({
			[`kb-vector-${uniqueID}`]: uniqueID,
			[`align${align}`]: align,
		}),
	});

	useEffect(() => {
		setBlockDefaults('kadence/vector', attributes);

		const postOrFseId = getPostOrFseId(props, parentData);
		const uniqueId = getUniqueId(uniqueID, clientId, isUniqueID, isUniqueBlock, postOrFseId);
		if (uniqueId !== uniqueID) {
			attributes.uniqueID = uniqueId;
			setAttributes({ uniqueID: uniqueId });
			addUniqueID(uniqueId, clientId);
		} else {
			addUniqueID(uniqueID, clientId);
		}
	}, []);

	// Fetch SVG content when ID changes
	useEffect(() => {
		if (id && id > 0) {
			setIsLoading(true);
			apiFetch({
				path: `/wp/v2/kadence_vector/${id}`,
				method: 'GET',
			})
				.then((response) => {
					if (response && response.content && response.content.rendered) {
						let cleanedSvg = response.content.rendered;
						cleanedSvg = cleanedSvg.replace(/<p>|<\/p>|<br\s*\/?>/gi, '');
						setSvgContent(cleanedSvg);
					}
					setIsLoading(false);
				})
				.catch((error) => {
					console.error('Error fetching SVG content:', error);
					setIsLoading(false);
				});
		}
	}, [id, rerenderKey]);

	const handleSave = () => {
		if (!title) {
			setVectorError(__('Please enter a title for your vector', 'kadence-blocks'));
			return;
		}

		if (!svgContent || !svgContent.includes('<svg')) {
			setVectorError(__('Please enter valid SVG code', 'kadence-blocks'));
			return;
		}

		apiFetch({
			path: '/kb-vector/v1/vectors',
			data: { vectorSVG: svgContent, title },
			method: 'POST',
		}).then((response) => {
			if (has(response, 'value') && has(response, 'label')) {
				setAttributes({ id: response.value });
				setRerenderKey(Math.random());
				setVectorCacheKey(Math.random());
				closeModal();
			} else if (has(response, 'error') && has(response, 'message')) {
				setVectorError(response.message);
			} else {
				setVectorError(__('An error occurred when saving your SVG', 'kadence-blocks'));
			}
		});
	};

	const containerClasses = classnames({
		'kb-vector-container': true,
		[`kb-vector-container${uniqueID}`]: true,
	});

	return (
		<div {...blockProps}>
			<BlockControls>
				<CopyPasteAttributes
					attributes={attributes}
					excludedAttrs={nonTransAttrs}
					defaultAttributes={metadata.attributes}
					blockSlug={metadata.name}
					onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
				/>
			</BlockControls>
			<KadenceInspectorControls blockSlug={'vector'}>
				<InspectorControlTabs
					panelName={'vector'}
					setActiveTab={setActiveTab}
					activeTab={activeTab}
					allowedTabs={['general', 'advanced', 'transform']}
				/>

				{activeTab === 'general' && (
					<>
						<KadencePanelBody initialOpen={true} panelName={'kb-vector-settings'}>
							<h3>{__('Select Vector Graphic', 'kadence-blocks')}</h3>

							<KadenceSelectPosts
								placeholder={__('Select Vector Graphic', 'kadence-blocks')}
								restBase={'wp/v2/kadence_vector'}
								key={`vector-select-${vectorCacheKey}`}
								fieldId={'vector-select-src'}
								value={id}
								onChange={(value) => {
									setAttributes({ id: value.value });
									setRerenderKey(Math.random());
								}}
							/>

							<Button variant="secondary" onClick={openModal} className="kb-vector-add-new">
								{__('Add New Vector Graphic', 'kadence-blocks')}
							</Button>
							{isOpen && (
								<Modal
									title={__('Add New', 'kadence-blocks')}
									onRequestClose={closeModal}
									shouldCloseOnClickOutside={false}
								>
									<div className="kb-vector-upload">
										{vectorError && <Notice status="error">{vectorError}</Notice>}

										<TextControl
											label={__('Title', 'kadence-blocks')}
											value={title}
											onChange={(value) => setTitle(value)}
										/>

										<TextareaControl
											label={__('Code', 'kadence-blocks')}
											help={__('Paste your vector graphic here', 'kadence-blocks')}
											value={svgContent}
											onChange={(value) => setSvgContent(value)}
											rows={6}
										/>

										<div className="kb-vector-upload-actions">
											<Button variant="primary" onClick={handleSave}>
												{__('Save', 'kadence-blocks')}
											</Button>
											<Button variant="secondary" onClick={closeModal}>
												{__('Cancel', 'kadence-blocks')}
											</Button>
										</div>
									</div>
								</Modal>
							)}
						</KadencePanelBody>

						<KadencePanelBody
							title={__('Width Settings', 'kadence-blocks')}
							initialOpen={true}
							panelName={'kb-vector-width-settings'}
						>
							<ResponsiveRangeControls
								label={__('Max Width', 'kadence-blocks')}
								value={maxWidth ? maxWidth[0] : ''}
								onChange={(value) => {
									const newMaxWidth = [...(maxWidth || ['', '', ''])];
									newMaxWidth[0] = value;
									setAttributes({ maxWidth: newMaxWidth });
								}}
								tabletValue={maxWidth ? maxWidth[1] : ''}
								onChangeTablet={(value) => {
									const newMaxWidth = [...(maxWidth || ['', '', ''])];
									newMaxWidth[1] = value;
									setAttributes({ maxWidth: newMaxWidth });
								}}
								mobileValue={maxWidth ? maxWidth[2] : ''}
								onChangeMobile={(value) => {
									const newMaxWidth = [...(maxWidth || ['', '', ''])];
									newMaxWidth[2] = value;
									setAttributes({ maxWidth: newMaxWidth });
								}}
								min={5}
								max={1500}
								step={1}
								unit={maxWidthUnit || 'px'}
								showUnit={true}
								units={['px']}
								onUnit={(value) => setAttributes({ maxWidthUnit: value })}
								reset={() =>
									setAttributes({
										maxWidth: ['', '', ''],
									})
								}
							/>
						</KadencePanelBody>
					</>
				)}

				{activeTab === 'advanced' && (
					<>
						<KadencePanelBody initialOpen={true} panelName={'kb-vector-spacing-settings'}>
							<ResponsiveMeasureRangeControl
								label={__('Padding', 'kadence-blocks')}
								value={undefined !== padding ? padding : ['', '', '', '']}
								tabletValue={undefined !== tabletPadding ? tabletPadding : ['', '', '', '']}
								mobileValue={undefined !== mobilePadding ? mobilePadding : ['', '', '', '']}
								onChange={(value) => setAttributes({ padding: value })}
								onChangeTablet={(value) => setAttributes({ tabletPadding: value })}
								onChangeMobile={(value) => setAttributes({ mobilePadding: value })}
								min={0}
								max={paddingUnit === 'em' || paddingUnit === 'rem' ? 24 : 999}
								step={paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1}
								unit={paddingUnit}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setAttributes({ paddingUnit: value })}
								onMouseOver={paddingMouseOver.onMouseOver}
								onMouseOut={paddingMouseOver.onMouseOut}
							/>
							<ResponsiveMeasureRangeControl
								label={__('Margin', 'kadence-blocks')}
								value={undefined !== margin ? margin : ['', '', '', '']}
								tabletValue={undefined !== tabletMargin ? tabletMargin : ['', '', '', '']}
								mobileValue={undefined !== mobileMargin ? mobileMargin : ['', '', '', '']}
								onChange={(value) => {
									setAttributes({ margin: value });
								}}
								onChangeTablet={(value) => {
									setAttributes({ tabletMargin: value });
								}}
								onChangeMobile={(value) => {
									setAttributes({ mobileMargin: value });
								}}
								min={marginUnit === 'em' || marginUnit === 'rem' ? -12 : -999}
								max={marginUnit === 'em' || marginUnit === 'rem' ? 24 : 999}
								step={marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1}
								unit={marginUnit}
								units={['px', 'em', 'rem', '%', 'vh']}
								onUnit={(value) => setAttributes({ marginUnit: value })}
								onMouseOver={marginMouseOver.onMouseOver}
								onMouseOut={marginMouseOver.onMouseOut}
								allowNegativeMarin={true}
							/>
						</KadencePanelBody>
					</>
				)}
			</KadenceInspectorControls>
			{isLoading && (
				<div className={containerClasses}>
					<Spinner />
				</div>
			)}
			{!isLoading && (
				<div className={containerClasses} dangerouslySetInnerHTML={{ __html: id ? svgContent : defaultSVG }} />
			)}
			<BackendStyles {...props} previewDevice={previewDevice} />
		</div>
	);
}

export default Edit;
