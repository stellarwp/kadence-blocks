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

function PatternList( { patterns, filterValue, selectedCategory, patternCategories, selectedStyle = 'light', breakpointCols, onSelect } ) {
	const debouncedSpeak = useDebounce( speak, 500 );
	const onSelectBlockPattern = ( info ) => {
		console.log(info );
		if ( ! selectedStyle || 'light' === selectedStyle ) {
			onSelect( info.content );
		} else if ( 'dark' === selectedStyle ) {
			let newInfo = info.content.replace(/Logo-ploaceholder.png/g, "Logo-ploaceholder-white.png");
			// Colors.
			newInfo = newInfo.replace( /has-theme-palette-3/g, "placeholder-kb-class9");
			newInfo = newInfo.replace( /has-theme-palette-4/g, "placeholder-kb-class8");
			newInfo = newInfo.replace( /has-theme-palette-5/g, "placeholder-kb-class7");
			newInfo = newInfo.replace( /has-theme-palette-6/g, "placeholder-kb-class7");
			newInfo = newInfo.replace( /has-theme-palette-7/g, "placeholder-kb-class3");
			newInfo = newInfo.replace( /has-theme-palette-8/g, "placeholder-kb-class3");
			newInfo = newInfo.replace( /has-theme-palette-9/g, "placeholder-kb-class4");
			newInfo = newInfo.replace( /theme-palette3/g, "placeholder-class-pal9");
			newInfo = newInfo.replace( /theme-palette4/g, "placeholder-class-pal8");
			newInfo = newInfo.replace( /theme-palette5/g, "placeholder-class-pal7");
			newInfo = newInfo.replace( /theme-palette6/g, "placeholder-class-pal7");
			newInfo = newInfo.replace( /theme-palette7/g, "placeholder-class-pal3");
			newInfo = newInfo.replace( /theme-palette8/g, "placeholder-class-pal3");
			newInfo = newInfo.replace( /theme-palette9/g, "placeholder-class-pal4");
			newInfo = newInfo.replace( /palette3/g, "placeholder-kb-pal9");
			newInfo = newInfo.replace( /palette4/g, "placeholder-kb-pal8");
			newInfo = newInfo.replace( /palette5/g, "placeholder-kb-pal7");
			newInfo = newInfo.replace( /palette6/g, "placeholder-kb-pal7");
			newInfo = newInfo.replace( /palette7/g, "placeholder-kb-pal3");
			newInfo = newInfo.replace( /palette8/g, "placeholder-kb-pal3");
			newInfo = newInfo.replace( /palette9/g, "placeholder-kb-pal4");

			newInfo = newInfo.replace( /placeholder-kb-class3/g, "has-theme-palette-3");
			newInfo = newInfo.replace( /placeholder-kb-class4/g, "has-theme-palette-4");
			newInfo = newInfo.replace( /placeholder-kb-class5/g, "has-theme-palette-5");
			newInfo = newInfo.replace( /placeholder-kb-class6/g, "has-theme-palette-6");
			newInfo = newInfo.replace( /placeholder-kb-class7/g, "has-theme-palette-7");
			newInfo = newInfo.replace( /placeholder-kb-class8/g, "has-theme-palette-8");
			newInfo = newInfo.replace( /placeholder-kb-class9/g, "has-theme-palette-9");
			newInfo = newInfo.replace( /placeholder-class-pal3/g, "theme-palette3");
			newInfo = newInfo.replace( /placeholder-class-pal4/g, "theme-palette4");
			newInfo = newInfo.replace( /placeholder-class-pal5/g, "theme-palette5");
			newInfo = newInfo.replace( /placeholder-class-pal6/g, "theme-palette6");
			newInfo = newInfo.replace( /placeholder-class-pal7/g, "theme-palette7");
			newInfo = newInfo.replace( /placeholder-class-pal8/g, "theme-palette8");
			newInfo = newInfo.replace( /placeholder-class-pal9/g, "theme-palette9");
			newInfo = newInfo.replace( /placeholder-kb-pal3/g, "palette3");
			newInfo = newInfo.replace( /placeholder-kb-pal4/g, "palette4");
			newInfo = newInfo.replace( /placeholder-kb-pal5/g, "palette5");
			newInfo = newInfo.replace( /placeholder-kb-pal6/g, "palette6");
			newInfo = newInfo.replace( /placeholder-kb-pal7/g, "palette7");
			newInfo = newInfo.replace( /placeholder-kb-pal8/g, "palette8");
			newInfo = newInfo.replace( /placeholder-kb-pal9/g, "palette9");
			onSelect( newInfo );
		} else if ( 'highlight' === selectedStyle ) {
			let newInfo = info.content.replace(/Logo-ploaceholder.png/g, "Logo-ploaceholder-white.png");
			// Colors.
			newInfo = newInfo.replace( /has-theme-palette-1/g, "placeholder-kb-class9");
			newInfo = newInfo.replace( /has-theme-palette-2/g, "placeholder-kb-class8");
			newInfo = newInfo.replace( /has-theme-palette-3/g, "placeholder-kb-class9");
			newInfo = newInfo.replace( /has-theme-palette-4/g, "placeholder-kb-class9");
			newInfo = newInfo.replace( /has-theme-palette-5/g, "placeholder-kb-class8");
			newInfo = newInfo.replace( /has-theme-palette-6/g, "placeholder-kb-class8");
			newInfo = newInfo.replace( /has-theme-palette-7/g, "placeholder-kb-class2");
			newInfo = newInfo.replace( /has-theme-palette-8/g, "placeholder-kb-class2");
			newInfo = newInfo.replace( /has-theme-palette-9/g, "placeholder-kb-class9");
			newInfo = newInfo.replace( /theme-palette1/g, "placeholder-class-pal9");
			newInfo = newInfo.replace( /theme-palette2/g, "placeholder-class-pal8");
			newInfo = newInfo.replace( /theme-palette3/g, "placeholder-class-pal9");
			newInfo = newInfo.replace( /theme-palette4/g, "placeholder-class-pal9");
			newInfo = newInfo.replace( /theme-palette5/g, "placeholder-class-pal8");
			newInfo = newInfo.replace( /theme-palette6/g, "placeholder-class-pal8");
			newInfo = newInfo.replace( /theme-palette7/g, "placeholder-class-pal2");
			newInfo = newInfo.replace( /theme-palette8/g, "placeholder-class-pal2");
			newInfo = newInfo.replace( /theme-palette9/g, "placeholder-class-pal1");
			newInfo = newInfo.replace( /palette1/g, "placeholder-kb-pal9");
			newInfo = newInfo.replace( /palette2/g, "placeholder-kb-pal8");
			newInfo = newInfo.replace( /palette3/g, "placeholder-kb-pal9");
			newInfo = newInfo.replace( /palette4/g, "placeholder-kb-pal9");
			newInfo = newInfo.replace( /palette5/g, "placeholder-kb-pal8");
			newInfo = newInfo.replace( /palette6/g, "placeholder-kb-pal8");
			newInfo = newInfo.replace( /palette7/g, "placeholder-kb-pal2");
			newInfo = newInfo.replace( /palette8/g, "placeholder-kb-pal2");
			newInfo = newInfo.replace( /palette9/g, "placeholder-kb-pal1");

			newInfo = newInfo.replace( /placeholder-kb-class1/g, "has-theme-palette-1");
			newInfo = newInfo.replace( /placeholder-kb-class2/g, "has-theme-palette-2");
			newInfo = newInfo.replace( /placeholder-kb-class3/g, "has-theme-palette-3");
			newInfo = newInfo.replace( /placeholder-kb-class4/g, "has-theme-palette-4");
			newInfo = newInfo.replace( /placeholder-kb-class5/g, "has-theme-palette-5");
			newInfo = newInfo.replace( /placeholder-kb-class6/g, "has-theme-palette-6");
			newInfo = newInfo.replace( /placeholder-kb-class7/g, "has-theme-palette-7");
			newInfo = newInfo.replace( /placeholder-kb-class8/g, "has-theme-palette-8");
			newInfo = newInfo.replace( /placeholder-kb-class9/g, "has-theme-palette-9");
			newInfo = newInfo.replace( /placeholder-class-pal1/g, "theme-palette1");
			newInfo = newInfo.replace( /placeholder-class-pal2/g, "theme-palette2");
			newInfo = newInfo.replace( /placeholder-class-pal3/g, "theme-palette3");
			newInfo = newInfo.replace( /placeholder-class-pal4/g, "theme-palette4");
			newInfo = newInfo.replace( /placeholder-class-pal5/g, "theme-palette5");
			newInfo = newInfo.replace( /placeholder-class-pal6/g, "theme-palette6");
			newInfo = newInfo.replace( /placeholder-class-pal7/g, "theme-palette7");
			newInfo = newInfo.replace( /placeholder-class-pal8/g, "theme-palette8");
			newInfo = newInfo.replace( /placeholder-class-pal9/g, "theme-palette9");
			newInfo = newInfo.replace( /placeholder-kb-pal1/g, "palette1");
			newInfo = newInfo.replace( /placeholder-kb-pal2/g, "palette2");
			newInfo = newInfo.replace( /placeholder-kb-pal3/g, "palette3");
			newInfo = newInfo.replace( /placeholder-kb-pal4/g, "palette4");
			newInfo = newInfo.replace( /placeholder-kb-pal5/g, "palette5");
			newInfo = newInfo.replace( /placeholder-kb-pal6/g, "palette6");
			newInfo = newInfo.replace( /placeholder-kb-pal7/g, "palette7");
			newInfo = newInfo.replace( /placeholder-kb-pal8/g, "palette8");
			newInfo = newInfo.replace( /placeholder-kb-pal9/g, "palette9");
			onSelect( newInfo );
		}
	}
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
				{ css: `body { ${tempStyles} }img[src="https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Logo-ploaceholder.png"] {filter: invert(1);}` }
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
