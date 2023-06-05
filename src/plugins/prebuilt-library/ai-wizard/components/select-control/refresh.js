/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { update, Icon } from '@wordpress/icons';
import { Spinner } from '@wordpress/components';

export function SelectControlRefresh({ loading, onClick }) {

	const classes = classnames( 'components-select-control__refresh', {
		'is-loading': loading,
	} );

	return (
		<div
		  className={ classes }
		  onClick={ loading ? null : () => onClick() }
		>
			<div style={{ marginInlineEnd: -1, lineHeight: 0, textAlign: 'right' }}>
			  { loading ? (
          <Spinner style={{ width: 14, height: 14, margin: '4px 5px 0px' }} />
			  ) : (
		      <Icon icon={ update } size={ 18 } />
			  ) }
			</div>
		</div>
	);
};

