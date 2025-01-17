import { KadenceBlocksCSS, getPreviewSize, KadenceColorOutput } from '@kadence/helpers';
import { memo } from '@wordpress/element';

function BackendStyles(props) {
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

	css.set_selector(`.kb-table-container .kb-table tr.kb-table-row${uniqueID}`);
	if (previewMinHeight) {
		css.add_property('height', previewMinHeight + minHeightType);
	}
	if (backgroundColor !== '') {
		css.add_property('background-color', KadenceColorOutput(backgroundColor));
	}

	css.set_selector(`.kb-table-container .kb-table tr.kb-table-row${uniqueID}:hover`);
	if (backgroundHoverColor !== '') {
		css.add_property('background-color', KadenceColorOutput(backgroundHoverColor));
	}

	const cssOutput = css.css_output();

	if (cssOutput === '') {
		return null;
	}

	return <style>{`${cssOutput}`}</style>;
}

export default memo(BackendStyles);
