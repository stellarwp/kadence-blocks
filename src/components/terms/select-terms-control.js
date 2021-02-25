/* global wp */

import PropTypes from 'prop-types';

import _uniqBy from 'lodash/uniqBy';
import Select from 'react-select';
import { fetchJson } from './../common/fetch';

const { addQueryArgs } = wp.url;
import { __ } from '@wordpress/i18n';
const {
	Component,
} = wp.element;
class KadenceSelectTerms extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			options: [],
			isLoading: false,
			page: 1,
			hasMore: false,
		};
	}
	componentDidMount() {
		this.fetchPostAbortController = new AbortController();
		this.fetchTerms();
	}

	componentWillUnmount() {
		this.fetchPostAbortController && this.fetchPostAbortController.abort();
	}

	fetchTerms() {
		const { restBase } = this.props;
		const { page, options, search } = this.state;

		const query = {
			page,
			per_page: 10,
		};

		if ( search && search.length >= 3 ) {
			query.search = search;
		}

		this.setState( { isLoading: true } );

		fetchJson( {
			path: addQueryArgs( `${ restBase }/`, query ),
			signal: this.fetchPostAbortController.signal,
		} ).then( ( [ terms, headers ] ) => {
			const newOptions = _uniqBy( [ ...options, ...terms.map( term => ( {
				value: term.id,
				label: term.name,
			} ) ) ], 'value' );

			this.setState( {
				options: newOptions,
				hasMore: parseInt( headers[ 'x-wp-totalpages' ], 10 ) > page,
				isLoading: false,
			} );
		} );
	}

	fetchMoreTerms() {
		const { page, hasMore, isLoading } = this.state;

		if ( ! hasMore || isLoading ) {
			return;
		}

		this.setState( { page: page + 1 }, () => this.fetchTerms() );
	}

	updateSearch( search ) {
		if ( search.length >= 3 ) {
			this.setState( {
				search,
				page: 1,
			}, () => this.fetchTerms() );
		}
	}

	handleChange( value ) {
		const { onChange } = this.props;
		this.setState( {
			search: null,
			page: 1,
		} );
		onChange( value );
	}

	render() {
		return (
			<div className="term-select-form-row">
				<label htmlFor={ this.props.fieldId } className="screen-reader-text">
					{ this.props.placeholder }
				</label>
				<Select
					value={ this.props.value }
					onChange={ value => this.handleChange( value ) }
					id={ this.props.fieldId }
					options={ this.state.options }
					isMulti={ true }
					classNamePrefix="kt-tax-select"
					isLoading={ this.state.isLoading }
					onMenuScrollToBottom={ () => this.fetchMoreTerms() }
					onInputChange={ s => this.updateSearch( s ) }
					maxMenuHeight={ 300 }
					placeholder={ this.props.placeholder }
				/>
			</div>
		);
	}
}

KadenceSelectTerms.propTypes = {
	fieldId: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	restBase: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
}

export default KadenceSelectTerms;
