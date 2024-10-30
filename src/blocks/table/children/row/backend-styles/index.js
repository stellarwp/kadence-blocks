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

	const { uniqueID, backgroundColor } = attributes;

	const css = new KadenceBlocksCSS();

	css.set_selector(`.wp-block-kadence-table .kb-table-row${uniqueID}`);
	if (backgroundColor !== '') {
		css.add_property('background-color', KadenceColorOutput(backgroundColor));
	}

	const cssOutput = css.css_output();

	return <style>{`${cssOutput}`}</style>;
}
