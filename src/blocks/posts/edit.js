/**
 * BLOCK: Kadence Posts
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Icons
 */
import icons from '../../icons';

/**
 * Import External
 */
import KadenceSelectTerms from '../../components/terms/select-terms-control';
import TypographyControls from '../../components/typography/typography-control';
import debounce from 'lodash/debounce';
import classnames from 'classnames';
import Select from 'react-select';
import KadenceRange from '../../components/range/range-control';
import getQuery from './get-query';

/**
 * Import Css
 */
import './editor.scss';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import KadencePanelBody from '../../components/KadencePanelBody'
const { dateI18n, format, __experimentalGetSettings } = wp.date;
const {
	Component,
	Fragment,
} = wp.element;
const {
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
	BlockAlignmentToolbar,
	InspectorAdvancedControls,
} = wp.blockEditor;
const {
	TextControl,
	Placeholder,
	ToggleControl,
	SelectControl,
	RadioControl,
	Spinner,
} = wp.components;
const { apiFetch } = wp;
const { postTypes, taxonomies, postQueryEndpoint } = kadence_blocks_params;
const { addQueryArgs } = wp.url;
const { decodeEntities } = wp.htmlEntities;
/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const kbpostsUniqueIDs = [];

/**
 * Build Kadence Posts Block.
 */
class KadencePosts extends Component {
	constructor() {
		super( ...arguments );
		this.getPosts = this.getPosts.bind( this );
		this.getPreviewSize = this.getPreviewSize.bind( this );
		this.state = {
			latestPosts: [],
			loaded: false,
		};
		this.debouncedGetPosts = debounce( this.getPosts.bind( this ), 200 );
	}
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			kbpostsUniqueIDs.push( this.props.clientId.substr( 2, 9 ) );
		} else if ( kbpostsUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.attributes.uniqueID = '_' + this.props.clientId.substr( 2, 9 );
			kbpostsUniqueIDs.push( this.props.clientId.substr( 2, 9 ) );
		} else {
			kbpostsUniqueIDs.push( this.props.attributes.uniqueID );
		}
		this.getPosts();
	}
	componentDidUpdate( prevProps ) {
		const hasChange = [ 'postType', 'taxType', 'offsetQuery', 'postTax', 'excludeTax', 'allowSticky', 'orderBy', 'order', 'categories', 'tags', 'postsToShow' ].reduce(
			( acc, key ) => {
				return acc || prevProps.attributes[ key ] !== this.props.attributes[ key ];
			},
			false
		);
		if ( hasChange ) {
			this.setState( { loaded: false } );
			this.debouncedGetPosts();
		}
	}
	getPreviewSize( device, desktopSize, tabletSize, mobileSize ) {
		if ( device === 'Mobile' ) {
			if ( undefined !== mobileSize && '' !== mobileSize && null !== mobileSize ) {
				return mobileSize;
			} else if ( undefined !== tabletSize && '' !== tabletSize && null !== tabletSize ) {
				return tabletSize;
			}
		} else if ( device === 'Tablet' ) {
			if ( undefined !== tabletSize && '' !== tabletSize && null !== tabletSize ) {
				return tabletSize;
			}
		}
		return desktopSize;
	}
	getPosts() {
		this.setState( { loaded: false } );
		apiFetch( {
			path: addQueryArgs(
				postQueryEndpoint,
				getQuery( this.props.attributes, 'query' )
			),
		} )
			.then( ( posts ) => {
				this.setState( { latestPosts: posts, loaded: true } );
			} )
			.catch( () => {
				this.setState( { latestPosts: [], loaded: true } );
			} );
	}
	render() {
		const { attributes: { uniqueID, order, columns, tabletColumns, mobileColumns, orderBy, categories, tags, postsToShow, alignImage, postType, taxType, offsetQuery, postTax, excludeTax, showUnique, allowSticky, image, imageRatio, imageSize, author, authorLink, authorEnabledLabel, authorLabel, authorImage, authorImageSize, comments, metaCategories, metaCategoriesEnabledLabel, metaCategoriesLabel, date, dateUpdated, dateEnabledLabel, dateLabel, dateUpdatedEnabledLabel, dateUpdatedLabel, meta, metaDivider, categoriesDivider, aboveCategories, categoriesStyle, excerpt, readmore, readmoreLabel, loopStyle, titleFont, excerptCustomLength, excerptLength }, className, setAttributes, taxList, taxOptions, taxFilterOptions } = this.props;
		const { latestPosts, loaded } = this.state;
		const taxonomyList = [];
		const taxonomyOptions = [];
		const taxonomyFilterOptions = [];
		if ( undefined !== taxList && 0 !== Object.keys( taxList ).length ) {
			Object.keys( taxList ).map( ( item, theindex ) => {
				return taxonomyList.push( { value: taxList[ item ].name, label: taxList[ item ].label } );
			} );
		}
		if ( undefined !== taxOptions && 0 !== Object.keys( taxOptions ).length ) {
			Object.keys( taxOptions ).map( ( item, theindex ) => {
				return taxonomyOptions.push( { value: taxOptions[ item ].value, label: taxOptions[ item ].label } );
			} );
		}
		if ( undefined !== taxFilterOptions && 0 !== Object.keys( taxFilterOptions ).length ) {
			Object.keys( taxFilterOptions ).map( ( item, theindex ) => {
				return taxonomyFilterOptions.push( { value: taxFilterOptions[ item ].value, label: taxFilterOptions[ item ].label } );
			} );
		}
		let aboveSymbol;
		if ( 'dash' === categoriesDivider ) {
			aboveSymbol = <Fragment>&#8208;</Fragment>;
		} else if ( 'slash' === categoriesDivider ) {
			aboveSymbol = <Fragment>&#47;</Fragment>;
		} else if ( 'dot' === categoriesDivider ) {
			aboveSymbol = <Fragment>&#183;</Fragment>;
		} else {
			aboveSymbol = <Fragment>&#124;</Fragment>;
		}
		let columnsClass;
		if ( 1 === columns ) {
			columnsClass = 'grid-xs-col-1 grid-sm-col-1 grid-lg-col-1';
		} else if ( 2 === columns ) {
			if ( undefined !== tabletColumns && 1 === tabletColumns  ) {
				columnsClass = 'grid-xs-col-1 grid-sm-col-1 grid-lg-col-2';
			} else {
				columnsClass = 'grid-xs-col-1 grid-sm-col-2 grid-lg-col-2';
			}
		} else {
			if ( undefined !== tabletColumns && 1 === tabletColumns  ) {
				columnsClass = 'grid-xs-col-1 grid-sm-col-1 grid-lg-col-3';
			} else if ( undefined !== tabletColumns && 3 === tabletColumns  ) {
				columnsClass = 'grid-xs-col-1 grid-sm-col-3 grid-lg-col-3';
			} else {
				columnsClass = 'grid-xs-col-1 grid-sm-col-2 grid-lg-col-3';
			}
		}
		const titleSize = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== titleFont &&  undefined !== titleFont[ 0 ] &&  undefined !== titleFont[ 0 ].size && undefined !== titleFont[ 0 ].size[ 0 ] ? titleFont[ 0 ].size[ 0 ] : '' ), ( undefined !== titleFont &&  undefined !== titleFont[ 0 ] &&  undefined !== titleFont[ 0 ].size && undefined !== titleFont[ 0 ].size[ 1 ] ? titleFont[ 0 ].size[ 1 ] : '' ), ( undefined !== titleFont &&  undefined !== titleFont[ 0 ] &&  undefined !== titleFont[ 0 ].size && undefined !== titleFont[ 0 ].size[ 2 ] ? titleFont[ 0 ].size[ 2 ] : '' ) );
		const titleLineHeight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== titleFont &&  undefined !== titleFont[ 0 ] &&  undefined !== titleFont[ 0 ].lineHeight && undefined !== titleFont[ 0 ].lineHeight[ 0 ] ? titleFont[ 0 ].lineHeight[ 0 ] : '' ), ( undefined !== titleFont &&  undefined !== titleFont[ 0 ] &&  undefined !== titleFont[ 0 ].lineHeight && undefined !== titleFont[ 0 ].lineHeight[ 1 ] ? titleFont[ 0 ].lineHeight[ 1 ] : '' ), ( undefined !== titleFont &&  undefined !== titleFont[ 0 ] &&  undefined !== titleFont[ 0 ].lineHeight && undefined !== titleFont[ 0 ].lineHeight[ 2 ] ? titleFont[ 0 ].lineHeight[ 2 ] : '' ) );
		const titleLetterSpacing = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== titleFont &&  undefined !== titleFont[ 0 ] &&  undefined !== titleFont[ 0 ].letterSpacing && undefined !== titleFont[ 0 ].letterSpacing[ 0 ] ? titleFont[ 0 ].letterSpacing[ 0 ] : '' ), ( undefined !== titleFont &&  undefined !== titleFont[ 0 ] &&  undefined !== titleFont[ 0 ].letterSpacing && undefined !== titleFont[ 0 ].letterSpacing[ 1 ] ? titleFont[ 0 ].letterSpacing[ 1 ] : '' ), ( undefined !== titleFont &&  undefined !== titleFont[ 0 ] &&  undefined !== titleFont[ 0 ].letterSpacing && undefined !== titleFont[ 0 ].letterSpacing[ 2 ] ? titleFont[ 0 ].letterSpacing[ 2 ] : '' ) );
		const hasPosts = Array.isArray( latestPosts ) && latestPosts.length;
		const saveTitleFont = ( value ) => {
			const newUpdate = titleFont.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				titleFont: newUpdate,
			} );
		};
		const HtmlTagOut = 'h' + ( undefined !== titleFont && undefined !== titleFont[ 0 ] && undefined !== titleFont[0].level ? titleFont[0].level : '2' );
		const dateFormat = __experimentalGetSettings().formats.date;
		const settingspanel = (
			<Fragment>
				<InspectorControls>
					<KadencePanelBody panelName={'kb-posts-settings'}>
						<SelectControl
							label={ __( 'Select Posts Type:', 'kadence-blocks' ) }
							options={ postTypes }
							value={ postType }
							onChange={ ( value ) => {
								setAttributes( { postType: value } );
								setAttributes( { taxType: '' } );
								setAttributes( { categories: [] } );
							} }
						/>
						<SelectControl
							label={ __( 'Order by', 'kadence-blocks' ) }
							options={ [
								{
									label: __( 'Newest to Oldest', 'kadence-blocks' ),
									value: 'date/desc',
								},
								{
									label: __( 'Oldest to Newest', 'kadence-blocks' ),
									value: 'date/asc',
								},
								{
									label: __( 'Modified Ascending', 'kadence-blocks' ),
									value: 'modified/asc',
								},
								{
									label: __( 'Modified Decending', 'kadence-blocks' ),
									value: 'modified/desc',
								},
								{
									/* translators: label for ordering posts by title in ascending order */
									label: __( 'A → Z', 'kadence-blocks' ),
									value: 'title/asc',
								},
								{
									/* translators: label for ordering posts by title in descending order */
									label: __( 'Z → A', 'kadence-blocks' ),
									value: 'title/desc',
								},
								{
									/* translators: label for ordering posts by title in descending order */
									label: __( 'Menu Order', 'kadence-blocks' ),
									value: 'menu_order/asc',
								},
								{
									/* translators: label for ordering posts by title in descending order */
									label: __( 'Random', 'kadence-blocks' ),
									value: 'rand/desc',
								},
							] }
							value={ `${ orderBy }/${ order }` }
							onChange={ ( value ) => {
								const [ newOrderBy, newOrder ] = value.split( '/' );
								if ( newOrder !== order ) {
									setAttributes( { order: newOrder } );
								}
								if ( newOrderBy !== orderBy ) {
									setAttributes( { orderBy: newOrderBy } );
								}
							} }
						/>
						<KadenceRange
							key="query-controls-range-control"
							label={ __( 'Number of items', 'kadence-blocks' ) }
							value={ postsToShow }
							onChange={ ( value ) => setAttributes( { postsToShow: value } ) }
							min={ 1 }
							max={ 300 }
						/>
						<KadenceRange
							key="query-controls-range-control"
							label={ __( 'Offset Starting Post', 'kadence-blocks' ) }
							value={ offsetQuery }
							onChange={ ( value ) => setAttributes( { offsetQuery: value } ) }
							min={ 0 }
							max={ 100 }
						/>
						{ ( ( postType && postType !== 'post' ) || postTax ) && (
							<Fragment>
								{ ( undefined !== taxonomyList && 0 !== taxonomyList.length ) && (
									<div className="term-select-form-row">
										<label htmlFor={ 'tax-selection' } className="screen-reader-text">
											{ __( 'Select Taxonomy', 'kadence-blocks' ) }
										</label>
										<Select
											value={ taxonomyList.filter( ( { value } ) => value === taxType ) }
											onChange={ ( select ) => {
												setAttributes( { taxType: ( select && select.value ? select.value : '' ), categories: [] } );
											} }
											id={ 'tax-selection' }
											options={ taxonomyList }
											isMulti={ false }
											isClearable={ true }
											maxMenuHeight={ 300 }
											placeholder={ __( 'Select Taxonomy', 'kadence-blocks' ) }
										/>
									</div>
								) }
								{ ( undefined !== taxonomyOptions && 0 !== taxonomyOptions.length ) && (
									<Fragment>
										<div className="term-select-form-row">
											<label htmlFor={ 'terms-selection' } className="screen-reader-text">
												{ __( 'Select Terms', 'kadence-blocks' ) }
											</label>
											<Select
												value={ categories }
												onChange={ ( value ) => {
													setAttributes( { categories: ( value ? value : [] ) } );
												} }
												id={ 'terms-selection' }
												options={ taxonomyOptions }
												isMulti={ true }
												isClearable={ true }
												maxMenuHeight={ 300 }
												placeholder={ __( 'Select', 'kadence-blocks' ) }
											/>
										</div>
										<RadioControl
											help={ __( 'Whether to include or exclude items from selected terms.', 'kadence-blocks' ) }
											selected={ ( undefined !== excludeTax ? excludeTax : 'include' ) }
											options={ [
												{ label: __( 'Include', 'kadence-blocks' ), value: 'include' },
												{ label: __( 'Exclude', 'kadence-blocks' ), value: 'exclude' },
											] }
											onChange={ ( value ) => setAttributes( { excludeTax: value } ) }
										/>
									</Fragment>
								) }
								{ ( ! postType || postType === 'post' ) && (
									<ToggleControl
										label={ __( 'Select the post Taxonomy', 'kadence-blocks' ) }
										checked={ postTax }
										onChange={ ( value ) => setAttributes( { postTax: value } ) }
									/>
								) }
							</Fragment>
						) }
						{ ( ! postType || ( postType === 'post' && ! postTax ) ) && (
							<Fragment>
								<KadenceSelectTerms
									placeholder={ __( 'Filter by Category', 'kadence-blocks' ) }
									restBase={ 'wp/v2/categories' }
									fieldId={ 'tax-select-category' }
									value={ categories }
									onChange={ ( value ) => {
										setAttributes( { categories: ( value ? value : [] ) } );
									} }
								/>
								<KadenceSelectTerms
									placeholder={ __( 'Filter by Tag', 'kadence-blocks' ) }
									restBase={ 'wp/v2/tags' }
									fieldId={ 'tax-select-tags' }
									value={ tags }
									onChange={ ( value ) => {
										setAttributes( { tags: ( value ? value : [] ) } );
									} }
								/>
								<RadioControl
									help={ __( 'Whether to include or exclude items from selected terms.', 'kadence-blocks' ) }
									selected={ ( undefined !== excludeTax ? excludeTax : 'include' ) }
									options={ [
										{ label: __( 'Include', 'kadence-blocks' ), value: 'include' },
										{ label: __( 'Exclude', 'kadence-blocks' ), value: 'exclude' },
									] }
									onChange={ ( value ) => setAttributes( { excludeTax: value } ) }
								/>
								<ToggleControl
									label={ __( 'Select the post Taxonomy', 'kadence-blocks' ) }
									checked={ postTax }
									onChange={ ( value ) => setAttributes( { postTax: value } ) }
								/>
							</Fragment>
						) }
						<ToggleControl
							label={ __( 'Show Unique', 'kadence-blocks' ) }
							help={ __( 'Exclude posts in this block from showing in others on the same page.', 'kadence-blocks' ) }
							checked={ showUnique }
							onChange={ ( value ) => setAttributes( { showUnique: value } ) }
						/>
						<ToggleControl
							label={ __( 'Allow Sticky Posts?', 'kadence-blocks' ) }
							checked={ allowSticky }
							onChange={ ( value ) => setAttributes( { allowSticky: value } ) }
						/>
					</KadencePanelBody>
					<KadencePanelBody
						title={ __( 'Layout Settings', 'kadence-blocks' ) }
						initialOpen={ false }
						panelName={ 'kb-posts-layout-settings' }
					>
						<KadenceRange
							label={ __( 'Columns', 'kadence-blocks' ) }
							value={ columns }
							onChange={ ( value ) => setAttributes( { columns: value } ) }
							min={ 1 }
							max={ 3 }
						/>
						{ 1 !== columns && (
							<KadenceRange
								label={ __( 'Tablet Columns', 'kadence-blocks' ) }
								value={ tabletColumns }
								onChange={ ( value ) => setAttributes( { tabletColumns: value } ) }
								min={ 1 }
								max={ columns }
							/>
						) }
						{ 1 === columns && image && (
							<SelectControl
								label={ __( 'Align Image', 'kadence-blocks' ) }
								options={ [
									{
										label: __( 'Top', 'kadence-blocks' ),
										value: 'above',
									},
									{
										label: __( 'Left', 'kadence-blocks' ),
										value: 'beside',
									},
								] }
								value={ alignImage }
								onChange={ ( value ) => setAttributes( { alignImage: value } ) }
							/>
						) }
						<SelectControl
							label={ __( 'Style', 'kadence-blocks' ) }
							options={ [
								{
									label: __( 'Boxed', 'kadence-blocks' ),
									value: 'boxed',
								},
								{
									label: __( 'Unboxed', 'kadence-blocks' ),
									value: 'unboxed',
								},
							] }
							value={ loopStyle }
							onChange={ ( value ) => setAttributes( { loopStyle: value } ) }
						/>
					</KadencePanelBody>
					<KadencePanelBody
						title={ __( 'Image Settings', 'kadence-blocks' ) }
						initialOpen={ false }
						panelName={ 'kb-posts-image-settings' }
					>
						<ToggleControl
							label={ __( 'Enable Image', 'kadence-blocks' ) }
							checked={ image }
							onChange={ ( value ) => setAttributes( { image: value } ) }
						/>
						{ image && (
							<Fragment>
								<SelectControl
									label={ __( 'Image Ratio', 'kadence-blocks' ) }
									options={ [
										{
											label: __( 'Inherit', 'kadence-blocks' ),
											value: 'inherit',
										},
										{
											label: __( '1:1', 'kadence-blocks' ),
											value: '1-1',
										},
										{
											label: __( '4:3', 'kadence-blocks' ),
											value: '3-4',
										},
										{
											label: __( '3:2', 'kadence-blocks' ),
											value: '2-3',
										},
										{
											label: __( '16:9', 'kadence-blocks' ),
											value: '9-16',
										},
										{
											label: __( '2:1', 'kadence-blocks' ),
											value: '1-2',
										},
										{
											label: __( '4:5', 'kadence-blocks' ),
											value: '5-4',
										},
										{
											label: __( '3:4', 'kadence-blocks' ),
											value: '4-3',
										},
										{
											label: __( '2:3', 'kadence-blocks' ),
											value: '3-2',
										},
									] }
									value={ imageRatio }
									onChange={ ( value ) => setAttributes( { imageRatio: value } ) }
								/>
								<SelectControl
									label={ __( 'Image Size', 'kadence-blocks' ) }
									options={ [
										{
											label: __( 'Thumbnail', 'kadence-blocks' ),
											value: 'thumbnail',
										},
										{
											label: __( 'Medium', 'kadence-blocks' ),
											value: 'medium',
										},
										{
											label: __( 'Medium Large', 'kadence-blocks' ),
											value: 'medium_large',
										},
										{
											label: __( 'Large', 'kadence-blocks' ),
											value: 'large',
										},
										{
											label: __( 'Full', 'kadence-blocks' ),
											value: 'full',
										},
									] }
									value={ imageSize }
									onChange={ ( value ) => setAttributes( { imageSize: value } ) }
								/>
							</Fragment>
						) }
					</KadencePanelBody>
					{ ( ! postType || postType === 'post' ) && (
						<KadencePanelBody
							title={ __( 'Category Settings', 'kadence-blocks' ) }
							initialOpen={ false }
							panelName={ 'kb-posts-category-settings' }
						>
							<ToggleControl
								label={ __( 'Enable Above Title Category', 'kadence-blocks' ) }
								checked={ aboveCategories }
								onChange={ ( value ) => setAttributes( { aboveCategories: value } ) }
							/>
							{ aboveCategories && (
								<Fragment>
									<SelectControl
										label={ __( 'Category Style', 'kadence-blocks' ) }
										options={ [
											{
												label: __( 'Normal', 'kadence-blocks' ),
												value: 'normal',
											},
											{
												label: __( 'Pill', 'kadence-blocks' ),
												value: 'pill',
											},
										] }
										value={ categoriesStyle }
										onChange={ ( value ) => setAttributes( { categoriesStyle: value } ) }
									/>
									{ 'normal' === categoriesStyle && (
										<SelectControl
											label={ __( 'Category Divider', 'kadence-blocks' ) }
											options={ [
												{
													label: '|',
													value: 'vline',
												},
												{
													label:'-',
													value: 'dash',
												},
												{
													label: '\\',
													value: 'slash',
												},
												{
													label: '·',
													value: 'dot',
												},
											] }
											value={ categoriesDivider }
											onChange={ ( value ) => setAttributes( { categoriesDivider: value } ) }
										/>
									) }
								</Fragment>
							) }
						</KadencePanelBody>
					) }
					<KadencePanelBody
						title={ __( 'Title Size', 'kadence-blocks' ) }
						initialOpen={ false }
						panelName={ 'kb-posts-title-settings' }
					>
						<TypographyControls
							fontGroup={ 'post-title' }
							tagLevel={ titleFont[ 0 ].level }
							tagLowLevel={ 2 }
							tagHighLevel={ 7 }
							onTagLevel={ ( value ) => saveTitleFont( { level: value } ) }
							fontSize={ titleFont[ 0 ].size }
							onFontSize={ ( value ) => saveTitleFont( { size: value } ) }
							fontSizeType={ titleFont[ 0 ].sizeType }
							onFontSizeType={ ( value ) => saveTitleFont( { sizeType: value } ) }
							lineHeight={ titleFont[ 0 ].lineHeight }
							onLineHeight={ ( value ) => saveTitleFont( { lineHeight: value } ) }
							lineHeightType={ titleFont[ 0 ].lineType }
							onLineHeightType={ ( value ) => saveTitleFont( { lineType: value } ) }
							reLetterSpacing={ titleFont[ 0 ].letterSpacing }
							onLetterSpacing={ ( value ) => saveTitleFont( { letterSpacing: value } ) }
							letterSpacingType={ titleFont[ 0 ].letterType }
							onLetterSpacingType={ ( value ) => saveTitleFont( { letterType: value } ) }
						/>
					</KadencePanelBody>
					<KadencePanelBody
						title={ __( 'Meta Settings', 'kadence-blocks' ) }
						initialOpen={ false }
						panelName={ 'kb-posts-meta-settings' }
					>
						<ToggleControl
							label={ __( 'Enable Meta Info', 'kadence-blocks' ) }
							checked={ meta }
							onChange={ ( value ) => setAttributes( { meta: value } ) }
						/>
						{ meta && (
							<Fragment>
								<ToggleControl
									label={ __( 'Enable Author', 'kadence-blocks' ) }
									checked={ author }
									onChange={ ( value ) => setAttributes( { author: value } ) }
								/>
								{ author && (
									<Fragment>
										<ToggleControl
											label={ __( 'Enable Author Image', 'kadence-blocks' ) }
											checked={ authorImage }
											onChange={ ( value ) => setAttributes( { authorImage: value } ) }
										/>
										{ authorImage && (
											<KadenceRange
												label={ __( 'Author Image Size' ) }
												value={ authorImageSize }
												onChange={ ( value ) => setAttributes( { authorImageSize: value } ) }
												min={ 5 }
												max={ 100 }
											/>
										) }
										<ToggleControl
											label={ __( 'Enable Author Link', 'kadence-blocks' ) }
											checked={ authorLink }
											onChange={ ( value ) => setAttributes( { authorLink: value } ) }
										/>
										<ToggleControl
											label={ __( 'Enable Author Label', 'kadence-blocks' ) }
											checked={ authorEnabledLabel }
											onChange={ ( value ) => setAttributes( { authorEnabledLabel: value } ) }
										/>
										{ authorEnabledLabel && (
											<TextControl
												label={ __( 'Author Label' ) }
												value={ ( authorLabel ? authorLabel : __( 'By', 'kadence-blocks' ) ) }
												onChange={ ( value ) => setAttributes( { authorLabel: value } ) }
											/>
										) }
									</Fragment>
								) }
								<ToggleControl
									label={ __( 'Enable Date', 'kadence-blocks' ) }
									checked={ date }
									onChange={ ( value ) => setAttributes( { date: value } ) }
								/>
								{ date && (
									<Fragment>
										<ToggleControl
											label={ __( 'Enable Date Label', 'kadence-blocks' ) }
											checked={ dateEnabledLabel }
											onChange={ ( value ) => setAttributes( { dateEnabledLabel: value } ) }
										/>
										{ dateEnabledLabel && (
											<TextControl
												label={ __( 'Date Label' ) }
												value={ ( dateLabel ? dateLabel : __( 'Posted On', 'kadence-blocks' ) ) }
												onChange={ ( value ) => setAttributes( { dateLabel: value } ) }
											/>
										) }
									</Fragment>
								) }
								<ToggleControl
									label={ __( 'Enable Modified Date', 'kadence-blocks' ) }
									checked={ dateUpdated }
									onChange={ ( value ) => setAttributes( { dateUpdated: value } ) }
								/>
								{ dateUpdated && (
									<Fragment>
										<ToggleControl
											label={ __( 'Enable Modified Date Label', 'kadence-blocks' ) }
											checked={ dateUpdatedEnabledLabel }
											onChange={ ( value ) => setAttributes( { dateUpdatedEnabledLabel: value } ) }
										/>
										{ dateUpdatedEnabledLabel && (
											<TextControl
												label={ __( 'Modified Date Label' ) }
												value={ ( dateUpdatedLabel ? dateUpdatedLabel : __( 'Updated On', 'kadence-blocks' ) ) }
												onChange={ ( value ) => setAttributes( { dateUpdatedLabel: value } ) }
											/>
										) }
									</Fragment>
								) }
								{ ( ! postType || postType === 'post' ) && (
									<Fragment>
										<ToggleControl
											label={ __( 'Enable Categories', 'kadence-blocks' ) }
											checked={ metaCategories }
											onChange={ ( value ) => setAttributes( { metaCategories: value } ) }
										/>
										{ metaCategories && (
											<Fragment>
												<ToggleControl
													label={ __( 'Enable Categories Label', 'kadence-blocks' ) }
													checked={ metaCategoriesEnabledLabel }
													onChange={ ( value ) => setAttributes( { metaCategoriesEnabledLabel: value } ) }
												/>
												{ metaCategoriesEnabledLabel && (
													<TextControl
														label={ __( 'Categories Label' ) }
														value={ ( metaCategoriesLabel ? metaCategoriesLabel : __( 'Posted In', 'kadence-blocks' ) ) }
														onChange={ ( value ) => setAttributes( { metaCategoriesLabel: value } ) }
													/>
												) }
											</Fragment>
										) }
										<ToggleControl
											label={ __( 'Enable Comments', 'kadence-blocks' ) }
											checked={ comments }
											onChange={ ( value ) => setAttributes( { comments: value } ) }
										/>
									</Fragment>
								) }
							</Fragment>
						) }
					</KadencePanelBody>
					<KadencePanelBody
						title={ __( 'Content Settings', 'kadence-blocks' ) }
						initialOpen={ false }
						panelName={ 'kb-posts-content' }
					>
						<ToggleControl
							label={ __( 'Enable Excerpt', 'kadence-blocks' ) }
							checked={ excerpt }
							onChange={ ( value ) => setAttributes( { excerpt: value } ) }
						/>
						<ToggleControl
							label={ __( 'Enable Custom Excerpt Length', 'kadence-blocks' ) }
							checked={ excerptCustomLength }
							onChange={ ( value ) => setAttributes( { excerptCustomLength: value } ) }
						/>
						{ excerptCustomLength && (
							<KadenceRange
								label={ __( 'Max number of words in excerpt', 'kadence-blocks' ) }
								value={ excerptLength }
								onChange={ ( value ) => setAttributes( { excerptLength: value } ) }
								min={ 10 }
								max={ 100 }
							/>
						) }
						<ToggleControl
							label={ __( 'Enable Read More', 'kadence-blocks' ) }
							checked={ readmore }
							onChange={ ( value ) => setAttributes( { readmore: value } ) }
						/>
						{ readmore && (
							<TextControl
								label={ __( 'Read More', 'kadence-blocks' ) }
								value={ readmoreLabel }
								onChange={ ( value ) => setAttributes( { readmoreLabel: value } ) }
							/>
						) }
					</KadencePanelBody>
				</InspectorControls>
			</Fragment>
		);
		if ( ! loaded ) {
			return (
				<Fragment>
					{ settingspanel }
					<Placeholder
						icon="admin-post"
						label={ __( 'Posts', 'kadence-blocks' ) }
					>

						<Spinner />
					</Placeholder>
				</Fragment>
			);
		}
		if ( ! hasPosts ) {
			return (
				<Fragment>
					{ settingspanel }
					<Placeholder
						icon="admin-post"
						label={ __( 'Posts', 'kadence-blocks' ) }
					>

						{ ! Array.isArray( latestPosts ) ?
							<Spinner /> :
							__( 'No posts found.', 'kadence-blocks' ) }
					</Placeholder>
				</Fragment>
			);
		}
		// Removing posts from display should be instant.
		const displayPosts = latestPosts.length > postsToShow ? latestPosts.slice( 0, postsToShow ) : latestPosts;
		const renderPosts = ( post, i ) => {
			let theExcerpt = ( undefined !== post.excerpt && post.excerpt && undefined !== post.excerpt.rendered ? post.excerpt.rendered : '' );
			const excerptElement = document.createElement( 'div' );
			excerptElement.innerHTML = theExcerpt;
			theExcerpt = excerptElement.textContent || excerptElement.innerText || '';
			let postExcerpt = '';
			if ( excerptCustomLength && theExcerpt ) {
				const needsTrim = excerptLength < theExcerpt.trim().split( ' ' ).length && post.excerpt.raw === '';
				postExcerpt = needsTrim ? (
					<Fragment>
						{ theExcerpt
							.trim()
							.split( ' ', excerptLength )
							.join( ' ' ) }
					</Fragment>
				) : (
					theExcerpt
				);
			} else {
				postExcerpt = theExcerpt;
			}
			return (
				<article
					key={ i }
					className={ classnames( post.featured_image_src_large && post.featured_image_src_large[ 0 ] && image ? 'has-post-thumbnail' : 'kb-no-thumb' ) + ' entry content-bg entry content-bg loop-entry components-disabled' }
				>
					{ image && post.featured_image_src_large && post.featured_image_src_large[ 0 ] !== undefined && (
						<a href={ post.link } className={ `post-thumbnail kadence-thumbnail-ratio-${ imageRatio }`}>
							<div className="post-thumbnail-inner">
								<img
									src={ post.featured_image_src_large[ 0 ] }
									alt={ decodeEntities( post.title.rendered.trim() ) || __( '(Untitled)', 'kadence-blocks' ) }
								/>
							</div>
						</a>
					) }
					<div className="entry-content-wrap">
						<header className="entry-header">
							{ ( postType === 'post' && aboveCategories && post.category_info ) && (
								<div className="entry-taxonomies">
									<span className={ `category-links term-links category-style-${ categoriesStyle }` }>
										{ post.category_info.map( ( category, index, arr ) => {
											if ( arr.length - 1 === index || categoriesStyle === 'pill' ) {
												return (
													<a key={ category.id } className="kb-posts-block-category-link" href={ '#category' }>
														{ category.name }
													</a>
												);
											}
											return (
												<Fragment key={ category.id }>
													<a key={ category.id } className="kb-posts-block-category-link" href={ '#category' }>
														{ category.name }
													</a><span> { aboveSymbol } </span>
												</Fragment>
											);
										} ) }
									</span>
								</div>
							) }
							<HtmlTagOut
								className="entry-title"
								style={ {
									fontSize: ( titleSize ? titleSize + titleFont[ 0 ].sizeType : undefined ),
									lineHeight: ( titleLineHeight ? titleLineHeight + titleFont[ 0 ].lineType : undefined ),
									letterSpacing: ( titleLetterSpacing ? titleLetterSpacing + titleFont[ 0 ].letterType : undefined ),
									textTransform: ( titleFont[ 0 ].textTransform ? titleFont[ 0 ].textTransform : undefined ),
								} }
							>
								<a
									href={ post.link }
									dangerouslySetInnerHTML={ { __html: post.title.rendered.trim() || __( '(Untitled)' ) }}
								/>
							</HtmlTagOut>
							{ meta && (
								<div className={ `entry-meta entry-meta-divider-${ metaDivider }` }>
									{ author && post.author_info && post.author_info.display_name && (
										<span className="posted-by">
											{ authorImage && post.author_info.author_image && (
												<span className="author-avatar" style={ {
													width: authorImageSize ? authorImageSize + 'px': undefined,
													height: authorImageSize ? authorImageSize + 'px': undefined,
												} }>
													<span className="author-image">
														{<img src={ post.author_info.author_image } style={ {
															width: authorImageSize ? authorImageSize + 'px': undefined,
															height: authorImageSize ? authorImageSize + 'px': undefined,
														}} />}
													</span>
												</span>
											) }
											{ authorEnabledLabel && (
												<span className="meta-label">
													{ ( authorLabel ? authorLabel : __( 'By', 'kadence-blocks' ) ) }
												</span>
											) }
											<span className="author vcard">
												{ authorLink ? (
													<a className="url fn n" href={ post.author_info.author_link }>
														{ post.author_info.display_name }
													</a>
												) : (
													<span className="fn n">
														{ post.author_info.display_name }
													</span>
												) }
											</span>
										</span>
									) }
									{ date && post.date_gmt && (
										<span className="posted-on">
											{ dateEnabledLabel && (
												<span className="meta-label">
													{ ( dateLabel ? dateLabel : __( 'Posted On', 'kadence-blocks' ) ) }
												</span>
											) }
											<time dateTime={ format( 'c', post.date_gmt ) } className={ 'entry-date published' }>
												{ dateI18n( dateFormat, post.date_gmt ) }
											</time>
										</span>
									) }
									{ dateUpdated && post.modified_gmt && (
										<span className="updated-on">
											{ dateUpdatedEnabledLabel && (
												<span className="meta-label">
													{ ( dateUpdatedLabel ? dateUpdatedLabel : __( 'Updated On', 'kadence-blocks' ) ) }
												</span>
											) }
											<time dateTime={ format( 'c', post.modified_gmt ) } className={ 'updated entry-date published' }>
												{ dateI18n( dateFormat, post.modified_gmt ) }
											</time>
										</span>
									) }
									{ metaCategories && post.category_info && (
										<span className="category-links">
											{ metaCategoriesEnabledLabel && (
												<span className="meta-label">
													{ ( metaCategoriesLabel ? metaCategoriesLabel : __( 'Posted In', 'kadence-blocks' ) ) }
												</span>
											) }
											<span className="category-link-items">
												{ post.category_info.map( ( category, index, arr ) => {
													if ( arr.length - 1 === index ) {
														return (
															<a key={ category.id } className="kb-posts-block-category-link" href={ '#category' }>
																{ category.name }
															</a>
														);
													}
													return (
														<Fragment key={ category.id }>
															<a key={ category.id } className="kb-posts-block-category-link" href={ '#category' }>
																{ category.name }
															</a><span>&#44; </span>
														</Fragment>
													);
												} ) }
											</span>
										</span>
									) }
									{ comments && 0 !== post.comment_info && (
										<span className="meta-comments">
											<a className="meta-comments-link anchor-scroll" href={ post.link + '#comments' }>
												{ 1 === post.comment_info && (
													post.comment_info + ' ' + __( 'Comment', 'kadence-blocks' )
												) }
												{ 1 !== post.comment_info && (
													post.comment_info + ' ' + __( 'Comments', 'kadence-blocks' )
												) }
											</a>
										</span>
									) }
								</div>
							) }
						</header>
						{ excerpt && post.excerpt && post.excerpt.rendered && (
							<div className="entry-summary">
								{ postExcerpt }
							</div>
						) }
						<footer className="entry-footer">
							{ readmore && (
								<div className="entry-actions">
									<p className="more-link-wrap">
										<a href={ post.link } className="post-more-link">{ ( readmoreLabel ? readmoreLabel : __( 'Read More', 'kadence-blocks' ) ) }</a>
									</p>
								</div>
							) }
						</footer>
					</div>
				</article>
			);
		};
		return (
			<Fragment>
				{ settingspanel }
				<div className={ `${ className } kb-posts kb-posts-id-${ uniqueID } ${ columnsClass } grid-cols content-wrap kb-posts-style-${ loopStyle ? loopStyle : 'boxed' } item-image-style-${ columns === 1 ? alignImage : 'above' }` }>
					{ displayPosts.map( ( post, i ) =>
						renderPosts( post, i )
					) }
				</div>
			</Fragment>
		);
	}
}

export default withSelect( ( select, props ) => {
	const { postsToShow, order, orderBy, categories, tags, postTax, postType, taxType, offsetQuery, excludeTax } = props.attributes;
	const { getEntityRecords } = select( 'core' );
	const theType = ( postType ? postType : 'post' );
	const taxonomyList = ( taxonomies[ theType ] && taxonomies[ theType ].taxonomy ? taxonomies[ theType ].taxonomy : [] );
	let taxonomyOptions = [];
	let termQueryBase = '';
	if ( theType !== 'post' || postTax ) {
		if ( 'undefined' !== typeof taxonomies[ theType ] ) {
			if ( taxType ) {
				if ( taxonomies[ theType ].taxonomy && taxonomies[ theType ].taxonomy[ taxType ] ) {
					termQueryBase = ( ( taxonomies[ theType ].taxonomy && taxonomies[ theType ].taxonomy[ taxType ][ 'rest_base' ] == false || taxonomies[ theType ].taxonomy && taxonomies[ theType ].taxonomy[ taxType ]['rest_base'] == null ) ? taxonomies[ theType ].taxonomy && taxonomies[ theType ].taxonomy[ taxType ].name : taxonomies[ theType ].taxonomy && taxonomies[ theType ].taxonomy[ taxType ].rest_base );
				}
				if ( taxonomies[ theType ].terms && taxonomies[ theType ].terms[ taxType ] ) {
					taxonomyOptions = taxonomies[ theType ].terms[ taxType ];
				}
			}
		}
	}
	return {
		taxList: taxonomyList,
		taxOptions: taxonomyOptions,
		getPreviewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
	};
} )( KadencePosts );
