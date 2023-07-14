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
	Button,
	SelectControl,
	PhotosCurated,
	PhotosPersonal
} from '../components';
import { useKadenceAi } from '../context/kadence-ai-provider';
import { verticalsHelper } from '../utils/verticals-helper';
import { collectionsHelper } from '../utils/collections-helper';

const styles = {
	selectWrapper: {
		maxWidth: 400,
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
	const [ loading, setLoading ] = useState(false);
	const [ collection, setCollection ] = useState([]);
	const [ verticals, setVerticals ] = useState([]);
	const [ , setCollections ] = useState([]);
	const [ currentPhotoLibrary, setCurrentPhotoLibrary ] = useState('');
	const [ collectionLink, setCollectionLink ] = useState('');
	const { state: { photoLibrary }, dispatch } = useKadenceAi();
	const { getVerticals } = verticalsHelper();
	const { getCollections, getCollectionByIndustry, getCollectionLinkByIndustry } = collectionsHelper();
	
	useEffect(() => {
		getVerticalsData();
	}, []);

	useEffect(() => {
		setLoading(true);
		getPhotoCollection();
		getPhotoCollectionLink();
		setCurrentPhotoLibrary({
			label: photoLibrary,
			value: photoLibrary
		})
	}, [ photoLibrary ]);

	async function getVerticalsData() {
		const verticalsData = await getVerticals();
		const collectionsData = await getCollections();
		const formattedVerticals = formatVerticalsData(verticalsData);

		setVerticals(formattedVerticals);
		setCollections(collectionsData);
	}

	async function getPhotoCollection() {
		const collectionData = await getCollectionByIndustry(photoLibrary);

		setLoading(false);
		setCollection(collectionData);
	}

	async function getPhotoCollectionLink() {
		const link = await getCollectionLinkByIndustry(photoLibrary);

		setCollectionLink(link);
	}

	function formatVerticalsData(data) {
		if (! data) {
			return data;
		}

		const grouped = Object.keys(data).map((vertical) => ({
			label: vertical,
			options:
				data[vertical].map((subVertical) => ({
					label: subVertical,
					value: subVertical,
				}))
		}))

		grouped.push({
			label: __('Media Library', 'kadence-blocks'),
			options: [{
				label: __('My Images', 'kadence-blocks'),
				value: 'My Images'
			}]
		});

		return grouped;
	}

	function handlePhotoLibraryChange(library) {
		dispatch({ type: 'SET_PHOTO_LIBRARY', payload: library.value });
	}

	return (
		<div className="stellarwp-ai-photography-library">
			<Flex justify="center">
				<FlexBlock style={ styles.selectWrapper }>
					<Flex className={ 'stellarwp-ai-photography-library__selection' } direction="column" style={ styles.alignCenter }>
						<SelectControl
							className={ 'stellarwp-ai-photography-control' }
							label={ __('Photo library', 'kadence-blocks') }
							value={ currentPhotoLibrary }
							onChange={ handlePhotoLibraryChange }
							options={ verticals ? verticals : [] }
						/>
						{ photoLibrary !== 'My Images' && (
							<Button
								variant="link"
								text={ __('I\'d like to use my own images', 'kadence-blocks') }
								onClick={ () => dispatch({ type: 'SET_PHOTO_LIBRARY', payload: 'My Images' }) }
							/>
						) }
					</Flex>
				</FlexBlock>
			</Flex>
			{ photoLibrary !== 'My Images' ? (
				<PhotosCurated
					loading={ loading }
					collection={ collection }
					collectionLink={ collectionLink }
				/>
			) : (
				<PhotosPersonal />
			) }
		</div>
	);
}

