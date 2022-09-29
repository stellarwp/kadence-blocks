import {
    TypographyControls,
    MeasurementControls,
    PopColorControl,
    ResponsiveMeasurementControls,
    ResponsiveAlignControls
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
    __experimentalNumberControl as NumberControl,
    Dashicon
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
import {countUpIcon} from '@kadence/icons';
import Inspector from '../../blocks/countup/inspector';

function KadenceCountup(props) {

    const blockSlug = 'kadence/countup';
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
            createErrorNotice(__('Countup block defaults saved!', 'kadence-blocks'), {
                type: 'snackbar',
            })

            setIsSaving(false);
            setConfiguration(config);
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

    const saveNumberFont = (value) => {
        const config = configuration;

        if (!has(config, [blockSlug, 'numberFont', 0])) {
            config[blockSlug].numberFont = [{}];
        }

        config[blockSlug].numberFont[0] = {...config[blockSlug].numberFont[0], ...value};

        saveConfigState('numberFont', config[blockSlug].numberFont);

    };

    const saveTitleFont = (value) => {
        const config = configuration;

        if (!has(config, [blockSlug, 'titleFont', 0])) {
            config[blockSlug].titleFont = [{}];
        }

        config[blockSlug].titleFont[0] = {...config[blockSlug].titleFont[0], ...value};

        saveConfigState('titleFont', config[blockSlug].titleFont);

    };



    let theSeparator = ( get(configuration, [blockSlug, 'separator'], '') === true ? ',' : get(configuration, [blockSlug, 'separator'], '') );
    theSeparator = ( theSeparator === false ? '' : theSeparator );

    return (
        <Fragment>
            <Button className="kt-block-defaults" onClick={() => setIsOpen(true)}>
                <span className="kt-block-icon">{countUpIcon}</span>
                {__('Countup', 'kadence-blocks')}
            </Button>
            {isOpen && (
                <Modal
                    className="kt-block-defaults-modal"
                    title={__('Kadence Countup')}
                    onRequestClose={() => {
                        saveConfig(configuration);
                    }}>
                    
                    {/*<PanelBody*/}
                    {/*    title={__('Countup Layout')}*/}
                    {/*    initialOpen={true}*/}
                    {/*>*/}
                    {/*    <SelectControl*/}
                    {/*        label={__('Timer Layout', 'kadence-blocks')}*/}
                    {/*        value={get(configuration, [blockSlug, 'timerLayout'], 'block')}*/}
                    {/*        options={[*/}
                    {/*            {value: 'block', label: __('Block', 'kadence-blocks')},*/}
                    {/*            {value: 'inline', label: __('Inline', 'kadence-blocks')},*/}
                    {/*        ]}*/}
                    {/*        onChange={value => {*/}
                    {/*            saveConfigState('timerLayout', value)*/}
                    {/*        }}*/}
                    {/*    />*/}

                    {/*</PanelBody>*/}

                    <PanelBody
                        title={__( 'Count Up Settings' )}
                        initialOpen={true}
                        panelName={'kb-inspector-countup-settings'}
                    >

                        <div className="kt-columns-control">

                            {/*<div style={{ marginBottom: '15px' }}>*/}
                            {/*    <NumberControl*/}
                            {/*        label={__( 'Starting Number', 'kadence-blocks' )}*/}
                            {/*        value={ get(configuration, [blockSlug, 'start'], 0) }*/}
                            {/*        onChange={( value ) => saveConfigState('start', parseInt( value ))}*/}
                            {/*        min={0}*/}
                            {/*        isShiftStepEnabled={true}*/}
                            {/*        shiftStep={10}*/}
                            {/*    />*/}
                            {/*</div>*/}

                            {/*<div style={{ marginBottom: '15px' }}>*/}
                            {/*    <NumberControl*/}
                            {/*        label={__( 'Ending Number', 'kadence-blocks' )}*/}
                            {/*        value={ 100 }*/}
                            {/*        onChange={( value ) => saveConfigState('end', parseInt( value ))}*/}
                            {/*        min={0}*/}
                            {/*        isShiftStepEnabled={true}*/}
                            {/*        shiftStep={10}*/}
                            {/*    />*/}
                            {/*</div>*/}

                            <TextControl
                                label={__( 'Number Prefix', 'kadence-blocks' )}
                                value={ get(configuration, [blockSlug, 'prefix'], '') }
                                onChange={value => saveConfigState('prefix', value )}
                            />

                            <TextControl
                                label={__( 'Number Suffix', 'kadence-blocks' )}
                                value={ get(configuration, [blockSlug, 'suffix'], '') }
                                onChange={value => saveConfigState('suffix', value )}
                            />

                            <RangeControl
                                label={__( 'Animation Duration', 'kadence-blocks' )}
                                value={ get(configuration, [blockSlug, 'duration'], 2.5) }
                                onChange={( value ) => saveConfigState('duration', value )}
                                min={0.1}
                                max={25}
                                step={0.1}
                            />

                            <SelectControl
                                label={__( 'Thousand Separator', 'kadence-blocks' )}
                                value={ theSeparator }
                                options={[
                                    { value: '', label: __( 'None', 'kadence-blocks' ) },
                                    { value: ',', label: ',' },
                                    { value: '.', label: '.' },
                                ]}
                                onChange={value => saveConfigState('separator', value )}
                            />
                            <SelectControl
                                label={__( 'Decimal', 'kadence-blocks' )}
                                value={ get(configuration, [blockSlug, 'decimal'], '') }
                                options={[
                                    { value: '', label: __( 'None', 'kadence-blocks' ) },
                                    { value: '.', label: '.' },
                                    { value: ',', label: ',' },
                                ]}
                                onChange={value => saveConfigState('decimal', value )}
                            />
                            { get(configuration, [blockSlug, 'decimal'], '') !== '' && (
                                <RangeControl
                                    label={__( 'Decimal Spaces', 'kadence-blocks' )}
                                    value={ get(configuration, [blockSlug, 'decimalSpaces'], 2) }
                                    onChange={( value ) => saveConfigState('decimalSpaces', value )}
                                    min={1}
                                    max={25}
                                    step={1}
                                />
                            )}
                        </div>
                    </PanelBody>

                    <PanelBody
                        title={__( 'Title Settings', 'kadence-blocks' )}
                        panelName={'titleStyle'}
                        blockSlug={ 'kadence/countup' }
                    >
                        <ToggleControl
                            label={__( 'Show Title', 'kadence-blocks' )}
                            checked={ get(configuration, [blockSlug, 'displayTitle'], true)}
                            onChange={( value ) => saveConfigState('displayTitle', value )}
                        />
                        { get(configuration, [blockSlug, 'displayTitle'], true) &&
                            <>
                                <PopColorControl
                                    label={__( 'Title Color', 'kadence-blocks' )}
                                    value={ get(configuration, [blockSlug, 'titleColor'], '')}
                                    default={''}
                                    onChange={value => saveConfigState('titleColor', value )}
                                />
                                <ResponsiveAlignControls
                                    label={__( 'Text Alignment', 'kadence-blocks' )}
                                    value={ get(configuration, [blockSlug, 'titleAlign', 0], '') }
                                    mobileValue={get(configuration, [blockSlug, 'titleAlign', 2], '')}
                                    tabletValue={get(configuration, [blockSlug, 'titleAlign', 1], '')}
                                    onChange={( nextAlign ) => saveConfigState('titleAlign', [ nextAlign, ( titleAlign && titleAlign[ 1 ] ? titleAlign[ 1 ] : '' ), ( titleAlign && titleAlign[ 2 ] ? titleAlign[ 2 ] : '' ) ] ) }
                                    onChangeTablet={( nextAlign ) => saveConfigState('titleAlign', [ ( titleAlign && titleAlign[ 0 ] ? titleAlign[ 0 ] : '' ), nextAlign, ( titleAlign && titleAlign[ 2 ] ? titleAlign[ 2 ] : '' ) ] ) }
                                    onChangeMobile={( nextAlign ) => saveConfigState('titleAlign', [ ( titleAlign && titleAlign[ 0 ] ? titleAlign[ 0 ] : '' ), ( titleAlign && titleAlign[ 1 ] ? titleAlign[ 1 ] : '' ), nextAlign ] ) }
                                />
                                <h2 className="kt-heading-size-title">{__( 'Min Height' )}</h2>
                                <TabPanel className="kt-size-tabs"
                                          activeClass="active-tab"
                                          tabs={[
                                              {
                                                  name     : 'desk',
                                                  title    : <Dashicon icon="desktop"/>,
                                                  className: 'kt-desk-tab',
                                              },
                                              {
                                                  name     : 'tablet',
                                                  title    : <Dashicon icon="tablet"/>,
                                                  className: 'kt-tablet-tab',
                                              },
                                              {
                                                  name     : 'mobile',
                                                  title    : <Dashicon icon="smartphone"/>,
                                                  className: 'kt-mobile-tab',
                                              },
                                          ]}>
                                    {
                                        ( tab ) => {
                                            let tabout;
                                            if ( tab.name ) {
                                                if ( 'mobile' === tab.name ) {
                                                    tabout = (
                                                        <RangeControl
                                                            value={ get(configuration, [blockSlug, 'titleMinHeight', 2], '')}
                                                            onChange={value => saveConfigState('titleMinHeight', [ ( ( undefined !== get(configuration, [blockSlug, 'titleMinHeight', 0], '') ) ? get(configuration, [blockSlug, 'titleMinHeight', 0], '') : '' ), ( ( undefined !== get(configuration, [blockSlug, 'titleMinHeight', 1], '') ) ? get(configuration, [blockSlug, 'titleMinHeight', 1], '') : '' ), value ] )}
                                                            step={1}
                                                            min={0}
                                                            max={600}
                                                        />
                                                    );
                                                } else if ( 'tablet' === tab.name ) {
                                                    tabout = (
                                                        <RangeControl
                                                            value={  get(configuration, [blockSlug, 'titleMinHeight', 1], '') }
                                                            onChange={value => saveConfigState('titleMinHeight', [ ( ( undefined !== get(configuration, [blockSlug, 'titleMinHeight', 0], '') ) ? get(configuration, [blockSlug, 'titleMinHeight', 0], '') : '' ), value, ( (undefined !== get(configuration, [blockSlug, 'titleMinHeight', 2], '') ) ? get(configuration, [blockSlug, 'titleMinHeight', 2], '') : '' ) ] )}
                                                            step={1}
                                                            min={0}
                                                            max={600}
                                                        />
                                                    );
                                                } else {
                                                    tabout = (
                                                        <RangeControl
                                                            value={ get(configuration, [blockSlug, 'titleMinHeight', 0], '')}
                                                            onChange={value => saveConfigState('titleMinHeight', [ value, ( ( undefined !== get(configuration, [blockSlug, 'titleMinHeight', 1], '') ) ? get(configuration, [blockSlug, 'titleMinHeight', 1], '') : '' ), ( ( undefined !== get(configuration, [blockSlug, 'titleMinHeight', 2], '') ) ? get(configuration, [blockSlug, 'titleMinHeight', 2], '') : '' ) ] )}
                                                            step={1}
                                                            min={0}
                                                            max={600}
                                                        />
                                                    );
                                                }
                                            }
                                            return <div className={tab.className} key={tab.className}>{tabout}</div>;
                                        }
                                    }
                                </TabPanel>
                                <TypographyControls
                                    fontGroup={'heading'}
                                    tagLowLevel={2}
                                    tagHighLevel={7}
                                    otherTags={{ 'p': true, 'span': true, 'div': true }}
                                    tagLevel={ get(configuration, [blockSlug, 'titleFont', 0, 'level'], 4)}
                                    htmlTag={get(configuration, [blockSlug, 'titleFont', 0, 'htmlTag'], 'div')}
                                    onTagLevel={( value ) => saveTitleFont( {level: value } )}
                                    onTagLevelHTML={( level, tag ) => {
                                        saveTitleFont( {level: level } );
                                        saveTitleFont( {htmlTag: tag } );
                                    }}
                                    fontSize={ get(configuration, [blockSlug, 'titleFont', 0, 'size'], ['', '', '']) }
                                    onFontSize={( value ) => saveTitleFont( {size: value } )}
                                    fontSizeType={get(configuration, [blockSlug, 'titleFont', 0, 'sizeType'], 'px')}
                                    onFontSizeType={( value ) => saveTitleFont( {sizeType: value } )}
                                    lineHeight={ get(configuration, [blockSlug, 'titleFont', 0, 'lineHeight'], ['', '', ''])}
                                    onLineHeight={( value ) => saveTitleFont( {lineHeight: value } )}
                                    lineHeightType={get(configuration, [blockSlug, 'titleFont', 0, 'lineType'], 'px')}
                                    onLineHeightType={( value ) => saveTitleFont( {lineType: value } )}
                                    letterSpacing={get(configuration, [blockSlug, 'titleFont', 0, 'letterSpacing'], '')}
                                    onLetterSpacing={( value ) => saveTitleFont( {letterSpacing: value } )}
                                    fontFamily={get(configuration, [blockSlug, 'titleFont', 0, 'family'], '')}
                                    textTransform={ get(configuration, [blockSlug, 'titleFont', 0, 'textTransform'], '') }
                                    onTextTransform={ ( value ) => saveTitleFont( {textTransform: value } ) }
                                    onFontFamily={( value ) => saveTitleFont( {family: value } )}
                                    onFontChange={( select ) => {
                                        saveTitleFont( {family: select.value }  );
                                        saveTitleFont( {google: select.google }  );
                                    }}
                                    onFontArrayChange={( values ) => saveTitleFont( values )}
                                    googleFont={ get(configuration, [blockSlug, 'titleFont', 0, 'google'], false) }
                                    onGoogleFont={( value ) => saveTitleFont( {google: value } )}
                                    loadGoogleFont={ get(configuration, [blockSlug, 'titleFont', 0, 'loadGoogle'], true) }
                                    onLoadGoogleFont={( value ) => saveTitleFont( {loadGoogle: value } )}
                                    fontVariant={ get(configuration, [blockSlug, 'titleFont', 0, 'variant'], '') }
                                    onFontVariant={( value ) => saveTitleFont( {variant: value } )}
                                    fontWeight={ get(configuration, [blockSlug, 'titleFont', 0, 'weight'], '') }
                                    onFontWeight={( value ) => saveTitleFont( {weight: value } )}
                                    fontStyle={get(configuration, [blockSlug, 'titleFont', 0, 'style'], '')}
                                    onFontStyle={( value ) => saveTitleFont( {style: value } )}
                                    fontSubset={get(configuration, [blockSlug, 'titleFont', 0, 'subset'], '')}
                                    onFontSubset={( value ) => saveTitleFont( {subset: value } )}
                                />
                                <ResponsiveMeasurementControls
                                    label={__( 'Title Padding', 'kadence-blocks' )}
                                    value={ get(configuration, [blockSlug, 'titlePadding'], [ "", "", "", "" ]) }
                                    tabletValue={ get(configuration, [blockSlug, 'titleTabletPadding'], [ "", "", "", "" ])}
                                    mobileValue={ get(configuration, [blockSlug, 'titleMobilePadding'], [ "", "", "", "" ])}
                                    onChange={( value ) => saveConfigState('titlePadding', value )}
                                    onChangeTablet={( value ) => saveConfigState('titleTabletPadding', value )}
                                    onChangeMobile={( value ) => saveConfigState('titleMobilePadding', value )}
                                    onChangeControl={( value ) => setTitlePaddingControl( value )}
                                    min={0}
                                    max={( get(configuration, [blockSlug, 'titlePaddingType'], 'px') === 'em' || get(configuration, [blockSlug, 'titlePaddingType'], 'px') === 'rem' ? 12 : 200 )}
                                    step={( get(configuration, [blockSlug, 'titlePaddingType'], 'px') === 'em' || get(configuration, [blockSlug, 'titlePaddingType'], 'px') === 'rem' ? 0.1 : 1 )}
                                    unit={get(configuration, [blockSlug, 'titlePaddingType'], 'px')}
                                    units={[ 'px', 'em', 'rem', '%' ]}
                                    onUnit={( value ) => saveConfigState('titlePaddingType', value )}
                                />
                                <ResponsiveMeasurementControls
                                    label={__( 'Title Margin', 'kadence-blocks' )}
                                    value={ get(configuration, [blockSlug, 'titleMargin'], ['', '', '', '']) }
                                    tabletValue={ get(configuration, [blockSlug, 'titleTabletMargin'], ['', '', '', ''])}
                                    mobileValue={ get(configuration, [blockSlug, 'titleMobileMargin'], ['', '', '', ''])}
                                    onChange={( value ) => saveConfigState('titleMargin', value )}
                                    onChangeTablet={( value ) => saveConfigState('titleTabletMargin', value )}
                                    onChangeMobile={( value ) => saveConfigState('titleMobileMargin', value )}
                                    onChangeControl={( value ) => setTitleMarginControl( value )}
                                    min={( get(configuration, [blockSlug, 'titleMarginType'], 'px') === 'em' || get(configuration, [blockSlug, 'titleMarginType'], 'px') === 'rem' ? -12 : -200 )}
                                    max={( get(configuration, [blockSlug, 'titleMarginType'], 'px') === 'em' || get(configuration, [blockSlug, 'titleMarginType'], 'px') === 'rem' ? 12 : 200 )}
                                    step={( get(configuration, [blockSlug, 'titleMarginType'], 'px') === 'em' || get(configuration, [blockSlug, 'titleMarginType'], 'px') === 'rem' ? 0.1 : 1 )}
                                    unit={get(configuration, [blockSlug, 'titleMarginType'], 'px')}
                                    units={[ 'px', 'em', 'rem', '%', 'vh' ]}
                                    onUnit={( value ) => saveConfigState('titleMarginType', value )}
                                />
                            </>
                        }
                    </PanelBody>

                    <PanelBody
                        title={__( 'Number Settings', 'kadence-blocks' )}
                        initialOpen={false}
                        panelName={'numberStyle'}
                        blockSlug={ 'kadence/countup' }
                    >
                        <PopColorControl
                            label={__( 'Number Color', 'kadence-blocks' )}
                            value={ get(configuration, [blockSlug, 'numberColor'], '') }
                            default={''}
                            onChange={value => saveConfigState('numberColor', value )}
                        />
                        <ResponsiveAlignControls
                            label={__( 'Text Alignment', 'kadence-blocks' )}
                            value={ get(configuration, [blockSlug, 'numberAlign', 0 ], '') }
                            mobileValue={ get(configuration, [blockSlug, 'numberAlign', 2 ], '') }
                            tabletValue={ get(configuration, [blockSlug, 'numberAlign', 1 ], '') }
                            onChange={( nextAlign ) => saveConfigState( 'numberAlign', [ nextAlign, get(configuration, [blockSlug, 'numberAlign', 1 ], ''), get(configuration, [blockSlug, 'numberAlign', 2 ], '') ] )}
                            onChangeTablet={( nextAlign ) => saveConfigState( 'numberAlign', [ get(configuration, [blockSlug, 'numberAlign', 0 ], ''), nextAlign, get(configuration, [blockSlug, 'numberAlign', 2 ], '') ] )}
                            onChangeMobile={( nextAlign ) => saveConfigState( 'numberAlign', [ get(configuration, [blockSlug, 'numberAlign', 0 ], ''), get(configuration, [blockSlug, 'numberAlign', 1 ], ''), nextAlign ] )}
                        />
                        <h2 className="kt-heading-size-title">{__( 'Min Height' )}</h2>
                        <TabPanel className="kt-size-tabs"
                                  activeClass="active-tab"
                                  tabs={[
                                      {
                                          name     : 'desk',
                                          title    : <Dashicon icon="desktop"/>,
                                          className: 'kt-desk-tab',
                                      },
                                      {
                                          name     : 'tablet',
                                          title    : <Dashicon icon="tablet"/>,
                                          className: 'kt-tablet-tab',
                                      },
                                      {
                                          name     : 'mobile',
                                          title    : <Dashicon icon="smartphone"/>,
                                          className: 'kt-mobile-tab',
                                      },
                                  ]}>
                            {
                                ( tab ) => {
                                    let tabout;
                                    if ( tab.name ) {
                                        if ( 'mobile' === tab.name ) {
                                            tabout = (
                                                <RangeControl
                                                    value={ get(configuration, [blockSlug, 'numberMinHeight', 2 ], '') }
                                                    onChange={value => saveConfigState( 'numberMinHeight', [ get(configuration, [blockSlug, 'numberMinHeight', 0 ], ''), get(configuration, [blockSlug, 'numberMinHeight', 1 ], ''), value ] )}
                                                    step={1}
                                                    min={0}
                                                    max={600}
                                                />
                                            );
                                        } else if ( 'tablet' === tab.name ) {
                                            tabout = (
                                                <RangeControl
                                                    value={ get(configuration, [blockSlug, 'numberMinHeight', 1 ], '') }
                                                    onChange={value => saveConfigState( 'numberMinHeight', [ get(configuration, [blockSlug, 'numberMinHeight', 0 ], ''), value, get(configuration, [blockSlug, 'numberMinHeight', 2 ], '') ] )}
                                                    step={1}
                                                    min={0}
                                                    max={600}
                                                />
                                            );
                                        } else {
                                            tabout = (
                                                <RangeControl
                                                    value={ get(configuration, [blockSlug, 'numberMinHeight', 0 ], '') }
                                                    onChange={value => saveConfigState( 'numberMinHeight', [ value, get(configuration, [blockSlug, 'numberMinHeight', 1 ], ''), get(configuration, [blockSlug, 'numberMinHeight', 2 ], '') ] )}
                                                    step={1}
                                                    min={0}
                                                    max={600}
                                                />
                                            );
                                        }
                                    }
                                    return <div className={tab.className} key={tab.className}>{tabout}</div>;
                                }
                            }
                        </TabPanel>
                        <TypographyControls
                            fontGroup={'number'}
                            fontSize={ get(configuration, [blockSlug, 'numberFont', 0, 'size' ], [ "50", "", "" ] )}
                            onFontSize={( value ) => saveNumberFont( {size: value } )}
                            fontSizeType={ get(configuration, [blockSlug, 'numberFont', 0, 'sizeType' ], 'px') }
                            onFontSizeType={( value ) => saveNumberFont( {sizeType: value } )}
                            lineHeight={get(configuration, [blockSlug, 'numberFont', 0, 'lineHeight' ], [ "", "", "" ] )}
                            onLineHeight={( value ) => saveNumberFont( {lineHeight: value } )}
                            lineHeightType={ get(configuration, [blockSlug, 'numberFont', 0, 'lineType' ], 'px' ) }
                            onLineHeightType={( value ) => saveNumberFont( {lineType: value } )}
                            letterSpacing={ get(configuration, [blockSlug, 'numberFont', 0, 'letterSpacing' ], '' ) }
                            onLetterSpacing={( value ) => saveNumberFont( {letterSpacing: value } )}
                            fontFamily={ get(configuration, [blockSlug, 'numberFont', 0, 'family' ], '' ) }
                            onFontFamily={( value ) => saveNumberFont( {family: value } )}
                            onFontChange={( select ) => {
                                        saveNumberFont( { family: select.value } );
                                        saveNumberFont( { google: select.google } );
                            }}
                            onFontArrayChange={( values ) => saveNumberFont( values )}
                            googleFont={ get(configuration, [blockSlug, 'numberFont', 0, 'google' ], false ) }
                            onGoogleFont={( value ) => saveNumberFont( {google: value } )}
                            loadGoogleFont={ get(configuration, [blockSlug, 'numberFont', 0, 'loadGoogle' ], true ) }
                            onLoadGoogleFont={( value ) => saveNumberFont( {loadGoogle: value } )}
                            fontVariant={ get(configuration, [blockSlug, 'numberFont', 0, 'variant' ], '' ) }
                            onFontVariant={( value ) => saveNumberFont( {variant: value } )}
                            fontWeight={ get(configuration, [blockSlug, 'numberFont', 0, 'weight' ], '' ) }
                            onFontWeight={( value ) => saveNumberFont( {weight: value } )}
                            fontStyle={ get(configuration, [blockSlug, 'numberFont', 0, 'style' ], '' ) }
                            onFontStyle={( value ) => saveNumberFont( {style: value } )}
                            fontSubset={ get(configuration, [blockSlug, 'numberFont', 0, 'subset' ], '' ) }
                            onFontSubset={( value ) => saveNumberFont( {subset: value } )}
                        />
                        <ResponsiveMeasurementControls
                            label={__( 'Number Padding', 'kadence-blocks' )}
                            value={get(configuration, [blockSlug, 'numberPadding' ], ['', '', '', ''])}
                            tabletValue={get(configuration, [blockSlug, 'numberTabletPadding' ], ['', '', '', ''])}
                            mobileValue={get(configuration, [blockSlug, 'numberMobilePadding' ], ['', '', '', ''])}
                            onChange={( value ) => saveConfigState('numberPadding', value )}
                            onChangeTablet={( value ) => saveConfigState('numberTabletPadding', value )}
                            onChangeMobile={( value ) => saveConfigState('numberMobilePadding', value )}
                            min={0}
                            max={( get(configuration, [blockSlug, 'numberPaddingType' ], 'px') === 'em' || get(configuration, [blockSlug, 'numberPaddingType' ], 'px') === 'rem' ? 12 : 200 )}
                            step={( get(configuration, [blockSlug, 'numberPaddingType' ], 'px') === 'em' || get(configuration, [blockSlug, 'numberPaddingType' ], 'px') === 'rem' ? 0.1 : 1 )}
                            unit={get(configuration, [blockSlug, 'numberPaddingType' ], 'px')}
                            units={[ 'px', 'em', 'rem', '%' ]}
                            onUnit={( value ) => saveConfigState('numberPaddingType', value )}
                        />
                        <ResponsiveMeasurementControls
                            label={__( 'Number Margin', 'kadence-blocks' )}
                            value={get(configuration, [blockSlug, 'numberMargin' ], ['', '', '', ''])}
                            tabletValue={get(configuration, [blockSlug, 'numberTabletMargin' ], ['', '', '', ''])}
                            mobileValue={get(configuration, [blockSlug, 'numberMobileMargin' ], ['', '', '', ''])}
                            onChange={( value ) => saveConfigState('numberMargin', value )}
                            onChangeTablet={( value ) => saveConfigState('numberTabletMargin', value )}
                            onChangeMobile={( value ) => saveConfigState('numberMobileMargin', value )}
                            min={( get(configuration, [blockSlug, 'numberMarginType' ], 'px') === 'em' || get(configuration, [blockSlug, 'numberMarginType' ], 'px') === 'rem' ? -12 : -200 )}
                            max={( get(configuration, [blockSlug, 'numberMarginType' ], 'px') === 'em' || get(configuration, [blockSlug, 'numberMarginType' ], 'px') === 'rem' ? 12 : 200 )}
                            step={( get(configuration, [blockSlug, 'numberMarginType' ], 'px') === 'em' || get(configuration, [blockSlug, 'numberMarginType' ], 'px') === 'rem' ? 0.1 : 1 )}
                            unit={get(configuration, [blockSlug, 'numberMarginType' ], 'px')}
                            units={[ 'px', 'em', 'rem', '%', 'vh' ]}
                            onUnit={( value ) => saveConfigState('numberMarginType', value )}
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

export default KadenceCountup;
