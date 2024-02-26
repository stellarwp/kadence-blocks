import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import { useState, useEffect, Fragment } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import downloadToMediaLibrary from '../functions/downloadToMediaLibrary';
import { TextareaControl, __experimentalInputControl as InputControl, Button } from '@wordpress/components';

/**
 * Render the Result Details component.
 *
 * @param {Object} props The component props.
 * @return {JSX.Element} The Result Details component.
 */
export default function Result(props) {
	const { result, isDownloading, setIsDownloading, multiResult, imagePickerMultiSelection, index } = props;

	const { url, alt, height, width, id, avg_color, photographer, sizes, photographer_url } = result;
	const [downloadComplete, setDownloadComplete] = useState(false);
	const [downloadError, setDownloadError] = useState(false);
	const [altValue, setAltValue] = useState(alt);
	const [filenameValue, setFilenameValue] = useState('');
	const isMultiSelected =
		imagePickerMultiSelection?.length &&
		imagePickerMultiSelection.length > 1 &&
		imagePickerMultiSelection.includes(index);
	const { imagePickerDownloadedImages } = useSelect((select) => {
		const imagePickerDownloadedImages =
			typeof select('kadenceblocks/data').getImagePickerDownloadedImages === 'function'
				? select('kadenceblocks/data').getImagePickerDownloadedImages()
				: '';
		return {
			imagePickerDownloadedImages: imagePickerDownloadedImages,
		};
	}, []);
	const { setImagePickerDownloadedImages } = useDispatch('kadenceblocks/data');

	// sync the state values with the current result
	useEffect(() => {
		setAltValue(alt);
		setFilenameValue('');
	}, [alt]);
	function mergeArrays(arr1, arr2) {
		const combined = [...arr1, ...arr2];

		const uniqueMap = combined.reduce((acc, obj) => {
			acc[obj.id] = obj; // Assuming `id` is the unique identifier
			return acc;
		}, {});

		return Object.values(uniqueMap);
	}
	const resultData = { ...result, ...{ alt: altValue }, ...{ filename: filenameValue } };
	const handleDownload = () => {
		if (!isDownloading) {
			if (isMultiSelected) {
				const multiResultData = mergeArrays(multiResult, [resultData]);
				downloadToMediaLibrary(
					multiResultData,
					setIsDownloading,
					setDownloadComplete,
					imagePickerDownloadedImages,
					setImagePickerDownloadedImages,
					setDownloadError
				);
			} else {
				downloadToMediaLibrary(
					[resultData],
					setIsDownloading,
					setDownloadComplete,
					imagePickerDownloadedImages,
					setImagePickerDownloadedImages,
					setDownloadError
				);
			}
		}
	};
	const buttonClass = classNames('download-button', {
		'btn-download-error': downloadError,
	});
	const isDownloaded = imagePickerDownloadedImages?.length && imagePickerDownloadedImages.includes(id) ? true : false;
	const donloadImageText = isMultiSelected
		? __('Download Selected Images', 'kadence-blocks')
		: __('Download Image', 'kadence-blocks');
	let downloadedText = downloadComplete ? __('Download Complete', 'kadence-blocks') : donloadImageText;
	if (downloadError) {
		downloadedText = __('Download Error', 'kadence-blocks');
	}
	if (result && sizes) {
		return (
			<>
				<div className="result-details-container">
					<img src={sizes[0].src} alt={alt} className={'img'} width="150px" height="150px" />
					{isDownloaded && (
						<div className="result-is-downloaded">{__('Already Downloaded', 'kadence-blocks')}</div>
					)}
					<hr />
					<div className="result-details">
						<div class="result-detail" data-setting="photographer">
							<label class="result-detail-label" for="result-detail-photographer">
								{__('Photographer:')}
							</label>
							<div class="result-detail-value" id="result-detail-photographer">
								<a href={photographer_url} target="_blank">
									{photographer}
								</a>
							</div>
						</div>
						<div class="result-detail" data-setting="filename">
							<label class="result-detail-label" for="result-detail-filename">
								{__('Filename:')}
							</label>
							<InputControl
								id={'result-detail-filename'}
								placeholder={__('Optional filename', 'kadence_blocks')}
								value={filenameValue}
								onChange={(value) => setFilenameValue(value ?? '')}
							/>
						</div>
						<div class="result-detail" data-setting="alt">
							<label class="result-detail-label" for="result-detail-alt">
								{__('Alt:')}
							</label>
							<TextareaControl
								id={'result-detail-alt'}
								placeholder={__('Enter image alt', 'kadence_blocks')}
								value={altValue}
								onChange={(value) => setAltValue(value ?? '')}
							/>
						</div>
						<div class="result-detail" data-setting="url">
							<label class="result-detail-label" for="result-detail-url">
								{__('Url:')}
							</label>
							<div class="result-detail-value" id="result-detail-url">
								<a href={url}>{url}</a>
							</div>
						</div>
					</div>
				</div>
				<Button
					onClick={handleDownload}
					isBusy={isDownloading}
					label={downloadedText}
					text={downloadedText}
					disabled={downloadComplete}
					variant={'primary'}
					className={buttonClass}
				/>
			</>
		);
	} else {
		return <div className="result-details-container">{__('No details for this photo')}</div>;
	}
}
