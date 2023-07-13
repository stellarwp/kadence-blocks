import classNames from "classnames";
import { Button } from "@wordpress/components";
import {
	download as DownloadIcon,
	check as CheckIcon
} from "@wordpress/icons";
import { useMemo, useEffect, useState, useCallback } from '@wordpress/element';
import downloadToMediaLibrary from "../functions/downloadToMediaLibrary";
import { __ } from '@wordpress/i18n';

/**
 * Render the Photo component.
 *
 * @param {Object} props The component props.
 * @return {JSX.Element} The Photo component.
 */
export default function Result(props) {
	const { 
		result,
		setInactive,
		index,
		currentUserSelectionIndex,
		setCurrentUserSelectionIndex
	} = props;

	const {
		url,
		alt,
		avg_color,
		photographer,
		sizes,
		photographer_url,
	} = result;

    const [downloadComplete, setDownloadComplete] = useState( false );
    const [isDownloading, setIsDownloading] = useState( false );

	const handleOnFocus = () => {
		setCurrentUserSelectionIndex( index );
	}
	const handleOnBlur = () => {
	}
	const resultButton = React.useRef(null)

	const isCurrent = index == currentUserSelectionIndex;

	const activeClass = isCurrent ? 'active' : '';
	const downloadedClass = downloadComplete ? 'downloaded' : '';

	const handleDownload = () => {
		if ( ! isDownloading ) {
			downloadToMediaLibrary(result, setIsDownloading, setDownloadComplete)
		}
	}

	return (
		<article className={classNames('result', activeClass, downloadedClass)}>
			<button
				ref={resultButton}
				className='image-wrap'
				data-alt={alt}
				title={__( 'Select Image' )}
				onFocus={handleOnFocus}
				onBlur={handleOnBlur}
			>
				<img src={sizes[1].src} alt={alt} className={'img'} />
				<div class="image-hover-container">
					<Button 
						icon={downloadComplete ? CheckIcon : DownloadIcon}
						size={'small'}
						onClick={handleDownload}
						className={'download-button'}
						isBusy={isDownloading}
					/>
				</div>
			</button>
		</article>
	);
}
