import { __ } from '@wordpress/i18n';

export const POPOVER_TUTORIAL_OPTIONS = {
	'basic-1': [
		{
			key: 'add-logo',
			placement: 'bottom-start',
		},
		{
			key: 'add-navigation',
			placement: 'bottom-center',
		},
		{
			key: 'edit-button',
			placement: 'bottom-end',
		},
		{
			key: 'edit-appearance',
			placement: 'bottom-start',
		},
		{
			key: 'visual-builder',
			placement: 'bottom-start',
		},
	],
	'basic-2': [
		{
			key: 'add-logo',
			placement: 'bottom-end',
		},
		{
			key: 'add-navigation',
			placement: 'bottom-end',
		},
		{
			key: 'edit-button',
			placement: 'bottom-end',
		},
		{
			key: 'edit-appearance',
			placement: 'bottom-start',
		},
		{
			key: 'visual-builder',
			placement: 'bottom-start',
		},
	],
	'basic-3': [
		{
			key: 'add-logo',
			placement: 'bottom-center',
		},
		{
			key: 'add-navigation',
			placement: 'bottom-center',
		},
		{
			key: 'edit-button',
			placement: 'bottom-end',
		},
		{
			key: 'edit-appearance',
			placement: 'bottom-start',
		},
		{
			key: 'visual-builder',
			placement: 'bottom-start',
		},
	],
	'basic-4': [
		{
			key: 'add-logo',
			placement: 'bottom-center',
		},
		{
			key: 'add-navigation',
			placement: 'bottom-center',
		},
		{
			key: 'edit-appearance',
			placement: 'bottom-start',
		},
		{
			key: 'visual-builder',
			placement: 'bottom-start',
		},
		{
			key: 'off-canvas-trigger',
			placement: 'bottom-start',
		},
		{
			key: 'off-canvas-content',
			placement: 'bottom-start',
		},
	],
	'basic-5': [
		{
			key: 'add-logo',
			placement: 'bottom-start',
		},
		{
			key: 'edit-appearance',
			placement: 'bottom-start',
		},
		{
			key: 'visual-builder',
			placement: 'bottom-start',
		},
		{
			key: 'off-canvas-trigger',
			placement: 'bottom-end',
		},
		{
			key: 'off-canvas-content',
			placement: 'bottom-end',
		},
	],
	'basic-6': [
		{
			key: 'add-logo',
			placement: 'bottom-center',
		},
		{
			key: 'edit-button',
			placement: 'bottom-start',
		},
		{
			key: 'edit-appearance',
			placement: 'bottom-start',
		},
		{
			key: 'visual-builder',
			placement: 'bottom-start',
		},
		{
			key: 'off-canvas-trigger',
			placement: 'bottom-end',
		},
		{
			key: 'off-canvas-content',
			placement: 'bottom-end',
		},
	],
	'basic-7': [
		{
			key: 'add-logo',
			placement: 'bottom-center',
		},
		{
			key: 'edit-appearance',
			placement: 'bottom-start',
		},
		{
			key: 'visual-builder',
			placement: 'bottom-start',
		},
		{
			key: 'off-canvas-trigger',
			placement: 'bottom-start',
		},
		{
			key: 'off-canvas-content',
			placement: 'bottom-start',
		},
	],
	'multi-row-1': [
		{
			key: 'add-logo',
			placement: 'bottom-center',
		},
		{
			key: 'edit-navigation',
			placement: 'bottom-center',
		},
		{
			key: 'edit-appearance',
			placement: 'bottom-start',
		},
		{
			key: 'visual-builder',
			placement: 'bottom-start',
		},
	],
	'multi-row-2': [
		{
			key: 'add-logo',
			placement: 'bottom-start',
		},
		{
			key: 'edit-navigation',
			placement: 'bottom-end',
		},
		{
			key: 'edit-button',
			placement: 'bottom-end',
		},
		{
			key: 'edit-appearance',
			placement: 'bottom-start',
		},
		{
			key: 'visual-builder',
			placement: 'bottom-start',
		},
	],
	'multi-row-3': [
		{
			key: 'add-logo',
			placement: 'bottom-center',
		},
		{
			key: 'edit-navigation',
			placement: 'bottom-start',
		},
		{
			key: 'edit-appearance',
			placement: 'bottom-start',
		},
		{
			key: 'visual-builder',
			placement: 'bottom-start',
		},
	],
	'multi-row-4': [
		{
			key: 'add-logo',
			placement: 'bottom-start',
		},
		{
			key: 'edit-navigation',
			placement: 'bottom-center',
		},
		{
			key: 'edit-appearance',
			placement: 'bottom-start',
		},
		{
			key: 'visual-builder',
			placement: 'bottom-start',
		},
	],
	'multi-row-5': [
		{
			key: 'add-logo',
			placement: 'bottom-start',
		},
		{
			key: 'edit-navigation',
			placement: 'bottom-center',
		},
		{
			key: 'edit-appearance',
			placement: 'bottom-start',
		},
		{
			key: 'visual-builder',
			placement: 'bottom-start',
		},
	],
	generic: [
		{
			key: 'edit-appearance',
			placement: 'bottom-start',
		},
		{
			key: 'visual-builder',
			placement: 'bottom-start',
		},
	],
};

export const POPOVER_TUTORIAL_OPTIONS_CONTENT = {
	'add-logo': {
		title: __('Add Logo', 'kadence-blocks'),
		content: __("Replace the preset logo with your website's logo.", 'kadence-blocks'),
	},
	'add-navigation': {
		title: __('Add Navigation', 'kadence-blocks'),
		content: __('Create a new navigation, or use an existing one.', 'kadence-blocks'),
	},
	'edit-button': {
		title: __('Customize CTAs', 'kadence-blocks'),
		content: __('Edit and customize your Call to Actions and Social Links.', 'kadence-blocks'),
	},
	'edit-appearance': {
		title: __('Edit Appearance', 'kadence-blocks'),
		content: __("Customize your header's appearance to your own needs.", 'kadence-blocks'),
	},
	'visual-builder': {
		title: __('Use the Visual Builder', 'kadence-blocks'),
		content: __(
			'Easily arrange the layout of your header with the Visual Builder. Look for it at the bottom of the editor.',
			'kadence-blocks'
		),
	},
	'off-canvas-trigger': {
		title: __('Off Canvas Trigger', 'kadence-blocks'),
		content: __(
			'Your header has an off canvas area that opens when the trigger block is clicked/tapped.',
			'kadence-blocks'
		),
	},
	'off-canvas-content': {
		title: __('Manage Off Canvas Content', 'kadence-blocks'),
		content: __(
			'Edit your off canvas content by selecting the off canvas tab from the visual builder.',
			'kadence-blocks'
		),
	},
};
