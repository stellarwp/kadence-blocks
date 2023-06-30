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

export function HealingTouch() {
  return (
    <SlideCard>
      <VStack spacing="6">
        <SlideCardRow
          headline={ __('I am', 'kadence-blocks') }
          content={ __('A company', 'kadence-blocks') }
        />
        <SlideCardRow
          headline={ __('Company Name', 'kadence-blocks') }
          content={ __('Healing Touch', 'kadence-blocks') }
        />
        <SlideCardRow
          headline={ __('Where are you based?', 'kadence-blocks') }
          content={
            <>
              <b>{ __('Business Address', 'kadence-blocks') }: </b>
              { __('123 Some St., Seattle, Washington', 'kadence-blocks') }
            </>
          }
        />
        <SlideCardRow
          headline={ __('What industry are you in?', 'kadence-blocks') }
          content={ __('Spa', 'kadence-blocks') }
        />
      </VStack>
    </SlideCard>
  )
}

