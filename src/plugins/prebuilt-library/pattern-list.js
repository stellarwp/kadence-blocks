/**
 * Handle Section Library.
 */

/**
 * Globals.
 */
const {
	localStorage,
} = window;

/**
 * External dependencies
 */
 import { debounce } from 'lodash';
import Masonry from 'react-masonry-css'
/**
 * WordPress dependencies
 */

import {
	withSelect,
	withDispatch,
} from '@wordpress/data';
import { rawHandler, parse } from '@wordpress/blocks';
import {
	Button,
	TextControl,
	SelectControl,
	VisuallyHidden,
	ExternalLink,
	Spinner,
} from '@wordpress/components';
import {
	arrowLeft,
	download,
	previous,
	update,
	next,
	chevronLeft,
	chevronDown,
} from '@wordpress/icons';
import { useMemo, useEffect } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';
import { useDebounce, useAsyncList } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import { speak } from '@wordpress/a11y';
import {
	__experimentalBlockPatternsList as BlockPatternsList,
	store as blockEditorStore,
} from '@wordpress/block-editor';
const INITIAL_INSERTER_RESULTS = 4;
function PatternsListHeader( { filterValue, filteredBlockPatternsLength } ) {
	if ( ! filterValue ) {
		return null;
	}
	return (
		<Heading
			level={ 2 }
			lineHeight={ '48px' }
			className="block-editor-block-patterns-explorer__search-results-count"
		>
			{ sprintf(
				/* translators: %d: number of patterns. %s: block pattern search query */
				_n(
					'%1$d pattern found for "%2$s"',
					'%1$d patterns found for "%2$s"',
					filteredBlockPatternsLength
				),
				filteredBlockPatternsLength,
				filterValue
			) }
		</Heading>
	);
}


function PatternList( { patterns, filterValue, selectedCategory, patternCategories } ) {
	// const { testCategories, testPatterns } = useSelect(
	// 	( select ) => {
	// 		const { __experimentalGetAllowedPatterns, getSettings } =
	// 			select( blockEditorStore );
	// 		return {
	// 			testPatterns: __experimentalGetAllowedPatterns(),
	// 			testCategories:
	// 				getSettings().__experimentalBlockPatternCategories,
	// 		};
	// 	},
	// 	[]
	// );
	// console.log( testPatterns );
	const debouncedSpeak = useDebounce( speak, 500 );
	const onSelectBlockPattern = ( info ) => {
		console.log(info );
	}
	const registeredPatternCategories = useMemo(
		() =>
			patternCategories.map(
				( patternCategory ) => patternCategory.name
			),
		[ patternCategories ]
	);

	const filteredBlockPatterns = useMemo( () => {
		const allPatterns = [];
		Object.keys( patterns ).map( function( key, index ) {
			const temp = [];
			temp['title'] = patterns[key].name;
			temp['name'] = patterns[key].name;
			temp['blocks'] = parse( patterns[key].content, {
				__unstableSkipMigrationLogs: true
			  });
			temp['content'] = patterns[key].content;
			temp['categories'] = patterns[key].categories;
			temp['viewportWidth'] = 1200;
			allPatterns.push( temp );
		});
		// if ( ! filterValue ) {
		// 	return allPatterns.filter( ( pattern ) =>
		// 		selectedCategory === 'uncategorized'
		// 			? ! pattern.categories?.length ||
		// 			  pattern.categories.every(
		// 					( category ) =>
		// 						! registeredPatternCategories.includes(
		// 							category
		// 						)
		// 			  )
		// 			: pattern.categories?.includes( selectedCategory )
		// 	);
		// }
		return allPatterns;
	}, [ filterValue, selectedCategory, patterns ] );

	// Announce search results on change.
	useEffect( () => {
		if ( ! filterValue ) {
			return;
		}
		const count = filteredBlockPatterns.length;
		const resultsFoundMessage = sprintf(
			/* translators: %d: number of results. */
			_n( '%d result found.', '%d results found.', count ),
			count
		);
		debouncedSpeak( resultsFoundMessage );
	}, [ filterValue, debouncedSpeak ] );

	const currentShownPatterns = useAsyncList( filteredBlockPatterns, {
		step: INITIAL_INSERTER_RESULTS,
	} );
	//console.log( filteredBlockPatterns );
	const hasItems = !! filteredBlockPatterns?.length;
	return (
		<div className="block-editor-block-patterns-explorer__wrap">
			<div className="block-editor-block-patterns-explorer__list">
				{ hasItems && (
					<PatternsListHeader
						filterValue={ filterValue }
						filteredBlockPatternsLength={ filteredBlockPatterns.length }
					/>
				) }
				{ hasItems && (
					<BlockPatternsList
						shownPatterns={ currentShownPatterns }
						blockPatterns={ filteredBlockPatterns }
						onClickPattern={ onSelectBlockPattern }
						isDraggable={ false }
						showTitlesAsTooltip={ true }
					/>
				) }
			</div>
		</div>
	);
}

export default PatternList;
