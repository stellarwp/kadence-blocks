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
    getSpacingOptionOutput,
	setBlockDefaults,
	getUniqueId,
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
    BlockControls,
    store as blockEditorStore,
} from '@wordpress/block-editor';

import {
    useEffect,
    useState,
    useRef,
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
import { useSelect, useDispatch } from '@wordpress/data';
import {formatIndent, formatOutdent} from "@wordpress/icons";
/**
 * Internal dependencies
 */
import useMerge from './merge';

function KadenceListItem({attributes, className, setAttributes, clientId, onReplace, onRemove, mergeBlocks, context}) {

    const {
        uniqueID,
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
    const displayIcon = icon ? icon : context['kadence/listIcon'];
    const displayWidth = width ? width : context['kadence/listIconWidth'];
    const [ activeTab, setActiveTab ] = useState( 'general' );
    const onMerge = useMerge( clientId, mergeBlocks );
    const { addUniqueID } = useDispatch( 'kadenceblocks/data' );
    // const useEnterRef = useEnter( { content, clientId } );
	// const useSpaceRef = useSpace( clientId );
    const textRef = useRef( clientId );
	const { isUniqueID, isUniqueBlock, previewDevice } = useSelect(
		( select ) => {
			return {
				isUniqueID: ( value ) => select( 'kadenceblocks/data' ).isUniqueID( value ),
				isUniqueBlock: ( value, clientId ) => select( 'kadenceblocks/data' ).isUniqueBlock( value, clientId ),
				previewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
			};
		},
		[ clientId ]
	);
	useEffect( () => {
		setBlockDefaults( 'kadence/listitem', attributes);

		let uniqueId = getUniqueId( uniqueID, clientId, isUniqueID, isUniqueBlock );
		setAttributes( { uniqueID: uniqueId } );
		addUniqueID( uniqueId, clientId );
	}, [] );

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
                        title={__('Outdent', 'kadence-blocks')}
                        describedBy={__('Outdent list item', 'kadence-blocks')}
                        disabled={level === 0}
                        onClick={() => onMoveLeft()}
                    />
                    <ToolbarButton
                        icon={formatIndent}
                        title={__('Indent', 'kadence-blocks')}
                        describedBy={__('Indent list item', 'kadence-blocks')}
                        isDisabled={level === 5}
                        onClick={() => onMoveRight()}
                    />

                </Toolbar>
            </BlockControls>
            <InspectorControls>
                <InspectorControlTabs
                    panelName={ 'listitem' }
                    setActiveTab={ ( value ) => setActiveTab( value ) }
                    activeTab={ activeTab }
                />
                { activeTab === 'general' && (
                    <KadencePanelBody
                        title={__('Item Settings', 'kadence-blocks')}
                        initialOpen={true}
                        panelName={'kb-icon-item-settings'}
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
                            dynamicAttribute={'link'}
                            allowClear={true}
                            {...attributes}
                        />
                        <KadenceIconPicker
                            value={icon}
                            onChange={value => {
                                setAttributes({icon: value});
                            }}
                            allowClear={ true }
							placeholder={ __( 'Select Icon', 'kadence-blocks' ) }
                        />
                    </KadencePanelBody>
                ) }
                { activeTab === 'style' && (
                    <KadencePanelBody
                        title={__('Style', 'kadence-blocks')}
                        initialOpen={true}
                        panelName={'kb-icon-item'}
                    >
                        <RangeControl
                            label={__('Icon Size', 'kadence-blocks')}
                            value={size}
                            onChange={value => {
                                setAttributes({size: value});
                            }}
                            min={5}
                            max={250}
                        />
                        {displayIcon && 'fe' === displayIcon.substring(0, 2) && (
                            <RangeControl
                                label={__('Line Width', 'kadence-blocks')}
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
                            label={__('Icon Color', 'kadence-blocks')}
                            value={(color ? color : '')}
                            default={''}
                            onChange={value => {
                                setAttributes({color: value});
                            }}
                        />
                        <SelectControl
                            label={__('Icon Style', 'kadence-blocks')}
                            value={style}
                            options={[
                                { value: '', label: __( 'Inherit', 'kadence-blocks' ) },
                                { value: 'default', label: __( 'Default', 'kadence-blocks' ) },
                                { value: 'stacked', label: __( 'Stacked', 'kadence-blocks' ) },
                            ]}
                            onChange={value => {
                                setAttributes({style: value});
                            }}
                        />
                        {style === 'stacked' && (
                            <PopColorControl
                                label={ __( 'Icon Background', 'kadence-blocks' ) }
                                value={ ( background ? background : '' ) }
                                default={ '' }
                                onChange={ value => {
                                    setAttributes( { background: value } );
                                } }
                            />
                        )}
                        {style === 'stacked' && (
                            <PopColorControl
                                label={ __( 'Border Color', 'kadence-blocks' ) }
                                value={ ( border ? border : '' ) }
                                default={''}
                                onChange={ value => {
                                    setAttributes( { border: value } );
                                } }
                            />
                        )}
                        {style === 'stacked' && (
                            <RangeControl
                                label={ __( 'Border Size (px)', 'kadence-blocks' ) }
                                value={borderWidth}
                                onChange={value => {
                                    setAttributes({ borderWidth: value });
                                }}
                                min={0}
                                max={20}
                            />
                        )}
                        {style === 'stacked' && (
                            <RangeControl
                                label={ __( 'Border Radius (%)', 'kadence-blocks' ) }
                                value={borderRadius}
                                onChange={value => {
                                    setAttributes({ borderRadius: value });
                                }}
                                min={0}
                                max={50}
                            />
                        )}
                        {style === 'stacked' && (
                            <RangeControl
                                label={ __( 'Padding (px)', 'kadence-blocks' ) }
                                value={ padding }
                                onChange={ value => {
                                    setAttributes( { padding: value } );
                                } }
                                min={0}
                                max={180}
                            />
                        )}
                    </KadencePanelBody>
                )}
            </InspectorControls>

            <div
                className={`kt-svg-icon-list-item-wrap kt-svg-icon-list-item-0 kt-svg-icon-list-level-${level}${ style ? ' kt-svg-icon-list-style-' + style : '' }`}>
                {displayIcon && (
                    <IconRender
                        className={`kt-svg-icon-list-single kt-svg-icon-list-single-${displayIcon}`}
                        name={displayIcon}
                        size={ size ? size : '1em' }
                        strokeWidth={('fe' === displayIcon.substring(0, 2) ? displayWidth : undefined)}
                        style={ {
                            color: (color ? KadenceColorOutput(color) : undefined),
                            backgroundColor: (background && style === 'stacked' ? KadenceColorOutput(background) : undefined),
                            padding: (padding && style === 'stacked' ? padding + 'px' : undefined),
                            borderColor: (border && style === 'stacked' ? KadenceColorOutput(border) : undefined),
                            borderWidth: (borderWidth && style === 'stacked' ? borderWidth + 'px' : undefined),
                            borderRadius: (borderRadius && style === 'stacked' ? borderRadius + '%' : undefined),
                        } }
                    />
                )}

                <RichText
                    tagName="div"
                    ref={ textRef }
					identifier="text"
                    value={text}
                    onChange={value => {
                        setAttributes({text: value});
                    }}
                    onSplit={(value, isOriginal) => {
                        let newAttributes;
                        newAttributes = {...attributes};
                        newAttributes.text = value;
                        if (! isOriginal ) {
                            newAttributes.uniqueID = '';
                            newAttributes.link = '';
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

export default KadenceListItem;
