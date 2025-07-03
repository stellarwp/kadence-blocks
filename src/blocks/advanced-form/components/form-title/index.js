/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Placeholder, Button, TextControl, ButtonGroup, TextareaControl } from '@wordpress/components';
import { KadenceRadioButtons } from '@kadence/components';
import { useState } from '@wordpress/element';
import {
	formBlockIcon,
	formTemplateContactIcon,
	formTemplateContactAdvancedIcon,
	formTemplateSubscribeIcon,
	formTemplateSubscribeAdvancedIcon,
	formTemplateContactInFieldIcon,
	formTemplateContactDarkIcon,
	formTemplateContactUnderlineIcon,
	formTemplateContactAdvancedDarkIcon,
	formTemplateContactAdvancedUnderlineIcon,
	formTemplateContactAdvancedInFieldIcon,
	formTemplateSubscribeDarkIcon,
	formTemplateSubscribeUnderlineIcon,
	formTemplateSubscribeInFieldIcon,
	formTemplateSubscribeAdvancedDarkIcon,
	formTemplateSubscribeAdvancedUnderlineIcon,
	formTemplateSubscribeAdvancedInFieldIcon,
} from '@kadence/icons';
import { applyFilters } from '@wordpress/hooks';
import { map } from 'lodash';

export default function FormTitle({ setTitle, isAdding, existingTitle, onAdd }) {
	const [tmpTitle, setTmpTitle] = useState(existingTitle);
	const [initialDescription, setTmpDescription] = useState('');
	const [wizardStep, setWizardStep] = useState('start');
	const [template, setTemplate] = useState('');
	const [style, setStyle] = useState('basic');
	const [isSaving, setIsSaving] = useState(false);

	const formSteps = [
		{ key: 'start', name: __('Layout', 'kadence-blocks') },
		{ key: 'style', name: __('Style', 'kadence-blocks') },
		{ key: 'title', name: __('Title', 'kadence-blocks') },
	];
	const startLayoutOptions = [
		{ key: 'skip', name: __('Skip (blank)', 'kadence-blocks'), icon: '', isDisabled: false },
		{ key: 'contact', name: __('Contact', 'kadence-blocks'), icon: formTemplateContactIcon, isDisabled: false },
		{
			key: 'contactAdvanced',
			name: __('Contact With Options', 'kadence-blocks'),
			icon: formTemplateContactAdvancedIcon,
			isDisabled: false,
		},
		{
			key: 'subscribe',
			name: __('Subscribe', 'kadence-blocks'),
			icon: formTemplateSubscribeIcon,
			isDisabled: false,
		},
		{
			key: 'subscribeAdvanced',
			name: __('Subscribe With Name', 'kadence-blocks'),
			icon: formTemplateSubscribeAdvancedIcon,
			isDisabled: false,
		},
	];
	let styleIcons = {
		skip: formTemplateContactIcon,
		dark: formTemplateContactDarkIcon,
		infield: formTemplateContactInFieldIcon,
		underline: formTemplateContactUnderlineIcon,
	};
	if ('subscribe' === template) {
		styleIcons = {
			skip: formTemplateSubscribeIcon,
			dark: formTemplateSubscribeDarkIcon,
			infield: formTemplateSubscribeInFieldIcon,
			underline: formTemplateSubscribeUnderlineIcon,
		};
	} else if ('contactAdvanced' === template) {
		styleIcons = {
			skip: formTemplateContactAdvancedIcon,
			dark: formTemplateContactAdvancedDarkIcon,
			infield: formTemplateContactAdvancedInFieldIcon,
			underline: formTemplateContactAdvancedUnderlineIcon,
		};
	} else if ('subscribeAdvanced' === template) {
		styleIcons = {
			skip: formTemplateSubscribeAdvancedIcon,
			dark: formTemplateSubscribeAdvancedDarkIcon,
			infield: formTemplateSubscribeAdvancedInFieldIcon,
			underline: formTemplateSubscribeAdvancedUnderlineIcon,
		};
	}
	const startStyleOptions = [
		{ key: 'skip', name: __('Basic'), icon: styleIcons.skip, isDisabled: false },
		{ key: 'dark', name: __('Dark', 'kadence-blocks'), icon: styleIcons.dark, isDisabled: false },
		{ key: 'infield', name: __('Infield', 'kadence-blocks'), icon: styleIcons.infield, isDisabled: false },
		{ key: 'underline', name: __('Underline', 'kadence-blocks'), icon: styleIcons.underline, isDisabled: false },
	];
	const formTemplates = applyFilters('kadence.formTemplates', startLayoutOptions);
	const formStyles = applyFilters('kadence.formStyles', startStyleOptions);
	return (
		<Placeholder
			className="kb-select-or-create-placeholder kb-adv-form-select"
			icon={formBlockIcon}
			label={__('Kadence Form', 'kadence-blocks')}
		>
			<div className="kb-form-wizard-pagination">
				{map(formSteps, ({ name, key }, index) => (
					<Button
						key={key}
						className="kb-form-pagination-btn"
						isSmall
						onClick={() => {
							if (key === 'style' && (template === 'skip' || template === '')) {
								setWizardStep('start');
							} else {
								setWizardStep(key);
							}
						}}
						icon={<span className="kb-form-pagination-icon">{index + 1}</span>}
						aria-label={sprintf(
							/* translators: 1: current page number 2: total number of pages */
							__('Page %1$d of %2$d', 'kadence-blocks'),
							index + 1,
							formSteps.length
						)}
						text={name}
						isPressed={wizardStep == key}
					/>
				))}
			</div>
			<div className="kb-select-or-create-placeholder__actions">
				{wizardStep === 'start' && (
					<div className="kt-select-starter-style-forms">
						<div className="kt-select-starter-style-forms-title">
							{__('Select Initial Layout', 'kadence-blocks')}
						</div>
						<ButtonGroup
							className="kt-init-forms-btn-group"
							aria-label={__('Initial Layout', 'kadence-blocks')}
						>
							{map(formTemplates, ({ name, key, icon, isDisabled }) => (
								<Button
									key={key}
									className="kt-inital-form-style-btn"
									isSmall
									onClick={() => {
										setTemplate(key);
										if (tmpTitle === '') {
											'skip' === key
												? setTmpTitle(__('Blank Form', 'kadence-blocks'))
												: setTmpTitle(name + __('Form', 'kadence-blocks'));
										}
										if ('skip' === key) {
											setWizardStep('title');
										} else {
											setWizardStep('style');
										}
									}}
									isPressed={template == key}
									label={name}
									isDisabled={isDisabled}
								>
									{name}
									{icon}
									{key !== 'skip' && (
										<span className="template-select">{__('Select', 'kadence-blocks')}</span>
									)}
								</Button>
							))}
						</ButtonGroup>
					</div>
				)}
				{wizardStep === 'style' && (
					<>
						<div className="kt-select-starter-style-forms kt-select-starter-styles-only">
							<div className="kt-select-starter-style-forms-title">
								{__('Select Initial Style', 'kadence-blocks')}
							</div>
							<ButtonGroup
								className="kt-init-forms-btn-group style-only"
								aria-label={__('Initial Style', 'kadence-blocks')}
							>
								{map(formStyles, ({ name, key, icon, isDisabled }) => (
									<Button
										key={key}
										className="kt-inital-form-style-btn"
										isSmall
										onClick={() => {
											setStyle(key);
											setWizardStep('title');
										}}
										isPressed={style == key}
										isDisabled={isDisabled}
										label={name}
									>
										{name}
										{icon}
										<span className="template-select">{__('Select', 'kadence-blocks')}</span>
									</Button>
								))}
							</ButtonGroup>
						</div>
					</>
				)}
				{wizardStep === 'title' && (
					<>
						<TextControl
							className={`kb-form-block-title${!tmpTitle ? ' kadence-input-required-warning' : ''}`}
							label={__('Give your form a title (required)', 'kadence-blocks')}
							placeholder={__('Contact Us', 'kadence-blocks')}
							help={__('This is used for your reference only.', 'kadence-blocks')}
							value={tmpTitle}
							onChange={setTmpTitle}
							autoFocus
						/>
						<TextareaControl
							label={__('Form Description', 'kadence-blocks')}
							placeholder={__('Optionally add an description about your form', 'kadence-blocks')}
							help={__('This is used for your reference only.', 'kadence-blocks')}
							value={initialDescription}
							onChange={setTmpDescription}
						/>
						<Button
							variant="primary"
							onClick={() => {
								setIsSaving(true);
								onAdd(tmpTitle, template, style, initialDescription);
							}}
							isBusy={isAdding}
							disabled={tmpTitle === '' || isSaving}
						>
							{__('Create', 'kadence-blocks')}
						</Button>
					</>
				)}
			</div>
		</Placeholder>
	);
}
