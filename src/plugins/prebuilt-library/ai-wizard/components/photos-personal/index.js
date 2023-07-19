/**
 * WordPress dependencies
 */
import { Flex, FlexBlock } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ImageSelect } from '..';

const content = {
	featured: {
		id: 'featured',
		title: __('Featured Image', 'kadence-blocks'),
		buttonText: __('Choose Featured Images', 'kadence-blocks'),
		helpText: __('Choose pictures that will serve as temporary placeholders in your Design Library and select patterns to be displayed in prominent areas.', 'kadence-blocks')
	},
	background: {
		id: 'background',
		title: __('Background Image', 'kadence-blocks'),
		buttonText: __('Choose Background Images', 'kadence-blocks'),
		helpText: __('Choose pictures that will be used in your Design Library as background images. Make sure that these images are not too visually overwhelming, and can accommodate content such as text on top of them.', 'kadence-blocks')
	}
}

export function PhotosPersonal() {
	return (
		<Flex
			gap="25"
			align="start"
			className={ 'stellarwp-body' }
			style={{ marginTop: 52 }}
		>
			<FlexBlock>
				<div style={{ marginLeft: 'auto', maxWidth: 480 }}>
					<ImageSelect { ...content.featured } />
				</div>
			</FlexBlock>
			<FlexBlock>
				<div style={{ maxWidth: 480 }}>
					<ImageSelect { ...content.background } />
				</div>
			</FlexBlock>
		</Flex>
	);
}

