import { useEffect, useState } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';

let loadedFonts = [];

const WebFontLoader = ({ config, children, getPreviewDevice }) => {
	const [device, setDevice] = useState(getPreviewDevice);

	const loadFont = (url) => {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = url;

		const context = frames['editor-canvas']?.document || document;
		context.head.appendChild(link);
		return link;
	};

	useEffect(() => {
		const fontFamily = config.google.families[0];
		const url = `https://fonts.googleapis.com/css?family=${fontFamily.replace(/\s+/g, '+')}`;

		if (!loadedFonts.includes(fontFamily)) {
			const linkElement = loadFont(url);
			loadedFonts.push(fontFamily);

			return () => {
				linkElement.parentNode?.removeChild(linkElement);
			};
		}
	}, [config]);

	useEffect(() => {
		if (device !== getPreviewDevice) {
			loadedFonts = [];
			setDevice(getPreviewDevice);
		}
	}, [getPreviewDevice]);

	return children || null;
};

export default compose([
	withSelect((select) => ({
		getPreviewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
	})),
])(WebFontLoader);
