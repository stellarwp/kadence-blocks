/**
 * Decides based on context and current inQueryBlock state if this block is indeed in a query block
 */
export default function getUniqueId( context, inQueryBlock ) {
    if ( context && context.queryId && context.postId ) {
        if ( ! inQueryBlock ) {
            return true;
        }
    } else if ( inQueryBlock ) {
        return false;
    }
    return inQueryBlock;
}