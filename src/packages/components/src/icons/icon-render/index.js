/**
 * Icon Render Component
 *
 */
import GenIcon from '../gen-icon';
import { applyFilters } from '@wordpress/hooks';
import { Spinner } from '@wordpress/components';

import { Fragment, Component, useEffect, useState } from '@wordpress/element';

const fetchCustomSvg = async ( id ) => {
	const response = await fetch(kadence_blocks_params.rest_url + `wp/v2/kadence_custom_svg/${id}`, {
		method: 'GET'
	});

	if (!response.ok) {
		throw new Error('Network response was not ok');
	}

	return response.json();
};



/**
 * Build the typography controls
 * @returns {object} typography settings.
 */
class IconRender extends Component {
	constructor() {
		super( ...arguments );
		this.updateIcons = this.updateIcons.bind( this );
		this.getCustomSvg = this.getCustomSvg.bind( this );
		this.state = {
			iconOptions: undefined,
			isLoading: false,
			customSvg: '',
		};
	}
	componentDidMount() {
		const icons = { ...kadence_blocks_params_ico.icons, ...kadence_blocks_params_fa.icons, ...kadence_blocks_params_kbcustomicons.icons };
		this.setState( { iconOptions: applyFilters( 'kadence.icon_options', icons ) } );
		if( this.props.name.startsWith('kb-custom') ) {
		 	this.getCustomSvg( this.props.name.replace('kb-custom-', '') );
		}
	}

	componentDidUpdate( prevProps, prevState, snapshot ) {
		if ( this.props.name !== prevProps.name && this.props.name.startsWith( 'kb-custom' ) ) {
			this.getCustomSvg( this.props.name.replace( 'kb-custom-', '' ) );
		}
	}

	getCustomSvg = async ( id ) => {
		try {
			// Check if the SVG is in localStorage
			const cachedSvg = localStorage.getItem(`kb-custom-${id}`);
			if (cachedSvg) {
				this.setState( { customSvg: JSON.parse(cachedSvg) });
				return;
			}
			this.setState( { isLoading: true });
			const response = await fetchCustomSvg( id );

			if ( response ) {
				const svgContent = response.content.rendered
					.replace( '<p>', '' )
					.replace( '</p>', '' )
					.replace( /&#8220;/g, '"' )
					.replace( /&#8221;/g, '"' )
					.replace( /&#8222;/g, '"' )
					.replace( /&#8243;/g, '"' );

				const jsonObject = JSON.parse(svgContent);

				// Save the fetched SVG to localStorage
				localStorage.setItem(`kb-custom-${id}`, JSON.stringify(jsonObject));
				this.setState( { customSvg:jsonObject });

			} else {
				this.setState( { customSvg:'' });
			}
		} catch ( error ) {
			this.setState( { customSvg:'' });
			console.error( 'Failed to fetch custom SVGs:', error );
		}
		this.setState( { isLoading:false });
	};
	updateIcons() {
		const icons = { ...kadence_blocks_params_ico.icons, ...kadence_blocks_params_fa.icons, ...kadence_blocks_params_kbcustomicons.icons };
		const filteredIcons = applyFilters( 'kadence.icon_options', icons );
		return filteredIcons;
	}
	render() {
		const {
			name,
		} = this.props;
		let { iconOptions, isLoading, customSvg } = this.state;
		if ( ! iconOptions ) {
			iconOptions = this.updateIcons();
		}
		if( name.startsWith('kb-custom') && isLoading ) {
			return <Spinner />;
		} else if ( name.startsWith('kb-custom') && customSvg !== '' ) {
			return <GenIcon name={name} icon={ customSvg } {...this.props} />;
		}
		return <GenIcon name={ name } icon={ iconOptions[ name ] } { ...this.props } />;
	}
}
export default ( IconRender );

