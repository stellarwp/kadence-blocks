/**
 * Handle Section Library.
 */
/**
 * External dependencies
 */
import Masonry from 'react-masonry-css'
import InfiniteScroll from 'react-infinite-scroller';
/**
 * WordPress dependencies
 */
import {
	Button,
	TextControl,
	SelectControl,
	VisuallyHidden,
	Spinner,
	ExternalLink,
	Tooltip,
	__unstableUseCompositeState as useCompositeState,
	__unstableCompositeItem as CompositeItem,
} from '@wordpress/components';
import { BlockPreview } from './block-preview';
import { useMemo, useEffect, useState } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';
import { useDebounce,debounce, useAsyncList, useInstanceId } from '@wordpress/compose';


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
	const { blocks, viewportWidth, pro, locked, proRender } = pattern;
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
					className={ `block-editor-block-patterns-list__item${ locked ? ' kb-pattern-item-locked' : '' }` }
					onClick={ () => {
						if ( ! locked ) {
							onClick( pattern, blocks );
						} else {
							console.log( 'Can not install' );
						}
						onHover?.( null );
					} }
					aria-disabled={ locked ? true : undefined }
					onMouseEnter={ () => {
						onHover?.( pattern );
					} }
					onMouseLeave={ () => onHover?.( null ) }
					aria-label={ pattern.title }
					aria-describedby={
						pattern.description ? descriptionId : undefined
					}
				>
					{ proRender && (
						<div className="kb-pattern-requires-pro-item-wrap block-editor-block-preview__container">
							<span className="kb-pattern-requires-pro-item">{ __( 'Requires Kadence Blocks Pro to Render Preview', 'kadence-blocks' ) }</span>
						</div>
					) }
					{ ! proRender && (
						<BlockPreview
							blocks={ blocks }
							viewportWidth={ viewportWidth }
							additionalStyles={ customStyles }
						/>
					) }
					{ locked && (
						<div className="kb-pattern-requires-active-pro">
							<span className="kb-pattern-requires-active-pro-item"><ExternalLink href={ 'https://www.kadencewp.com/kadence-blocks/pro/?utm_source=in-app&utm_medium=kadence-blocks&utm_campaign=patterns' }>{ __( 'Requires Kadence Blocks Pro', 'kadence-blocks' ) }</ExternalLink></span>
						</div>
					) }
					{ ! showTooltip && (
						<div className="block-editor-block-patterns-list__item-title">
							{ pattern.title }
							{ undefined !== pro && pro && (
								<span className="kb-pattern-pro-item">{ __( 'Pro', 'kadence-blocks' ) }</span>
							) }
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

function KadenceBlockPatternList( {
	blockPatterns,
	selectedCategory,
	filterValue,
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
	const itemsPerPage = 4;
	const [hasMore, setHasMore] = useState(true);
	const [records, setrecords] = useState(itemsPerPage);
	const debounceSetRecords = debounce( ( newRecord ) => {
		setrecords( newRecord );
	}, 500 );
	// clear lazy when category change
	useEffect( () => {
		setrecords(itemsPerPage);
		setHasMore(true);
	}, [ selectedCategory, filterValue, blockPatterns ] );
	const loadMore = () => {
		if ( records >= blockPatterns.length ) {
			setHasMore(false);
		} else {
			debounceSetRecords( records + itemsPerPage );
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



export default KadenceBlockPatternList;
