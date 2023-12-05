/**
 * Wordpress dependencies
 */
import {
  Flex,
  FlexBlock,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { LocationSelectCard } from './location-select-card';
import './location-select-control.scss';

export function LocationSelectControl( props ) {
  const {
    label,
    locations = [],
    selected,
    onChange = () => {},
  } = props;

  return (
    <Flex className="location-select-control" direction="column">
      { label ? (
        <label className="location-select-control__label">{ label }</label>
      ) : null }
		  <Flex className="location-select-control__group" align="initial">
		    { locations && locations.map((location) => (
		      <FlexBlock>
		        <LocationSelectCard
		          selected={ selected === location.value }
		          icon={ location.icon }
		          text={ location.text }
		          value={ location.value }
		          onClick={ onChange }
		        />
		      </FlexBlock>
		    )) }
		  </Flex>
    </Flex>
  )
}

