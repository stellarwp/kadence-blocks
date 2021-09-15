  /**
  * External Dependencies
  */
   import debounce from 'lodash/debounce';

 /**
  * WordPress dependencies
  */
 import { __ } from '@wordpress/i18n';
 import { Fragment, Component } from '@wordpress/element';
 import { Button, withFilters, Popover, ExternalLink, Toolbar } from '@wordpress/components';
 import { createRef } from '@wordpress/element';

 /**
  * Internal Dependencies
  */
  import icons from './icons';
 /**
 * Build the Dynamic Link controls
 */
class DynamicTextControl extends Component {
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
			<Toolbar>
				<Button
					className="kb-dynamic-menu"
					icon={ icons.dynamic }
					onClick={ () => this.debouncedToggle() }
					isPressed={ false }
					aria-haspopup="true"
					aria-expanded={ open }
					label={  __( 'Dynamic Content', 'kadence-blocks' ) }
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
								<h2>{ __( 'Dynamic Content', 'kadence-blocks-pro' ) } </h2>
								<p>{ __( 'Create dynamic sites by populating content from various sources.', 'kadence-blocks-pro' ) } </p>
								<ExternalLink href={ 'https://www.kadencewp.com/kadence-blocks/pro/' }>{ __( 'Upgrade to Pro', 'kadence-blocks-pro' ) }</ExternalLink>
							</div>
						</div>
					</Popover>
				) }
			</Toolbar>
		);
	}
 };
 
 export default withFilters( 'kadence.TextDynamicControl' )( DynamicTextControl );
 