/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import { withFilters } from '@wordpress/components';

/**
 * Build the Dynamic Inline Replace controls (all replaced by Pro)
 */
class DynamicInlineReplaceControl extends Component {
	constructor() {
		super( ...arguments );
	}
	render() {
		
	}
};

export default withFilters( 'kadence.InlineReplaceDynamicControl' )( DynamicInlineReplaceControl );
