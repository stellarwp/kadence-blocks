import { Component } from '@wordpress/element';
import PropTypes from 'prop-types';
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';

const statuses = {
	inactive: 'inactive',
	active: 'active',
	loading: 'loading',
};

const noop = () => {};

class SimpleWebfontLoader extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			status: undefined,
			mounted: false,
			loadedFonts: new Set(),
		};
		this.linkElements = new Map();
	}

	loadFonts() {
		if ( this.state.mounted && this.props.config?.google?.families?.length ) {
			const families = this.props.config.google.families;
			
			families.forEach( family => {
				if ( !this.state.loadedFonts.has( family ) ) {
					// Set loading status
					this.setState( { status: statuses.loading } );
					
					// Build Google Fonts URL
					const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family.replace(/ /g, '+'))}&display=swap`;
					
					// Create and append link element
					const link = document.createElement('link');
					link.rel = 'stylesheet';
					link.href = url;
					
					// Add load event listener
					link.onload = () => {
						this.setState( prevState => ({
							status: statuses.active,
							loadedFonts: new Set([...prevState.loadedFonts, family])
						}));
					};
					
					link.onerror = () => {
						this.setState( { status: statuses.inactive } );
					};
					
					const context = frames['editor-canvas']?.document || document;
					context.head.appendChild(link);
					
					// Store reference for cleanup
					this.linkElements.set( family, link );
				}
			});
		}
	}

	componentDidMount() {
		this.setState( { mounted: true, device: this.props.getPreviewDevice } );
		this.loadFonts();
	}

	componentDidUpdate( prevProps, prevState ) {
		const { onStatus, config, getPreviewDevice } = this.props;

		if ( prevState.status !== this.state.status ) {
			onStatus( this.state.status );
		}
		
		if ( this.state.device !== getPreviewDevice ) {
			// Clear loaded fonts on device change
			this.state.loadedFonts.clear();
			this.setState( { device: getPreviewDevice } );
			this.loadFonts();
		} else if ( prevProps.config !== config ) {
			this.loadFonts();
		}
	}
	
	componentWillUnmount() {
		this.setState( { mounted: false } );
		
		// Clean up link elements
		this.linkElements.forEach( link => {
			if ( link && link.parentNode ) {
				link.parentNode.removeChild( link );
			}
		});
		this.linkElements.clear();
	}
	
	render() {
		const { children } = this.props;
		return children || null;
	}
}

SimpleWebfontLoader.propTypes = {
	config: PropTypes.object.isRequired,
	children: PropTypes.element,
	onStatus: PropTypes.func.isRequired,
};

SimpleWebfontLoader.defaultProps = {
	onStatus: noop,
};

export default compose( [
	withSelect( ( select ) => {
		return {
			getPreviewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
		};
	} ),
] )( SimpleWebfontLoader );