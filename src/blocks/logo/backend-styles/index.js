import {
	KadenceBlocksCSS,
	getFontSizeOptionOutput,
	getPreviewSize,
	getSpacingOptionOutput,
	KadenceColorOutput,
	useElementHeight,
	getBorderStyle,
	getBorderColor,
} from '@kadence/helpers';

export default function BackendStyles(props) {
	const { attributes, isSelected, previewDevice, clientId, currentRef } = props;

	const { uniqueID, showSiteTitle, showSiteTagline } = attributes;

	const css = new KadenceBlocksCSS();

	// css.set_selector(`.kb-search${uniqueID} .kb-search-icon svg`);
	// css.add_property('stroke', KadenceColorOutput(inputIconColor));

	const cssOutput = css.css_output();

	return (
		<>
			<style>{`${cssOutput}`}</style>
		</>
	);
}
