import { omit, isEqual, head } from 'lodash';

/**
 * Gets attributes from a kadence block that can be transfered to another block via block defaults or copy/pasting.
 */
export default function getTransferableAttributes( attributes, defaultAttributes = {}, excludedAttrs = [], preventMultiple = [] ) {
    let attributesToTransfer = {};
    
    //some attributes should never be transferred to a new block
	const alwaysExclude = [ 'uniqueID', 'inQueryBlock', 'anchor' ];
    const allExcludedAttrs = alwaysExclude.concat(excludedAttrs);
    attributesToTransfer = omit(attributes, allExcludedAttrs);
    
    //preventing multiples of some attributes can save space / complexity
    if (preventMultiple !== []) {
        preventMultiple.forEach((item) => {
            attributesToTransfer[item] = [head(attributesToTransfer[item])];
        });
    }

    // we don't need to transfer attributes that are the default.
    // if provided, compare to the block's defaults and delete (assumed from block.json)
    Object.keys(attributesToTransfer).map((key, index) => {
        if ( undefined !== defaultAttributes[key] && undefined !== defaultAttributes[key].default ) {
            if ( isEqual(attributesToTransfer[key], defaultAttributes[key].default ) ) {
                delete(attributesToTransfer[key])
            }
        }
    });

    return attributesToTransfer;
}