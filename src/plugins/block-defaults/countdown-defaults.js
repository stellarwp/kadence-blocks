import {
    TypographyControls,
    MeasurementControls,
    PopColorControl,
    ResponsiveMeasurementControls
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
import {countdownIcon} from '@kadence/icons';

function KadenceCountdown(props) {

    const blockSlug = 'kadence/countdown';
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [resetConfirm, setResetConfirm] = useState(false);
    const {createErrorNotice} = useDispatch(noticesStore);

    const [configuration, setConfiguration] = useState((kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : {}));
    const [pendingConfig, setPendingConfig] = useState({});
    const tmpConfig = {...get(configuration, [blockSlug], {}), ...pendingConfig};


    const itemPaddingType = get(configuration, [blockSlug, 'itemPaddingType'], '');
    const itemPaddingMin = (itemPaddingType === 'em' || itemPaddingType === 'rem' ? 0 : 0);
    const itemPaddingMax = (itemPaddingType === 'em' || itemPaddingType === 'rem' ? 12 : 200);
    const itemPaddingStep = (itemPaddingType === 'em' || itemPaddingType === 'rem' ? 0.1 : 1);

    const marginType = get(configuration, [blockSlug, 'marginType'], 'px');
    const paddingType = get(configuration, [blockSlug, 'paddingType'], 'px');

    const marginMin = (marginType === 'em' || marginType === 'rem' ? -2 : -200);
    const marginMax = (marginType === 'em' || marginType === 'rem' ? 12 : 200);
    const marginStep = (marginType === 'em' || marginType === 'rem' ? 0.1 : 1);
    const paddingMin = (paddingType === 'em' || paddingType === 'rem' ? 0 : 0);
    const paddingMax = (paddingType === 'em' || paddingType === 'rem' ? 12 : 200);
    const paddingStep = (paddingType === 'em' || paddingType === 'rem' ? 0.1 : 1);

    const saveConfig = () => {
        setIsSaving(true);
        const config = configuration;

        if (!config[blockSlug]) {
            config[blockSlug] = {};
        }

        config[blockSlug] = tmpConfig;
        const settingModel = new wp.api.models.Settings({kadence_blocks_config_blocks: JSON.stringify(config)});

        settingModel.save().then(response => {
            createErrorNotice(__('Countdown block defaults saved!', 'kadence-blocks'), {
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

    return (
        <Fragment>
            <Button className="kt-block-defaults" onClick={() => setIsOpen(true)}>
                <span className="kt-block-icon">{countdownIcon}</span>
                {__('Countdown', 'kadence-blocks')}
            </Button>
            {isOpen && (
                <Modal
                    className="kt-block-defaults-modal"
                    title={__('Kadence Countdown')}
                    onRequestClose={() => {
                        saveConfig(configuration);
                    }}>

                    <PanelBody
                        title={__('Countdown Layout')}
                        initialOpen={true}
                    >
                        <SelectControl
                            label={__('Timer Layout', 'kadence-blocks')}
                            value={get(configuration, [blockSlug, 'timerLayout'], 'block')}
                            options={[
                                {value: 'block', label: __('Block', 'kadence-blocks')},
                                {value: 'inline', label: __('Inline', 'kadence-blocks')},
                            ]}
                            onChange={value => {
                                saveConfigState('timerLayout', value)
                            }}
                        />

                    </PanelBody>

                    <PanelBody
                        title={__('Count Item Settings', 'number-settings')}
                    >
                        <PopColorControl
                            label={__('Background Color', 'kadence-blocks')}
                            value={get(configuration, [blockSlug, 'itemBackground'], '')}
                            default={''}
                            onChange={value => saveConfigState('itemBackground', value)}
                        />
                        <PopColorControl
                            label={__('Border Color', 'kadence-blocks')}
                            value={get(configuration, [blockSlug, 'itemBorder'], '')}
                            default={''}
                            onChange={value => saveConfigState('itemBorder', value)}
                        />
                        <ResponsiveMeasurementControls
                            label={__('Border Width', 'kadence-blocks')}
                            value={get(configuration, [blockSlug, 'itemBorderWidth'], '')}
                            tabletValue={get(configuration, [blockSlug, 'itemTabletBorderWidth'], '')}
                            mobileValue={get(configuration, [blockSlug, 'itemMobileBorderWidth'], '')}
                            onChange={(value) => saveConfigState('itemBorderWidth', value)}
                            onChangeTablet={(value) => saveConfigState('itemTabletBorderWidth', value)}
                            onChangeMobile={(value) => saveConfigState('itemMobileBorderWidth', value)}
                            min={0}
                            max={40}
                            step={1}
                            unit={'px'}
                            units={['px']}
                            showUnit={true}
                            preset={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
                        />
                        <MeasurementControls
                            label={__('Border Radius', 'kadence-blocks')}
                            measurement={get(configuration, [blockSlug, 'itemBorderRadius'], '')}
                            control={'linked'}
                            onChange={(value) => saveConfigState('itemBorderRadius', value)}
                            min={0}
                            max={200}
                            step={1}
                            firstIcon={topLeftIcon}
                            secondIcon={topRightIcon}
                            thirdIcon={bottomRightIcon}
                            fourthIcon={bottomLeftIcon}
                        />
                        <ResponsiveMeasurementControls
                            label={__('Padding', 'kadence-blocks')}
                            value={get(configuration, [blockSlug, 'itemPadding'], '')}
                            control={'linked'}
                            tabletValue={get(configuration, [blockSlug, 'itemTabletPadding'], '')}
                            mobileValue={get(configuration, [blockSlug, 'itemMobilePadding'], '')}
                            onChange={(value) => saveConfigState('itemPadding', value)}
                            onChangeTablet={(value) => saveConfigState('itemTabletPadding', value)}
                            onChangeMobile={(value) => saveConfigState('itemMobilePadding', value)}
                            min={itemPaddingMin}
                            max={itemPaddingMax}
                            step={itemPaddingStep}
                            unit={get(configuration, [blockSlug, 'itemPaddingType'], '')}
                            units={['px', 'em', 'rem', '%']}
                            onUnit={(value) => saveConfigState('itemPaddingType', value)}
                        />
                    </PanelBody>

                    <PanelBody
                        title={__('Number Settings', 'kadence-blocks')}
                    >
                        <PopColorControl
                            label={__('Color', 'kadence-blocks')}
                            value={get(configuration, [blockSlug, 'numberColor'], '')}
                            default={''}
                            onChange={value => saveConfigState('numberColor', value)}
                        />
                        <TypographyControls
                            fontGroup={'number-item'}
                            fontSize={get(configuration, [blockSlug, 'numberFont', 0, 'size'], ["", "", ""])}
                            onFontSize={(value) => saveNumberFont({size: value})}
                            fontSizeType={get(configuration, [blockSlug, 'numberFont', 0, 'sizeType'], 'px')}
                            onFontSizeType={(value) => saveNumberFont({sizeType: value})}
                            lineHeight={get(configuration, [blockSlug, 'numberFont', 0, 'lineHeight'], ['', '', ''])}
                            onLineHeight={(value) => saveNumberFont({lineHeight: value})}
                            lineHeightType={get(configuration, [blockSlug, 'numberFont', 0, 'lineType'], 'px')}
                            onLineHeightType={(value) => saveNumberFont({lineType: value})}
                            reLetterSpacing={get(configuration, [blockSlug, 'numberFont', 0, 'letterSpacing'], ['', '', ''])}
                            onLetterSpacing={(value) => saveNumberFont({letterSpacing: value})}
                            letterSpacingType={get(configuration, [blockSlug, 'numberFont', 0, 'letterType'], 'px')}
                            onLetterSpacingType={(value) => saveNumberFont({letterType: value})}
                            textTransform={get(configuration, [blockSlug, 'numberFont', 0, 'textTransform'], '')}
                            onTextTransform={(value) => saveNumberFont({textTransform: value})}
                            fontFamily={get(configuration, [blockSlug, 'numberFont', 0, 'family'], '')}
                            onFontFamily={(value) => saveNumberFont({family: value})}
                            onFontChange={(select) => {
                                saveNumberFont({
                                    family: select.value,
                                    google: select.google,
                                });
                            }}
                            onFontArrayChange={(values) => saveNumberFont(values)}
                            googleFont={get(configuration, [blockSlug, 'numberFont', 0, 'google'], false)}
                            onGoogleFont={(value) => saveNumberFont({google: value})}
                            loadGoogleFont={get(configuration, [blockSlug, 'numberFont', 0, 'loadGoogle'], true)}
                            onLoadGoogleFont={(value) => saveNumberFont({loadGoogle: value})}
                            fontVariant={get(configuration, [blockSlug, 'numberFont', 0, 'variant'], '')}
                            onFontVariant={(value) => saveNumberFont({variant: value})}
                            fontWeight={get(configuration, [blockSlug, 'numberFont', 0, 'weight'], '')}
                            onFontWeight={(value) => saveNumberFont({weight: value})}
                            fontStyle={get(configuration, [blockSlug, 'numberFont', 0, 'style'], '')}
                            onFontStyle={(value) => saveNumberFont({style: value})}
                            fontSubset={get(configuration, [blockSlug, 'numberFont', 0, 'subset'], '')}
                            onFontSubset={(value) => saveNumberFont({subset: value})}
                        />
                    </PanelBody>

                    <PanelBody
                        title={__('Container Settings', 'kadence-blocks')}
                    >
                        <PopColorControl
                            label={__('Background Color', 'kadence-blocks')}
                            value={get(configuration, [blockSlug, 'background'], '')}
                            default={''}
                            onChange={value => saveConfigState('background', value)}
                        />
                        <PopColorControl
                            label={__('Border Color', 'kadence-blocks')}
                            value={get(configuration, [blockSlug, 'border'], '')}
                            default={''}
                            onChange={value => saveConfigState('border', value)}
                        />
                        <ResponsiveMeasurementControls
                            label={__('Border Width', 'kadence-blocks')}
                            value={get(configuration, [blockSlug, 'borderWidth'], [0, 0, 0, 0])}
                            tabletValue={get(configuration, [blockSlug, 'tabletBorderWidth'], ['', '', '', ''])}
                            mobileValue={get(configuration, [blockSlug, 'mobileBorderWidth'], ['', '', '', ''])}
                            onChange={(value) => saveConfigState('borderWidth', value)}
                            onChangeTablet={(value) => saveConfigState('tabletBorderWidth', value)}
                            onChangeMobile={(value) => saveConfigState('mobileBorderWidth', value)}
                            min={0}
                            max={40}
                            step={1}
                            unit={'px'}
                            units={['px']}
                            showUnit={true}
                            preset={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
                        />
                        <MeasurementControls
                            label={__('Border Radius', 'kadence-blocks')}
                            measurement={get(configuration, [blockSlug, 'borderRadius'], [0, 0, 0, 0])}
                            onChange={(value) => saveConfigState('borderRadius', value)}
                            min={0}
                            max={200}
                            step={1}
                            firstIcon={topLeftIcon}
                            secondIcon={topRightIcon}
                            thirdIcon={bottomRightIcon}
                            fourthIcon={bottomLeftIcon}
                        />
                        <ResponsiveMeasurementControls
                            label={__('Container Padding', 'kadence-blocks')}
                            value={get(configuration, [blockSlug, 'containerPadding'], ['', '', '', ''])}
                            tabletValue={get(configuration, [blockSlug, 'containerTabletPadding'], ['', '', '', ''])}
                            mobileValue={get(configuration, [blockSlug, 'containerMobilePadding'], ['', '', '', ''])}
                            onChange={(value) => saveConfigState('containerPadding', value)}
                            onChangeTablet={(value) => saveConfigState('containerTabletPadding', value)}
                            onChangeMobile={(value) => saveConfigState('containerMobilePadding', value)}
                            min={paddingMin}
                            max={paddingMax}
                            step={paddingStep}
                            unit={paddingType}
                            units={['px', 'em', 'rem', '%']}
                            onUnit={(value) => saveConfigState('paddingType', value)}
                        />
                        <ResponsiveMeasurementControls
                            label={__('Container Margin', 'kadence-blocks')}
                            value={get(configuration, [blockSlug, 'containerMargin'], ['', '', '', ''])}
                            tabletValue={get(configuration, [blockSlug, 'containerTabletMargin'], ['', '', '', ''])}
                            mobileValue={get(configuration, [blockSlug, 'containerMobileMargin'], ['', '', '', ''])}
                            onChange={(value) => saveConfigState('containerMargin', value)}
                            onChangeTablet={(value) => saveConfigState('containerTabletMargin', value)}
                            onChangeMobile={(value) => saveConfigState('containerMobileMargin', value)}
                            min={marginMin}
                            max={marginMax}
                            step={marginStep}
                            unit={marginType}
                            units={['px', 'em', 'rem', '%', 'vh']}
                            onUnit={(value) => saveConfigState('marginType', value)}
                        />
                    </PanelBody>

                    <PanelBody
                        title={__('Visibility Settings', 'kadence-blocks')}
                    >
                        <ToggleControl
                            label={__('Hide on Desktop', 'kadence-blocks')}
                            checked={get(configuration, [blockSlug, 'vsdesk'], false)}
                            onChange={(value) => saveConfigState('vsdesk', value)}
                        />
                        <ToggleControl
                            label={__('Hide on Tablet', 'kadence-blocks')}
                            checked={get(configuration, [blockSlug, 'vstablet'], false)}
                            onChange={(value) => saveConfigState('vstablet', value)}
                        />
                        <ToggleControl
                            label={__('Hide on Mobile', 'kadence-blocks')}
                            checked={get(configuration, [blockSlug, 'vsmobile'], false)}
                            onChange={(value) => saveConfigState('vsmobile', value)}
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

export default KadenceCountdown;
