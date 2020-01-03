/**
 * Typography Component
 *
 */

import FontIconPicker from '@fonticonpicker/react-fonticonpicker';
import IcoNames from './svgiconsnames';
import IconRender from './icon-render';
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
class IconControl extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			iconOptions: [],
			iconOptionsNames: [],
		};
	}
	componentDidMount() {
		this.setState( { iconOptionsNames: applyFilters( 'kadence.icon_options_names', IcoNames ) } );
	}
	render() {
		const {
			value,
			onChange,
		} = this.props;
		const { iconOptionsNames } = this.state;
		const renderSVG = svg => (
			<IconRender name={ svg } />
		);
		return (
			<Fragment>
				{ onChange && (
					<div className="kb-icon-picker-container">
						<FontIconPicker
							icons={ iconOptionsNames }
							value={ value }
							onChange={ ( select ) => onChange( select ) }
							appendTo="body"
							renderFunc={ renderSVG }
							theme="default"
							isMulti={ false }
						/>
					</div>
				) }
			</Fragment>
		);
	}
}
export default ( IconControl );
