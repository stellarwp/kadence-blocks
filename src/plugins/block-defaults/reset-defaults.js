import { __ } from '@wordpress/i18n';
import { SafeParseJSON } from '@kadence/helpers';
import { get } from 'lodash';

import {
    Fragment,
    useState,
} from '@wordpress/element';

import {
    Button,
    CheckboxControl,
    __experimentalConfirmDialog as ConfirmDialog
} from '@wordpress/components';

import apiFetch from '@wordpress/api-fetch';
import {useDispatch} from '@wordpress/data';
import {store as noticesStore} from '@wordpress/notices';


function ResetDefaults() {

    const [ includeVisbility, setIncludeVisibility ] = useState( true );
    const [ includeDefaults, setIncludeDefaults ] = useState( true );
    const [ isConfirmOpen, setIsConfirmOpen ] = useState(false);
    const {createErrorNotice} = useDispatch(noticesStore);

    const blockDefaults = SafeParseJSON(get(kadence_blocks_params, ['configuration'], {}), true );
    const blockVisibility = SafeParseJSON(get(kadence_blocks_params, ['settings'], {}), true );

    const reset = () => {

        if( includeDefaults ) {
            apiFetch({
                path: '/wp/v2/settings',
                method: 'POST',
                data: {kadence_blocks_config_blocks: JSON.stringify({})},
            }).then(() => {
                createErrorNotice(__('Block defaults reset', 'kadence-blocks'), {
                    type: 'snackbar',
                })
                kadence_blocks_params.configuration = JSON.stringify({});
            });
        }

        if( includeVisbility ) {
            apiFetch({
                path: '/wp/v2/settings',
                method: 'POST',
                data: {kadence_blocks_settings_blocks: JSON.stringify({})},
            }).then(() => {
                createErrorNotice(__('Block visibility reset', 'kadence-blocks'), {
                    type: 'snackbar',
                })
                kadence_blocks_params.settings = JSON.stringify({});
            });
        }

        setIsConfirmOpen(false);

    }

    return (
        <Fragment>

            <p>{ __('Reset all custom block defaults or visability settings. This will not modify any existing blocks.', 'kadence-blocks' ) }</p>

            <CheckboxControl
                label={__('Reset Block Visibility Settings', 'kadence-blocks')}
                checked={includeVisbility}
                onChange={(value) => setIncludeVisibility(value)}
                disabled={ Object.keys(blockVisibility).length === 0 }
            />

            <CheckboxControl
                label={__('Reset Block Defaults', 'kadence-blocks')}
                checked={includeDefaults}
                onChange={(value) => setIncludeDefaults(value)}
                disabled={ Object.keys(blockDefaults).length === 0 }
            />

            <Button isDestructive={ true } disabled={ Object.keys(blockDefaults).length === 0 && Object.keys(blockVisibility).length === 0 } onClick={ () => setIsConfirmOpen(true)}>Reset</Button>

            <ConfirmDialog
                isOpen={isConfirmOpen}
                onConfirm={() => reset()}
                onCancel={() => setIsConfirmOpen(false)}
            >
                {__('Are you sure you\'d like to reset these settings?', 'kadence-blocks')}
            </ConfirmDialog>
        </Fragment>
    );
}

export default ResetDefaults;
