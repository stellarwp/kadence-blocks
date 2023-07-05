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

export function SlideThree() {
  return (
    <SlideCard>
      <VStack spacing="6">
        <SlideCardToneRow
          tone={ __('Persuasive', 'kadence-blocks') }
          headline={ __('Embrace the Power of Healing Touch for Unparalleled Relaxation', 'kadence-blocks') }
          content={ __('"Immerse yourself in a world of relaxation, rejuvenation, and renewed vitality with Healing Touch\'s expert massage therapy, tailored to revitalize your mind, body, and spirit."', 'kadence-blocks') }
        />
        <SlideCardToneRow
          tone={ __('Upbeat', 'kadence-blocks') }
          headline={ __('Elevate Your Senses, Renew Your Spirit', 'kadence-blocks') }
          content={ __('"Step into a world of pure bliss and let our expert therapists at Healing Touch Spa uplift your spirits and rejuvenate your body with our invigorating massage therapies."', 'kadence-blocks') }
        />
        <SlideCardToneRow
          tone={ __('Funny', 'kadence-blocks') }
          headline={ __('Knead a Laugh? Healing Touch Puts the \'Ahh\' in Spa-tacular Massages!', 'kadence-blocks') }
          content={ __('"Get ready to unwind, untangle, and unleash your inner noodle with Healing Touch\'s hilariously heavenly massages!"', 'kadence-blocks') }
        />
      </VStack>
    </SlideCard>
  )
}

