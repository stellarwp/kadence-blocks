import {
    TypographyControls,
    MeasurementControls,
    PopColorControl,
    ResponsiveMeasurementControls,
    ResponsiveRangeControls,
    KadenceSelectTerms
} from '@kadence/components';
import {IconControl} from '@wordpress/components';
/**
 * Internal block libraries
 */
import {__} from '@wordpress/i18n';
import {
    Component,
    Fragment,
    useEffect,
    useState
} from '@wordpress/element';
import {
    Button,
    TabPanel,
    PanelBody,
    RangeControl,
    TextControl,
    ToggleControl,
    SelectControl,
    RadioControl,
    Modal,
} from '@wordpress/components';
import {useDispatch} from '@wordpress/data';
import {store as noticesStore} from '@wordpress/notices';
import {
    bottomLeftIcon,
    bottomRightIcon,
    topLeftIcon,
    topRightIcon,
} from '@kadence/icons';

import {get, has, isObject} from 'lodash';
import {postsIcon} from '@kadence/icons';
import FontIconPicker from "@fonticonpicker/react-fonticonpicker";
import Select from "react-select";
const { postTypes, taxonomies, postQueryEndpoint } = kadence_blocks_params;


function KadencePosts(props) {

    const blockSlug = 'kadence/posts';
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [resetConfirm, setResetConfirm] = useState(false);
    const {createErrorNotice} = useDispatch(noticesStore);

    const [configuration, setConfiguration] = useState((kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : {}));
    const [pendingConfig, setPendingConfig] = useState({});
    const tmpConfig = {...get(configuration, [blockSlug], {}), ...pendingConfig};

    const saveConfig = () => {
        setIsSaving(true);
        const config = configuration;

        if (!config[blockSlug]) {
            config[blockSlug] = {};
        }

        config[blockSlug] = tmpConfig;
        const settingModel = new wp.api.models.Settings({kadence_blocks_config_blocks: JSON.stringify(config)});

        settingModel.save().then(response => {
            createErrorNotice(__('Posts block defaults saved!', 'kadence-blocks'), {
                type: 'snackbar',
            })

            setIsSaving(false);
            setConfiguration({ ...config });
            setIsOpen(false);

            kadence_blocks_params.configuration = JSON.stringify(config);
        });
    }

    const saveConfigState = (key, value) => {
        const config = configuration;
        if (config[blockSlug] === undefined || config[blockSlug].length == 0) {
            config[blockSlug] = {};
        }
        config[blockSlug][key] = value;
        setConfiguration({...config});
    }

    const clearAllDefaults = () => {
        const config = configuration;
        config[blockSlug] = {};
        setConfiguration({...config});
    }

    const saveTitleFont = ( value ) => {
        const config = configuration;

        if (!has(config, [blockSlug])) {
            config[blockSlug] = {};
        }

        if (!has(config, [blockSlug, 'titleFont', 0])) {
            config[blockSlug].titleFont = [
                {
                    "level": 2,
                    "size": [
                        "",
                        "",
                        ""
                    ],
                    "sizeType": "px",
                    "lineHeight": [
                        "",
                        "",
                        ""
                    ],
                    "lineType": "px",
                    "letterSpacing": [
                        "",
                        "",
                        ""
                    ],
                    "letterType": "px",
                    "textTransform": ""
                }
            ];
        }

        config[blockSlug].titleFont[0] = {...config[blockSlug].titleFont[0], ...value};

        saveConfigState('titleFont', config[blockSlug].titleFont);
    };

    const setAttributes = ( valueObj ) => {
        Object.keys( valueObj ).forEach( ( key ) => {
            saveConfigState( key, valueObj[ key ] );
        });
    }

    const contentGoogleFont = get(configuration, [blockSlug, 'contentGoogleFont'], false);

    const postType = get(configuration, [blockSlug, 'postType'], 'post');
    const orderBy = get(configuration, [blockSlug, 'orderBy'], 'date');
    const order = get(configuration, [blockSlug, 'order'], 'desc');
    const postsToShow = get(configuration, [blockSlug, 'postsToShow'], 6);
    const offsetQuery = get(configuration, [blockSlug, 'offsetQuery'], 0);
    const postTax = get(configuration, [blockSlug, 'postTax'], false);
    const taxType = get(configuration, [blockSlug, 'taxType'], '');
    const categories =  get(configuration, [blockSlug, 'categories'], []);
    const excludeTax = get(configuration, [blockSlug, 'excludeTax'], 'include');
    const tags = get(configuration, [blockSlug, 'tags'], []);
    const showUnique = get(configuration, [blockSlug, 'showUnique'], false);
    const allowSticky = get(configuration, [blockSlug, 'allowSticky'], false);
    const columns = get(configuration, [blockSlug, 'columns'], 3);
    const tabletColumns = get(configuration, [blockSlug, 'tabletColumns'], 1);
    const alignImage = get(configuration, [blockSlug, 'alignImage'], 'beside');
    const loopStyle = get(configuration, [blockSlug, 'loopStyle'], 'boxed');
    const image = get(configuration, [blockSlug, 'image'], true);
    const imageRatio = get(configuration, [blockSlug, 'imageRatio'], '2-3');
    const imageSize = get(configuration, [blockSlug, 'imageSize'], 'medium_large');
    const aboveCategories = get(configuration, [blockSlug, 'aboveCategories'], true);
    const categoriesStyle = get(configuration, [blockSlug, 'categoriesStyle'], 'normal');
    const categoriesDivider = get(configuration, [blockSlug, 'categoriesDivider'], 'vline');
    const titleFont = get(configuration, [blockSlug, 'titleFont'], [
        {
            "level": 2,
            "size": [
                "",
                "",
                ""
            ],
            "sizeType": "px",
            "lineHeight": [
                "",
                "",
                ""
            ],
            "lineType": "px",
            "letterSpacing": [
                "",
                "",
                ""
            ],
            "letterType": "px",
            "textTransform": ""
        }
    ]);

    const meta = get(configuration, [blockSlug, 'meta'], true);
    const author = get(configuration, [blockSlug, 'author'], true);
    const authorImage = get(configuration, [blockSlug, 'authorImage'], false);
    const authorLink = get(configuration, [blockSlug, 'authorLink'], false);
    const authorImageSize = get(configuration, [blockSlug, 'authorImageSize'], 25);
    const authorEnabledLabel = get(configuration, [blockSlug, 'authorEnabledLabel'], true);
    const authorLabel = get(configuration, [blockSlug, 'authorLabel'], '');
    const date = get(configuration, [blockSlug, 'date'], true);
    const dateEnabledLabel = get(configuration, [blockSlug, 'dateEnabledLabel'], false);
    const dateLabel = get(configuration, [blockSlug, 'dateLabel'], '');
    const dateUpdated = get(configuration, [blockSlug, 'dateUpdated'], false);
    const dateUpdatedEnabledLabel = get(configuration, [blockSlug, 'dateUpdatedEnabledLabel'], false);
    const dateUpdatedLabel = get(configuration, [blockSlug, 'dateUpdatedLabel'], '');
    const metaCategories = get(configuration, [blockSlug, 'metaCategories'], false);
    const metaCategoriesEnabledLabel = get(configuration, [blockSlug, 'metaCategoriesEnabledLabel'], false);
    const metaCategoriesLabel = get(configuration, [blockSlug, 'metaCategoriesLabel'], '');
    const comments = get(configuration, [blockSlug, 'comments'], false);
    const excerpt = get(configuration, [blockSlug, 'excerpt'], true);
    const excerptLength = get(configuration, [blockSlug, 'excerptLength'], 40);
    const excerptCustomLength = get(configuration, [blockSlug, 'excerptCustomLength'], false);
    const readmore = get(configuration, [blockSlug, 'readmore'], true);
    const readmoreLabel = get(configuration, [blockSlug, 'readmoreLabel'], '');

    return (
        <Fragment>
            <Button className="kt-block-defaults" onClick={() => setIsOpen(true)}>
                <span className="kt-block-icon">{postsIcon}</span>
                {__('Posts', 'kadence-blocks')}
            </Button>
            {isOpen && (
                <Modal
                    className="kt-block-defaults-modal"
                    title={__('Posts', 'kadence-blocks')}
                    onRequestClose={() => {
                        saveConfig(configuration);
                    }}>

                    <PanelBody panelName={'kb-posts-settings'}>
                        <SelectControl
                            label={__( 'Select Posts Type:', 'kadence-blocks' )}
                            options={postTypes}
                            value={postType}
                            onChange={( value ) => {
                                setAttributes( { postType: value } );
                                setAttributes( { taxType: '' } );
                                setAttributes( { categories: [] } );
                            }}
                        />
                        <SelectControl
                            label={__( 'Order by', 'kadence-blocks' )}
                            options={[
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
                            ]}
                            value={`${orderBy}/${order}`}
                            onChange={( value ) => {
                                const [ newOrderBy, newOrder ] = value.split( '/' );
                                if ( newOrder !== order ) {
                                    setAttributes( { order: newOrder } );
                                }
                                if ( newOrderBy !== orderBy ) {
                                    setAttributes( { orderBy: newOrderBy } );
                                }
                            }}
                        />
                        <RangeControl
                            key="query-controls-range-control"
                            label={__( 'Number of items', 'kadence-blocks' )}
                            value={postsToShow}
                            onChange={( value ) => setAttributes( { postsToShow: value } )}
                            min={1}
                            max={300}
                        />
                        <RangeControl
                            key="query-controls-range-control"
                            label={__( 'Offset Starting Post', 'kadence-blocks' )}
                            value={offsetQuery}
                            onChange={( value ) => setAttributes( { offsetQuery: value } )}
                            min={0}
                            max={100}
                        />
                        {( ( postType && postType !== 'post' ) || postTax ) && (
                            <>
                                {( undefined !== taxonomyList && 0 !== taxonomyList.length ) && (
                                    <div className="term-select-form-row">
                                        <label htmlFor={'tax-selection'} className="screen-reader-text">
                                            {__( 'Select Taxonomy', 'kadence-blocks' )}
                                        </label>
                                        <Select
                                            value={taxonomyList.filter( ( { value } ) => value === taxType )}
                                            onChange={( select ) => {
                                                setAttributes( { taxType: ( select && select.value ? select.value : '' ), categories: [] } );
                                            }}
                                            id={'tax-selection'}
                                            options={taxonomyList}
                                            isMulti={false}
                                            isClearable={true}
                                            maxMenuHeight={300}
                                            placeholder={__( 'Select Taxonomy', 'kadence-blocks' )}
                                        />
                                    </div>
                                )}
                                {( undefined !== taxonomyOptions && 0 !== taxonomyOptions.length ) && (
                                    <>
                                        <div className="term-select-form-row">
                                            <label htmlFor={'terms-selection'} className="screen-reader-text">
                                                {__( 'Select Terms', 'kadence-blocks' )}
                                            </label>
                                            <Select
                                                value={categories}
                                                onChange={( value ) => {
                                                    setAttributes( { categories: ( value ? value : [] ) } );
                                                }}
                                                id={'terms-selection'}
                                                options={taxonomyOptions}
                                                isMulti={true}
                                                isClearable={true}
                                                maxMenuHeight={300}
                                                placeholder={__( 'Select', 'kadence-blocks' )}
                                            />
                                        </div>
                                        <RadioControl
                                            help={__( 'Whether to include or exclude items from selected terms.', 'kadence-blocks' )}
                                            selected={( undefined !== excludeTax ? excludeTax : 'include' )}
                                            options={[
                                                { label: __( 'Include', 'kadence-blocks' ), value: 'include' },
                                                { label: __( 'Exclude', 'kadence-blocks' ), value: 'exclude' },
                                            ]}
                                            onChange={( value ) => setAttributes( { excludeTax: value } )}
                                        />
                                    </>
                                )}
                                {( !postType || postType === 'post' ) && (
                                    <ToggleControl
                                        label={__( 'Select the post Taxonomy', 'kadence-blocks' )}
                                        checked={postTax}
                                        onChange={( value ) => setAttributes( { postTax: value } )}
                                    />
                                )}
                            </>
                        )}
                        {( !postType || ( postType === 'post' && !postTax ) ) && (
                            <>
                                <KadenceSelectTerms
                                    placeholder={__( 'Filter by Category', 'kadence-blocks' )}
                                    restBase={'wp/v2/categories'}
                                    fieldId={'tax-select-category'}
                                    value={categories}
                                    onChange={( value ) => {
                                        setAttributes( { categories: ( value ? value : [] ) } );
                                    }}
                                />
                                <KadenceSelectTerms
                                    placeholder={__( 'Filter by Tag', 'kadence-blocks' )}
                                    restBase={'wp/v2/tags'}
                                    fieldId={'tax-select-tags'}
                                    value={tags}
                                    onChange={( value ) => {
                                        setAttributes( { tags: ( value ? value : [] ) } );
                                    }}
                                />
                                <RadioControl
                                    help={__( 'Whether to include or exclude items from selected terms.', 'kadence-blocks' )}
                                    selected={( undefined !== excludeTax ? excludeTax : 'include' )}
                                    options={[
                                        { label: __( 'Include', 'kadence-blocks' ), value: 'include' },
                                        { label: __( 'Exclude', 'kadence-blocks' ), value: 'exclude' },
                                    ]}
                                    onChange={( value ) => setAttributes( { excludeTax: value } )}
                                />
                                <ToggleControl
                                    label={__( 'Select the post Taxonomy', 'kadence-blocks' )}
                                    checked={postTax}
                                    onChange={( value ) => setAttributes( { postTax: value } )}
                                />
                            </>
                        )}
                        <ToggleControl
                            label={__( 'Show Unique', 'kadence-blocks' )}
                            help={__( 'Exclude posts in this block from showing in others on the same page.', 'kadence-blocks' )}
                            checked={showUnique}
                            onChange={( value ) => setAttributes( { showUnique: value } )}
                        />
                        <ToggleControl
                            label={__( 'Allow Sticky Posts?', 'kadence-blocks' )}
                            checked={allowSticky}
                            onChange={( value ) => setAttributes( { allowSticky: value } )}
                        />
                    </PanelBody>
                    <PanelBody
                        title={__( 'Layout Settings', 'kadence-blocks' )}
                        initialOpen={false}
                    >
                        <RangeControl
                            label={__( 'Columns', 'kadence-blocks' )}
                            value={columns}
                            onChange={( value ) => setAttributes( { columns: value } )}
                            min={1}
                            max={3}
                        />
                        {1 !== columns && (
                            <RangeControl
                                label={__( 'Tablet Columns', 'kadence-blocks' )}
                                value={tabletColumns}
                                onChange={( value ) => setAttributes( { tabletColumns: value } )}
                                min={1}
                                max={columns}
                            />
                        )}
                        {1 === columns && image && (
                            <SelectControl
                                label={__( 'Align Image', 'kadence-blocks' )}
                                options={[
                                    {
                                        label: __( 'Top', 'kadence-blocks' ),
                                        value: 'above',
                                    },
                                    {
                                        label: __( 'Left', 'kadence-blocks' ),
                                        value: 'beside',
                                    },
                                ]}
                                value={alignImage}
                                onChange={( value ) => setAttributes( { alignImage: value } )}
                            />
                        )}
                        <SelectControl
                            label={__( 'Style', 'kadence-blocks' )}
                            options={[
                                {
                                    label: __( 'Boxed', 'kadence-blocks' ),
                                    value: 'boxed',
                                },
                                {
                                    label: __( 'Unboxed', 'kadence-blocks' ),
                                    value: 'unboxed',
                                },
                            ]}
                            value={loopStyle}
                            onChange={( value ) => setAttributes( { loopStyle: value } )}
                        />
                    </PanelBody>
                    <PanelBody
                        title={__( 'Image Settings', 'kadence-blocks' )}
                        initialOpen={false}
                    >
                        <ToggleControl
                            label={__( 'Enable Image', 'kadence-blocks' )}
                            checked={image}
                            onChange={( value ) => setAttributes( { image: value } )}
                        />
                        {image && (
                            <>
                                <SelectControl
                                    label={__( 'Image Ratio', 'kadence-blocks' )}
                                    options={[
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
                                    ]}
                                    value={imageRatio}
                                    onChange={( value ) => setAttributes( { imageRatio: value } )}
                                />
                                <SelectControl
                                    label={__( 'Image Size', 'kadence-blocks' )}
                                    options={[
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
                                    ]}
                                    value={imageSize}
                                    onChange={( value ) => setAttributes( { imageSize: value } )}
                                />
                            </>
                        )}
                    </PanelBody>
                    {( !postType || postType === 'post' ) && (
                        <PanelBody
                            title={__( 'Category Settings', 'kadence-blocks' )}
                            initialOpen={false}
                        >
                            <ToggleControl
                                label={__( 'Enable Above Title Category', 'kadence-blocks' )}
                                checked={aboveCategories}
                                onChange={( value ) => setAttributes( { aboveCategories: value } )}
                            />
                            {aboveCategories && (
                                <>
                                    <SelectControl
                                        label={__( 'Category Style', 'kadence-blocks' )}
                                        options={[
                                            {
                                                label: __( 'Normal', 'kadence-blocks' ),
                                                value: 'normal',
                                            },
                                            {
                                                label: __( 'Pill', 'kadence-blocks' ),
                                                value: 'pill',
                                            },
                                        ]}
                                        value={categoriesStyle}
                                        onChange={( value ) => setAttributes( { categoriesStyle: value } )}
                                    />
                                    {'normal' === categoriesStyle && (
                                        <SelectControl
                                            label={__( 'Category Divider', 'kadence-blocks' )}
                                            options={[
                                                {
                                                    label: '|',
                                                    value: 'vline',
                                                },
                                                {
                                                    label: '-',
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
                                            ]}
                                            value={categoriesDivider}
                                            onChange={( value ) => setAttributes( { categoriesDivider: value } )}
                                        />
                                    )}
                                </>
                            )}
                        </PanelBody>
                    )}

                    <PanelBody
                        title={__( 'Title Size', 'kadence-blocks' )}
                        initialOpen={false}
                    >
                        <TypographyControls
                            fontGroup={'post-title'}
                            tagLevel={titleFont[ 0 ].level}
                            tagLowLevel={2}
                            tagHighLevel={7}
                            onTagLevel={( value ) => saveTitleFont( { level: value } )}
                            fontSize={titleFont[ 0 ].size}
                            onFontSize={( value ) => saveTitleFont( { size: value } )}
                            fontSizeType={titleFont[ 0 ].sizeType}
                            onFontSizeType={( value ) => saveTitleFont( { sizeType: value } )}
                            lineHeight={titleFont[ 0 ].lineHeight}
                            onLineHeight={( value ) => saveTitleFont( { lineHeight: value } )}
                            lineHeightType={titleFont[ 0 ].lineType}
                            onLineHeightType={( value ) => saveTitleFont( { lineType: value } )}
                            reLetterSpacing={titleFont[ 0 ].letterSpacing}
                            onLetterSpacing={( value ) => saveTitleFont( { letterSpacing: value } )}
                            letterSpacingType={titleFont[ 0 ].letterType}
                            onLetterSpacingType={( value ) => saveTitleFont( { letterType: value } )}
                        />
                    </PanelBody>

                    <PanelBody
                        title={__( 'Meta Settings', 'kadence-blocks' )}
                        initialOpen={false}
                    >
                        <ToggleControl
                            label={__( 'Enable Meta Info', 'kadence-blocks' )}
                            checked={meta}
                            onChange={( value ) => setAttributes( { meta: value } )}
                        />
                        {meta && (
                            <>
                                <ToggleControl
                                    label={__( 'Enable Author', 'kadence-blocks' )}
                                    checked={author}
                                    onChange={( value ) => setAttributes( { author: value } )}
                                />
                                {author && (
                                    <>
                                        <ToggleControl
                                            label={__( 'Enable Author Image', 'kadence-blocks' )}
                                            checked={authorImage}
                                            onChange={( value ) => setAttributes( { authorImage: value } )}
                                        />
                                        {authorImage && (
                                            <RangeControl
                                                label={__( 'Author Image Size' )}
                                                value={authorImageSize}
                                                onChange={( value ) => setAttributes( { authorImageSize: value } )}
                                                min={5}
                                                max={100}
                                            />
                                        )}
                                        <ToggleControl
                                            label={__( 'Enable Author Link', 'kadence-blocks' )}
                                            checked={authorLink}
                                            onChange={( value ) => setAttributes( { authorLink: value } )}
                                        />
                                        <ToggleControl
                                            label={__( 'Enable Author Label', 'kadence-blocks' )}
                                            checked={authorEnabledLabel}
                                            onChange={( value ) => setAttributes( { authorEnabledLabel: value } )}
                                        />
                                        {authorEnabledLabel && (
                                            <TextControl
                                                label={__( 'Author Label' )}
                                                value={( authorLabel ? authorLabel : __( 'By', 'kadence-blocks' ) )}
                                                onChange={( value ) => setAttributes( { authorLabel: value } )}
                                            />
                                        )}
                                    </>
                                )}
                                <ToggleControl
                                    label={__( 'Enable Date', 'kadence-blocks' )}
                                    checked={date}
                                    onChange={( value ) => setAttributes( { date: value } )}
                                />
                                {date && (
                                    <>
                                        <ToggleControl
                                            label={__( 'Enable Date Label', 'kadence-blocks' )}
                                            checked={dateEnabledLabel}
                                            onChange={( value ) => setAttributes( { dateEnabledLabel: value } )}
                                        />
                                        {dateEnabledLabel && (
                                            <TextControl
                                                label={__( 'Date Label' )}
                                                value={( dateLabel ? dateLabel : __( 'Posted On', 'kadence-blocks' ) )}
                                                onChange={( value ) => setAttributes( { dateLabel: value } )}
                                            />
                                        )}
                                    </>
                                )}
                                <ToggleControl
                                    label={__( 'Enable Modified Date', 'kadence-blocks' )}
                                    checked={dateUpdated}
                                    onChange={( value ) => setAttributes( { dateUpdated: value } )}
                                />
                                {dateUpdated && (
                                    <>
                                        <ToggleControl
                                            label={__( 'Enable Modified Date Label', 'kadence-blocks' )}
                                            checked={dateUpdatedEnabledLabel}
                                            onChange={( value ) => setAttributes( { dateUpdatedEnabledLabel: value } )}
                                        />
                                        {dateUpdatedEnabledLabel && (
                                            <TextControl
                                                label={__( 'Modified Date Label' )}
                                                value={( dateUpdatedLabel ? dateUpdatedLabel : __( 'Updated On', 'kadence-blocks' ) )}
                                                onChange={( value ) => setAttributes( { dateUpdatedLabel: value } )}
                                            />
                                        )}
                                    </>
                                )}
                                {( !postType || postType === 'post' ) && (
                                    <>
                                        <ToggleControl
                                            label={__( 'Enable Categories', 'kadence-blocks' )}
                                            checked={metaCategories}
                                            onChange={( value ) => setAttributes( { metaCategories: value } )}
                                        />
                                        {metaCategories && (
                                            <>
                                                <ToggleControl
                                                    label={__( 'Enable Categories Label', 'kadence-blocks' )}
                                                    checked={metaCategoriesEnabledLabel}
                                                    onChange={( value ) => setAttributes( { metaCategoriesEnabledLabel: value } )}
                                                />
                                                {metaCategoriesEnabledLabel && (
                                                    <TextControl
                                                        label={__( 'Categories Label' )}
                                                        value={( metaCategoriesLabel ? metaCategoriesLabel : __( 'Posted In', 'kadence-blocks' ) )}
                                                        onChange={( value ) => setAttributes( { metaCategoriesLabel: value } )}
                                                    />
                                                )}
                                            </>
                                        )}
                                        <ToggleControl
                                            label={__( 'Enable Comments', 'kadence-blocks' )}
                                            checked={comments}
                                            onChange={( value ) => setAttributes( { comments: value } )}
                                        />
                                    </>
                                )}
                            </>
                        )}
                    </PanelBody>

                    <PanelBody
                        title={__( 'Content Settings', 'kadence-blocks' )}
                        initialOpen={false}
                    >
                        <ToggleControl
                            label={__( 'Enable Excerpt', 'kadence-blocks' )}
                            checked={excerpt}
                            onChange={( value ) => setAttributes( { excerpt: value } )}
                        />
                        <ToggleControl
                            label={__( 'Enable Custom Excerpt Length', 'kadence-blocks' )}
                            checked={excerptCustomLength}
                            onChange={( value ) => setAttributes( { excerptCustomLength: value } )}
                        />
                        {excerptCustomLength && (
                            <RangeControl
                                label={__( 'Max number of words in excerpt', 'kadence-blocks' )}
                                value={excerptLength}
                                onChange={( value ) => setAttributes( { excerptLength: value } )}
                                min={10}
                                max={100}
                            />
                        )}
                        <ToggleControl
                            label={__( 'Enable Read More', 'kadence-blocks' )}
                            checked={readmore}
                            onChange={( value ) => setAttributes( { readmore: value } )}
                        />
                        {readmore && (
                            <TextControl
                                label={__( 'Read More', 'kadence-blocks' )}
                                value={readmoreLabel}
                                onChange={( value ) => setAttributes( { readmoreLabel: value } )}
                            />
                        )}
                    </PanelBody>

                    <div className="kb-modal-footer">
                        {!resetConfirm && (
                            <Button className="kt-defaults-save" isDestructive
                                    disabled={(JSON.stringify(configuration[blockSlug]) === JSON.stringify({}) ? true : false)}
                                    onClick={() => {
                                        setResetConfirm(true);
                                    }}>
                                {__('Reset', 'kadence-blocks')}
                            </Button>
                        )}
                        {resetConfirm && (
                            <Button className="kt-defaults-save" isDestructive onClick={() => {
                                clearAllDefaults();
                                setResetConfirm(false);
                            }}>
                                {__('Confirm Reset', 'kadence-blocks')}
                            </Button>
                        )}
                        <Button className="kt-defaults-save" isPrimary onClick={() => {
                            saveConfig(configuration);
                        }}>
                            {__('Save/Close', 'kadence-blocks')}
                        </Button>
                    </div>
                </Modal>
            )}
        </Fragment>
    );
}

export default KadencePosts;
