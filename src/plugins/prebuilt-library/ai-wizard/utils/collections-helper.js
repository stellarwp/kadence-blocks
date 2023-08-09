import {
	COLLECTIONS_CUSTOM_SESSION_KEY,
} from '../constants';

import { useState, useEffect } from '@wordpress/element';
import { preMadeCollectionsHelper } from './premade-collection-helper';
import { useKadenceAi } from '../context/kadence-ai-provider';

export function collectionsHelper() {
	const { state: { customCollections, imageSearchQuery }, dispatch } = useKadenceAi();
	const { loading: preMadeLoading, verticals: preMadeCollections, getPreMadeCollectionByIndustry } = preMadeCollectionsHelper();
	const [loading, setLoading] = useState(true);
	const [wordpressCollections, setWordpressCollections] = useState();

	useEffect(() => {
		setLoading(true);
		initCollections();
	}, []);

	/**
	 * Initialize the Local collections
	 *
	 * @return {void}
	 */
	function initCollections() {
		if( ! customCollections ) {
			const temp = [ { label: __('My Images', 'kadence-blocks-pro'), value: 'my-collections', galleries: [
				{ name: 'featured', isLocal: true, images: [] },
				{ name: 'background', isLocal: true, images: [] }
			] } ];
			setWordpressCollections( temp );
		} else {
			setWordpressCollections( customCollections );
		}
		setLoading(false);
	}


	/**
	 * Get the galleries for a collection
	 * @param {string} collectionId
	 *
	 * @return {promise<object[]>}
	*/
	async function getCollectionGalleries(collectionId) {
		if ( ! collectionId || ! wordpressCollections ) {
			return;
		}
		if ( wordpressCollections && wordpressCollections.length > 0 ) {
			const foundWordpressCollection = wordpressCollections.find((item) => item.value === collectionId);
			if( foundWordpressCollection ) {
				return foundWordpressCollection.galleries;
			}
		}
		const premadeCollection = await getPreMadeCollectionByIndustry(collectionId, imageSearchQuery );
		return premadeCollection;
	}

	/**
	 * Updates Local collections
	 * @param {string} collectionId
	 * @param {object} updatedCollection
	 *
	 * @return {Object} Returns the value and label of the new option
	 */
	function updateWordpressCollections(collectionId, updatedCollection) {
		if (! collectionId) {
			return '';
		}

		const found = wordpressCollections.findIndex((item) => item.value === collectionId);
		if(found > -1) {
			// update wordpress collection
			const wpCollectionsClone = [...wordpressCollections];
			wpCollectionsClone[found].galleries = updatedCollection;
			dispatch({ type: "SET_CUSTOM_COLLECTIONS", payload: wpCollectionsClone });
			setWordpressCollections(wpCollectionsClone);
			return wpCollectionsClone[found].value;
		} else {
			// create new collection record
			const matchingPremade = preMadeCollections.find((item) => item.value === collectionId);
			const collectionVersion = wordpressCollections.reduce((acc, item) => {
				if(item.createdFrom === collectionId && item.version > acc) {
					return item.version;
				}
				return acc;
			}, 0);

			const newCollection = {
				label: `${matchingPremade.label} (Edited${collectionVersion > 0 ? ` ${collectionVersion + 1}` : ''})`,
				value: `${collectionId}_${collectionVersion}_${new Date().getTime().toString().slice(-6)}`,
				createdFrom: collectionId,
				version: collectionVersion + 1,
				galleries: updatedCollection
			}

			const updatedCollections = [
				newCollection,
				...wordpressCollections
			];
			dispatch({ type: "SET_CUSTOM_COLLECTIONS", payload: updatedCollections });
			setWordpressCollections(updatedCollections);
			return newCollection.value;
		}

	}

	return {
		loading: !loading && !preMadeLoading ? false : true,
		preMadeCollections,
		wordpressCollections,
		getCollectionGalleries,
		updateWordpressCollections
	}
}

