import { __ } from '@wordpress/i18n';
import Select from 'react-select';
import { applyFilters } from '@wordpress/hooks';

export default function SubmitActionOptions({ setAttributes, selectedActions }) {
	const actionOptionsList = [
		{
			value: 'activecampaign',
			label: __('ActiveCampaign (Pro addon)', 'kadence-blocks'),
			help: __('Add user to ActiveCampaign', 'kadence-blocks'),
			isDisabled: true,
		},
		{
			value: 'autoEmail',
			label: __('Auto Respond Email (Pro addon)', 'kadence-blocks'),
			help: __('Send instant response to form entrant', 'kadence-blocks'),
			isDisabled: true,
		},
		{
			value: 'sendinblue',
			label: __('Brevo (SendInBlue) (Pro addon)', 'kadence-blocks'),
			help: __('Add user to Brevo list', 'kadence-blocks'),
			isDisabled: true,
		},
		{
			value: 'convertkit',
			label: __('Kit (ConvertKit) (Pro addon)', 'kadence-blocks'),
			help: __('Add user to Kit', 'kadence-blocks'),
			isDisabled: true,
		},
		{
			value: 'entry',
			label: __('Database Entry (Pro addon)', 'kadence-blocks'),
			help: __('Log each form submission', 'kadence-blocks'),
			isDisabled: true,
		},
		{ value: 'email', label: __('Email', 'kadence-blocks'), help: '', isDisabled: false },
		{
			value: 'fluentCRM',
			label: __('FluentCRM', 'kadence-blocks'),
			help: __('Add User to FluentCRM list', 'kadence-blocks'),
			isDisabled: false,
		},
		{
			value: 'getresponse',
			label: __('Get Response (Pro addon)', 'kadence-blocks'),
			help: __('Add User to Get Response list', 'kadence-blocks'),
			isDisabled: true,
		},
		{
			value: 'mailchimp',
			label: __('MailChimp (Pro addon)', 'kadence-blocks'),
			help: __('Add user to MailChimp list', 'kadence-blocks'),
			isDisabled: true,
		},
		{
			value: 'mailerlite',
			label: __('Mailerlite', 'kadence-blocks'),
			help: __('Add User to MailerLite list', 'kadence-blocks'),
			isDisabled: false,
		},
		{ value: 'redirect', label: __('Redirect', 'kadence-blocks'), help: '', isDisabled: false },
		{
			value: 'webhook',
			label: __('WebHook (Pro addon)', 'kadence-blocks'),
			help: __('Send form information to any third party webhook', 'kadence-blocks'),
			isDisabled: true,
		},
	];

	const filteredOptions = applyFilters('kadence.actionOptionsAdvancedForm', actionOptionsList);
	const selectedOptions = filteredOptions.filter((item) => selectedActions.includes(item.value));

	return (
		<Select
			className={'kb-adv-form-actions'}
			isMulti={true}
			value={selectedOptions}
			onChange={(selections) => {
				const valuesOnly = selections.map((item) => {
					return item.value;
				});
				setAttributes(valuesOnly, 'actions');
			}}
			options={filteredOptions}
		/>
	);
}
