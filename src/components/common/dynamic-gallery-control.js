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
 * Build the Dynamic Image controls
 */
class DynamicGalleryControl extends Component {
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
			<div className="kb-dynamic-image-sidebar-wrap kb-dynamic-gallery-sidebar-wrap">
				<Button
					className="kb-dynamic-image-sidebar kb-dynamic-gallery-sidebar"
					isTertiary
					icon={ icons.dynamic }
					onClick={ () => this.debouncedToggle() }
					isPressed={ open }
					aria-haspopup="true"
					aria-expanded={ open }
					label={  __( 'Dynamic Gallery', 'kadence-blocks' ) }
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
								<h2>{ __( 'Dynamic Gallery', 'kadence-blocks' ) } </h2>
								<p>{ __( 'Create dynamic sites by populating images from various sources.', 'kadence-blocks' ) } </p>
								<ExternalLink href={ 'https://www.kadencewp.com/kadence-blocks/pro/?utm_source=in-app&utm_medium=kadence-blocks&utm_campaign=dynamic-content' }>{ __( 'Upgrade to Pro', 'kadence-blocks' ) }</ExternalLink>
							</div>
						</div>
					</Popover>
				) }
			</div>
		);
	}
 };
 
 export default withFilters( 'kadence.GalleryDynamicControl' )( DynamicGalleryControl );
 