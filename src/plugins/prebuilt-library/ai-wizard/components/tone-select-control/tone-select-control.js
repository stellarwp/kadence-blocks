/**
 * External dependencies
 */
import Select from 'react-select';

/**
 * Internal dependencies
 */
import { ToneSelectLabel } from './tone-select-label';
import './tone-select-control.scss';

export function ToneSelectControl(props) {
  const {
    options = [],
    value,
    ...rest
  } = props;

  if (! options.length) {
    return;
  }

  function formattedValue(obj) {
    if (obj && obj?.value && obj?.label) {
      return ({
        value: obj.value,
        label: <ToneSelectLabel { ...obj } />
      })
    }

    return;
  }
  
  return (
    <Select
      classNamePrefix="stellarwp-tone"
      value={ formattedValue(value) }
			options={ options.map((tone) => formattedValue(tone) ) }
			{ ...rest }
    />
  )
}

