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

	const { uniqueID, backgroundColor, minHeight, tabletMinHeight, mobileMinHeight, minHeightType } = attributes;

	const previewMinHeight = getPreviewSize(previewDevice, minHeight, tabletMinHeight, mobileMinHeight);

	const css = new KadenceBlocksCSS();

	css.set_selector(`.kb-table-container .kb-table tr.kb-table-row${uniqueID}`);
	if (backgroundColor !== '') {
		css.add_property('background-color', KadenceColorOutput(backgroundColor));
	}

	if (previewMinHeight) {
		css.add_property('height', previewMinHeight + minHeightType);
	}

	const cssOutput = css.css_output();

	return <style>{`${cssOutput}`}</style>;
}
