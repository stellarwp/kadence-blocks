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
	update,
	next,
	chevronLeft,
	chevronDown,
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


function PatternList( { patterns, filterValue, selectedCategory, patternCategories, selectedStyle = 'light', breakpointCols, onSelect, aiContent, savedAI = true } ) {
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
	const filteredBlockPatterns = useMemo( () => {
		let allPatterns = [];
		let variation = 1;
		// // Temp images.
		// const images = {
		// 	aRoll1: "http://dev.local/wp-content/uploads/2023/03/pexels-yan-krukau-8436637.jpg",
		// 	aRoll2: "http://dev.local/wp-content/uploads/2023/03/pexels-yan-krukau-8436583.jpg",
		// 	aRoll3: "http://dev.local/wp-content/uploads/2023/03/pexels-yan-krukau-8436612.jpg",
		// 	aRoll4: "http://dev.local/wp-content/uploads/2023/03/pexels-yan-krukau-8436470.jpg",
		// 	aRoll5: "http://dev.local/wp-content/uploads/2023/03/pexels-yan-krukau-8436626.jpg",
		// 	bRoll1: "http://dev.local/wp-content/uploads/2023/03/pexels-miriam-alonso-7592995-scaled.jpg",
		// 	bRoll2: "http://dev.local/wp-content/uploads/2023/03/pexels-cottonbro-studio-4327157-scaled.jpg",
		// 	bRoll3: "http://dev.local/wp-content/uploads/2023/03/pexels-yan-krukau-8436554-scaled.jpg",
		// 	bRoll4: "http://dev.local/wp-content/uploads/2023/03/pexels-yan-krukau-8436640-scaled.jpg",
		// 	bRoll5: "http://dev.local/wp-content/uploads/2023/03/pexels-yan-krukau-8436691-scaled.jpg",
		// 	bRoll6: "http://dev.local/wp-content/uploads/2023/03/pexels-yan-krukau-8436771-scaled.jpg",
		// 	bg1: "http://dev.local/wp-content/uploads/2023/03/pexels-yan-krukau-8436581.jpg",

		// 	pp1: "http://dev.local/wp-content/uploads/2023/03/pexels-valeria-ushakova-3094215.jpg",
		// 	pp2: "http://dev.local/wp-content/uploads/2023/03/pexels-vlada-karpovich-4534864.jpg",
		// 	pp3: "http://dev.local/wp-content/uploads/2023/03/pexels-elina-fairytale-3823047.jpg",
		// 	pp4: "http://dev.local/wp-content/uploads/2023/03/pexels-andrea-piacquadio-3752836-scaled.jpg",
		// 	pp5: "http://dev.local/wp-content/uploads/2023/03/pexels-tomaz-barcellos-1987301.jpg",
		// 	pp6: "http://dev.local/wp-content/uploads/2023/03/pexels-yan-krukau-4457997.jpg",
		// 	pp7: "http://dev.local/wp-content/uploads/2023/03/pexels-andrea-piacquadio-774909.jpg",
		// 	pp8: "http://dev.local/wp-content/uploads/2023/03/pexels-hannah-nelson-1065084-scaled.jpg",
		// 	pp9: "http://dev.local/wp-content/uploads/2023/03/pexels-fabio-nascimento-15824229.jpg",
		// 	pp10: "http://dev.local/wp-content/uploads/2023/03/pexels-kadeem-stewart-15787374.jpg",
		// }
		// const aiContent = {};
		Object.keys( patterns ).map( function( key, index ) {
			if ( ! kadence_blocks_params.hasProducts && patterns[key].categories && patterns[key].categories.hasOwnProperty( 'featured-products' ) ) {
				return;
			}
			if ( ! kadence_blocks_params.hasProducts && patterns[key].categories && patterns[key].categories.hasOwnProperty( 'product-loop' ) ) {
				return;
			}
			if ( ! kadence_blocks_params.hasPosts && patterns[key].categories && patterns[key].categories.hasOwnProperty( 'post-loop' ) ) {
				return;
			}
			const temp = [];
			if ( variation === 4 ) {
				variation = 1;
			}
			temp['title'] = patterns[key].name;
			temp['name'] = patterns[key].name;
			temp['id'] = patterns[key].id;
			temp['slug'] = patterns[key].slug;
			let tempContent = patterns[key].content;
			temp['categories'] = patterns[key].categories ? Object.keys( patterns[key].categories ) : [];
			temp['keywords'] = patterns[key].keywords ? patterns[key].keywords : [];
			if ( savedAI ) {
				//tempContent = replaceImages( tempContent, images, temp['categories'], 'general', variation );
				tempContent = replaceContent( tempContent, aiContent, temp['categories'], 'general', variation );
			}
			// if ( tempContent ) {
			// 	temp['blocks'] = parse( tempContent, {
			// 		__unstableSkipMigrationLogs: true
			// 	});
			// }
			temp['content'] = tempContent;
			temp['pro'] = patterns[key].pro;
			temp['locked'] = ( patterns[key].pro && 'true' !== kadence_blocks_params.pro ? true : false );
			temp['proRender'] = ( temp['keywords'].includes('Requires Pro') && 'true' !== kadence_blocks_params.pro ? true : false );
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
			const tempStyles = `--global-content-edge-padding: 3rem;
			padding:0px !important;`;
			newStyles = [
				{ css: `body { ${tempStyles} }.block-editor-block-list__layout.is-root-container>.wp-block[data-align=full] {margin-left: 0 !important;margin-right: 0 !important;}` }
			];
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
			--global-palette9:${kadence_blocks_params.global_colors['--global-palette4']};
			--global-content-edge-padding: 3rem;
			padding:0px !important;`;
			newStyles = [
				{ css: `body { ${tempStyles} }.kb-btns-outer-wrap {--global-palette9:${kadence_blocks_params.global_colors['--global-palette9']}} .kb-btn-custom-colors .kb-btns-outer-wrap {--global-palette9:${kadence_blocks_params.global_colors['--global-palette3']}} img[src^="https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Logo-ploaceholder"] {filter: invert(1);}.wp-block-kadence-tabs.kb-pattern-active-tab-highlight .kt-tabs-title-list li.kt-tab-title-active .kt-tab-title{ color:${kadence_blocks_params.global_colors['--global-palette9']} !important} .kb-pattern-light-color{--global-palette9:${kadence_blocks_params.global_colors['--global-palette9']}}.block-editor-block-list__layout.is-root-container>.wp-block[data-align=full] {margin-left: 0 !important;margin-right: 0 !important;}` }
			];
		} else if ( 'highlight' === selectedStyle ) {
			const tempStyles = `--global-palette1:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette2:${kadence_blocks_params.global_colors['--global-palette8']};
			--global-palette3:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette4:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette5:${kadence_blocks_params.global_colors['--global-palette8']};
			--global-palette6:${kadence_blocks_params.global_colors['--global-palette7']};
			--global-palette7:${kadence_blocks_params.global_colors['--global-palette2']};
			--global-palette8:${kadence_blocks_params.global_colors['--global-palette2']};
			--global-palette9:${kadence_blocks_params.global_colors['--global-palette1']};
			--global-content-edge-padding: 3rem;
			padding:0px !important;`;
			newStyles = [
				{ css: `body { ${tempStyles} }.kb-submit-field .kb-forms-submit, .kb-btns-outer-wrap .wp-block-button__link {color:${kadence_blocks_params.global_colors['--global-palette9']};background:${kadence_blocks_params.global_colors['--global-palette3']};} .kb-btn-custom-colors .kb-btns-outer-wrap {--global-palette9:${kadence_blocks_params.global_colors['--global-palette1']}} img[src^="https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Logo-ploaceholder"] {filter: invert(1);}}.block-editor-block-list__layout.is-root-container>.wp-block[data-align=full] {margin-left: 0 !important;margin-right: 0 !important;}` }
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
				{ ! hasItems && ( selectedCategory && ( selectedCategory === 'posts-loop' || selectedCategory === 'featured-products' || selectedCategory === 'product-loop' ) ) && (
					<BannerHeader
						selectedCategory={ selectedCategory }
					/>
				) }
				{ hasItems && (
					<KadenceBlockPatternList
						selectedCategory={ selectedCategory }
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
