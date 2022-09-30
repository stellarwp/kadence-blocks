import {
    TypographyControls,
    MeasurementControls,
    PopColorControl,
    ResponsiveMeasurementControls,
    ResponsiveRangeControls,
    BoxShadowControl
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
import {tableOfContentsIcon} from '@kadence/icons';
import FontIconPicker from "@fonticonpicker/react-fonticonpicker";

function KadenceTableOfContents(props) {

    const blockSlug = 'kadence/table-of-contents';
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
            createErrorNotice(__('Table of Contents block defaults saved!', 'kadence-blocks'), {
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

    const saveAllowedHeaders = (value) => {
        const config = configuration;

        if (!has(config, [blockSlug])) {
            config[blockSlug] = {};
        }

        if (!has(config, [blockSlug, 'allowedHeaders', 0])) {
            config[blockSlug].allowedHeaders = [
                {
                    "h1": true,
                    "h2": true,
                    "h3": true,
                    "h4": true,
                    "h5": true,
                    "h6": true
                }
            ];
        }

        config[blockSlug].allowedHeaders[0] = {...config[blockSlug].allowedHeaders[0], ...value};

        saveConfigState('allowedHeaders', config[blockSlug].allowedHeaders);

    };

    const saveShadow = ( value ) => {
        const config = configuration;

        if (!has(config, [blockSlug])) {
            config[blockSlug] = {};
        }

        if (!has(config, [blockSlug, 'shadow', 0])) {
            config[blockSlug].shadow = [
                {
                    "color": "#000000",
                    "opacity": 0.2,
                    "spread": 0,
                    "blur": 14,
                    "hOffset": 0,
                    "vOffset": 0,
                    "inset": false
                }
            ];
        }

        config[blockSlug].shadow[0] = {...config[blockSlug].shadow[0], ...value};

        saveConfigState('shadow', config[blockSlug].shadow);


    };

    const setAttributes = ( valueObj ) => {
        Object.keys( valueObj ).forEach( ( key ) => {
            saveConfigState( key, valueObj[ key ] );
        });
    }

    const allowedHeaders = get(configuration, [blockSlug, 'allowedHeaders'], [
        {
            "h1": true,
            "h2": true,
            "h3": true,
            "h4": true,
            "h5": true,
            "h6": true
        }
    ]);
    const enableTitle = get(configuration, [blockSlug, 'enableTitle'], true);
    const titleColor = get(configuration, [blockSlug, 'titleColor'], '');
    const titleSize = get(configuration, [blockSlug, 'titleSize'], ['', '', '']);
    const titleSizeType = get(configuration, [blockSlug, 'titleSizeType'], 'px');
    const titleLineHeight = get(configuration, [blockSlug, 'titleLineHeight'], ['', '', '']);
    const titleLineType = get(configuration, [blockSlug, 'titleLineType'], 'px');
    const titleLetterSpacing = get(configuration, [blockSlug, 'titleLetterSpacing'], 0);
    const titleTypography = get(configuration, [blockSlug, 'titleTypography'], '');
    const titleGoogleFont = get(configuration, [blockSlug, 'titleGoogleFont'], false);
    const titleLoadGoogleFont = get(configuration, [blockSlug, 'titleLoadGoogleFont'], true);
    const titleFontVariant = get(configuration, [blockSlug, 'titleFontVariant'], '');
    const titleFontWeight = get(configuration, [blockSlug, 'titleFontWeight'], '');
    const titleFontSubset = get(configuration, [blockSlug, 'titleFontSubset'], '');
    const titleFontStyle = get(configuration, [blockSlug, 'titleFontStyle'], '');
    const titlePadding = get(configuration, [blockSlug, 'titlePadding'], [0, 0, 0, 0]);
    const titleTextTransform = get(configuration, [blockSlug, 'titleTextTransform'], '');
    const titleBorder = get(configuration, [blockSlug, 'titleBorder'], [0, 0, 0, 0]);
    const titleBorderColor = get(configuration, [blockSlug, 'titleBorderColor'], '');
    const titleCollapseBorderColor = get(configuration, [blockSlug, 'titleCollapseBorderColor'], '');

    const listGap = get(configuration, [blockSlug, 'listGap'], ['', '', '' ]);
    const contentColor = get(configuration, [blockSlug, 'contentColor'], '');
    const contentHoverColor = get(configuration, [blockSlug, 'contentHoverColor'], '');
    const linkStyle = get(configuration, [blockSlug, 'linkStyle'], 'underline');

    const contentSize = get(configuration, [blockSlug, 'contentSize'], ['', '', '']);
    const contentSizeType = get(configuration, [blockSlug, 'contentSizeType'], 'px');
    const contentLineHeight = get(configuration, [blockSlug, 'contentLineHeight'], ['', '', '']);
    const contentLineType = get(configuration, [blockSlug, 'contentLineType'], 'px');
    const contentLetterSpacing = get(configuration, [blockSlug, 'contentLetterSpacing'], 0);
    const contentTypography = get(configuration, [blockSlug, 'contentTypography'], '');
    const contentGoogleFont = get(configuration, [blockSlug, 'contentGoogleFont'], false);
    const contentLoadGoogleFont = get(configuration, [blockSlug, 'contentLoadGoogleFont'], true);
    const contentFontVariant = get(configuration, [blockSlug, 'contentFontVariant'], '');
    const contentFontWeight = get(configuration, [blockSlug, 'contentFontWeight'], '');
    const contentFontSubset = get(configuration, [blockSlug, 'contentFontSubset'], '');
    const contentFontStyle = get(configuration, [blockSlug, 'contentFontStyle'], '');
    const contentTextTransform = get(configuration, [blockSlug, 'contentTextTransform'], '');
    const contentMargin = get(configuration, [blockSlug, 'contentMargin'], [0, 0, 0, 0]);

    const enableSmoothScroll = get(configuration, [blockSlug, 'enableSmoothScroll'], false);
    const smoothScrollOffset = get(configuration, [blockSlug, 'smoothScrollOffset'], 40);
    const enableScrollSpy = get(configuration, [blockSlug, 'enableScrollSpy'], false);
    const contentActiveColor = get(configuration, [blockSlug, 'contentActiveColor'], '');

    const containerBackground = get(configuration, [blockSlug, 'containerBackground'], '');
    const containerPadding = get(configuration, [blockSlug, 'containerPadding'], [0, 0, 0, 0]);
    const containerBorderColor = get(configuration, [blockSlug, 'containerBorderColor'], '');
    const containerBorder = get(configuration, [blockSlug, 'containerBorder'], [0, 0, 0, 0]);
    const borderRadius = get(configuration, [blockSlug, 'borderRadius'], [0, 0, 0, 0]);

    const displayShadow = get(configuration, [blockSlug, 'displayShadow'], false);
    const shadow = get(configuration, [blockSlug, 'shadow'], [
        {
            "color": "#000000",
            "opacity": 0.2,
            "spread": 0,
            "blur": 14,
            "hOffset": 0,
            "vOffset": 0,
            "inset": false
        }
    ]);

    const maxWidth = get(configuration, [blockSlug, 'maxWidth'], '');
    const containerMargin = get(configuration, [blockSlug, 'containerMargin'], [0, 0, 0, 0]);
    const containerTabletMargin = get(configuration, [blockSlug, 'containerTabletMargin'], [0, 0, 0, 0]);
    const containerMobileMargin = get(configuration, [blockSlug, 'containerMobileMargin'], [0, 0, 0, 0]);
    const containerMarginUnit = get(configuration, [blockSlug, 'containerMarginUnit'], 'px');

    return (
        <Fragment>
            <Button className="kt-block-defaults" onClick={() => setIsOpen(true)}>
                <span className="kt-block-icon">{tableOfContentsIcon}</span>
                {__('Table of Contents', 'kadence-blocks')}
            </Button>
            {isOpen && (
                <Modal
                    className="kt-block-defaults-modal"
                    title={__('Table of Contents', 'kadence-blocks')}
                    onRequestClose={() => {
                        saveConfig(configuration);
                    }}>

                    

                        <PanelBody
                            title={__('Allowed Headers', 'kadence-blocks')}
                            initialOpen={true}
                        >
                            <ToggleControl
                                label={'h1'}
                                checked={undefined !== allowedHeaders && undefined !== allowedHeaders[0] && undefined !== allowedHeaders[0].h1 ? allowedHeaders[0].h1 : true}
                                onChange={value => saveAllowedHeaders({h1: value})}
                            />
                            <ToggleControl
                                label={'h2'}
                                checked={undefined !== allowedHeaders && undefined !== allowedHeaders[0] && undefined !== allowedHeaders[0].h2 ? allowedHeaders[0].h2 : true}
                                onChange={value => saveAllowedHeaders({h2: value})}
                            />
                            <ToggleControl
                                label={'h3'}
                                checked={undefined !== allowedHeaders && undefined !== allowedHeaders[0] && undefined !== allowedHeaders[0].h3 ? allowedHeaders[0].h3 : true}
                                onChange={value => saveAllowedHeaders({h3: value})}
                            />
                            <ToggleControl
                                label={'h4'}
                                checked={undefined !== allowedHeaders && undefined !== allowedHeaders[0] && undefined !== allowedHeaders[0].h4 ? allowedHeaders[0].h4 : true}
                                onChange={value => saveAllowedHeaders({h4: value})}
                            />
                            <ToggleControl
                                label={'h5'}
                                checked={undefined !== allowedHeaders && undefined !== allowedHeaders[0] && undefined !== allowedHeaders[0].h5 ? allowedHeaders[0].h5 : true}
                                onChange={value => saveAllowedHeaders({h5: value})}
                            />
                            <ToggleControl
                                label={'h6'}
                                checked={undefined !== allowedHeaders && undefined !== allowedHeaders[0] && undefined !== allowedHeaders[0].h6 ? allowedHeaders[0].h6 : true}
                                onChange={value => saveAllowedHeaders({h6: value})}
                            />
                        </PanelBody>

                        <PanelBody
                            title={__('Title Settings', 'kadence-blocks')}
                            initialOpen={false}
                        >
                            <ToggleControl
                                label={__('Enable Title', 'kadence-blocks')}
                                checked={enableTitle}
                                onChange={value => setAttributes({enableTitle: value})}
                            />
                            {enableTitle && (
                                <Fragment>
                                    <PopColorControl
                                        label={__('Title Color', 'kadence-blocks')}
                                        value={(titleColor ? titleColor : '')}
                                        default={''}
                                        onChange={(value) => setAttributes({titleColor: value})}
                                    />
                                    <TypographyControls
                                        fontSize={titleSize}
                                        onFontSize={(value) => setAttributes({titleSize: value})}
                                        fontSizeType={titleSizeType}
                                        onFontSizeType={(value) => setAttributes({titleSizeType: value})}
                                        lineHeight={titleLineHeight}
                                        onLineHeight={(value) => setAttributes({titleLineHeight: value})}
                                        lineHeightType={titleLineType}
                                        onLineHeightType={(value) => setAttributes({titleLineType: value})}
                                        letterSpacing={titleLetterSpacing}
                                        onLetterSpacing={(value) => setAttributes({titleLetterSpacing: value})}
                                        fontFamily={titleTypography}
                                        onFontFamily={(value) => setAttributes({titleTypography: value})}
                                        onFontChange={(select) => {
                                            setAttributes({
                                                titleTypography: select.value,
                                                titleGoogleFont: select.google,
                                            });
                                        }}
                                        googleFont={titleGoogleFont}
                                        onGoogleFont={(value) => setAttributes({titleGoogleFont: value})}
                                        loadGoogleFont={titleLoadGoogleFont}
                                        onLoadGoogleFont={(value) => setAttributes({titleLoadGoogleFont: value})}
                                        fontVariant={titleFontVariant}
                                        onFontVariant={(value) => setAttributes({titleFontVariant: value})}
                                        fontWeight={titleFontWeight}
                                        onFontWeight={(value) => setAttributes({titleFontWeight: value})}
                                        fontStyle={titleFontStyle}
                                        onFontStyle={(value) => setAttributes({titleFontStyle: value})}
                                        fontSubset={titleFontSubset}
                                        onFontSubset={(value) => setAttributes({titleFontSubset: value})}
                                        padding={titlePadding}
                                        onPadding={(value) => setAttributes({titlePadding: value})}
                                        textTransform={titleTextTransform}
                                        onTextTransform={(value) => setAttributes({titleTextTransform: value})}
                                    />
                                    <MeasurementControls
                                        label={__('Title Border Width (px)', 'kadence-blocks')}
                                        measurement={titleBorder}
                                        onChange={(value) => setAttributes({titleBorder: value})}
                                        min={0}
                                        max={100}
                                        step={1}
                                    />
                                    <PopColorControl
                                        label={__('Title Border Color', 'kadence-blocks')}
                                        swatchLabel={__('Normal Color', 'kadence-blocks')}
                                        value={(titleBorderColor ? titleBorderColor : '')}
                                        default={''}
                                        onChange={(value) => setAttributes({titleBorderColor: value})}
                                        swatchLabel2={__('Collapsed Color', 'kadence-blocks')}
                                        value2={(titleCollapseBorderColor ? titleCollapseBorderColor : '')}
                                        default2={''}
                                        onChange2={(value) => setAttributes({titleCollapseBorderColor: value})}
                                    />
                                </Fragment>
                            )}
                        </PanelBody>
                    
                        <PanelBody
                            title={__('List Settings', 'kadence-blocks')}
                            initialOpen={false}
                        >
                            <ResponsiveRangeControls
                                label={__('List Item Gap', 'kadence-blocks')}
                                value={listGap && listGap[0] ? listGap[0] : ''}
                                mobileValue={listGap && listGap[2] ? listGap[2] : ''}
                                tabletValue={listGap && listGap[1] ? listGap[1] : ''}
                                onChange={(value) => setAttributes({listGap: [value, (listGap && listGap[1] ? listGap[1] : ''), (listGap && listGap[2] ? listGap[2] : '')]})}
                                onChangeTablet={(value) => setAttributes({listGap: [(listGap && listGap[0] ? listGap[0] : ''), value, (listGap && listGap[2] ? listGap[2] : '')]})}
                                onChangeMobile={(value) => setAttributes({listGap: [(listGap && listGap[0] ? listGap[0] : ''), (listGap && listGap[1] ? listGap[1] : ''), value]})}
                                min={0}
                                max={60}
                                step={1}
                            />
                            <PopColorControl
                                label={__('List Items Color', 'kadence-blocks')}
                                swatchLabel={__('Normal Color', 'kadence-blocks')}
                                value={(contentColor ? contentColor : '')}
                                default={''}
                                onChange={(value) => setAttributes({contentColor: value})}
                                swatchLabel2={__('Hover Color', 'kadence-blocks')}
                                value2={(contentHoverColor ? contentHoverColor : '')}
                                default2={''}
                                onChange2={(value) => setAttributes({contentHoverColor: value})}
                            />
                            <SelectControl
                                label={__('List Link Style', 'kadence-blocks')}
                                value={linkStyle}
                                options={[
                                    {value: 'underline', label: __('Underline')},
                                    {value: 'underline_hover', label: __('Underline on Hover')},
                                    {value: 'plain', label: __('No underline')},
                                ]}
                                onChange={value => setAttributes({linkStyle: value})}
                            />
                            <TypographyControls
                                fontSize={contentSize}
                                onFontSize={(value) => setAttributes({contentSize: value})}
                                fontSizeType={contentSizeType}
                                onFontSizeType={(value) => setAttributes({contentSizeType: value})}
                                lineHeight={contentLineHeight}
                                onLineHeight={(value) => setAttributes({contentLineHeight: value})}
                                lineHeightType={contentLineType}
                                onLineHeightType={(value) => setAttributes({contentLineType: value})}
                                letterSpacing={contentLetterSpacing}
                                onLetterSpacing={(value) => setAttributes({contentLetterSpacing: value})}
                                fontFamily={contentTypography}
                                onFontFamily={(value) => setAttributes({contentTypography: value})}
                                onFontChange={(select) => {
                                    setAttributes({
                                        contentTypography: select.value,
                                        contentGoogleFont: select.google,
                                    });
                                }}
                                googleFont={contentGoogleFont}
                                onGoogleFont={(value) => setAttributes({contentGoogleFont: value})}
                                loadGoogleFont={contentLoadGoogleFont}
                                onLoadGoogleFont={(value) => setAttributes({contentLoadGoogleFont: value})}
                                fontVariant={contentFontVariant}
                                onFontVariant={(value) => setAttributes({contentFontVariant: value})}
                                fontWeight={contentFontWeight}
                                onFontWeight={(value) => setAttributes({contentFontWeight: value})}
                                fontStyle={contentFontStyle}
                                onFontStyle={(value) => setAttributes({contentFontStyle: value})}
                                fontSubset={contentFontSubset}
                                onFontSubset={(value) => setAttributes({contentFontSubset: value})}
                                textTransform={contentTextTransform}
                                onTextTransform={(value) => setAttributes({contentTextTransform: value})}
                            />
                            <MeasurementControls
                                label={__('List Container Margin', 'kadence-blocks')}
                                measurement={contentMargin}
                                onChange={(value) => setAttributes({contentMargin: value})}
                                min={-100}
                                max={100}
                                step={1}
                            />
                        </PanelBody>
                        <PanelBody
                            title={__('Scroll Settings', 'kadence-blocks')}
                            initialOpen={false}
                        >
                            <ToggleControl
                                label={__('Enable Smooth Scroll to ID', 'kadence-blocks')}
                                checked={enableSmoothScroll}
                                onChange={value => setAttributes({enableSmoothScroll: value})}
                            />
                            {enableSmoothScroll && (
                                <RangeControl
                                    label={__('Scroll Offset', 'kadence-blocks')}
                                    value={smoothScrollOffset ? smoothScrollOffset : ''}
                                    onChange={(value) => setAttributes({smoothScrollOffset: value})}
                                    min={0}
                                    max={400}
                                    step={1}
                                />
                            )}
                            <ToggleControl
                                label={__('Enable Highlighting Heading when scrolling in active area.', 'kadence-blocks')}
                                checked={enableScrollSpy}
                                onChange={value => setAttributes({enableScrollSpy: value})}
                            />
                            {enableScrollSpy && (
                                <PopColorControl
                                    label={__('List Items Active Color', 'kadence-blocks')}
                                    value={(contentActiveColor ? contentActiveColor : '')}
                                    default={''}
                                    onChange={(value) => setAttributes({contentActiveColor: value})}
                                />
                            )}
                        </PanelBody>

                    <PanelBody
                        title={__('Container Settings', 'kadence-blocks')}
                        initialOpen={false}
                    >
                        <PopColorControl
                            label={__( 'Container Background', 'kadence-blocks' )}
                            value={( containerBackground ? containerBackground : '' )}
                            default={''}
                            onChange={( value ) => setAttributes( { containerBackground: value } )}
                        />
                        <MeasurementControls
                            label={__( 'Container Padding', 'kadence-blocks' )}
                            measurement={containerPadding}
                            onChange={( value ) => setAttributes( { containerPadding: value } )}
                            min={0}
                            max={100}
                            step={1}
                        />
                        <PopColorControl
                            label={__( 'Border Color', 'kadence-blocks' )}
                            value={( containerBorderColor ? containerBorderColor : '' )}
                            default={''}
                            onChange={( value ) => setAttributes( { containerBorderColor: value } )}
                        />
                        <MeasurementControls
                            label={__( 'Content Border Width (px)', 'kadence-blocks' )}
                            measurement={containerBorder}
                            onChange={( value ) => setAttributes( { containerBorder: value } )}
                            min={0}
                            max={100}
                            step={1}
                        />
                        <MeasurementControls
                            label={__( 'Border Radius', 'kadence-blocks' )}
                            measurement={borderRadius}
                            onChange={( value ) => setAttributes( { borderRadius: value } )}
                            min={0}
                            max={200}
                            step={1}
                            firstIcon={topLeftIcon}
                            secondIcon={topRightIcon}
                            thirdIcon={bottomRightIcon}
                            fourthIcon={bottomLeftIcon}
                        />
                        <BoxShadowControl
                            label={__( 'Box Shadow', 'kadence-blocks' )}
                            enable={( undefined !== displayShadow ? displayShadow : false )}
                            color={( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].color ? shadow[ 0 ].color : '#000000' )}
                            colorDefault={'#000000'}
                            onArrayChange={( color, opacity ) => saveShadow( { color: color, opacity: opacity } )}
                            opacity={( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].opacity ? shadow[ 0 ].opacity : 0.2 )}
                            hOffset={( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].hOffset ? shadow[ 0 ].hOffset : 0 )}
                            vOffset={( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].vOffset ? shadow[ 0 ].vOffset : 0 )}
                            blur={( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].blur ? shadow[ 0 ].blur : 14 )}
                            spread={( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].spread ? shadow[ 0 ].spread : 0 )}
                            inset={( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].inset ? shadow[ 0 ].inset : false )}
                            onEnableChange={value => {
                                setAttributes( {
                                    displayShadow: value,
                                } );
                            }}
                            onColorChange={value => {
                                saveShadow( { color: value } );
                            }}
                            onOpacityChange={value => {
                                saveShadow( { opacity: value } );
                            }}
                            onHOffsetChange={value => {
                                saveShadow( { hOffset: value } );
                            }}
                            onVOffsetChange={value => {
                                saveShadow( { vOffset: value } );
                            }}
                            onBlurChange={value => {
                                saveShadow( { blur: value } );
                            }}
                            onSpreadChange={value => {
                                saveShadow( { spread: value } );
                            }}
                            onInsetChange={value => {
                                saveShadow( { inset: value } );
                            }}
                        />
                        <RangeControl
                            label={__( 'Max Width', 'kadence-blocks' )}
                            value={maxWidth ? maxWidth : ''}
                            onChange={( value ) => setAttributes( { maxWidth: value } )}
                            min={50}
                            max={1400}
                            step={1}
                        />
                        <ResponsiveMeasurementControls
                            label={__( 'Container Margin', 'kadence-blocks' )}
                            value={containerMargin}
                            onChange={( value ) => setAttributes( { containerMargin: value } )}
                            tabletValue={containerTabletMargin}
                            onChangeTablet={( value ) => setAttributes( { containerTabletMargin: value } )}
                            mobileValue={containerMobileMargin}
                            onChangeMobile={( value ) => setAttributes( { containerMobileMargin: value } )}
                            min={( containerMarginUnit === 'em' || containerMarginUnit === 'rem' ? -2 : -200 )}
                            max={( containerMarginUnit === 'em' || containerMarginUnit === 'rem' ? 12 : 200 )}
                            step={( containerMarginUnit === 'em' || containerMarginUnit === 'rem' ? 0.1 : 1 )}
                            unit={containerMarginUnit}
                            units={[ 'px', 'em', 'rem' ]}
                            onUnit={( value ) => setAttributes( { containerMarginUnit: value } )}
                        />
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

export default KadenceTableOfContents;
