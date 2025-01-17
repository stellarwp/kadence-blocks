import { KadenceBlocksCSS } from '@kadence/helpers';
import { memo } from '@wordpress/element';

function BackendStyles({ attributes, previewDevice }) {
	const { uniqueID, padding, tabletPadding, mobilePadding, paddingType } = attributes;
	const css = new KadenceBlocksCSS();

	css.set_selector(`tr th.kb-table-data${uniqueID}, tr td.kb-table-data${uniqueID}`);
	css.render_measure_output(padding, tabletPadding, mobilePadding, previewDevice, 'padding', paddingType);

	const cssOutput = css.css_output();

	if (cssOutput === '') {
		return null;
	}

	return <style>{`${cssOutput}`}</style>;
}

export default memo(BackendStyles);
