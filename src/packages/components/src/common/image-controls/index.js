/**
 * Basic Image Control.
 */

/**
 * Import Kadence Components
 */
import KadenceMediaPlaceholder from '../media-placeholder';
import DynamicImageControl from '../../dynamic-image-control';
/**
 * Import Css
 */
 import './editor.scss';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, Component } from '@wordpress/element';
import {
	MediaUpload,
} from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
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
	render() {
		const {
			label,
			hasImage,
			onSaveImage,
			onRemoveImage,
			disableMediaButtons,
			imageURL,
			imageID,
			kadenceDynamic,
			dynamicAttribute = '' } = this.props;
		return (
			<div className="kadence-image-media-control kadence-image-background-control">
				{ ! hasImage && (
					<Fragment>
						{ label && (
							<div className="components-kadence-image-background__label">{ label }</div>
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
							<div className="components-kadence-image-background__label">{ label }</div>
						) }
						{ dynamicAttribute && kadence_blocks_params.dynamic_enabled && kadenceDynamic && kadenceDynamic[ dynamicAttribute ] && kadenceDynamic[ dynamicAttribute ].enable ? (
							<div className="kb-dynamic-background-sidebar-top">
								<DynamicImageControl startOpen={ kadenceDynamic[ dynamicAttribute ].field ? false : true } { ...this.props }/>
							</div>
						) : (
							<Fragment>
								<MediaUpload
									onSelect={ ( img ) => onSaveImage( img ) }
									type="image"
									value={ ( imageID ? imageID : '' ) }
									render={ ( { open } ) => (
										<Button
											className={ 'components-button components-icon-button kt-cta-upload-btn kb-sidebar-image' }
											style={ {
												backgroundImage: 'url("' + imageURL + '")',
												backgroundSize: 'cover',
											} }
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
