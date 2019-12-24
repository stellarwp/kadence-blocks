/**
 * Typography Component
 *
 */
import GenIcon from './genicon';
import Ico from './svgicons';
import FaIco from './faicons';

const {
	applyFilters,
} = wp.hooks;

const {
	Fragment,
	Component,
} = wp.element;

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
		const icons = { ...Ico, ...FaIco };
		this.setState( { iconOptions: applyFilters( 'kadence.icon_options', icons ) } );
	}
	updateIcons() {
		const icons = { ...Ico, ...FaIco };
		const filteredIcons = applyFilters( 'kadence.icon_options', icons );
		this.setState( { iconOptions: filteredIcons } );
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
			<Fragment>
				<GenIcon name={ name } icon={ iconOptions[ name ] } { ...this.props } />
			</Fragment>
		);
	}
}
export default ( IconRender );
