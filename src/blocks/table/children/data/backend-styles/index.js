import { KadenceBlocksCSS } from '@kadence/helpers';

export default function BackendStyles(props) {
	const { attributes, previewDevice } = props;

	const { uniqueID, padding, tabletPadding, mobilePadding, paddingType } = attributes;
	const css = new KadenceBlocksCSS();

	css.set_selector(`th.kb-table-data${uniqueID}, td.kb-table-data${uniqueID}`);
	css.render_measure_output(padding, tabletPadding, mobilePadding, previewDevice, 'padding', paddingType);

	const cssOutput = css.css_output();

	return <style>{`${cssOutput}`}</style>;
}
