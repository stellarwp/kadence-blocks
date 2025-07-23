/**
 * Handle Template Library.
 */

/**
 * External dependencies
 */
import { debounce } from 'lodash';
import LazyLoad from 'react-lazy-load';

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';
import { Component, Fragment } from '@wordpress/element';
import { Button, Spinner } from '@wordpress/components';
import { update } from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SafeParseJSON } from '@kadence/helpers';

/**
 * Internal block libraries
 */
class TemplatesLibrary extends Component {
	constructor() {
		super(...arguments);
		this.loadTemplateData = this.loadTemplateData.bind(this);
		this.onInsertContent = this.onInsertContent.bind(this);
		this.importProcess = this.importProcess.bind(this);
		this.reloadTemplateData = this.reloadTemplateData.bind(this);
		this.state = {
			category: 'all',
			starting: true,
			search: null,
			items: kadence_blocks_params.library_templates
				? SafeParseJSON(kadence_blocks_params.library_templates, false)
				: false,
			errorItems: false,
			isImporting: false,
			isLoading: false,
			sidebar: false,
			categories: {
				category: __('Category', 'kadence-blocks'),
				pro: __('Pro', 'kadence-blocks'),
				feature: __('Feature', 'kadence-blocks'),
				hero: __('Hero', 'kadence-blocks'),
				'call-to-action': __('Call To Action', 'kadence-blocks'),
				staff: __('Staff', 'kadence-blocks'),
				testimonials: __('Testimonials', 'kadence-blocks'),
			},
		};
		this.debouncedReloadTemplateData = debounce(this.reloadTemplateData.bind(this), 200);
	}
	onInsertContent(blockcode) {
		this.importProcess(blockcode);
	}
	importProcess(blockcode) {
		this.setState({ isImporting: true });
		const data = new FormData();
		data.append('action', 'kadence_import_process_data');
		data.append('security', kadence_blocks_params.ajax_nonce);
		data.append('import_content', blockcode);
		const control = this;
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
					control.props.import(response);
					control.setState({ isImporting: false });
				}
			})
			.fail(function (error) {
				console.log(error);
				control.setState({ isImporting: false });
			});
	}
	reloadTemplateData() {
		this.setState({ errorItems: false, isLoading: true, items: 'loading' });
		let data_key =
			kadence_blocks_params.proData && kadence_blocks_params.proData.api_key
				? kadence_blocks_params.proData.api_key
				: '';
		let data_email =
			kadence_blocks_params.proData && kadence_blocks_params.proData.api_email
				? kadence_blocks_params.proData.api_email
				: '';
		const product_id =
			kadence_blocks_params.proData && kadence_blocks_params.proData.product_id
				? kadence_blocks_params.proData.product_id
				: '';
		if (!data_key) {
			data_key =
				kadence_blocks_params.proData && kadence_blocks_params.proData.ithemes_key
					? kadence_blocks_params.proData.ithemes_key
					: '';
			if (data_key) {
				data_email = 'iThemes';
			}
		}
		const data = new FormData();
		data.append('action', 'kadence_import_reload_prebuilt_templates_data');
		data.append('security', kadence_blocks_params.ajax_nonce);
		data.append('api_key', data_key);
		data.append('api_email', data_email);
		data.append('product_id', product_id);
		data.append('package', 'templates');
		const control = this;
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
					const o = SafeParseJSON(response, false);
					if (o) {
						const filteredLibraryItems = applyFilters('kadence.prebuilt_templates_object', o);
						kadence_blocks_params.library_templates = filteredLibraryItems;
						control.setState({ items: filteredLibraryItems, errorItems: false, isLoading: false });
					} else {
						control.setState({ items: 'error', errorItems: true, isLoading: false });
					}
				}
			})
			.fail(function (error) {
				console.log(error);
				control.setState({ items: 'error', errorItems: true, isLoading: false });
			});
	}
	loadTemplateData() {
		this.setState({ errorItems: false, isLoading: true, items: 'loading' });
		let data_key =
			kadence_blocks_params.proData && kadence_blocks_params.proData.api_key
				? kadence_blocks_params.proData.api_key
				: '';
		let data_email =
			kadence_blocks_params.proData && kadence_blocks_params.proData.api_email
				? kadence_blocks_params.proData.api_email
				: '';
		const product_id =
			kadence_blocks_params.proData && kadence_blocks_params.proData.product_id
				? kadence_blocks_params.proData.product_id
				: '';
		if (!data_key) {
			data_key =
				kadence_blocks_params.proData && kadence_blocks_params.proData.ithemes_key
					? kadence_blocks_params.proData.ithemes_key
					: '';
			if (data_key) {
				data_email = 'iThemes';
			}
		}
		const data = new FormData();
		data.append('action', 'kadence_import_get_prebuilt_templates_data');
		data.append('security', kadence_blocks_params.ajax_nonce);
		data.append('api_key', data_key);
		data.append('api_email', data_email);
		data.append('product_id', product_id);
		data.append('package', 'templates');
		const control = this;
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
					const o = SafeParseJSON(response, false);
					if (o) {
						const filteredLibraryItems = applyFilters('kadence.prebuilt_templates_object', o);
						kadence_blocks_params.library_templates = filteredLibraryItems;
						control.setState({ items: filteredLibraryItems, errorItems: false, isLoading: false });
					} else {
						control.setState({ items: 'error', errorItems: true, isLoading: false });
					}
				}
			})
			.fail(function (error) {
				console.log(error);
				control.setState({ items: 'error', errorItems: true, isLoading: false });
			});
	}
	render() {
		if (this.props.reload) {
			this.props.onReload();
			this.debouncedReloadTemplateData();
		}
		const control = this;
		const libraryItems = this.state.items;
		return (
			<div className={`kt-prebuilt-content${this.state.sidebar ? ' kb-prebuilt-has-sidebar' : ''}`}>
				{this.state.isImporting || this.state.isLoading || false === libraryItems || this.state.errorItems ? (
					<Fragment>
						{!this.state.errorItems && this.state.isLoading && <Spinner />}
						{!this.state.errorItems && this.state.isImporting && (
							<div className="preparing-importing-images">
								<Spinner />
								<h2>{__('Preparing Content…', 'kadence-blocks')}</h2>
							</div>
						)}
						{this.state.errorItems && (
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
										onClick={() => this.reloadTemplateData()}
									>
										{__('Sync with Cloud', 'kadence-blocks')}
									</Button>
								</div>
							</div>
						)}
						{false === libraryItems && <Fragment>{this.loadTemplateData()}</Fragment>}
					</Fragment>
				) : (
					<div className={'kb-prebuilt-grid kb-prebuilt-templates-grid'}>
						{Object.keys(this.state.items).map(function (key, index) {
							const name = libraryItems[key].name;
							const slug = libraryItems[key].slug;
							const image = libraryItems[key].image;
							const categories = libraryItems[key].categories;
							const keywords = libraryItems[key].keywords;
							const pro = libraryItems[key].pro;
							const url = libraryItems[key].url;
							const pages = libraryItems[key].pages;
							if (
								('all' === control.state.category ||
									Object.keys(categories).includes(control.state.category)) &&
								(!control.state.search ||
									(keywords &&
										keywords.some((x) =>
											x.toLowerCase().includes(control.state.search.toLowerCase())
										)))
							) {
								return (
									<div className="kt-prebuilt-item">
										<Button
											key={key}
											className="kt-import-btn"
											isSmall
											aria-label={sprintf(
												/* translators: %s is Prebuilt Name */
												__('Add %s', 'kadence-blocks'),
												name
											)}
											onClick={() => {
												control.props.onSelectTemplate({ name, slug, url });
											}}
										>
											<div
												className="kt-import-btn-inner"
												style={{
													paddingBottom: '126%',
												}}
											>
												<LazyLoad offsetBottom={200}>
													<img
														src={
															pages && pages.home && pages.home.crop_thumbnail
																? pages.home.crop_thumbnail
																: image
														}
														alt={name}
													/>
												</LazyLoad>
												<div className="demo-title">
													<h4 dangerouslySetInnerHTML={{ __html: name }} />
												</div>
											</div>
										</Button>
										{undefined !== pro && pro && (
											<Fragment>
												<span className="kb-pro-template">
													{__('Premium', 'kadence-blocks')}
												</span>
											</Fragment>
										)}
									</div>
								);
							}
						})}
					</div>
				)}
			</div>
		);
	}
}
export default TemplatesLibrary;
