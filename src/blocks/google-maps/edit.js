/**
 * BLOCK: Kadence Icon
 */

/**
 * Import Css
 */
import './editor.scss';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
import ResponsiveMeasurementControls from '../../components/measurement/responsive-measurement-control';

const {
	InspectorControls,
} = wp.blockEditor;

const { apiFetch } = wp;
const {
	PanelBody,
	RangeControl,
	TextControl,
	SelectControl,
	Button
} = wp.components;


/**
 * Internal dependencies
 */
import classnames from 'classnames';
import ResponsiveRangeControls from '../../components/range/responsive-range-control';
import isEmpty from 'lodash/isEmpty';

const ktlottieUniqueIDs = [];

export function Edit( {
	attributes,
	setAttributes,
	className,
	previewDevice,
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
		zoom,
		mapType,
		mapMode,
		sizeSlug,
	} = attributes;

	let includedGoogleApiKey = 'AIzaSyBAM2o7PiQqwk15LC1XRH2e_KJ-jUa7KYk';
	const [ customGoogleApiKey, setCustomGoogleApiKey ] = useState('');

	let googleApiKey = isEmpty(customGoogleApiKey) ? includedGoogleApiKey : customGoogleApiKey;

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

	const previewHeight = getPreviewSize( previewDevice, ( undefined !== heightDesktop ? heightDesktop : '450' ), ( undefined !== heightTablet ? heightTablet : '450' ), ( undefined !== heightMobile ? heightMobile : '450' ) );
	const previewWidth = getPreviewSize( previewDevice, ( undefined !== widthDesktop ? widthDesktop : '' ), ( undefined !== widthTablet ? widthTablet : '' ), ( undefined !== widthMobile ? widthMobile : '' ) );

	const previewMarginTop = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[0] : '' ), ( undefined !== marginTablet ? marginTablet[ 0 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 0 ] : '' ) );
	const previewMarginRight = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[1] : '' ), ( undefined !== marginTablet ? marginTablet[ 1 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 1 ] : '' ) );
	const previewMarginBottom = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[2] : '' ), ( undefined !== marginTablet ? marginTablet[ 2 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 2 ] : '' ) );
	const previewMarginLeft = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[3] : '' ), ( undefined !== marginTablet ? marginTablet[ 3 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 3 ] : '' ) );

	const previewPaddingTop = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[0] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 0 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 0 ] : '' ) );
	const previewPaddingRight = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[1] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 1 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 1 ] : '' ) );
	const previewPaddingBottom = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[2] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 2 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 2 ] : '' ) );
	const previewPaddingLeft = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[3] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 3 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 3 ] : '' ) );

	const [ marginControl, setMarginControl ] = useState( 'individual');
	const [ paddingControl, setPaddingControl ] = useState( 'individual');

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
			if ( blockConfigObject[ 'kadence/lottie' ] !== undefined && typeof blockConfigObject[ 'kadence/lottie' ] === 'object' ) {
				Object.keys( blockConfigObject[ 'kadence/lottie' ] ).map( ( attribute ) => {
					uniqueID = blockConfigObject[ 'kadence/lottie' ][ attribute ];
				} );
			}
			setAttributes( {
				uniqueID: '_' + clientId.substr( 2, 9 ),
			} );
			ktlottieUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
		} else if ( ktlottieUniqueIDs.includes( uniqueID ) ) {
			setAttributes( {
				uniqueID: '_' + clientId.substr( 2, 9 ),
			} );		ktlottieUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
		} else {
			ktlottieUniqueIDs.push( uniqueID );
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

					<SelectControl
						label={ __('Map Mode', 'kadence-blocks') }
						value={ mapMode }
						onChange={ (value) => setAttributes( { mapMode: value } ) }
						help={ 'Place: Display a pinpoint at a specific place or address. Search: results for a search across the visible map region'}
						options={ [
							{
								label: __( 'Place', 'kadence-blocks'),
								value: 'place'
							},
							{
								label: __( 'Search', 'kadence-blocks'),
								value: 'search'
							}
						] } />

					<TextControl
						label={ ( mapMode === 'search' ? __('Search', 'kadence-blocks') : __('Pinpoint', 'kadence-blocks') ) }
						help={ ( mapMode === 'search' ? __('Example: BBQ in Austin, TX', 'kadence-blocks') : __('Example: 42 Wallaby Way, Sydney', 'kadence-blocks') ) }
						value={ location }
						onChange={ (value) => setAttributes( { location: value} ) }
					/>
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
								label: 'Road Map',
								value: 'roadmap'
							},
							{
								label: 'Satellite',
								value: 'satellite'
							}
						] } />

				</PanelBody>

				<PanelBody
					title={ __( 'Size Controls', 'kadence-blocks' ) }
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
						mobileValue={ ( widthMobile ? heightMobile : '' ) }
						onChangeMobile={ ( value ) => setAttributes( { widthMobile: value } ) }
						min={ 100 }
						max={ 1250 }
						step={ 1 }
						unit={ 'px' }
						units={ [ 'px' ] }
						showUnit={ true }
						reset={ () => setAttributes( { widthDesktop: '', widthTablet: '', widthMobile: '' } ) }
					/>

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
					title={ __( 'API Key', 'kadence-blocks' ) }
					initialOpen={ false }
				>
					This blocks ships with an API key, but a custom key can be used.
					The required API permission is "Maps Embed API"

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
				<div className={ 'kb-map-container' } style={ {
					height: previewHeight + 'px',
					maxWidth: (previewWidth === '' ? '100%' : previewWidth + 'px'),
				} }>
					<div className={ 'kb-map-container-infobar' }>
					</div>
					<iframe width={ '100%' } height={ '100%' } loading={ 'lazy' }
									src={ 'https://www.google.com/maps/embed/v1/' + mapMode + '?' + qs }></iframe>
				</div>
			</div>
		</figure>
	);
}

export default ( Edit );
