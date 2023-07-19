/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './form-section.scss';

export function FormSection( props ) {
  const {
    headline,
    content,
    children
  } = props;

  const formSectionClasses = classnames('form-section', 'stellarwp', 'stellarwp-body', {
    'has-children': children
  });

  return (
		<div className={ formSectionClasses }>
		  { headline ? (
			  <h2 className="form-section__headline stellarwp-h2">{ headline }</h2>
		  ) : null }
		  { content ? (
			  <p className="form-section__content stellarwp-small stellarwp-disabled">{ content }</p>
		  ) : null }
		  { children ? children : null }
		</div>
  )
}

