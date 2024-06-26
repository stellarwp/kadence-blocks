/**
 * Icon Render Component
 *
 */
import GenIcon from '../gen-icon';
import { applyFilters } from '@wordpress/hooks';
import { useEffect, useState } from '@wordpress/element';
import { Spinner } from '@wordpress/components';
/**
 * Build the typography controls
 * @returns {object} typography settings.
 */
const IconRender = (props) => {
	const [iconOptions, setIconOptions] = useState(undefined);
	const [isLoading, setIsLoading] = useState(false);
	const [customSvg, setCustomSvg] = useState('');

	useEffect(() => {
		const icons = { ...kadence_blocks_params_ico.icons, ...kadence_blocks_params_fa.icons };
		setIconOptions(applyFilters('kadence.icon_options', icons));
	}, []);

	const updateIcons = () => {
		const icons = { ...kadence_blocks_params_ico.icons, ...kadence_blocks_params_fa.icons };
		return applyFilters('kadence.icon_options', icons);
	};

	let options = iconOptions;
	if (!options) {
		options = updateIcons();
	}

	const { name } = props;

	const getCustomSvg = async ( id ) => {
		try {
			// Check if the SVG is in localStorage
			const cachedSvg = localStorage.getItem(`kb-custom-${id}`);
			if (cachedSvg) {
				setCustomSvg(JSON.parse(cachedSvg));
				return;
			}

			setIsLoading( true );
			const response = await fetchCustomSvg( id );

			if ( response ) {
				const svgContent = response.content.rendered.replace('<p>', '').replace('</p>', '').replace(/&#8220;/g, '"')
					.replace(/&#8221;/g, '"')
					.replace(/&#8243;/g, '"');

				const jsonObject = JSON.parse(svgContent);

				// Save the fetched SVG to localStorage
				localStorage.setItem(`kb-custom-${id}`, JSON.stringify(jsonObject));

				setCustomSvg( jsonObject );

			} else {
				setCustomSvg( [] );
			}
		} catch ( error ) {
			console.error( 'Failed to fetch custom SVGs:', error );
		}
		setIsLoading( false );
	};

	useEffect(() => {
		if( name.startsWith('kb-custom') ) {
			getCustomSvg( name.replace('kb-custom-', '') );
		}

	}, [name]);

	if( name.startsWith('kb-custom') && isLoading ) {
		return <Spinner />;
	} else if ( name.startsWith('kb-custom') && customSvg !== '' ) {
		return <GenIcon name={name} icon={ customSvg } {...props} />;
	}

	return <GenIcon name={name} icon={options[name]} {...props} />;
};

const fetchCustomSvg = async ( id ) => {
	console.log( 'Fetching SVG');
	const response = await fetch(`/wp-json/wp/v2/kadence_custom_svg/${id}`, {
		method: 'GET'
	});

	if (!response.ok) {
		throw new Error('Network response was not ok');
	}

	return response.json();
};


export default IconRender;
