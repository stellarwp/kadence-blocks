import {
    TypographyControls,
    MeasurementControls,
    PopColorControl
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

import { iconIcon } from '@kadence/icons';

function KadenceIcon(props) {

    const blockSlug = 'kadence/icon';
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [resetConfirm, setResetConfirm] = useState(false);
    const [configuration, setConfiguration] = useState((kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : {}));


    useEffect(() => {
        const countdownConfig = (configuration && configuration['kadence/icon'] ? configuration['kadence/icon'] : {});
        
        if (countdownConfig.containerBorderWidth && countdownConfig.containerBorderWidth[0]) {
            if (countdownConfig.containerBorderWidth[0] === countdownConfig.containerBorderWidth[1] && countdownConfig.containerBorderWidth[0] === countdownConfig.containerBorderWidth[2] && countdownConfig.containerBorderWidth[0] === countdownConfig.containerBorderWidth[3]) {
                setContainerBorderControl('linked');
            } else {
                setContainerBorderControl('individual');
            }
        }

    }, []);

    const saveConfig = (blockID, settingArray) => {
        setIsSaving(true );
        const config = (kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : {});

        if (!config[blockID]) {
            config[blockID] = {};
        }

        config[blockID] = settingArray;
        const settingModel = new wp.api.models.Settings({kadence_blocks_config_blocks: JSON.stringify(config)});

        settingModel.save().then(response => {
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
        setConfiguration(config);
    }

    const clearDefaults = (key) => {
        const config = configuration;
        if (config[blockSlug] === undefined || config[blockSlug].length == 0) {
            config[blockSlug] = {};
        }
        if (undefined !== config[blockSlug][key]) {
            delete config[blockSlug][key];
        }
        setConfiguration(config);
    }

    const clearAllDefaults = () => {
        const config = configuration;
        config[blockSlug] = {};
        setConfiguration(config);
    }
    
    return (
        <Fragment>
            <Button className="kt-block-defaults" onClick={() => setIsOpen( true)}>
                <span className="kt-block-icon">{iconIcon}</span>
                {__('Icon', 'kadence-blocks')}
            </Button>
            {isOpen ?
                <Modal
                    className="kt-block-defaults-modal"
                    title={__('Kadence Countdown')}
                    onRequestClose={() => {
                        saveConfig(configuration);
                    }}>

                    {/*TO DO*/}

                    <div className="kb-modal-footer">
                        {!resetConfirm && (
                            <Button className="kt-defaults-save" isDestructive
                                    disabled={(JSON.stringify(configuration[blockSlug]) === JSON.stringify({}) ? true : false)}
                                    onClick={() => {
                                        setResetConfirm(true );
                                    }}>
                                {__('Reset', 'kadence-blocks')}
                            </Button>
                        )}
                        {resetConfirm && (
                            <Button className="kt-defaults-save" isDestructive onClick={() => {
                                clearAllDefaults();
                                setResetConfirm(false );
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
                : null}
        </Fragment>
    );
}

export default KadenceIcon;
