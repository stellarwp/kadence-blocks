import apiFetch from '@wordpress/api-fetch';

/**
 * Get library data.
 *
 * @param {(object)} userData
 *
 * @return {Promise<object>} Promise returns object
 */
async function downloadImage(images) {
	console.log(`images: ${JSON.stringify(images)}`);
	try {
		return await apiFetch({
			path: '/kb-image-picker/v1/process_images',
			method: 'POST',
			data: {
				images: images,
			},
		});
	} catch (error) {
		const message = error?.message ? error.message : error;
		console.log(`ERROR: ${message}`);
		return false;
	}
}
/**
 * Get image response data.
 *
 * @param {Object} data The API results object.
 * @return {Array} 	 The results as an array.
 */
export default async function downloadToMediaLibrary(
	result,
	setIsDownloading,
	setIsDownloaded,
	imagePickerDownloadedImages,
	setImagePickerDownloadedImages,
	setDownloadError
) {
	if (!result) {
		return [];
	}
	setIsDownloading(true);

	// Dispatch API fetch request.
	const response = await downloadImage(result);

	if (response?.[0]?.id) {
		setIsDownloaded(true);
		setIsDownloading(false);

		const wpAttachmentId = response?.[0]?.id;
		const tempIDs = [];
		for (const image of result) {
			if (image?.id) {
				tempIDs.push(image.id);
			}
		}
		setImagePickerDownloadedImages(imagePickerDownloadedImages.concat(tempIDs));

		refreshMediaModal(wpAttachmentId);
	} else {
		setIsDownloaded(false);
		setIsDownloading(false);
		setDownloadError(true);
	}
}

/**
 * Refresh Media Modal and select item after it's been uploaded.
 *
 * @param {string} wpAttachmentId The media modal ID.
 * @since 4.3
 */
function refreshMediaModal(wpAttachmentId) {
	if (window.kadenceImagePickerFrame?.el) {
		const mediaModalEl = window.kadenceImagePickerFrame.el;
		const mediaTab = mediaModalEl.querySelector('#menu-item-browse');
		if (mediaTab) {
			// Open the 'Media Library' tab.
			mediaTab.click();
		}

		// Delay to allow for tab switching
		setTimeout(function () {
			setMediaSelection(wpAttachmentId);
		}, 100);
	}
}

function setMediaSelection(wpAttachmentId) {
	if (
		'undefined' != typeof window.kadenceImagePickerFrame.state() &&
		window.kadenceImagePickerFrame.state() &&
		'undefined' != typeof window.kadenceImagePickerFrame.content &&
		window.kadenceImagePickerFrame.content
	) {
		if (window.kadenceImagePickerFrame.content.get() !== null) {
			// Force a refresh of the media modal content.
			window.kadenceImagePickerFrame.content.get().collection._requery(true);
		}

		// Select the attached that was just uploaded.
		const selection = window.kadenceImagePickerFrame.state().get('selection');
		const selected = parseInt(wpAttachmentId);
		if (selected) {
			selection.add([wp.media.attachment(selected)]);
			selection.single([wp.media.attachment(selected)]);
		}
	} else {
		setTimeout(function () {
			setMediaSelection(wpAttachmentId);
		}, 100);
	}
}
