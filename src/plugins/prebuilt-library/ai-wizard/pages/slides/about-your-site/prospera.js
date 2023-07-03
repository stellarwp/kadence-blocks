/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SlideCard } from '../slide-card';
import { SlideCardRow } from '../slide-card-row';

const content = `Prospera is a trusted bookkeeping and accounting services 
company dedicated to helping businesses thrive financially. We specialize in 
comprehensive bookkeeping, accurate financial reporting, tax preparation, and 
strategic financial planning. Our tailored solutions cater to small and 
medium-sized enterprises, entrepreneurs, and professionals, providing them 
with the unique value of expertise, accuracy, and timely insights. With 
Prospera, businesses gain the financial clarity and support they need to make 
informed decisions and achieve long-term prosperity.`;

export function Prospera() {
  return (
    <SlideCard>
      <SlideCardRow
        headline={ __('Tell us about your company', 'kadence-blocks') }
        content={ __(content, 'kadence-blocks') }
      />
    </SlideCard>
  )
}

