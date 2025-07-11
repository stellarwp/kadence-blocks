import { useEffect, useRef, useCallback } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

export default function SimpleWebfontLoader({ typography, children }) {
	const { addWebFont } = useDispatch('kadenceblocks/data');
	const { previewDevice, isUniqueFont } = useSelect(
		(select) => ({
			isUniqueFont: (value, frame) => select('kadenceblocks/data').isUniqueFont(value, frame),
			previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
		}),
		[]
	);

	const loadFont = useCallback((fontFamily) => {
		const context = frames['editor-canvas']?.document || document;
		const url = `https://fonts.googleapis.com/css?family=${fontFamily.replace(/\s+/g, '+')}`;

		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = url;

		context.head.appendChild(link);
		return link;
	}, []);

	const loadFonts = useCallback(() => {
		setTimeout(() => {
			if (!typography || typography.length === 0) {
				return;
			}
			const fontFamily = typography[0].family + (typography[0]?.variant ? ':' + typography[0].variant : '');
			const frame = frames['editor-canvas'] ? 'Desktop' : 'iframe';

			if (fontFamily && isUniqueFont(fontFamily, frame)) {
				loadFont(fontFamily);
				addWebFont(fontFamily, frame);
			}
		}, 50);
	}, [typography, isUniqueFont, addWebFont, loadFont]);

	const isInitialMount = useRef(true);

	useEffect(() => {
		// Don't run on mount
		if (isInitialMount.current) {
			isInitialMount.current = false;
		} else {
			loadFonts();
		}
	}, [previewDevice, loadFonts]);

	useEffect(() => {
		loadFonts();
	}, [loadFonts]);

	return children || null;
}