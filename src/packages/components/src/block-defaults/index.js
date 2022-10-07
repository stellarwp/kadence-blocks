import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import  KadencePanelBody from '../panel-body/index.js';
import {__} from "@wordpress/i18n";
import { omit } from 'lodash';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import {
    Button,
    __experimentalConfirmDialog as ConfirmDialog
} from '@wordpress/components';

export default function KadenceBlockDefaults( { attributes, blockSlug, excludedAttrs = [] } ) {

    const alwaysExclude = [ 'uniqueID' ];

    const { createErrorNotice } = useDispatch( noticesStore );

    const [ isOpenResetConfirm, setIsOpenResetConfirm ] = useState( false );
    const [ isOpenSaveConfirm, setIsOpenSaveConfirm ] = useState( false );

    const calculate = () => {
        const allExcludedAttrs = alwaysExclude.concat( excludedAttrs );

        return omit( attributes, allExcludedAttrs );
    }

    const reset = () => {
        createErrorNotice( __( 'Block defaults reset', 'kadence-blocks' ), {
            type: 'snackbar',
        } );

        setIsOpenResetConfirm( false );
    }

    const save = () => {

        const newConfig = calculate();

        const config = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : {} );
        config[ blockSlug ] = newConfig;

        const settingModel = new wp.api.models.Settings( { kadence_blocks_config_blocks: JSON.stringify( config ) } );
        settingModel.save().then( response => {
            createErrorNotice(__('Block defaults saved', 'kadence-blocks'), {
                type: 'snackbar',
            })

            setIsOpenSaveConfirm( false );
            kadence_blocks_params.configuration = JSON.stringify( config );
        } );
    }

    return (
        <>
            <KadencePanelBody
                title={__('Block Defaults', 'kadence-blocks')}
                initialOpen={false}
            >
                { __('This will set the current block attributes as the default styles for this block type.', 'kadence-blocks') }&nbsp;
                { __('Block content is not included.', 'kadence-blocks') }&nbsp;
                { __('This will not change blocks that have already been created.', 'kadence-blocks' ) }

                <br/><br/>

                <Button isPrimary={ true } onClick={ () => setIsOpenSaveConfirm( true ) }>{ __(' Save current block as default', 'kadence-blocks' ) }</Button>

                <br/><br/>

                <a href={ '#' } onClick={ () => setIsOpenResetConfirm( true ) }>{ __( 'Reset defaults', 'kadence-blocks' ) }</a>

            </KadencePanelBody>

            <ConfirmDialog
                isOpen={ isOpenResetConfirm }
                onConfirm={ () => reset() }
                onCancel={ () => setIsOpenResetConfirm( false ) }
            >
                { __('Are you sure you\'d like to reset this blocks default attributes?', 'kadence-blocks') }
            </ConfirmDialog>

            <ConfirmDialog
                isOpen={ isOpenSaveConfirm }
                onConfirm={ () => save() }
                onCancel={ () => setIsOpenSaveConfirm( false ) }
            >
                { __('Are you sure you\'d like to save this as the blocks default attributes?', 'kadence-blocks') }
            </ConfirmDialog>
        </>
    );
}