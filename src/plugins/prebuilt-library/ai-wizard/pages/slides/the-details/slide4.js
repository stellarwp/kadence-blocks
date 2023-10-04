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

export function SlideFour() {
  return (
    <SlideCard>
      <VStack spacing="6">
        <SlideCardToneRow
          tone={ __('Inspirational', 'kadence-blocks') }
          headline={ __('Ignite Your Inner Spark, Transform Your Life at Healing', 'kadence-blocks') }
          content={ __('“Embrace the power of self-care and unlock your body\'s innate healing potential, as our skilled practitioners rejuvenate your mind, body, and spirit with transformative therapies."', 'kadence-blocks') }
        />
        <SlideCardToneRow
          tone={ __('Neutral', 'kadence-blocks') }
          headline={ __('Discover the Essence of Healing Touch at Healing Touch Spa', 'kadence-blocks') }
          content={ __('"Experience a range of therapeutic treatments and indulge in a serene atmosphere, where you can unwind and rejuvenate your body and mind."', 'kadence-blocks') }
        />
      </VStack>
    </SlideCard>
  )
}

