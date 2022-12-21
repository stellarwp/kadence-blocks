/**
 * BLOCK: Kadence Testimonials
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Css
 */
import './editor.scss';
import metadata from './block.json';
/**
 * Import Icons
 */
import {
    testimonialBubbleIcon,
    alignTopIcon,
    alignMiddleIcon,
    alignBottomIcon,
    testimonialBasicIcon,
    testimonialCardIcon,
    testimonialInLineIcon,
} from '@kadence/icons';

/**
 * Import External
 */
import Slider from 'react-slick';
import {map} from 'lodash';
/**
 * Import Components
 */

import {
    PopColorControl,
    TypographyControls,
    ResponsiveMeasurementControls,
    ResponsiveRangeControls,
    KadencePanelBody,
    WebfontLoader,
    KadenceIconPicker,
    IconRender,
    KadenceMediaPlaceholder,
    MeasurementControls,
    InspectorControlTabs,
    KadenceBlockDefaults,
    ResponsiveMeasureRangeControl,
} from '@kadence/components';

import {
    getPreviewSize,
    KadenceColorOutput,
    showSettings,
    setBlockDefaults,
    mouseOverVisualizer
} from '@kadence/helpers';

/**
 * Internal block libraries
 */
import {__} from '@wordpress/i18n';

import {useEffect, Fragment, useState, useRef} from '@wordpress/element';

import {
    AlignmentToolbar,
    InspectorControls,
    BlockControls,
    useBlockProps,
    InnerBlocks
} from '@wordpress/block-editor';

import {useSelect, useDispatch} from '@wordpress/data';

import {
    Button,
    ButtonGroup,
    Dashicon,
    RangeControl,
    ToggleControl,
    SelectControl,
    Tooltip,
} from '@wordpress/components';

import {
    closeSmall,
    image,
} from '@wordpress/icons';
import classnames from 'classnames';

/**
 * Build the overlay edit
 */
function KadenceTestimonials({
                                 attributes,
                                 setAttributes,
                                 className,
                                 clientId,
                                 isSelected,
                                 context,
                             }) {

    const {
        uniqueID,
        testimonials,
        style,
        hAlign,
        layout,
        containerBackground,
        containerBorder,
        containerBorderWidth,
        containerBorderRadius,
        containerPadding,
        tabletContainerPadding,
        mobileContainerPadding,
        containerPaddingType,
        mediaStyles,
        displayTitle,
        titleFont,
        titleMinHeight,
        containerMinHeight,
        containerVAlign,
        contentMinHeight,
        displayContent,
        contentFont,
        displayName,
        displayMedia,
        nameFont,
        displayShadow,
        shadow,
        displayRating,
        ratingStyles,
        displayOccupation,
        occupationFont,
        containerBackgroundOpacity,
        containerBorderOpacity,
        containerMaxWidth,
        columnGap,
        autoPlay,
        autoSpeed,
        transSpeed,
        slidesScroll,
        arrowStyle,
        dotStyle,
        columns,
        columnControl,
        displayIcon,
        iconStyles,
        wrapperPaddingType,
        wrapperPadding,
        wrapperTabletPadding,
        wrapperMobilePadding,
        inQueryBlock,
    } = attributes;

    const [activeTab, setActiveTab] = useState('general');
    const [containerBorderControl, setContainerBorderControl] = useState('linked');
    const [mediaBorderControl, setMediaBorderControl] = useState('linked');
    const [mediaPaddingControl, setMediaPaddingControl] = useState('linked');
    const [mediaMarginControl, setMediaMarginControl] = useState('linked');
    const [titlePaddingControl, setTitlePaddingControl] = useState('linked');
    const [titleMarginControl, setTitleMarginControl] = useState('individual');
    const [ratingMarginControl, setRatingMarginControl] = useState('individual');
    const [iconBorderControl, setIconBorderControl] = useState('linked');
    const [iconMarginControl, setIconMarginControl] = useState('linked');
    const [iconPaddingControl, setIconPaddingControl] = useState('linked');
    const [showPreset, setShowPreset] = useState(false);
    const [wrapperPaddingControls, setWrapperPaddingControls] = useState('linked');

    const paddingMouseOver = mouseOverVisualizer();

    const {addUniqueID} = useDispatch('kadenceblocks/data');
    const {isUniqueID, isUniqueBlock, previewDevice, childBlocks} = useSelect(
        (select) => {
            return {
                isUniqueID: (value) => select('kadenceblocks/data').isUniqueID(value),
                isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
                previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
                childBlocks: select( 'core/block-editor' ).getBlockOrder( clientId ),
            };
        },
        [clientId],
    );

    useEffect(() => {

        let smallID = '_' + clientId.substr(2, 9);
        if (!uniqueID) {
            attributes = setBlockDefaults( 'kadence/testimonials', attributes);

            setAttributes({
                uniqueID: smallID,
            });
            addUniqueID(smallID, clientId);
        } else if (!isUniqueID(uniqueID)) {
            // This checks if we are just switching views, client ID the same means we don't need to update.
            if (!isUniqueBlock(uniqueID, clientId)) {
                attributes.uniqueID = smallID;
                setAttributes({
                    uniqueID: smallID,
                });
                addUniqueID(smallID, clientId);
            }
        } else {
            addUniqueID(uniqueID, clientId);
        }

        if (mediaStyles[0].borderWidth[0] === mediaStyles[0].borderWidth[1] && mediaStyles[0].borderWidth[0] === mediaStyles[0].borderWidth[2] && mediaStyles[0].borderWidth[0] === mediaStyles[0].borderWidth[3]) {
            setMediaBorderControl('linked');
        } else {
            setMediaBorderControl('individual');
        }
        if (mediaStyles[0].padding[0] === mediaStyles[0].padding[1] && mediaStyles[0].padding[0] === mediaStyles[0].padding[2] && mediaStyles[0].padding[0] === mediaStyles[0].padding[3]) {
            setMediaPaddingControl('linked');
        } else {
            setMediaPaddingControl('individual');
        }
        if (mediaStyles[0].margin[0] === mediaStyles[0].margin[1] && mediaStyles[0].margin[0] === mediaStyles[0].margin[2] && mediaStyles[0].margin[0] === mediaStyles[0].margin[3]) {
            setMediaMarginControl('linked');
        } else {
            setMediaMarginControl('individual');
        }
        if (titleFont[0].padding[0] === titleFont[0].padding[1] && titleFont[0].padding[0] === titleFont[0].padding[2] && titleFont[0].padding[0] === titleFont[0].padding[3]) {
            setTitlePaddingControl('linked');
        } else {
            setTitlePaddingControl('individual');
        }

        if (titleFont[0].margin[0] === titleFont[0].margin[1] && titleFont[0].margin[0] === titleFont[0].margin[2] && titleFont[0].margin[0] === titleFont[0].margin[3]) {
            setTitleMarginControl('linked');
        } else {
            setTitleMarginControl('individual');
        }
        if (containerBorderWidth[0] === containerBorderWidth[1] && containerBorderWidth[0] === containerBorderWidth[2] && containerBorderWidth[0] === containerBorderWidth[3]) {
            setContainerBorderControl('linked');
        } else {
            setContainerBorderControl('individual');
        }
        if (ratingStyles[0] && ratingStyles[0].margin && ratingStyles[0].margin[0] === ratingStyles[0].margin[1] && ratingStyles[0].margin[0] === ratingStyles[0].margin[2] && ratingStyles[0].margin[0] === ratingStyles[0].margin[3]) {
            setRatingMarginControl('linked');
        } else {
            setRatingMarginControl('individual');
        }
        if (undefined !== iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[0] && iconStyles[0].borderWidth[0] === iconStyles[0].borderWidth[1] && iconStyles[0].borderWidth[0] === iconStyles[0].borderWidth[2] && iconStyles[0].borderWidth[0] === iconStyles[0].borderWidth[3]) {
            setIconBorderControl('linked');
        } else {
            setIconBorderControl('individual');
        }
        if (undefined !== iconStyles[0].padding && undefined !== iconStyles[0].padding[0] && iconStyles[0].padding[0] === iconStyles[0].padding[1] && iconStyles[0].padding[0] === iconStyles[0].padding[2] && iconStyles[0].padding[0] === iconStyles[0].padding[3]) {
            setIconPaddingControl('linked');
        } else {
            setIconPaddingControl('individual');
        }
        if (iconStyles[0].margin[0] === iconStyles[0].margin[1] && iconStyles[0].margin[0] === iconStyles[0].margin[2] && iconStyles[0].margin[0] === iconStyles[0].margin[3]) {
            setIconMarginControl('linked');
        } else {
            setIconMarginControl('individual');
        }

        if (context && context.queryId && context.postId) {
            if (context.queryId !== inQueryBlock) {
                setAttributes({
                    inQueryBlock: context.queryId,
                });
            }
        } else if (inQueryBlock) {
            setAttributes({
                inQueryBlock: false,
            });
        }
    }, []);

    const previewWrapperPaddingTop = getPreviewSize(previewDevice, (undefined !== wrapperPadding && undefined !== wrapperPadding[0] ? wrapperPadding[0] : ''), (undefined !== wrapperTabletPadding && undefined !== wrapperTabletPadding[0] ? wrapperTabletPadding[0] : ''), (undefined !== wrapperMobilePadding && undefined !== wrapperMobilePadding[0] ? wrapperMobilePadding[0] : ''));
    const previewWrapperPaddingRight = getPreviewSize(previewDevice, (undefined !== wrapperPadding && undefined !== wrapperPadding[1] ? wrapperPadding[1] : ''), (undefined !== wrapperTabletPadding && undefined !== wrapperTabletPadding[1] ? wrapperTabletPadding[1] : ''), (undefined !== wrapperMobilePadding && undefined !== wrapperMobilePadding[1] ? wrapperMobilePadding[1] : ''));
    const previewWrapperPaddingBottom = getPreviewSize(previewDevice, (undefined !== wrapperPadding && undefined !== wrapperPadding[2] ? wrapperPadding[2] : ''), (undefined !== wrapperTabletPadding && undefined !== wrapperTabletPadding[2] ? wrapperTabletPadding[2] : ''), (undefined !== wrapperMobilePadding && undefined !== wrapperMobilePadding[2] ? wrapperMobilePadding[2] : ''));
    const previewWrapperPaddingLeft = getPreviewSize(previewDevice, (undefined !== wrapperPadding && undefined !== wrapperPadding[3] ? wrapperPadding[3] : ''), (undefined !== wrapperTabletPadding && undefined !== wrapperTabletPadding[3] ? wrapperTabletPadding[3] : ''), (undefined !== wrapperMobilePadding && undefined !== wrapperMobilePadding[3] ? wrapperMobilePadding[3] : ''));
    const previewTitleFont = getPreviewSize(previewDevice, (undefined !== titleFont[0].size && undefined !== titleFont[0].size[0] && '' !== titleFont[0].size[0] ? titleFont[0].size[0] : ''), (undefined !== titleFont[0].size && undefined !== titleFont[0].size[1] && '' !== titleFont[0].size[1] ? titleFont[0].size[1] : ''), (undefined !== titleFont[0].size && undefined !== titleFont[0].size[2] && '' !== titleFont[0].size[2] ? titleFont[0].size[2] : ''));
    const previewTitleLineHeight = getPreviewSize(previewDevice, (undefined !== titleFont[0].lineHeight && undefined !== titleFont[0].lineHeight[0] && '' !== titleFont[0].lineHeight[0] ? titleFont[0].lineHeight[0] : ''), (undefined !== titleFont[0].lineHeight && undefined !== titleFont[0].lineHeight[1] && '' !== titleFont[0].lineHeight[1] ? titleFont[0].lineHeight[1] : ''), (undefined !== titleFont[0].lineHeight && undefined !== titleFont[0].lineHeight[2] && '' !== titleFont[0].lineHeight[2] ? titleFont[0].lineHeight[2] : ''));
    const previewContentMinHeight = getPreviewSize(previewDevice, (undefined !== contentMinHeight && undefined !== contentMinHeight[0] ? contentMinHeight[0] : ''), (undefined !== contentMinHeight && undefined !== contentMinHeight[1] ? contentMinHeight[1] : ''), (undefined !== contentMinHeight && undefined !== contentMinHeight[2] ? contentMinHeight[2] : ''));

    const onColumnChange = (value) => {
        let columnarray = [];
        if (1 === value) {
            columnarray = [1, 1, 1, 1, 1, 1];
        } else if (2 === value) {
            columnarray = [2, 2, 2, 2, 1, 1];
        } else if (3 === value) {
            columnarray = [3, 3, 3, 2, 1, 1];
        } else if (4 === value) {
            columnarray = [4, 4, 4, 3, 2, 2];
        } else if (5 === value) {
            columnarray = [5, 5, 5, 4, 4, 3];
        }
        setAttributes({columns: columnarray});
    };
    const setInitalLayout = (key) => {
        if ('skip' === key) {
        } else if ('basic' === key) {
            setAttributes({style: 'basic'});
        } else if ('card' === key) {
            setAttributes({style: 'card'});
        } else if ('bubble' === key) {
            setAttributes({style: 'bubble'});
        } else if ('inlineimage' === key) {
            setAttributes({style: 'inlineimage'});
        }
    };
    const styleOptions = [
        {key: 'basic', name: __('Basic', 'kadence-blocks'), icon: testimonialBasicIcon},
        {key: 'card', name: __('Card', 'kadence-blocks'), icon: testimonialCardIcon},
        {key: 'bubble', name: __('Bubble', 'kadence-blocks'), icon: testimonialBubbleIcon},
        {key: 'inlineimage', name: __('Image In Content', 'kadence-blocks'), icon: testimonialInLineIcon},
    ];
    const startlayoutOptions = [
        {key: 'skip', name: __('Skip', 'kadence-blocks'), icon: __('Skip')},
        {key: 'basic', name: __('Basic', 'kadence-blocks'), icon: testimonialBasicIcon},
        {key: 'card', name: __('Card', 'kadence-blocks'), icon: testimonialCardIcon},
        {key: 'bubble', name: __('Bubble', 'kadence-blocks'), icon: testimonialBubbleIcon},
        {key: 'inlineimage', name: __('Image In Content', 'kadence-blocks'), icon: testimonialInLineIcon},
    ];
    const columnControlTypes = [
        {key: 'linked', name: __('Linked', 'kadence-blocks'), icon: __('Linked', 'kadence-blocks')},
        {key: 'individual', name: __('Individual', 'kadence-blocks'), icon: __('Individual', 'kadence-blocks')},
    ];
    const VAlignOptions = [
        {key: 'top', name: __('Top', 'kadence-blocks'), icon: alignTopIcon},
        {key: 'middle', name: __('Middle', 'kadence-blocks'), icon: alignMiddleIcon},
        {key: 'bottom', name: __('Bottom', 'kadence-blocks'), icon: alignBottomIcon},
    ];
    const paddingMin = (wrapperPaddingType === 'em' || wrapperPaddingType === 'rem' ? 0 : 0);
    const paddingMax = (wrapperPaddingType === 'em' || wrapperPaddingType === 'rem' ? 12 : 200);
    const paddingStep = (wrapperPaddingType === 'em' || wrapperPaddingType === 'rem' ? 0.1 : 1);

    const ref = useRef();

    const blockProps = useBlockProps({
        ref,
        className: classnames({
            'wp-block-kadence-testimonials': true,
            [`kt-testimonial-halign-${hAlign}`]: true,
            [`kt-testimonial-style-${style}`]: true,
            [`kt-testimonials-media-${(displayMedia ? 'on' : 'off')}`]: true,
            [`kt-testimonials-icon-${(displayIcon ? 'on' : 'off')}`]: true,
            [`kt-testimonial-columns-${columns[0]}`]: true,
            [`kt-t-xxl-col-${columns[0]}`]: true,
            [`kt-t-xl-col-${columns[1]}`]: true,
            [`kt-t-lg-col-${columns[2]}`]: true,
            [`kt-t-md-col-${columns[3]}`]: true,
            [`kt-t-sm-col-${columns[4]}`]: true,
            [`kt-t-xs-col-${columns[5]}`]: true,
            [`kt-blocks-testimonials-wrap${uniqueID}${layout && layout === 'carousel' ? ' tns-carousel-wrap' : ''}`]: true
        })
    });

    const columnControls = (
        <Fragment>
            <ButtonGroup className="kt-size-type-options kt-outline-control"
                         aria-label={__('Column Control Type', 'kadence-blocks')}>
                {map(columnControlTypes, ({name, key, icon}) => (
                    <Tooltip text={name}>
                        <Button
                            key={key}
                            className="kt-size-btn"
                            isSmall
                            isPrimary={columnControl === key}
                            aria-pressed={columnControl === key}
                            onClick={() => setAttributes({columnControl: key})}
                        >
                            {icon}
                        </Button>
                    </Tooltip>
                ))}
            </ButtonGroup>
            {columnControl && columnControl !== 'individual' && (
                <RangeControl
                    label={__('Columns', 'kadence-blocks')}
                    value={columns[2]}
                    onChange={onColumnChange}
                    min={1}
                    max={5}
                />
            )}
            {columnControl && columnControl === 'individual' && (
                <Fragment>
                    <h4>{__('Columns', 'kadence-blocks')}</h4>
                    <RangeControl
                        label={__('Screen Above 1500px', 'kadence-blocks')}
                        value={columns[0]}
                        onChange={(value) => setAttributes({columns: [value, columns[1], columns[2], columns[3], columns[4], columns[5]]})}
                        min={1}
                        max={5}
                    />
                    <RangeControl
                        label={__('Screen 1200px - 1499px', 'kadence-blocks')}
                        value={columns[1]}
                        onChange={(value) => setAttributes({columns: [columns[0], value, columns[2], columns[3], columns[4], columns[5]]})}
                        min={1}
                        max={5}
                    />
                    <RangeControl
                        label={__('Screen 992px - 1199px', 'kadence-blocks')}
                        value={columns[2]}
                        onChange={(value) => setAttributes({columns: [columns[0], columns[1], value, columns[3], columns[4], columns[5]]})}
                        min={1}
                        max={5}
                    />
                    <RangeControl
                        label={__('Screen 768px - 991px', 'kadence-blocks')}
                        value={columns[3]}
                        onChange={(value) => setAttributes({columns: [columns[0], columns[1], columns[2], value, columns[4], columns[5]]})}
                        min={1}
                        max={5}
                    />
                    <RangeControl
                        label={__('Screen 544px - 767px', 'kadence-blocks')}
                        value={columns[4]}
                        onChange={(value) => setAttributes({columns: [columns[0], columns[1], columns[2], columns[3], value, columns[5]]})}
                        min={1}
                        max={5}
                    />
                    <RangeControl
                        label={__('Screen Below 543px', 'kadence-blocks')}
                        value={columns[5]}
                        onChange={(value) => setAttributes({columns: [columns[0], columns[1], columns[2], columns[3], columns[4], value]})}
                        min={1}
                        max={5}
                    />
                </Fragment>
            )}
        </Fragment>
    );

    const gconfig = {
        google: {
            families: [titleFont[0].family + (titleFont[0].variant ? ':' + titleFont[0].variant : '')],
        },
    };
    const tgconfig = {
        google: {
            families: [contentFont[0].family + (contentFont[0].variant ? ':' + contentFont[0].variant : '')],
        },
    };
    const lgconfig = {
        google: {
            families: [nameFont[0].family + (nameFont[0].variant ? ':' + nameFont[0].variant : '')],
        },
    };
    const ogconfig = {
        google: {
            families: [occupationFont[0].family + (occupationFont[0].variant ? ':' + occupationFont[0].variant : '')],
        },
    };

    const config = (titleFont[0].google ? gconfig : '');
    const tconfig = (contentFont[0].google ? tgconfig : '');
    const lconfig = (nameFont[0].google ? lgconfig : '');
    const oconfig = (occupationFont[0].google ? ogconfig : '');

    const saveTestimonials = (value, thisIndex) => {
        const newUpdate = testimonials.map((item, index) => {
            if (index === thisIndex) {
                item = {...item, ...value};
            }
            return item;
        });
        setAttributes({
            testimonials: newUpdate,
        });
    };

    const ALLOWED_MEDIA_TYPES = ['image'];

    const savemediaStyles = (value) => {
        const newUpdate = mediaStyles.map((item, index) => {
            if (0 === index) {
                item = {...item, ...value};
            }
            return item;
        });
        setAttributes({
            mediaStyles: newUpdate,
        });
    };

    const saveIconStyles = (value) => {
        const newUpdate = iconStyles.map((item, index) => {
            if (0 === index) {
                item = {...item, ...value};
            }
            return item;
        });
        setAttributes({
            iconStyles: newUpdate,
        });
    };
    const saveTitleFont = (value) => {
        const newUpdate = titleFont.map((item, index) => {
            if (0 === index) {
                item = {...item, ...value};
            }
            return item;
        });
        setAttributes({
            titleFont: newUpdate,
        });
    };
    const saveContentFont = (value) => {
        const newUpdate = contentFont.map((item, index) => {
            if (0 === index) {
                item = {...item, ...value};
            }
            return item;
        });
        setAttributes({
            contentFont: newUpdate,
        });
    };
    const saveNameFont = (value) => {
        const newUpdate = nameFont.map((item, index) => {
            if (0 === index) {
                item = {...item, ...value};
            }
            return item;
        });
        setAttributes({
            nameFont: newUpdate,
        });
    };
    const saveOccupationFont = (value) => {
        const newUpdate = occupationFont.map((item, index) => {
            if (0 === index) {
                item = {...item, ...value};
            }
            return item;
        });
        setAttributes({
            occupationFont: newUpdate,
        });
    };
    const saveShadow = (value) => {
        const newUpdate = shadow.map((item, index) => {
            if (0 === index) {
                item = {...item, ...value};
            }
            return item;
        });
        setAttributes({
            shadow: newUpdate,
        });
    };
    const saveRatingStyles = (value) => {
        const newUpdate = ratingStyles.map((item, index) => {
            if (0 === index) {
                item = {...item, ...value};
            }
            return item;
        });
        setAttributes({
            ratingStyles: newUpdate,
        });
    };

    function CustomNextArrow(props) {
        const {className, style, onClick} = props;
        return (
            <button
                className={className}
                style={{...style, display: 'block'}}
                onClick={onClick}
            >
                <Dashicon icon="arrow-right-alt2"/>
            </button>
        );
    }

    function CustomPrevArrow(props) {
        const {className, style, onClick} = props;
        return (
            <button
                className={className}
                style={{...style, display: 'block'}}
                onClick={onClick}
            >
                <Dashicon icon="arrow-left-alt2"/>
            </button>
        );
    }

    const sliderSettings = {
        dots: (dotStyle === 'none' ? false : true),
        arrows: (arrowStyle === 'none' ? false : true),
        infinite: true,
        speed: transSpeed,
        draggable: false,
        autoplaySpeed: autoSpeed,
        autoplay: autoPlay,
        slidesToShow: columns[0],
        slidesToScroll: (slidesScroll === 'all' ? columns[0] : 1),
        nextArrow: <CustomNextArrow/>,
        prevArrow: <CustomPrevArrow/>,
    };

    return (
        <div id={`kt-blocks-testimonials-wrap${uniqueID}`} {...blockProps}>
            <style>
                {(layout === 'carousel' ? `#kt-blocks-testimonials-wrap${uniqueID} .slick-slide { padding: 0 ${columnGap / 2}px; }` : '')}
                {(layout === 'carousel' ? `#kt-blocks-testimonials-wrap${uniqueID} .kt-blocks-carousel .slick-slider { margin: 0 -${columnGap / 2}px; }` : '')}
                {(layout === 'carousel' ? `#kt-blocks-testimonials-wrap${uniqueID} .kt-blocks-carousel .slick-prev { left: ${columnGap / 2}px; }` : '')}
                {(layout === 'carousel' ? `#kt-blocks-testimonials-wrap${uniqueID} .kt-blocks-carousel .slick-next { right: ${columnGap / 2}px; }` : '')}
                {(style === 'bubble' || style === 'inlineimage' ? `#kt-blocks-testimonials-wrap${uniqueID} .kt-testimonial-text-wrap:after { margin-top: ${containerBorderWidth && undefined !== containerBorderWidth[2] ? containerBorderWidth[2] : '1'}px; }` : '')}
                {(style === 'bubble' || style === 'inlineimage' ? `#kt-blocks-testimonials-wrap${uniqueID} .kt-testimonial-text-wrap:after { border-top-color: ${(containerBorder ? KadenceColorOutput(containerBorder, (undefined !== containerBorderOpacity ? containerBorderOpacity : 1)) : KadenceColorOutput('#eeeeee', (undefined !== containerBorderOpacity ? containerBorderOpacity : 1)))} }` : '')}
                {(layout === 'grid' ) && (
                    `.kt-testimonial-grid-wrap .block-editor-inner-blocks .block-editor-block-list__layout {
                        grid-row-gap: ${columnGap}px;
                        grid-column-gap: ${columnGap}px;
                    }`
                ) }
            </style>
            {showSettings('allSettings') && (
                <Fragment>
                    <BlockControls key="controls">
                        <AlignmentToolbar
                            value={hAlign}
                            onChange={value => setAttributes({hAlign: value})}
                        />
                    </BlockControls>
                    <InspectorControls>

                        <InspectorControlTabs
                            panelName={'testimonials'}
                            setActiveTab={(value) => setActiveTab(value)}
                            activeTab={activeTab}
                        />

                        {(activeTab === 'general') &&

                            <>
                                <KadencePanelBody
                                    panelName={'kb-testimonials-settings'}
                                >
                                    {showSettings('layoutSettings', 'kadence/testimonials') && (
                                        <SelectControl
                                            label={__('Layout', 'kadence-blocks')}
                                            value={layout}
                                            options={[
                                                {value: 'grid', label: __('Grid', 'kadence-blocks')},
                                                {value: 'carousel', label: __('Carousel', 'kadence-blocks')},
                                            ]}
                                            onChange={value => setAttributes({layout: value})}
                                        />
                                    )}
                                    {showSettings('styleSettings', 'kadence/testimonials') && (
                                        <Fragment>
                                            <p className="components-base-control__label">{__('Testimonial Style', 'kadence-blocks')}</p>
                                            <ButtonGroup className="kt-style-btn-group"
                                                         aria-label={__('Testimonial Style', 'kadence-blocks')}>
                                                {map(styleOptions, ({name, key, icon}) => (
                                                    <Tooltip text={name}>
                                                        <Button
                                                            key={key}
                                                            className="kt-style-btn"
                                                            isSmall
                                                            isPrimary={style === key}
                                                            aria-pressed={style === key}
                                                            onClick={() => setAttributes({style: key})}
                                                        >
                                                            {icon}
                                                        </Button>
                                                    </Tooltip>
                                                ))}
                                            </ButtonGroup>
                                        </Fragment>
                                    )}

                                    {/* Add item */}

                                    {showSettings('columnSettings', 'kadence/testimonials') && (
                                        <Fragment>
                                            {columnControls}
                                            <RangeControl
                                                label={__('Column Gap', 'kadence-blocks')}
                                                value={columnGap}
                                                onChange={(value) => setAttributes({columnGap: value})}
                                                min={0}
                                                max={80}
                                            />
                                        </Fragment>
                                    )}
                                </KadencePanelBody>

                                {layout && layout === 'carousel' && (
                                    <Fragment>
                                        {showSettings('carouselSettings', 'kadence/testimonials') && (
                                            <KadencePanelBody
                                                title={__('Carousel Settings', 'kadence-blocks')}
                                                initialOpen={false}
                                                panelName={'kb-testimonials-carousel'}
                                            >
                                                <ToggleControl
                                                    label={__('Carousel Auto Play', 'kadence-blocks')}
                                                    checked={autoPlay}
                                                    onChange={(value) => setAttributes({autoPlay: value})}
                                                />
                                                {autoPlay && (
                                                    <RangeControl
                                                        label={__('Autoplay Speed', 'kadence-blocks')}
                                                        value={autoSpeed}
                                                        onChange={(value) => setAttributes({autoSpeed: value})}
                                                        min={500}
                                                        max={15000}
                                                        step={10}
                                                    />
                                                )}
                                                <RangeControl
                                                    label={__('Carousel Slide Transition Speed', 'kadence-blocks')}
                                                    value={transSpeed}
                                                    onChange={(value) => setAttributes({transSpeed: value})}
                                                    min={100}
                                                    max={2000}
                                                    step={10}
                                                />
                                                <SelectControl
                                                    label={__('Slides to Scroll', 'kadence-blocks')}
                                                    options={[
                                                        {
                                                            label: __('One'),
                                                            value: '1',
                                                        },
                                                        {
                                                            label: __('All'),
                                                            value: 'all',
                                                        },
                                                    ]}
                                                    value={slidesScroll}
                                                    onChange={(value) => setAttributes({slidesScroll: value})}
                                                />
                                                <SelectControl
                                                    label={__('Arrow Style', 'kadence-blocks')}
                                                    options={[
                                                        {
                                                            label: __('White on Dark', 'kadence-blocks'),
                                                            value: 'whiteondark',
                                                        },
                                                        {
                                                            label: __('Black on Light', 'kadence-blocks'),
                                                            value: 'blackonlight',
                                                        },
                                                        {
                                                            label: __('Outline Black', 'kadence-blocks'),
                                                            value: 'outlineblack',
                                                        },
                                                        {
                                                            label: __('Outline White', 'kadence-blocks'),
                                                            value: 'outlinewhite',
                                                        },
                                                        {
                                                            label: __('None', 'kadence-blocks'),
                                                            value: 'none',
                                                        },
                                                    ]}
                                                    value={arrowStyle}
                                                    onChange={(value) => setAttributes({arrowStyle: value})}
                                                />
                                                <SelectControl
                                                    label={__('Dot Style', 'kadence-blocks')}
                                                    options={[
                                                        {
                                                            label: __('Dark', 'kadence-blocks'),
                                                            value: 'dark',
                                                        },
                                                        {
                                                            label: __('Light', 'kadence-blocks'),
                                                            value: 'light',
                                                        },
                                                        {
                                                            label: __('Outline Dark', 'kadence-blocks'),
                                                            value: 'outlinedark',
                                                        },
                                                        {
                                                            label: __('Outline Light', 'kadence-blocks'),
                                                            value: 'outlinelight',
                                                        },
                                                        {
                                                            label: __('None', 'kadence-blocks'),
                                                            value: 'none',
                                                        },
                                                    ]}
                                                    value={dotStyle}
                                                    onChange={(value) => setAttributes({dotStyle: value})}
                                                />
                                            </KadencePanelBody>
                                        )}
                                    </Fragment>
                                )}
                            </>
                        }

                        {(activeTab === 'style') &&

                            <>
                                {showSettings('containerSettings', 'kadence/testimonials') && (
                                    <KadencePanelBody
                                        title={__('Container Settings', 'kadence-blocks')}
                                        panelName={'kb-testimonials-container-settings'}
                                    >
                                        <div className="kt-spacer-sidebar-15"></div>
                                        <MeasurementControls
                                            label={__('Container Border Width (px)', 'kadence-blocks')}
                                            measurement={containerBorderWidth}
                                            control={containerBorderControl}
                                            onChange={(value) => setAttributes({containerBorderWidth: value})}
                                            onControl={(value) => setContainerBorderControl(value)}
                                            min={0}
                                            max={40}
                                            step={1}
                                        />
                                        <RangeControl
                                            label={__('Container Border Radius (px)', 'kadence-blocks')}
                                            value={containerBorderRadius}
                                            onChange={value => setAttributes({containerBorderRadius: value})}
                                            step={1}
                                            min={0}
                                            max={200}
                                        />
                                        <PopColorControl
                                            label={__('Container Background', 'kadence-blocks')}
                                            value={(containerBackground ? containerBackground : '')}
                                            default={''}
                                            onChange={value => setAttributes({containerBackground: value})}
                                            opacityValue={containerBackgroundOpacity}
                                            onOpacityChange={value => setAttributes({containerBackgroundOpacity: value})}
                                        />
                                        <PopColorControl
                                            label={__('Container Border', 'kadence-blocks')}
                                            value={(containerBorder ? containerBorder : '')}
                                            default={''}
                                            onChange={value => setAttributes({containerBorder: value})}
                                            opacityValue={containerBorderOpacity}
                                            onOpacityChange={value => setAttributes({containerBorderOpacity: value})}
                                        />
                                        <div className="kt-spacer-sidebar-15"></div>

                                        {containerMinHeight && (containerMinHeight[0] || containerMinHeight[1] || containerMinHeight[2]) && (
                                            <div className="kt-btn-size-settings-container">
                                                <h2 className="kt-beside-btn-group">{__('Inner Content Align', 'kadence-blocks')}</h2>
                                                <ButtonGroup className="kt-button-size-type-options"
                                                             aria-label={__('Inner Content Align', 'kadence-blocks')}>
                                                    {map(VAlignOptions, ({name, icon, key}) => (
                                                        <Tooltip text={name}>
                                                            <Button
                                                                key={key}
                                                                className="kt-btn-size-btn"
                                                                isSmall
                                                                isPrimary={containerVAlign === key}
                                                                aria-pressed={containerVAlign === key}
                                                                onClick={() => setAttributes({containerVAlign: key})}
                                                            >
                                                                {icon}
                                                            </Button>
                                                        </Tooltip>
                                                    ))}
                                                </ButtonGroup>
                                            </div>
                                        )}
                                    </KadencePanelBody>
                                )}

                                {showSettings('shadowSettings', 'kadence/testimonials') && (
                                    <KadencePanelBody
                                        title={__('Container Shadow', 'kadence-blocks')}
                                        initialOpen={false}
                                        panelName={'kb-testimonials-container-shadow'}
                                    >
                                        <ToggleControl
                                            label={__('Enable Shadow', 'kadence-blocks')}
                                            checked={displayShadow}
                                            onChange={value => setAttributes({displayShadow: value})}
                                        />
                                        {displayShadow && (
                                            <Fragment>
                                                <PopColorControl
                                                    label={__('Shadow Color', 'kadence-blocks')}
                                                    value={(shadow[0].color ? shadow[0].color : '')}
                                                    default={''}
                                                    onChange={value => saveShadow({color: value})}
                                                    opacityValue={shadow[0].opacity}
                                                    onOpacityChange={value => saveShadow({opacity: value})}
                                                    onArrayChange={(color, opacity) => saveShadow({
                                                        color: color,
                                                        opacity: opacity
                                                    })}
                                                />
                                                <RangeControl
                                                    label={__('Shadow Blur', 'kadence-blocks')}
                                                    value={shadow[0].blur}
                                                    onChange={value => saveShadow({blur: value})}
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                />
                                                <RangeControl
                                                    label={__('Shadow Spread', 'kadence-blocks')}
                                                    value={shadow[0].spread}
                                                    onChange={value => saveShadow({spread: value})}
                                                    min={-100}
                                                    max={100}
                                                    step={1}
                                                />
                                                <RangeControl
                                                    label={__('Shadow Vertical Offset', 'kadence-blocks')}
                                                    value={shadow[0].vOffset}
                                                    onChange={value => saveShadow({vOffset: value})}
                                                    min={-100}
                                                    max={100}
                                                    step={1}
                                                />
                                                <RangeControl
                                                    label={__('Shadow Horizontal Offset', 'kadence-blocks')}
                                                    value={shadow[0].hOffset}
                                                    onChange={value => saveShadow({hOffset: value})}
                                                    min={-100}
                                                    max={100}
                                                    step={1}
                                                />
                                            </Fragment>
                                        )}
                                    </KadencePanelBody>
                                )}
                                {showSettings('wrapperSettings', 'kadence/testimonials') && (
                                    <KadencePanelBody
                                        title={__('Wrapper Padding', 'kadence-blocks')}
                                        initialOpen={false}
                                        panelName={'kb-testimonials-wrapper-padding'}
                                    >
                                        <ResponsiveMeasurementControls
                                            label={__('Wrapper Padding', 'kadence-blocks')}
                                            value={wrapperPadding}
                                            control={wrapperPaddingControls}
                                            tabletValue={wrapperTabletPadding}
                                            mobileValue={wrapperMobilePadding}
                                            onChange={(value) => setAttributes({wrapperPadding: value})}
                                            onChangeTablet={(value) => setAttributes({wrapperTabletPadding: value})}
                                            onChangeMobile={(value) => setAttributes({wrapperMobilePadding: value})}
                                            onChangeControl={(value) => setWrapperPaddingControls(value)}
                                            min={paddingMin}
                                            max={paddingMax}
                                            step={paddingStep}
                                            unit={wrapperPaddingType}
                                            units={['px', 'em', 'rem', '%']}
                                            onUnit={(value) => setAttributes({wrapperPaddingType: value})}
                                        />
                                    </KadencePanelBody>
                                )}

                                {showSettings('iconSettings', 'kadence/testimonials') && (
                                    <KadencePanelBody
                                        title={__('Icon Settings', 'kadence-blocks')}
                                        initialOpen={false}
                                        panelName={'kb-testimonials-icon-settings'}
                                    >
                                        <ToggleControl
                                            label={__('Show Top Icon', 'kadence-blocks')}
                                            checked={displayIcon}
                                            onChange={(value) => setAttributes({displayIcon: value})}
                                        />
                                        {displayIcon && (
                                            <Fragment>
                                                <KadenceIconPicker
                                                    value={iconStyles[0].icon}
                                                    onChange={value => {
                                                        saveIconStyles({icon: value});
                                                    }}
                                                />
                                                <RangeControl
                                                    label={__('Icon Size', 'kadence-blocks')}
                                                    value={iconStyles[0].size}
                                                    onChange={value => saveIconStyles({size: value})}
                                                    step={1}
                                                    min={1}
                                                    max={120}
                                                />
                                                {iconStyles[0].icon && 'fe' === iconStyles[0].icon.substring(0, 2) && (
                                                    <RangeControl
                                                        label={__('Line Width', 'kadence-blocks')}
                                                        value={iconStyles[0].stroke}
                                                        onChange={value => {
                                                            saveIconStyles({stroke: value});
                                                        }}
                                                        step={0.5}
                                                        min={0.5}
                                                        max={4}
                                                    />
                                                )}
                                                <PopColorControl
                                                    label={__('Color', 'kadence-blocks')}
                                                    value={(iconStyles[0].color ? iconStyles[0].color : '')}
                                                    default={''}
                                                    onChange={(value) => saveIconStyles({color: value})}
                                                />
                                                <div className="kt-spacer-sidebar-15"></div>
                                                <MeasurementControls
                                                    label={__('Icon Border Width (px)', 'kadence-blocks')}
                                                    measurement={iconStyles[0].borderWidth}
                                                    control={iconBorderControl}
                                                    onChange={(value) => saveIconStyles({borderWidth: value})}
                                                    onControl={(value) => setIconBorderControl(value)}
                                                    min={0}
                                                    max={40}
                                                    step={1}
                                                />
                                                <RangeControl
                                                    label={__('Icon Border Radius (px)', 'kadence-blocks')}
                                                    value={iconStyles[0].borderRadius}
                                                    onChange={value => saveIconStyles({borderRadius: value})}
                                                    step={1}
                                                    min={0}
                                                    max={200}
                                                />
                                                <PopColorControl
                                                    label={__('Icon Background', 'kadence-blocks')}
                                                    value={(iconStyles[0].background ? iconStyles[0].background : '')}
                                                    default={''}
                                                    onChange={value => saveIconStyles({background: value})}
                                                    opacityValue={iconStyles[0].backgroundOpacity}
                                                    onOpacityChange={value => saveIconStyles({backgroundOpacity: value})}
                                                    onArrayChange={(color, opacity) => saveIconStyles({
                                                        background: color,
                                                        backgroundOpacity: opacity
                                                    })}
                                                />
                                                <PopColorControl
                                                    label={__('Icon Border Color', 'kadence-blocks')}
                                                    value={(iconStyles[0].border ? iconStyles[0].border : '')}
                                                    default={''}
                                                    onChange={value => saveIconStyles({border: value})}
                                                    opacityValue={iconStyles[0].borderOpacity}
                                                    onOpacityChange={value => saveIconStyles({borderOpacity: value})}
                                                    onArrayChange={(color, opacity) => saveIconStyles({
                                                        border: color,
                                                        borderOpacity: opacity
                                                    })}
                                                />
                                                <div className="kt-spacer-sidebar-15"></div>
                                                <MeasurementControls
                                                    label={__('Icon Padding', 'kadence-blocks')}
                                                    measurement={iconStyles[0].padding}
                                                    control={iconPaddingControl}
                                                    onChange={(value) => saveIconStyles({padding: value})}
                                                    onControl={(value) => setIconPaddingControl(value)}
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                />
                                                <MeasurementControls
                                                    label={__('Icon Margin', 'kadence-blocks')}
                                                    measurement={iconStyles[0].margin}
                                                    control={iconMarginControl}
                                                    onChange={(value) => saveIconStyles({margin: value})}
                                                    onControl={(value) => setIconMarginControl(value)}
                                                    min={-100}
                                                    max={100}
                                                    step={1}
                                                />
                                            </Fragment>
                                        )}
                                    </KadencePanelBody>
                                )}
                                {showSettings('titleSettings', 'kadence/testimonials') && (
                                    <KadencePanelBody
                                        title={__('Title Settings', 'kadence-blocks')}
                                        initialOpen={false}
                                        panelName={'kb-testimonials-title-settings'}
                                    >
                                        <ToggleControl
                                            label={__('Show Title', 'kadence-blocks')}
                                            checked={displayTitle}
                                            onChange={(value) => setAttributes({displayTitle: value})}
                                        />
                                        {displayTitle && (
                                            <Fragment>
                                                <PopColorControl
                                                    label={__('Color Settings', 'kadence-blocks')}
                                                    value={(titleFont[0].color ? titleFont[0].color : '')}
                                                    default={''}
                                                    onChange={value => saveTitleFont({color: value})}
                                                />
                                                <TypographyControls
                                                    fontGroup={'heading'}
                                                    tagLevel={titleFont[0].level}
                                                    tagLowLevel={2}
                                                    onTagLevel={(value) => saveTitleFont({level: value})}
                                                    fontSize={titleFont[0].size}
                                                    onFontSize={(value) => saveTitleFont({size: value})}
                                                    fontSizeType={titleFont[0].sizeType}
                                                    onFontSizeType={(value) => saveTitleFont({sizeType: value})}
                                                    lineHeight={titleFont[0].lineHeight}
                                                    onLineHeight={(value) => saveTitleFont({lineHeight: value})}
                                                    lineHeightType={titleFont[0].lineType}
                                                    onLineHeightType={(value) => saveTitleFont({lineType: value})}
                                                    letterSpacing={titleFont[0].letterSpacing}
                                                    onLetterSpacing={(value) => saveTitleFont({letterSpacing: value})}
                                                    textTransform={titleFont[0].textTransform}
                                                    onTextTransform={(value) => saveTitleFont({textTransform: value})}
                                                    fontFamily={titleFont[0].family}
                                                    onFontFamily={(value) => saveTitleFont({family: value})}
                                                    onFontChange={(select) => {
                                                        saveTitleFont({
                                                            family: select.value,
                                                            google: select.google,
                                                        });
                                                    }}
                                                    onFontArrayChange={(values) => saveTitleFont(values)}
                                                    googleFont={titleFont[0].google}
                                                    onGoogleFont={(value) => saveTitleFont({google: value})}
                                                    loadGoogleFont={titleFont[0].loadGoogle}
                                                    onLoadGoogleFont={(value) => saveTitleFont({loadGoogle: value})}
                                                    fontVariant={titleFont[0].variant}
                                                    onFontVariant={(value) => saveTitleFont({variant: value})}
                                                    fontWeight={titleFont[0].weight}
                                                    onFontWeight={(value) => saveTitleFont({weight: value})}
                                                    fontStyle={titleFont[0].style}
                                                    onFontStyle={(value) => saveTitleFont({style: value})}
                                                    fontSubset={titleFont[0].subset}
                                                    onFontSubset={(value) => saveTitleFont({subset: value})}
                                                    padding={titleFont[0].padding}
                                                    onPadding={(value) => saveTitleFont({padding: value})}
                                                    paddingControl={titlePaddingControl}
                                                    onPaddingControl={(value) => setTitlePaddingControl(value)}
                                                    margin={titleFont[0].margin}
                                                    onMargin={(value) => saveTitleFont({margin: value})}
                                                    marginControl={titleMarginControl}
                                                    onMarginControl={(value) => setTitleMarginControl(value)}
                                                />
                                                <ResponsiveRangeControls
                                                    label={__('Title Min Height', 'kadence-blocks')}
                                                    value={(titleMinHeight && undefined !== titleMinHeight[0] ? titleMinHeight[0] : '')}
                                                    onChange={value => setAttributes({titleMinHeight: [value, (titleMinHeight && undefined !== titleMinHeight[1] ? titleMinHeight[1] : ''), (titleMinHeight && undefined !== titleMinHeight[2] ? titleMinHeight[2] : '')]})}
                                                    tabletValue={(titleMinHeight && undefined !== titleMinHeight[1] ? titleMinHeight[1] : '')}
                                                    onChangeTablet={(value) => setAttributes({titleMinHeight: [(titleMinHeight && undefined !== titleMinHeight[0] ? titleMinHeight[0] : ''), value, (titleMinHeight && undefined !== titleMinHeight[2] ? titleMinHeight[2] : '')]})}
                                                    mobileValue={(titleMinHeight && undefined !== titleMinHeight[2] ? titleMinHeight[2] : '')}
                                                    onChangeMobile={(value) => setAttributes({titleMinHeight: [(titleMinHeight && undefined !== titleMinHeight[0] ? titleMinHeight[0] : ''), (titleMinHeight && undefined !== titleMinHeight[1] ? titleMinHeight[1] : ''), value]})}
                                                    min={0}
                                                    max={200}
                                                    step={1}
                                                    unit={'px'}
                                                    showUnit={true}
                                                    units={['px']}
                                                />
                                            </Fragment>
                                        )}
                                    </KadencePanelBody>
                                )}
                                {showSettings('ratingSettings', 'kadence/testimonials') && (
                                    <KadencePanelBody
                                        title={__('Rating Settings', 'kadence-blocks')}
                                        initialOpen={false}
                                        panelName={'kb-testimonials-rating-settings'}
                                    >
                                        <ToggleControl
                                            label={__('Show Rating', 'kadence-blocks')}
                                            checked={displayRating}
                                            onChange={(value) => setAttributes({displayRating: value})}
                                        />
                                        {displayRating && (
                                            <Fragment>
                                                <PopColorControl
                                                    label={__('Color', 'kadence-blocks')}
                                                    value={(ratingStyles[0].color ? ratingStyles[0].color : '')}
                                                    default={''}
                                                    onChange={(value) => saveRatingStyles({color: value})}
                                                />
                                                <RangeControl
                                                    label={__('Icon Size', 'kadence-blocks')}
                                                    value={ratingStyles[0].size}
                                                    onChange={value => saveRatingStyles({size: value})}
                                                    step={1}
                                                    min={1}
                                                    max={120}
                                                />
                                                <MeasurementControls
                                                    label={__('Rating Margin', 'kadence-blocks')}
                                                    measurement={ratingStyles[0].margin}
                                                    control={ratingMarginControl}
                                                    onChange={(value) => saveRatingStyles({margin: value})}
                                                    onControl={(value) => setRatingMarginControl(value)}
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                />
                                            </Fragment>
                                        )}
                                    </KadencePanelBody>
                                )}

                                {showSettings('contentSettings', 'kadence/testimonials') && (
                                    <KadencePanelBody
                                        title={__('Content Settings', 'kadence-blocks')}
                                        initialOpen={false}
                                        panelName={'kb-testimonials-content-settings'}
                                    >
                                        <ToggleControl
                                            label={__('Show Content', 'kadence-blocks')}
                                            checked={displayContent}
                                            onChange={(value) => setAttributes({displayContent: value})}
                                        />
                                        {displayContent && (
                                            <Fragment>
                                                <PopColorControl
                                                    label={__('Color', 'kadence-blocks')}
                                                    value={(contentFont[0].color ? contentFont[0].color : '')}
                                                    default={''}
                                                    onChange={value => saveContentFont({color: value})}
                                                />
                                                <TypographyControls
                                                    fontSize={contentFont[0].size}
                                                    onFontSize={(value) => saveContentFont({size: value})}
                                                    fontSizeType={contentFont[0].sizeType}
                                                    onFontSizeType={(value) => saveContentFont({sizeType: value})}
                                                    lineHeight={contentFont[0].lineHeight}
                                                    onLineHeight={(value) => saveContentFont({lineHeight: value})}
                                                    lineHeightType={contentFont[0].lineType}
                                                    onLineHeightType={(value) => saveContentFont({lineType: value})}
                                                    letterSpacing={contentFont[0].letterSpacing}
                                                    onLetterSpacing={(value) => saveContentFont({letterSpacing: value})}
                                                    textTransform={contentFont[0].textTransform}
                                                    onTextTransform={(value) => saveContentFont({textTransform: value})}
                                                    fontFamily={contentFont[0].family}
                                                    onFontFamily={(value) => saveContentFont({family: value})}
                                                    onFontChange={(select) => {
                                                        saveContentFont({
                                                            family: select.value,
                                                            google: select.google,
                                                        });
                                                    }}
                                                    onFontArrayChange={(values) => saveContentFont(values)}
                                                    googleFont={contentFont[0].google}
                                                    onGoogleFont={(value) => saveContentFont({google: value})}
                                                    loadGoogleFont={contentFont[0].loadGoogle}
                                                    onLoadGoogleFont={(value) => saveContentFont({loadGoogle: value})}
                                                    fontVariant={contentFont[0].variant}
                                                    onFontVariant={(value) => saveContentFont({variant: value})}
                                                    fontWeight={contentFont[0].weight}
                                                    onFontWeight={(value) => saveContentFont({weight: value})}
                                                    fontStyle={contentFont[0].style}
                                                    onFontStyle={(value) => saveContentFont({style: value})}
                                                    fontSubset={contentFont[0].subset}
                                                    onFontSubset={(value) => saveContentFont({subset: value})}
                                                />
                                                <ResponsiveRangeControls
                                                    label={__('Content Min Height', 'kadence-blocks')}
                                                    value={(contentMinHeight && undefined !== contentMinHeight[0] ? contentMinHeight[0] : '')}
                                                    onChange={value => setAttributes({contentMinHeight: [value, (contentMinHeight && undefined !== contentMinHeight[1] ? contentMinHeight[1] : ''), (contentMinHeight && undefined !== contentMinHeight[2] ? contentMinHeight[2] : '')]})}
                                                    tabletValue={(contentMinHeight && undefined !== contentMinHeight[1] ? contentMinHeight[1] : '')}
                                                    onChangeTablet={(value) => setAttributes({contentMinHeight: [(contentMinHeight && undefined !== contentMinHeight[0] ? contentMinHeight[0] : ''), value, (contentMinHeight && undefined !== contentMinHeight[2] ? contentMinHeight[2] : '')]})}
                                                    mobileValue={(contentMinHeight && undefined !== contentMinHeight[2] ? contentMinHeight[2] : '')}
                                                    onChangeMobile={(value) => setAttributes({contentMinHeight: [(contentMinHeight && undefined !== contentMinHeight[0] ? contentMinHeight[0] : ''), (contentMinHeight && undefined !== contentMinHeight[1] ? contentMinHeight[1] : ''), value]})}
                                                    min={0}
                                                    max={400}
                                                    step={1}
                                                    unit={'px'}
                                                    showUnit={true}
                                                    units={['px']}
                                                />
                                            </Fragment>
                                        )}
                                    </KadencePanelBody>
                                )}
                                {showSettings('mediaSettings', 'kadence/testimonials') && (
                                    <KadencePanelBody
                                        title={__('Media Settings', 'kadence-blocks')}
                                        initialOpen={false}
                                        panelName={'kb-testimonials-media-settings'}
                                    >
                                        <ToggleControl
                                            label={__('Show Media', 'kadence-blocks')}
                                            checked={displayMedia}
                                            onChange={(value) => setAttributes({displayMedia: value})}
                                        />
                                        {displayMedia && (
                                            <Fragment>
                                                {'card' !== style && (
                                                    <RangeControl
                                                        label={__('Media Max Size', 'kadence-blocks')}
                                                        value={mediaStyles[0].width}
                                                        onChange={value => savemediaStyles({width: value})}
                                                        step={1}
                                                        min={2}
                                                        max={800}
                                                    />
                                                )}
                                                <MeasurementControls
                                                    label={__('Media Border Width (px)', 'kadence-blocks')}
                                                    measurement={mediaStyles[0].borderWidth}
                                                    control={mediaBorderControl}
                                                    onChange={(value) => savemediaStyles({borderWidth: value})}
                                                    onControl={(value) => setMediaBorderControl(value)}
                                                    min={0}
                                                    max={40}
                                                    step={1}
                                                />
                                                <RangeControl
                                                    label={__('Media Border Radius (px)', 'kadence-blocks')}
                                                    value={mediaStyles[0].borderRadius}
                                                    onChange={value => savemediaStyles({borderRadius: value})}
                                                    step={1}
                                                    min={0}
                                                    max={200}
                                                />
                                                <PopColorControl
                                                    label={__('Media Background', 'kadence-blocks')}
                                                    value={(mediaStyles[0].background ? mediaStyles[0].background : '')}
                                                    default={''}
                                                    onChange={value => savemediaStyles({background: value})}
                                                    opacityValue={mediaStyles[0].backgroundOpacity}
                                                    onOpacityChange={value => savemediaStyles({backgroundOpacity: value})}
                                                    onArrayChange={(color, opacity) => savemediaStyles({
                                                        background: color,
                                                        backgroundOpacity: opacity
                                                    })}
                                                />
                                                <PopColorControl
                                                    label={__('Media Border Color', 'kadence-blocks')}
                                                    value={(mediaStyles[0].border ? mediaStyles[0].border : '')}
                                                    default={''}
                                                    onChange={value => savemediaStyles({border: value})}
                                                    opacityValue={mediaStyles[0].borderOpacity}
                                                    onOpacityChange={value => savemediaStyles({borderOpacity: value})}
                                                    onArrayChange={(color, opacity) => savemediaStyles({
                                                        border: color,
                                                        borderOpacity: opacity
                                                    })}
                                                />
                                                <div className="kt-spacer-sidebar-15"></div>
                                                <MeasurementControls
                                                    label={__('Media Padding', 'kadence-blocks')}
                                                    measurement={mediaStyles[0].padding}
                                                    control={mediaPaddingControl}
                                                    onChange={(value) => savemediaStyles({padding: value})}
                                                    onControl={(value) => setMediaPaddingControl(value)}
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                />
                                                <MeasurementControls
                                                    label={__('Media Margin', 'kadence-blocks')}
                                                    measurement={mediaStyles[0].margin}
                                                    control={mediaMarginControl}
                                                    onChange={(value) => savemediaStyles({margin: value})}
                                                    onControl={(value) => setMediaMarginControl(value)}
                                                    min={-100}
                                                    max={100}
                                                    step={1}
                                                />
                                                {'card' === style && (
                                                    <Fragment>
                                                        <SelectControl
                                                            label={__('Image Size', 'kadence-blocks')}
                                                            options={[
                                                                {
                                                                    label: __('Cover', 'kadence-blocks'),
                                                                    value: 'cover',
                                                                },
                                                                {
                                                                    label: __('Contain', 'kadence-blocks'),
                                                                    value: 'Contain',
                                                                },
                                                                {
                                                                    label: __('Auto', 'kadence-blocks'),
                                                                    value: 'auto',
                                                                },
                                                            ]}
                                                            value={mediaStyles[0].backgroundSize}
                                                            onChange={(value) => savemediaStyles({backgroundSize: value})}
                                                        />
                                                        <SelectControl
                                                            label={__('Image Ratio', 'kadence-blocks')}
                                                            options={[
                                                                {
                                                                    label: __('Landscape 4:2', 'kadence-blocks'),
                                                                    value: '50',
                                                                },
                                                                {
                                                                    label: __('Landscape 3:2', 'kadence-blocks'),
                                                                    value: '66.67',
                                                                },
                                                                {
                                                                    label: __('Landscape 4:3', 'kadence-blocks'),
                                                                    value: '75',
                                                                },
                                                                {
                                                                    label: __('Portrait 3:4', 'kadence-blocks'),
                                                                    value: '133.33',
                                                                },
                                                                {
                                                                    label: __('Portrait 2:3', 'kadence-blocks'),
                                                                    value: '150',
                                                                },
                                                                {
                                                                    label: __('Square 1:1', 'kadence-blocks'),
                                                                    value: '100',
                                                                },
                                                            ]}
                                                            value={(undefined === mediaStyles[0].ratio || '' === mediaStyles[0].ratio ? '50' : mediaStyles[0].ratio)}
                                                            onChange={(value) => savemediaStyles({ratio: value})}
                                                        />
                                                    </Fragment>
                                                )}
                                            </Fragment>
                                        )}
                                    </KadencePanelBody>
                                )}
                                {showSettings('nameSettings', 'kadence/testimonials') && (
                                    <KadencePanelBody
                                        title={__('Name Settings', 'kadence-blocks')}
                                        initialOpen={false}
                                        panelName={'kb-testimonials-name-settings'}
                                    >
                                        <ToggleControl
                                            label={__('Show Name', 'kadence-blocks')}
                                            checked={displayName}
                                            onChange={(value) => setAttributes({displayName: value})}
                                        />
                                        {displayName && (
                                            <Fragment>
                                                <PopColorControl
                                                    label={__('Color', 'kadence-blocks')}
                                                    value={(nameFont[0].color ? nameFont[0].color : '')}
                                                    default={''}
                                                    onChange={(value) => saveNameFont({color: value})}
                                                />
                                                <TypographyControls
                                                    fontSize={nameFont[0].size}
                                                    onFontSize={(value) => saveNameFont({size: value})}
                                                    fontSizeType={nameFont[0].sizeType}
                                                    onFontSizeType={(value) => saveNameFont({sizeType: value})}
                                                    lineHeight={nameFont[0].lineHeight}
                                                    onLineHeight={(value) => saveNameFont({lineHeight: value})}
                                                    lineHeightType={nameFont[0].lineType}
                                                    onLineHeightType={(value) => saveNameFont({lineType: value})}
                                                    letterSpacing={nameFont[0].letterSpacing}
                                                    onLetterSpacing={(value) => saveNameFont({letterSpacing: value})}
                                                    textTransform={nameFont[0].textTransform}
                                                    onTextTransform={(value) => saveNameFont({textTransform: value})}
                                                    fontFamily={nameFont[0].family}
                                                    onFontFamily={(value) => saveNameFont({family: value})}
                                                    onFontChange={(select) => {
                                                        saveNameFont({
                                                            family: select.value,
                                                            google: select.google,
                                                        });
                                                    }}
                                                    onFontArrayChange={(values) => saveNameFont(values)}
                                                    googleFont={nameFont[0].google}
                                                    onGoogleFont={(value) => saveNameFont({google: value})}
                                                    loadGoogleFont={nameFont[0].loadGoogle}
                                                    onLoadGoogleFont={(value) => saveNameFont({loadGoogle: value})}
                                                    fontVariant={nameFont[0].variant}
                                                    onFontVariant={(value) => saveNameFont({variant: value})}
                                                    fontWeight={nameFont[0].weight}
                                                    onFontWeight={(value) => saveNameFont({weight: value})}
                                                    fontStyle={nameFont[0].style}
                                                    onFontStyle={(value) => saveNameFont({style: value})}
                                                    fontSubset={nameFont[0].subset}
                                                    onFontSubset={(value) => saveNameFont({subset: value})}
                                                />
                                            </Fragment>
                                        )}
                                    </KadencePanelBody>
                                )}
                                {showSettings('occupationSettings', 'kadence/testimonials') && (
                                    <KadencePanelBody
                                        title={__('Occupation Settings', 'kadence-blocks')}
                                        initialOpen={false}
                                        panelName={'kb-testimonails-occupation-settings'}
                                    >
                                        <ToggleControl
                                            label={__('Show Occupation', 'kadence-blocks')}
                                            checked={displayOccupation}
                                            onChange={(value) => setAttributes({displayOccupation: value})}
                                        />
                                        {displayOccupation && (
                                            <Fragment>
                                                <PopColorControl
                                                    label={__('Color', 'kadence-blocks')}
                                                    value={(occupationFont[0].color ? occupationFont[0].color : '')}
                                                    default={''}
                                                    onChange={(value) => saveOccupationFont({color: value})}
                                                />
                                                <TypographyControls
                                                    fontSize={occupationFont[0].size}
                                                    onFontSize={(value) => saveOccupationFont({size: value})}
                                                    fontSizeType={occupationFont[0].sizeType}
                                                    onFontSizeType={(value) => saveOccupationFont({sizeType: value})}
                                                    lineHeight={occupationFont[0].lineHeight}
                                                    onLineHeight={(value) => saveOccupationFont({lineHeight: value})}
                                                    lineHeightType={occupationFont[0].lineType}
                                                    onLineHeightType={(value) => saveOccupationFont({lineType: value})}
                                                    textTransform={occupationFont[0].textTransform}
                                                    onTextTransform={(value) => saveOccupationFont({textTransform: value})}
                                                    letterSpacing={occupationFont[0].letterSpacing}
                                                    onLetterSpacing={(value) => saveOccupationFont({letterSpacing: value})}
                                                    fontFamily={occupationFont[0].family}
                                                    onFontFamily={(value) => saveOccupationFont({family: value})}
                                                    onFontChange={(select) => {
                                                        saveOccupationFont({
                                                            family: select.value,
                                                            google: select.google,
                                                        });
                                                    }}
                                                    onFontArrayChange={(values) => saveOccupationFont(values)}
                                                    googleFont={occupationFont[0].google}
                                                    onGoogleFont={(value) => saveOccupationFont({google: value})}
                                                    loadGoogleFont={occupationFont[0].loadGoogle}
                                                    onLoadGoogleFont={(value) => saveOccupationFont({loadGoogle: value})}
                                                    fontVariant={occupationFont[0].variant}
                                                    onFontVariant={(value) => saveOccupationFont({variant: value})}
                                                    fontWeight={occupationFont[0].weight}
                                                    onFontWeight={(value) => saveOccupationFont({weight: value})}
                                                    fontStyle={occupationFont[0].style}
                                                    onFontStyle={(value) => saveOccupationFont({style: value})}
                                                    fontSubset={occupationFont[0].subset}
                                                    onFontSubset={(value) => saveOccupationFont({subset: value})}
                                                />
                                            </Fragment>
                                        )}
                                    </KadencePanelBody>
                                )}
                            </>
                        }

                        {( activeTab === 'advanced') && (
                            <>
                                <KadencePanelBody panelName={'kb-testimonials-spacings-settings'}>
                                    <ResponsiveMeasureRangeControl
                                        label={__('Container Padding', 'kadence-blocks')}
                                        value={containerPadding}
                                        tabletValue={tabletContainerPadding}
                                        mobileValue={mobileContainerPadding}
                                        onChange={(value) => setAttributes({containerPadding: value})}
                                        onChangeTablet={(value) => setAttributes({tabletContainerPadding: value})}
                                        onChangeMobile={(value) => setAttributes({mobileContainerPadding: value})}
                                        min={0}
                                        max={(containerPaddingType === 'em' || containerPaddingType === 'rem' ? 12 : 200)}
                                        step={(containerPaddingType === 'em' || containerPaddingType === 'rem' ? 0.1 : 1)}
                                        unit={(containerPaddingType ? containerPaddingType : 'px')}
                                        units={['px', 'em', 'rem']}
                                        onUnit={(value) => setAttributes({containerPaddingType: value})}
                                        onMouseOver={ paddingMouseOver.onMouseOver }
                                        onMouseOut={ paddingMouseOver.onMouseOut }
                                    />
                                    <RangeControl
                                        label={__('Container Max Width (px)', 'kadence-blocks')}
                                        value={containerMaxWidth}
                                        onChange={value => setAttributes({containerMaxWidth: value})}
                                        step={5}
                                        min={50}
                                        max={2000}
                                    />
                                    <ResponsiveRangeControls
                                        label={__('Container Min Height', 'kadence-blocks')}
                                        value={(containerMinHeight && undefined !== containerMinHeight[0] ? containerMinHeight[0] : '')}
                                        onChange={value => setAttributes({containerMinHeight: [value, (containerMinHeight && undefined !== containerMinHeight[1] ? containerMinHeight[1] : ''), (containerMinHeight && undefined !== containerMinHeight[2] ? containerMinHeight[2] : '')]})}
                                        tabletValue={(containerMinHeight && undefined !== containerMinHeight[1] ? containerMinHeight[1] : '')}
                                        onChangeTablet={(value) => setAttributes({containerMinHeight: [(containerMinHeight && undefined !== containerMinHeight[0] ? containerMinHeight[0] : ''), value, (containerMinHeight && undefined !== containerMinHeight[2] ? containerMinHeight[2] : '')]})}
                                        mobileValue={(containerMinHeight && undefined !== containerMinHeight[2] ? containerMinHeight[2] : '')}
                                        onChangeMobile={(value) => setAttributes({containerMinHeight: [(containerMinHeight && undefined !== containerMinHeight[0] ? containerMinHeight[0] : ''), (containerMinHeight && undefined !== containerMinHeight[1] ? containerMinHeight[1] : ''), value]})}
                                        min={0}
                                        max={600}
                                        step={1}
                                        unit={'px'}
                                        showUnit={true}
                                        units={['px']}
                                    />
                                </KadencePanelBody>

                                <div className="kt-sidebar-settings-spacer"></div>

                                <KadenceBlockDefaults attributes={attributes} defaultAttributes={metadata['attributes']} blockSlug={ 'kadence/testimonials' } excludedAttrs={ [ 'itemsCount' ] } preventMultiple={ [ 'testimonials' ] } />
                            </>
                        )}

                    </InspectorControls>
                </Fragment>
            )}
            {showPreset && (
                <div className="kt-select-starter-style-tabs kt-select-starter-style-infobox">
                    <div className="kt-select-starter-style-tabs-title">
                        {__('Select Initial Style', 'kadence-blocks')}
                    </div>
                    <ButtonGroup className="kt-init-tabs-btn-group" aria-label={__('Initial Style', 'kadence-blocks')}>
                        {map(startlayoutOptions, ({name, key, icon}) => (
                            <Button
                                key={key}
                                className="kt-inital-tabs-style-btn"
                                isSmall
                                onClick={() => {
                                    setInitalLayout(key);
                                    setShowPreset(false);
                                }}
                            >
                                {icon}
                            </Button>
                        ))}
                    </ButtonGroup>
                </div>
            )}
            {!showPreset && (
                <Fragment {...blockProps}>

                    {layout && layout === 'carousel' && (
                        <div className={`kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`} style={{
                            paddingRight: previewWrapperPaddingRight ? previewWrapperPaddingRight + (wrapperPaddingType ? wrapperPaddingType : 'px') : undefined,
                            paddingLeft: previewWrapperPaddingLeft ? previewWrapperPaddingLeft + (wrapperPaddingType ? wrapperPaddingType : 'px') : undefined,
                        }}>
                            {childBlocks.size !== 1 && (
                                <Slider
                                    className={`kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`} {...sliderSettings}>
                                    <InnerBlocks
                                        template={ [ [ 'kadence/testimonial' ] ] }
                                        templateLock={ false }
                                        templateInsertUpdatesSelection={ true }
                                        allowedBlocks={ [ 'kadence/testimonial' ] }
                                    />
                                </Slider>
                            )}
                            {childBlocks.size === 1 && (
                                <InnerBlocks
                                    template={ [ [ 'kadence/testimonial' ] ] }
                                    templateLock={ false }
                                    templateInsertUpdatesSelection={ true }
                                    allowedBlocks={ [ 'kadence/testimonial' ] }
                                />
                            )}
                        </div>
                    )}
                    {layout && layout === 'grid' && (
                        <div className={'kt-testimonial-grid-wrap'} style={{
                            'grid-row-gap': columnGap + 'px',
                            'grid-column-gap': columnGap + 'px',
                            paddingTop: previewWrapperPaddingTop ? previewWrapperPaddingTop + (wrapperPaddingType ? wrapperPaddingType : 'px') : undefined,
                            paddingRight: previewWrapperPaddingRight ? previewWrapperPaddingRight + (wrapperPaddingType ? wrapperPaddingType : 'px') : undefined,
                            paddingBottom: previewWrapperPaddingBottom ? previewWrapperPaddingBottom + (wrapperPaddingType ? wrapperPaddingType : 'px') : undefined,
                            paddingLeft: previewWrapperPaddingLeft ? previewWrapperPaddingLeft + (wrapperPaddingType ? wrapperPaddingType : 'px') : undefined,
                        }}>
                            <InnerBlocks
                                template={ [ [ 'kadence/testimonial' ] ] }
                                templateLock={ false }
                                templateInsertUpdatesSelection={ true }
                                allowedBlocks={ [ 'kadence/testimonial' ] }
                            />
                        </div>
                    )}

                    {displayTitle && titleFont[0].google && (
                        <WebfontLoader config={config}>
                        </WebfontLoader>
                    )}
                    {displayContent && contentFont[0].google && (
                        <WebfontLoader config={tconfig}>
                        </WebfontLoader>
                    )}
                    {displayName && nameFont[0].google && (
                        <WebfontLoader config={lconfig}>
                        </WebfontLoader>
                    )}
                    {displayOccupation && occupationFont[0].google && (
                        <WebfontLoader config={oconfig}>
                        </WebfontLoader>
                    )}
                </Fragment>
            )}
        </div>
    );
}

export default KadenceTestimonials;
