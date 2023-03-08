/**
 * Typography Component
 *
 */
import GenIcon from '../gen-icon';
import { applyFilters } from '@wordpress/hooks';

import { Fragment, Component } from '@wordpress/element';

/**
 * Build the typography controls
 * @returns {object} typography settings.
 */
class IconRender extends Component {
	constructor() {
		super( ...arguments );
		this.updateIcons = this.updateIcons.bind( this );
		this.state = {
			iconOptions: undefined,
		};
	}
	componentDidMount() {
		const icons = { ...kadence_blocks_params_ico.icons, ...kadence_blocks_params_fa.icons };
		this.setState( { iconOptions: applyFilters( 'kadence.icon_options', icons ) } );
	}
	updateIcons() {
		const icons = { ...kadence_blocks_params_ico.icons, ...kadence_blocks_params_fa.icons };
		const filteredIcons = applyFilters( 'kadence.icon_options', icons );
		return filteredIcons;
	}
	render() {
		const {
			name,
		} = this.props;
		let { iconOptions } = this.state;
		if ( ! iconOptions ) {
			iconOptions = this.updateIcons();
		}
		return (
			<>
				<GenIcon name={ name } icon={ iconOptions[ name ] } { ...this.props } />
			</>
		);
	}
}
export default ( IconRender );
