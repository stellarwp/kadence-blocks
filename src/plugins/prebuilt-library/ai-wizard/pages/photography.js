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
	const [ allVerticals, setAllVerticals ] = useState( [] );
	const [ loadingSelection, setLoadingSelection ] = useState( false );
	const [ selectedCollection, setSelectedCollection ] = useState([{}, {}]);

	useEffect(() => {
		if ( preMadeCollections && wordpressCollections ) {
			setAllVerticals([
				{
					label: __( 'My Collections', 'kadence-blocks' ),
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
	async function getSelectedGalleries( newSlug = null ) {
		if ( loadingSelection ) {
			return;
		}
		setLoadingSelection(true);
		const collectionData = await getCollectionGalleries( ( newSlug ? newSlug : photoLibrary ) );
		if ( collectionData ) {
			setSelectedCollection(collectionData);
		}
		setLoadingSelection(false);
	}

	function handlePhotoLibraryChange(library) {
		let newSlug = library;
		if ( library?.value ) {
			newSlug = library.value;
		}
		if ( newSlug !== photoLibrary ) {
			dispatch({ type: 'SET_PHOTO_LIBRARY', payload: newSlug });
			setSelectedCollection([{}, {}]);
			getSelectedGalleries( newSlug );
		} else {
			getSelectedGalleries( newSlug );
		}
	}
	function handlePossiblePhotoLibraryChange(library) {
		let newSlug = library;
		if ( library?.value ) {
			newSlug = library.value;
		}
		if ( newSlug !== photoLibrary ) {
			dispatch({ type: 'SET_PHOTO_LIBRARY', payload: newSlug });
			setSelectedCollection([{}, {}]);
		} else {
			getSelectedGalleries( newSlug );
		}
	}

	function updateCollectionPhotos(galleryIndex, photoList) {
		const newCollection = [
			{ name: 'featured', isLocal:selectedCollection?.[0]?.isLocal ? true : false, images: selectedCollection?.[0]?.images },
			{ name: 'background', isLocal:selectedCollection?.[1]?.isLocal ? true : false, images: selectedCollection?.[1]?.images }
		];
		newCollection[galleryIndex].images = photoList;
		newCollection[galleryIndex].isLocal = true;
		const newValue = updateWordpressCollections(photoLibrary, newCollection);
		handlePossiblePhotoLibraryChange( newValue );
	}
	function findOptionWithValue(arr, value) {
		for (let group of arr) {
			const foundOption = group.options.find(option => option.value === value);
			if (foundOption) {
				return foundOption;
			}
		}
		return null;
	}
	return (
		<div className="stellarwp-ai-photography-library">
			<Flex justify="center" style={ styles.topSection }>
				<FlexBlock style={ styles.selectWrapper }>
					<Flex className={ 'stellarwp-ai-photography-library__selection' } direction="row">
						<SelectControl
							className={ 'stellarwp-ai-photography-control' }
							label={ __('Use Images From:', 'kadence-blocks') }
							value={ allVerticals?.length > 0 ? findOptionWithValue( allVerticals, photoLibrary ) : '' }
							onChange={ ( value ) => {
								handlePhotoLibraryChange( value.value );
							} }
							options={ allVerticals || [] }
							horizontal
						/>
					</Flex>
				</FlexBlock>
			</Flex>
				<PhotosCurated
					loading={loadingSelection}
					featured={ selectedCollection[0] || {} }
					background={ selectedCollection[1] || {} }
					updateCollection={ updateCollectionPhotos }
				/>
		</div>
	);
}

