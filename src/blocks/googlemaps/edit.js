/**
 * BLOCK: Kadence Google Maps
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
import { store as noticesStore } from '@wordpress/notices';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { useBlockProps, BlockControls } from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';
import { TextControl, TextareaControl, SelectControl, ToggleControl, Modal, Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import classnames from 'classnames';
import { isEmpty, has } from 'lodash';
import EditJsMap from './editJsMap';
import {
	ResponsiveAlignControls,
	ResponsiveRangeControls,
	RangeControl,
	InspectorControlTabs,
	KadencePanelBody,
	KadenceInspectorControls,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	SpacingVisualizer,
	CopyPasteAttributes,
	DynamicTextInputControl,
} from '@kadence/components';
import {
	getPreviewSize,
	showSettings,
	getSpacingOptionOutput,
	mouseOverVisualizer,
	setBlockDefaults,
	uniqueIdHelper,
} from '@kadence/helpers';

export function Edit(props) {
	const { attributes, setAttributes, className, clientId } = props;

	const {
		uniqueID,
		heightDesktop,
		heightTablet,
		heightMobile,
		widthDesktop,
		widthTablet,
		widthMobile,
		marginDesktop,
		marginTablet,
		marginMobile,
		marginUnit,
		paddingDesktop,
		paddingTablet,
		paddingMobile,
		paddingUnit,
		location,
		showMarker,
		mapStyle,
		customSnazzy,
		lat,
		lng,
		zoom,
		apiType,
		mapType,
		mapFilter,
		mapFilterAmount,
		sizeSlug,
		textAlign,
		kbVersion,
	} = attributes;

	const previewDevice = useSelect((select) => {
		return select('kadenceblocks/data').getPreviewDeviceType();
	}, []);
	const includedGoogleApiKey = 'AIzaSyBAM2o7PiQqwk15LC1XRH2e_KJ-jUa7KYk';

	const [customGoogleApiKey, setCustomGoogleApiKey] = useState('');

	const paddingMouseOver = mouseOverVisualizer();
	const marginMouseOver = mouseOverVisualizer();

	const googleApiKey = isEmpty(customGoogleApiKey) ? includedGoogleApiKey : customGoogleApiKey;

	/*
	 * Geocode friendly address into Lat/Lng
	 * Wait 0.5 seconds after last change to prevent unnecessary requests
	 * Also skip if using Embed API as we don't need Lat/Lng for that
	 */
	useEffect(() => {
		if (apiType === 'javascript' && !attributes?.kadenceDynamic?.location?.enable) {
			const timeOutId = setTimeout(() => locationChange(location), 600);
			return () => clearTimeout(timeOutId);
		}
	}, [location, apiType]);

	const locationChange = async (address) => {
		try {
			const geocoder = new window.google.maps.Geocoder();
			const response = await geocoder.geocode({ address });
			if (has(response.results, [0])) {
				setAttributes({
					lat: response.results[0].geometry.location.lat().toString(),
					lng: response.results[0].geometry.location.lng().toString(),
				});
			} else {
				createErrorNotice(__('Could not find location', 'kadence-blocks') + ': ' + address, {
					type: 'snackbar',
				});
			}
		} catch (error) {
			createErrorNotice(__('Could not find location', 'kadence-blocks') + ': ' + address, { type: 'snackbar' });
		}
	};

	const previewHeight = getPreviewSize(
		previewDevice,
		undefined !== heightDesktop ? heightDesktop : '450',
		undefined !== heightTablet ? heightTablet : '',
		undefined !== heightMobile ? heightMobile : ''
	);
	const previewWidth = getPreviewSize(
		previewDevice,
		undefined !== widthDesktop ? widthDesktop : '',
		undefined !== widthTablet ? widthTablet : '',
		undefined !== widthMobile ? widthMobile : ''
	);

	const previewMarginTop = getPreviewSize(
		previewDevice,
		undefined !== marginDesktop ? marginDesktop[0] : '',
		undefined !== marginTablet ? marginTablet[0] : '',
		undefined !== marginMobile ? marginMobile[0] : ''
	);
	const previewMarginRight = getPreviewSize(
		previewDevice,
		undefined !== marginDesktop ? marginDesktop[1] : '',
		undefined !== marginTablet ? marginTablet[1] : '',
		undefined !== marginMobile ? marginMobile[1] : ''
	);
	const previewMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== marginDesktop ? marginDesktop[2] : '',
		undefined !== marginTablet ? marginTablet[2] : '',
		undefined !== marginMobile ? marginMobile[2] : ''
	);
	const previewMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== marginDesktop ? marginDesktop[3] : '',
		undefined !== marginTablet ? marginTablet[3] : '',
		undefined !== marginMobile ? marginMobile[3] : ''
	);

	const previewPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== paddingDesktop ? paddingDesktop[0] : '',
		undefined !== paddingTablet ? paddingTablet[0] : '',
		undefined !== paddingMobile ? paddingMobile[0] : ''
	);
	const previewPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== paddingDesktop ? paddingDesktop[1] : '',
		undefined !== paddingTablet ? paddingTablet[1] : '',
		undefined !== paddingMobile ? paddingMobile[1] : ''
	);
	const previewPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== paddingDesktop ? paddingDesktop[2] : '',
		undefined !== paddingTablet ? paddingTablet[2] : '',
		undefined !== paddingMobile ? paddingMobile[2] : ''
	);
	const previewPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== paddingDesktop ? paddingDesktop[3] : '',
		undefined !== paddingTablet ? paddingTablet[3] : '',
		undefined !== paddingMobile ? paddingMobile[3] : ''
	);

	const previewTextAlign = getPreviewSize(
		previewDevice,
		undefined !== textAlign && undefined !== textAlign[0] ? textAlign[0] : '',
		undefined !== textAlign && undefined !== textAlign[1] ? textAlign[1] : '',
		undefined !== textAlign && undefined !== textAlign[2] ? textAlign[2] : ''
	);

	const [activeTab, setActiveTab] = useState('general');
	const [isOpen, setOpen] = useState(false);

	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

	const { createErrorNotice } = useDispatch(noticesStore);

	uniqueIdHelper(props);

	useEffect(() => {
		/**
		 * Get settings
		 */
		apiFetch({
			path: '/wp/v2/settings',
			method: 'GET',
		}).then((response) => {
			setCustomGoogleApiKey(response.kadence_blocks_google_maps_api);
		});

		setBlockDefaults('kadence/googlemaps', attributes);

		if (!kbVersion || kbVersion < 2) {
			setAttributes({ kbVersion: 2 });
		}
	}, []);

	function setGoogleApiKey() {
		const settingModel = new wp.api.models.Settings({
			kadence_blocks_google_maps_api: customGoogleApiKey,
		});
		settingModel.save().then((response) => {});
	}

	function removeGoogleApiKey() {
		setCustomGoogleApiKey('');
		const settingModel = new wp.api.models.Settings({
			kadence_blocks_google_maps_api: '',
		});
		settingModel.save().then((response) => {});
	}

	const getSaneDefaultForFilter = (filter) => {
		switch (filter) {
			case 'standard':
				return 0;
			case 'grayscale':
				return 100;
			case 'invert':
				return 100;
			case 'saturate':
				return 150;
			case 'sepia':
				return 30;
			default:
				return 50;
		}
	};

	const classes = classnames({
		[className]: className,
		[`size-${sizeSlug}`]: sizeSlug,
		[`kadence-googlemaps-${uniqueID}`]: uniqueID,
	});

	const blockProps = useBlockProps({
		className: classes,
	});

	const mapQueryParams = {
		key: googleApiKey,
		zoom,
		maptype: mapType,
		q: location,
	};

	const qs = Object.keys(mapQueryParams)
		.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(mapQueryParams[key])}`)
		.join('&');

	return (
		<figure {...blockProps}>
			<>
				<BlockControls>
					<CopyPasteAttributes
						attributes={attributes}
						defaultAttributes={metadata.attributes}
						blockSlug={metadata.name}
						onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
					/>
				</BlockControls>
				<KadenceInspectorControls blockSlug={'kadence/googlemaps'}>
					<InspectorControlTabs panelName={'googlemaps'} setActiveTab={setActiveTab} activeTab={activeTab} />

					{activeTab === 'general' && (
						<>
							<KadencePanelBody
								title={__('Map Location', 'kadence-blocks')}
								blockSlug={'kadence/googlemaps'}
								panelName={'mapLocation'}
							>
								<DynamicTextInputControl
									label={__('Location', 'kadence-blocks')}
									value={location}
									onChange={(value) => setAttributes({ location: value })}
									dynamicAttribute={'location'}
									allowClear={true}
									{...props}
								/>

								{apiType === 'javascript' && (
									<>
										<ToggleControl
											label={__('Show Marker', 'kadence-blocks')}
											checked={showMarker}
											onChange={(value) => {
												setAttributes({ showMarker: value });
											}}
										/>
										{/*<ToggleControl*/}
										{/*	label={ __('Show Controls', 'kadence-blocks') }*/}
										{/*	checked={ (showControls) }*/}
										{/*	onChange={ (value) => { setAttributes({ showControls: (value) }) } }*/}
										{/*/>*/}
									</>
								)}

								<RangeControl
									label={__('Zoom', 'kadence-blocks')}
									value={parseInt(zoom)}
									onChange={(value) => setAttributes({ zoom: value })}
									min={1}
									max={20}
								/>

								<SelectControl
									label={__('Map Type', 'kadence-blocks')}
									value={mapType}
									onChange={(value) => setAttributes({ mapType: value })}
									options={[
										{
											label: __('Road Map', 'kadence-blocks'),
											value: 'roadmap',
										},
										{
											label: __('Satellite', 'kadence-blocks'),
											value: 'satellite',
										},
									]}
								/>

								<SelectControl
									label={__('Map Filter', 'kadence-blocks')}
									value={mapFilter}
									onChange={(value) =>
										setAttributes({
											mapFilter: value,
											mapFilterAmount: getSaneDefaultForFilter(value),
										})
									}
									options={[
										{
											label: __('None', 'kadence-blocks'),
											value: 'standard',
										},
										{
											label: __('Grayscale', 'kadence-blocks'),
											value: 'grayscale',
										},
										{
											label: __('Invert', 'kadence-blocks'),
											value: 'invert',
										},
										{
											label: __('Saturate', 'kadence-blocks'),
											value: 'saturate',
										},
										{
											label: __('Sepia', 'kadence-blocks'),
											value: 'sepia',
										},
									]}
								/>

								{mapFilter !== 'standard' && (
									<RangeControl
										label={__('Map Filter Strength', 'kadence-blocks')}
										value={parseInt(mapFilterAmount)}
										onChange={(value) => setAttributes({ mapFilterAmount: value })}
										min={0}
										max={mapFilter === 'saturate' ? 250 : 100}
									/>
								)}

								{apiType === 'javascript' && mapType === 'roadmap' && (
									<>
										<SelectControl
											label={__('Map Style', 'kadence-blocks')}
											value={mapStyle}
											onChange={(value) =>
												setAttributes({
													mapStyle: value,
												})
											}
											options={[
												{
													label: __('None', 'kadence-blocks'),
													value: 'standard',
												},
												{
													label: __('Apple Maps Esque', 'kadence-blocks'),
													value: 'apple_maps_esque',
												},
												{
													label: __('Avocado', 'kadence-blocks'),
													value: 'avocado',
												},
												{
													label: __('Clean Interface', 'kadence-blocks'),
													value: 'clean_interface',
												},
												{
													label: __('Cobalt', 'kadence-blocks'),
													value: 'cobalt',
												},
												{
													label: __('Midnight Commander', 'kadence-blocks'),
													value: 'midnight_commander',
												},
												{
													label: __('Night Mode', 'kadence-blocks'),
													value: 'night_mode',
												},
												{
													label: __('No labels, Bright Colors', 'kadence-blocks'),
													value: 'no_label_bright_colors',
												},
												{
													label: __('Shades of Grey', 'kadence-blocks'),
													value: 'shades_of_grey',
												},
												{
													label: __('Custom Snazzy Map', 'kadence-blocks'),
													value: 'custom',
												},
											]}
										/>
									</>
								)}

								{apiType === 'javascript' && mapType === 'roadmap' && mapStyle === 'custom' && (
									<>
										<TextareaControl
											label={__('Custom Map Style', 'kadence-blocks')}
											help={__(
												'Copy the "Javascript Style Array" from a Snazzy Maps style',
												'kadence-blocks'
											)}
											value={customSnazzy}
											onChange={(value) => setAttributes({ customSnazzy: value })}
										/>

										<a href={'https://snazzymaps.com'} target={'_blank'} rel="noreferrer">
											{' '}
											{__('Visit Snazzy Maps', 'kadence-blocks')}{' '}
										</a>
									</>
								)}
							</KadencePanelBody>

							<KadencePanelBody
								title={__('API Settings', 'kadence-blocks')}
								initialOpen={false}
								blockSlug={'kadence/googlemaps'}
								panelName={'apiSettings'}
							>
								{__(
									'This block includes an API key, but a custom key can be used. A custom key is required to use the Javascript API.',
									'kadence-blocks'
								)}

								<br />

								<a
									href={'https://developers.google.com/maps/documentation/embed/get-api-key'}
									target={'_blank'}
									rel="noreferrer"
								>
									{__('How to create an API Key', 'kadence-blocks')}
								</a>

								<br />

								<h2 style={{ marginBottom: '0px' }}>{__('Required Permissions', 'kadence-blocks')}</h2>
								<ul style={{ marginTop: '5px' }}>
									{apiType === 'javascript' ? (
										<>
											<li>- Maps Javascript API</li>
											<li>- Geocoding API</li>
										</>
									) : (
										<li>- Maps Embed API</li>
									)}
								</ul>

								<br />

								<TextControl
									label={__('API Key', 'kadence-blocks')}
									value={customGoogleApiKey}
									onChange={(value) => setCustomGoogleApiKey(value)}
								/>
								<Button isPrimary onClick={setGoogleApiKey} disabled={'' === customGoogleApiKey}>
									{__('Save', 'kadence-blocks')}
								</Button>

								{'' !== customGoogleApiKey && (
									<>
										&nbsp;
										<Button
											isSecondary
											onClick={removeGoogleApiKey}
											disabled={'' === customGoogleApiKey}
										>
											{__('Remove', 'kadence-blocks')}
										</Button>
										<br />
										<br />
										<ToggleControl
											label={__('Use Javascript API', 'kadence-blocks')}
											checked={apiType === 'javascript'}
											onChange={(value) => {
												setAttributes({
													apiType: value ? 'javascript' : 'embed',
													mapFilter: 'standard',
												});
												if (value) {
													openModal();
												}
											}}
										/>
									</>
								)}
							</KadencePanelBody>
						</>
					)}

					{activeTab === 'style' && (
						<>
							<KadencePanelBody
								title={__('Container Size', 'kadence-blocks')}
								panelName={'containerStyle'}
								blockSlug={'kadence/googlemaps'}
							>
								<ResponsiveRangeControls
									label={__('Height', 'kadence-blocks')}
									value={heightDesktop}
									onChange={(value) => setAttributes({ heightDesktop: value })}
									tabletValue={heightTablet ? heightTablet : ''}
									onChangeTablet={(value) => setAttributes({ heightTablet: value })}
									mobileValue={heightMobile ? heightMobile : ''}
									onChangeMobile={(value) => setAttributes({ heightMobile: value })}
									min={100}
									max={1250}
									step={1}
									unit={'px'}
									units={['px']}
									showUnit={true}
								/>

								<ResponsiveRangeControls
									label={__('Max Width', 'kadence-blocks')}
									value={widthDesktop}
									onChange={(value) => setAttributes({ widthDesktop: value })}
									tabletValue={widthTablet ? widthTablet : ''}
									onChangeTablet={(value) => setAttributes({ widthTablet: value })}
									mobileValue={widthMobile ? widthMobile : ''}
									onChangeMobile={(value) => setAttributes({ widthMobile: value })}
									min={100}
									max={1250}
									step={1}
									unit={'px'}
									units={['px']}
									showUnit={true}
									reset={() => setAttributes({ widthDesktop: '', widthTablet: '', widthMobile: '' })}
								/>
								{(widthDesktop || widthTablet || widthMobile) && (
									<ResponsiveAlignControls
										label={__('Alignment', 'kadence-blocks')}
										value={textAlign && textAlign[0] ? textAlign[0] : ''}
										mobileValue={textAlign && textAlign[1] ? textAlign[1] : ''}
										tabletValue={textAlign && textAlign[2] ? textAlign[2] : ''}
										onChange={(nextAlign) =>
											setAttributes({
												textAlign: [
													nextAlign,
													textAlign && textAlign[1] ? textAlign[1] : '',
													textAlign && textAlign[2] ? textAlign[2] : '',
												],
											})
										}
										onChangeTablet={(nextAlign) =>
											setAttributes({
												textAlign: [
													textAlign && textAlign[0] ? textAlign[0] : '',
													nextAlign,
													textAlign && textAlign[2] ? textAlign[2] : '',
												],
											})
										}
										onChangeMobile={(nextAlign) =>
											setAttributes({
												textAlign: [
													textAlign && textAlign[0] ? textAlign[0] : '',
													textAlign && textAlign[1] ? textAlign[1] : '',
													nextAlign,
												],
											})
										}
									/>
								)}
							</KadencePanelBody>
						</>
					)}

					{activeTab === 'advanced' && (
						<>
							<KadencePanelBody panelName={'kb-google-spacing-settings'}>
								<ResponsiveMeasureRangeControl
									label={__('Padding', 'kadence-blocks')}
									value={paddingDesktop}
									tabletValue={paddingTablet}
									mobileValue={paddingMobile}
									onChange={(value) => setAttributes({ paddingDesktop: value })}
									onChangeTablet={(value) => setAttributes({ paddingTablet: value })}
									onChangeMobile={(value) => setAttributes({ paddingMobile: value })}
									min={0}
									max={paddingUnit === 'em' || paddingUnit === 'rem' ? 25 : 999}
									step={paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1}
									unit={paddingUnit}
									units={['px', 'em', 'rem', '%']}
									onUnit={(value) => setAttributes({ paddingUnit: value })}
									onMouseOver={paddingMouseOver.onMouseOver}
									onMouseOut={paddingMouseOver.onMouseOut}
								/>
								<ResponsiveMeasureRangeControl
									label={__('Margin', 'kadence-blocks')}
									value={marginDesktop}
									tabletValue={marginTablet}
									mobileValue={marginMobile}
									onChange={(value) => setAttributes({ marginDesktop: value })}
									onChangeTablet={(value) => setAttributes({ marginTablet: value })}
									onChangeMobile={(value) => setAttributes({ marginMobile: value })}
									min={marginUnit === 'em' || marginUnit === 'rem' ? -25 : -999}
									max={marginUnit === 'em' || marginUnit === 'rem' ? 25 : 999}
									step={marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1}
									unit={marginUnit}
									units={['px', 'em', 'rem', '%', 'vh']}
									onUnit={(value) => setAttributes({ marginUnit: value })}
									onMouseOver={marginMouseOver.onMouseOver}
									onMouseOut={marginMouseOver.onMouseOut}
									allowAuto={true}
								/>
							</KadencePanelBody>

							<div className="kt-sidebar-settings-spacer"></div>

							<KadenceBlockDefaults
								attributes={attributes}
								defaultAttributes={metadata.attributes}
								blockSlug={metadata.name}
							/>
						</>
					)}
				</KadenceInspectorControls>
			</>

			<div
				style={{
					marginTop:
						'' !== previewMarginTop ? getSpacingOptionOutput(previewMarginTop, marginUnit) : undefined,
					marginRight:
						'' !== previewMarginRight ? getSpacingOptionOutput(previewMarginRight, marginUnit) : undefined,
					marginBottom:
						'' !== previewMarginBottom
							? getSpacingOptionOutput(previewMarginBottom, marginUnit)
							: undefined,
					marginLeft:
						'' !== previewMarginLeft ? getSpacingOptionOutput(previewMarginLeft, marginUnit) : undefined,

					paddingTop:
						'' !== previewPaddingTop ? getSpacingOptionOutput(previewPaddingTop, paddingUnit) : undefined,
					paddingRight:
						'' !== previewPaddingRight
							? getSpacingOptionOutput(previewPaddingRight, paddingUnit)
							: undefined,
					paddingBottom:
						'' !== previewPaddingBottom
							? getSpacingOptionOutput(previewPaddingBottom, paddingUnit)
							: undefined,
					paddingLeft:
						'' !== previewPaddingLeft ? getSpacingOptionOutput(previewPaddingLeft, paddingUnit) : undefined,
				}}
			>
				<div className={`kb-map-container kb-map-align-${previewTextAlign}`} style={{}}>
					<div className={'kb-map-container-infobar'}></div>
					{apiType === 'embed' ? (
						<div
							style={{
								webkitFilter:
									mapFilter !== 'standard' ? mapFilter + '(' + mapFilterAmount + '%)' : 'none',
								height: previewHeight + 'px',
								maxWidth: previewWidth === '' ? '100%' : previewWidth + 'px',
							}}
						>
							<iframe
								width={'100%'}
								height={'100%'}
								src={'https://www.google.com/maps/embed/v1/place?' + qs}
								title={__('Google Map of', 'kadence-blocks') + location}
							></iframe>
						</div>
					) : (
						<div
							style={{
								webkitFilter:
									mapFilter !== 'standard' ? mapFilter + '(' + mapFilterAmount + '%)' : 'none',
								height: previewHeight + 'px',
								maxWidth: previewWidth === '' ? '100%' : previewWidth + 'px',
							}}
						>
							<EditJsMap
								zoom={zoom}
								customSnazzy={customSnazzy}
								lat={lat}
								lng={lng}
								showMarker={showMarker}
								mapType={mapType}
								mapStyle={mapStyle}
								googleApiKey={customGoogleApiKey}
							/>
						</div>
					)}
				</div>

				<SpacingVisualizer
					style={{
						marginLeft:
							undefined !== previewMarginLeft
								? getSpacingOptionOutput(previewMarginLeft, marginUnit)
								: undefined,
						marginRight:
							undefined !== previewMarginRight
								? getSpacingOptionOutput(previewMarginRight, marginUnit)
								: undefined,
						marginTop:
							undefined !== previewMarginTop
								? getSpacingOptionOutput(previewMarginTop, marginUnit)
								: undefined,
						marginBottom:
							undefined !== previewMarginBottom
								? getSpacingOptionOutput(previewMarginBottom, marginUnit)
								: undefined,
					}}
					type="inside"
					forceShow={paddingMouseOver.isMouseOver}
					spacing={[
						getSpacingOptionOutput(previewPaddingTop, paddingUnit),
						getSpacingOptionOutput(previewPaddingRight, paddingUnit),
						getSpacingOptionOutput(previewPaddingBottom, paddingUnit),
						getSpacingOptionOutput(previewPaddingLeft, paddingUnit),
					]}
				/>
				<SpacingVisualizer
					type="outside"
					forceShow={marginMouseOver.isMouseOver}
					spacing={[
						getSpacingOptionOutput(previewMarginTop, marginUnit),
						getSpacingOptionOutput(previewMarginRight, marginUnit),
						getSpacingOptionOutput(previewMarginBottom, marginUnit),
						getSpacingOptionOutput(previewMarginLeft, marginUnit),
					]}
				/>
			</div>
			{isOpen && (
				<Modal title={__('Google Maps Javascript API', 'kadence-blocks')} onRequestClose={closeModal}>
					<div style={{ maxWidth: '600px' }}>
						{__('The Google Maps Javascript API is paid service and costs per request.', 'kadence-blocks')}
						<br />
						<a href={'https://mapsplatform.google.com/pricing/'} target={'_blank'} rel="noreferrer">
							{__('Click here to view the latest pricing', 'kadence-blocks')}{' '}
						</a>
						.
						<br />
						<br />
						{__(
							'This API key you enter is here visible by users, so make sure to restrict the key to specific endpoints and web addresses.',
							'kadence-blocks'
						)}
						<br />
						<a
							href={'https://developers.google.com/maps/api-security-best-practices#restricting-api-keys'}
							target={'_blank'}
							rel="noreferrer"
						>
							{__('More informaiton on that can be found here', 'kadence-blocks')}
						</a>
						<br />
						<br />
						<Button
							className={'is-secondary'}
							onClick={() => {
								setAttributes({ apiType: 'embed' });
								closeModal();
							}}
							text={__('Cancel', 'kadence-blocks')}
						/>
						&nbsp;&nbsp;&nbsp;&nbsp;
						<Button className={'is-primary'} onClick={closeModal} text={__('Continue', 'kadence-blocks')} />
					</div>
				</Modal>
			)}
		</figure>
	);
}

export default Edit;
