/**
 * Wordpress dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './progress-bar.scss';

export function ProgressBar( props ) {
  const {
    styles = {},
    value,
    message,
    color
  } = props;
  const [ barStyles, setBarStyles ] = useState({});
  const rootProps = {};

  useEffect(() => {
    const transform = value - 100;

    setBarStyles((previousStyles) => ({
      ...previousStyles,
      backgroundColor: color ? color : 'blue',
      transform: `translateX(${ transform }%)`,
    }))
  }, [ value, color, message ])

  if (value !== undefined) {
    rootProps['aria-valuenow'] = Math.round(value);
    rootProps['aria-valuemin'] = 0;
    rootProps['aria-valuemax'] = 100;

  }

  return (
    <div className="stellarwp-progress-bar" style={ styles }>
      <div className="stellarwp-progress-bar__wrap" { ...rootProps }>
        <span className="stellarwp-progress-bar__bar" style={ barStyles }></span>
      </div>
      { message ? (
        <span className="stellarwp-progress-bar__message" style={{ color: color ? color : 'inherit' }}>{ message }</span>
      ) : null }
    </div>
  )
}

