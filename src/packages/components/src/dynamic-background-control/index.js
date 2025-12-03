/**
 * External Dependencies
 */
import { debounce } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import { Button, withFilters, Popover, ExternalLink } from '@wordpress/components';
import { createRef } from '@wordpress/element';

/**
 * Internal Dependencies
 */

/**
 * Build the Dynamic Background controls
 */
class DynamicBackgroundControl extends Component {
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

		// @todo: Replace with icon from @kadence/icons once created
		const icons = {};
		icons.dynamic = <svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
		>
			<path d="M4 5.002s.003-.095.213-.288c.245-.225.671-.483 1.306-.73C7.018 3.399 9.34 3 12 3s4.982.399 6.482.984c.634.247 1.061.505 1.306.73.205.189.212.281.212.288 0 .003-.007.095-.213.284-.245.225-.671.483-1.306.73C16.982 6.601 14.66 7 12 7s-4.982-.399-6.482-.984c-.634-.247-1.061-.505-1.306-.73C4.004 5.094 4 5.002 4 5.002zm16 9.53v4.471a.779.779 0 01-.217.291c-.245.225-.671.482-1.303.728-1.495.582-3.809.978-6.48.978s-4.985-.396-6.48-.978c-.633-.246-1.058-.503-1.303-.728a.865.865 0 01-.199-.242l-.006-4.514c.248.126.51.242.782.348C6.591 15.585 9.171 16 12 16s5.409-.415 7.206-1.114c.277-.108.543-.225.794-.354zm0-7.005v4.476a.779.779 0 01-.217.291c-.245.225-.671.482-1.303.728-1.495.582-3.809.978-6.48.978s-4.985-.396-6.48-.978c-.633-.246-1.058-.503-1.303-.728a.865.865 0 01-.199-.242 1.109 1.109 0 00-.009-.117l-.005-4.407c.248.128.513.244.788.352C6.593 8.582 9.18 9 12 9s5.407-.418 7.208-1.12A8.69 8.69 0 0020 7.527zM2 5v14c0 .058.002.116.007.174.057.665.425 1.197.857 1.594.498.457 1.175.824 1.93 1.118C6.591 22.585 9.171 23 12 23s5.409-.415 7.206-1.114c.755-.294 1.432-.661 1.93-1.118.432-.397.8-.929.857-1.594.005-.058.007-.116.007-.174V5c0-.056-.002-.112-.007-.168-.055-.664-.422-1.195-.852-1.59-.498-.459-1.177-.827-1.933-1.122C17.407 1.418 14.82 1 12 1s-5.407.418-7.208 1.12c-.756.295-1.435.664-1.933 1.122-.43.395-.797.927-.852 1.59A1.887 1.887 0 002 5z"></path>
		</svg>;

		return (
			<div className="kb-dynamic-background-sidebar-wrap">
				<Button
					className="kb-dynamic-background-sidebar"
					isTertiary
					icon={ icons.dynamic }
					onClick={ () => this.debouncedToggle() }
					isPressed={ open }
					aria-haspopup="true"
					aria-expanded={ open }
					label={  __( 'Dynamic Background Image', 'kadence-blocks' ) }
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
								<h2>{ __( 'Dynamic Background Image', 'kadence-blocks' ) } </h2>
								<p>{ __( 'Create dynamic sites by populating background images from various sources.', 'kadence-blocks' ) } </p>
								<ExternalLink href={ 'https://www.kadencewp.com/kadence-blocks/pro/?utm_source=in-app&utm_medium=kadence-blocks&utm_campaign=dynamic-content' }>{ __( 'Upgrade to Pro', 'kadence-blocks' ) }</ExternalLink>
							</div>
						</div>
					</Popover>
				) }
			</div>
		);
	}
};

export default withFilters( 'kadence.BackgroundDynamicControl' )( DynamicBackgroundControl );
