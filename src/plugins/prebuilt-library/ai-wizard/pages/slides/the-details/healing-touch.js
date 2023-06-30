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

export function HealingTouch() {
  return (
    <SlideCard>
      <VStack spacing="6">
        <SlideCardToneRow
          tone={ __('Professional', 'kadence-blocks') }
          headline={ __('Elevate Your Well-being with Healing Touch\'s Expert Care', 'kadence-blocks') }
          content={ __('"Experience the pinnacle of wellness and rejuvenation as our skilled therapists provide you with expert care and tailored massage therapy at Healing Touch."', 'kadence-blocks') }
        />
        <SlideCardToneRow
          tone={ __('Friendly', 'kadence-blocks') }
          headline={ __('Welcome to Your Personal Oasis', 'kadence-blocks') }
          content={ __('"Immerse yourself in the ultimate relaxation experience at Healing Touch, where our friendly team of skilled therapists will whisk you away to a serene sanctuary of bliss and rejuvenation."', 'kadence-blocks') }
        />
        <SlideCardToneRow
          tone={ __('Informative', 'kadence-blocks') }
          headline={ __('Discover the Secrets of Blissful Wellness', 'kadence-blocks') }
          content={ __('"Experience the transformative power of professional massage therapy and unlock a world of relaxation, pain relief, and enhanced well-being at Healing Touch."', 'kadence-blocks') }
        />
      </VStack>
    </SlideCard>
  )
}

