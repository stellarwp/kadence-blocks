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
import InfiniteScroll from 'react-infinite-scroller';
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
	Tooltip,
	__experimentalHeading as Heading,
	__unstableComposite as Composite,
	__unstableUseCompositeState as useCompositeState,
	__unstableCompositeItem as CompositeItem,
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
import { BlockPreview } from './block-preview';
import { useMemo, useEffect, useState } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';
import { useDebounce, useAsyncList, useInstanceId } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import { speak } from '@wordpress/a11y';
import { searchItems } from './search-items';
import replaceColors from './block-preview/replace-colors';
import replaceImages from './block-preview/replace-images';
import replaceContent from './block-preview/replace-content';
import deleteContent from './block-preview/remove-content';
import KadenceBlockPatternList from './block-pattern-list';
import {
	//BlockPreview,
	store as blockEditorStore,
} from '@wordpress/block-editor';
const INITIAL_INSERTER_RESULTS = 2;
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
function BuildPageContent( rows ) {
	if ( ! rows ) {
		return '';
	}
	let tempContent = '';
	Object.keys( rows ).map( function( key, index ) {
		const rowStyle = rows[key]['pattern_style'];
		const rowStart = `<!-- wp:kadence/column {"borderWidth":["","","",""],"uniqueID":"_f8d4f6-${key}","borderStyle":[{"top":["","",""],"right":["","",""],"bottom":["","",""],"left":["","",""],"unit":"px"}],"className":"kb-pattern-preview-${rowStyle}"} --><div class="wp-block-kadence-column kadence-column_f8d4f6-${key} kb-pattern-preview-${rowStyle}"><div class="kt-inside-inner-col">`;
		const rowEnd = `</div></div><!-- /wp:kadence/column -->`;
		const rowContent = rowStart + rows[key]['pattern_content'] + rowEnd;
		tempContent = tempContent.concat( rowContent );
	} );
	return tempContent;
}
function BuildPageImportContent( rows ) {
	if ( ! rows ) {
		return '';
	}
	let tempContent = '';
	Object.keys( rows ).map( function( key, index ) {
		const rowStyle = rows[key]['pattern_style'];
		let rowContent = rows[key]['pattern_content'];
		rowContent = deleteContent( rowContent );
		if ( 'dark' === rowStyle ) {
			rowContent = replaceColors( rowContent, 'dark' );
		} else if ( 'highlight' === rowStyle ) {
			rowContent = replaceColors( rowContent, 'highlight' );
		}
		tempContent = tempContent.concat( rowContent );
	} );
	return tempContent;
}

function PageList( {
	pages,
	filterValue,
	selectedCategory,
	selectedStyle = 'light',
	breakpointCols,
	onSelect
} ) {
	const debouncedSpeak = useDebounce( speak, 500 );
	const onSelectBlockPattern = ( info ) => {
		const pageSend = {
			id: info.id,
			slug:info.slug,
			type: 'page',
			style: 'light',
		}
		pageSend.content = BuildPageImportContent( info.rows );
		onSelect( pageSend );
		// if ( ! selectedStyle || 'light' === selectedStyle ) {
		// 	onSelect( newInfo );
		// } else if ( 'dark' === selectedStyle ) {
		// 	newInfo = replaceColors( newInfo, 'dark' );
		// 	onSelect( newInfo );
		// } else if ( 'highlight' === selectedStyle ) {
		// 	newInfo = replaceColors( newInfo, 'highlight' );
		// 	onSelect( newInfo );
		// }
	}
	const filteredBlockPatterns = useMemo( () => {
		let allPatterns = [];
		let variation = 1;
		Object.keys( pages ).map( function( key, index ) {
			const temp = [];
			if ( variation === 4 ) {
				variation = 1;
			}
			temp['title'] = pages[key].name;
			temp['name'] = pages[key].name;
			temp['rows'] = pages[key].rows;
			let tempContent = BuildPageContent( pages[key].rows );
			temp['categories'] = pages[key].categories ? Object.keys( pages[key].categories ) : [];
			temp['keywords'] = pages[key].keywords ? pages[key].keywords : [];
			// if ( savedAI ) {
			// 	tempContent = replaceImages( tempContent, images, temp['categories'], 'general', variation );
			// 	tempContent = replaceContent( tempContent, aiContent, temp['categories'], 'general', variation );
			// }
			// temp['blocks'] = parse( tempContent, {
			// 	__unstableSkipMigrationLogs: true
			//   });
			temp['content'] = tempContent;
			temp['html'] = pages[key].rows_html;
			temp['pro'] = pages[key].pro;
			temp['locked'] = ( pages[key].pro && 'true' !== kadence_blocks_params.pro ? true : false );
			temp['proRender'] = ( temp['keywords'].includes('Requires Pro') ? true : false );
			temp['viewportWidth'] = 1200;
			variation ++;
			allPatterns.push( temp );
		});
		if ( ! filterValue && selectedCategory && 'all' !== selectedCategory ) {
			allPatterns = allPatterns.filter( ( pattern ) =>
				pattern.categories?.includes( selectedCategory )
			);
		}
		// if ( allPatterns.length > 30 ) {
		// 	console.log( 'here' );
		// 	allPatterns = allPatterns.slice(0, 30);
		// }
		return searchItems( allPatterns, filterValue );
	}, [ filterValue, selectedCategory, pages ] );

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

	// Define selected style.
	const customStyles = useMemo( () => {
		let newStyles = '';
		let globalColors = '';
		let colorClasses = '';
		if ( ! kadence_blocks_params.isKadenceT ) {
			globalColors = `
				--global-palette1:${kadence_blocks_params.global_colors['--global-palette1']};
				--global-palette2:${kadence_blocks_params.global_colors['--global-palette2']};
				--global-palette3:${kadence_blocks_params.global_colors['--global-palette3']};
				--global-palette4:${kadence_blocks_params.global_colors['--global-palette4']};
				--global-palette5:${kadence_blocks_params.global_colors['--global-palette5']};
				--global-palette6:${kadence_blocks_params.global_colors['--global-palette6']};
				--global-palette7:${kadence_blocks_params.global_colors['--global-palette7']};
				--global-palette8:${kadence_blocks_params.global_colors['--global-palette8']};
				--global-palette9:${kadence_blocks_params.global_colors['--global-palette9']};
			`;
			colorClasses = `:root .has-theme-palette-1-color { color: var(--global-palette1); }
			:root .has-theme-palette-2-color { color: var(--global-palette2); }
			:root .has-theme-palette-3-color { color: var(--global-palette3); }
			:root .has-theme-palette-4-color { color: var(--global-palette4); }
			:root .has-theme-palette-5-color { color: var(--global-palette5); }
			:root .has-theme-palette-6-color { color: var(--global-palette6); }
			:root .has-theme-palette-7-color { color: var(--global-palette7); }
			:root .has-theme-palette-8-color { color: var(--global-palette8); }
			:root .has-theme-palette-9-color { color: var(--global-palette9); }
			:root .has-theme-palette1-color { color: var(--global-palette1); }
			:root .has-theme-palette2-color { color: var(--global-palette2); }
			:root .has-theme-palette3-color { color: var(--global-palette3); }
			:root .has-theme-palette4-color { color: var(--global-palette4); }
			:root .has-theme-palette5-color { color: var(--global-palette5); }
			:root .has-theme-palette6-color { color: var(--global-palette6); }
			:root .has-theme-palette7-color { color: var(--global-palette7); }
			:root .has-theme-palette8-color { color: var(--global-palette8); }
			:root .has-theme-palette9-color { color: var(--global-palette9); }
			:root .has-theme-palette1-background-color { background-color: var(--global-palette1); }
			:root .has-theme-palette2-background-color { background-color: var(--global-palette2); }
			:root .has-theme-palette3-background-color { background-color: var(--global-palette3); }
			:root .has-theme-palette4-background-color { background-color: var(--global-palette4); }
			:root .has-theme-palette5-background-color { background-color: var(--global-palette5); }
			:root .has-theme-palette6-background-color { background-color: var(--global-palette6); }
			:root .has-theme-palette7-background-color { background-color: var(--global-palette7); }
			:root .has-theme-palette8-background-color { background-color: var(--global-palette8); }
			:root .has-theme-palette9-background-color { background-color: var(--global-palette9); }`
		}

		const normalizeStyles = `--global-content-edge-padding: 3rem;padding:0px !important;`;
		newStyles = [
			{ css: `:root {margin-block:0;}body{${normalizeStyles} ${globalColors}}.single-iframe-content .kb-pattern-delete-block {display: none;}${colorClasses}` }
		];
		return newStyles;
	}, [ selectedStyle ] );
	// Define selected style.
	const customShadowStyles = useMemo( () => {
		let newStyles = '';
		let globalColors = '';
		let colorClasses = '';
		if ( ! kadence_blocks_params.isKadenceT ) {
			globalColors = `
				--global-palette1:${kadence_blocks_params.global_colors['--global-palette1']};
				--global-palette2:${kadence_blocks_params.global_colors['--global-palette2']};
				--global-palette3:${kadence_blocks_params.global_colors['--global-palette3']};
				--global-palette4:${kadence_blocks_params.global_colors['--global-palette4']};
				--global-palette5:${kadence_blocks_params.global_colors['--global-palette5']};
				--global-palette6:${kadence_blocks_params.global_colors['--global-palette6']};
				--global-palette7:${kadence_blocks_params.global_colors['--global-palette7']};
				--global-palette8:${kadence_blocks_params.global_colors['--global-palette8']};
				--global-palette9:${kadence_blocks_params.global_colors['--global-palette9']};
			`;
			colorClasses = `.single-iframe-content .has-theme-palette-1-color { color: var(--global-palette1); }
			.single-iframe-content .has-theme-palette-2-color { color: var(--global-palette2); }
			.single-iframe-content .has-theme-palette-3-color { color: var(--global-palette3); }
			.single-iframe-content .has-theme-palette-4-color { color: var(--global-palette4); }
			.single-iframe-content .has-theme-palette-5-color { color: var(--global-palette5); }
			.single-iframe-content .has-theme-palette-6-color { color: var(--global-palette6); }
			.single-iframe-content .has-theme-palette-7-color { color: var(--global-palette7); }
			.single-iframe-content .has-theme-palette-8-color { color: var(--global-palette8); }
			.single-iframe-content .has-theme-palette-9-color { color: var(--global-palette9); }
			.single-iframe-content .has-theme-palette1-color { color: var(--global-palette1); }
			.single-iframe-content .has-theme-palette2-color { color: var(--global-palette2); }
			.single-iframe-content .has-theme-palette3-color { color: var(--global-palette3); }
			.single-iframe-content .has-theme-palette4-color { color: var(--global-palette4); }
			.single-iframe-content .has-theme-palette5-color { color: var(--global-palette5); }
			.single-iframe-content .has-theme-palette6-color { color: var(--global-palette6); }
			.single-iframe-content .has-theme-palette7-color { color: var(--global-palette7); }
			.single-iframe-content .has-theme-palette8-color { color: var(--global-palette8); }
			.single-iframe-content .has-theme-palette9-color { color: var(--global-palette9); }
			.single-iframe-content .has-theme-palette1-background-color { background-color: var(--global-palette1); }
			.single-iframe-content .has-theme-palette2-background-color { background-color: var(--global-palette2); }
			.single-iframe-content .has-theme-palette3-background-color { background-color: var(--global-palette3); }
			.single-iframe-content .has-theme-palette4-background-color { background-color: var(--global-palette4); }
			.single-iframe-content .has-theme-palette5-background-color { background-color: var(--global-palette5); }
			.single-iframe-content .has-theme-palette6-background-color { background-color: var(--global-palette6); }
			.single-iframe-content .has-theme-palette7-background-color { background-color: var(--global-palette7); }
			.single-iframe-content .has-theme-palette8-background-color { background-color: var(--global-palette8); }
			.single-iframe-content .has-theme-palette9-background-color { background-color: var(--global-palette9); }`
		}

		const normalizeStyles = `--global-content-edge-padding: 3rem;padding:0px !important;`;
		newStyles = [
			{ css: `.single-iframe-content{${normalizeStyles} ${globalColors}}.pattern-shadow-wrap .single-iframe-content {--global-content-width:1200px }.single-iframe-content .kb-pattern-delete-block {display: none;}${colorClasses}` }
		];
		return newStyles;
	}, [ selectedStyle ] );
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
					<KadenceBlockPatternList
						selectedCategory={ selectedCategory }
						blockPatterns={ filteredBlockPatterns }
						onClickPattern={ onSelectBlockPattern }
						showTitlesAsTooltip={ false }
						customStyles={ customStyles }
						customShadowStyles={ customShadowStyles }
						breakpointCols={ breakpointCols }
						patternType={ 'page' }
					/>
				) }
			</div>
		</div>
	);
}

export default PageList;
