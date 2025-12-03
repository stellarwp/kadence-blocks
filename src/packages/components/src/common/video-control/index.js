/**
 * Basic Image Control.
 */

/**
 * Import Kadence Components
 */
import KadenceMediaPlaceholder from '../media-placeholder';
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
/**
 * Import Icons
 */
 import {
	video
} from '@kadence/icons';
import {
	image,
	closeSmall,
	plusCircleFilled,
} from '@wordpress/icons';
const ALLOWED_MEDIA_TYPES = [ 'video' ];
/**
 * Basic Video Control.
 */
class KadenceVideoControl extends Component {
	render() {
		const {
			label,
			hasVideo,
			onSaveVideo,
			onRemoveVideo,
			disableMediaButtons,
			videoURL,
			videoID } = this.props;
		return (
			<div className="components-base-control kadence-image-media-control kadence-image-background-control kadence-video-background-control">
				{ ! hasVideo && (
					<Fragment>
						{ label && (
							<div className="components-kadence-video-background__label">{ label }</div>
						) }
						<KadenceMediaPlaceholder
							labels={ '' }
							selectIcon={ plusCircleFilled }
							selectLabel={ __( 'Select Video', 'kadence-blocks' ) }
							onSelect={ ( img ) => onSaveVideo( img ) }
							accept="video/*"
							className={ 'kadence-image-upload' }
							allowedTypes={ ALLOWED_MEDIA_TYPES }
							disableMediaButtons={ disableMediaButtons }
						/>
					</Fragment>
				) }
				{ hasVideo && (
					<Fragment>
						{ label && (
							<div className="components-kadence-video-background__label">{ label }</div>
						) }
						<div className='components-kadence-video-btns'>
							<MediaUpload
								onSelect={ ( video ) => onSaveVideo( video ) }
								type="video"
								value={ ( videoID ? videoID : '' ) }
								render={ ( { open } ) => (
									<Button
										className={ 'components-button components-icon-button kb-cta-upload-btn kb-video-edit' }
										onClick={ open }
										icon={ video }
									>
										{ __( 'Edit Video', 'kadence-blocks' ) }
									</Button>
								) }
							/>
							<Button
								icon={ closeSmall }
								label={ __( 'Remove Image', 'kadence-blocks' ) }
								className={ 'components-button components-icon-button kb-remove-video kb-cta-upload-btn' }
								onClick={ () => onRemoveVideo() }
							/>
						</div>
					</Fragment>
				) }
			</div>
		);
	}
}
export default KadenceVideoControl;
