/**
 * BLOCK: Kadence Icon
 */

/**
 * Import Icons
 */
import {alignTopIcon, alignMiddleIcon, alignBottomIcon} from '@kadence/icons';

/**
 * Import Externals
 */
import {times, filter, map, get} from 'lodash';
/**
 * Import Kadence Components
 */
import {
    KadenceColorOutput,
    showSettings,
    getPreviewSize,
    mouseOverVisualizer,
    getSpacingOptionOutput
} from '@kadence/helpers';

import {
    WebfontLoader,
    PopColorControl,
    StepControls,
    TypographyControls,
    KadenceIconPicker,
    ResponsiveRangeControls,
    IconRender,
    KadencePanelBody,
    URLInputControl,
    DynamicTextControl,
    MeasurementControls,
    InspectorControlTabs,
    KadenceBlockDefaults,
    ResponsiveMeasureRangeControl,
    SpacingVisualizer,
} from '@kadence/components';

import metadata from './block.json';

/**
 * Internal block libraries
 */
import {__} from '@wordpress/i18n';
import {useBlockProps} from '@wordpress/block-editor';
import {createBlock} from '@wordpress/blocks';

import {
    InspectorControls,
    RichText,
    BlockControls
} from '@wordpress/block-editor';

import {
    useEffect,
    useState,
    Fragment,
} from '@wordpress/element';

import {
    RangeControl,
    ButtonGroup,
    Tooltip,
    Button,
    SelectControl,
    Toolbar,
    ToolbarButton
} from '@wordpress/components';

import {compose} from '@wordpress/compose';
import {withDispatch, withSelect} from '@wordpress/data';
import {formatIndent, formatOutdent} from "@wordpress/icons";

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const kticonlistUniqueIDs = [];

function KadenceListItem({attributes, className, setAttributes, clientId, onReplace, onRemove, mergeBlocks}) {

    const {
        icon,
        link,
        target,
        size,
        width,
        text,
        color,
        background,
        border,
        borderRadius,
        padding,
        borderWidth,
        style,
        level
    } = attributes;
    const index = 0;


    const iconAlignOptions = [
        {key: 'top', name: __('Top', 'kadence-blocks'), icon: alignTopIcon},
        {key: 'middle', name: __('Middle', 'kadence-blocks'), icon: alignMiddleIcon},
        {key: 'bottom', name: __('Bottom', 'kadence-blocks'), icon: alignBottomIcon},
    ];

    const blockProps = useBlockProps({
        className: className
    });


    const onMoveLeft = () => {
        let newLevel = level - 1;

        setAttributes({level: Math.max(newLevel, 0)});
    }

    const onMoveRight = () => {
        setAttributes({level: (level + 1)});
    }

    return (
        <div {...blockProps}>
            <BlockControls>
                <Toolbar>

                    <ToolbarButton
                        icon={formatOutdent}
                        title={__('Outdent')}
                        describedBy={__('Outdent list item')}
                        disabled={level === 0}
                        onClick={() => onMoveLeft()}
                    />
                    <ToolbarButton
                        icon={formatIndent}
                        title={__('Indent')}
                        describedBy={__('Indent list item')}
                        isDisabled={level === 5}
                        onClick={() => onMoveRight()}
                    />

                </Toolbar>
            </BlockControls>
            <InspectorControls>
                <KadencePanelBody
                    title={__('Item', 'kadence-blocks') + ' ' + __('Settings', 'kadence-blocks')}
                    initialOpen={true}
                    panelName={'kb-icon-item'}
                >
                    <URLInputControl
                        label={__('Link', 'kadence-blocks')}
                        url={link}
                        onChangeUrl={value => {
                            setAttributes({link: value});
                        }}
                        additionalControls={true}
                        opensInNewTab={(target && '_blank' == target ? true : false)}
                        onChangeTarget={value => {
                            if (value) {
                                setAttributes({target: '_blank'});
                            } else {
                                setAttributes({target: '_self'});
                            }
                        }}
                        dynamicAttribute={'items:' + index + ':link'}
                        allowClear={true}
                        {...attributes}
                    />
                    <KadenceIconPicker
                        value={icon}
                        onChange={value => {
                            setAttributes({icon: value});
                        }}
                    />
                    <RangeControl
                        label={__('Icon Size')}
                        value={size}
                        onChange={value => {
                            setAttributes({size: value});
                        }}
                        min={5}
                        max={250}
                    />
                    {icon && 'fe' === icon.substring(0, 2) && (
                        <RangeControl
                            label={__('Line Width')}
                            value={width}
                            onChange={value => {
                                setAttributes({width: value});
                            }}
                            step={0.5}
                            min={0.5}
                            max={4}
                        />
                    )}
                    <PopColorControl
                        label={__('Icon Color')}
                        value={(color ? color : '')}
                        default={''}
                        onChange={value => {
                            setAttributes({color: value});
                        }}
                    />
                    <SelectControl
                        label={__('Icon Style')}
                        value={style}
                        options={[
                            {value: 'default', label: __('Default')},
                            {value: 'stacked', label: __('Stacked')},
                        ]}
                        onChange={value => {
                            setAttributes({style: value});
                        }}
                    />
                    {style !== 'default' && (
                        <PopColorControl
                            label={__('Icon Background')}
                            value={(background ? background : '')}
                            default={''}
                            onChange={value => {
                                setAttributes({background: value});
                            }}
                        />
                    )}
                    {style !== 'default' && (
                        <PopColorControl
                            label={__('Border Color')}
                            value={(border ? border : '')}
                            default={''}
                            onChange={value => {
                                setAttributes({border: value});
                            }}
                        />
                    )}
                    {style !== 'default' && (
                        <RangeControl
                            label={__('Border Size (px)')}
                            value={borderWidth}
                            onChange={value => {
                                setAttributes({borderWidth: value});
                            }}
                            min={0}
                            max={20}
                        />
                    )}
                    {style !== 'default' && (
                        <RangeControl
                            label={__('Border Radius (%)')}
                            value={borderRadius}
                            onChange={value => {
                                setAttributes({borderRadius: value});
                            }}
                            min={0}
                            max={50}
                        />
                    )}
                    {style !== 'default' && (
                        <RangeControl
                            label={__('Padding (px)')}
                            value={padding}
                            onChange={value => {
                                setAttributes({padding: value});
                            }}
                            min={0}
                            max={180}
                        />
                    )}
                </KadencePanelBody>
            </InspectorControls>

            <div
                className={`kt-svg-icon-list-style-${style} kt-svg-icon-list-item-wrap kt-svg-icon-list-item-0 kt-svg-icon-list-level-${level}`}>
                {icon && (
                    <IconRender className={`kt-svg-icon-list-single kt-svg-icon-list-single-${icon}`} name={icon}
                                size={size}
                                strokeWidth={('fe' === icon.substring(0, 2) ? width : undefined)} style={{
                        color: (color ? KadenceColorOutput(color) : undefined),
                        backgroundColor: (background && style !== 'default' ? KadenceColorOutput(background) : undefined),
                        padding: (padding && style !== 'default' ? padding + 'px' : undefined),
                        borderColor: (border && style !== 'default' ? KadenceColorOutput(border) : undefined),
                        borderWidth: (borderWidth && style !== 'default' ? borderWidth + 'px' : undefined),
                        borderRadius: (borderRadius && style !== 'default' ? borderRadius + '%' : undefined),
                    }}/>
                )}

                <RichText
                    tagName="div"
                    value={text}
                    onChange={value => {
                        setAttributes({text: value});
                    }}
                    onSplit={(value, isOriginal) => {
                        let newAttributes;

                        if (isOriginal || value) {
                            newAttributes = {...attributes};
                        }

                        const block = createBlock('kadence/listitem', newAttributes);

                        if (isOriginal) {
                            block.clientId = clientId;
                        }

                        return block;
                    }}
                    onMerge={mergeBlocks}
                    onRemove={onRemove}
                    onReplace={onReplace}
                    className={'kt-svg-icon-list-text'}
                    data-empty={text ? false : true}
                />
            </div>

        </div>
    );
}

export default compose([])(KadenceListItem);
