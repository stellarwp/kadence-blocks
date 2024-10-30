import {
	KadenceBlocksCSS,
	getFontSizeOptionOutput,
	getPreviewSize,
	getSpacingOptionOutput,
	KadenceColorOutput,
	useElementHeight,
} from '@kadence/helpers';

export default function BackendStyles(props) {
	const { attributes, previewDevice } = props;

	const { uniqueID, backgroundColor, minHeight, tabletMinHeight, mobileMinHeight, minHeightUnit } = attributes;

	const previewMinHeight = getPreviewSize(previewDevice, minHeight, tabletMinHeight, mobileMinHeight);

	const css = new KadenceBlocksCSS();

	css.set_selector(`.kb-table .kb-table-row${uniqueID}`);
	if (backgroundColor !== '') {
		css.add_property('background-color', KadenceColorOutput(backgroundColor));
	}

	if (previewMinHeight) {
		css.add_property('height', previewMinHeight + minHeightUnit);
	}

	const cssOutput = css.css_output();

	return <style>{`${cssOutput}`}</style>;
}
