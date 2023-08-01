import {
	COLLECTIONS_CUSTOM_SESSION_KEY,
} from '../constants';

import { useState, useEffect } from '@wordpress/element';
import { preMadeCollectionsHelper } from './premade-collection-helper';


export function collectionsHelper() {
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
		const wordpressCollections = JSON.parse(sessionStorage.getItem(COLLECTIONS_CUSTOM_SESSION_KEY)) || [];
		if(!wordpressCollections) {
			sessionStorage.setItem(COLLECTIONS_CUSTOM_SESSION_KEY, JSON.stringify([]));
			setWordpressCollections([]);
		} else {
			setWordpressCollections(wordpressCollections);
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
		if(!wordpressCollections) {

		}
		const foundWordpressCollection = wordpressCollections.find((item) => item.value === collectionId);
		if(foundWordpressCollection) {
			return foundWordpressCollection.galleries;
		}

		const premadeCollection = await getPreMadeCollectionByIndustry(collectionId);
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
			return { label: wpCollectionsClone[found].label, value: wpCollectionsClone[found].value };
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

			sessionStorage.setItem(COLLECTIONS_CUSTOM_SESSION_KEY, JSON.stringify(updatedCollections));
			setWordpressCollections(updatedCollections);
			return { value: newCollection.value, label: newCollection.label };
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

