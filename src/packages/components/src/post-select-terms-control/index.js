/* global wp */
/**
 * External dependencies
 */
import Select from 'react-select';
import { __ } from '@wordpress/i18n';
import { useState, useRef, useEffect } from '@wordpress/element';
import { Spinner } from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

export default function KadencePostSelectTerms( {
										value,
										onChange,
										source,
										isMulti = false,
									} ) {
	const [ isLoading, setIsLoading ] = useState( true );
	const [ terms, setTerms ] = useState( [] );
	const [ page, setPage ] = useState( 1 );
	const [ hasMore, setHasMore ] = useState( false );
	const theValue = value;
	useEffect( () => {
		if( source && typeof(window.kadence_blocks_params.taxonomies[source]) != 'undefined' && window.kadence_blocks_params.taxonomies[source] ){
			setTerms( Array.from(window.kadence_blocks_params.taxonomies[source]) );
			setIsLoading( false );
		} else {
			const options = {
				source,
				page,
				per_page: 50,
			};
			setIsLoading( true );
			apiFetch( {
				path: addQueryArgs(
					window.kadence_blocks_params.termEndpoint,
					options
				),
			} )
				.then( ( taxonomyItems ) => {
					if ( ! taxonomyItems ) {
						setTerms( [] );
						window.kadence_blocks_params.taxonomies[source] = [];
					} else {
						setTerms( taxonomyItems );
						window.kadence_blocks_params.taxonomies[source] = taxonomyItems;
					}
					setIsLoading( false );
				} )
				.catch( () => {
					setIsLoading( false );
					setTerms( [] );
					window.kadence_blocks_params.taxonomies[source] = [];
				} );
		}
	}, [ source ] );
	if ( isLoading ) {
		return (
			<Spinner />
		);
	}
	const customStyles = {
		menuPortal: (provided) => ({
			...provided,
			zIndex: 99999999,
		})
	}
	return (
		<div className={ 'kb-inner-term-select-wrap' }>
			<Select
				options={ terms }
				className="kb-dynamic-select"
				classNamePrefix="kbp"
				value={ isMulti ? value : ( '' !== value ? terms.filter( ( { value } ) => value === theValue ) : '' ) }
				isMulti={ isMulti }
				isSearchable={ true }
				isClearable={ true }
				menuPortalTarget={ document.body }
				styles={customStyles}
				maxMenuHeight={ 200 }
				placeholder={ __( 'Select Term', 'kadence-blocks' ) }
				onChange={ ( val ) => {
					if ( ! val ) {
						onChange( '' );
					} else if ( isMulti ) {
						onChange( val );
					} else {
						onChange( val.value );
					}
				} }
			/>
		</div>
	);
}
