/**
 * Handle Cloud Connections.
 */
const { localStorage } = window;

/**
 * WordPress dependencies
 */
import { useSelect, withDispatch, useDispatch } from '@wordpress/data';
import { parse, rawHandler } from '@wordpress/blocks';
import { debounce, isEqual } from 'lodash';
import { store as noticesStore } from '@wordpress/notices';
import { useEffect, useState, useMemo } from '@wordpress/element';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { getAsyncData } from './data-fetch/get-async-data';
import { Button, TextControl, SelectControl, VisuallyHidden, Spinner } from '@wordpress/components';
import { previous, update, next } from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SafeParseJSON } from '@kadence/helpers';

import CloudLibrarySidebar from './cloud-sidebar';
import CloudLibraryPatterns from './cloud-patterns';

function StitchPageContent(rows) {
	if (!rows) {
		return '';
	}
	let tempArray = [];
	let tempContent = '';
	tempArray = Object.keys(rows).map(function (key, index) {
		const rowContent = rows[key]?.pattern_content || '';
		return rowContent;
	});
	Object.keys(tempArray).map(function (key, index) {
		tempContent = tempContent.concat(tempArray[key]);
	});
	return tempContent;
}

function CloudSections({ importContent, clientId, reload = false, onReload, onLibraryUpdate, tab, libraries }) {
	const [category, setCategory] = useState({});
	const [categorySlug, setCategorySlug] = useState('');
	const [pageCategorySlug, setPageCategorySlug] = useState('');
	const [pageCategory, setPageCategory] = useState({});
	const [search, setSearch] = useState(null);
	const [subTab, setSubTab] = useState('');
	const [patterns, setPatterns] = useState(false);
	const [pages, setPages] = useState(false);
	const [sidebar, setSidebar] = useState('');
	const [imageCollection, setImageCollection] = useState({});
	const [sortBy, setSortBy] = useState('');
	const [categories, setCategories] = useState({});
	const [categoryListOptions, setCategoryListOptions] = useState([]);
	const [stateGridSize, setGridSize] = useState('');
	const [pagesCategories, setPagesCategories] = useState({});
	const [pageCategoryListOptions, setPageCategoryListOptions] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isImporting, setIsImporting] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isErrorType, setIsErrorType] = useState('general');

	const currentLibrary = useMemo(
		() =>
			libraries.filter((obj) => {
				return obj.slug === tab;
			}),
		[tab, libraries]
	);
	const hasPages = currentLibrary?.[0]?.pages;

	const activeStorage = SafeParseJSON(localStorage.getItem('kadenceBlocksPrebuilt'), true);
	const savedSelectedSubTab =
		hasPages && undefined !== activeStorage?.kbSubTab && '' !== activeStorage?.kbSubTab
			? activeStorage.kbSubTab
			: 'patterns';
	const selectedSubTab = subTab ? subTab : savedSelectedSubTab;

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

	useEffect(() => {
		setPageCategoryListOptions(
			Object.keys(pagesCategories).map(function (key, index) {
				return {
					value: 'category' === key ? 'all' : key,
					label: 'category' === key ? __('All', 'kadence-blocks') : pagesCategories[key],
				};
			})
		);
	}, [pagesCategories]);
	const { getPatterns, getPattern, processPattern, getPatternCategories, getConnection, updateConnections } =
		getAsyncData();

	async function onInsertContent(pattern, type = 'pattern') {
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
				type,
				pattern?.id ? pattern.id : '',
				'light',
				action?.[0]?.url ? action[0].url : '',
				action?.[0]?.key ? action[0].key : ''
			);
			if (response) {
				try {
					const tempContent = JSON.parse(response);
					// Check if the content is an array of objects.
					if ('page' === type && tempContent?.rows) {
						pattern.content = StitchPageContent(tempContent.rows);
					} else {
						pattern.content = tempContent;
					}
				} catch (e) {
					console.log('error', e);
					if (!pattern?.content) {
						setIsError(true);
						setIsErrorType('general');
						setIsImporting(false);
					}
				}
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
		const response = await processPattern(
			pattern.content,
			imageCollection,
			pattern?.cpt_blocks ? pattern.cpt_blocks : [],
			pattern?.style ? pattern.style : ''
		);
		if (response === 'failed') {
			// It could fail because cloudflare is blocking the request. Lets try with ajax.
			ajaxImportProcess(blockCode, imageCollection);
			console.log('Import Process Failed when processing data through rest api... Trying ajax.');
		} else {
			importContent(response, clientId);
			setIsImporting(false);
		}
	}

	async function getLibraryContent(tempSubTab, tempReload) {
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
			action?.[0]?.key ? action[0].key : '',
			tempSubTab === 'pages' ? 'pages' : ''
		);
		if (response === 'failed') {
			console.log('Permissions Error getting library Content');
			if (tempSubTab === 'pages') {
				setPages('error');
			} else {
				setPatterns('error');
			}
			setIsError(true);
			setIsErrorType('reload');
			setIsLoading(false);
		} else if (response === 'error') {
			console.log('Error getting library Content.');
			if (tempSubTab === 'pages') {
				setPages('error');
			} else {
				setPatterns('error');
			}
			setIsError(true);
			setIsLoading(false);
		} else {
			const o = SafeParseJSON(response, false);
			if (o) {
				if (tempReload && tempSubTab !== 'pages') {
					const tempCloudSettings = kadence_blocks_params?.cloud_settings
						? JSON.parse(kadence_blocks_params.cloud_settings)
						: {};
					if (tempCloudSettings && tempCloudSettings?.connections) {
						const currentConnectionKey = tempCloudSettings.connections.findIndex((obj) => {
							return obj.slug === tab;
						});
						if (tempCloudSettings?.connections?.[currentConnectionKey]) {
							const getConnectionData = await getConnection(
								tab,
								action?.[0]?.url ? action[0].url : '',
								action?.[0]?.key ? action[0].key : ''
							);
							const conData = SafeParseJSON(getConnectionData, false);
							let shouldUpdate = false;
							// Update the connection data name and pages if they are different.
							if (conData) {
								if (
									conData?.name &&
									tempCloudSettings.connections[currentConnectionKey]?.title !== conData.name
								) {
									tempCloudSettings.connections[currentConnectionKey].title = conData.name;
									shouldUpdate = true;
								}
								if (tempCloudSettings.connections[currentConnectionKey]?.pages !== conData?.pages) {
									if (!conData?.pages) {
										tempCloudSettings.connections[currentConnectionKey].pages = '';
									} else {
										tempCloudSettings.connections[currentConnectionKey].pages = conData.pages;
									}
									shouldUpdate = true;
								}
								if (shouldUpdate) {
									// Update the cloud settings.
									kadence_blocks_params.cloud_settings = JSON.stringify(tempCloudSettings);
									const getConnectionUpdate = await updateConnections(tempCloudSettings);
									if (getConnectionUpdate !== 'failed') {
										onLibraryUpdate();
									}
								}
							}
						}
					}
				}
				const patternCategories = await getPatternCategories(
					tab,
					tempReload,
					action?.[0]?.url ? action[0].url : '',
					action?.[0]?.key ? action[0].key : '',
					tempSubTab === 'pages' ? 'pages' : ''
				);
				if (patternCategories) {
					const catOrder = SafeParseJSON(patternCategories, false);
					if (tempSubTab === 'pages') {
						const pageCats = catOrder ? catOrder : {};
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
						Object.keys(pageCats).map(function (key, index) {
							if (!tempCats.hasOwnProperty(key)) {
								delete pageCats[key];
							}
						});
						const cats = { ...{ all: 'All' }, ...pageCats, ...tempCats };
						setPages(o);
						setPagesCategories(JSON.parse(JSON.stringify(cats)));
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
					if (tempSubTab === 'pages') {
						setPages('error');
					} else {
						setPatterns('error');
					}
					setIsError(true);
				}
			} else {
				console.log('error, library content incorrect', response);
				if (tempSubTab === 'pages') {
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
			getLibraryContent(selectedSubTab, true);
		} else if (!isLoading) {
			getLibraryContent(selectedSubTab, false);
		}
	}, [reload, tab, selectedSubTab]);
	return (
		<div className={`kt-prebuilt-content kb-prebuilt-has-sidebar kb-cloud-pattern-library`}>
			<CloudLibrarySidebar
				connection={currentLibrary?.[0]}
				pageCategory={pageCategory || {}}
				category={category || {}}
				subTab={selectedSubTab}
				setSubTab={setSubTab}
				setPageCategory={(newCat) => {
					setPageCategory(newCat);
					setPageCategorySlug(newCat[currentLibrary?.[0]?.slug]);
				}}
				pageCategories={pageCategoryListOptions}
				categories={categoryListOptions}
				setCategory={(newCat) => {
					setCategory(newCat);
					// This is required to refresh the patterns when the category is changed.
					setCategorySlug(newCat[currentLibrary?.[0]?.slug]);
				}}
				search={search}
			/>
			{selectedSubTab === 'pages' ? (
				<>
					{isImporting || isLoading || false === pages || isError ? (
						<>
							{!isError && isLoading && (
								<div className="kb-loading-library">
									<Spinner />
								</div>
							)}
							{!isError && isImporting && (
								<div className="preparing-importing-images">
									<Spinner />
									<h2>{__('Preparing Content…', 'kadence-blocks')}</h2>
								</div>
							)}
							{isError && isErrorType === 'general' && (
								<div className="kb-pattern-error-wrapper">
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
											onClick={() =>
												!isLoading ? getLibraryContent(selectedSubTab, true) : null
											}
										>
											{__('Sync with Cloud', 'kadence-blocks')}
										</Button>
									</div>
								</div>
							)}
							{isError && isErrorType === 'reload' && (
								<div className="kb-pattern-error-wrapper">
									<h2 style={{ textAlign: 'center' }}>
										{__(
											'Error, Unable to access library, please reload this page in your browser.',
											'kadence-blocks'
										)}
									</h2>
								</div>
							)}
							{/* { false === pages && (
								<>{ loadPagesData() }</>
							) } */}
						</>
					) : (
						<CloudLibraryPatterns
							connection={currentLibrary?.[0]}
							category={pageCategory || {}}
							patterns={pages}
							search={search}
							onInsertContent={(pattern) => onInsertContent(pattern, 'page')}
							setSearch={setSearch}
						/>
					)}
				</>
			) : (
				<>
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
											onClick={() => getLibraryContent(selectedSubTab, true)}
										>
											{__('Sync with Cloud', 'kadence-blocks')}
										</Button>
									</div>
								</div>
							)}
						</>
					) : (
						<CloudLibraryPatterns
							connection={currentLibrary?.[0]}
							category={category || {}}
							patterns={patterns}
							search={search}
							onInsertContent={onInsertContent}
							sortBy={sortBy}
							setSearch={setSearch}
							setSortBy={setSortBy}
						/>
					)}
				</>
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
