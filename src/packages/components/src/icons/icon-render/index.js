/**
 * Icon Render Component
 */
import GenIcon from '../gen-icon';
import { applyFilters } from '@wordpress/hooks';
import { Spinner } from '@wordpress/components';
import { useMemo, useEffect, useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

const fetchCustomSvg = async (id) => {
	const restUrl = kadence_blocks_params?.rest_url || window?.kadence_blocks_params?.rest_url;
	if (!restUrl) {
		throw new Error('Kadence Blocks REST URL not available');
	}

	const response = await fetch(`${restUrl}wp/v2/kadence_custom_svg/${id}`, {
		method: 'GET',
	});

	if (!response.ok) {
		throw new Error('Network response was not ok');
	}

	return response.json();
};

const getCachedCustomSvg = (id) => {
	if (typeof window === 'undefined') {
		return null;
	}
	try {
		const cached = window.localStorage.getItem(`kb-custom-${id}`);
		return cached ? JSON.parse(cached) : null;
	} catch (error) {
		return null;
	}
};

const setCachedCustomSvg = (id, svg) => {
	if (typeof window === 'undefined') {
		return;
	}
	try {
		window.localStorage.setItem(`kb-custom-${id}`, JSON.stringify(svg));
	} catch (error) {
		// Ignore localStorage failures (quota exceeded, disabled, etc.).
	}
};

const normalizeDimension = (value) => {
	if (typeof value === 'number') {
		return value;
	}

	if (typeof value === 'string') {
		if (value.endsWith('px')) {
			const parsedPx = parseFloat(value);
			return Number.isNaN(parsedPx) ? null : parsedPx;
		}

		const numeric = Number(value);
		return Number.isNaN(numeric) ? null : numeric;
	}

	return null;
};

const IconRender = (props) => {
	const { name, className, style, size, ...rest } = props;

	const { combinedIcons, areIconsLoaded } = useSelect((select) => {
		const dataStore = select('kadenceblocks/data');

		if (!dataStore) {
			return {
				combinedIcons: {},
				areIconsLoaded: false,
			};
		}

		const icons = dataStore.getIcons();

		return {
			combinedIcons: icons?.combinedIcons || {},
			areIconsLoaded: dataStore.areIconsLoaded(),
		};
	}, []);

	const dispatchers = useDispatch('kadenceblocks/data');
	const fetchIcons = dispatchers?.fetchIcons;

	useEffect(() => {
		if (typeof fetchIcons === 'function' && !areIconsLoaded) {
			fetchIcons();
		}
	}, [areIconsLoaded, fetchIcons]);

	const iconsAvailable = useMemo(
		() => combinedIcons && Object.keys(combinedIcons).length > 0,
		[combinedIcons]
	);

	const iconOptions = useMemo(() => applyFilters('kadence.icon_options', combinedIcons), [combinedIcons]);

	const [customSvg, setCustomSvg] = useState(null);
	const [isFetchingCustom, setIsFetchingCustom] = useState(false);

	useEffect(() => {
		if (!name || !name.startsWith('kb-custom')) {
			setCustomSvg(null);
			setIsFetchingCustom(false);
			return;
		}

		if (iconOptions[name]) {
			setCustomSvg(iconOptions[name]);
			setIsFetchingCustom(false);
			return;
		}

		const id = name.replace('kb-custom-', '');
		const cached = getCachedCustomSvg(id);
		if (cached) {
			setCustomSvg(cached);
			setIsFetchingCustom(false);
			return;
		}

		let isCancelled = false;

		const loadSvg = async () => {
			setIsFetchingCustom(true);
			try {
				const response = await fetchCustomSvg(id);
				const svgContent = response?.content?.rendered || '';
				const parsed = JSON.parse(
					svgContent
						.replace('<p>', '')
						.replace('</p>', '')
						.replace(/&#8220;/g, '"')
						.replace(/&#8221;/g, '"')
						.replace(/&#8222;/g, '"')
						.replace(/&#8243;/g, '"')
				);

				if (!isCancelled) {
					setCachedCustomSvg(id, parsed);
					setCustomSvg(parsed);
				}
			} catch (error) {
				if (!isCancelled) {
					setCustomSvg(null);
					console.error('Failed to fetch custom SVGs:', error);
				}
			} finally {
				if (!isCancelled) {
					setIsFetchingCustom(false);
				}
			}
		};

		loadSvg();

		return () => {
			isCancelled = true;
		};
	}, [name, iconOptions]);

	const spinnerDimension = normalizeDimension(size) ?? normalizeDimension(style?.fontSize) ?? 24;
	const spinnerStyle = { width: `${spinnerDimension}px`, height: `${spinnerDimension}px` };
	const wrapperClassName = className ? `${className} kadence-icon-loading` : 'kadence-icon-loading';

	if (!name) {
		return null;
	}

	if (name.startsWith('kb-custom')) {
		if (customSvg) {
			return <GenIcon name={name} icon={customSvg} className={className} style={style} size={size} {...rest} />;
		}

		if (isFetchingCustom || (!iconsAvailable && !areIconsLoaded)) {
			return (
				<span className={wrapperClassName} style={style}>
					<Spinner style={spinnerStyle} />
				</span>
			);
		}

		return null;
	}

	if (!iconsAvailable && !areIconsLoaded) {
		return (
			<span className={wrapperClassName} style={style}>
				<Spinner style={spinnerStyle} />
			</span>
		);
	}

	const icon = iconOptions[name];

	if (!icon) {
		return null;
	}

	return <GenIcon name={name} icon={icon} className={className} style={style} size={size} {...rest} />;
};

export default IconRender;
