import { __ } from '@wordpress/i18n';

import { Chip } from '../../components/chip';
import './slide-card-row.scss';

export function SlideCardToneRow({ tone, headline, content }) {
  return (
    <div className="slide-card-row--tone">
      { tone ? (
        <Chip text={ `${ __('Tone', 'kadence-blocks')}: ${ tone }` } />
      ) : null }
      { headline ? (
        <p className="slide-card-row__headline">{ headline }</p>
      ) : null }
      { content ? (
        <p className="slide-card-row__content">{ content }</p>
      ) : null }
    </div>
  )
}

