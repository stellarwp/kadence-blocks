import classNames from "classnames";
import { Button, Icon } from "@wordpress/components";
import {
	download as DownloadIcon,
	check as CheckIcon
} from "@wordpress/icons";
import { useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import downloadToMediaLibrary from "../functions/downloadToMediaLibrary";
import { __ } from '@wordpress/i18n';

/**
 * Render the Result component.
 *
 * @param {Object} props The component props.
 * @return {JSX.Element} The Result component.
 */
export default function Result(props) {
	const { 
		result,
		setInactive,
		index,
		currentUserSelectionIndex,
		setCurrentUserSelectionIndex,
		imagePickerMultiSelection,
		setImagePickerMultiSelection,
		isDownloading,
		setIsDownloading,
	} = props;

	const {
		alt,
		id,
		sizes,
	} = result;

    const [downloadComplete, setDownloadComplete] = useState( false );
	const [localIsDownloading, setLocalIsDownloading] = useState( false );
	
	const { imagePickerDownloadedImages } = useSelect(
        ( select ) => {
            const imagePickerDownloadedImages = typeof select( 'kadenceblocks/data' ).getImagePickerDownloadedImages === "function" ? select( 'kadenceblocks/data' ).getImagePickerDownloadedImages() : '';
            return {
                imagePickerDownloadedImages: imagePickerDownloadedImages,
            };
        },
        []
    );
	const { setImagePickerDownloadedImages } = useDispatch( 'kadenceblocks/data' );
	const isDownloaded = imagePickerDownloadedImages?.length && imagePickerDownloadedImages.includes( id ) ? true : false;

	const handleOnFocus = () => {
		setCurrentUserSelectionIndex( index );
	}
	const handleOnBlur = () => {
	}
	const resultButton = React.useRef(null)

	const isCurrent = index == currentUserSelectionIndex;

	const isSelected = imagePickerMultiSelection.includes( index );

	const itemClass = classNames( 'result', {
		'active': isCurrent,
		'downloaded': downloadComplete,
		'is-selected': isSelected,
	} );
	const buttonClass = classNames( 'download-button', {
		'btn-already-downloaded': isDownloaded,
	} );
	const handleDownload = () => {
		if ( ! isDownloading ) {
			setLocalIsDownloading( true );
			downloadToMediaLibrary( [result], setIsDownloading, setDownloadComplete, imagePickerDownloadedImages, setImagePickerDownloadedImages)
		}
	}
	const handleSelection = () => {
		if ( isDownloading ) {
			return;
		}
		setCurrentUserSelectionIndex( index );
		if ( ! isSelected ) {
			setImagePickerMultiSelection( [...imagePickerMultiSelection, index] )
		} else {
			setImagePickerMultiSelection( imagePickerMultiSelection.filter( item => item !== index ) )
		}
	}
	let imageSrc = sizes.find(image => image.name === 'medium_large');
	if ( ! imageSrc ) {
		imageSrc = sizes?.[1]?.src || sizes?.[0]?.src || '';
	} else {
		imageSrc = imageSrc.src;
	}
	return (
		<article className={itemClass}>
			<div className="result-wrap">
				<Button
					ref={resultButton}
					className='image-wrap'
					label={__( 'Select Image' )}
					onClick={handleSelection}
				>
					<img src={imageSrc} alt={alt} className={'img'} />
					<div class="image-select-container">
						<div className={'kb-image-selection-button'}>{ isSelected ? <Icon icon={ CheckIcon }></Icon> : '' }</div>
					</div>
				</Button>
				<div class="image-hover-container">
				</div>
				<Button 
					icon={downloadComplete || isDownloaded ? CheckIcon : DownloadIcon}
					size={'small'}
					label={ isDownloaded ? __( 'Already Downloaded', 'kadence-blocks' ) : __( 'Download Image', 'kadence-blocks' ) }
					onClick={handleDownload}
					className={buttonClass}
					isBusy={localIsDownloading}
				/>
			</div>
		</article>
	);
}
