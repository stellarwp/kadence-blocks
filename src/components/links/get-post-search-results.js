/**
 * WordPress dependencies
 */
 const { apiFetch } = wp;
const { addQueryArgs } = wp.url;
 /**
  * External dependencies
  */
 import map from 'lodash/map';
 import flatten from 'lodash/flatten';
const { decodeEntities } = wp.htmlEntities;
 import { __ } from '@wordpress/i18n';
 
 /**
  * Fetches link suggestions from the API. This function is an exact copy of a function found at:
  *
  * packages/editor/src/components/provider/index.js
  *
  * It seems like there is no suitable package to import this from. Ideally it would be either part of core-data.
  * Until we refactor it, just copying the code is the simplest solution.
  *
  * @param {string} search
  * @param {Object} [searchArguments]
  * @param {number} [searchArguments.isInitialSuggestions]
  * @param {number} [searchArguments.type]
  * @param {number} [searchArguments.subtype]
  * @param {Object} [editorSettings]
  * @param {boolean} [editorSettings.disablePostFormats=false]
  * @return {Promise<Object[]>} List of suggestions
  */
 
 export default function fetchSearchResults(
	search,
 ) {
	const perPage = 20;
 
	const queries = [];
	queries.push(
		apiFetch( {
			path: addQueryArgs( '/wp/v2/search', {
				search,
				per_page: perPage,
				type: 'post',
			} ),
		} ).catch( () => [] ) // fail by returning no results
	);

 	return Promise.all( queries ).then( ( results ) => {
		return map( flatten( results ).slice( 0, perPage ), ( result ) => ( {
			id: result.id,
			url: result.url,
			title: decodeEntities( result.title ) || __( '(no title)' ),
			type: result.subtype || result.type,
		} ) );
	} );
 }