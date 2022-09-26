/**
 * WordPress dependencies
 */
import {InspectorControls} from '@wordpress/block-editor';
import {showSettings} from '@kadence/helpers';

function KadenceInspectorControls({
                                      children,
                                      blockSlug = false,
                                      settingSlug = 'allSettings'
                                  }) {

    /* If the block slug is set, check the panel name against the allowed settings for the user */
    if (blockSlug !== false && !showSettings(settingSlug, blockSlug)) {
        return null;
    }

    return (
        <InspectorControls>
            {children}
        </InspectorControls>
    )
}

export default KadenceInspectorControls;

