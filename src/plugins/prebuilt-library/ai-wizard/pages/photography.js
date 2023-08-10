/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { Flex, FlexBlock, Popover, TextareaControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	PhotosCurated,
	AdvancedSelect,
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
	const { state: { photoLibrary, imageSearchQuery }, dispatch } = useKadenceAi();
	const { preMadeCollections, wordpressCollections, getCollectionGalleries, loading,
		updateGalleries, createCollection, updateCollectionName, deleteCollection } = collectionsHelper();
	const [ allVerticals, setAllVerticals ] = useState( [] );
	const [ loadingSelection, setLoadingSelection ] = useState( false );
	const [ selectedCollection, setSelectedCollection ] = useState([{}, {}]);
	const [ isOpen, setIsOpen ] = useState(false);
	const [ localSearchQuery, setLocalSearchQuery ] = useState('');
	const [popoverAnchor, setPopoverAnchor] = useState();

	useEffect(() => {
		if ( preMadeCollections && wordpressCollections ) {
			setAllVerticals([
				{
					label: __( 'My Collections', 'kadence-blocks' ),
					options: wordpressCollections.map((vert) => ({
						label: vert.label,
						value: vert.value,
						useActions: true,
					}))
				}, {
					label: 'Premade Collections',
					options: preMadeCollections.map((vert) => ({
						label: vert.label,
						value: vert.value,
						useActions: false,
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
		const newValue = updateGalleries(photoLibrary, newCollection);
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

	function createNewCollection(collectionName) {
		const galleries = [
			{ name: 'featured', images: [] },
			{ name: 'background', images: [] }
		];
		const newValue = createCollection(collectionName, galleries);
		handlePhotoLibraryChange(newValue);
	}

	function updateCollection( updatedName, collectionId ) {
		const option = updateCollectionName(updatedName, collectionId);
		if( photoLibrary === option ) {
			handlePhotoLibraryChange(option);
		}
	}

	function removeCollection(collectionId) {
		if(photoLibrary.value === collectionId) {
			handlePhotoLibraryChange(allVerticals[1].options[0]);
		}
		deleteCollection(collectionId);

	}

	return (
		<div className="stellarwp-ai-photography-library">
			<Flex justify="center" style={ styles.topSection }>
				<FlexBlock style={ styles.selectWrapper }>
					<Flex className={ 'stellarwp-ai-photography-library__selection' } direction="row">
						<AdvancedSelect
							label= { __('Use Images From:', 'kadence-blocks') }
							options={ allVerticals || [] }
							value={ allVerticals?.length > 0 ? findOptionWithValue( allVerticals, photoLibrary ) : '' }
							onChange={ ( value ) => {
								handlePhotoLibraryChange( value.value );
							} }
							createRecord={ createNewCollection }
							updateRecord={ updateCollection }
							deleteRecord={ removeCollection }
						/>
					</Flex>
				</FlexBlock>
			</Flex>
			{ photoLibrary === 'aiGenerated' && (
				<div className='ai-generated-search-edit-wrap'>
					<Button
						variant="link"
						disabled={ isOpen }
						ref={ setPopoverAnchor }
						text={__( 'Edit AI Search Query', 'kadence-blocks' )}
						onClick={ () => setIsOpen( true ) }
						style={{ fontSize: '14px'}}
					/>
					{ isOpen && (
						<Popover
							onClose={ () => {
								if ( localSearchQuery && localSearchQuery !== imageSearchQuery ) {
									dispatch({
										type: "SET_IMAGE_SEARCH_QUERY",
										payload: localSearchQuery,
									});
								}
								setIsOpen( false );
							}}
							placement="bottom"
                    		anchor={popoverAnchor}
							className={ 'ai-generated-search-edit-popover-settings' }
						>
							<TextareaControl
								label={__( 'Search Query', 'kadence-blocks' )}
								help={ __( 'Customize the image search query.', 'kadence-blocks' )}
								value={ ( localSearchQuery ? localSearchQuery : imageSearchQuery )}
								onChange={ value => {
									setLocalSearchQuery( value );
								}}
							/>
							<Button
								variant="primary"
								text={__( 'Save', 'kadence-blocks' )}
								onClick={ () => {
									if ( localSearchQuery && localSearchQuery !== imageSearchQuery ) {
										dispatch({
											type: "SET_IMAGE_SEARCH_QUERY",
											payload: localSearchQuery,
										});
									}
									getSelectedGalleries();
									setIsOpen( false );
								} }
							/>
						</Popover>
					) }
				</div>
			) }
			<PhotosCurated
				loading={loadingSelection}
				featured={ selectedCollection[0] || {} }
				background={ selectedCollection[1] || {} }
				updateCollection={ updateCollectionPhotos }
			/>
		</div>
	);
}

