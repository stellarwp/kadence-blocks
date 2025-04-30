/**
 * Handle Cloud Connections.
 */
const { localStorage } = window;

/**
 * External dependencies
 */
import Masonry from 'react-masonry-css';

/**
 * WordPress dependencies
 */
import { useSelect, withDispatch, useDispatch } from '@wordpress/data';
import { parse, rawHandler } from '@wordpress/blocks';
import { debounce, isEqual } from 'lodash';
import { store as noticesStore } from '@wordpress/notices';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { getAsyncData } from './data-fetch/get-async-data';
import { Button, TextControl, SelectControl, VisuallyHidden, Spinner } from '@wordpress/components';
import { previous, update, next } from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SafeParseJSON } from '@kadence/helpers';

function CloudSections({ importContent, clientId, reload = false, onReload, tab, libraries }) {
	const [category, setCategory] = useState([]);
	const [pageCategory, setPageCategory] = useState('');
	const [pageStyles, setPageStyles] = useState();
	const [search, setSearch] = useState(null);
	const [subTab, setSubTab] = useState('');
	const [patterns, setPatterns] = useState(false);
	const [pages, setPages] = useState(false);
	const [sidebar, setSidebar] = useState('');
	const [context, setContext] = useState('');
	const [credits, setCredits] = useState('');
	const [contextTab, setContextTab] = useState('');
	const [localContexts, setLocalContexts] = useState(false);
	const [imageCollection, setImageCollection] = useState({});
	const [teamCollection, setTeamCollection] = useState({});
	const [categories, setCategories] = useState({});
	const [categoryListOptions, setCategoryListOptions] = useState([]);
	const [styleListOptions, setStyleListOptions] = useState([]);
	const [stateGridSize, setGridSize] = useState('');
	const [contextListOptions, setContextListOptions] = useState([]);
	const [pagesCategories, setPagesCategories] = useState({});
	const [pageCategoryListOptions, setPageCategoryListOptions] = useState([]);
	const [pageContextListOptions, setPageContextListOptions] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isImporting, setIsImporting] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isErrorType, setIsErrorType] = useState('general');

	const activeStorage = SafeParseJSON(localStorage.getItem('kadenceBlocksPrebuilt'), true);
	const savedSelectedCategory =
		undefined !== activeStorage?.kbCat && '' !== activeStorage?.kbCat ? activeStorage.kbCat : 'all';
	const savedSelectedPageCategory =
		undefined !== activeStorage?.kbPageCat && '' !== activeStorage?.kbPageCat ? activeStorage.kbPageCat : 'home';
	const selectedCategory = category ? category : savedSelectedCategory;
	const selectedPageCategory = pageCategory ? pageCategory : savedSelectedPageCategory;
	const selectedSubTab = subTab ? subTab : 'patterns';

	const { createErrorNotice } = useDispatch(noticesStore);

	// Setting category options
	useEffect(() => {
		setCategoryListOptions(
			Object.keys(categories).map(function (key, index) {
				return {
					value: 'category' === key ? 'all' : key,
					label: 'category' === key ? __('All', 'kadence-blocks') : categories[key],
				};
			})
		);
	}, [categories]);

	// Setting style options
	useEffect(() => {
		const patternStyles = Object.keys(patterns).map(function (key) {
			return patterns[key].styles;
		});

		// If array is empty, return
		if (!patternStyles.length) {
			return;
		}

		// Clear duplicates
		const uniqueMap = new Map();
		patternStyles.forEach((item) => {
			if (!item) {
				return;
			}
			const key = Object.keys(item)[0];
			const value = item[key];
			uniqueMap.set(value, item);
		});

		const uniqueArray = Array.from(uniqueMap.values());
		const styleOptions = uniqueArray.map(function (key) {
			const keyValue = Object.keys(key)[0];
			const keyName = key[keyValue];
			return { value: keyValue, label: keyName };
		});

		setStyleListOptions(styleOptions);
	}, [patterns]);

	// useEffect( () => {
	// 	setPageCategoryListOptions(
	// 		Object.keys( pagesCategories ).map( function ( key, index ) {
	// 			return {
	// 				value: 'category' === key ? 'all' : key,
	// 				label: 'category' === key ? __( 'All', 'kadence-blocks' ) : pagesCategories[ key ],
	// 			};
	// 		} )
	// 	);
	// 	const tempPageContexts = [];
	// 	Object.keys( pagesCategories ).map( function ( key, index ) {
	// 		if ( 'category' !== key ) {
	// 			tempPageContexts.push( {
	// 				value: 'category' === key ? 'all' : key,
	// 				label: 'category' === key ? __( 'All', 'kadence-blocks' ) : pagesCategories[ key ],
	// 			} );
	// 		}
	// 	} );
	// 	setPageContextListOptions( tempPageContexts );
	// }, [ pagesCategories ] );
	const { getPatterns, getPattern, processPattern, getPatternCategories } = getAsyncData();
	const forceRefreshLibrary = () => {
		if (!isLoading && patterns) {
			setPatterns(JSON.parse(JSON.stringify(patterns)));
		}
		if (!isLoading && pages) {
			setPages(JSON.parse(JSON.stringify(pages)));
		}
	};
	async function onInsertContent(pattern) {
		setIsImporting(true);
		// const patternSend = {
		// 	id: pattern.id,
		// 	slug:pattern.slug,
		// }
		let action = [];
		// if (tab !== 'section') {
		// 	action = libraries.filter((obj) => {
		// 		return obj.slug === tab;
		// 	});
		// }
		if (action === undefined || action.length == 0) {
			const cloudSettings = kadence_blocks_params?.cloud_settings
				? JSON.parse(kadence_blocks_params.cloud_settings)
				: {};
			if (cloudSettings && cloudSettings.connections) {
				action = cloudSettings.connections.filter((obj) => {
					return obj.slug === tab;
				});
			}
		}
		if (action === undefined || action.length == 0) {
			if (
				typeof kadence_blocks_params?.prebuilt_libraries === 'object' &&
				kadence_blocks_params?.prebuilt_libraries !== null
			) {
				action = kadence_blocks_params.prebuilt_libraries.filter((obj) => {
					return obj.slug === tab;
				});
			}
		}
		if (action?.[0]?.url && pattern?.id) {
			const response = await getPattern(
				tab,
				'pattern',
				pattern?.id ? pattern.id : '',
				'light',
				action?.[0]?.url ? action[0].url : '',
				action?.[0]?.key ? action[0].key : ''
			);
			if (response) {
				try {
					const tempContent = JSON.parse(response);
					if (tempContent) {
						pattern.content = tempContent;
					}
				} catch (e) {}
			}
		}
		if (pattern?.content) {
			processImportContent(pattern);
		}
	}
	const ajaxImportProcess = (blockcode) => {
		const data = new FormData();
		data.append('action', 'kadence_import_process_image_data');
		data.append('security', kadence_blocks_params.ajax_nonce);
		data.append('import_content', blockcode);
		data.append('image_library', JSON.stringify(imageCollection));
		jQuery
			.ajax({
				method: 'POST',
				url: kadence_blocks_params.ajax_url,
				data,
				contentType: false,
				processData: false,
			})
			.done(function (response, status, stately) {
				if (response) {
					importContent(response, clientId);
				} else {
					setIsError(true);
					setIsErrorType('reload');
				}
				setIsImporting(false);
			})
			.fail(function (error) {
				console.log(error);
				setIsError(true);
				setIsErrorType('reload');
				setIsImporting(false);
			});
	};
	async function processImportContent(pattern) {
		const response = await processPattern(pattern.content, imageCollection, pattern?.forms ? pattern.forms : []);
		if (response === 'failed') {
			// It could fail because cloudflare is blocking the request. Lets try with ajax.
			ajaxImportProcess(blockCode, imageCollection);
			console.log('Import Process Failed when processing data through rest api... Trying ajax.');
		} else {
			importContent(response, clientId);
			setIsImporting(false);
		}
	}

	async function getLibraryContent(tempReload) {
		setIsLoading(true);
		setIsError(false);
		setIsErrorType('general');
		let action = [];
		if (tab !== 'section') {
			action = libraries.filter((obj) => {
				return obj.slug === tab;
			});
		}
		if (action === undefined || action.length == 0) {
			const cloudSettings = kadence_blocks_params?.cloud_settings
				? JSON.parse(kadence_blocks_params.cloud_settings)
				: {};
			if (cloudSettings && cloudSettings.connections) {
				action = cloudSettings.connections.filter((obj) => {
					return obj.slug === tab;
				});
			}
		}
		if (action === undefined || action.length == 0) {
			if (
				typeof kadence_blocks_params?.prebuilt_libraries === 'object' &&
				kadence_blocks_params?.prebuilt_libraries !== null
			) {
				action = kadence_blocks_params.prebuilt_libraries.filter((obj) => {
					return obj.slug === tab;
				});
			}
		}
		if (!action?.[0]?.url) {
			setIsLoading(false);
			setIsError(true);
			setIsErrorType('general');
			return;
		}
		const response = await getPatterns(
			tab,
			tempReload,
			action?.[0]?.url ? action[0].url : '',
			action?.[0]?.key ? action[0].key : ''
		);
		if (response === 'failed') {
			console.log('Permissions Error getting library Content');
			if (subTab === 'pages') {
				setPages('error');
			} else {
				setPatterns('error');
			}
			setIsError(true);
			setIsErrorType('reload');
			setIsLoading(false);
		} else if (response === 'error') {
			console.log('Error getting library Content.');
			if (subTab === 'pages') {
				setPages('error');
			} else {
				setPatterns('error');
			}
			setIsError(true);
			setIsLoading(false);
		} else {
			const o = SafeParseJSON(response, false);
			if (o) {
				const patternCategories = await getPatternCategories(
					tab,
					tempReload,
					action?.[0]?.url ? action[0].url : '',
					action?.[0]?.key ? action[0].key : ''
				);
				if (patternCategories) {
					const catOrder = SafeParseJSON(patternCategories, false);
					if (subTab === 'pages') {
						const pageCats = catOrder ? catOrder : {};
						{
							Object.keys(o).map(function (key, index) {
								if (o[key].categories && typeof o[key].categories === 'object') {
									{
										Object.keys(o[key].categories).map(function (ckey, i) {
											if (!pageCats.hasOwnProperty(ckey)) {
												pageCats[ckey] = o[key].categories[ckey];
											}
										});
									}
								}
							});
						}
						setPages(o);
						setPagesCategories(JSON.parse(JSON.stringify(pageCats)));
					} else {
						const newCatOrder = catOrder ? catOrder : {};
						const tempCats = {};
						{
							Object.keys(o).map(function (key, index) {
								if (o[key].categories && typeof o[key].categories === 'object') {
									{
										Object.keys(o[key].categories).map(function (ckey, i) {
											if (!tempCats.hasOwnProperty(ckey)) {
												tempCats[ckey] = o[key].categories[ckey];
											}
										});
									}
								}
							});
						}
						Object.keys(newCatOrder).map(function (key, index) {
							if (!tempCats.hasOwnProperty(key)) {
								delete newCatOrder[key];
							}
						});
						const cats = { ...{ all: 'All' }, ...newCatOrder, ...tempCats };
						setPatterns(o);
						setCategories(JSON.parse(JSON.stringify(cats)));
					}
				} else {
					if (subTab === 'pages') {
						setPages('error');
					} else {
						setPatterns('error');
					}
					setIsError(true);
				}
			} else {
				console.log('error, library content incorrect', response);
				if (subTab === 'pages') {
					setPages('error');
				} else {
					setPatterns('error');
				}
				setIsError(true);
			}
			setIsLoading(false);
		}
	}
	useEffect(() => {
		if (reload && !isLoading) {
			onReload();
			getLibraryContent(true);
		} else if (!isLoading) {
			getLibraryContent(false);
		}
	}, [reload, tab]);
	const activePanel = SafeParseJSON(localStorage.getItem('kadenceBlocksPrebuilt'), true);
	const sidebar_saved_enabled = activePanel && activePanel.sidebar ? activePanel.sidebar : 'show';
	const sidebarEnabled = sidebar ? sidebar : sidebar_saved_enabled;
	const roundAccurately = (number, decimalPlaces) =>
		Number(Math.round(Number(number + 'e' + decimalPlaces)) + 'e' + decimalPlaces * -1);
	const categoryItems = categories;
	const savedGridSize = activePanel && activePanel.grid ? activePanel.grid : 'normal';
	const gridSize = stateGridSize ? stateGridSize : savedGridSize;
	const catOptions = Object.keys(categoryItems).map(function (key, index) {
		return { value: 'category' === key ? 'all' : key, label: categoryItems[key] };
	});
	const sideCatOptions = Object.keys(categoryItems).map(function (key, index) {
		return {
			value: 'category' === key ? 'all' : key,
			label: 'category' === key ? __('All', 'kadence-blocks') : categoryItems[key],
		};
	});
	const getActiveCat = category?.[activePanel.activeTab] ? category[activePanel.activeTab] : 'all';
	let breakpointColumnsObj = {
		default: 5,
		1600: 4,
		1200: 3,
		500: 2,
	};
	if (gridSize === 'large') {
		breakpointColumnsObj = {
			default: 4,
			1600: 3,
			1200: 2,
			500: 1,
		};
	}
	if (sidebarEnabled === 'show') {
		breakpointColumnsObj = {
			default: 4,
			1600: 3,
			1200: 2,
			500: 1,
		};
		if (gridSize === 'large') {
			breakpointColumnsObj = {
				default: 3,
				1600: 2,
				1200: 2,
				500: 1,
			};
		}
	}
	return (
		<div className={`kt-prebuilt-content${sidebarEnabled === 'show' ? ' kb-prebuilt-has-sidebar' : ''}`}>
			{sidebarEnabled === 'show' && (
				<div className="kt-prebuilt-sidebar kb-cloud-library-sidebar">
					<div className="kb-library-sidebar-top">
						<TextControl
							type="text"
							value={search}
							placeholder={__('Search')}
							onChange={(value) => setSearch(value)}
						/>
						<Button
							className={'kb-trigger-sidebar'}
							icon={previous}
							onClick={() => {
								const activeSidebar = SafeParseJSON(
									localStorage.getItem('kadenceBlocksPrebuilt'),
									true
								);
								activeSidebar.sidebar = 'hide';
								localStorage.setItem('kadenceBlocksPrebuilt', JSON.stringify(activeSidebar));
								setSidebar('hide');
							}}
						/>
					</div>
					<div className="kb-library-sidebar-bottom">
						{sideCatOptions.map((tempCat, index) => (
							<Button
								key={`${tempCat.value}-${index}`}
								className={'kb-category-button' + (getActiveCat === tempCat.value ? ' is-pressed' : '')}
								aria-pressed={getActiveCat === tempCat.value}
								onClick={() => {
									const newCat = category;
									newCat[activePanel.activeTab] = tempCat.value;
									setCategory(newCat);
									forceRefreshLibrary();
								}}
							>
								{tempCat.label}
							</Button>
						))}
					</div>
				</div>
			)}
			{sidebarEnabled !== 'show' && (
				<div className="kt-prebuilt-header kb-library-header">
					<div className="kb-library-header-left">
						<Button
							className={'kb-trigger-sidebar'}
							icon={next}
							onClick={() => {
								const activeSidebar = SafeParseJSON(
									localStorage.getItem('kadenceBlocksPrebuilt'),
									true
								);
								activeSidebar.sidebar = 'show';
								localStorage.setItem('kadenceBlocksPrebuilt', JSON.stringify(activeSidebar));
								setSidebar('show');
							}}
						/>
						<SelectControl
							className={'kb-library-header-cat-select'}
							value={getActiveCat}
							options={catOptions}
							onChange={(value) => {
								const newCat = category;
								newCat[activePanel.activeTab] = value;
								setCategory(newCat);
								forceRefreshLibrary();
							}}
						/>
					</div>
					<div className="kb-library-header-right">
						<Button
							icon={
								<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
									<path d="M8 15h7V8H8v7zm9-7v7h7V8h-7zm0 16h7v-7h-7v7zm-9 0h7v-7H8v7z"></path>
								</svg>
							}
							className={
								'kb-grid-btns kb-trigger-large-grid-size' + (gridSize === 'large' ? ' is-pressed' : '')
							}
							aria-pressed={gridSize === 'large'}
							onClick={() => {
								const activeSidebar = SafeParseJSON(
									localStorage.getItem('kadenceBlocksPrebuilt'),
									true
								);
								activeSidebar.grid = 'large';
								localStorage.setItem('kadenceBlocksPrebuilt', JSON.stringify(activeSidebar));
								setGridSize('large');
							}}
						/>
						<Button
							icon={
								<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
									<path d="M8 12h4V8H8v4zm6 0h4V8h-4v4zm6-4v4h4V8h-4zM8 18h4v-4H8v4zm6 0h4v-4h-4v4zm6 0h4v-4h-4v4zM8 24h4v-4H8v4zm6 0h4v-4h-4v4zm6 0h4v-4h-4v4z"></path>
								</svg>
							}
							className={
								'kb-grid-btns kb-trigger-normal-grid-size' +
								(gridSize === 'normal' ? ' is-pressed' : '')
							}
							aria-pressed={gridSize === 'normal'}
							onClick={() => {
								const activeSidebar = SafeParseJSON(
									localStorage.getItem('kadenceBlocksPrebuilt'),
									true
								);
								activeSidebar.grid = 'normal';
								localStorage.setItem('kadenceBlocksPrebuilt', JSON.stringify(activeSidebar));
								setGridSize('normal');
							}}
						/>
						<TextControl
							type="text"
							value={search}
							placeholder={__('Search')}
							onChange={(value) => setSearch(value)}
						/>
					</div>
				</div>
			)}
			{isImporting || isLoading || false === patterns || isError ? (
				<>
					{!isError && isLoading && <Spinner />}
					{!isError && isImporting && (
						<div className="preparing-importing-images">
							<Spinner />
							<h2>{__('Preparing Content…', 'kadence-blocks')}</h2>
						</div>
					)}
					{isError && (
						<div>
							<h2 style={{ textAlign: 'center' }}>
								{__(
									'Error, Unable to access library database, please try re-syncing',
									'kadence-blocks'
								)}
							</h2>
							<div style={{ textAlign: 'center' }}>
								<Button
									className="kt-reload-templates"
									icon={update}
									onClick={() => getLibraryContent(true)}
								>
									{__(' Sync with Cloud', 'kadence-blocks')}
								</Button>
							</div>
						</div>
					)}
				</>
			) : (
				<div className="kb-cloud-library-outer-wrap">
					<Masonry
						breakpointCols={breakpointColumnsObj}
						className={`kb-css-masonry kb-cloud-library-wrap`}
						columnClassName="kb-css-masonry_column"
						// className={ 'kb-prebuilt-grid kb-prebuilt-masonry-grid' }
						// elementType={ 'div' }
						// options={ {
						// 	transitionDuration: 0,
						// } }
						// disableImagesLoaded={ false }
						// enableResizableChildren={ true }
						// updateOnEachImageLoad={ false }
					>
						{Object.keys(patterns).map(function (key, index) {
							const name = patterns[key].name;
							const slug = patterns[key].slug;
							const image = patterns[key].image;
							const imageWidth = patterns[key].imageW;
							const imageHeight = patterns[key].imageH;
							const itemCategories = patterns[key].categories;
							const keywords = patterns[key].keywords;
							const description = patterns[key].description;
							const pro = patterns[key].pro;
							const locked = patterns[key].locked;
							const descriptionId = `${slug}_kb_cloud__item-description`;
							if (
								('all' === getActiveCat || Object.keys(itemCategories).includes(getActiveCat)) &&
								(!search ||
									(keywords &&
										keywords.some((x) => x.toLowerCase().includes(search.toLowerCase()))) ||
									(name && name.toLowerCase().includes(search.toLowerCase())))
							) {
								return (
									<div className="kb-css-masonry-inner" key={index}>
										<Button
											key={key}
											className="kb-css-masonry-btn"
											aria-label={sprintf(
												/* translators: %s is Prebuilt Name */
												__('Add %s', 'kadence-blocks'),
												name
											)}
											aria-describedby={description ? descriptionId : undefined}
											isDisabled={locked}
											onClick={() => (!locked ? onInsertContent(patterns[key]) : '')}
										>
											<div
												className="kb-css-masonry-btn-inner"
												style={{
													paddingBottom:
														imageWidth && imageHeight
															? roundAccurately((imageHeight / imageWidth) * 100, 2) + '%'
															: undefined,
												}}
											>
												<img src={image} loading={'lazy'} alt={name} />
												<span
													className="kb-import-btn-title"
													dangerouslySetInnerHTML={{ __html: name }}
												/>
											</div>
										</Button>
										{!!description && (
											<VisuallyHidden id={descriptionId}>{description}</VisuallyHidden>
										)}
										{undefined !== pro && pro && (
											<>
												<span className="kb-pro-template">{__('Pro', 'kadence-blocks')}</span>
												{locked && (
													<div className="kb-popover-pro-notice">
														<h2>{__('Pro required for this item', 'kadence-blocks')} </h2>
													</div>
												)}
											</>
										)}
									</div>
								);
							}
						})}
					</Masonry>
				</div>
			)}
		</div>
	);
}

// export default compose(
// 	withSelect( ( select, { clientId } ) => {
// 		const { getBlock } = select( 'core/block-editor' );
// 		const block = getBlock( clientId );
// 		return {
// 			block,
// 			canUserUseUnfilteredHTML: select( 'core/editor' ) ? select( 'core/editor' ).canUserUseUnfilteredHTML() : false,
// 		};
// 	} ),
// 	withDispatch( ( dispatch, { block, canUserUseUnfilteredHTML } ) => ( {
// 		import: ( blockcode ) => dispatch( 'core/block-editor' ).replaceBlocks(
// 			block.clientId,
// 			rawHandler( {
// 				HTML: blockcode,
// 				mode: 'BLOCKS',
// 				canUserUseUnfilteredHTML,
// 			} ),
// 		),
// 	} ) ),
// )( CloudSections );
const CloudLibraryWrapper = withDispatch((dispatch, { canUserUseUnfilteredHTML }) => ({
	importContent(blockcode, clientId) {
		const { replaceBlocks } = dispatch(blockEditorStore);
		replaceBlocks(
			clientId,
			rawHandler({
				HTML: blockcode,
				mode: 'BLOCKS',
				canUserUseUnfilteredHTML,
			})
		);
	},
}))(CloudSections);
const CloudLibraryEdit = (props) => {
	const { canUserUseUnfilteredHTML } = useSelect((select) => {
		return {
			canUserUseUnfilteredHTML: select('core/editor') ? select('core/editor').canUserUseUnfilteredHTML() : false,
		};
	}, []);
	return <CloudLibraryWrapper canUserUseUnfilteredHTML={canUserUseUnfilteredHTML} {...props} />;
};
export default CloudLibraryEdit;
