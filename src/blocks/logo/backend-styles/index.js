import { KadenceBlocksCSS, getPreviewSize, getSpacingOptionOutput } from '@kadence/helpers';
import { KadenceWebfontLoader } from '@kadence/components';

export default function BackendStyles(props) {
	const { attributes, clientId, previewDevice } = props;

	const {
		uniqueID,
		showSiteTitle,
		showSiteTagline,
		layout,
		containerMaxWidth,
		tabletContainerMaxWidth,
		mobileContainerMaxWidth,
		containerMaxWidthType,
		padding,
		tabletPadding,
		mobilePadding,
		paddingType,
		margin,
		tabletMargin,
		mobileMargin,
		marginType,
		textVerticalAlign,
		typography,
	} = attributes;

	const previewContainerMaxWidth = getPreviewSize(
		previewDevice,
		containerMaxWidth,
		tabletContainerMaxWidth,
		mobileContainerMaxWidth
	);

	const css = new KadenceBlocksCSS();

	css.set_selector(`.kb-logo${uniqueID}`);
	if (previewContainerMaxWidth) {
		css.add_property(
			'max-width',
			getSpacingOptionOutput(previewContainerMaxWidth, containerMaxWidthType) + ' !important'
		);
	}

	css.render_measure_output(padding, tabletPadding, mobilePadding, previewDevice, 'padding', paddingType);
	css.render_measure_output(margin, tabletMargin, mobileMargin, previewDevice, 'margin', marginType);
	css.render_font(typography ? typography : [], previewDevice);

	if (
		layout === 'logo-left' ||
		layout === 'logo-right' ||
		layout === 'logo-right-stacked' ||
		layout === 'logo-left-stacked'
	) {
		css.set_selector(`.kb-logo${uniqueID} .kb-logo-layout-container`);

		css.add_property('align-items', textVerticalAlign);
	}

	const cssOutput = css.css_output();

	return (
		<>
			<style>{`${cssOutput}`}</style>
			{typography?.[0]?.google && (
				<KadenceWebfontLoader typography={typography} clientId={clientId} id={'typography'} />
			)}
		</>
	);
}
