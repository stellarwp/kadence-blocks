import { __ } from '@wordpress/i18n';
import {
	formTemplateContactAdvancedIcon,
	formTemplateSubscribeIcon,
	formTemplateSubscribeInFieldIcon,
} from '@kadence/icons';

import { OffCavnasIcon } from '../../templates/icons/off-canvas.js';
import { MultiRowIcon } from '../../templates/icons/multi-row.js';
import { BasicIcon } from '../../templates/icons/basic.js';

export const FORM_STEPS = [
	{ key: 'start', name: __('Desktop Layout', 'kadence-blocks') },
	{ key: 'detail', name: __('Desktop Detail', 'kadence-blocks') },
	{ key: 'start-mobile', name: __('Mobile Layout', 'kadence-blocks') },
	{ key: 'detail-mobile', name: __('Mobile Detail', 'kadence-blocks') },
	{ key: 'title', name: __('Title', 'kadence-blocks') },
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
		key: 'off-canvas',
		name: __('Off Canvas', 'kadence-blocks'),
		icon: OffCavnasIcon,
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
		templateKey: 'off-canvas',
	},
	{
		key: 'off-canvas-2',
		name: __('Off Canvas 2', 'kadence-blocks'),
		icon: formTemplateSubscribeIcon,
		isDisabled: false,
		templateKey: 'off-canvas',
	},
	{
		key: 'off-canvas-3',
		name: __('Off Canvas 3', 'kadence-blocks'),
		icon: formTemplateSubscribeIcon,
		isDisabled: false,
		templateKey: 'off-canvas',
	},
	{
		key: 'off-canvas-4',
		name: __('Off Canvas 4', 'kadence-blocks'),
		icon: formTemplateSubscribeIcon,
		isDisabled: false,
		templateKey: 'off-canvas',
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

export const START_MOBILE_OPTIONS = [
	{ key: 'skip', name: __('Skip (blank)', 'kadence-blocks'), icon: '', isDisabled: false },
	{
		key: 'basic',
		name: __('Basic', 'kadence-blocks'),
		icon: BasicIcon,
		isDisabled: false,
	},
	{
		key: 'off-canvas',
		name: __('Off Canvas', 'kadence-blocks'),
		icon: OffCavnasIcon,
		isDisabled: false,
	},
	{
		key: 'multi-row',
		name: __('Multi Row', 'kadence-blocks'),
		icon: MultiRowIcon,
		isDisabled: false,
	},
];

export const DETAIL_MOBILE_OPTIONS = [
	{
		key: 'off-canvas-1',
		name: __('Off Canvas 1', 'kadence-blocks'),
		icon: formTemplateSubscribeIcon,
		isDisabled: false,
		templateKey: 'off-canvas',
	},
	{
		key: 'off-canvas-2',
		name: __('Off Canvas 2', 'kadence-blocks'),
		icon: formTemplateSubscribeIcon,
		isDisabled: false,
		templateKey: 'off-canvas',
	},
	// {
	// 	key: 'off-canvas-3',
	// 	name: __('Off Canvas 3', 'kadence-blocks'),
	// 	icon: formTemplateSubscribeIcon,
	// 	isDisabled: false,
	// 	templateKey: 'off-canvas',
	// },
	{
		key: 'off-canvas-4',
		name: __('Off Canvas 4', 'kadence-blocks'),
		icon: formTemplateSubscribeIcon,
		isDisabled: false,
		templateKey: 'off-canvas',
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
	// {
	// 	key: 'multi-row-3',
	// 	name: __('Multi-Row 3'),
	// 	icon: formTemplateContactAdvancedIcon,
	// 	isDisabled: false,
	// 	templateKey: 'multi-row',
	// },
	// {
	// 	key: 'multi-row-4',
	// 	name: __('Multi-Row 4'),
	// 	icon: formTemplateContactAdvancedIcon,
	// 	isDisabled: false,
	// 	templateKey: 'multi-row',
	// },
	// {
	// 	key: 'multi-row-5',
	// 	name: __('Multi-Row 5'),
	// 	icon: formTemplateContactAdvancedIcon,
	// 	isDisabled: false,
	// 	templateKey: 'multi-row',
	// },
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
