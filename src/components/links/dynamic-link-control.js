  /**
  * External Dependencies
  */
   import debounce from 'lodash/debounce';

 /**
  * WordPress dependencies
  */
 import { __ } from '@wordpress/i18n';
 import { Fragment, Component } from '@wordpress/element';
 import { Button, withFilters, Popover, ExternalLink } from '@wordpress/components';
 import { createRef } from '@wordpress/element';

 /**
  * Internal Dependencies
  */
  import icons from '../common/icons';
 /**
 * Build the Dynamic Link controls
 */
class DynamicLinkControl extends Component {
	constructor() {
        super( ...arguments );

        this.toggle = this.toggle.bind( this );
        this.state = {
            open: false,
        };
		this.popRef = createRef();
		this.debouncedToggle = debounce( this.toggle.bind( this ), 100 );
    }
	toggle() {
        this.setState( { open: ! this.state.open } );
    }
    render() {
		const { open } = this.state;
		return (
			<Fragment>
				<Button
					className="kb-dynamic-url-sidebar"
					icon={ icons.dynamic }
					onClick={ () => this.debouncedToggle() }
					isPressed={ false }
					aria-haspopup="true"
					aria-expanded={ open }
					label={  __( 'Dynamic Link', 'kadence-blocks' ) }
					showTooltip={ true }
				/>
				{ open && (
					<Popover
						className="kb-dynamic-popover"
						position="bottom left"
						onClick={ () => {} }
						expandOnMobile={ true }
						onClose={ () => this.debouncedToggle() }
						ref={ this.popRef }
					>
						<div className="kb-dynamic-popover-inner-wrap">
							<div className="kb-pro-notice">
								<h2>{ __( 'Dynamic links', 'kadence-blocks' ) } </h2>
								<p>{ __( 'Create dynamic sites by populating links from various sources.', 'kadence-blocks' ) } </p>
								<ExternalLink href={ 'https://www.kadenceblocks.com/pro/' }>{ __( 'Upgrade to Pro', 'kadence-blocks' ) }</ExternalLink>
							</div>
						</div>
					</Popover>
				) }
			</Fragment>
		);
	}
 };
 
 export default withFilters( 'kadence.URLInputDynamicControl' )( DynamicLinkControl );
 