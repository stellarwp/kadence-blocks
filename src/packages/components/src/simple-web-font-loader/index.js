import { useState, useEffect, useRef, useCallback } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import PropTypes from 'prop-types';

if ( typeof ktgooglefonts === 'undefined' ) {
	global.ktgooglefonts = [];
}

const statuses = {
	inactive: 'inactive',
	active: 'active',
	loading: 'loading',
};

const noop = () => {};

function WebfontLoader({ config, children, onStatus = noop }) {
	const [status, setStatus] = useState(undefined);
	const [mounted, setMounted] = useState(false);
	const [device, setDevice] = useState(null);
	const linkRef = useRef(null);
	
	const getPreviewDevice = useSelect(
		(select) => select('kadenceblocks/data').getPreviewDeviceType(),
		[]
	);

	const addFont = useCallback((font) => {
		if (!ktgooglefonts.includes(font)) {
			ktgooglefonts.push(font);
		}
	}, []);

	const handleLoading = useCallback(() => {
		setStatus(statuses.loading);
	}, []);

	const handleActive = useCallback(() => {
		setStatus(statuses.active);
	}, []);

	const handleInactive = useCallback(() => {
		setStatus(statuses.inactive);
	}, []);

	const loadFonts = useCallback(() => {
		if (mounted && config?.google?.families?.[0]) {
			const fontFamily = config.google.families[0];
			
			if (!ktgooglefonts.includes(fontFamily)) {
				handleLoading();
				
				const context = frames['editor-canvas']?.document || document;
				
				// Parse font family and variants
				const fontParts = fontFamily.split(':');
				const family = fontParts[0];
				const variants = fontParts[1] ? fontParts[1].split(',') : [];
				
				// Build Google Fonts URL
				let url = `https://fonts.googleapis.com/css?family=${family.replace(/\s+/g, '+')}`;
				if (variants.length > 0) {
					url += `:${variants.join(',')}`;
				}
				
				// Check if font link already exists
				const existingLink = context.querySelector(`link[href="${url}"]`);
				if (existingLink) {
					handleActive();
					addFont(fontFamily);
					return;
				}
				
				// Create and append link element
				const link = document.createElement('link');
				link.rel = 'stylesheet';
				link.href = url;
				
				// Set up load/error handlers
				link.onload = () => {
					handleActive();
				};
				
				link.onerror = () => {
					handleInactive();
				};
				
				context.head.appendChild(link);
				linkRef.current = link;
				
				addFont(fontFamily);
			}
		}
	}, [mounted, config, addFont, handleLoading, handleActive, handleInactive]);

	// Initial mount
	useEffect(() => {
		ktgooglefonts = [];
		setMounted(true);
		setDevice(getPreviewDevice);
		return () => {
			setMounted(false);
		};
	}, []);

	// Load fonts on mount and when config changes
	useEffect(() => {
		loadFonts();
	}, [loadFonts]);

	// Handle status changes
	useEffect(() => {
		if (status !== undefined) {
			onStatus(status);
		}
	}, [status, onStatus]);

	// Handle device changes
	useEffect(() => {
		if (device !== null && device !== getPreviewDevice) {
			ktgooglefonts = [];
			setDevice(getPreviewDevice);
			loadFonts();
		}
	}, [getPreviewDevice, device, loadFonts]);

	return children || null;
}

WebfontLoader.propTypes = {
	config: PropTypes.object.isRequired,
	children: PropTypes.element,
	onStatus: PropTypes.func,
};

export default WebfontLoader;