import {
	__experimentalVStack as VStack
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { SlideCard } from '../slide-card';
import { SlideCardRow } from '../slide-card-row';

export function Prospera() {
  return (
    <SlideCard>
      <VStack spacing="6">
        <SlideCardRow
          headline={ __('I am', 'kadence-blocks') }
          content={ __('A company', 'kadence-blocks') }
        />
        <SlideCardRow
          headline={ __('Company Name', 'kadence-blocks') }
          content={ __('Prospera', 'kadence-blocks') }
        />
        <SlideCardRow
          headline={ __('Where are you based?', 'kadence-blocks') }
          content={
            <>
              <b>{ __('Online Only', 'kadence-blocks') }</b>
            </>
          }
        />
        <SlideCardRow
          headline={ __('What industry are you in?', 'kadence-blocks') }
          content={ __('Professional Services', 'kadence-blocks') }
        />
      </VStack>
    </SlideCard>
  )
}

