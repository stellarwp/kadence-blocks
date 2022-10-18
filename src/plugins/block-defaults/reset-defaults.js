import { __ } from '@wordpress/i18n';
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

    const [ includeVisbility, setIncludeVisibility ] = useState(true );
    const [ isConfirmOpen, setIsConfirmOpen ] = useState(false);
    const {createErrorNotice} = useDispatch(noticesStore);

    const reset = () => {
        apiFetch( {
            path: '/wp/v2/settings',
            method: 'POST',
            data: { kadence_blocks_config_blocks: JSON.stringify( {} )},
        } ).then( () => {
            createErrorNotice(__('Block defaults reset', 'kadence-blocks'), {
                type: 'snackbar',
            })
            kadence_blocks_params.configuration = JSON.stringify({});
            setIsConfirmOpen(false);
        });
    }

    return (
        <Fragment>

            <p>{ __('Reset all custom block defaults. This will not modify any existing blocks.', 'kadence-blocks' ) }</p>

            <Button isDestructive={ true } onClick={ () => setIsConfirmOpen(true)}>Reset</Button>

            <ConfirmDialog
                isOpen={isConfirmOpen}
                onConfirm={() => reset()}
                onCancel={() => setIsConfirmOpen(false)}
            >
                {__('Are you sure you\'d like to reset all block defaults?', 'kadence-blocks')}
            </ConfirmDialog>
        </Fragment>
    );
}

export default ResetDefaults;
