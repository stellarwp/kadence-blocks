/**
 * Basic Background Control.
 */

/**
 * Import Css
 */
import './editor.scss';
/**
 * Import Kadence Components
 */
import DynamicBackgroundControl from '../dynamic-background-control';
import ImageSizeControl from '../common/image-size-controls';
import KadenceMediaPlaceholder from '../common/media-placeholder';
import KadenceRadioButtons from '../common/radio-buttons';
import KadenceFocalPicker from '../focal-picker';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { MediaUpload } from '@wordpress/block-editor';
import { Button, ToggleControl } from '@wordpress/components';
import {
	image,
	closeSmall,
	plusCircleFilled,
} from '@wordpress/icons';
import BackgroundSizeControl from '../background-size-control';
const ALLOWED_MEDIA_TYPES = [ 'image' ];
/**
 * Basic Background Control.
 */
const BackgroundControl = ( props ) => {
	const {
		label,
		hasImage,
		onSaveImage,
		onRemoveImage,
		onSaveURL,
		onSavePosition,
		onSaveSize,
		onSaveRepeat,
		onSaveAttachment,
		disableMediaButtons,
		imageURL,
		imageID,
		imagePosition,
		imageSize,
		imageRepeat,
		imageAttachment,
		imageAttachmentParallax = false,
		imageAttachmentFixed = true,
		inlineImage,
		onSaveInlineImage,
		dynamicAttribute = '',
		attributes
	} = props;
	
	const attachmentOptions = [
		{ value: 'scroll', label: __( 'Scroll', 'kadence-blocks' ) }
	];
	if ( imageAttachmentFixed ) {
		attachmentOptions.push({ value: 'fixed', label: __( 'Fixed', 'kadence-blocks' ) });
	}
	if ( imageAttachmentParallax ) {
		attachmentOptions.push({ value: 'parallax', label: __( 'Parallax', 'kadence-blocks' ) });
	}
	return (
		<div className="components-base-control kadence-image-background-control">
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
						onSelectURL={ ( newURL ) => onSaveURL( newURL) }
						accept="image/*"
						className={ 'kadence-image-upload' }
						allowedTypes={ ALLOWED_MEDIA_TYPES }
						disableMediaButtons={ disableMediaButtons }
						dynamicControl={ ( dynamicAttribute && kadence_blocks_params.dynamic_enabled ? <DynamicBackgroundControl { ...props }/> : undefined ) }
					/>
				</Fragment>
			) }
			{ hasImage && (
				<Fragment>
					{ label && (
						<div className="components-kadence-image-background__label">{ label }</div>
					) }
					{ dynamicAttribute && kadence_blocks_params.dynamic_enabled && attributes.kadenceDynamic && attributes.kadenceDynamic[ dynamicAttribute ] && attributes.kadenceDynamic[ dynamicAttribute ].enable ? (
						<div className="kb-dynamic-background-sidebar-top">
							<DynamicBackgroundControl startOpen={ attributes.kadenceDynamic[ dynamicAttribute ].field ? false : true } { ...props }/>
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
								<DynamicBackgroundControl { ...props }/>
							) }
						</Fragment>
					) }
					<KadenceFocalPicker
						url={ ( imageURL ? imageURL : '' ) }
						value={ ( imagePosition ? imagePosition : 'center center' ) }
						onChange={ value => onSavePosition( value ) }
					/>
					{ imageID && (
						<ImageSizeControl
							label={ __( 'Image File Size', 'kadence-blocks' ) }
							id={ imageID }
							url={ imageURL }
							onChange={ newImage => {
								onSaveImage( { id: imageID, url:newImage.value } );
							} }
						/>
					) }
					<BackgroundSizeControl
						label={ __( 'Background Image Size', 'kadence-blocks' ) }
						value={ ( imageSize ? imageSize : 'cover' ) }
						options={ [
							{ value: 'cover', label: __( 'Cover', 'kadence-blocks' ) },
							{ value: 'contain', label: __( 'Contain', 'kadence-blocks' ) },
							{ value: 'auto', label: __( 'Auto', 'kadence-blocks' ) },
						] }
						onChange={ value => onSaveSize( value ) }
					/>
					{ ( imageSize ? imageSize : 'cover' ) !== 'cover' && (
						<KadenceRadioButtons
							label={ __( 'Background Image Repeat', 'kadence-blocks' ) }
							value={ ( imageRepeat ? imageRepeat : 'no-repeat' ) }
							options={ [
								{ value: 'no-repeat', label: __( 'No Repeat', 'kadence-blocks' ) },
								{ value: 'repeat', label: __( 'Repeat', 'kadence-blocks' ) },
								{ value: 'repeat-x', label: __( 'Repeat-x', 'kadence-blocks' ) },
								{ value: 'repeat-y', label: __( 'Repeat-y', 'kadence-blocks' ) },
							] }
							onChange={ value => onSaveRepeat( value ) }
						/>
					) }
					<KadenceRadioButtons
						label={ __( 'Background Image Attachment', 'kadence-blocks' ) }
						value={ ( imageAttachment ? imageAttachment : 'scroll' ) }
						options={ attachmentOptions }
						onChange={ value => onSaveAttachment( value ) }
					/>
					{ ( imageAttachment ? imageAttachment : 'scroll' ) === 'fixed' && (
						<p className="kb-sidebar-help">
							{ __( 'Note: Attachment Fixed work only on desktop.', 'kadence-blocks' ) }
						</p>
					) }
					{ onSaveInlineImage && (
						<ToggleControl
							label={ __( 'Force Background Image inline?', 'kadence-blocks' ) }
							checked={ ( undefined !== inlineImage ? inlineImage : false ) }
							onChange={ ( value ) => onSaveInlineImage( value ) }
						/>
					) }
				</Fragment>
			) }
		</div>
	);
}

export default BackgroundControl;
