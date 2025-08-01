import { __ } from '@wordpress/i18n';

export const fieldBlocks = [
	'kadence/advanced-form-text',
	'kadence/advanced-form-textarea',
	'kadence/advanced-form-select',
	'kadence/advanced-form-radio',
	'kadence/advanced-form-file',
	'kadence/advanced-form-time',
	'kadence/advanced-form-date',
	'kadence/advanced-form-telephone',
	'kadence/advanced-form-checkbox',
	'kadence/advanced-form-email',
	'kadence/advanced-form-accept',
	'kadence/advanced-form-number',
	'kadence/advanced-form-hidden',
];

export const fieldAutoFillOptions = [
	{ value: '', label: __('Default', 'kadence-blocks') },
	{ value: 'name', label: __('Name', 'kadence-blocks') },
	{ value: 'given-name', label: __('First Name', 'kadence-blocks') },
	{ value: 'family-name', label: __('Last Name', 'kadence-blocks') },
	{ value: 'email', label: __('Email', 'kadence-blocks') },
	{ value: 'organization', label: __('Organization', 'kadence-blocks') },
	{ value: 'street-address', label: __('Street Address', 'kadence-blocks') },
	{ value: 'address-line1', label: __('Address Line 1', 'kadence-blocks') },
	{ value: 'address-line2', label: __('Address Line 2', 'kadence-blocks') },
	{ value: 'country-name', label: __('Country Name', 'kadence-blocks') },
	{ value: 'postal-code', label: __('Postal Code', 'kadence-blocks') },
	{ value: 'tel', label: __('Telephone', 'kadence-blocks') },
	{ value: 'custom', label: __('Custom', 'kadence-blocks') },
	{ value: 'off', label: __('Off', 'kadence-blocks') },
];
