if ( ktgooglefonts === undefined ) {
	var ktgooglefonts = [];
}
const {
	Component,
} = wp.element;
import PropTypes from "prop-types";
import WebFont from "webfontloader";
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
const statuses = {
	inactive: 'inactive',
	active: 'active',
	loading: 'loading',
};

const noop = () => {};

class KTWebfontLoader extends Component {
	constructor() {
		super( ...arguments );
		this.handleLoading = this.handleLoading.bind( this );
		this.handleActive = this.handleActive.bind( this );
		this.handleInactive = this.handleInactive.bind( this );
		this.loadFonts = this.loadFonts.bind( this );
		this.state = {
			status: undefined,
			mounted: false,
		};
	}
	addFont( font ) {
		if ( ! ktgooglefonts.includes( font ) ) {
			ktgooglefonts.push( font );
		}
	}
	handleLoading() {
		this.setState( { status: statuses.loading } );
	}

	handleActive() {
		this.setState( { status: statuses.active } );
	}

	handleInactive() {
		this.setState( { status: statuses.inactive } );
	}

	loadFonts() {
		if ( this.state.mounted ) {
			if ( ! ktgooglefonts.includes( this.props.config.google.families[ 0 ] ) ) {
				WebFont.load( {
					...this.props.config,
					loading: this.handleLoading,
					active: this.handleActive,
					inactive: this.handleInactive,
					context: frames['editor-canvas'],
				} );
				this.addFont( this.props.config.google.families[ 0 ] );
			}
		}
	}

	componentDidMount() {
		ktgooglefonts = [];
		this.setState( { mounted: true, device: this.props.getPreviewDevice } );
		this.loadFonts();
	}

	componentDidUpdate( prevProps, prevState ) {
		const { onStatus, config, getPreviewDevice } = this.props;

		if ( prevState.status !== this.state.status ) {
			onStatus( this.state.status );
		}
		if ( this.state.device !== getPreviewDevice ) {
			ktgooglefonts = [];
			this.setState( { device: getPreviewDevice } );
			this.loadFonts();
		} else if ( prevProps.config !== config ) {
			this.loadFonts();
		}
	}
	componentWillUnmount() {
		this.setState( { mounted: false } );
	}
	render() {
		const { children } = this.props;
		return children || null;
	}
}

KTWebfontLoader.propTypes = {
	config: PropTypes.object.isRequired,
	children: PropTypes.element,
	onStatus: PropTypes.func.isRequired,
};

KTWebfontLoader.defaultProps = {
	onStatus: noop,
};

export default compose( [
	withSelect( ( select ) => {
		return {
			getPreviewDevice: select( 'kadenceblocks/data' ).getDevice(),
		};
	} ),
] )( KTWebfontLoader );
