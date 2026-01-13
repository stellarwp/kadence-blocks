/**
 * Focal Point control.
 *
 */
import classnames from 'classnames';
import { every, get, isArray, noop, startsWith } from 'lodash';

import { keyboardReturn } from '@wordpress/icons';
import { Component, Fragment } from '@wordpress/element';
import {
	MediaUpload,
	URLPopover,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	Button,
	FormFileUpload,
	Placeholder,
	DropZone,
} from '@wordpress/components';

import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
const InsertFromURLPopover = ( { src, onChange, onSubmit, onClose } ) => (
	<URLPopover onClose={ onClose }>
		<form
			className="block-editor-media-placeholder__url-input-form"
			onSubmit={ onSubmit }
		>
			<input
				className="block-editor-media-placeholder__url-input-field"
				type="url"
				aria-label={ __( 'URL', 'kadence-blocks' ) }
				placeholder={ __( 'Paste or type URL', 'kadence-blocks' ) }
				onChange={ onChange }
				value={ src }
			/>
			<Button
				className="block-editor-media-placeholder__url-input-submit-button"
				icon={ keyboardReturn }
				label={ __( 'Apply', 'kadence-blocks' ) }
				type="submit"
			/>
		</form>
	</URLPopover>
);

class KadenceMediaPlaceholder extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			src: '',
			isURLInputVisible: false,
		};
		this.onChangeSrc = this.onChangeSrc.bind( this );
		this.onSubmitSrc = this.onSubmitSrc.bind( this );
		this.onUpload = this.onUpload.bind( this );
		this.onFilesUpload = this.onFilesUpload.bind( this );
		this.openURLInput = this.openURLInput.bind( this );
		this.closeURLInput = this.closeURLInput.bind( this );
	}

	onlyAllowsImages() {
		const { allowedTypes } = this.props;
		if ( ! allowedTypes ) {
			return false;
		}
		return every( allowedTypes, ( allowedType ) => {
			return (
				allowedType === 'image' || startsWith( allowedType, 'image/' )
			);
		} );
	}

	componentDidMount() {
		this.setState( { src: get( this.props.value, [ 'src' ], '' ) } );
	}

	componentDidUpdate( prevProps ) {
		if (
			get( prevProps.value, [ 'src' ], '' ) !==
			get( this.props.value, [ 'src' ], '' )
		) {
			this.setState( { src: get( this.props.value, [ 'src' ], '' ) } );
		}
	}

	onChangeSrc( event ) {
		this.setState( { src: event.target.value } );
	}

	onSubmitSrc( event ) {
		event.preventDefault();
		if ( this.state.src && this.props.onSelectURL ) {
			this.props.onSelectURL( this.state.src );
			this.closeURLInput();
		}
	}

	onUpload( event ) {
		this.onFilesUpload( event.target.files );
	}

	onFilesUpload( files ) {
		const {
			addToGallery,
			allowedTypes,
			mediaUpload,
			multiple,
			onError,
			onSelect,
			onFilesPreUpload = noop,
		} = this.props;

		onFilesPreUpload( files );
		let setMedia;
		if ( multiple ) {
			if ( addToGallery ) {
				// To allow changes to a gallery to be made while uploads are in progress
				// (including trigging multiple upload groups and removing already in place images),
				// we must be able to add newMedia based on the current value of the Gallery
				// whenever the setMedia function runs (not destructuring 'value' from props).
				// Additionally, since the setMedia function runs multiple times per upload group
				// and is passed newMedia containing every item in its group each time, we must
				// also filter out whatever this upload group had previously returned to the
				// gallery before adding and returning the image array with replacement newMedia
				// values.

				// Define an array to store urls from newMedia between subsequent function calls.
				let lastMediaPassed = [];
				setMedia = ( newMedia ) => {
					// Remove any images this upload group is responsible for (lastMediaPassed).
					// Their replacements are contained in newMedia.
					const filteredMedia = ( this.props.value || [] ).filter(
						( item ) => {
							// If Item has id, only remove it if lastMediaPassed has an item with that id.
							if ( item.id ) {
								return ! lastMediaPassed.some(
									// Be sure to convert to number for comparison.
									( { id } ) =>
										Number( id ) === Number( item.id )
								);
							}
							// Compare transient images via .includes since gallery may append extra info onto the url.
							return ! lastMediaPassed.some( ( { urlSlug } ) =>
								item.url.includes( urlSlug )
							);
						}
					);
					// Return the filtered media array along with newMedia.
					onSelect( filteredMedia.concat( newMedia ) );
					// Reset lastMediaPassed and set it with ids and urls from newMedia.
					lastMediaPassed = newMedia.map( ( media ) => {
						// Add everything up to '.fileType' to compare via .includes.
						const cutOffIndex = media.url.lastIndexOf( '.' );
						const urlSlug = media.url.slice( 0, cutOffIndex );
						return { id: media.id, urlSlug };
					} );
				};
			} else {
				setMedia = onSelect;
			}
		} else {
			setMedia = ( [ media ] ) => onSelect( media );
		}
		mediaUpload( {
			allowedTypes,
			filesList: files,
			onFileChange: setMedia,
			onError,
		} );
	}

	openURLInput() {
		this.setState( { isURLInputVisible: true } );
	}

	closeURLInput() {
		this.setState( { isURLInputVisible: false } );
	}

	renderPlaceholder( content, onClick ) {
		const {
			allowedTypes = [],
			className,
			icon,
			isAppender,
			labels = {},
			onDoubleClick,
			mediaPreview,
			notices,
			onSelectURL,
			mediaUpload,
			children,
		} = this.props;

		let instructions = labels.instructions;
		const title = labels.title;

		if ( ! mediaUpload && ! onSelectURL ) {
			instructions = __( 'To edit this block, you need permission to upload media.', 'kadence-blocks' );
		}

		if ( instructions === undefined || title === undefined ) {
			const isOneType = 1 === allowedTypes.length;
			const isAudio = isOneType && 'audio' === allowedTypes[ 0 ];
			const isImage = isOneType && 'image' === allowedTypes[ 0 ];
			const isVideo = isOneType && 'video' === allowedTypes[ 0 ];

			if ( instructions === undefined && mediaUpload ) {
				instructions = __( 'Upload a media file or pick one from your media library.', 'kadence-blocks' );

				if ( isAudio ) {
					instructions = __( 'Upload an audio file, pick one from your media library, or add one with a URL.', 'kadence-blocks' );
				} else if ( isImage ) {
					instructions = __( 'Upload an image file, pick one from your media library, or add one with a URL.', 'kadence-blocks' );
				} else if ( isVideo ) {
					instructions = __( 'Upload a video file, pick one from your media library, or add one with a URL.', 'kadence-blocks' );
				}
			}

			//  if ( title === undefined ) {
			// 	 title = __( 'Media', 'kadence-blocks' );

			// 	 if ( isAudio ) {
			// 		 title = __( 'Audio', 'kadence-blocks' );
			// 	 } else if ( isImage ) {
			// 		 title = __( 'Image', 'kadence-blocks' );
			// 	 } else if ( isVideo ) {
			// 		 title = __( 'Video', 'kadence-blocks' );
			// 	 }
			//  }
		}

		const placeholderClassName = classnames(
			'block-editor-media-placeholder',
			className,
			{
				'is-appender': isAppender,
			}
		);

		return (
			<Placeholder
				icon={ icon }
				label={ title ? title : undefined }
				instructions={ instructions }
				className={ placeholderClassName }
				notices={ notices }
				onClick={ onClick }
				onDoubleClick={ onDoubleClick }
				preview={ mediaPreview }
			>
				{ content }
				{ children }
			</Placeholder>
		);
	}

	renderDropZone() {
		const { disableDropZone, onHTMLDrop = noop } = this.props;

		if ( disableDropZone ) {
			return null;
		}

		return (
			<DropZone
				onFilesDrop={ this.onFilesUpload }
				onHTMLDrop={ onHTMLDrop }
			/>
		);
	}

	renderCancelLink() {
		const { onCancel } = this.props;
		return (
			onCancel && (
				<Button
					className="block-editor-media-placeholder__cancel-button"
					title={ __( 'Cancel', 'kadence-blocks' ) }
					isLink
					onClick={ onCancel }
				>
					{ __( 'Cancel', 'kadence-blocks' ) }
				</Button>
			)
		);
	}

	renderUrlSelectionUI() {
		const { onSelectURL } = this.props;
		if ( ! onSelectURL ) {
			return null;
		}
		const { isURLInputVisible, src } = this.state;
		return (
			<div className="block-editor-media-placeholder__url-input-container">
				<Button
					className="block-editor-media-placeholder__button"
					onClick={ this.openURLInput }
					isPressed={ isURLInputVisible }
					isTertiary
				>
					{ __( 'Insert from URL', 'kadence-blocks' ) }
				</Button>
				{ isURLInputVisible && (
					<InsertFromURLPopover
						src={ src }
						onChange={ this.onChangeSrc }
						onSubmit={ this.onSubmitSrc }
						onClose={ this.closeURLInput }
					/>
				) }
			</div>
		);
	}
	renderDynamicSelectionUI() {
		const { dynamicControl } = this.props;
		if ( ! dynamicControl ) {
			return null;
		}
		return (
			<div className="block-editor-media-placeholder__dynamic-input-container">
				{ dynamicControl }
			</div>
		);
	}

	renderMediaUploadChecked() {
		const {
			selectLabel = __( 'Select Image', 'kadence-blocks' ),
			selectIcon,
			accept,
			addToGallery,
			allowedTypes = [],
			isAppender,
			mediaUpload,
			multiple = false,
			onSelect,
			value = {},
		} = this.props;

		const mediaLibraryButton = (
			<MediaUpload
				addToGallery={ addToGallery }
				gallery={ multiple && this.onlyAllowsImages() }
				multiple={ multiple }
				onSelect={ onSelect }
				allowedTypes={ allowedTypes }
				value={
					isArray( value ) ? value.map( ( { id } ) => id ) : value.id
				}
				render={ ( { open } ) => {
					return (
						<Button
							isPrimary
							icon={ selectIcon ? selectIcon : undefined }
							onClick={ ( event ) => {
								event.stopPropagation();
								open();
							} }
						>
							{ selectLabel }
						</Button>
					);
				} }
			/>
		);

		if ( mediaUpload && isAppender ) {
			return (
				<Fragment>
					{ this.renderDropZone() }
					<FormFileUpload
						onChange={ this.onUpload }
						accept={ accept }
						multiple={ multiple }
						render={ ( { openFileDialog } ) => {
							const content = (
								<Fragment>
									{ mediaLibraryButton }
									{ this.renderUrlSelectionUI() }
									{ this.renderCancelLink() }
									{ this.renderDynamicSelectionUI() }
								</Fragment>
							);
							return this.renderPlaceholder(
								content,
								openFileDialog
							);
						} }
					/>
				</Fragment>
			);
		}

		if ( mediaUpload ) {
			const content = (
				<Fragment>
					{ this.renderDropZone() }
					{ mediaLibraryButton }
					{ this.renderUrlSelectionUI() }
					{ this.renderCancelLink() }
					{ this.renderDynamicSelectionUI() }
				</Fragment>
			);
			return this.renderPlaceholder( content );
		}

		return this.renderPlaceholder( mediaLibraryButton );
	}

	render() {
		const { disableMediaButtons, dropZoneUIOnly } = this.props;

		if ( dropZoneUIOnly || disableMediaButtons ) {
			return (
				<MediaUploadCheck>{ this.renderDropZone() }</MediaUploadCheck>
			);
		}

		return (
			<MediaUploadCheck
				fallback={ this.renderPlaceholder(
					this.renderUrlSelectionUI()
				) }
			>
				{ this.renderMediaUploadChecked() }
			</MediaUploadCheck>
		);
	}
}
export default withSelect( ( select ) => {
	const { getSettings } = select( 'core/block-editor' );
	return {
		mediaUpload: getSettings().mediaUpload,
	};
} )( KadenceMediaPlaceholder );
