import { __ } from '@wordpress/i18n';
import { times } from 'lodash';
import { CheckboxControl } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';

export default function SubmitActionOptions( { setAttributes, selectedActions } ) {

	const actionOptionsList = [
		{ value: 'email', label: __( 'Email', 'kadence-blocks' ), help: '', isDisabled: false },
		{ value: 'redirect', label: __( 'Redirect', 'kadence-blocks' ), help: '', isDisabled: false },
		{ value: 'mailerlite', label: __( 'Mailerlite', 'kadence-blocks' ), help: __( 'Add User to MailerLite list', 'kadence-blocks' ), isDisabled: false },
		{ value: 'fluentCRM', label: __( 'FluentCRM', 'kadence-blocks' ), help: __( 'Add User to FluentCRM list', 'kadence-blocks' ), isDisabled: false },
		{ value: 'convertkit', label: __( 'ConvertKit (Pro addon)', 'kadence-blocks' ), help: __( 'Add user to ConvertKit', 'kadence-blocks' ), isDisabled: false }, // isDisabled: true },
		{ value: 'activecampaign', label: __( 'ActiveCampaign (Pro addon)', 'kadence-blocks' ), help: __( 'Add user to ActiveCampaign', 'kadence-blocks' ), isDisabled: false }, // isDisabled: true },
		{ value: 'autoEmail', label: __( 'Auto Respond Email (Pro addon)', 'kadence-blocks' ), help: __( 'Send instant response to form entrant', 'kadence-blocks' ), isDisabled: false }, // isDisabled: true },
		{ value: 'entry', label: __( 'Database Entry (Pro addon)', 'kadence-blocks' ), help: __( 'Log each form submission', 'kadence-blocks' ), isDisabled: false  }, // isDisabled: true },
		{ value: 'sendinblue', label: __( 'SendInBlue (Pro addon)', 'kadence-blocks' ), help: __( 'Add user to SendInBlue list', 'kadence-blocks' ), isDisabled: false }, // isDisabled: true },
		{ value: 'mailchimp', label: __( 'MailChimp (Pro addon)', 'kadence-blocks' ), help: __( 'Add user to MailChimp list', 'kadence-blocks' ), isDisabled: false }, // isDisabled: true },
		{ value: 'webhook', label: __( 'WebHook (Pro addon)', 'kadence-blocks' ), help: __( 'Send form information to any third party webhook', 'kadence-blocks' ), isDisabled: false }, // isDisabled: true },
	];

	const actionOptions = applyFilters( 'kadence.actionOptions', actionOptionsList );

	const actionControls = ( index ) => {

		return (
			<CheckboxControl
				key={'action-controls-' + index.toString()}
				label={actionOptions[ index ].label}
				help={( '' !== actionOptions[ index ].help ? actionOptions[ index ].help : undefined )}
				checked={selectedActions.includes( actionOptions[ index ].value )}
				disabled={actionOptions[ index ].isDisabled}
				onChange={( isChecked ) => {
					if ( isChecked && !actionOptions[ index ].isDisabled ) {
						addAction( actionOptions[ index ].value );
					} else {
						removeAction( actionOptions[ index ].value );
					}
				}}
			/>
		);
	};

	const addAction = ( value ) => {
		const newItems = selectedActions.map( ( item, thisIndex ) => {
			return item;
		} );

		newItems.push( value );

		setAttributes( { actions: newItems } );
	};

	const removeAction = ( value ) => {
		setAttributes( { actions: selectedActions.filter( item => item !== value ) } );
	};

	return (
		<>
			{actionOptions &&
				times( actionOptions.length, n => actionControls( n ) )
			}
		</>
	);

}
