/**
 * Handle Section Library.
 */

/**
 * Globals.
 */
const { localStorage } = window;

/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
import { Button, Spinner, Icon, __experimentalHeading as Heading } from '@wordpress/components';
import { useMemo, useEffect, useState } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';
import { useDebounce } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { speak } from '@wordpress/a11y';
import { aiIcon } from '@kadence/icons';
import { searchItems } from './search-items';
import replaceColors from './replace/replace-colors';
import replaceImages from './replace/replace-images';
import replaceContent from './replace/replace-content';
import deleteContent from './replace/remove-content';
import replaceMasks from './replace/replace-masks';
import KadenceBlockPatternList from './block-pattern-list';
const INITIAL_INSERTER_RESULTS = 2;
function PatternsListHeader({ filterValue, filteredBlockPatternsLength }) {
	if (!filterValue) {
		return null;
	}
	return (
		<Heading level={2} lineHeight={'48px'} className="block-editor-block-patterns-explorer__search-results-count">
			{sprintf(
				/* translators: %d: number of patterns. %s: block pattern search query */
				_n('%1$d pattern found for "%2$s"', '%1$d patterns found for "%2$s"', filteredBlockPatternsLength),
				filteredBlockPatternsLength,
				filterValue
			)}
		</Heading>
	);
}
function PageListNotice({ type }) {
	return (
		<Heading level={2} lineHeight={'48px'} className="kb-patterns-banner-notice kb-page-notice-above">
			<Spinner />
			{'processing' === type
				? __('Generating AI Content.', 'kadence-blocks')
				: __('Content still generating, some pages will not have AI Content.', 'kadence-blocks')}
		</Heading>
	);
}
function ProOnlyHeader({ launchWizard }) {
	const isAuthorized = window?.kadence_blocks_params?.isAuthorized;
	const data_key = window?.kadence_blocks_params?.proData?.api_key ? kadence_blocks_params.proData.api_key : '';
	const activateLink = window?.kadence_blocks_params?.homeLink ? kadence_blocks_params.homeLink : '';
	const hasPro = kadence_blocks_params.pro && kadence_blocks_params.pro === 'true' ? true : false;
	return (
		<div className="kb-patterns-banner-generate-notice">
			<Icon className="kadence-generate-icons" icon={aiIcon} />
			<Heading level={2} lineHeight={'1.2'} className="kb-patterns-heading-notice">
				{__('Drop in professionally designed pages with AI Generated Content', 'kadence-blocks')}
			</Heading>
			{!isAuthorized && (
				<Button
					className="kadence-generate-copy-button"
					iconPosition="right"
					icon={aiIcon}
					text={__('Activate Kadence AI', 'kadence-blocks')}
					target={activateLink ? '_blank' : ''}
					disabled={activateLink ? false : true}
					href={activateLink ? activateLink : ''}
				/>
			)}
			{isAuthorized && !data_key && (
				<>
					{hasPro && (
						<Button
							className="kadence-generate-copy-button"
							iconPosition="right"
							icon={aiIcon}
							text={__('Activate Kadence Blocks Pro Required', 'kadence-blocks')}
							disabled={activateLink ? false : true}
							href={activateLink ? activateLink : ''}
						/>
					)}
					{!hasPro && (
						<Button
							className="kadence-generate-copy-button"
							iconPosition="right"
							icon={aiIcon}
							text={__('Activate Kadence AI', 'kadence-blocks')}
							target={activateLink ? '_blank' : ''}
							disabled={activateLink ? false : true}
							href={activateLink ? activateLink : ''}
						/>
					)}
				</>
			)}
			{isAuthorized && data_key && (
				<Button
					className="kadence-generate-copy-button"
					iconPosition="right"
					icon={aiIcon}
					text={__('Generate Content AI Content', 'kadence-blocks')}
					onClick={() => {
						launchWizard();
					}}
				/>
			)}
		</div>
	);
}
function BuildPageContent(rows) {
	if (!rows) {
		return '';
	}
	let tempContent = '';
	Object.keys(rows).map(function (key, index) {
		const rowStyle = rows[key].pattern_style;
		const rowStart = `<!-- wp:kadence/column {"borderWidth":["","","",""],"uniqueID":"_f8d4f6-${key}","borderStyle":[{"top":["","",""],"right":["","",""],"bottom":["","",""],"left":["","",""],"unit":"px"}],"className":"kb-pattern-preview-${rowStyle}"} --><div class="wp-block-kadence-column kadence-column_f8d4f6-${key} kb-pattern-preview-${rowStyle}"><div class="kt-inside-inner-col">`;
		const rowEnd = `</div></div><!-- /wp:kadence/column -->`;
		const rowContent = rowStart + rows[key].pattern_content + rowEnd;
		tempContent = tempContent.concat(rowContent);
	});
	return tempContent;
}
function BuildHTMLPageContent(rows, useImageReplace, imageCollection, contextTab, aiContent) {
	if (!rows) {
		return '';
	}
	let tempArray = [];
	let tempContent = '';
	let variation = 0;
	//console.log( rows );
	tempArray = Object.keys(rows).map(function (key, index) {
		if (variation > 11) {
			variation = 0;
		}
		let theContent = '';
		const categories = rows?.[key]?.pattern_category ? Object.keys(rows[key].pattern_category) : [];
		let context = rows[key].pattern_context;
		context = 'contact' === context ? 'contact-form' : context;
		context = 'subscribe' === context ? 'subscribe-form' : context;
		context = 'pricing' === context ? 'pricing-table' : context;
		theContent = replaceMasks(rows[key].pattern_html);
		if (useImageReplace === 'all' && imageCollection) {
			theContent = replaceImages(theContent, imageCollection, categories, rows[key].pattern_id, variation);
		}
		if (contextTab === 'context') {
			theContent = replaceContent(theContent, aiContent, categories, context, variation, true);
		}
		variation++;
		return theContent;
	});
	Object.keys(tempArray).map(function (key, index) {
		tempContent = tempContent.concat(tempArray[key]);
	});
	return tempContent;
}
function BuildPageImportContent(rows, useImageReplace, imageCollection, contextTab, aiContent, selectedStyle) {
	if (!rows) {
		return '';
	}
	let tempArray = [];
	let tempContent = '';
	let variation = 0;
	//console.log( rows );
	tempArray = Object.keys(rows).map(function (key, index) {
		if (variation > 11) {
			variation = 0;
		}
		const theContent = '';
		const rowStyle = rows[key].pattern_style;
		let rowContent = rows[key].pattern_content;
		rowContent = deleteContent(rowContent);
		if (selectedStyle === 'dark') {
			if ('light' === rowStyle) {
				rowContent = replaceColors(rowContent, 'dark');
			} else if ('highlight' === rowStyle) {
				rowContent = replaceColors(rowContent, 'highlight');
			}
		} else if ('dark' === rowStyle) {
			rowContent = replaceColors(rowContent, 'dark');
		} else if ('highlight' === rowStyle) {
			rowContent = replaceColors(rowContent, 'highlight');
		}
		const categories = rows?.[key]?.pattern_category ? Object.keys(rows[key].pattern_category) : [];
		let context = rows[key].pattern_context;
		context = 'contact' === context ? 'contact-form' : context;
		context = 'subscribe' === context ? 'subscribe-form' : context;
		context = 'pricing' === context ? 'pricing-table' : context;
		if (useImageReplace === 'all' && imageCollection) {
			rowContent = replaceImages(rowContent, imageCollection, categories, rows[key].pattern_id, variation);
		}
		if (contextTab === 'context') {
			rowContent = replaceContent(rowContent, aiContent, categories, context, variation);
		}
		variation++;
		return rowContent;
	});
	Object.keys(tempArray).map(function (key, index) {
		tempContent = tempContent.concat(tempArray[key]);
	});
	return tempContent;
	// let tempContent = '';
	// Object.keys( rows ).map( function( key, index ) {
	// 	const rowStyle = rows[key]['pattern_style'];
	// 	let rowContent = rows[key]['pattern_content'];
	// 	rowContent = deleteContent( rowContent );
	// 	if ( 'dark' === rowStyle ) {
	// 		rowContent = replaceColors( rowContent, 'dark' );
	// 	} else if ( 'highlight' === rowStyle ) {
	// 		rowContent = replaceColors( rowContent, 'highlight' );
	// 	}
	// 	tempContent = tempContent.concat( rowContent );
	// } );
	// return tempContent;
}

function PageList({
	pages,
	filterValue,
	selectedCategory,
	selectedPageStyles,
	selectedStyle = 'light',
	breakpointCols,
	imageCollection,
	contextTab,
	useImageReplace,
	onSelect,
	launchWizard,
}) {
	const debouncedSpeak = useDebounce(speak, 500);
	const [rootScroll, setRootScroll] = useState();
	const hasPro = window?.kadence_blocks_params?.pro && kadence_blocks_params.pro === 'true' ? true : false;
	const isAuthorized = window?.kadence_blocks_params?.isAuthorized;
	const isAIDisabled = window?.kadence_blocks_params?.isAIDisabled ? true : false;
	const data_key = window?.kadence_blocks_params?.proData?.api_key ? kadence_blocks_params.proData.api_key : '';
	const onSelectBlockPattern = (info) => {
		const pageSend = {
			id: info.id,
			slug: info.slug,
			type: 'page',
			style: 'light',
		};
		const allContext = getAllContext();
		pageSend.content = BuildPageImportContent(
			info.rows,
			useImageReplace,
			imageCollection,
			contextTab,
			allContext,
			selectedStyle
		);
		onSelect(pageSend);
		// if ( ! selectedStyle || 'light' === selectedStyle ) {
		// 	onSelect( newInfo );
		// } else if ( 'dark' === selectedStyle ) {
		// 	newInfo = replaceColors( newInfo, 'dark' );
		// 	onSelect( newInfo );
		// } else if ( 'highlight' === selectedStyle ) {
		// 	newInfo = replaceColors( newInfo, 'highlight' );
		// 	onSelect( newInfo );
		// }
	};
	const { getAllContext, hasAllPageContext } = useSelect((select) => {
		return {
			getAllContext: () => select('kadence/library').getAllContext(),
			hasAllPageContext: () => select('kadence/library').hasAllPageContext(),
		};
	}, []);
	const thePages = useMemo(() => {
		const allPatterns = [];
		let variation = 0;
		Object.keys(pages).map(function (key, index) {
			const temp = [];
			if (variation === 11) {
				variation = 0;
			}
			temp.title = pages[key].name;
			temp.name = pages[key].name;
			temp.description = pages[key].description;
			temp.image = pages[key].image;
			temp.imageWidth = pages[key].imageW;
			temp.imageHeight = pages[key].imageH;
			temp.id = pages[key].id;
			temp.slug = pages[key].slug;
			temp.pageStyles = pages[key].page_styles ? Object.values(pages[key].page_styles) : [];
			temp.categories = pages[key].categories ? Object.keys(pages[key].categories) : [];
			temp.contexts = pages[key].contexts ? Object.keys(pages[key].contexts) : [];
			temp.keywords = pages[key].keywords ? pages[key].keywords : [];
			temp.content = BuildPageContent(pages[key].rows);
			if (pages[key]?.rows?.[0]?.pattern_html) {
				const allContext = getAllContext();
				temp.html = BuildHTMLPageContent(
					pages[key].rows,
					useImageReplace,
					imageCollection,
					contextTab,
					allContext
				);
			} else if (pages[key]?.rows_html) {
				temp.html = replaceMasks(pages[key].rows_html);
			}
			temp.rows = pages[key].rows;
			temp.pro = pages[key].pro;
			temp.locked = pages[key].pro && 'true' !== kadence_blocks_params.pro ? true : false;
			temp.proRender = false;
			temp.viewportWidth = 1200;
			variation++;
			allPatterns.push(temp);
		});
		return allPatterns;
	}, [pages, imageCollection, useImageReplace, contextTab]);
	const filteredBlockPatterns = useMemo(() => {
		let allPatterns = thePages;
		if (contextTab === 'context' && (!isAuthorized || !data_key)) {
			return [];
		}
		if (!filterValue && selectedCategory && 'all' !== selectedCategory) {
			allPatterns = allPatterns.filter((pattern) => pattern.categories?.includes(selectedCategory));
		}
		if (selectedPageStyles && selectedPageStyles.length) {
			allPatterns = allPatterns.filter((pattern) =>
				pattern.pageStyles.find((style) => selectedPageStyles.includes(style))
			);
		}
		// if ( useImageReplace === 'all' && imageCollection ) {
		// 	let variation = 0;
		// 	allPatterns = allPatterns.map( ( item, index ) => {
		// 		if ( variation === 11 ) {
		// 			variation = 0;
		// 		}
		// 		if ( item?.html ) {
		// 			item['html'] = replaceImages( item.html, imageCollection, item.categories, aiContext, variation);
		// 			item['content'] = replaceImages( item.content, imageCollection, item.categories, aiContext, variation);
		// 		} else {
		// 			item['content'] = replaceImages( item.content, imageCollection, item.categories, aiContext, variation);
		// 		}
		// 		variation ++;
		// 		return item;
		// 	} );
		// }
		// if ( contextTab === 'context' ) {
		// 	let variation = 0;
		// 	allPatterns = allPatterns.map( ( item, index ) => {
		// 		if ( variation === 11 ) {
		// 			variation = 0;
		// 		}
		// 		if ( item?.html) {
		// 			item['html'] = replaceContent( item.html, aiContent, item.categories, aiContext, variation );
		// 			item['content'] = replaceContent( item.content, aiContent, item.categories, aiContext, variation );
		// 		} else {
		// 			item['content'] = replaceContent( item.content, aiContent, item.categories, aiContext, variation );
		// 		}
		// 		variation ++;
		// 		return item;
		// 	} );
		// }
		// if ( allPatterns.length > 30 ) {
		// 	console.log( 'here' );
		// 	allPatterns = allPatterns.slice(0, 30);
		// }
		return searchItems(allPatterns, filterValue);
	}, [filterValue, selectedCategory, selectedPageStyles, pages, useImageReplace, imageCollection]);

	// Announce search results on change.
	useEffect(() => {
		if (!filterValue) {
			return;
		}
		const count = filteredBlockPatterns.length;
		const resultsFoundMessage = sprintf(
			/* translators: %d: number of results. */
			_n('%d result found.', '%d results found.', count),
			count
		);
		debouncedSpeak(resultsFoundMessage);
	}, [filterValue, debouncedSpeak]);

	// Define selected style.
	const customStyles = useMemo(() => {
		let newStyles = '';
		let globalColors = '';
		let colorClasses = '';
		if (!kadence_blocks_params.isKadenceT) {
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
			:root .has-theme-palette9-background-color { background-color: var(--global-palette9); }`;
		}

		const normalizeStyles = `--global-content-edge-padding: 3rem;padding:0px !important;--global-vw:1200px !important;`;
		newStyles = [
			{
				css: `:root {margin-block:0;}body{${normalizeStyles} ${globalColors}}.single-iframe-content .kb-pattern-delete-block {display: none;}${colorClasses}`,
			},
		];
		return newStyles;
	}, [selectedStyle]);
	// Define selected style.
	const customShadowStyles = useMemo(() => {
		let newStyles = '';
		let globalColors = '';
		let colorClasses = '';
		let styleColors = '';
		if (!kadence_blocks_params.isKadenceT) {
			globalColors = `
				--global-palette1:${kadence_blocks_params.global_colors['--global-palette1']};
				--global-palette2:${kadence_blocks_params.global_colors['--global-palette2']};
				--global-palette3:${kadence_blocks_params.global_colors['--global-palette3']};
				--global-palette4:${kadence_blocks_params.global_colors['--global-palette4']};
				--global-palette5:${kadence_blocks_params.global_colors['--global-palette5']};
				--global-palette6:${kadence_blocks_params.global_colors['--global-palette6']};
				--global-palette7:${kadence_blocks_params.global_colors['--global-palette7']};
				--global-palette8:${kadence_blocks_params.global_colors['--global-palette8']};
				--global-palette9:${kadence_blocks_params.global_colors['--global-palette9']};`;
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
			.single-iframe-content .has-theme-palette9-background-color { background-color: var(--global-palette9); }`;
		}
		const normalizeStyles = `--global-content-edge-padding: 3rem;padding:0px !important;--global-vw:1200px !important;`;
		if ('dark' === selectedStyle) {
			styleColors = `.single-iframe-content {--global-palette1:${kadence_blocks_params.global_colors['--global-palette1']};
			--global-palette2:${kadence_blocks_params.global_colors['--global-palette2']};
			--global-palette3:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette4:${kadence_blocks_params.global_colors['--global-palette8']};
			--global-palette5:${kadence_blocks_params.global_colors['--global-palette7']};
			--global-palette6:${kadence_blocks_params.global_colors['--global-palette7']};
			--global-palette7:${kadence_blocks_params.global_colors['--global-palette3']};
			--global-palette8:${kadence_blocks_params.global_colors['--global-palette3']};
			--global-palette9:${kadence_blocks_params.global_colors['--global-palette4']};
			--wp--preset--color--theme-palette-1: var(--global-palette1);
			--wp--preset--color--theme-palette-2: var(--global-palette2);
			--wp--preset--color--theme-palette-3: var(--global-palette3);
			--wp--preset--color--theme-palette-4: var(--global-palette4);
			--wp--preset--color--theme-palette-5: var(--global-palette5);
			--wp--preset--color--theme-palette-6: var(--global-palette6);
			--wp--preset--color--theme-palette-7: var(--global-palette7);
			--wp--preset--color--theme-palette-8: var(--global-palette8);
			--wp--preset--color--theme-palette-9: var(--global-palette9);
			--global-content-edge-padding: 3rem;
			padding:0px !important;}
			.single-iframe-content .kb-blocks-highlight-page-section { --global-palette1:${kadence_blocks_params.global_colors['--global-palette1']};
			--global-palette2:${kadence_blocks_params.global_colors['--global-palette2']};
			--global-palette3:${kadence_blocks_params.global_colors['--global-palette3']};
			--global-palette4:${kadence_blocks_params.global_colors['--global-palette4']};
			--global-palette5:${kadence_blocks_params.global_colors['--global-palette5']};
			--global-palette6:${kadence_blocks_params.global_colors['--global-palette6']};
			--global-palette7:${kadence_blocks_params.global_colors['--global-palette7']};
			--global-palette8:${kadence_blocks_params.global_colors['--global-palette8']};
			--global-palette9:${kadence_blocks_params.global_colors['--global-palette9']};
			--wp--preset--color--theme-palette-1: var(--global-palette1);
			--wp--preset--color--theme-palette-2: var(--global-palette2);
			--wp--preset--color--theme-palette-3: var(--global-palette3);
			--wp--preset--color--theme-palette-4: var(--global-palette4);
			--wp--preset--color--theme-palette-5: var(--global-palette5);
			--wp--preset--color--theme-palette-6: var(--global-palette6);
			--wp--preset--color--theme-palette-7: var(--global-palette7);
			--wp--preset--color--theme-palette-8: var(--global-palette8);
			--wp--preset--color--theme-palette-9: var(--global-palette9);
		}.kb-btns-outer-wrap {--global-palette9:${kadence_blocks_params.global_colors['--global-palette9']}} .kb-btn-custom-colors .kb-btns-outer-wrap {--global-palette9:${kadence_blocks_params.global_colors['--global-palette3']}} img[src^="https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Logo-ploaceholder"] {filter: invert(1);}img[src^="https://patterns.startertemplatecloud.com/wp-content/uploads/2023/12/logo-placeholder"] {filter: invert(1);}.wp-block-kadence-tabs.kb-pattern-active-tab-highlight .kt-tabs-title-list li.kt-tab-title-active .kt-tab-title{ color:${kadence_blocks_params.global_colors['--global-palette9']} !important} .kb-pattern-light-color{--global-palette9:${kadence_blocks_params.global_colors['--global-palette9']}}.kb-divider-static.kb-row-layout-wrap.wp-block-kadence-rowlayout > .kt-row-layout-bottom-sep svg{fill:${kadence_blocks_params.global_colors['--global-palette4']}!important}.kb-divider-static.kb-row-layout-wrap.wp-block-kadence-rowlayout > .kt-row-layout-top-sep svg{fill:${kadence_blocks_params.global_colors['--global-palette4']}!important}.kb-divider-static.kb-divider-bottom-p8.kb-row-layout-wrap.wp-block-kadence-rowlayout > .kt-row-layout-bottom-sep svg{fill:${kadence_blocks_params.global_colors['--global-palette5']}!important}.kb-divider-static.kb-divider-top-p8.kb-row-layout-wrap.wp-block-kadence-rowlayout > .kt-row-layout-top-sep svg{fill:${kadence_blocks_params.global_colors['--global-palette5']}!important}`;
		}
		newStyles = [
			{
				css: `.single-iframe-content{${normalizeStyles} ${globalColors}}.pattern-shadow-wrap > .single-iframe-content > .kb-row-layout-wrap, .pattern-shadow-wrap > .single-iframe-content > .kb-blocks-highlight-page-section { margin-top:-1px;}.pattern-shadow-wrap .single-iframe-content {--global-content-width:1200px }.single-iframe-content .kb-pattern-delete-block {display: none;}${colorClasses}.kb-divider-static.kb-row-layout-wrap.wp-block-kadence-rowlayout > .kt-row-layout-bottom-sep svg{fill:${kadence_blocks_params.global_colors['--global-palette9']}!important}.kb-divider-static.kb-row-layout-wrap.wp-block-kadence-rowlayout > .kt-row-layout-top-sep svg{fill:${kadence_blocks_params.global_colors['--global-palette9']}!important}.kb-divider-static.kb-divider-bottom-p8.kb-row-layout-wrap.wp-block-kadence-rowlayout > .kt-row-layout-bottom-sep svg{fill:${kadence_blocks_params.global_colors['--global-palette8']}!important}.kb-divider-static.kb-divider-top-p8.kb-row-layout-wrap.wp-block-kadence-rowlayout > .kt-row-layout-top-sep svg{fill:${kadence_blocks_params.global_colors['--global-palette8']}!important}${styleColors}`,
			},
		];
		return newStyles;
	}, [selectedStyle]);
	const hasItems = !!filteredBlockPatterns?.length;
	const allPageContext = hasAllPageContext();
	if (isAIDisabled && contextTab === 'context') {
		return (
			<div className="kb-ai-dropdown-container-content-wrap activation-needed">
				<p className="kb-disabled-authorize-note">
					{__('Kadence AI is disabled by site admin.', 'kadence-blocks')}
				</p>
			</div>
		);
	}
	return (
		<div ref={setRootScroll} className="block-editor-block-patterns-explorer__wrap">
			<div className="block-editor-block-patterns-explorer__list">
				{hasItems && (
					<PatternsListHeader
						filterValue={filterValue}
						filteredBlockPatternsLength={filteredBlockPatterns.length}
					/>
				)}
				{contextTab === 'context' && isAuthorized && data_key && !allPageContext && (
					<PageListNotice type={'mising-context'} />
				)}
				{contextTab === 'context' && (!isAuthorized || !data_key) && (
					<ProOnlyHeader launchWizard={launchWizard} />
				)}
				{hasItems && (
					<KadenceBlockPatternList
						selectedCategory={selectedCategory}
						selectedPageStyles={selectedPageStyles}
						blockPatterns={filteredBlockPatterns}
						onClickPattern={onSelectBlockPattern}
						showTitlesAsTooltip={false}
						customStyles={customStyles}
						customShadowStyles={customShadowStyles}
						breakpointCols={breakpointCols}
						patternType={'page'}
						rootScroll={rootScroll}
					/>
				)}
			</div>
		</div>
	);
}

export default PageList;
