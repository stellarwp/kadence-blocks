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

export function Education4All() {
	return (
		<SlideCard>
			<VStack spacing="6">
				<SlideCardRow
					headline={__('I am', 'kadence-blocks')}
					content={__('An Organization', 'kadence-blocks')}
				/>
				<SlideCardRow
					headline={__('Organization Name', 'kadence-blocks')}
					content={__('Education 4All', 'kadence-blocks')}
				/>
				<SlideCardRow
					headline={__('Where are you based?', 'kadence-blocks')}
					content={
						<>
							<b>{__('Service Area', 'kadence-blocks')}: </b>
							{__('Latin America', 'kadence-blocks')}
						</>
					}
				/>
				<SlideCardRow
					headline={__('What industry are you in?', 'kadence-blocks')}
					content={__('Charity', 'kadence-blocks')}
				/>
			</VStack>
		</SlideCard>
	);
}
