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
	function updateGalleries(collectionId, updatedCollection) {
		if (! collectionId) {
			return {};
		}

		let newCollection = {};
		let updatedCollections = [...wordpressCollections];

		const found = wordpressCollections.findIndex((item) => item.value === collectionId);
		if(found > -1) {
			// update wordpress collection
			const wpCollectionsClone = [...wordpressCollections];
			wpCollectionsClone[found].galleries = updatedCollection;

			newCollection = { label: wpCollectionsClone[found].label, value: wpCollectionsClone[found].value };
		} else {
			// create new collection record
			const matchingPremade = preMadeCollections.find((item) => item.value === collectionId);
			const collectionVersion = wordpressCollections.reduce((acc, item) => {
				if(item.createdFrom === collectionId && item.version > acc) {
					return item.version;
				}
				return acc;
			}, 0);

			newCollection = {
				label: `${matchingPremade.label} (Edited${collectionVersion > 0 ? ` ${collectionVersion + 1}` : ''})`,
				value: `${collectionId}_${collectionVersion}_${new Date().getTime().toString().slice(-6)}`,
				createdFrom: collectionId,
				version: collectionVersion + 1,
				galleries: updatedCollection
			}

			updatedCollections.unshift(newCollection);
		}

		sessionStorage.setItem(COLLECTIONS_CUSTOM_SESSION_KEY, JSON.stringify(updatedCollections));
		setWordpressCollections(updatedCollections);
		return {  label: newCollection.label, value: newCollection.value };
	}

	/**
	 * Create new collection
	 * @param {string} collectionName
	 *
	 * @return {Object} Returns the value and label of the new option
	 */
	function createCollection(collectionName, galleries) {
		if (! collectionName) {
			return {};
		}

		const newCollection = {
			label: collectionName,
			value: `${collectionName.replace(/ /g, '')}_${0}_${new Date().getTime().toString().slice(-6)}`,
			createdFrom: null,
			version: 0,
			galleries: galleries
		}

		const updatedCollections = [
			newCollection,
			...wordpressCollections
		];

		sessionStorage.setItem(COLLECTIONS_CUSTOM_SESSION_KEY, JSON.stringify(updatedCollections));
		setWordpressCollections(updatedCollections);
		return { value: newCollection.value, label: newCollection.label };
	}

	/**
	 * Create new collection
	 * @param {string} collectionName
	 * @param {string} collectionId
	 *
	 * @return {void}
	 */
	function updateCollectionName(collectionName, collectionId) {
		if (! collectionId || ! collectionName) {
			return;
		}

		const matchingIndex = wordpressCollections.findIndex((item) => item.value === collectionId);
		if(matchingIndex === -1) {
			return;
		}

		const toUpdate = [...wordpressCollections];
		toUpdate[matchingIndex].label = collectionName;

		sessionStorage.setItem(COLLECTIONS_CUSTOM_SESSION_KEY, JSON.stringify(toUpdate));
		setWordpressCollections(toUpdate);
		return { value: collectionId, label: collectionName };
	}

	/**
	 * Delete local collection
	 * @param {string} collectionId
	 *
	 * @return {void}
	 */
	function deleteCollection(collectionId) {
		if (! collectionId) {
			return;
		}

		const matchingIndex = wordpressCollections.findIndex((item) => item.value === collectionId);
		if(matchingIndex === -1) {
			return;
		}

		const toUpdate = [...wordpressCollections];
		toUpdate.splice(matchingIndex, 1);

		sessionStorage.setItem(COLLECTIONS_CUSTOM_SESSION_KEY, JSON.stringify(toUpdate));
		setWordpressCollections(toUpdate);
	}

	return {
		loading: !loading && !preMadeLoading ? false : true,
		preMadeCollections,
		wordpressCollections,
		getCollectionGalleries,
		updateGalleries,
		createCollection,
		updateCollectionName,
		deleteCollection
	}
}

