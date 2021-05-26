/**
 * Icon Component
 *
 */

import FontIconPicker from '@fonticonpicker/react-fonticonpicker';
import IconRender from '../../components/icons/icon-render';
const {
	applyFilters,
} = wp.hooks;

const {
	Fragment,
	Component,
} = wp.element;

/**
 * Build the Icon controls
 * @returns {object} Icon settings.
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
		this.setState( { iconOptionsNames: applyFilters( 'kadence.icon_options_names', kadence_blocks_params.icon_names ) } );
	}
	render() {
		//console.log( kadence_blocks_params.icon_names );
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
