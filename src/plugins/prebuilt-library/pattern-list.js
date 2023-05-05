/**
 * WordPress dependencies
 */

import {
	withSelect,
	withDispatch,
} from '@wordpress/data';
import { parse } from '@wordpress/blocks';
import {
	Button,
	TextControl,
	SelectControl,
	VisuallyHidden,
	ExternalLink,
	Spinner,
	Tooltip,
	__experimentalHeading as Heading,
} from '@wordpress/components';
import {
	arrowLeft,
	download,
	previous,
	next,
	chevronLeft,
	chevronDown,
	update,
	close,
	plusCircle,
} from '@wordpress/icons';
import { useMemo, useEffect, useState } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';
import { useDebounce } from '@wordpress/compose';
import { speak } from '@wordpress/a11y';
import { searchItems } from './search-items';
import replaceColors from './block-preview/replace-colors';
import replaceImages from './block-preview/replace-images';
import replaceContent from './block-preview/replace-content';
import deleteContent from './block-preview/remove-content';
import KadenceBlockPatternList from './block-pattern-list';

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
function BannerHeader( { selectedCategory } ) {
	if ( ! selectedCategory ) {
		return null;
	}
	const productLabel = ! kadence_blocks_params.hasWoocommerce ? __( 'Add WooCommerce and create some products.', 'kadence Blocks' ) :  __( 'Add some products here.', 'kadence Blocks' )
	return (
		<Heading
			level={ 2 }
			lineHeight={ '48px' }
			className="kb-patterns-banner-notice"
		>
			{ ( selectedCategory == 'featured-products' || selectedCategory == 'product-loop' ) && (
				<>
					{ __( 'These patterns require you to have some products.', 'kadence Blocks' ) } <ExternalLink href={ ( kadence_blocks_params.addProductsLink ? kadence_blocks_params.addProductsLink : '#' ) }>{productLabel}</ExternalLink>
				</>
			) }
			{ selectedCategory == 'post-loop' && (
				<>
					{ __( 'These patterns require you to have some posts.', 'kadence Blocks' ) } <ExternalLink href={ ( kadence_blocks_params.addPostsLink ? kadence_blocks_params.addPostsLink : '#' ) }>{__( 'Add some posts here.', 'kadence Blocks' )}</ExternalLink>
				</>
			) }

		</Heading>
	);
}

function LoadingHeader() {
	return (
		<Heading
			level={ 2 }
			lineHeight={ '48px' }
			className="kb-patterns-banner-notice"
		>
			<Spinner />
			{ __( 'Loading Content.', 'kadence Blocks' ) }
		</Heading>
	);
}


function PatternList( { patterns, filterValue, selectedCategory, patternCategories, selectedStyle = 'light', breakpointCols, onSelect, previewMode = 'iframe', selectedFontSize, aiContext, aiContent, contextTab, imageCollection } ) {
	const [ isLoadingAI, setIsLoadingAI ] = useState( false );
	const debouncedSpeak = useDebounce( speak, 500 );
	const onSelectBlockPattern = ( info ) => {
		const patternSend = {
			id: info.id,
			slug:info.slug,
			type: 'pattern',
			style: selectedStyle ? selectedStyle : 'light',
		}
		let newInfo = info.content;
		newInfo = deleteContent( newInfo );
		if ( ! selectedStyle || 'light' === selectedStyle ) {
			// Perhaps do something later.
		} else if ( 'dark' === selectedStyle ) {
			newInfo = replaceColors( newInfo, 'dark' );
		} else if ( 'highlight' === selectedStyle ) {
			newInfo = replaceColors( newInfo, 'highlight' );
		}
		patternSend.content = newInfo;
		onSelect( patternSend );
	}
	const thePatterns = useMemo( () => {
		let allPatterns = [];
		Object.keys( patterns ).map( function( key, index ) {
			const temp = [];
			temp['title'] = patterns[key].name;
			temp['name'] = patterns[key].name;
			temp['image'] = patterns[key].image;
			temp['imageWidth'] = patterns[key].imageW;
			temp['imageHeight'] = patterns[key].imageH;
			temp['id'] = patterns[key].id;
			temp['slug'] = patterns[key].slug;
			let tempContent = patterns[key].content;
			temp['categories'] = patterns[key].categories ? Object.keys( patterns[key].categories ) : [];
			temp['contexts'] = patterns[key].contexts ? Object.keys( patterns[key].contexts ) : [];
			temp['keywords'] = patterns[key].keywords ? patterns[key].keywords : [];
			if ( patterns[key]?.html) {
				temp['html'] = patterns[key].html;
			}
			temp['content'] = tempContent;
			temp['pro'] = patterns[key].pro;
			temp['locked'] = ( patterns[key].pro && 'true' !== kadence_blocks_params.pro ? true : false );
			temp['proRender'] = false;
			temp['viewportWidth'] = 1200;
			allPatterns.push( temp );
		});
		return allPatterns;
	}, [ patterns ] );
	const filteredBlockPatterns = useMemo( () => {
		if ( contextTab === 'context' ) {
			console.log( aiContext );
			if ( ! aiContent?.[aiContext]?.content ){
				setIsLoadingAI( true );
				console.log( 'no ai content' );
				return [];
			} else if ( isLoadingAI ){
				console.log( 'done loading ai' );
				setIsLoadingAI( false );
			}
		}
		let allPatterns = thePatterns;
		if ( ! filterValue && contextTab === 'design' && selectedCategory && 'all' !== selectedCategory ) {
			allPatterns = allPatterns.filter( ( pattern ) =>
				pattern.categories?.includes( selectedCategory )
			);
		}
		if ( contextTab === 'context' && aiContext ) {
			allPatterns = allPatterns.filter( ( pattern ) =>
				pattern.contexts?.includes( aiContext )
			);
		}
		if ( contextTab === 'context' ) {
			let variation = 1;
			allPatterns = allPatterns.map( ( item, index ) => {
				if ( variation === 4 ) {
					variation = 1;
				}
				if ( item?.html) {
					item['html'] = replaceContent( item.html, aiContent, item.categories, aiContext, variation );
					item['html'] = replaceImages( item.html, imageCollection, item.categories, aiContext, variation);
				} else {
					item['content'] = replaceContent( item.content, aiContent, item.categories, aiContext, variation );
				}
				variation ++;
				return item;
			} );
		}
		return searchItems( allPatterns, filterValue );
	}, [ filterValue, selectedCategory, thePatterns, aiContent, aiContext, contextTab ] );
	const hasHTml = useMemo( () => {
		return ( patterns[Object.keys( patterns )[0]]?.html ? true : false );
	}, [ patterns ] );

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
		let tempStyles = '';
		if ( ! selectedStyle || 'light' === selectedStyle ) {
			tempStyles = tempStyles.concat( `body {--global-content-edge-padding: 3rem;padding:0px !important;}.block-editor-block-list__layout.is-root-container>.wp-block[data-align=full] {margin-left: 0 !important;margin-right: 0 !important;}` );
		}
		if ( 'dark' === selectedStyle ) {
			tempStyles = tempStyles.concat( `body {--global-palette1:${kadence_blocks_params.global_colors['--global-palette1']};
			--global-palette2:${kadence_blocks_params.global_colors['--global-palette2']};
			--global-palette3:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette4:${kadence_blocks_params.global_colors['--global-palette8']};
			--global-palette5:${kadence_blocks_params.global_colors['--global-palette7']};
			--global-palette6:${kadence_blocks_params.global_colors['--global-palette7']};
			--global-palette7:${kadence_blocks_params.global_colors['--global-palette3']};
			--global-palette8:${kadence_blocks_params.global_colors['--global-palette3']};
			--global-palette9:${kadence_blocks_params.global_colors['--global-palette4']};
			--global-content-edge-padding: 3rem;
			padding:0px !important;}.kb-btns-outer-wrap {--global-palette9:${kadence_blocks_params.global_colors['--global-palette9']}} .kb-btn-custom-colors .kb-btns-outer-wrap {--global-palette9:${kadence_blocks_params.global_colors['--global-palette3']}} img[src^="https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Logo-ploaceholder"] {filter: invert(1);}.wp-block-kadence-tabs.kb-pattern-active-tab-highlight .kt-tabs-title-list li.kt-tab-title-active .kt-tab-title{ color:${kadence_blocks_params.global_colors['--global-palette9']} !important} .kb-pattern-light-color{--global-palette9:${kadence_blocks_params.global_colors['--global-palette9']}}.block-editor-block-list__layout.is-root-container>.wp-block[data-align=full] {margin-left: 0 !important;margin-right: 0 !important;}` );
		} else if ( 'highlight' === selectedStyle ) {
			tempStyles = tempStyles.concat( `body {--global-palette1:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette2:${kadence_blocks_params.global_colors['--global-palette8']};
			--global-palette3:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette4:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette5:${kadence_blocks_params.global_colors['--global-palette8']};
			--global-palette6:${kadence_blocks_params.global_colors['--global-palette7']};
			--global-palette7:${kadence_blocks_params.global_colors['--global-palette2']};
			--global-palette8:${kadence_blocks_params.global_colors['--global-palette2']};
			--global-palette9:${kadence_blocks_params.global_colors['--global-palette1']};
			--global-content-edge-padding: 3rem;
			padding:0px !important; }.kb-submit-field .kb-forms-submit, .kb-btns-outer-wrap .wp-block-button__link {color:${kadence_blocks_params.global_colors['--global-palette9']};background:${kadence_blocks_params.global_colors['--global-palette3']};} .kb-btns-outer-wrap .kb-button.kb-btn-global-outline {color:${kadence_blocks_params.global_colors['--global-palette9']};border-color:${kadence_blocks_params.global_colors['--global-palette3']};} .kb-btn-custom-colors .kb-btns-outer-wrap {--global-palette9:${kadence_blocks_params.global_colors['--global-palette1']}} img[src^="https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Logo-ploaceholder"] {filter: invert(1);}.block-editor-block-list__layout.is-root-container>.wp-block[data-align=full] {margin-left: 0 !important;margin-right: 0 !important;}` );
		}
		if ( 'sm' === selectedFontSize ) {
			tempStyles = tempStyles.concat( `.block-editor-block-list__layout.is-root-container {--global-kb-font-size-xxxl:${kadence_blocks_params.font_sizes['xxl']};
			--global-kb-font-size-xxl:${kadence_blocks_params.font_sizes['xl']};
			--global-kb-font-size-xl:${kadence_blocks_params.font_sizes['lg']};
			--global-kb-font-size-lg:${kadence_blocks_params.font_sizes['md']}; }` );
		}
		const newStyles = [
			{ css: tempStyles }
		];
		return newStyles;
	}, [ selectedStyle, selectedFontSize ] );
	const customShadowStyles = useMemo( () => {
		let tempStyles = '.pattern-shadow-wrap .single-iframe-content {--global-content-width:1200px }';
		if ( ! selectedStyle || 'light' === selectedStyle ) {
			tempStyles = tempStyles.concat( `.single-iframe-content {--global-content-edge-padding: 3rem;padding:0px !important;}` );
		}
		if ( ! kadence_blocks_params.isKadenceT ) {
			const colorClasses = `.single-iframe-content .has-theme-palette-1-color { color: var(--global-palette1); }
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
			tempStyles = tempStyles.concat( colorClasses );
		}
		if ( 'dark' === selectedStyle ) {
			tempStyles = tempStyles.concat( `.single-iframe-content {--global-palette1:${kadence_blocks_params.global_colors['--global-palette1']};
			--global-palette2:${kadence_blocks_params.global_colors['--global-palette2']};
			--global-palette3:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette4:${kadence_blocks_params.global_colors['--global-palette8']};
			--global-palette5:${kadence_blocks_params.global_colors['--global-palette7']};
			--global-palette6:${kadence_blocks_params.global_colors['--global-palette7']};
			--global-palette7:${kadence_blocks_params.global_colors['--global-palette3']};
			--global-palette8:${kadence_blocks_params.global_colors['--global-palette3']};
			--global-palette9:${kadence_blocks_params.global_colors['--global-palette4']};
			--global-content-edge-padding: 3rem;
			padding:0px !important;}.kb-btns-outer-wrap {--global-palette9:${kadence_blocks_params.global_colors['--global-palette9']}} .kb-btn-custom-colors .kb-btns-outer-wrap {--global-palette9:${kadence_blocks_params.global_colors['--global-palette3']}} img[src^="https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Logo-ploaceholder"] {filter: invert(1);}.wp-block-kadence-tabs.kb-pattern-active-tab-highlight .kt-tabs-title-list li.kt-tab-title-active .kt-tab-title{ color:${kadence_blocks_params.global_colors['--global-palette9']} !important} .kb-pattern-light-color{--global-palette9:${kadence_blocks_params.global_colors['--global-palette9']}}` );
		} else if ( 'highlight' === selectedStyle ) {
			tempStyles = tempStyles.concat( `.single-iframe-content {--global-palette1:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette2:${kadence_blocks_params.global_colors['--global-palette8']};
			--global-palette3:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette4:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette5:${kadence_blocks_params.global_colors['--global-palette8']};
			--global-palette6:${kadence_blocks_params.global_colors['--global-palette7']};
			--global-palette7:${kadence_blocks_params.global_colors['--global-palette2']};
			--global-palette8:${kadence_blocks_params.global_colors['--global-palette2']};
			--global-palette9:${kadence_blocks_params.global_colors['--global-palette1']};
			--global-content-edge-padding: 3rem;
			padding:0px !important; }.single-iframe-content .kb-form .kadence-blocks-form-field .kb-forms-submit, .kb-buttons-wrap .wp-block-button__link {color:${kadence_blocks_params.global_colors['--global-palette9']};background:${kadence_blocks_params.global_colors['--global-palette3']};} .kb-buttons-wrap .kb-button.kb-btn-global-outline {color:${kadence_blocks_params.global_colors['--global-palette3']};border-color:${kadence_blocks_params.global_colors['--global-palette3']};} .kb-btn-custom-colors .kb-buttons-wrap {--global-palette9:${kadence_blocks_params.global_colors['--global-palette1']}} img[src^="https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Logo-ploaceholder"] {filter: invert(1);}` );
		}
		if ( 'sm' === selectedFontSize ) {
			tempStyles = tempStyles.concat( `.single-iframe-content {--global-kb-font-size-xxxl:${kadence_blocks_params.font_sizes['xxl']};
			--global-kb-font-size-xxl:${kadence_blocks_params.font_sizes['xl']};
			--global-kb-font-size-xl:${kadence_blocks_params.font_sizes['lg']};
			--global-kb-font-size-lg:${kadence_blocks_params.font_sizes['md']}; }` );
		}
		const newStyles = [
			{ css: tempStyles }
		];
		return newStyles;
	}, [ selectedStyle, selectedFontSize ] );
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
				{/* { ! hasItems && ( selectedCategory && ( selectedCategory === 'posts-loop' || selectedCategory === 'featured-products' || selectedCategory === 'product-loop' ) ) && (
					<BannerHeader
						selectedCategory={ selectedCategory }
					/>
				) } */}
				{ contextTab === 'context' && isLoadingAI && (
					<LoadingHeader />
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
						previewMode={ previewMode }
						selectedStyle={ selectedStyle }
						renderType={ hasHTml ? 'shadow' : 'iframe' }
					/>
				) }
			</div>
		</div>
	);
}

export default PatternList;
