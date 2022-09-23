import {
    Component,
    Fragment,
    useState
} from "@wordpress/element";
import {
    Dashicon,
    Tooltip,
    SelectControl,
    Button,
    Modal
} from '@wordpress/components';
import {map} from 'lodash';
import {useDispatch} from '@wordpress/data';
import {store as noticesStore} from '@wordpress/notices';


/**
 * Internal block libraries
 */
import {__} from '@wordpress/i18n';

function KadenceVisibilitySettings({blockSlug, blockName, options}) {

    const [isOpen, setIsOpen] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState((kadence_blocks_params.settings ? JSON.parse(kadence_blocks_params.settings) : {}));
    const {createErrorNotice} = useDispatch(noticesStore);

    const saveConfig = (blockID, settingArray) => {

        setIsSaving(true);

        const config = (kadence_blocks_params.settings ? JSON.parse(kadence_blocks_params.settings) : {});
        if (!config[blockID]) {
            config[blockID] = {};
        }
        config[blockID] = settingArray;
        const settingModel = new wp.api.models.Settings({kadence_blocks_settings_blocks: JSON.stringify(config)});

        settingModel.save().then(response => {
            createErrorNotice(__(blockName + ' ' + __('block defaults saved!', 'kadence-blocks')), {
                type: 'snackbar',
            })

            setIsSaving(false);
            setSettings(config);
            setIsOpen(false);
            setHasChanges(false);

            kadence_blocks_params.settings = JSON.stringify(config);

        });
    }

    const saveConfigState = (key, value) => {
        const config = settings;

        if (!config['kadence/' + blockSlug]) {
            config['kadence/' + blockSlug] = {};
        }
        config['kadence/' + blockSlug][key] = value;

        setHasChanges(true);
        setSettings(config);
    }

    const resetSettings = () => {
        const config = (kadence_blocks_params.settings ? JSON.parse(kadence_blocks_params.settings) : {});
        setSettings(config);

        setHasChanges(false);
        setIsOpen(false);
    }

    const blockSettings = (settings && settings['kadence/' + blockSlug] ? settings['kadence/' + blockSlug] : {});


    return (
        <Fragment>
            <Tooltip text="Block Settings Visibility">
                <Button className="kt-block-settings" onClick={() => setIsOpen(true)}>
                    <Dashicon icon="visibility"/>
                </Button>
            </Tooltip>

            {isOpen &&
                <Modal
                    className="kt-block-settings-modal"
                    title={__(blockName + ' Settings', 'kadence-blocks')}
                    onRequestClose={() => {
                        resetSettings();
                    }}>

                    <h2>{__('Control All Block Settings', 'kadence-blocks')}</h2>

                    <SelectControl
                        label={__('Enabled All Settings For', 'kadence-blocks')}
                        value={(blockSettings.allSettings ? blockSettings.allSettings : 'all')}
                        options={[
                            {value: 'all', label: __('All Users', 'kadence-blocks')},
                            {value: 'contributor', label: __('Minimum User Role Contributor', 'kadence-blocks')},
                            {value: 'author', label: __('Minimum User Role Author', 'kadence-blocks')},
                            {value: 'editor', label: __('Minimum User Role Editor', 'kadence-blocks')},
                            {value: 'admin', label: __('Minimum User Role Admin', 'kadence-blocks')},
                            {value: 'none', label: __('No Users', 'kadence-blocks')},
                        ]}
                        onChange={ ( value ) => saveConfigState('allSettings', value)}
                    />

                    <h2>{__('Control Individual Settings Groups', 'kadence-blocks')}</h2>

                    {map(options, ({key, label}) => (
                        <SelectControl
                            label={label}
                            value={(blockSettings[key] ? blockSettings[key] : 'all')}
                            options={[
                                {value: 'all', label: __('All Users', 'kadence-blocks')},
                                {value: 'contributor', label: __('Minimum User Role Contributor', 'kadence-blocks')},
                                {value: 'author', label: __('Minimum User Role Author', 'kadence-blocks')},
                                {value: 'editor', label: __('Minimum User Role Editor', 'kadence-blocks')},
                                {value: 'admin', label: __('Minimum User Role Admin', 'kadence-blocks')},
                                {value: 'none', label: __('No Users', 'kadence-blocks')},
                            ]}
                            onChange={ ( value ) => saveConfigState(key, value)}
                        />
                    ))}

                    <Button className="kt-settings-save" isPrimary isBusy={isSaving} disabled={!hasChanges}
                            onClick={() => {
                                saveConfig('kadence/' + blockSlug, blockSettings);
                            }}>

                        {__('Save', 'kadence-blocks')}

                    </Button>

                    <Button className="kt-settings-save" isDestructive style={{float: 'right'}}
                            onClick={() => {
                                resetSettings();
                            }}>
                        {__('Close', 'kadence-blocks')}
                    </Button>
                </Modal>
            }
        </Fragment>
    );

}

export default KadenceVisibilitySettings;
