/**
 * Wordpress dependencies
 */
import { __experimentalVStack as VStack } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SlideCard } from '../slide-card';
import { SlideCardToneRow } from '../slide-card-tone-row';

export function SlideTwo() {
	return (
		<SlideCard>
			<VStack spacing="6">
				<SlideCardToneRow
					tone={__('Engaging', 'kadence-blocks')}
					headline={__('Unleash Your Inner Bliss with Healing Touch', 'kadence-blocks')}
					content={__(
						'"Discover a transformative sanctuary where your senses will awaken, your spirit will rejuvenate, and your well-being will flourish. Experience the power of Healing Touch today."',
						'kadence-blocks'
					)}
				/>
				<SlideCardToneRow
					tone={__('Trustworthy', 'kadence-blocks')}
					headline={__('Your Path to Trusted Wellness Begins at Healing Touch', 'kadence-blocks')}
					content={__(
						'"Experience the highest standard of care and expertise as our dedicated team guides you on your journey to holistic well-being at Healing Touch."',
						'kadence-blocks'
					)}
				/>
				<SlideCardToneRow
					tone={__('Conversational', 'kadence-blocks')}
					headline={__("Let's Find Your Perfect Massage Experience at Healing Touch", 'kadence-blocks')}
					content={__(
						'"Ready to discover the ultimate relaxation? Let us guide you in finding the perfect massage tailored to your unique needs at Healing Touch."',
						'kadence-blocks'
					)}
				/>
			</VStack>
		</SlideCard>
	);
}
