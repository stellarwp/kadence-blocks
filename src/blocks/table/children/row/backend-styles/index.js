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

	const {
		uniqueID,
		backgroundColor,
		backgroundHoverColor,
		minHeight,
		tabletMinHeight,
		mobileMinHeight,
		minHeightType,
	} = attributes;

	const previewMinHeight = getPreviewSize(previewDevice, minHeight, tabletMinHeight, mobileMinHeight);

	const css = new KadenceBlocksCSS();

	css.set_selector(
		`.kb-table-container .kb-table tr.kb-table-row${uniqueID}, .kb-table-container .kb-table tr.kb-table-row${uniqueID} th, .kb-table-container .kb-table tr.kb-table-row${uniqueID} td`
	);
	if (previewMinHeight) {
		css.add_property('height', previewMinHeight + minHeightType);
	}
	if (backgroundColor !== '') {
		css.add_property('background-color', KadenceColorOutput(backgroundColor));
	}

	css.set_selector(
		`.kb-table-container .kb-table tr.kb-table-row${uniqueID}:hover, .kb-table-container .kb-table tr.kb-table-row${uniqueID}:hover th, .kb-table-container .kb-table tr.kb-table-row${uniqueID}:hover td`
	);
	if (backgroundHoverColor !== '') {
		css.add_property('background-color', KadenceColorOutput(backgroundHoverColor));
	}

	const cssOutput = css.css_output();

	return <style>{`${cssOutput}`}</style>;
}
