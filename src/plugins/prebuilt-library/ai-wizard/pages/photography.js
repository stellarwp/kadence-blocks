/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { Flex, FlexBlock, Popover, TextareaControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { PhotosCurated, AdvancedSelect } from '../components';
import { useKadenceAi } from '../context/kadence-ai-provider';
import { collectionsHelper } from '../utils/collections-helper';

const styles = {
	topSection: {
		borderBottom: '1px solid #DFDFDF',
		marginBottom: '40px',
		paddingBottom: '24px',
		position: 'relative',
	},
	selectWrapper: {
		maxWidth: 500,
	},
	selectControl: {
		width: '100%',
		textAlign: 'center',
	},
	alignCenter: {
		alignItems: 'center',
	},
};

export function Photography(props) {
	const { photographyOnly } = props;
	const {
		state: { photoLibrary, imageSearchQuery },
		dispatch,
	} = useKadenceAi();
	const {
		preMadeCollections,
		wordpressCollections,
		getCollectionGalleries,
		updateGalleries,
		createCollection,
		updateCollectionName,
		deleteCollection,
	} = collectionsHelper();
	const [allVerticals, setAllVerticals] = useState([]);
	const [loadingSelection, setLoadingSelection] = useState(false);
	const [selectedCollection, setSelectedCollection] = useState([{}, {}]);
	const [isOpen, setIsOpen] = useState(false);
	const [localSearchQuery, setLocalSearchQuery] = useState('');
	const [isSearchQueryCleared, setIsSearchQueryCleared] = useState(false);
	const [popoverAnchor, setPopoverAnchor] = useState();

	useEffect(() => {
		dispatch({ type: 'SET_PHOTO_LIBRARY_CHANGED', payload: false });
	}, []);

	useEffect(() => {
		if (preMadeCollections && wordpressCollections) {
			setAllVerticals([
				{
					label: __('My Collections', 'kadence-blocks'),
					options: wordpressCollections.map((vert) => ({
						label: vert.label,
						value: vert.value,
						useActions: true,
					})),
				},
				{
					label: 'Premade Collections',
					options: preMadeCollections.map((vert) => ({
						label: vert.label,
						value: vert.value,
						useActions: false,
					})),
				},
			]);
			getSelectedGalleries();
		}
	}, [preMadeCollections, wordpressCollections]);
	useEffect(() => {
		if (preMadeCollections && wordpressCollections) {
			getSelectedGalleries();
		}
	}, [imageSearchQuery]);
	async function getSelectedGalleries(newSlug = null) {
		if (loadingSelection) {
			return;
		}
		setLoadingSelection(true);
		const collectionData = await getCollectionGalleries(newSlug ? newSlug : photoLibrary);
		if (collectionData) {
			setSelectedCollection(collectionData);
		}
		setLoadingSelection(false);
	}

	function handlePhotoLibraryChange(library) {
		let newSlug = library;
		if (library?.value) {
			newSlug = library.value;
		}
		if (newSlug !== photoLibrary) {
			dispatch({ type: 'SET_PHOTO_LIBRARY', payload: newSlug });
			dispatch({ type: 'SET_PHOTO_LIBRARY_CHANGED', payload: true });
			setSelectedCollection([{}, {}]);
			getSelectedGalleries(newSlug);
		} else {
			dispatch({ type: 'SET_PHOTO_LIBRARY_CHANGED', payload: false });
			getSelectedGalleries(newSlug);
		}
	}
	function handlePossiblePhotoLibraryChange(library) {
		let newSlug = library;
		if (library?.value) {
			newSlug = library.value;
		}
		if (newSlug !== photoLibrary) {
			dispatch({ type: 'SET_PHOTO_LIBRARY', payload: newSlug });
			dispatch({ type: 'SET_PHOTO_LIBRARY_CHANGED', payload: true });
			setSelectedCollection([{}, {}]);
		} else {
			getSelectedGalleries(newSlug);
		}
	}

	function updateCollectionPhotos(galleryIndex, photoList) {
		const newCollection = [
			{ name: 'featured', isLocal: !!selectedCollection?.[0]?.isLocal, images: selectedCollection?.[0]?.images },
			{
				name: 'background',
				isLocal: !!selectedCollection?.[1]?.isLocal,
				images: selectedCollection?.[1]?.images,
			},
		];
		newCollection[galleryIndex].images = photoList;
		newCollection[galleryIndex].isLocal = true;
		const newValue = updateGalleries(photoLibrary, newCollection);
		handlePossiblePhotoLibraryChange(newValue);
	}
	function findOptionWithValue(arr, value) {
		for (const group of arr) {
			const foundOption = group.options.find((option) => option.value === value);
			if (foundOption) {
				return foundOption;
			}
		}
		return null;
	}

	function createNewCollection(collectionName) {
		const galleries = [
			{ name: 'featured', images: [] },
			{ name: 'background', images: [] },
		];
		const newValue = createCollection(collectionName, galleries);
		handlePhotoLibraryChange(newValue);
	}

	function updateCollection(updatedName, collectionId) {
		const option = updateCollectionName(updatedName, collectionId);

		if (photoLibrary === option) {
			handlePhotoLibraryChange(option);
		}
	}

	function removeCollection(collectionId) {
		if (photoLibrary === collectionId) {
			handlePhotoLibraryChange(allVerticals[1].options[0]);
		}
		deleteCollection(collectionId);
	}
	const isPremade =
		photoLibrary &&
		preMadeCollections &&
		preMadeCollections.filter((collection) => collection.value === photoLibrary);

	return (
		<div className="stellarwp-ai-photography-library">
			<Flex justify="center" style={styles.topSection}>
				<FlexBlock style={styles.selectWrapper}>
					<Flex className={'stellarwp-ai-photography-library__selection'} direction="row">
						<AdvancedSelect
							label={__('Use Images From:', 'kadence-blocks')}
							options={allVerticals || []}
							value={allVerticals?.length > 0 ? findOptionWithValue(allVerticals, photoLibrary) : ''}
							onChange={(collection) => {
								handlePhotoLibraryChange(collection.value);
							}}
							createRecord={createNewCollection}
							updateRecord={updateCollection}
							deleteRecord={removeCollection}
						/>
					</Flex>
				</FlexBlock>
			</Flex>
			{photoLibrary !== 'aiGenerated' && (
				<>
					{isPremade && (
						<div className="kb-photography-explained-wrap">
							<p>
								{__(
									"Fine-tune your collection by selecting 'Edit Collection' below.",
									'kadence-blocks'
								)}
							</p>
							<p>{__('or -', 'kadence-blocks')}</p>
							<p>
								{__(
									"Kickstart your collection with the 'AI Search Collection' or create your own from scratch using the drop-down menu above.",
									'kadence-blocks'
								)}
							</p>
						</div>
					)}
					{!isPremade && (
						<div className="kb-photography-explained-wrap">
							<p>
								{__(
									"Fine-tune your collection by selecting 'Edit Collection' below.",
									'kadence-blocks'
								)}
							</p>
							<p>{__('or -', 'kadence-blocks')}</p>
							<p>
								{__(
									"Kickstart your collection with the 'AI Search Collection' or explore our pre-made collections using the drop-down menu above.",
									'kadence-blocks'
								)}
							</p>
						</div>
					)}
				</>
			)}
			{photoLibrary === 'aiGenerated' && (
				<div className="kb-photography-explained-wrap ai-generated-search-edit-wrap">
					<p className="ai-generated-search-edit-text">
						{!photographyOnly &&
							__(
								'Ta-Da! We searched the Pexels Image Library to find royalty-free images for your site.',
								'kadence-blocks'
							)}
						{!photographyOnly && <br></br>}
						{__('You can adjust search terms by clicking', 'kadence-blocks')}
						<Button
							variant="link"
							disabled={isOpen}
							ref={setPopoverAnchor}
							text={__('Edit AI Search Query', 'kadence-blocks')}
							onClick={() => setIsOpen(true)}
							style={{ fontSize: '14px' }}
						/>
						{__("or fine-tune your collection by selecting 'Edit Collection' below.", 'kadence-blocks')}
					</p>
					<p>{__('or -', 'kadence-blocks')}</p>
					<p>
						{__(
							'Explore our pre-made collections or create your own from scratch using the drop-down menu above.',
							'kadence-blocks'
						)}
					</p>
					{isOpen && (
						<Popover
							onClose={() => {
								if (localSearchQuery && localSearchQuery !== imageSearchQuery) {
									dispatch({
										type: 'SET_IMAGE_SEARCH_QUERY',
										payload: localSearchQuery,
									});
								}
								setIsOpen(false);
							}}
							placement="bottom"
							anchor={popoverAnchor}
							className={'ai-generated-search-edit-popover-settings'}
						>
							<TextareaControl
								label={__('Search Query', 'kadence-blocks')}
								help={__('Customize the image search query.', 'kadence-blocks')}
								value={
									isSearchQueryCleared
										? ''
										: localSearchQuery !== ''
											? localSearchQuery
											: imageSearchQuery
								}
								onChange={(value) => {
									value === '' ? setIsSearchQueryCleared(true) : setIsSearchQueryCleared(false);
									setLocalSearchQuery(value);
								}}
								onKeyDown={(event) => {
									if (event.keyCode === ENTER) {
										event.preventDefault();
										if (localSearchQuery && localSearchQuery !== imageSearchQuery) {
											dispatch({
												type: 'SET_IMAGE_SEARCH_QUERY',
												payload: localSearchQuery,
											});
											setSelectedCollection([{}, {}]);
										}
										setIsOpen(false);
									}
								}}
							/>
							<Button
								variant="primary"
								text={__('Save', 'kadence-blocks')}
								onClick={() => {
									if (localSearchQuery && localSearchQuery !== imageSearchQuery) {
										dispatch({
											type: 'SET_IMAGE_SEARCH_QUERY',
											payload: localSearchQuery,
										});
										setSelectedCollection([{}, {}]);
									}
									setIsOpen(false);
								}}
							/>
						</Popover>
					)}
				</div>
			)}
			<PhotosCurated
				loading={loadingSelection}
				featured={selectedCollection[0] || {}}
				background={selectedCollection[1] || {}}
				updateCollection={updateCollectionPhotos}
			/>
		</div>
	);
}
