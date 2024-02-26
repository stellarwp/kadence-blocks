import { useEffect, useState } from '@wordpress/element';

export function usePhotos(photos) {
	const [photoGallery, setPhotoGallery] = useState();

	useEffect(() => {
		if (!photos) {
			setPhotoGallery([]);
			return;
		}

		const numPhotos = photos.length;
		if (numPhotos < 12) {
			const numToFill = 12 - numPhotos;
			const filledList = [
				...photos,
				...Array.from(Array(numToFill)).map((item, index) => ({ alt: `placeholder${index + 1}` })),
			];
			setPhotoGallery(filledList);
		} else {
			setPhotoGallery(photos);
		}
	}, [photos]);

	return photoGallery;
}
