/**
 * Basic Image Control.
 */

/**
 * Import Kadence Components
 */
import KadenceMediaPlaceholder from './kadence-media-placeholder';
import DynamicImageControl from './dynamic-image-control';
 /**
  * WordPress dependencies
  */
  import { __ } from '@wordpress/i18n';
  import { Fragment, Component } from '@wordpress/element';
  import {
	MediaUpload,
} from '@wordpress/block-editor';
  import { Button, Icon, Tooltip, ToggleControl, ExternalLink, TextControl, SelectControl } from '@wordpress/components';
  import {
	image,
	closeSmall,
	plusCircleFilled,
} from '@wordpress/icons';
const ALLOWED_MEDIA_TYPES = [ 'image' ];
/**
 * Basic Image Control.
 */
 class KadenceImageControl extends Component {
	constructor() {
		super( ...arguments );
	}
	render() {
		const {
			label,
			hasImage,
			onSaveImage,
			onRemoveImage,
			disableMediaButtons,
			imageURL,
			imageID,
			dynamicAttribute = '' } = this.props;
		return (
			<div className="kadence-image-media-control kadence-image-background-control">
				{ ! hasImage && (
					<Fragment>
						{ label && (
							<div class="components-kadence-image-background__label">{ label }</div>
						) }
						<KadenceMediaPlaceholder
							labels={ '' }
							selectIcon={ plusCircleFilled }
							selectLabel={ __( 'Select Image', 'kadence-blocks' ) }
							onSelect={ ( img ) => onSaveImage( img ) }
							accept="image/*"
							className={ 'kadence-image-upload' }
							allowedTypes={ ALLOWED_MEDIA_TYPES }
							disableMediaButtons={ disableMediaButtons }
							dynamicControl={ ( dynamicAttribute && kadence_blocks_params.dynamic_enabled ? <DynamicImageControl { ...this.props }/> : undefined ) }
						/>
					</Fragment>
				) }
				{ hasImage && (
					<Fragment>
						{ label && (
							<div class="components-kadence-image-background__label">{ label }</div>
						) }
						{ dynamicAttribute && kadence_blocks_params.dynamic_enabled && this.props.attributes.kadenceDynamic && this.props.attributes.kadenceDynamic[ dynamicAttribute ] && this.props.attributes.kadenceDynamic[ dynamicAttribute ].enable ? (
							<div className="kb-dynamic-background-sidebar-top">
								<DynamicImageControl startOpen={ this.props.attributes.kadenceDynamic[ dynamicAttribute ].field ? false : true } { ...this.props }/>
							</div>
						) : (
							<Fragment>
								<MediaUpload
									onSelect={ ( img ) => onSaveImage( img ) }
									type="image"
									value={ ( imageID ? imageID : '' ) }
									render={ ( { open } ) => (
										<Button
											className={ 'components-button components-icon-button kt-cta-upload-btn' }
											onClick={ open }
											icon={ image }
										>
											{ __( 'Edit Image', 'kadence-blocks' ) }
										</Button>
									) }
								/>
								<Button
									icon={ closeSmall }
									label={ __( 'Remove Image', 'kadence-blocks' ) }
									className={ 'components-button components-icon-button kt-remove-img kt-cta-upload-btn' }
									onClick={ () => onRemoveImage() }
								/>
								{ dynamicAttribute && kadence_blocks_params.dynamic_enabled && (
									<DynamicImageControl { ...this.props }/>
								) }
							</Fragment>
						) }
					</Fragment>
				) }
			</div>
		);
	}
}
export default KadenceImageControl;
