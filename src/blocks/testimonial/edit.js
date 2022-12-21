/**
 * BLOCK: Kadence Single Testimonial
 *
 */

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
import {has} from 'lodash';

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
    getSpacingOptionOutput
} from '@kadence/helpers';

/**
 * Internal block libraries
 */
import {__} from '@wordpress/i18n';

import {useEffect, Fragment, useState, useRef} from '@wordpress/element';

import {
    MediaUpload,
    RichText,
    InspectorControls,
    useBlockProps,
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
        url,
        id,
        alt,
        width,
        height,
        maxWidth,
        subtype,
        media,
        icon,
        isize,
        istroke,
        ititle,
        color,
        title,
        content,
        name,
        occupation,
        rating,
        sizes,
        inQueryBlock,
        useBlockQuoteTags
    } = attributes;

    const displayContent = context['kadence/testimonials-displayContent'];
    const displayTitle = context['kadence/testimonials-displayTitle'];
    const displayRating = context['kadence/testimonials-displayRating'];
    const displayName = context['kadence/testimonials-displayName'];
    const displayIcon = context['kadence/testimonials-displayIcon'];
    const iconStyles = context['kadence/testimonials-iconStyles'];
    const containerVAlign = context['kadence/testimonials-containerVAlign'];
    const style = context['kadence/testimonials-style'];
    const displayShadow = context['kadence/testimonials-displayShadow'];
    const shadow = context['kadence/testimonials-shadow'];
    const containerBorder = context['kadence/testimonials-containerBorder'];
    const containerBorderRadius = context['kadence/testimonials-containerBorderRadius'];
    const containerBorderWidth = context['kadence/testimonials-containerBorderWidth'];
    const containerBorderOpacity = context['kadence/testimonials-containerBorderOpacity'];
    const containerBackground = context['kadence/testimonials-containerBackground'];
    const containerBackgroundOpacity = context['kadence/testimonials-containerBackgroundOpacity'];
    const contentMinHeight = context['kadence/testimonials-contentMinHeight'];
    const contentFont = context['kadence/testimonials-contentFont'];

    const occupationFont = context['kadence/testimonials-occupationFont'];
    const nameFont = context['kadence/testimonials-nameFont'];
    const wrapperPadding = context['kadence/testimonials-wrapperPadding'];
    const wrapperPaddingType = context['kadence/testimonials-wrapperPaddingType'];
    const wrapperMobilePadding = context['kadence/testimonials-wrapperMobilePadding'];
    const wrapperTabletPadding = context['kadence/testimonials-wrapperTabletPadding'];
    const titleMinHeight = context['kadence/testimonials-titleMinHeight'];
    const titleFont = context['kadence/testimonials-titleFont'];

    const displayOccupation = context['kadence/testimonials-displayOccupation'];
    const displayMedia = context['kadence/testimonials-displayMedia'];
    const layout = context['kadence/testimonials-layout'];
    const containerMinHeight = context['kadence/testimonials-containerMinHeight'];
    const containerMaxWidth = context["kadence/testimonials-containerMaxWidth"];
    const containerPadding = context['kadence/testimonials-containerPadding'];
    const containerPaddingType = context['kadence/testimonials-containerPaddingType'];
    const mobileContainerPadding = context['kadence/testimonials-mobileContainerPadding'];
    const tabletContainerPadding = context['kadence/testimonials-tabletContainerPadding'];
    const mediaStyles = context['kadence/testimonials-mediaStyles'];
    const ratingStyles = context['kadence/testimonials-ratingStyles'];

    const [activeTab, setActiveTab] = useState('general');

    const {addUniqueID} = useDispatch('kadenceblocks/data');
    const {isUniqueID, isUniqueBlock, previewDevice} = useSelect(
        (select) => {
            return {
                isUniqueID: (value) => select('kadenceblocks/data').isUniqueID(value),
                isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
                previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
            };
        },
        [clientId],
    );

    useEffect(() => {

        let smallID = '_' + clientId.substr(2, 9);
        if (!uniqueID) {
            attributes = setBlockDefaults( 'kadence/testimonial', attributes);

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

    const onMove = (oldIndex, newIndex) => {
        let newTestimonials = [...testimonials];
        newTestimonials.splice(newIndex, 1, testimonials[oldIndex]);
        newTestimonials.splice(oldIndex, 1, testimonials[newIndex]);
        setAttributes({testimonials: newTestimonials});
    };

    const onMoveForward = (oldIndex) => {
        if (oldIndex === testimonials.length - 1) {
            return;
        }
        onMove(oldIndex, oldIndex + 1);
    };

    const onMoveBackward = (oldIndex) => {
        if (oldIndex === 0) {
            return;
        }
        onMove(oldIndex, oldIndex - 1);
    };

    const previewContainerPaddingTop = getPreviewSize(previewDevice, (undefined !== containerPadding && undefined !== containerPadding[0] ? containerPadding[0] : ''), (undefined !== tabletContainerPadding && undefined !== tabletContainerPadding[0] ? tabletContainerPadding[0] : ''), (undefined !== mobileContainerPadding && undefined !== mobileContainerPadding[0] ? mobileContainerPadding[0] : ''));
    const previewContainerPaddingRight = getPreviewSize(previewDevice, (undefined !== containerPadding && undefined !== containerPadding[1] ? containerPadding[1] : ''), (undefined !== tabletContainerPadding && undefined !== tabletContainerPadding[1] ? tabletContainerPadding[1] : ''), (undefined !== mobileContainerPadding && undefined !== mobileContainerPadding[1] ? mobileContainerPadding[1] : ''));
    const previewContainerPaddingBottom = getPreviewSize(previewDevice, (undefined !== containerPadding && undefined !== containerPadding[2] ? containerPadding[2] : ''), (undefined !== tabletContainerPadding && undefined !== tabletContainerPadding[2] ? tabletContainerPadding[2] : ''), (undefined !== mobileContainerPadding && undefined !== mobileContainerPadding[2] ? mobileContainerPadding[2] : ''));
    const previewContainerPaddingLeft = getPreviewSize(previewDevice, (undefined !== containerPadding && undefined !== containerPadding[3] ? containerPadding[3] : ''), (undefined !== tabletContainerPadding && undefined !== tabletContainerPadding[3] ? tabletContainerPadding[3] : ''), (undefined !== mobileContainerPadding && undefined !== mobileContainerPadding[3] ? mobileContainerPadding[3] : ''));

    const previewWrapperPaddingTop = getPreviewSize(previewDevice, (undefined !== wrapperPadding && undefined !== wrapperPadding[0] ? wrapperPadding[0] : ''), (undefined !== wrapperTabletPadding && undefined !== wrapperTabletPadding[0] ? wrapperTabletPadding[0] : ''), (undefined !== wrapperMobilePadding && undefined !== wrapperMobilePadding[0] ? wrapperMobilePadding[0] : ''));
    const previewWrapperPaddingRight = getPreviewSize(previewDevice, (undefined !== wrapperPadding && undefined !== wrapperPadding[1] ? wrapperPadding[1] : ''), (undefined !== wrapperTabletPadding && undefined !== wrapperTabletPadding[1] ? wrapperTabletPadding[1] : ''), (undefined !== wrapperMobilePadding && undefined !== wrapperMobilePadding[1] ? wrapperMobilePadding[1] : ''));
    const previewWrapperPaddingBottom = getPreviewSize(previewDevice, (undefined !== wrapperPadding && undefined !== wrapperPadding[2] ? wrapperPadding[2] : ''), (undefined !== wrapperTabletPadding && undefined !== wrapperTabletPadding[2] ? wrapperTabletPadding[2] : ''), (undefined !== wrapperMobilePadding && undefined !== wrapperMobilePadding[2] ? wrapperMobilePadding[2] : ''));
    const previewWrapperPaddingLeft = getPreviewSize(previewDevice, (undefined !== wrapperPadding && undefined !== wrapperPadding[3] ? wrapperPadding[3] : ''), (undefined !== wrapperTabletPadding && undefined !== wrapperTabletPadding[3] ? wrapperTabletPadding[3] : ''), (undefined !== wrapperMobilePadding && undefined !== wrapperMobilePadding[3] ? wrapperMobilePadding[3] : ''));
    const previewTitleFont = getPreviewSize(previewDevice, (undefined !== titleFont[0].size && undefined !== titleFont[0].size[0] && '' !== titleFont[0].size[0] ? titleFont[0].size[0] : ''), (undefined !== titleFont[0].size && undefined !== titleFont[0].size[1] && '' !== titleFont[0].size[1] ? titleFont[0].size[1] : ''), (undefined !== titleFont[0].size && undefined !== titleFont[0].size[2] && '' !== titleFont[0].size[2] ? titleFont[0].size[2] : ''));
    const previewTitleFontSizeType = undefined !== titleFont[0].sizeType ? titleFont[0].sizeType : 'px';
    const previewTitleLineHeight = getPreviewSize(previewDevice, (undefined !== titleFont[0].lineHeight && undefined !== titleFont[0].lineHeight[0] && '' !== titleFont[0].lineHeight[0] ? titleFont[0].lineHeight[0] : ''), (undefined !== titleFont[0].lineHeight && undefined !== titleFont[0].lineHeight[1] && '' !== titleFont[0].lineHeight[1] ? titleFont[0].lineHeight[1] : ''), (undefined !== titleFont[0].lineHeight && undefined !== titleFont[0].lineHeight[2] && '' !== titleFont[0].lineHeight[2] ? titleFont[0].lineHeight[2] : ''));
    const previewTitleLineHeightLineType = undefined !== titleFont[0].lineType ? titleFont[0].lineType : 'px';
    const previewContentMinHeight = getPreviewSize(previewDevice, (undefined !== contentMinHeight && undefined !== contentMinHeight[0] ? contentMinHeight[0] : ''), (undefined !== contentMinHeight && undefined !== contentMinHeight[1] ? contentMinHeight[1] : ''), (undefined !== contentMinHeight && undefined !== contentMinHeight[2] ? contentMinHeight[2] : ''));

    const previewContainerMinHeight = getPreviewSize(previewDevice, (undefined !== containerMinHeight && undefined !== containerMinHeight[0] ? containerMinHeight[0] : ''), (undefined !== containerMinHeight && undefined !== containerMinHeight[1] ? containerMinHeight[1] : ''), (undefined !== containerMinHeight && undefined !== containerMinHeight[2] ? containerMinHeight[2] : ''));
    const previewTitleMinHeight = getPreviewSize(previewDevice, (undefined !== titleMinHeight && undefined !== titleMinHeight[0] ? titleMinHeight[0] : ''), (undefined !== titleMinHeight && undefined !== titleMinHeight[1] ? titleMinHeight[1] : ''), (undefined !== titleMinHeight && undefined !== titleMinHeight[2] ? titleMinHeight[2] : ''));

    const previewContentFont = getPreviewSize(previewDevice, (undefined !== contentFont[0].size && undefined !== contentFont[0].size[0] && '' !== contentFont[0].size[0] ? contentFont[0].size[0] : ''), (undefined !== contentFont[0].size && undefined !== contentFont[0].size[1] && '' !== contentFont[0].size[1] ? contentFont[0].size[1] : ''), (undefined !== contentFont[0].size && undefined !== contentFont[0].size[2] && '' !== contentFont[0].size[2] ? contentFont[0].size[2] : ''));
    const previewContentFontSizeType = undefined !== contentFont[0].sizeType ? contentFont[0].sizeType : 'px';
    const previewContentLineHeight = getPreviewSize(previewDevice, (undefined !== contentFont[0].lineHeight && undefined !== contentFont[0].lineHeight[0] && '' !== contentFont[0].lineHeight[0] ? contentFont[0].lineHeight[0] : ''), (undefined !== contentFont[0].lineHeight && undefined !== contentFont[0].lineHeight[1] && '' !== contentFont[0].lineHeight[1] ? contentFont[0].lineHeight[1] : ''), (undefined !== contentFont[0].lineHeight && undefined !== contentFont[0].lineHeight[2] && '' !== contentFont[0].lineHeight[2] ? contentFont[0].lineHeight[2] : ''));
    const previewContentLineHeightLineType = undefined !== contentFont[0].lineType ? contentFont[0].lineType : 'px';

    const previewNameFont = getPreviewSize(previewDevice, (undefined !== nameFont[0].size && undefined !== nameFont[0].size[0] && '' !== nameFont[0].size[0] ? nameFont[0].size[0] : ''), (undefined !== nameFont[0].size && undefined !== nameFont[0].size[1] && '' !== nameFont[0].size[1] ? nameFont[0].size[1] : ''), (undefined !== nameFont[0].size && undefined !== nameFont[0].size[2] && '' !== nameFont[0].size[2] ? nameFont[0].size[2] : ''));
    const previewNameLineHeight = getPreviewSize(previewDevice, (undefined !== nameFont[0].lineHeight && undefined !== nameFont[0].lineHeight[0] && '' !== nameFont[0].lineHeight[0] ? nameFont[0].lineHeight[0] : ''), (undefined !== nameFont[0].lineHeight && undefined !== nameFont[0].lineHeight[1] && '' !== nameFont[0].lineHeight[1] ? nameFont[0].lineHeight[1] : ''), (undefined !== nameFont[0].lineHeight && undefined !== nameFont[0].lineHeight[2] && '' !== nameFont[0].lineHeight[2] ? nameFont[0].lineHeight[2] : ''));
    const previewNameLineHeightType = undefined !== nameFont[0].lineType ? nameFont[0].lineType : 'px';
    const previewNameFontType = undefined !== nameFont[0].sizeType ? nameFont[0].sizeType : 'px';

    const previewOccupationFont = getPreviewSize(previewDevice, (undefined !== occupationFont[0].size && undefined !== occupationFont[0].size[0] && '' !== occupationFont[0].size[0] ? occupationFont[0].size[0] : ''), (undefined !== occupationFont[0].size && undefined !== occupationFont[0].size[1] && '' !== occupationFont[0].size[1] ? occupationFont[0].size[1] : ''), (undefined !== occupationFont[0].size && undefined !== occupationFont[0].size[2] && '' !== occupationFont[0].size[2] ? occupationFont[0].size[2] : ''));
    const previewOccupationFontSizeType = undefined !== occupationFont[0].sizeType ? occupationFont[0].sizeType : 'px';
    const previewOccupationLineHeight = getPreviewSize(previewDevice, (undefined !== occupationFont[0].lineHeight && undefined !== occupationFont[0].lineHeight[0] && '' !== occupationFont[0].lineHeight[0] ? occupationFont[0].lineHeight[0] : ''), (undefined !== occupationFont[0].lineHeight && undefined !== occupationFont[0].lineHeight[1] && '' !== occupationFont[0].lineHeight[1] ? occupationFont[0].lineHeight[1] : ''), (undefined !== occupationFont[0].lineHeight && undefined !== occupationFont[0].lineHeight[2] && '' !== occupationFont[0].lineHeight[2] ? occupationFont[0].lineHeight[2] : ''));
    const previewOccupationLineHeightLineType = undefined !== occupationFont[0].lineType ? occupationFont[0].lineType : 'px';

    const containerStyles = {
        boxShadow: (displayShadow ? shadow[0].hOffset + 'px ' + shadow[0].vOffset + 'px ' + shadow[0].blur + 'px ' + shadow[0].spread + 'px ' + KadenceColorOutput((undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000'), (shadow[0].opacity ? shadow[0].opacity : 0.2)) : undefined),
        borderColor: (containerBorder ? KadenceColorOutput(containerBorder, (undefined !== containerBorderOpacity ? containerBorderOpacity : 1)) : KadenceColorOutput('#eeeeee', (undefined !== containerBorderOpacity ? containerBorderOpacity : 1))),
        background: (containerBackground ? KadenceColorOutput(containerBackground, (undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1)) : undefined),
        borderRadius: !isNaN(containerBorderRadius) ? containerBorderRadius + 'px' : undefined,
        borderTopWidth: (containerBorderWidth && undefined !== containerBorderWidth[0] ? containerBorderWidth[0] + 'px' : undefined),
        borderRightWidth: (containerBorderWidth && undefined !== containerBorderWidth[1] ? containerBorderWidth[1] + 'px' : undefined),
        borderBottomWidth: (containerBorderWidth && undefined !== containerBorderWidth[2] ? containerBorderWidth[2] + 'px' : undefined),
        borderLeftWidth: (containerBorderWidth && undefined !== containerBorderWidth[3] ? containerBorderWidth[3] + 'px' : undefined),
        paddingTop: (previewContainerPaddingTop ? getSpacingOptionOutput( previewContainerPaddingTop, (containerPaddingType ? containerPaddingType : 'px') ) : undefined),
        paddingRight: (previewContainerPaddingRight ? getSpacingOptionOutput( previewContainerPaddingRight, (containerPaddingType ? containerPaddingType : 'px') ) : undefined),
        paddingBottom: (previewContainerPaddingBottom ? getSpacingOptionOutput( previewContainerPaddingBottom, (containerPaddingType ? containerPaddingType : 'px') ) : undefined),
        paddingLeft: (previewContainerPaddingLeft ? getSpacingOptionOutput( previewContainerPaddingLeft, (containerPaddingType ? containerPaddingType : 'px') ) : undefined),
        maxWidth: ('bubble' === style || 'inlineimage' === style ? undefined : containerMaxWidth + 'px'),
        minHeight: ('bubble' === style || 'inlineimage' === style || !previewContainerMinHeight ? undefined : previewContainerMinHeight + 'px'),
        marginTop: layout && layout === 'carousel' && previewWrapperPaddingTop ? previewWrapperPaddingTop + (wrapperPaddingType ? wrapperPaddingType : 'px') : undefined,
        marginBottom: layout && layout === 'carousel' && previewWrapperPaddingBottom ? previewWrapperPaddingBottom + (wrapperPaddingType ? wrapperPaddingType : 'px') : undefined,
    };


    const ref = useRef();

    const blockProps = useBlockProps({
        ref,
        className: classnames({

        })
    });

    const ALLOWED_MEDIA_TYPES = ['image'];

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

    const renderTestimonialSettings = () => {
        return (
            <>
                <SelectControl
                    label={__('Media Type', 'kadence-blocks')}
                    value={media}
                    options={[
                        {value: 'image', label: __('Image', 'kadence-blocks')},
                        {value: 'icon', label: __('Icon', 'kadence-blocks')},
                    ]}
                    onChange={value => setAttributes({media: value})}
                />
                {'icon' === media && (
                    <Fragment>
                        <KadenceIconPicker
                            value={icon}
                            onChange={value => {
                                setAttributes({icon: value});
                            }}
                        />
                        <RangeControl
                            label={__('Icon Size', 'kadence-blocks')}
                            value={isize}
                            onChange={value => {
                                setAttributes({isize: value});
                            }}
                            min={5}
                            max={250}
                        />
                        {icon && 'fe' === icon.substring(0, 2) && (
                            <RangeControl
                                label={__('Line Width', 'kadence-blocks')}
                                value={istroke}
                                onChange={value => {
                                    setAttributes({istroke: value});
                                }}
                                step={0.5}
                                min={0.5}
                                max={4}
                            />
                        )}
                        <PopColorControl
                            label={__('Icon Color', 'kadence-blocks')}
                            value={(color ? color : '#555555')}
                            default={'#555555'}
                            onChange={(value) => setAttributes({color: value})}
                        />
                    </Fragment>
                )}
                <RangeControl
                    label={__('Rating', 'kadence-blocks')}
                    value={rating}
                    onChange={value => {
                        setAttributes({rating: value});
                    }}
                    step={1}
                    min={1}
                    max={5}
                />
            </>
        );
    };

    const renderTestimonialIcon = () => {
        return (
            <div className="kt-svg-testimonial-global-icon-wrap" style={{
                margin: (iconStyles[0].margin ? iconStyles[0].margin[0] + 'px ' + iconStyles[0].margin[1] + 'px ' + iconStyles[0].margin[2] + 'px ' + iconStyles[0].margin[3] + 'px' : ''),
            }}>
                <IconRender
                    className={`kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`}
                    name={iconStyles[0].icon} size={iconStyles[0].size}
                    title={(iconStyles[0].title ? iconStyles[0].title : '')}
                    strokeWidth={('fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined)}
                    style={{
                        color: (iconStyles[0].color ? KadenceColorOutput(iconStyles[0].color) : undefined),
                        borderRadius: iconStyles[0].borderRadius + 'px',
                        borderTopWidth: (iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[0] ? iconStyles[0].borderWidth[0] + 'px' : undefined),
                        borderRightWidth: (iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[1] ? iconStyles[0].borderWidth[1] + 'px' : undefined),
                        borderBottomWidth: (iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[2] ? iconStyles[0].borderWidth[2] + 'px' : undefined),
                        borderLeftWidth: (iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[3] ? iconStyles[0].borderWidth[3] + 'px' : undefined),
                        background: (iconStyles[0].background ? KadenceColorOutput(iconStyles[0].background, (undefined !== iconStyles[0].backgroundOpacity ? iconStyles[0].backgroundOpacity : 1)) : undefined),
                        borderColor: (iconStyles[0].border ? KadenceColorOutput(iconStyles[0].border, (undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1)) : undefined),
                        padding: (iconStyles[0].padding ? iconStyles[0].padding[0] + 'px ' + iconStyles[0].padding[1] + 'px ' + iconStyles[0].padding[2] + 'px ' + iconStyles[0].padding[3] + 'px' : ''),
                    }}/>
            </div>
        );
    };
    const renderTestimonialMedia = () => {

        let urlOutput = url;
        if ( has( sizes, 'thumbnail') ) {
            if (('card' === style && containerMaxWidth > 500) || mediaStyles[0].width > 600) {
                urlOutput = url;
            } else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
                if (sizes.large && sizes.large.width > 1000) {
                    urlOutput = sizes.large.url;
                }
            } else if ('card' === style && containerMaxWidth <= 100) {
                if (sizes.medium && sizes.medium.width > 200) {
                    urlOutput = sizes.medium.url;
                } else if (sizes.large && sizes.large.width > 200) {
                    urlOutput = sizes.large.url;
                }
            } else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
                if (sizes.large && sizes.large.width > 1000) {
                    urlOutput = sizes.large.url;
                }
            } else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
                if (sizes.medium && sizes.medium.width > 200) {
                    urlOutput = sizes.medium.url;
                } else if (sizes.large && sizes.large.width > 200) {
                    urlOutput = sizes.large.url;
                }
            } else if (mediaStyles[0].width <= 75) {
                if (sizes.thumbnail && sizes.thumbnail.width > 140) {
                    urlOutput = sizes.thumbnail.url;
                } else if (sizes.medium && sizes.medium.width > 140) {
                    urlOutput = sizes.medium.url;
                } else if (sizes.large && sizes.large.width > 200) {
                    urlOutput = sizes.large.url;
                }
            }
        }
        return (
            <div className="kt-testimonial-media-wrap">
                <div className="kt-testimonial-media-inner-wrap" style={{
                    width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
                    borderColor: KadenceColorOutput(mediaStyles[0].border),
                    backgroundColor: (mediaStyles[0].background ? KadenceColorOutput(mediaStyles[0].background, (undefined !== mediaStyles[0].backgroundOpacity ? mediaStyles[0].backgroundOpacity : 1)) : undefined),
                    borderRadius: mediaStyles[0].borderRadius + 'px',
                    borderWidth: (mediaStyles[0].borderWidth ? mediaStyles[0].borderWidth[0] + 'px ' + mediaStyles[0].borderWidth[1] + 'px ' + mediaStyles[0].borderWidth[2] + 'px ' + mediaStyles[0].borderWidth[3] + 'px' : ''),
                    padding: (mediaStyles[0].padding ? mediaStyles[0].padding[0] + 'px ' + mediaStyles[0].padding[1] + 'px ' + mediaStyles[0].padding[2] + 'px ' + mediaStyles[0].padding[3] + 'px' : ''),
                    marginTop: (mediaStyles[0].margin && undefined !== mediaStyles[0].margin[0] ? mediaStyles[0].margin[0] + 'px' : undefined),
                    marginRight: (mediaStyles[0].margin && undefined !== mediaStyles[0].margin[1] ? mediaStyles[0].margin[1] + 'px' : undefined),
                    marginBottom: (mediaStyles[0].margin && undefined !== mediaStyles[0].margin[2] ? mediaStyles[0].margin[2] + 'px' : undefined),
                    marginLeft: (mediaStyles[0].margin && undefined !== mediaStyles[0].margin[3] ? mediaStyles[0].margin[3] + 'px' : undefined),
                }}>
                    <div className={'kadence-testimonial-image-intrisic'} style={{
                        paddingBottom: ('card' === style && (undefined !== mediaStyles[0].ratio || '' !== mediaStyles[0].ratio) ? mediaStyles[0].ratio + '%' : undefined),
                    }}>
                        {'icon' === media && icon && (
                            <IconRender
                                className={`kt-svg-testimonial-icon kt-svg-testimonial-icon-${icon}`}
                                name={icon} size={isize}
                                title={(ititle ? ititle : '')}
                                strokeWidth={('fe' === icon.substring(0, 2) ? istroke : undefined)}
                                style={{
                                    display: 'flex',
                                    color: (color ? KadenceColorOutput(color) : undefined),
                                }}/>
                        )}
                        {'icon' !== media && url && (
                            <>
                                <MediaUpload
                                    onSelect={(media) => {
                                        setAttributes({
                                            id: media.id,
                                            url: media.url,
                                            alt: media.alt,
                                            subtype: media.subtype,
                                            sizes: media.sizes,
                                        });
                                    }}
                                    type="image"
                                    value={(id ? id : '')}
                                    allowedTypes={ALLOWED_MEDIA_TYPES}
                                    render={({open}) => (
                                        <Tooltip text={__('Edit Image', 'kadence-blocks')}>
                                            <Button
                                                style={{
                                                    backgroundImage: 'url("' + urlOutput + '")',
                                                    backgroundSize: ('card' === style ? mediaStyles[0].backgroundSize : undefined),
                                                    borderRadius: mediaStyles[0].borderRadius + 'px',
                                                }}
                                                className={'kt-testimonial-image'}
                                                onClick={open}
                                            />
                                        </Tooltip>
                                    )}
                                />
                                <Button
                                    label={__('Remove Image', 'kadence-blocks')}
                                    className={'kt-remove-img kt-testimonial-remove-image'}
                                    onClick={() => {
                                        setAttributes({
                                            id: null,
                                            url: null,
                                            alt: null,
                                            subtype: null,
                                            sizes: null,
                                        });
                                    }}
                                    icon={closeSmall}
                                    showTooltip={true}
                                />
                            </>
                        )}
                        {'icon' !== media && !url && (
                            <Fragment>
                                {'card' === style && (
                                    <KadenceMediaPlaceholder
                                        onSelect={media => {
                                            setAttributes({
                                                id: media.id,
                                                url: media.url,
                                                alt: media.alt,
                                                sizes: media.sizes,
                                                subtype: media.subtype,
                                            });
                                        }}
                                        value={''}
                                        allowedTypes={ALLOWED_MEDIA_TYPES}
                                        onSelectURL={(media) => {
                                            if (media !== url) {
                                                setAttributes({
                                                    id: null,
                                                    url: media,
                                                    alt: null,
                                                    sizes: null,
                                                    subtype: null,
                                                });
                                            }
                                        }}
                                        accept="image/*"
                                        className={'kadence-image-upload'}
                                    />
                                )}
                                {'card' !== style && (
                                    <MediaUpload
                                        onSelect={(media) => {
                                            setAttributes({
                                                id: media.id,
                                                url: media.url,
                                                alt: media.alt,
                                                sizes: media.sizes,
                                                subtype: media.subtype,
                                            });
                                        }}
                                        type="image"
                                        value={''}
                                        allowedTypes={ALLOWED_MEDIA_TYPES}
                                        render={({open}) => (
                                            <Button
                                                className="kt-testimonial-image-placeholder"
                                                aria-label={__('Add Image', 'kadence-blocks')}
                                                icon={image}
                                                style={{
                                                    borderRadius: mediaStyles[0].borderRadius + 'px',
                                                }}
                                                onClick={open}
                                            />
                                        )}
                                    />
                                )}
                            </Fragment>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderTestimonialPreview = (isCarousel = false) => {
        let iconPadding = (displayIcon && iconStyles[0].icon && iconStyles[0].margin && iconStyles[0].margin[0] && (iconStyles[0].margin[0] < 0) ? Math.abs(iconStyles[0].margin[0]) + 'px' : undefined);
        if (iconPadding === undefined && iconStyles[0].icon && iconStyles[0].margin && iconStyles[0].margin[0] && (iconStyles[0].margin[0] >= 0)) {
            iconPadding = '0px';
        }

        return (
            <div
                className={`kt-testimonial-item-wrap kt-testimonial-item-${uniqueID}${(containerVAlign ? ' testimonial-valign-' + containerVAlign : '')}`}
                style={('bubble' !== style && 'inlineimage' !== style ? containerStyles : {
                    maxWidth: containerMaxWidth + 'px',
                    minHeight: (previewContainerMinHeight ? previewContainerMinHeight + 'px' : undefined),
                    paddingTop: (iconPadding ? iconPadding : undefined),
                    marginTop: isCarousel && previewWrapperPaddingTop ? previewWrapperPaddingTop + (wrapperPaddingType ? wrapperPaddingType : 'px') : undefined,
                    marginBottom: isCarousel && previewWrapperPaddingBottom ? previewWrapperPaddingBottom + (wrapperPaddingType ? wrapperPaddingType : 'px') : undefined,
                })}>
                {/*{itemCount > 1 && (*/}
                {/*    <div className="kt-testimonial-item__move-menu">*/}
                {/*        <Button*/}
                {/*            icon="arrow-left"*/}
                {/*            onClick={() => {*/}
                {/*                0 === index ? undefined : onMoveBackward(index)*/}
                {/*            }}*/}
                {/*            className="kt-testimonial-item__move-backward"*/}
                {/*            aria-label={__('Move Testimonial Backward', 'kadence-blocks')}*/}
                {/*            aria-disabled={0 === index}*/}
                {/*        />*/}
                {/*        <Button*/}
                {/*            icon="arrow-right"*/}
                {/*            onClick={() => {*/}
                {/*                itemCount === (index + 1) ? undefined : onMoveForward(index)*/}
                {/*            }}*/}
                {/*            className="kt-testimonial-item__move-forward"*/}
                {/*            aria-label={__('Move Testimonial Forward', 'kadence-blocks')}*/}
                {/*            aria-disabled={itemCount === (index + 1)}*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*)}*/}
                <div className="kt-testimonial-text-wrap"
                     style={('bubble' === style || 'inlineimage' === style ? containerStyles : undefined)}>
                    {displayIcon && iconStyles[0].icon && 'card' !== style && (
                        renderTestimonialIcon()
                    )}
                    {displayMedia && ('card' === style || 'inlineimage' === style) && (
                        renderTestimonialMedia()
                    )}
                    {displayIcon && iconStyles[0].icon && 'card' === style && (
                        renderTestimonialIcon()
                    )}
                    {displayTitle && (
                        <div className="kt-testimonial-title-wrap" style={{
                            minHeight: (previewTitleMinHeight ? previewTitleMinHeight + 'px' : undefined),
                        }}>
                            <RichText
                                tagName={'h' + titleFont[0].level}
                                value={title}
                                onChange={value => {
                                    setAttributes({title: value});
                                }}
                                placeholder={__('Best product I have ever used!', 'kadence-blocks')}
                                style={{
                                    fontWeight: titleFont[0].weight,
                                    fontStyle: titleFont[0].style,
                                    color: KadenceColorOutput(titleFont[0].color),
                                    fontSize: previewTitleFont ? previewTitleFont + previewTitleFontSizeType : undefined,
                                    lineHeight: (previewTitleLineHeight ? previewTitleLineHeight + previewTitleLineHeightLineType : undefined),
                                    letterSpacing: titleFont[0].letterSpacing + 'px',
                                    textTransform: (titleFont[0].textTransform ? titleFont[0].textTransform : undefined),
                                    fontFamily: (titleFont[0].family ? titleFont[0].family : ''),
                                    padding: (titleFont[0].padding ? titleFont[0].padding[0] + 'px ' + titleFont[0].padding[1] + 'px ' + titleFont[0].padding[2] + 'px ' + titleFont[0].padding[3] + 'px' : ''),
                                    margin: (titleFont[0].margin ? titleFont[0].margin[0] + 'px ' + titleFont[0].margin[1] + 'px ' + titleFont[0].margin[2] + 'px ' + titleFont[0].margin[3] + 'px' : ''),
                                }}
                                className={'kt-testimonial-title'}
                            />
                        </div>
                    )}
                    {displayRating && (
                        <div
                            className={`kt-testimonial-rating-wrap kt-testimonial-rating-${rating}`}
                            style={{
                                margin: (ratingStyles[0].margin ? ratingStyles[0].margin[0] + 'px ' + ratingStyles[0].margin[1] + 'px ' + ratingStyles[0].margin[2] + 'px ' + ratingStyles[0].margin[3] + 'px' : ''),
                            }}>
                            <IconRender className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1'}
                                        name={'fas_star'} size={ratingStyles[0].size}
                                        style={{color: KadenceColorOutput(ratingStyles[0].color)}}/>
                            {rating > 1 && (
                                <IconRender
                                    className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2'}
                                    name={'fas_star'} size={ratingStyles[0].size}
                                    style={{color: KadenceColorOutput(ratingStyles[0].color)}}/>
                            )}
                            {rating > 2 && (
                                <IconRender
                                    className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3'}
                                    name={'fas_star'} size={ratingStyles[0].size}
                                    style={{color: KadenceColorOutput(ratingStyles[0].color)}}/>
                            )}
                            {rating > 3 && (
                                <IconRender
                                    className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4'}
                                    name={'fas_star'} size={ratingStyles[0].size}
                                    style={{color: KadenceColorOutput(ratingStyles[0].color)}}/>
                            )}
                            {rating > 4 && (
                                <IconRender
                                    className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5'}
                                    name={'fas_star'} size={ratingStyles[0].size}
                                    style={{color: KadenceColorOutput(ratingStyles[0].color)}}/>
                            )}
                        </div>
                    )}
                    {displayContent && (
                        <div className="kt-testimonial-content-wrap" style={{
                            minHeight: (previewContentMinHeight ? previewContentMinHeight + 'px' : undefined),
                        }}>
                            <RichText
                                tagName={'div'}
                                placeholder={__('I have been looking for a product like this for years. I have tried everything and nothing did what I wanted until using this product. I am so glad I found it!', 'kadence-blocks')}
                                value={content}
                                onChange={value => {
                                    setAttributes({content: value});
                                }}
                                style={{
                                    fontWeight: contentFont[0].weight,
                                    fontStyle: contentFont[0].style,
                                    color: KadenceColorOutput(contentFont[0].color),
                                    fontSize: previewContentFont ? previewContentFont + previewContentFontSizeType : undefined,
                                    lineHeight: (previewContentLineHeight ? previewContentLineHeight + previewContentLineHeightLineType : undefined),
                                    textTransform: (contentFont[0].textTransform ? contentFont[0].textTransform : undefined),
                                    letterSpacing: contentFont[0].letterSpacing + 'px',
                                    fontFamily: (contentFont[0].family ? contentFont[0].family : ''),
                                }}
                                className={'kt-testimonial-content'}
                            />
                        </div>
                    )}
                </div>
                {((displayMedia && ('card' !== style && 'inlineimage' !== style)) || displayOccupation || displayName) && (
                    <div className="kt-testimonial-meta-wrap">
                        {displayMedia && ('card' !== style && 'inlineimage' !== style) && (
                            renderTestimonialMedia()
                        )}
                        <div className="kt-testimonial-meta-name-wrap">
                            {displayName && (
                                <div className="kt-testimonial-name-wrap">
                                    <RichText
                                        tagName={'div'}
                                        placeholder={__('Sophia Reily', 'kadence-blocks')}
                                        value={name}
                                        onChange={value => {
                                            setAttributes({name: value});
                                        }}
                                        style={{
                                            fontWeight: nameFont[0].weight,
                                            fontStyle: nameFont[0].style,
                                            color: KadenceColorOutput(nameFont[0].color),
                                            fontSize: ( previewNameFont ? previewNameFont + previewNameFontType : undefined ),
                                            lineHeight: (previewNameLineHeight ? previewNameLineHeight + previewNameLineHeightType : undefined),
                                            textTransform: (nameFont[0].textTransform ? nameFont[0].textTransform : undefined),
                                            letterSpacing: nameFont[0].letterSpacing + 'px',
                                            fontFamily: (nameFont[0].family ? nameFont[0].family : ''),
                                        }}
                                        className={'kt-testimonial-name'}
                                    />
                                </div>
                            )}
                            {displayOccupation && (
                                <div className="kt-testimonial-occupation-wrap">
                                    <RichText
                                        tagName={'div'}
                                        placeholder={__('CEO of Company', 'kadence-blocks')}
                                        value={occupation}
                                        onChange={value => {
                                            setAttributes({occupation: value});
                                        }}
                                        style={{
                                            fontWeight: occupationFont[0].weight,
                                            fontStyle: occupationFont[0].style,
                                            color: KadenceColorOutput(occupationFont[0].color),
                                            fontSize: previewOccupationFont ? previewOccupationFont + previewOccupationFontSizeType : undefined,
                                            lineHeight: (previewOccupationLineHeight ? previewOccupationLineHeight + previewOccupationLineHeightLineType : undefined),
                                            textTransform: (occupationFont[0].textTransform ? occupationFont[0].textTransform : undefined),
                                            letterSpacing: occupationFont[0].letterSpacing + 'px',
                                            fontFamily: (occupationFont[0].family ? occupationFont[0].family : ''),
                                        }}
                                        className={'kt-testimonial-occupation'}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div {...blockProps}>
            {showSettings('allSettings') && (
                <Fragment>
                    <InspectorControls>

                        <InspectorControlTabs
                            panelName={'icon'}
                            allowedTabs={[ 'general', 'advanced' ]}
                            setActiveTab={(value) => setActiveTab(value)}
                            activeTab={activeTab}
                        />

                        {(activeTab === 'general') &&

                            <>

                                {showSettings('individualSettings', 'kadence/testimonials') && (
                                    <KadencePanelBody
                                        title={__('Individual Settings', 'kadence-blocks')}
                                        initialOpen={true}
                                        panelName={'kb-testimonials-individual-settings'}
                                    >
                                        {renderTestimonialSettings()}
                                    </KadencePanelBody>
                                )}

                            </>
                        }

                        {( activeTab === 'advanced') && (
                            <>
                                <KadenceBlockDefaults attributes={attributes} defaultAttributes={metadata['attributes']} blockSlug={ 'kadence/testimonials' } excludedAttrs={ [ 'url', 'media', 'title', 'content' ] } />
                            </>
                        )}

                    </InspectorControls>
                </Fragment>
            )}

            <Fragment {...blockProps}>
                { layout === 'carousel' && (
                    <div className={'kt-blocks-testimonial-carousel-item'}>
                        { renderTestimonialPreview( true ) }
                    </div>
                ) }

                { layout !== 'carousel' && (
                    renderTestimonialPreview()
                ) }
            </Fragment>
        </div>
    );
}

export default KadenceTestimonials;
