/**
 * BLOCK Testimonial Item Wrap
 */
import { getPreviewSize, getGapSizeOptionOutput } from '@kadence/helpers';

import { SplideSlide } from '@splidejs/react-splide';
/**
 * Build the row edit
 */
export default function TestimonialItemWrap(props) {
	const { attributes, setAttributes, clientId, parentBlock, parentBlockClientId, context, previewDevice } = props;
	const layout = context['kadence/testimonials-layout'];
	const columns = context['kadence/testimonials-columns'];
	const gap = context['kadence/testimonials-gap'];
	const gapUnit = context['kadence/testimonials-gap-unit'];

	if (layout && layout !== 'carousel') {
		return props.children;
	}

	const previewColumns = getPreviewSize(
		previewDevice,
		undefined !== columns?.[0] ? columns[0] : 3,
		undefined !== columns?.[3] ? columns[3] : '',
		undefined !== columns?.[5] ? columns[5] : ''
	);
	const previewGap = getPreviewSize(
		previewDevice,
		undefined !== gap?.[0] ? gap[0] : '',
		undefined !== gap?.[1] ? gap[1] : '',
		undefined !== gap?.[2] ? gap[2] : ''
	);
	const gapSize = getGapSizeOptionOutput(previewGap, gapUnit ? gapUnit : 'px');

	return (
		<SplideSlide
			style={{
				marginRight: gapSize,
				width: 'calc(((100% + ' + gapSize + ') / ' + previewColumns + ') - ' + gapSize + ')',
			}}
		>
			{props.children}
		</SplideSlide>
	);
}
