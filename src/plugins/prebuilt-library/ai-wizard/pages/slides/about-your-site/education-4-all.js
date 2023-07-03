/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SlideCard } from '../slide-card';
import { SlideCardRow } from '../slide-card-row';

const content = `Education 4All is a non-profit organization dedicated to 
providing underprivileged children with access to quality education. Through 
initiatives like school infrastructure development, teacher training, 
curriculum development, and learning resource provision, we empower children, 
their families, and communities. Our mission is to break the cycle of poverty 
by equipping children with the tools they need for a brighter future and 
fostering sustainable development.`;

export function Education4All() {
  return (
    <SlideCard>
      <SlideCardRow
        headline={ __('Tell us about your organization', 'kadence-blocks') }
        content={ __(content, 'kadence-blocks') }
      />
    </SlideCard>
  )
}

