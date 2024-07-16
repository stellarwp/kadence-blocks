import { __ } from '@wordpress/i18n';
import {
	formTemplateContactAdvancedIcon,
	formTemplateSubscribeIcon,
	formTemplateSubscribeInFieldIcon,
} from '@kadence/icons';

import { OffCavnasIcon } from '../templates/icons/off-canvas.js';
import { MultiRowIcon } from '../templates/icons/multi-row.js';
import { BasicIcon } from '../templates/icons/basic.js';

export const FORM_STEPS = [
	{ key: 'start', name: __('Layout', 'kadence-blocks') },
	{ key: 'detail', name: __('Template', 'kadence-blocks') },
	{ key: 'off-canvas', name: __('Mobile', 'kadence-blocks') },
	{ key: 'title', name: __('Name', 'kadence-blocks') },
];

export const START_OPTIONS = [
	{ key: 'skip', name: __('Skip (blank)', 'kadence-blocks'), icon: '', isDisabled: false },
	{
		key: 'basic',
		name: __('Basic', 'kadence-blocks'),
		icon: BasicIcon,
		isDisabled: false,
	},
	{
		key: 'multi-row',
		name: __('Multi Row', 'kadence-blocks'),
		icon: MultiRowIcon,
		isDisabled: false,
	},
];

export const DETAIL_OPTIONS = [
	{
		key: 'off-canvas-1',
		name: __('Off Canvas 1', 'kadence-blocks'),
		icon: formTemplateSubscribeIcon,
		isDisabled: false,
		templateKey: 'basic',
	},
	{
		key: 'off-canvas-2',
		name: __('Off Canvas 2', 'kadence-blocks'),
		icon: formTemplateSubscribeIcon,
		isDisabled: false,
		templateKey: 'basic',
	},
	{
		key: 'off-canvas-3',
		name: __('Off Canvas 3', 'kadence-blocks'),
		icon: formTemplateSubscribeIcon,
		isDisabled: false,
		templateKey: 'basic',
	},
	{
		key: 'off-canvas-4',
		name: __('Off Canvas 4', 'kadence-blocks'),
		icon: formTemplateSubscribeIcon,
		isDisabled: false,
		templateKey: 'basic',
	},
	{
		key: 'multi-row-1',
		name: __('Multi-Row 1'),
		icon: formTemplateContactAdvancedIcon,
		isDisabled: false,
		templateKey: 'multi-row',
	},
	{
		key: 'multi-row-2',
		name: __('Multi-Row 2'),
		icon: formTemplateContactAdvancedIcon,
		isDisabled: false,
		templateKey: 'multi-row',
	},
	{
		key: 'multi-row-3',
		name: __('Multi-Row 3'),
		icon: formTemplateContactAdvancedIcon,
		isDisabled: false,
		templateKey: 'multi-row',
	},
	{
		key: 'multi-row-4',
		name: __('Multi-Row 4'),
		icon: formTemplateContactAdvancedIcon,
		isDisabled: false,
		templateKey: 'multi-row',
	},
	{
		key: 'multi-row-5',
		name: __('Multi-Row 5'),
		icon: formTemplateContactAdvancedIcon,
		isDisabled: false,
		templateKey: 'multi-row',
	},
	{
		key: 'basic-1',
		name: __('Basic 1'),
		icon: formTemplateSubscribeInFieldIcon,
		isDisabled: false,
		templateKey: 'basic',
	},
	{
		key: 'basic-2',
		name: __('Basic 2'),
		icon: formTemplateSubscribeInFieldIcon,
		isDisabled: false,
		templateKey: 'basic',
	},
	{
		key: 'basic-3',
		name: __('Basic 3'),
		icon: formTemplateSubscribeInFieldIcon,
		isDisabled: false,
		templateKey: 'basic',
	},
];

export const OFF_CANVAS_OPTIONS = [
	{
		key: 'off-canvas-1',
		name: __('Off Canvas 1', 'kadence-blocks'),
		icon: formTemplateSubscribeIcon,
		isDisabled: false,
		templateKey: 'basic',
	},
	{
		key: 'off-canvas-2',
		name: __('Off Canvas 2', 'kadence-blocks'),
		icon: formTemplateSubscribeIcon,
		isDisabled: false,
		templateKey: 'basic',
	},
	{
		key: 'off-canvas-3',
		name: __('Off Canvas 3', 'kadence-blocks'),
		icon: formTemplateSubscribeIcon,
		isDisabled: false,
		templateKey: 'basic',
	},
	{
		key: 'off-canvas-4',
		name: __('Off Canvas 4', 'kadence-blocks'),
		icon: formTemplateSubscribeIcon,
		isDisabled: false,
		templateKey: 'basic',
	},
];

export const POPOVER_TUTORIAL_OPTIONS = {
	basic: [
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
			placement: 'bottom-end',
		},
	],
	'multi-row': [
		{
			key: 'add-logo',
			placement: 'bottom-end',
		},
		{
			key: 'edit-button',
			placement: 'bottom-end',
		},
		{
			key: 'edit-appearance',
			placement: 'bottom-end',
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
};
