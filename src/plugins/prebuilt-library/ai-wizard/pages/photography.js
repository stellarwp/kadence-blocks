/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { Flex, FlexBlock } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	SelectControl,
	PhotosCurated,
} from '../components';
import { useKadenceAi } from '../context/kadence-ai-provider';
import { collectionsHelper } from '../utils/collections-helper';

const styles = {
	topSection: {

		borderBottom: '1px solid #DFDFDF',
		marginBottom: '40px',
		paddingBottom: '24px',
		position: 'relative',
		top: '-32px'
	},
	selectWrapper: {
		maxWidth: 500,

	},
	selectControl: {
		width: '100%',
		textAlign: 'center'
	},
	alignCenter: {
		alignItems: 'center'
	}
}

export function Photography() {
	const { state: { photoLibrary }, dispatch } = useKadenceAi();
	const { preMadeCollections, wordpressCollections, getCollectionGalleries, loading, updateWordpressCollections } = collectionsHelper();
	const [allVerticals, setAllVerticals] = useState();
	const [selectedCollection, setSelectedCollection] = useState([]);

	useEffect(() => {
		if(preMadeCollections && wordpressCollections) {
			setAllVerticals([
				{
					label: 'My Collections',
					options: wordpressCollections.map((vert) => ({
						label: vert.label,
						value: vert.value,
					}))
				}, {
					label: 'Premade Collections',
					options: preMadeCollections.map((vert) => ({
						label: vert.label,
						value: vert.value,
					}))
				}
			]);
			getSelectedGalleries();
		}
	}, [preMadeCollections, wordpressCollections]);

	useEffect(() => {
		if(!loading) {
			// Resets the images so they provide immediate feedback
			setSelectedCollection([{}, {}]);
			getSelectedGalleries();
		}
	}, [ photoLibrary, loading]);

	async function getSelectedGalleries() {
		const collectionData = await getCollectionGalleries(photoLibrary.value);
		setSelectedCollection(collectionData);
	}

	function handlePhotoLibraryChange(library) {
		dispatch({ type: 'SET_PHOTO_LIBRARY', payload: library });
	}

	function updateCollectionPhotos(galleryIndex, photoList) {
		const newCollection = [
			{ name: 'featured', images: selectedCollection[0].images },
			{ name: 'background', images: selectedCollection[1].images }
		];
		newCollection[galleryIndex].images = photoList;
		const newValue = updateWordpressCollections(photoLibrary.value, newCollection);
		console.log('new value', newValue);
		handlePhotoLibraryChange(newValue);
	}

	return (
		<div className="stellarwp-ai-photography-library">
			<Flex justify="center" style={ styles.topSection }>
				<FlexBlock style={ styles.selectWrapper }>
					<Flex className={ 'stellarwp-ai-photography-library__selection' } direction="row">
						<SelectControl
							className={ 'stellarwp-ai-photography-control' }
							label={ __('Use Images From:', 'kadence-blocks') }
							value={ photoLibrary }
							onChange={ handlePhotoLibraryChange }
							options={ allVerticals || [] }
							horizontal
						/>
					</Flex>
				</FlexBlock>
			</Flex>
				<PhotosCurated
					featured={ selectedCollection[0] || {} }
					background={ selectedCollection[1] || {} }
					updateCollection={ updateCollectionPhotos }
				/>
		</div>
	);
}

