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
import { useState } from '@wordpress/element';
import { useBlockProps, BlockAlignmentControl } from '@wordpress/block-editor';
import ResponsiveMeasurementControls from '../../components/measurement/responsive-measurement-control';
const { rest_url } = kadence_blocks_params;
import get from 'lodash/get';
import has from 'lodash/has';

const {
	InspectorControls,
	BlockControls,
} = wp.blockEditor;

const { apiFetch } = wp;
const {
	PanelBody,
	RangeControl,
	ToggleControl,
	TextControl,
	Modal,
	SelectControl,
	FormFileUpload,
	Button,
	Notice,
} = wp.components;


/**
 * Internal dependencies
 */
import classnames from 'classnames';
import ResponsiveRangeControl from '../../responsive-range-control'
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
		align,
		width,
		height,
		location,
		zoom,
		mapType,
		mapMode,
		sizeSlug,
		paddingTablet,
		paddingDesktop,
		paddingMobile,
		paddingUnit,
		marginTablet,
		marginDesktop,
		marginMobile,
		marginUnit,
	} = attributes;

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

	const classes = classnames( className, {
		[ `size-${ sizeSlug }` ]: sizeSlug,
	} );

	const blockProps = useBlockProps( {
		className: classes,
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

	let mapQueryParams = {
		key: 'AIzaSyBGsB_DXmwf1WoHqBk0Jrt4VhyChI1mLjg',
		zoom: zoom,
		q: location
	};

	const qs = Object.keys(mapQueryParams)
		.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(mapQueryParams[key])}`)
		.join('&');

	return (
		<figure { ...blockProps }>
			<BlockControls group="block">
				<BlockAlignmentControl
					value={ align }
					onChange={ ( value ) => setAttributes( { align: value } ) }
				/>
			</BlockControls>
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
						help={ ( mapMode === 'search' ? __('Example: Starbucks, Midtown NYC', 'kadence-blocks') : __('Example: 42 Wallaby Way, Sydney', 'kadence-blocks') ) }
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

					<ResponsiveRangeControl
						label={ __( 'Height', 'kadence-blocks') }
						value={ parseInt( height ) }
						onChange={ (value) => setAttributes( { height: value } ) }
						units={ [ 'px', 'em', 'rem', '%' ] }
						min={ 100 }
						max={ 2000 }
					/>

				</PanelBody>

				<PanelBody
					title={ __( 'Size Controls', 'kadence-blocks' ) }
					initialOpen={ false }
				>
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

					<RangeControl
						label={ __( 'Max Width' ) }
						value={ width }
						onChange={ ( value ) => setAttributes( { width: value } ) }
						allowReset={ true }
						step={ 1 }
						min={ 25 }
						max={ 1000 }
					/>
				</PanelBody>
			</InspectorControls>
			<div style={
				{
					marginTop: ( '' !== previewMarginTop ? previewMarginTop + marginUnit : undefined ),
					marginRight: ( '' !== previewMarginRight ? previewMarginRight + marginUnit : undefined ),
					marginBottom: ( '' !== previewMarginBottom ? previewMarginBottom + marginUnit : undefined ),
					marginLeft: ( '' !== previewMarginLeft ? previewMarginLeft + marginUnit : undefined ),

					paddingTop: ( '' !== previewPaddingTop ? previewPaddingTop + paddingUnit : undefined ),
					paddingRight: ( '' !== previewPaddingRight ? previewPaddingRight + paddingUnit : undefined ),
					paddingBottom: ( '' !== previewPaddingBottom ? previewPaddingBottom + paddingUnit : undefined ),
					paddingLeft: ( '' !== previewPaddingLeft ? previewPaddingLeft + paddingUnit : undefined ),
				}
			}>
				<iframe width={ '100%' } height={ height + 'px' } style={ { border: '0' } } loading={ 'lazy' }
								src={ 'https://www.google.com/maps/embed/v1/' + mapMode + '?' + qs }></iframe>
			</div>
		</figure>
	);
}

// AIzaSyBGsB_DXmwf1WoHqBk0Jrt4VhyChI1mLjg

export default ( Edit );
