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
import {advancedFormIcon} from '@kadence/icons';

function KadenceAdvancedForm(props) {

    return (
        <Fragment>
            <Button className="kt-block-defaults" onClick={() => setIsOpen( true)}>
                <span className="kt-block-icon">{advancedFormIcon}</span>
                {__('Advanced Form', 'kadence-blocks')}
            </Button>
            {isOpen ?
                <Modal
                    className="kt-block-defaults-modal"
                    title={__('Kadence Countdown')}
                    onRequestClose={() => {
                        saveConfig(configuration);
                    }}>

                    {/*TODO */}

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
                : null}
        </Fragment>
    );
}

export default KadenceAdvancedForm;
