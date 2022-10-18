import { __ } from '@wordpress/i18n';
import { map } from 'lodash';
import {
	TabPanel,
	Dashicon,
	SelectControl,
	ExternalLink,
	TextControl,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';

export default function ColumnWidth( { saveSubmit, width } ) {

	return (
		<TabPanel className="kt-size-tabs"
				  activeClass="active-tab"
				  tabs={[
					  {
						  name     : 'desk',
						  title    : <Dashicon icon="desktop"/>,
						  className: 'kt-desk-tab',
					  },
					  {
						  name     : 'tablet',
						  title    : <Dashicon icon="tablet"/>,
						  className: 'kt-tablet-tab',
					  },
					  {
						  name     : 'mobile',
						  title    : <Dashicon icon="smartphone"/>,
						  className: 'kt-mobile-tab',
					  },
				  ]}>
			{
				( tab ) => {
					let tabout;
					if ( tab.name ) {
						if ( 'mobile' === tab.name ) {
							tabout = (
								<SelectControl
									value={width[ 2 ]}
									options={[
										{ value: '20', label: __( '20%', 'kadence-blocks' ) },
										{ value: '25', label: __( '25%', 'kadence-blocks' ) },
										{ value: '33', label: __( '33%', 'kadence-blocks' ) },
										{ value: '40', label: __( '40%', 'kadence-blocks' ) },
										{ value: '50', label: __( '50%', 'kadence-blocks' ) },
										{ value: '60', label: __( '60%', 'kadence-blocks' ) },
										{ value: '66', label: __( '66%', 'kadence-blocks' ) },
										{ value: '75', label: __( '75%', 'kadence-blocks' ) },
										{ value: '80', label: __( '80%', 'kadence-blocks' ) },
										{ value: '100', label: __( '100%', 'kadence-blocks' ) },
										{ value: 'unset', label: __( 'Unset', 'kadence-blocks' ) },
									]}
									onChange={value => {
										saveSubmit( { width: [ ( width[ 0 ] ? width[ 0 ] : '100' ), ( width[ 1 ] ? width[ 1 ] : '' ), value ] } );
									}}
								/>
							);
						} else if ( 'tablet' === tab.name ) {
							tabout = (
								<SelectControl
									value={width[ 1 ]}
									options={[
										{ value: '20', label: __( '20%', 'kadence-blocks' ) },
										{ value: '25', label: __( '25%', 'kadence-blocks' ) },
										{ value: '33', label: __( '33%', 'kadence-blocks' ) },
										{ value: '40', label: __( '40%', 'kadence-blocks' ) },
										{ value: '50', label: __( '50%', 'kadence-blocks' ) },
										{ value: '60', label: __( '60%', 'kadence-blocks' ) },
										{ value: '66', label: __( '66%', 'kadence-blocks' ) },
										{ value: '75', label: __( '75%', 'kadence-blocks' ) },
										{ value: '80', label: __( '80%', 'kadence-blocks' ) },
										{ value: '100', label: __( '100%', 'kadence-blocks' ) },
										{ value: 'unset', label: __( 'Unset', 'kadence-blocks' ) },
									]}
									onChange={value => {
										saveSubmit( { width: [ ( width[ 0 ] ? width[ 0 ] : '100' ), value, ( width[ 2 ] ? width[ 2 ] : '' ) ] } );
									}}
								/>
							);
						} else {
							tabout = (
								<SelectControl
									value={width[ 0 ]}
									options={[
										{ value: '20', label: __( '20%', 'kadence-blocks' ) },
										{ value: '25', label: __( '25%', 'kadence-blocks' ) },
										{ value: '33', label: __( '33%', 'kadence-blocks' ) },
										{ value: '40', label: __( '40%', 'kadence-blocks' ) },
										{ value: '50', label: __( '50%', 'kadence-blocks' ) },
										{ value: '60', label: __( '60%', 'kadence-blocks' ) },
										{ value: '66', label: __( '66%', 'kadence-blocks' ) },
										{ value: '75', label: __( '75%', 'kadence-blocks' ) },
										{ value: '80', label: __( '80%', 'kadence-blocks' ) },
										{ value: '100', label: __( '100%', 'kadence-blocks' ) },
										{ value: 'unset', label: __( 'Unset', 'kadence-blocks' ) },
									]}
									onChange={value => {
										saveSubmit( { width: [ value, ( width[ 1 ] ? width[ 1 ] : '' ), ( width[ 2 ] ? width[ 2 ] : '' ) ] } );
									}}
								/>
							);
						}
					}
					return <div className={tab.className} key={tab.className}>{tabout}</div>;
				}
			}
		</TabPanel>
	);

}
