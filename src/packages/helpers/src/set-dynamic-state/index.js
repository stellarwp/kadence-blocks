import { applyFilters } from '@wordpress/hooks';

/**
 * Grabs the value for a dynamic attribute and sets it using the state setter given
 */
export default function setDynamicState( filter, content, attributes, dynamicAttribute, setAttributes, setState, context, shouldSetAttribute = false ) {
    if ( attributes.kadenceDynamic && attributes.kadenceDynamic[dynamicAttribute] && attributes.kadenceDynamic[dynamicAttribute].enable ) {
        applyFilters( filter, content, attributes, dynamicAttribute, setAttributes, setState, context, shouldSetAttribute );
    }
}