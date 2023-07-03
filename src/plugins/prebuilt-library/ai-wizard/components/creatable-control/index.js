/**
 * External dependencies
 */
import { Creatable } from 'react-select';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './creatable-control.scss';

export function CreatableControl( props ) {
  const {
    label,
    options,
    value,
    prefix
  } = props;

  const containerClasses = classnames('components-input-control__container', {
    'has-prefix': !! prefix
  });

  return (
		<div className="stellarwp components-creatable-control">
		  { label ? (
			  <label className="components-input-control__label">
				  { label }
			  </label>
		  ) : null }
			<div className={ containerClasses }>
			  { prefix ? prefix : null }
				<Creatable
				  classNamePrefix="stellarwp-creatable"
				  styles={{
				    control: (baseStyles, state) => ({
              ...baseStyles,
				      fontSize: 16,
				      boxShadow: 'none',
              borderColor: state.isFocused ? '#000000' : '#DFDFDF',
				    }),
				    valueContainer: (baseStyles) => ({
              ...baseStyles,
              paddingLeft: prefix ? 35 : 8
				    }),
				    menu: (baseStyles) => ({
				      ...baseStyles,
				      fontSize: 16,
				    }),
				    indicatorsContainer: (baseStyles) => ({
				      ...baseStyles,
				      color: '#000000'
				    }),
				  }}
					isClearable
					options={ options }
				/>
			</div>
		</div>
  )
}

