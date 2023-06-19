/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, withFilters, Popover, ExternalLink } from '@wordpress/components';
import { createRef, Fragment, Component } from '@wordpress/element';
import { debounce } from 'lodash';
import { applyFilters } from '@wordpress/hooks'
import { useState } from '@wordpress/element';

/**
 * External dependencies
 */
import { dynamic } from '@kadence/icons';

function DynamicFormInputControl() {
    const [popoverAnchor, setPopoverAnchor] = useState();
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisible = () => {
        setIsVisible( ! isVisible );
    }
    const debounceToggle = debounce( toggleVisible, 100 );
	return (
		<div className="kb-dynamic-form-input-sidebar-wrap">
			<Button
				className="kb-dynamic-form-input-sidebar"
				icon={ dynamic }
				onClick={ () => debounceToggle() }
				ref={ setPopoverAnchor }
				isPressed={ isVisible }
				aria-haspopup="true"
				aria-expanded={ isVisible }
				label={  __( 'Dynamic Content', 'kadence-blocks' ) }
				showTooltip={ true }
			/>
            {isVisible &&
                <Popover
                    headerTitle={ __('Select Dynamic Source', 'kadence-blocks') }
                    noArrow={false}
                    onClose={debounceToggle}
                    placement="bottom-end"
                    anchor={popoverAnchor}
                    className={ `kb-dynamic-popover`}
                >
					<div className="kb-dynamic-popover-inner-wrap">
						<div className="kb-pro-notice">
							<h2>{ __( 'Dynamic Content', 'kadence-blocks-pro' ) } </h2>
							<p>{ __( 'Create dynamic sites by populating content from various sources.', 'kadence-blocks-pro' ) } </p>
							<ExternalLink href={ 'https://www.kadencewp.com/kadence-blocks/pro/?utm_source=in-app&utm_medium=kadence-blocks&utm_campaign=dynamic-content' }>{ __( 'Upgrade to Pro', 'kadence-blocks-pro' ) }</ExternalLink>
						</div>
					</div>
				</Popover>
            }
        </div>
    )
}
export default withFilters( 'kadence.FormInputDynamicControl' )( DynamicFormInputControl );
