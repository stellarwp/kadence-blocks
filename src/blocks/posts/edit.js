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
import classnames from 'classnames';
import map from 'lodash/map';
import Select from 'react-select';
import pickBy from 'lodash/pickBy';
import isUndefined from 'lodash/isUndefined';
import KadenceRange from '../../kadence-range-control';

const { decodeEntities } = wp.htmlEntities;
/**
 * Import Css
 */
import './editor.scss';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { withSelect } = wp.data;
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
	Button,
	ButtonGroup,
	PanelBody,
	Tooltip,
	RangeControl,
	TextControl,
	Placeholder,
	ToggleControl,
	SelectControl,
	RadioControl,
	TabPanel,
	Dashicon,
	Spinner,
} = wp.components;

const { postTypes, taxonomies } = kadence_blocks_params;
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
	}
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			kbpostsUniqueIDs.push( this.props.clientId.substr( 2, 9 ) );
		} else if ( kbpostsUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			kbpostsUniqueIDs.push( this.props.clientId.substr( 2, 9 ) );
		} else {
			kbpostsUniqueIDs.push( this.props.attributes.uniqueID );
		}
	}
	render() {
		const { attributes: { uniqueID, order, columns, orderBy, categories, tags, postsToShow, alignImage, postType, taxType, offsetQuery, postTax, excludeTax, showUnique, allowSticky, image, imageRatio, imageSize, author, authorEnabledLabel, authorLabel, authorImage, authorImageSize, comments, metaCategories, metaCategoriesEnabledLabel, metaCategoriesLabel, date, dateUpdated, dateEnabledLabel, dateLabel, dateUpdatedEnabledLabel, dateUpdatedLabel, meta, metaDivider, categoriesDivider, aboveCategories, categoriesStyle, excerpt, readmore, readmoreLabel }, className, setAttributes, latestPosts, taxList, taxOptions, taxFilterOptions } = this.props;
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
			columnsClass = 'grid-xs-col-1 grid-sm-col-2 grid-lg-col-2';
		} else {
			columnsClass = 'grid-xs-col-1 grid-sm-col-2 grid-lg-col-3';
		}
		const hasPosts = Array.isArray( latestPosts ) && latestPosts.length;
		
	
		const dateFormat = __experimentalGetSettings().formats.date;
		const settingspanel = (
			<Fragment>
				<InspectorControls>
					<PanelBody>
						<SelectControl
							label={ __( 'Select Posts Type:' ) }
							options={ postTypes }
							value={ postType }
							onChange={ ( value ) => {
								setAttributes( { postType: value } );
								setAttributes( { taxType: '' } );
								setAttributes( { categories: [] } );
								setAttributes( { postIds: [] } );
							} }
						/>
						<SelectControl
							label={ __( 'Order by' ) }
							options={ [
								{
									label: __( 'Newest to Oldest', 'kadence-blocks-pro' ),
									value: 'date/desc',
								},
								{
									label: __( 'Oldest to Newest', 'kadence-blocks-pro' ),
									value: 'date/asc',
								},
								{
									label: __( 'Modified Ascending', 'kadence-blocks-pro' ),
									value: 'modified/asc',
								},
								{
									label: __( 'Modified Decending', 'kadence-blocks-pro' ),
									value: 'modified/desc',
								},
								{
									/* translators: label for ordering posts by title in ascending order */
									label: __( 'A → Z', 'kadence-blocks-pro' ),
									value: 'title/asc',
								},
								{
									/* translators: label for ordering posts by title in descending order */
									label: __( 'Z → A', 'kadence-blocks-pro' ),
									value: 'title/desc',
								},
								{
									/* translators: label for ordering posts by title in descending order */
									label: __( 'Menu Order', 'kadence-blocks-pro' ),
									value: 'menu_order/asc',
								},
								{
									/* translators: label for ordering posts by title in descending order */
									label: __( 'Random', 'kadence-blocks-pro' ),
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
							label={ __( 'Number of items' ) }
							value={ postsToShow }
							onChange={ ( value ) => setAttributes( { postsToShow: value } ) }
							min={ 1 }
							max={ 300 }
						/>
						<KadenceRange
							key="query-controls-range-control"
							label={ __( 'Offset Starting Post' ) }
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
											{ __( 'Select Taxonomy' ) }
										</label>
										<Select
											value={ taxonomyList.filter( ( { value } ) => value === taxType ) }
											onChange={ ( select ) => {
												setAttributes( { taxType: select.value } );
												setAttributes( { categories: [] } );
											} }
											id={ 'tax-selection' }
											options={ taxonomyList }
											isMulti={ false }
											maxMenuHeight={ 300 }
											placeholder={ __( 'Select Taxonomy' ) }
										/>
									</div>
								) }
								{ ( undefined !== taxonomyOptions && 0 !== taxonomyOptions.length ) && (
									<Fragment>
										<div className="term-select-form-row">
											<label htmlFor={ 'terms-selection' } className="screen-reader-text">
												{ __( 'Select Terms' ) }
											</label>
											<Select
												value={ categories }
												onChange={ ( value ) => {
													setAttributes( { categories: ( value ? value : [] ) } );
												} }
												id={ 'terms-selection' }
												options={ taxonomyOptions }
												isMulti={ true }
												maxMenuHeight={ 300 }
												placeholder={ __( 'All' ) }
											/>
										</div>
										<RadioControl
											help={ __( 'Whether to include or exclude items from selected terms.' ) }
											selected={ ( undefined !== excludeTax ? excludeTax : 'include' ) }
											options={ [
												{ label: __( 'Include', 'kadence-blocks-pro' ), value: 'include' },
												{ label: __( 'Exclude', 'kadence-blocks-pro' ), value: 'exclude' },
											] }
											onChange={ ( value ) => setAttributes( { excludeTax: value } ) }
										/>
									</Fragment>
								) }
								{ ( ! postType || postType === 'post' ) && (
									<ToggleControl
										label={ __( 'Select the post Taxonomy' ) }
										checked={ postTax }
										onChange={ ( value ) => setAttributes( { postTax: value } ) }
									/>
								) }
							</Fragment>
						) }
						{ ( ! postType || ( postType === 'post' && ! postTax ) ) && (
							<Fragment>
								<KadenceSelectTerms
									placeholder={ __( 'Filter by Category' ) }
									restBase={ 'wp/v2/categories' }
									fieldId={ 'tax-select-category' }
									value={ categories }
									onChange={ ( value ) => {
										setAttributes( { categories: ( value ? value : [] ) } );
									} }
								/>
								<KadenceSelectTerms
									placeholder={ __( 'Filter by Tag' ) }
									restBase={ 'wp/v2/tags' }
									fieldId={ 'tax-select-tags' }
									value={ tags }
									onChange={ ( value ) => {
										setAttributes( { tags: ( value ? value : [] ) } );
									} }
								/>
								<RadioControl
									help={ __( 'Whether to include or exclude items from selected terms.' ) }
									selected={ ( undefined !== excludeTax ? excludeTax : 'include' ) }
									options={ [
										{ label: __( 'Include', 'kadence-blocks-pro' ), value: 'include' },
										{ label: __( 'Exclude', 'kadence-blocks-pro' ), value: 'exclude' },
									] }
									onChange={ ( value ) => setAttributes( { excludeTax: value } ) }
								/>
								<ToggleControl
									label={ __( 'Select the post Taxonomy' ) }
									checked={ postTax }
									onChange={ ( value ) => setAttributes( { postTax: value } ) }
								/>
							</Fragment>
						) }
						<ToggleControl
							label={ __( 'Show Unique' ) }
							help={ __( 'Exclude posts in this block from showing in others on the same page.' ) }
							checked={ showUnique }
							onChange={ ( value ) => setAttributes( { showUnique: value } ) }
						/>
						<ToggleControl
							label={ __( 'Allow Sticky Posts?' ) }
							checked={ allowSticky }
							onChange={ ( value ) => setAttributes( { allowSticky: value } ) }
						/>
					</PanelBody>
					<PanelBody
						title={ __( 'Layout Settings' ) }
						initialOpen={ false }
					>
						<KadenceRange
							label={ __( 'Columns' ) }
							value={ columns }
							onChange={ ( value ) => setAttributes( { columns: value } ) }
							min={ 1 }
							max={ 3 }
						/>
						{ 1 === columns && image && (
							<SelectControl
								label={ __( 'Align Image' ) }
								options={ [
									{
										label: __( 'Top' ),
										value: 'above',
									},
									{
										label: __( 'Left' ),
										value: 'beside',
									},
								] }
								value={ alignImage }
								onChange={ ( value ) => setAttributes( { alignImage: value } ) }
							/>
						) }
					</PanelBody>
					<PanelBody
						title={ __( 'Image Settings', 'kadence-blocks' ) }
						initialOpen={ false }
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
					</PanelBody>
					{ ( ! postType || postType === 'post' ) && (
						<PanelBody
							title={ __( 'Category Settings', 'kadence-blocks' ) }
							initialOpen={ false }
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
						</PanelBody>
					) }
					<PanelBody
						title={ __( 'Meta Settings', 'kadence-blocks' ) }
						initialOpen={ false }
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
					</PanelBody>
					<PanelBody
						title={ __( 'Content Settings', 'kadence-blocks' ) }
						initialOpen={ false }
					>
						<ToggleControl
							label={ __( 'Enable Excerpt', 'kadence-blocks' ) }
							checked={ excerpt }
							onChange={ ( value ) => setAttributes( { excerpt: value } ) }
						/>
						<ToggleControl
							label={ __( 'Enable Read More', 'kadence-blocks' ) }
							checked={ readmore }
							onChange={ ( value ) => setAttributes( { readmore: value } ) }
						/>
						{ readmore && (
							<TextControl
								label={ __( 'Read More' ) }
								value={ readmoreLabel }
								onChange={ ( value ) => setAttributes( { readmoreLabel: value } ) }
							/>
						) }
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
		if ( ! hasPosts ) {
			return (
				<Fragment>
					{ settingspanel }
					<Placeholder
						icon="admin-post"
						label={ __( 'Posts' ) }
					>
						
						{ ! Array.isArray( latestPosts ) ?
							<Spinner /> :
							__( 'No posts found.' ) }
					</Placeholder>
				</Fragment>
			);
		}
		// Removing posts from display should be instant.
		const displayPosts = latestPosts.length > postsToShow ? latestPosts.slice( 0, postsToShow ) : latestPosts;
		const renderPosts = ( post, i ) => {
			return (
				<article
					key={ i }
					className={ classnames( post.kb_featured_image_src_large && post.kb_featured_image_src_large[ 0 ] && image ? 'has-post-thumbnail' : 'kb-no-thumb' ) + ' entry content-bg entry content-bg loop-entry components-disabled' }
				>
					{ image && post.kb_featured_image_src_large && post.kb_featured_image_src_large[ 0 ] !== undefined && (
						<a href={ post.link } className={ `post-thumbnail kadence-thumbnail-ratio-${ imageRatio }`}>
							<div className="post-thumbnail-inner">
								<img
									src={ post.kb_featured_image_src_large[ 0 ] }
									alt={ decodeEntities( post.title.rendered.trim() ) || __( '(Untitled)', 'kadence-blocks' ) }
								/>
							</div>
						</a>
					) }
					<div className="entry-content-wrap">
						<header className="entry-header">
							{ ( postType === 'post' && categories && post.kb_category_info ) && (
								<div className="entry-taxonomies">
									<span className={ `category-links term-links category-style-${ categoriesStyle }` }>
										{ post.kb_category_info.map( ( category, index, arr ) => {
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
							<h2 className="entry-title">
								<a
									href={ post.link }
									dangerouslySetInnerHTML={ { __html: post.title.rendered.trim() || __( '(Untitled)' ) }}
								/>
							</h2>
							{ meta && (
								<div className={ `entry-meta entry-meta-divider-${ metaDivider }` }>
									{ author && post.kb_author_info && post.kb_author_info.display_name && (
										<span className="posted-by">
											{ authorImage && post.kb_author_info.author_image && (
												<span className="author-avatar" style={ {
													width: authorImageSize ? authorImageSize + 'px': undefined,
													height: authorImageSize ? authorImageSize + 'px': undefined,
												}}>
													<span className="author-image">
														{<img src={ post.kb_author_info.author_image } style={ {
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
												<a className="url fn n" href={ post.kb_author_info.author_link }>
													{ post.kb_author_info.display_name }
												</a>
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
									{ metaCategories && post.kb_category_info && (
										<span className="category-links">
											{ metaCategoriesEnabledLabel && (
												<span className="meta-label">
													{ ( metaCategoriesLabel ? metaCategoriesLabel : __( 'Posted In', 'kadence-blocks' ) ) }
												</span>
											) }
											<span className="category-link-items">
												{ post.kb_category_info.map( ( category, index, arr ) => {
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
									{ comments && 0 !== post.kb_comment_info && (
										<span className="meta-comments">
											<a className="meta-comments-link anchor-scroll" href={ post.link + '#comments' }>
												{ 1 === post.kb_comment_info && (
													post.kb_comment_info + ' ' + __( 'Comment', 'kadence-blocks' )
												) }
												{ 1 !== post.kb_comment_info && (
													post.kb_comment_info + ' ' + __( 'Comments', 'kadence-blocks' )
												) }
											</a>
										</span>
									) }
								</div>
							) }
						</header>
						{ excerpt && post.excerpt && post.excerpt.rendered && (
							<div className="entry-summary" dangerouslySetInnerHTML={ { __html: post.excerpt.rendered } } />
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
				<div className={ `${ className } kb-posts kb-posts-id-${ uniqueID } ${ columnsClass } grid-cols content-wrap item-image-style-${ columns === 1 ? alignImage : 'above' }` }>
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
	let orderString = order;
	let latestPostsQuery;
	let taxonomyOptions = [];
	let termQueryBase = '';
	if ( theType !== 'post' || postTax ) {
		latestPostsQuery = pickBy( {
			order: orderString,
			orderby: orderBy,
			per_page: postsToShow,
			offset: offsetQuery,
		}, ( value ) => ! isUndefined( value ) );
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
		if ( 'exclude' === excludeTax ) {
			latestPostsQuery[ termQueryBase + '_exclude' ] = categories.map( option => option.value );
		} else {
			latestPostsQuery[ termQueryBase ] = categories.map( option => option.value );
		}
	} else {
		latestPostsQuery = pickBy( {
			order: orderString,
			orderby: orderBy,
			per_page: postsToShow,
			offset: offsetQuery,
		}, ( value ) => ! isUndefined( value ) );
		if ( 'exclude' === excludeTax ) {
			latestPostsQuery[ 'categories_exclude' ] = categories.map( option => option.value );
			latestPostsQuery[ 'tags_exclude' ] = tags.map( option => option.value );
		} else {
			latestPostsQuery[ 'categories' ] = categories.map( option => option.value );
			latestPostsQuery[ 'tags' ] = tags.map( option => option.value );
		}
		latestPostsQuery
	}
	return {
		latestPosts: getEntityRecords( 'postType', theType, latestPostsQuery ),
		taxList: taxonomyList,
		taxOptions: taxonomyOptions,
	};
} )( KadencePosts );
