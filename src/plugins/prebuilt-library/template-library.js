
import TemplatesLibrary from './templates-library';
import SingleTemplateLibrary from './single-template-library';

/**
 * WordPress dependencies
 */
import {
	Component,
	Fragment,
} from '@wordpress/element';

/**
 * Template library
 */
class TemplateLibrary extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			view: 'templates',
			selectedSlug: null,
			selectedURL: null,
			selectedName: null,
		};
	}
	render() {
		return (
			<Fragment>
				{ this.state.view === 'templates' && (
					<TemplatesLibrary
						clientId={ this.props.clientId }
						reload={ this.props.reload }
						onSelectTemplate={ ( { name, slug, url } ) => {
							this.setState( { selectedSlug: slug, selectedName: name, selectedURL: url, view: 'single' } );
						} }
						onReload={ () => this.props.onReload() }
					/>
				) }
				{ this.state.view === 'single' && (
					<SingleTemplateLibrary
						clientId={ this.props.clientId }
						selectedSlug={ this.state.selectedSlug }
						selectedName={ this.state.selectedName }
						selectedURL={ this.state.selectedURL }
						reload={ this.props.reload }
						onReload={ () => this.props.onReload() }
						onBack={ () => this.setState( { selectedSlug: null, selectedName: null, selectedURL: null, view: 'templates' } ) }
					/>
				) }
			</Fragment>
		);
	}
}
export default TemplateLibrary;
