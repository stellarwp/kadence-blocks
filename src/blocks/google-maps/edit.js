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
import { useBlockProps } from '@wordpress/block-editor';
import ResponsiveMeasurementControls from '../../components/measurement/responsive-measurement-control';
const { rest_url } = kadence_blocks_params;
import get from 'lodash/get';
import has from 'lodash/has';

const {
	InspectorControls,
} = wp.blockEditor;

const { apiFetch } = wp;
const {
	PanelBody,
	RangeControl,
	TextControl,
	SelectControl,
} = wp.components;


/**
 * Internal dependencies
 */
import classnames from 'classnames';
import ResponsiveRangeControl from '../../responsive-range-control'
import ResponsiveRangeControls from '../../components/range/responsive-range-control'

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
		location,
		zoom,
		mapType,
		mapMode,
		sizeSlug,
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

	const previewHeight = getPreviewSize( previewDevice, ( undefined !== heightDesktop ? heightDesktop : '450' ), ( undefined !== heightTablet ? heightTablet : '450' ), ( undefined !== heightMobile ? heightMobile : '450' ) );
	const previewWidth = getPreviewSize( previewDevice, ( undefined !== widthDesktop ? widthDesktop : '' ), ( undefined !== widthTablet ? widthTablet : '' ), ( undefined !== widthMobile ? widthMobile : '' ) );

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


				</PanelBody>
			</InspectorControls>

			<div className={ 'kb-map-container' } style={ {
				height: previewHeight + 'px',
				maxWidth: ( previewWidth === '' ? '100%' : previewWidth + 'px' ),
			} }>
				<div className={ 'kb-map-container-infobar' }>
				</div>
				<iframe width={ '100%' } height={ '100%' } loading={ 'lazy' }
								src={ 'https://www.google.com/maps/embed/v1/' + mapMode + '?' + qs }></iframe>
			</div>
		</figure>
	);
}

export default ( Edit );
