/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SlideCard } from '../slide-card';
import { SlideCardRow } from '../slide-card-row';

const content = [
  `I'm Spencer Sharp, a business coach who is genuinely committed to helping 
  entrepreneurs and professionals build businesses they are passionate about 
  and lead fulfilling lives.`,
  `With practical solutions and personalized guidance, I provide the support 
  you need to achieve your goals.`,
  `Together, we'll work on creating systems for organization, clarity, and 
  growth.`, 
  `I'll empower you to become a strong leader, take control of your finances, 
  and develop effective strategies for marketing, lead conversion, and 
  customer fulfillment.`,
  `I’ll be your guide on this journey to success, ensuring that your business 
  thrives while you live a rewarding life.`
];

export function SpencerSharp() {
  return (
    <SlideCard>
      <SlideCardRow
        headline={ __('Tell us about yourself', 'kadence-blocks') }
        content={ content.map((paragraph, index) => (<p key={ index }>{ paragraph }</p>)) }
      />
    </SlideCard>
  )
}

