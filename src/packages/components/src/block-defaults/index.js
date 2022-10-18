import {useEffect, useState} from '@wordpress/element';
import {useSelect} from '@wordpress/data';
import KadencePanelBody from '../panel-body/index.js';
import {__} from "@wordpress/i18n";
import {omit, head, get, isEqual} from 'lodash';
import {useDispatch} from '@wordpress/data';
import {store as noticesStore} from '@wordpress/notices';
import {
    Button,
    Modal,
    __experimentalConfirmDialog as ConfirmDialog
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { SafeParseJSON } from '@kadence/helpers'
/**
 * Display Kadence Block Default settings -- intended for use in Inspector Controls.
 *
 * @param {object} attributes Block attributes.
 * @param {object} defaultAttributes The blocks default attributs for comparison on what is new.
 * @param {string} blockSlug Block slug.
 * @param {object} attributeNamePair Key value pair of attribute name and attribute label.
 * @param {array} excludedAttrs Keys to exclude from saved block defaults. An array of strings.
 * @param {array} preventMultiple Keys that should not have more than one subitem. An array of strings.
 *
 * @public
 */
export default function KadenceBlockDefaults({attributes, defaultAttributes = {}, blockSlug, excludedAttrs = [], preventMultiple = []}) {

	const [ user, setUser ] = useState( ( kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin' ) );
	if( user !== 'admin' ) {
		return null;
	}

	const alwaysExclude = [ 'uniqueID', 'inQueryBlock', 'anchor' ];

	const {createErrorNotice} = useDispatch(noticesStore);

	const [isOpenResetConfirm, setIsOpenResetConfirm] = useState(false);
	const [isOpenSaveConfirm, setIsOpenSaveConfirm] = useState(false);
	const [isOpenModify, setIsOpenModify] = useState(false);

	const currentDefaults = SafeParseJSON(get(kadence_blocks_params, ['configuration'], {}), true );
	const currentBlockDefaults = get(currentDefaults, blockSlug, {});

	const [tmpDefaults, setTmpDefaults] = useState(currentBlockDefaults);
	const hasConfig = Object.keys(currentBlockDefaults).length !== 0;

	const calculate = () => {
		const allExcludedAttrs = alwaysExclude.concat(excludedAttrs);

		let newConfig = omit(attributes, allExcludedAttrs);

		if (preventMultiple !== []) {

			preventMultiple.forEach((item) => {
				newConfig[item] = [head(newConfig[item])];
			});

		}
		// Since block attributes have their defaults set in the editor, lets check if the default is the same default as the block and exclude those to keep the settings simpler.
		Object.keys(newConfig).map((key, index) => {
			if ( undefined !== defaultAttributes[key] && undefined !== defaultAttributes[key].default ) {
				if ( isEqual(newConfig[key], defaultAttributes[key].default ) ) {
					delete(newConfig[key])
				}
			}
		});
		return newConfig;
	}

    const reset = () => {
        let config = (kadence_blocks_params.configuration ? SafeParseJSON(kadence_blocks_params.configuration, true) : {});
		config = omit(config, blockSlug);

		apiFetch( {
			path: '/wp/v2/settings',
			method: 'POST',
			data: { kadence_blocks_config_blocks: JSON.stringify(config)},
		} ).then( () => {
			createErrorNotice(__('Block default saved', 'kadence-blocks'), {
                type: 'snackbar',
            })
            setIsOpenResetConfirm(false);
            kadence_blocks_params.configuration = JSON.stringify(config);
            setTmpDefaults({});
		});

    }

    const saveAll = () => {

        const newConfig = calculate();

        const config = (kadence_blocks_params.configuration ? SafeParseJSON(kadence_blocks_params.configuration, true) : {});
        config[blockSlug] = newConfig;
		apiFetch( {
			path: '/wp/v2/settings',
			method: 'POST',
			data: { kadence_blocks_config_blocks: JSON.stringify(config)},
		} ).then( () => {
			createErrorNotice(__('Block default saved', 'kadence-blocks'), {
				type: 'snackbar',
			})
			setIsOpenSaveConfirm(false);
			kadence_blocks_params.configuration = JSON.stringify(config);
			setTmpDefaults(newConfig);
		});
    }

    const saveModified = () => {

        const config = (kadence_blocks_params.configuration ? SafeParseJSON(kadence_blocks_params.configuration, true) : {});
        config[blockSlug] = tmpDefaults;
		apiFetch( {
			path: '/wp/v2/settings',
			method: 'POST',
			data: { kadence_blocks_config_blocks: JSON.stringify(config)},
		} ).then( () => {
			createErrorNotice(__('Block default saved', 'kadence-blocks'), {
				type: 'snackbar',
			})
			kadence_blocks_params.configuration = JSON.stringify(config);
		});
    }

    return (
        <>
            <KadencePanelBody
                title={__('Block Defaults', 'kadence-blocks')}
                initialOpen={false}
            >
                {__('This will set the current block attributes as the default styles for this block.', 'kadence-blocks')}&nbsp;
                {__('This will not modify any blocks that have already been created.', 'kadence-blocks')}&nbsp;
                {__('Block content is not included.', 'kadence-blocks')}&nbsp;

                <br/><br/>

                <Button isPrimary={true}
                        onClick={() => setIsOpenSaveConfirm(true)}>{__(' Save as default', 'kadence-blocks')}</Button>

                {hasConfig && (
                    <>
                        <br/><br/>

                        <a href={'#'}
                           onClick={() => setIsOpenModify(true)}>{__('Modify attributes', 'kadence-blocks')}</a>

                        <a href={'#'} style={{color: 'red', float: 'right'}}
                           onClick={() => setIsOpenResetConfirm(true)}>{__('Reset defaults', 'kadence-blocks')}</a>
                    </>
                )}

            </KadencePanelBody>

            <ConfirmDialog
                isOpen={isOpenResetConfirm}
                onConfirm={() => reset()}
                onCancel={() => setIsOpenResetConfirm(false)}
            >
                {__('Are you sure you\'d like to reset this blocks default attributes?', 'kadence-blocks')}
            </ConfirmDialog>

            <ConfirmDialog
                isOpen={isOpenSaveConfirm}
                onConfirm={() => saveAll()}
                onCancel={() => setIsOpenSaveConfirm(false)}
            >
                {__('Are you sure you\'d like to save this as the blocks default attributes?', 'kadence-blocks')}
            </ConfirmDialog>

            {isOpenModify ?
                <Modal
                    className="kt-block-defaults-modal"
                    title={__('Modify Block Defaults', 'kadence-blocks')}
                    onRequestClose={() => {
                        setTmpDefaults(currentBlockDefaults);
                        setIsOpenModify(false);
                    }}>

                    {
                        Object.keys(tmpDefaults).map((key, i) => {

                            return (
                                <>
                                    <div key={i} style={ { marginBottom: '10px' } }>
                                        <Button onClick={() => setTmpDefaults(omit(tmpDefaults, key))}>
                                            <span className="dashicons dashicons-trash"></span>
                                        </Button>
                                        <span style={{verticalAlign: 'super'}}>{key}</span>
                                    </div>
                                </>
                            )
                        })
                    }

                    <div className="kb-modal-footer">
                        <Button className="kt-defaults-save" isDestructive
                                disabled={false}
                                onClick={() => {
                                    setTmpDefaults(currentBlockDefaults);
                                    setIsOpenModify(false);
                                }}>
                            {__('Cancel', 'kadence-blocks')}
                        </Button>

                        <Button className="kt-defaults-save" isPrimary onClick={() => {
                            saveModified();
                            setIsOpenModify(false);
                        }}>
                            {__('Save', 'kadence-blocks')}
                        </Button>
                    </div>
                </Modal>
                : null}
        </>
    );
}