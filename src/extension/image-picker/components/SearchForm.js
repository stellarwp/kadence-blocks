import { useRef } from "@wordpress/element";
import { debounce } from 'lodash';

import { __experimentalInputControl as InputControl } from '@wordpress/components';
import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Render the search form as a component.
 *
 * @return {JSX.Element} The SearchForm component.
 */
export default function SearchForm(props) {

    const {
        query,
        setQuery
    } = props

	return (
        <InputControl
            label={__("Search", "kadence_blocks")}
            placeholder={__("Search Images...", "kadence_blocks")}
            hideLabelFromVision={true}
            value={ query }
            onChange={ ( value ) => setQuery( value ?? '' ) }
        />
	);
}
