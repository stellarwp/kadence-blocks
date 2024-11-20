import { useEffect, useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

const statuses = {
	inactive: 'inactive',
	active: 'active',
	loading: 'loading',
};

export default function KadenceWebfontLoader({
												 typography,
												 clientId,
												 id,
												 children
											 }) {
	const [status, setStatus] = useState(undefined);
	const { addWebFont } = useDispatch('kadenceblocks/data');
	const [device, setDevice] = useState('desktop');

	const { previewDevice, isUniqueFont } = useSelect(
		(select) => ({
			isUniqueFont: (value, frame) => select('kadenceblocks/data').isUniqueFont(value, frame),
			previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
		}),
		[]
	);

	const loadFont = (fontFamily) => {
		const context = frames['editor-canvas']?.document || document;
		const url = `https://fonts.googleapis.com/css?family=${fontFamily.replace(/\s+/g, '+')}`;

		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = url;

		link.onload = () => setStatus(statuses.active);
		link.onerror = () => setStatus(statuses.inactive);

		setStatus(statuses.loading);
		context.head.appendChild(link);
		return link;
	};

	const loadFonts = () => {
		setTimeout(() => {
			const fontFamily = typography[0].family + (typography[0]?.variant ? ':' + typography[0].variant : '');
			const frame = frames['editor-canvas'] ? 'Desktop' : 'iframe';

			if (fontFamily && isUniqueFont(fontFamily, frame)) {
				loadFont(fontFamily);
				addWebFont(fontFamily, frame);
			}
		}, 50);
	};

	useEffect(() => {
		setDevice(previewDevice);
	}, []);

	useEffect(() => {
		if (device !== previewDevice) {
			setDevice(previewDevice);
			loadFonts();
		}
	}, [previewDevice]);

	useEffect(() => {
		loadFonts();
	}, [typography]);

	return children || null;
}
