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
	const [ collections, setCollections ] = useState([]);
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
	}, [ photoLibrary ]);

	async function getVerticalsData() {
		const verticalsData = await getVerticals();
		const collectionsData = await getCollections();

		setVerticals(verticalsData);
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

	function handlePhotoLibraryChange(value) {
		dispatch({ type: 'SET_PHOTO_LIBRARY', payload: value });
	}

	return (
		<div className="stellarwp-ai-photography-library">
			<Flex justify="center">
				<FlexBlock style={ styles.selectWrapper }>
					<Flex className={ 'stellarwp-ai-photography-library__selection' } direction="column" style={ styles.alignCenter }>
						<SelectControl
							className={ 'stellarwp-ai-photography-control' }
							label={ __('Photo library', 'kadence') }
							value={ photoLibrary }
							onChange={ handlePhotoLibraryChange }
						>
							{
								verticals && (
									Object.keys(verticals).map((vertical) => (
										<optgroup label={ vertical }>{
											verticals[vertical].map((subVertical) => (
												<option value={ subVertical }>{ subVertical }</option>
											))
										}</optgroup>
									))
								)
							}
							<option value="My Images">{ __('My Images', 'kadence') }</option>
						</SelectControl>
						{ photoLibrary !== 'My Images' && (
							<Button
								variant="link"
								text={ __('I\'d like to use my own images', 'kadence') }
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

