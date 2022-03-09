/**
 * BLOCK: Kadence Google Maps
 */

/**
 * Import Css
 */
import './editor.scss';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
import has from 'lodash/has';

const {
	InspectorControls,
} = wp.blockEditor;

const {
	PanelBody,
	RangeControl,
	TextControl,
	TextareaControl,
	SelectControl,
	ToggleControl,
	Modal,
	Button
} = wp.components;

/**
 * Internal dependencies
 */
import classnames from 'classnames';
import ResponsiveRangeControls from '../../components/range/responsive-range-control';
import isEmpty from 'lodash/isEmpty';
import KadenceRange from '../../components/range/range-control';
import EditJsMap from './editJsMap';
import ResponsiveMeasurementControls from '../../components/measurement/responsive-measurement-control';
import ResponsiveAlignControls from '../../components/align/responsive-align-control';

const ktmapsUniqueIDs = [];

export function Edit( {
	attributes,
	setAttributes,
	className,
	clientId,
} ) {

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
	} = attributes;
	const previewDevice = useSelect( ( select ) => {
		return select( 'kadenceblocks/data' ).getPreviewDeviceType();
	}, [] );
	let includedGoogleApiKey = 'AIzaSyBAM2o7PiQqwk15LC1XRH2e_KJ-jUa7KYk';
	const [ customGoogleApiKey, setCustomGoogleApiKey ] = useState('');

	let googleApiKey = isEmpty(customGoogleApiKey) ? includedGoogleApiKey : customGoogleApiKey;

	/*
	 * Geocode friendly address into Lat/Lng
	 * Wait 0.5 seconds after last change to prevent unnecessary requests
	 * Also skip if using Embed API as we don't need Lat/Lng for that
	 */
	useEffect(() => {
		if ( apiType === 'javascript' ) {
			const timeOutId = setTimeout(() => locationChange( location ), 600);
			return () => clearTimeout(timeOutId);
		}
		
	}, [ location, apiType ]);

	const locationChange = async (address) => {

		try {
			const geocoder = new window.google.maps.Geocoder()
			const response = await geocoder.geocode({ address: address })
			if ( has( response.results, [0] ) ) {
				setAttributes( {
					lat: response.results[0].geometry.location.lat(),
					lng: response.results[0].geometry.location.lng()
				} );
			} else {
				createErrorNotice( __('Could not find location', 'kadence-blocks') + ': ' + address, { type: 'snackbar' } );
			}
		} catch ( error ) {
			createErrorNotice( __('Could not find location', 'kadence-blocks') + ': ' + address, { type: 'snackbar' } );
		}
	}

	const getPreviewSize = ( device, desktopSize, tabletSize, mobileSize ) => {
		if ( device === 'Mobile' ) {
			if ( undefined !== mobileSize && '' !== mobileSize && null !== mobileSize ) {
				return mobileSize;
			} else if ( undefined !== tabletSize && '' !== tabletSize && null !== tabletSize ) {
				return tabletSize;
			}
		} else if ( device === 'Tablet' ) {
			if ( undefined !== tabletSize && '' !== tabletSize && null !== tabletSize ) {
				return tabletSize;
			}
		}
		return desktopSize;
	};

	const previewHeight = getPreviewSize( previewDevice, ( undefined !== heightDesktop ? heightDesktop : '450' ), ( undefined !== heightTablet ? heightTablet : '' ), ( undefined !== heightMobile ? heightMobile : '' ) );
	const previewWidth = getPreviewSize( previewDevice, ( undefined !== widthDesktop ? widthDesktop : '' ), ( undefined !== widthTablet ? widthTablet : '' ), ( undefined !== widthMobile ? widthMobile : '' ) );

	const previewMarginTop = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[0] : '' ), ( undefined !== marginTablet ? marginTablet[ 0 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 0 ] : '' ) );
	const previewMarginRight = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[1] : '' ), ( undefined !== marginTablet ? marginTablet[ 1 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 1 ] : '' ) );
	const previewMarginBottom = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[2] : '' ), ( undefined !== marginTablet ? marginTablet[ 2 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 2 ] : '' ) );
	const previewMarginLeft = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[3] : '' ), ( undefined !== marginTablet ? marginTablet[ 3 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 3 ] : '' ) );

	const previewPaddingTop = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[0] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 0 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 0 ] : '' ) );
	const previewPaddingRight = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[1] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 1 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 1 ] : '' ) );
	const previewPaddingBottom = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[2] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 2 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 2 ] : '' ) );
	const previewPaddingLeft = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[3] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 3 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 3 ] : '' ) );

	const previewTextAlign = getPreviewSize( previewDevice, ( undefined !== textAlign && undefined !== textAlign[0] ? textAlign[0] : '' ), ( undefined !== textAlign && undefined !== textAlign[1] ? textAlign[1] : '' ), ( undefined !== textAlign && undefined !== textAlign[2] ? textAlign[2] : '' ) );

	const [ marginControl, setMarginControl ] = useState( 'individual');
	const [ paddingControl, setPaddingControl ] = useState( 'individual');

	const [ isOpen, setOpen ] = useState( false );

	const openModal = () => setOpen( true );
	const closeModal = () => setOpen( false );

	const { createErrorNotice } = useDispatch(
		noticesStore
	);

	useEffect(() => {
		/**
		 * Get settings
		 */
		let settings;
		wp.api.loadPromise.then( () => {
			settings = new wp.api.models.Settings();
			settings.fetch().then( response => {
				setCustomGoogleApiKey(response.kadence_blocks_google_maps_api);
			} );
		} );

		if ( ! uniqueID ) {
			const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
			if ( blockConfigObject[ 'kadence/googlemaps' ] !== undefined && typeof blockConfigObject[ 'kadence/googlemaps' ] === 'object' ) {
				Object.keys( blockConfigObject[ 'kadence/googlemaps' ] ).map( ( attribute ) => {
					uniqueID = blockConfigObject[ 'kadence/googlemaps' ][ attribute ];
				} );
			}
			setAttributes( {
				uniqueID: '_' + clientId.substr( 2, 9 ),
			} );
			ktmapsUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
		} else if ( ktmapsUniqueIDs.includes( uniqueID ) ) {
			setAttributes( {
				uniqueID: '_' + clientId.substr( 2, 9 ),
			} );
			ktmapsUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
		} else {
			ktmapsUniqueIDs.push( uniqueID );
		}

	}, []);

	function setGoogleApiKey() {
		const settingModel = new wp.api.models.Settings( {
			kadence_blocks_google_maps_api: customGoogleApiKey,
		} );
		settingModel.save().then( response => {
		} );
	}

	function removeGoogleApiKey() {
		setCustomGoogleApiKey('');
		const settingModel = new wp.api.models.Settings( {
			kadence_blocks_google_maps_api: '',
		} );
		settingModel.save().then( response => {
		} );
	}

	const getSaneDefaultForFilter = ( filter ) => {
		switch (filter) {
			case "standard":
				return "0";
			case "grayscale":
				return "100";
			case "invert":
				return "100";
			case "saturate":
				return "150";
			case "sepia":
					return "30";
			default:
					return "50";
		}
	}

	const classes = classnames( className, {
		[ `size-${ sizeSlug }` ]: sizeSlug,
	} );

	const blockProps = useBlockProps( {
		className: classes,
	} );

	let mapQueryParams = {
		key: googleApiKey,
		zoom: zoom,
		maptype: mapType,
		q: location
	};

	const qs = Object.keys(mapQueryParams)
		.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(mapQueryParams[key])}`)
		.join('&');

	return (
		<figure { ...blockProps }>
			<InspectorControls>
				<PanelBody
					title={ __('Map Location', 'kadence-blocks') }
					initialOpen={ true }
				>

					<TextControl
						label={ __('Location', 'kadence-blocks') }
						value={ location }
						onChange={ (value) => { setAttributes( { location: value} ); } }
					/>

					{ apiType === 'javascript' ?
						<>
							<ToggleControl
								label={ __('Show Marker', 'kadence-blocks') }
								checked={ (showMarker) }
								onChange={ (value) => { setAttributes({ showMarker: (value) }) } }
							/>
							{/*<ToggleControl*/}
							{/*	label={ __('Show Controls', 'kadence-blocks') }*/}
							{/*	checked={ (showControls) }*/}
							{/*	onChange={ (value) => { setAttributes({ showControls: (value) }) } }*/}
							{/*/>*/}
						</>
						: null }

					<RangeControl
						label={ __( 'Zoom', 'kadence-blocks') }
						value={ parseInt(zoom) }
						onChange={ (value) => setAttributes( { zoom: value } ) }
						min={ 1 }
						max={ 20 }
					/>

					<SelectControl
						label={ __('Map Type', 'kadence-blocks') }
						value={ mapType }
						onChange={ (value) => setAttributes( { mapType: value } ) }
						options={ [
							{
								label: __('Road Map', 'kadence-blocks'),
								value: 'roadmap'
							},
							{
								label: __('Satellite', 'kadence-blocks'),
								value: 'satellite'
							}
						] } />

						<SelectControl
								label={ __('Map Filter', 'kadence-blocks') }
								value={ mapFilter }
								onChange={ (value) => setAttributes({
									mapFilter: value,
									mapFilterAmount: getSaneDefaultForFilter(value)
								}) }
								options={ [
									{
										label: __('None', 'kadence-blocks'),
										value: 'standard'
									},
									{
										label: __('Grayscale', 'kadence-blocks'),
										value: 'grayscale'
									},
									{
										label: __('Invert', 'kadence-blocks'),
										value: 'invert'
									},
									{
										label: __('Saturate', 'kadence-blocks'),
										value: 'saturate'
									},
									{
										label: __('Sepia', 'kadence-blocks'),
										value: 'sepia'
									}
								] } />

							{ mapFilter !== 'standard' ?
								<KadenceRange
									label={ __('Map Filter Strength ', 'kadence-blocks') }
									value={ mapFilterAmount }
									onChange={ (value) => setAttributes({ mapFilterAmount: value }) }
									min={ 0 }
									max={ (mapFilter === 'saturate') ? 250 : 100 }
								/> : null }

					{ apiType === 'javascript' && mapType === 'roadmap' ?
						<>
							<SelectControl
								label={ __('Map Style', 'kadence-blocks') }
								value={ mapStyle }
								onChange={ (value) => setAttributes({
									mapStyle: value
								}) }
								options={ [
									{
										label: __('None', 'kadence-blocks'),
										value: 'standard'
									},
									{
										label: __('Apple Maps Esque', 'kadence-blocks'),
										value: 'apple_maps_esque'
									},
									{
										label: __('Avocado', 'kadence-blocks'),
										value: 'avocado'
									},
									{
										label: __('Clean Interface', 'kadence-blocks'),
										value: 'clean_interface'
									},
									{
										label: __('Cobalt', 'kadence-blocks'),
										value: 'cobalt'
									},
									{
										label: __('Midnight Commander', 'kadence-blocks'),
										value: 'midnight_commander'
									},
									{
										label: __('Night Mode', 'kadence-blocks'),
										value: 'night_mode'
									},
									{
										label: __('No labels, Bright Colors', 'kadence-blocks'),
										value: 'no_label_bright_colors'
									},
									{
										label: __('Shades of Grey', 'kadence-blocks'),
										value: 'shades_of_grey'
									},
									{
										label: __('Custom Snazzy Map', 'kadence-blocks'),
										value: 'custom'
									}
								] } />
						</> : null }

					{ apiType === 'javascript' && mapType === 'roadmap' && mapStyle === 'custom' ?
							<>
								<TextareaControl
									label={ __('Custom Map Style', 'kadence-blocks') }
									help={ __( 'Copy the "Javascript Style Array" from a Snazzy Maps style', 'kadence-blocks') }
									value={ customSnazzy }
									onChange={ (value) => setAttributes( { customSnazzy: value } ) }
								/>
								
								<a href={'https://snazzymaps.com'} target={'_blank'}> { __('Visit Snazzy Maps', 'kadence-blocks') } </a>
							</>
						: null }

				</PanelBody>

				<PanelBody
					title={ __( 'Container Size', 'kadence-blocks' ) }
					initialOpen={ false }
				>
					<ResponsiveRangeControls
						label={ __( 'Height', 'kadence-blocks' ) }
						value={ heightDesktop }
						onChange={ value => setAttributes( { heightDesktop: value } ) }
						tabletValue={ ( heightTablet ? heightTablet : '' ) }
						onChangeTablet={ ( value ) => setAttributes( { heightTablet: value } ) }
						mobileValue={ ( heightMobile ? heightMobile : '' ) }
						onChangeMobile={ ( value ) => setAttributes( { heightMobile: value } ) }
						min={ 100 }
						max={ 1250 }
						step={ 1 }
						unit={ 'px' }
						units={ [ 'px' ] }
						showUnit={ true }
					/>

					<ResponsiveRangeControls
						label={ __( 'Max Width', 'kadence-blocks' ) }
						value={ widthDesktop }
						onChange={ value => setAttributes( { widthDesktop: value } ) }
						tabletValue={ ( widthTablet ? widthTablet : '' ) }
						onChangeTablet={ ( value ) => setAttributes( { widthTablet: value } ) }
						mobileValue={ ( widthMobile ? widthMobile : '' ) }
						onChangeMobile={ ( value ) => setAttributes( { widthMobile: value } ) }
						min={ 100 }
						max={ 1250 }
						step={ 1 }
						unit={ 'px' }
						units={ [ 'px' ] }
						showUnit={ true }
						reset={ () => setAttributes( { widthDesktop: '', widthTablet: '', widthMobile: '' } ) }
					/>
					{ ( widthDesktop || widthTablet || widthMobile ) && (
						<ResponsiveAlignControls
							label={ __( 'Alignment', 'kadence-blocks' ) }
							value={ ( textAlign && textAlign[0] ? textAlign[0] : '' ) }
							mobileValue={ ( textAlign && textAlign[1] ? textAlign[1] : '' ) }
							tabletValue={ ( textAlign && textAlign[2] ? textAlign[2] : '' ) }
							onChange={ ( nextAlign ) => setAttributes( { textAlign: [ nextAlign, ( textAlign && textAlign[1] ? textAlign[1] : '' ), ( textAlign && textAlign[2] ? textAlign[2] : '' ) ] } ) }
							onChangeTablet={ ( nextAlign ) => setAttributes( { textAlign: [ ( textAlign && textAlign[0] ? textAlign[0] : '' ), nextAlign, ( textAlign && textAlign[2] ? textAlign[2] : '' ) ] } ) }
							onChangeMobile={ ( nextAlign ) => setAttributes( { textAlign: [ ( textAlign && textAlign[0] ? textAlign[0] : '' ), ( textAlign && textAlign[1] ? textAlign[1] : '' ), nextAlign ] } ) }
						/>
					) }

					<ResponsiveMeasurementControls
						label={ __( 'Padding', 'kadence-blocks' ) }
						value={ [ previewPaddingTop, previewPaddingRight, previewPaddingBottom, previewPaddingLeft ] }
						control={ paddingControl }
						tabletValue={ paddingTablet }
						mobileValue={ paddingMobile }
						onChange={ ( value ) => setAttributes( { paddingDesktop: value } ) }
						onChangeTablet={ ( value ) => setAttributes( { paddingTablet: value } ) }
						onChangeMobile={ ( value ) => setAttributes( { paddingMobile: value } ) }
						onChangeControl={ ( value ) => setPaddingControl( value ) }
						min={ 0 }
						max={ ( paddingUnit === 'em' || paddingUnit === 'rem' ? 24 : 200 ) }
						step={ ( paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1 ) }
						unit={ paddingUnit }
						units={ [ 'px', 'em', 'rem', '%' ] }
						onUnit={ ( value ) => setAttributes( { paddingUnit: value } ) }
					/>
					<ResponsiveMeasurementControls
						label={ __( 'Margin', 'kadence-blocks' ) }
						value={ [ previewMarginTop, previewMarginRight, previewMarginBottom, previewMarginLeft ] }
						control={ marginControl }
						tabletValue={ marginTablet }
						mobileValue={ marginMobile }
						onChange={ ( value ) => {
							setAttributes( { marginDesktop: [ value[ 0 ], value[ 1 ], value[ 2 ], value[ 3 ] ] } );
						} }
						onChangeTablet={ ( value ) => setAttributes( { marginTablet: value } ) }
						onChangeMobile={ ( value ) => setAttributes( { marginMobile: value } ) }
						onChangeControl={ ( value ) => setMarginControl( value ) }
						min={ ( marginUnit === 'em' || marginUnit === 'rem' ? -12 : -200 ) }
						max={ ( marginUnit === 'em' || marginUnit === 'rem' ? 24 : 200 ) }
						step={ ( marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1 ) }
						unit={ marginUnit }
						units={ [ 'px', 'em', 'rem', '%', 'vh' ] }
						onUnit={ ( value ) => setAttributes( { marginUnit: value } ) }
					/>

				</PanelBody>
				<PanelBody
					title={ __( 'API Settings', 'kadence-blocks' ) }
					initialOpen={ false }
				>

					{ __('This block includes an API key, but a custom key can be used. A custom key is required to use the Javascript API.', 'kadence-blocks') }

					<br/>

					<a href={'https://developers.google.com/maps/documentation/embed/get-api-key'} target={'_blank'}>{ __('How to create an API Key', 'kadence-blocks') }</a>


					<br/>

					<h2 style={ { marginBottom: '0px'} }>Required Permissions</h2>
					<ul style={ { marginTop: '5px'} }>
						{ apiType === 'javascript' ?
							<>
								<li>- Maps Javascript API</li>
								<li>- Geocoding API</li>
							</>
							:
							<li>- Maps Embed API</li> }
					</ul>

					<br/>

					<TextControl
						label={ __( 'API Key', 'kadence-blocks' ) }
						value={ customGoogleApiKey }
						onChange={ value => setCustomGoogleApiKey( value ) }
					/>
						<Button
							isPrimary
							onClick={ setGoogleApiKey }
							disabled={ '' === customGoogleApiKey }
						>
							Save
					</Button>

					{ '' !== customGoogleApiKey ?
						<>
							&nbsp;
							<Button
								isDefault
								onClick={ removeGoogleApiKey }
								disabled={ '' === customGoogleApiKey }
							>
								Remove
							</Button>

							<br/><br/>

							<ToggleControl
								label={ __( 'Use Javascript API', 'kadence-blocks' ) }
								checked={ (apiType === 'javascript') }
								onChange={ ( value ) => { setAttributes( { apiType: (value ? 'javascript' : 'embed'), mapFilter: 'standard' } );  if(value) { openModal(); } } }
							/>
						</>
						: null }

				</PanelBody>
			</InspectorControls>

			<div style={ {
				marginTop: ('' !== previewMarginTop ? previewMarginTop + marginUnit : undefined),
				marginRight: ('' !== previewMarginRight ? previewMarginRight + marginUnit : undefined),
				marginBottom: ('' !== previewMarginBottom ? previewMarginBottom + marginUnit : undefined),
				marginLeft: ('' !== previewMarginLeft ? previewMarginLeft + marginUnit : undefined),

				paddingTop: ('' !== previewPaddingTop ? previewPaddingTop + paddingUnit : undefined),
				paddingRight: ('' !== previewPaddingRight ? previewPaddingRight + paddingUnit : undefined),
				paddingBottom: ('' !== previewPaddingBottom ? previewPaddingBottom + paddingUnit : undefined),
				paddingLeft: ('' !== previewPaddingLeft ? previewPaddingLeft + paddingUnit : undefined)
			} }>
				<div className={ `kb-map-container kb-map-align-${ previewTextAlign }` } style={ {
					height: previewHeight + 'px',
					maxWidth: ( previewWidth === '' ? '100%' : previewWidth + 'px' ),
					webkitFilter: (mapFilter !== 'standard' ? mapFilter + '(' + mapFilterAmount + '%)' : 'none' )
				} }>
					<div className={ 'kb-map-container-infobar' }></div>
					{ apiType === 'embed' ? <>

						<iframe width={ '100%' } height={ '100%' }
							src={ 'https://www.google.com/maps/embed/v1/place?' + qs }>
						</iframe>
							</> :
							<>
								<EditJsMap zoom={ zoom } customSnazzy={ customSnazzy } lat={ lat } lng={ lng } showMarker={showMarker} mapType={mapType} mapStyle={ mapStyle } googleApiKey={ 'AIzaSyDzwRtJXFMk604PIwm2H667t8_ex4QqOyI' } />
							</>
					}
					</div>
			</div>
			{ isOpen && (
				<Modal title={ __( 'Google Maps Javascript API', 'kadence-blocks' ) } onRequestClose={ closeModal }>
					<div style={ { maxWidth: '600px' } }>
						{ __( 'The Google Maps Javascript API is paid service and costs per request.', 'kadence-blocks' ) }
						<br />
						<a href={ 'https://mapsplatform.google.com/pricing/' } target={ '_blank' }>{ __( 'Click here to view the latest pricing', 'kadence-blocks' ) } </a>.
						<br /><br />

						{ __( 'This API key you enter is here visible by users, so make sure to restrict the key to specific endpoints and web addresses.', 'kadence-blocks' ) }
						<br />
						<a href={ 'https://developers.google.com/maps/api-security-best-practices#restricting-api-keys' } target={ '_blank' }>{ __( 'More informaiton on that can be found here', 'kadence-blocks' ) }</a>

						<br /><br />

						<Button className={ 'is-secondary' } onClick={ () => {
							setAttributes({ apiType: 'embed' })
							closeModal()
						} } text={ __( 'Cancel', 'kadence-blocks' ) } />
						&nbsp;&nbsp;&nbsp;&nbsp;
						<Button className={ 'is-primary' } onClick={ closeModal } text={ __( 'Continue', 'kadence-blocks' ) } />

					</div>
				</Modal>
			) }
		</figure>
	);
}

export default ( Edit );
