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
    maxMenuHeight,
    menuPlacement,
    options = [],
    value,
    ...rest
  } = props;

  if (! options.length) {
    return;
  }
  
  return (
    <Select
      maxMenuHeight={ maxMenuHeight }
      menuPlacement={ menuPlacement }
      classNamePrefix="stellarwp-tone"
      value={ value }
      options={ options }
      getOptionLabel={ (option) => <ToneSelectLabel { ...option } /> }
			{ ...rest }
    />
  )
}

