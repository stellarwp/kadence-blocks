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
const WithToolTip = ( { showTooltip, title, children } ) => {
	if ( showTooltip ) {
		return <Tooltip text={ title }>{ children }</Tooltip>;
	}
	return <>{ children }</>;
};
function KadenceBlockPattern( {
	pattern,
	onClick,
	onHover,
	composite,
	showTooltip,
	customStyles,
} ) {
	const { blocks, viewportWidth } = pattern;
	const instanceId = useInstanceId( KadenceBlockPattern );
	const descriptionId = `block-editor-block-patterns-list__item-description-${ instanceId }`;
	return (
		<div
			className="block-editor-block-patterns-list__list-item"
		>
			<WithToolTip
				showTooltip={ showTooltip }
				title={ pattern.title }
			>
				<CompositeItem
					role="option"
					as="div"
					{ ...composite }
					className="block-editor-block-patterns-list__item"
					onClick={ () => {
						onClick( pattern, blocks );
						onHover?.( null );
					} }
					onMouseEnter={ () => {
						onHover?.( pattern );
					} }
					onMouseLeave={ () => onHover?.( null ) }
					aria-label={ pattern.title }
					aria-describedby={
						pattern.description ? descriptionId : undefined
					}
				>
					<BlockPreview
						blocks={ blocks }
						viewportWidth={ viewportWidth }
						additionalStyles={ customStyles }
					/>
					{ ! showTooltip && (
						<div className="block-editor-block-patterns-list__item-title">
							{ pattern.title }
						</div>
					) }
					{ !! pattern.description && (
						<VisuallyHidden id={ descriptionId }>
							{ pattern.description }
						</VisuallyHidden>
					) }
				</CompositeItem>
			</WithToolTip>
		</div>
	);
}
function BlockPatternPlaceholder() {
	return (
		<div className="block-editor-block-patterns-list__item is-placeholder" />
	);
}

function KadenceBlockPatternList( {
	blockPatterns,
	shownPatterns,
	onHover,
	onClickPattern,
	orientation,
	label = __( 'Block Patterns', 'kadence-blocks' ),
	showTitlesAsTooltip,
	customStyles,
	breakpointCols,
} ) {
	const composite = useCompositeState( { orientation } );
	const showItems = (patterns) => {
		console.log( records );
		var items = [];
		for (var i = 0; i < records; i++) {
			if ( undefined !== patterns[i]?.name ) {
				items.push(
					<KadenceBlockPattern
						key={ patterns[i]?.name || i }
						pattern={ patterns[i] }
						onClick={ onClickPattern }
						onHover={ onHover }
						composite={ composite }
						showTooltip={ showTitlesAsTooltip }
						customStyles={ customStyles }
					/>
				);
			}
		}
		return items;
	};
	const itemsPerPage = 6;
	const [hasMore, setHasMore] = useState(true);
	const [records, setrecords] = useState(itemsPerPage);
	const loadMore = () => {
		if ( records >= blockPatterns.length ) {
			setHasMore(false);
		} else {
			setTimeout(() => {
				setrecords(records + itemsPerPage);
			}, 1500);
		}
	};
	return ( 
		<div className="block-editor-block-patterns-list">
			<InfiniteScroll
				className="block-editor-block-patterns-list-wrap"
				pageStart={0}
				loadMore={loadMore}
				hasMore={hasMore}
				loader={<Spinner />}
				useWindow={false}
				>
					<Masonry
						breakpointCols={breakpointCols}
						className={ `kb-css-masonry kb-core-section-library` }
  						columnClassName="kb-css-masonry_column"
					>
						{showItems(blockPatterns)}
					</Masonry>
			</InfiniteScroll>
		</div>
	);
}

function PatternList( { patterns, filterValue, selectedCategory, patternCategories, selectedStyle = 'light', breakpointCols  } ) {
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
		let allPatterns = [];
		Object.keys( patterns ).map( function( key, index ) {
			const temp = [];
			temp['title'] = patterns[key].name;
			temp['name'] = patterns[key].name;
			temp['blocks'] = parse( patterns[key].content, {
				__unstableSkipMigrationLogs: true
			  });
			temp['content'] = patterns[key].content;
			temp['categories'] = patterns[key].categories ? Object.keys( patterns[key].categories ) : [];
			temp['viewportWidth'] = 1200;
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

	// Define selected style.
	const customStyles = useMemo( () => {
		let newStyles = '';
		if ( ! selectedStyle || 'light' === selectedStyle ) {
			return newStyles;
		}
		if ( 'dark' === selectedStyle ) {
			const tempStyles = `--global-palette1:${kadence_blocks_params.global_colors['--global-palette1']};
			--global-palette2:${kadence_blocks_params.global_colors['--global-palette2']};
			--global-palette3:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette4:${kadence_blocks_params.global_colors['--global-palette8']};
			--global-palette5:${kadence_blocks_params.global_colors['--global-palette7']};
			--global-palette6:${kadence_blocks_params.global_colors['--global-palette7']};
			--global-palette7:${kadence_blocks_params.global_colors['--global-palette3']};
			--global-palette8:${kadence_blocks_params.global_colors['--global-palette3']};
			--global-palette9:${kadence_blocks_params.global_colors['--global-palette4']};`;
			newStyles = [
				{ css: `body { ${tempStyles} }.kb-btns-outer-wrap {--global-palette9:${kadence_blocks_params.global_colors['--global-palette9']}}img[src="https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Logo-ploaceholder.png"] {filter: invert(1);}` }
			];
		} else if ( 'highlight' === selectedStyle ) {
			const tempStyles = `--global-palette1:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette2:${kadence_blocks_params.global_colors['--global-palette8']};
			--global-palette3:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette4:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette5:${kadence_blocks_params.global_colors['--global-palette8']};
			--global-palette6:${kadence_blocks_params.global_colors['--global-palette8']};
			--global-palette7:${kadence_blocks_params.global_colors['--global-palette2']};
			--global-palette8:${kadence_blocks_params.global_colors['--global-palette2']};
			--global-palette9:${kadence_blocks_params.global_colors['--global-palette1']};`;
			newStyles = [
				{ css: `body { ${tempStyles} }` }
			];
		}

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
						blockPatterns={ filteredBlockPatterns }
						onClickPattern={ onSelectBlockPattern }
						showTitlesAsTooltip={ false }
						customStyles={ customStyles }
						breakpointCols={ breakpointCols }
					/>
				) }
			</div>
		</div>
	);
}

export default PatternList;
