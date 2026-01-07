/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import { withFilters } from '@wordpress/components';

/**
 * Build the Dynamic Inline Replace controls (all replaced by Pro)
 */
class DynamicInlineReplaceControl extends Component {
	render() {
		return null;
	}
};

export default withFilters( 'kadence.InlineReplaceDynamicControl' )( DynamicInlineReplaceControl );
