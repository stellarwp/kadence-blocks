/**
 * Wordpress dependencies
 */
import { __experimentalVStack as VStack } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SlideCard } from '../slide-card';
import { SlideCardRow } from '../slide-card-row';

export function SpencerSharp() {
	return (
		<SlideCard>
			<VStack spacing="6">
				<SlideCardRow headline={__('I am', 'kadence-blocks')} content={__('An Individual', 'kadence-blocks')} />
				<SlideCardRow
					headline={__('Your Name', 'kadence-blocks')}
					content={__('Spencer Sharp', 'kadence-blocks')}
				/>
				<SlideCardRow
					headline={__('Where are you based?', 'kadence-blocks')}
					content={
						<>
							<b>{__('Service Area', 'kadence-blocks')}: </b>
							{__('USA', 'kadence-blocks')}
						</>
					}
				/>
				<SlideCardRow
					headline={__('What industry are you in?', 'kadence-blocks')}
					content={__('Coaching', 'kadence-blocks')}
				/>
			</VStack>
		</SlideCard>
	);
}
