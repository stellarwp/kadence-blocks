import { __ } from '@wordpress/i18n';

import { SlideCard } from '../slide-card';
import { SlideCardRow } from '../slide-card-row';

const content = `Healing Touch is a leading massage therapy business renowned 
for our personalized, holistic treatments offered in a tranquil environment. 
Our team of highly skilled therapists seamlessly blends various techniques to 
cater to the unique needs of each individual, offering effective relief from 
tension, pain, and stress. Our services encompass a wide range of offerings, 
including Swedish, deep tissue, hot stone, and prenatal massage, along with 
complementary treatments like reflexology, acupuncture, and energy work. With 
an unwavering commitment to excellence and promoting relaxation, we are 
dedicated to helping our valued clients restore vitality and achieve a 
profound state of deep relaxation.`;

export function HealingTouch() {
  return (
    <SlideCard>
      <SlideCardRow
        headline={ __('Tell us about your company', 'kadence-blocks') }
        content={ __(content, 'kadence-blocks') }
      />
    </SlideCard>
  )
}

