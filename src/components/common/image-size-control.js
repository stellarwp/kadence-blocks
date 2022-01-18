/**
 * Measure Component
 *
 */

/**
 * Import Icons
 */
import get from 'lodash/get';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import compact from 'lodash/compact';
import Select from 'react-select';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
const {
	Component,
	Fragment,
} = wp.element;
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
class ImageSizeControl extends Component {
	constructor( label, id, url, slug, onChange, fullSelection = true, selectByValue = true ) {
		super( ...arguments );
		this.getImageSizeOptions = this.getImageSizeOptions.bind( this );
		this.getSmallImageSizeOptions = this.getSmallImageSizeOptions.bind( this );
		this.state = {
			isVisible: false,
		};
	}
	getImageSizeOptions() {
		const { image } = this.props;
		if ( image ) {
			const sizes = ( undefined !== image.media_details.sizes ? image.media_details.sizes : [] );
			const imgSizes = Object.keys( sizes ).map( ( item ) => {
				return { slug: item, name: item };
			} );
			return compact( map( imgSizes, ( { name, slug } ) => {
				const type = get( image, [ 'mime_type' ] );
				if ( 'image/svg+xml' === type ) {
					return null;
				}
				const sizeUrl = get( image, [ 'media_details', 'sizes', slug, 'source_url' ] );
				if ( ! sizeUrl ) {
					return null;
				}
				const sizeWidth = get( image, [ 'media_details', 'sizes', slug, 'width' ] );
				if ( ! sizeWidth ) {
					return null;
				}
				const sizeHeight = get( image, [ 'media_details', 'sizes', slug, 'height' ] );
				if ( ! sizeHeight ) {
					return null;
				}
				return {
					value: sizeUrl,
					label: name + ' (' + sizeWidth + 'x' + sizeHeight + ')',
					slug: slug,
					width: sizeWidth,
					height: sizeHeight,
				};
			} ) );
		}
		return null;
	}
	getSmallImageSizeOptions() {
		const { image } = this.props;
		if ( image ) {
			const sizes = ( undefined !== image.media_details.sizes ? image.media_details.sizes : [] );
			const standardSizes = [];
			for ( let i = 0; i < Object.keys( sizes ).length; i++ ) {
				const item = Object.keys( sizes )[ i ];
				if ( 'thumbnail' === item || 'medium' === item || 'medium_large' === item || 'large' === item || 'full' === item ) {
					standardSizes.push( { slug: item, name: item } );
				}
			}
			return compact( map( standardSizes, ( { name, slug } ) => {
				const type = get( image, [ 'mime_type' ] );
				if ( 'image/svg+xml' === type ) {
					return null;
				}
				const sizeUrl = get( image, [ 'media_details', 'sizes', slug, 'source_url' ] );
				if ( ! sizeUrl ) {
					return null;
				}
				const sizeWidth = get( image, [ 'media_details', 'sizes', slug, 'width' ] );
				if ( ! sizeWidth ) {
					return null;
				}
				const sizeHeight = get( image, [ 'media_details', 'sizes', slug, 'height' ] );
				if ( ! sizeHeight ) {
					return null;
				}
				return {
					value: sizeUrl,
					label: name + ( 'full' === slug ? '' : ' (' + sizeWidth + 'x' + sizeHeight + ')' ),
					slug: slug,
					width: sizeWidth,
					height: sizeHeight,
				};
			} ) );
		}
		return null;
	}
	render() {
		let imageSizeOptions;
		if ( undefined === this.props.fullSelection || true === this.props.fullSelection ) {
			imageSizeOptions = this.getImageSizeOptions();
		} else {
			imageSizeOptions = this.getSmallImageSizeOptions();
		}
		return (
			<div className="kb-image-size-container">
				{ ! isEmpty( imageSizeOptions ) && ( undefined === this.props.selectByValue || true === this.props.selectByValue ) && (
					<Fragment>
						<h2 className="kb-image-size-title">{ this.props.label }</h2>
						<div className="kb-image-size-select-form-row">
							<Select
								options={ imageSizeOptions }
								value={ imageSizeOptions.filter( ( { value } ) => value === this.props.url ) }
								isMulti={ false }
								maxMenuHeight={ 250 }
								isClearable={ false }
								placeholder={ '' }
								onChange={ this.props.onChange }
							/>
						</div>
					</Fragment>
				) }
				{ ! isEmpty( imageSizeOptions ) && false === this.props.selectByValue && (
					<Fragment>
						<h2 className="kb-image-size-title">{ this.props.label }</h2>
						<div className="kb-image-size-select-form-row">
							<Select
								options={ imageSizeOptions }
								value={ imageSizeOptions.filter( ( { slug } ) => slug === this.props.slug ) }
								isMulti={ false }
								maxMenuHeight={ 250 }
								isClearable={ false }
								placeholder={ '' }
								onChange={ this.props.onChange }
							/>
						</div>
					</Fragment>
				) }
			</div>
		);
	}
}
export default compose( [
	withSelect( ( select, props ) => {
		const { getMedia } = select( 'core' );
		const { id } = props;
		const { getSettings } = select( 'core/block-editor' );
		const {
			imageSizes,
		} = getSettings();

		return {
			image: id ? getMedia( id ) : null,
			imageSizes,
		};
	} ),
] )( ImageSizeControl );
