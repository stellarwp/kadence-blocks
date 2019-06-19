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
const { __ } = wp.i18n;
const {
	Component,
	Fragment,
} = wp.element;
const {
	withSelect,
} = wp.data;
const {
	compose,
} = wp.compose;
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
class ImageSizeControl extends Component {
	constructor( label, id, url, onChange ) {
		super( ...arguments );
		this.state = {
			isVisible: false,
		};
	}
	getImageSizeOptions() {
		const { image } = this.props;
		if ( image ) {
			const sizes = image.media_details.sizes;
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
	render() {
		const imageSizeOptions = this.getImageSizeOptions();
		return (
			<div className="kb-image-size-container">
				{ ! isEmpty( imageSizeOptions ) && (
					<Fragment>
						<h2 className="kb-image-size-title">{ __( 'Image File Size' ) }</h2>
						<div className="kb-image-size-select-form-row">
							<Select
								options={ imageSizeOptions }
								value={ imageSizeOptions.filter( ( { value } ) => value === this.props.url ) }
								isMulti={ false }
								maxMenuHeight={ 300 }
								isClearable={ false }
								placeholder={ __( '' ) }
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

		return {
			image: id ? getMedia( id ) : null,
		};
	} ),
] )( ImageSizeControl );
