/**
 * BLOCK: Kadence Icon
 */

/**
 * Import Kadence Components
 */
import {
    KadenceColorOutput,
	setBlockDefaults,
	getUniqueId,
	getPostOrFseId
} from '@kadence/helpers';

import {
    PopColorControl,
    KadenceIconPicker,
    IconRender,
    KadencePanelBody,
    URLInputControl,
    InspectorControlTabs,
    SelectParentBlock,
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
    useRef
} from '@wordpress/element';

import {
    RangeControl,
    ToggleControl,
    SelectControl,
    ToolbarGroup,
    ToolbarButton
} from '@wordpress/components';

import { useSelect, useDispatch } from '@wordpress/data';
import {formatIndent, formatOutdent} from "@wordpress/icons";

function KadenceListItem( props ) {
	const {attributes, className, setAttributes, clientId, isSelected, name, onReplace, onRemove, mergeBlocks, context} = props;
    const {
        uniqueID,
        icon,
        link,
		linkNoFollow,
		linkSponsored,
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
        level,
		showIcon
    } = attributes;
    const displayIcon = icon ? icon : context['kadence/listIcon'];
    const displayWidth = width ? width : context['kadence/listIconWidth'];
    const [ activeTab, setActiveTab ] = useState( 'general' );
    const { addUniqueID } = useDispatch( 'kadenceblocks/data' );

    const textRef = useRef( clientId );
	const { isUniqueID, isUniqueBlock, parentData } = useSelect(
		( select ) => {
			return {
				isUniqueID: ( value ) => select( 'kadenceblocks/data' ).isUniqueID( value ),
				isUniqueBlock: ( value, clientId ) => select( 'kadenceblocks/data' ).isUniqueBlock( value, clientId ),
				parentData: {
					rootBlock: select( 'core/block-editor' ).getBlock( select( 'core/block-editor' ).getBlockHierarchyRootClientId( clientId ) ),
					postId: select( 'core/editor' ).getCurrentPostId(),
					reusableParent: select('core/block-editor').getBlockAttributes( select('core/block-editor').getBlockParentsByBlockName( clientId, 'core/block' ).slice(-1)[0] ),
					editedPostId: select( 'core/edit-site' ) ? select( 'core/edit-site' ).getEditedPostId() : false
				}
			};
		},
		[ clientId ]
	);
	useEffect( () => {
		setBlockDefaults( 'kadence/listitem', attributes );

		const postOrFseId = getPostOrFseId( props, parentData );
		let uniqueId = getUniqueId( uniqueID, clientId, isUniqueID, isUniqueBlock, postOrFseId );
		if ( uniqueId !== uniqueID ) {
			attributes.uniqueID = uniqueId;
			setAttributes( { uniqueID: uniqueId } );
			addUniqueID( uniqueId, clientId );
		} else {
			addUniqueID( uniqueID, clientId );
		}
	}, [] );

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
                <ToolbarGroup group="add-indent">

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

                </ToolbarGroup>
            </BlockControls>
            <InspectorControls>
                <SelectParentBlock
                    clientId={ clientId }
                />
                <InspectorControlTabs
                    panelName={ 'listitem' }
                    setActiveTab={ ( value ) => setActiveTab( value ) }
                    activeTab={ activeTab }
                />
                { activeTab === 'general' && (
                    <KadencePanelBody
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
							linkNoFollow={( undefined !== linkNoFollow ? linkNoFollow : false )}
							onChangeFollow={value => setAttributes( { linkNoFollow: value } )}
							linkSponsored={( undefined !== linkSponsored ? linkSponsored : false )}
							onChangeSponsored={value => setAttributes( { linkSponsored: value } )}
							dynamicAttribute={'link'}
                            allowClear={true}
                            isSelected={ isSelected }
                            attributes={ attributes }
                            setAttributes={ setAttributes }
                            name={ name }
                            clientId={ clientId }
                            context={ context }
                        />

						<ToggleControl
							label={ __( 'Hide icon', 'kadence-blocks' ) }
							checked={ !showIcon }
							onChange={ ( value ) => { setAttributes( { showIcon: !value } ); } }
						/>

						{ showIcon && (
							<KadenceIconPicker
								value={icon}
								onChange={value => {
									setAttributes({icon: value});
								}}
								allowClear={ true }
								placeholder={ __( 'Select Icon', 'kadence-blocks' ) }
							/>
						) }
                    </KadencePanelBody>
                ) }
                { activeTab === 'style' && (
                    <KadencePanelBody
                        initialOpen={true}
                        panelName={'kb-icon-item'}
                    >
                        <RangeControl
                            label={__('Icon Size', 'kadence-blocks')}
                            value={size}
                            onChange={value => {
                                setAttributes({size: value});
                            }}
                            min={0}
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
                {displayIcon && showIcon && (
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

				{!showIcon && size !== 0 && (
					<div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }} className={'kt-svg-icon-list-single'}>
						<svg style={{ display: 'inline-block', verticalAlign: 'middle' }} viewBox={'0 0 24 24'} height={ size ? size : '1em' } width={ size ? size : '1em' } fill={ 'none' }
							 stroke={ displayWidth }
							 preserveAspectRatio={( true ? 'xMinYMin meet' : undefined )}
							 stroke-width={ displayWidth }>
						</svg>
					</div>
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
                    data-empty={ !text }
                />
            </div>
        </div>
    );
}

export default KadenceListItem;
