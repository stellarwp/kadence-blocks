/**
 * Basic Background Control.
 */

/**
 * Import External
 */
 import get from 'lodash/get';
 import map from 'lodash/map';
 import classnames from 'classnames';

 /**
 * Import Css
 */
import './editor.scss';
/**
 * Import Kadence Components
 */
import KadenceMediaPlaceholder from '../common/kadence-media-placeholder';
import KadenceFocalPicker from './kadence-focal-picker';
import KadenceRadioButtons from '../common/kadence-radio-buttons';
import DynamicBackgroundControl from './dynamic-background-control';
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
 * Basic Background Control.
 */
 class BackgroundControl extends Component {
	constructor() {
		super( ...arguments );
	}
	render() {
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
			inlineImage,
			onSaveInlineImage,
			dynamicAttribute = '' } = this.props;
			let attachmentOptions = [
				{ value: 'scroll', label: __( 'Scroll', 'kadence-blocks' ) },
				{ value: 'fixed', label: __( 'Fixed', 'kadence-blocks' ) },
			];
			if ( imageAttachmentParallax ) {
				attachmentOptions = [
					{ value: 'scroll', label: __( 'Scroll', 'kadence-blocks' ) },
					{ value: 'fixed', label: __( 'Fixed', 'kadence-blocks' ) },
					{ value: 'parallax', label: __( 'Parallax', 'kadence-blocks' ) },
				];
			}
		return (
			<div className="kadence-image-background-control">
				{ ! hasImage && (
					<Fragment>
						{ label && (
							<div class="components-kadence-image-background__label">{ label }</div>
						) }
						<KadenceMediaPlaceholder
							labels={ '' }
							selectIcon={ plusCircleFilled }
							selectLabel={ __( 'Select Image' ) }
							onSelect={ ( img ) => onSaveImage( img ) }
							onSelectURL={ ( newURL ) => onSaveURL( newURL) }
							accept="image/*"
							className={ 'kadence-image-upload' }
							allowedTypes={ ALLOWED_MEDIA_TYPES }
							disableMediaButtons={ disableMediaButtons }
							dynamicControl={ ( dynamicAttribute && kadence_blocks_params.dynamic_enabled ? <DynamicBackgroundControl { ...this.props }/> : undefined ) }
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
								<DynamicBackgroundControl startOpen={ this.props.attributes.kadenceDynamic[ dynamicAttribute ].field ? false : true } { ...this.props }/>
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
									<DynamicBackgroundControl { ...this.props }/>
								) }
							</Fragment>
						) }
						<KadenceFocalPicker
							url={ ( imageURL ? imageURL : '' ) }
							value={ ( imagePosition ? imagePosition : 'center center' ) }
							onChange={ value => onSavePosition( value ) }
						/>
						<KadenceRadioButtons
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
						{ onSaveInlineImage && (
							<ToggleControl
								label={ __( 'Force Background Image inline?', 'kadence-blocks' ) }
								checked={ ( undefined !== inlineImage ? inlineImage : false ) }
								onChange={ ( value ) => sonSaveInlineImage( value ) }
							/>
						) }
					</Fragment>
				) }
			</div>
		);
	}
}
export default BackgroundControl;
