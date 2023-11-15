/**
 * Internal dependencies
 */
import './slide-card-row.scss';

export function SlideCardRow({ headline, content }) {
  return (
    <div className="slide-card-row">
      { headline ? (
        <p className="slide-card-row__headline"><b>{ headline }</b></p>
      ) : null }
      { content ? (
        <div className="slide-card-row__content">{ content }</div>
      ) : null }
    </div>
  )
}

