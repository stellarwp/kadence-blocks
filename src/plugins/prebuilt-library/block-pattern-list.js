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
import { parse } from '@wordpress/blocks';
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
import { useSelect } from '@wordpress/data';
import { BlockPreview } from './block-preview';
import { PatternPreview } from './pattern-preview';
import { useMemo, useEffect, useState } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';
import { useDebounce, useAsyncList, useInstanceId } from '@wordpress/compose';
import {
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { debounce } from 'lodash';
import { useCompatibilityStyles } from './iframe/use-compatibility-styles';
function useParsedAssets( html ) {
	return useMemo( () => {
		const doc = document.implementation.createHTMLDocument( '' );
		doc.body.innerHTML = html;
		return Array.from( doc.body.children );
	}, [ html ] );
}

const WithToolTip = ( { showTooltip, title, children } ) => {
	if ( showTooltip ) {
		return <Tooltip text={ title }>{ children }</Tooltip>;
	}
	return <>{ children }</>;
};
const roundAccurately = (number, decimalPlaces) => Number(Math.round(Number(number + "e" + decimalPlaces)) + "e" + decimalPlaces * -1);
function KadenceBlockPattern( {
	pattern,
	onClick,
	onHover,
	composite,
	showTooltip,
	customStyles,
	previewMode,
	selectedStyle,
	editorStyles,
	shadowStyles,
	baseCompatStyles,
	neededCompatStyles,
	patternType
} ) {
	const { content, viewportWidth, pro, locked, proRender, image, imageHeight, imageWidth, html } = pattern;
	const blocks = parse( content, {
		__unstableSkipMigrationLogs: true
	});
	const instanceId = useInstanceId( KadenceBlockPattern );
	const descriptionId = `block-editor-block-patterns-list__item-description-${ instanceId }`;
	return (
		<div
			className={ `block-editor-block-patterns-list__list-item kb-pattern-style-${selectedStyle}`}
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
					{ proRender && 'image' !== previewMode && (
						<div className="kb-pattern-requires-pro-item-wrap block-editor-block-preview__container">
							<span className="kb-pattern-requires-pro-item">{ __( 'Requires Kadence Blocks Pro to Render Preview', 'kadence-blocks' ) }</span>
						</div>
					) }
					{ ! proRender && 'image' !== previewMode && ! html && (
						<BlockPreview
							blocks={ blocks }
							viewportWidth={ viewportWidth }
							additionalStyles={ customStyles }
							editorStyles={ editorStyles }
							baseCompatStyles={ baseCompatStyles }
							neededCompatStyles={ neededCompatStyles }
						/>
					) }
					{ ! proRender && 'image' !== previewMode && html && (
						<PatternPreview
							html={ html }
							title={pattern.title}
							viewportWidth={ viewportWidth }
							additionalStyles={ customStyles }
							ratio={ ( imageWidth && imageHeight ? roundAccurately( ( imageHeight/imageWidth * 100), 2 ) + '%' : undefined ) }
							shadowStyles={ shadowStyles }
							baseCompatStyles={ baseCompatStyles }
							neededCompatStyles={ neededCompatStyles }
							patternType={ patternType }
						/>
					) }
					{ 'image' === previewMode && (
						<div
							className="kb-pattern-image-wrap"
							style={ {
								paddingBottom: ( imageWidth && imageHeight ? roundAccurately( ( imageHeight/imageWidth * 100), 2 ) + '%' : undefined ),
							} }
						>
							<img src={ image } loading={ "lazy" } alt={ pattern.title } />
						</div>
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
	customShadowStyles,
	breakpointCols,
	previewMode = 'iframe',
	selectedStyle = 'light',
	patternType='pattern',
	renderType='shadow',
} ) {
	const { styles, assets } = useSelect( ( select ) => {
		const settings = select( blockEditorStore ).getSettings();
		return {
			styles: settings.styles,
			assets: settings.__unstableResolvedAssets,
		};
	}, [] );
	const parsedStyles = useParsedAssets( assets?.styles );
	const styleIds = parsedStyles.map( ( style ) => style.id );
	//console.log( styleIds );
	const styleIdsTest = [ 'kadence-blocks-global-editor-styles-inline-css', 'kadence-editor-global-inline-css', 'wp-block-library-css', 'wc-blocks-vendors-style-css', 'wc-blocks-style-css' ];
	const styleIdsExclude = [ 'yoast-seo-metabox-css-css' ];
	const baseCompatStyles = parsedStyles.filter(
		( style ) => styleIdsTest.includes( style.id )
	);
	const compatStyles = useCompatibilityStyles();;
	const neededCompatStyles = compatStyles.filter(
		( style ) => style.id && ! styleIds.includes( style.id ) && ! styleIdsExclude.includes( style.id )
	);
	const editorStyles = useMemo( () => {
		if ( styles ) {
			return [
				...styles,
				{
					css: 'body{height:auto;overflow:hidden;border:none;padding:0;}body{--wp--style--global--content-size:var(--wp--style--global--wide-size )}',
					__unstableType: 'presets',
				},
				...customStyles,
			];
		}

		return styles;
	}, [ styles, customStyles ] );
	const shadowStyles = useMemo( () => {
		if ( styles ) {
			return [
				...styles,
				{
					css: '.single-iframe-content{--wp--style--global--content-size:var(--wp--style--global--wide-size )}',
					__unstableType: 'presets',
				},
				...customShadowStyles,
			];
		}

		return styles;
	}, [ styles, customShadowStyles ] );
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
						previewMode={ previewMode }
						selectedStyle={ selectedStyle }
						editorStyles={ editorStyles }
						shadowStyles={ shadowStyles }
						baseCompatStyles={ undefined !== baseCompatStyles ? baseCompatStyles : [] }
						neededCompatStyles={ undefined !== neededCompatStyles ? neededCompatStyles : [] }
						patternType={ patternType }
					/>
				);
			}
		}
		return items;
	};
	const showAllItems = (patterns) => {
		var items = [];
		for (var i = 0; i < shadowRecords; i++) {
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
						shadowStyles={ shadowStyles }
						previewMode={ previewMode }
						selectedStyle={ selectedStyle }
						editorStyles={ editorStyles }
						baseCompatStyles={ undefined !== baseCompatStyles ? baseCompatStyles : [] }
						neededCompatStyles={ undefined !== neededCompatStyles ? neededCompatStyles : [] }
						patternType={ patternType }
					/>
				);
			}
		}
		return items;
	};
	const itemsPerPage = previewMode === 'image' ? 16 : 4;
	const [hasMore, setHasMore] = useState(true);
	const [hasMoreShadow, setHasMoreShadow] = useState(true);
	const [records, setrecords] = useState(itemsPerPage);
	const [shadowRecords, setShadowRecords] = useState(40);
	const debounceSetRecords = debounce( ( newRecord ) => {
		setrecords( newRecord );
	}, 500 );
	const debounceSeShadowRecords = debounce( ( newRecord ) => {
		setShadowRecords( newRecord );
	}, 100 );
	// clear lazy when category change
	useEffect( () => {
		setrecords(itemsPerPage);
		setHasMore(true);
		setHasMoreShadow(true);
		setShadowRecords(30);
	}, [ selectedCategory, filterValue, blockPatterns ] );
	const loadMore = () => {
		if ( records >= blockPatterns.length ) {
			setHasMore(false);
		} else {
			debounceSetRecords( records + itemsPerPage );
		}
	};
	const loadMoreShadow = () => {
		if ( shadowRecords >= blockPatterns.length ) {
			setHasMoreShadow(false);
		} else {
			debounceSeShadowRecords( shadowRecords + 30 );
		}
	};
	if ( renderType === 'shadow' ) {
		return ( 
			<div className="block-editor-block-patterns-list">
				<InfiniteScroll
					className="block-editor-block-patterns-list-wrap"
					pageStart={0}
					loadMore={loadMoreShadow}
					hasMore={hasMoreShadow}
					loader={<Spinner />}
					useWindow={false}
					threshold={800}
				>
						<Masonry
							breakpointCols={breakpointCols}
							className={ `kb-css-masonry kb-core-section-library` }
							columnClassName="kb-css-masonry_column"
						>
							{showAllItems(blockPatterns)}
						</Masonry>
				</InfiniteScroll>
			</div>
		);
	}
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
