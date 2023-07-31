/**
 * Decides based on context if this block is indeed in a query or repeater block
 */
export default function getInQueryBlock( context, inQueryBlock ) {
    const inQueryContext = Boolean( context && ( context.queryId || Number.isFinite( context.queryId ) ) && context.postId );
    const inRepeaterContext = Boolean( context && 'undefined' != typeof( context['kadence/dynamicSource'] ) && context['kadence/dynamicSource'] );

    if ( inQueryContext || inRepeaterContext ) {
        return true;
    }
    return false;
}