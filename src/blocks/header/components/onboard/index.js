/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Placeholder, Button, TextControl, ButtonGroup, TextareaControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import {
	headerBlockIcon,
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
import Select from 'react-select';

export default function HeaderOnboard({ isAdding, existingTitle, onAdd, availablePostTypes }) {
	const [tmpTitle, setTmpTitle] = useState(existingTitle);
	const [initialDescription, setTmpDescription] = useState('');
	const [wizardStep, setWizardStep] = useState('start');
	const [template, setTemplate] = useState('');
	const [detail, setDetail] = useState('');
	const [templateMobile, setTemplateMobile] = useState('');
	const [detailMobile, setDetailMobile] = useState('');
	const [isSaving, setIsSaving] = useState(false);

	const formSteps = [
		{ key: 'start', name: __('Desktop Layout', 'kadence-blocks') },
		{ key: 'detail', name: __('Desktop Detail', 'kadence-blocks') },
		{ key: 'start-mobile', name: __('Mobile Layout', 'kadence-blocks') },
		{ key: 'detail-mobile', name: __('Mobile Detail', 'kadence-blocks') },
		{ key: 'title', name: __('Title', 'kadence-blocks') },
	];
	const startOptions = [
		{ key: 'skip', name: __('Skip (blank)', 'kadence-blocks'), icon: '', isDisabled: false },
		{
			key: 'standard',
			name: __('Standard', 'kadence-blocks'),
			icon: formTemplateContactAdvancedIcon,
			isDisabled: false,
		},
		{
			key: 'off-canvas',
			name: __('Off Canvas', 'kadence-blocks'),
			icon: formTemplateSubscribeIcon,
			isDisabled: false,
		},
		{
			key: 'multi-row',
			name: __('Multi Row', 'kadence-blocks'),
			icon: formTemplateSubscribeAdvancedIcon,
			isDisabled: false,
		},
	];
	const detailOptions = [
		{ key: 'skip', name: __('Basic'), icon: formTemplateContactAdvancedIcon, isDisabled: false },
		{ key: 'dark', name: __('Dark', 'kadence-blocks'), icon: formTemplateSubscribeIcon, isDisabled: false },
	];
	const startMobileOptions = [
		{ key: 'skip', name: __('Skip (blank)', 'kadence-blocks'), icon: '', isDisabled: false },
		{
			key: 'standard',
			name: __('Standard', 'kadence-blocks'),
			icon: formTemplateContactAdvancedIcon,
			isDisabled: false,
		},
		{
			key: 'off-canvas',
			name: __('Off Canvas', 'kadence-blocks'),
			icon: formTemplateSubscribeIcon,
			isDisabled: false,
		},
		{
			key: 'multi-row',
			name: __('Multi Row', 'kadence-blocks'),
			icon: formTemplateSubscribeAdvancedIcon,
			isDisabled: false,
		},
	];
	const detailMobileOptions = [
		{ key: 'skip', name: __('Basic'), icon: formTemplateContactAdvancedIcon, isDisabled: false },
		{ key: 'dark', name: __('Dark', 'kadence-blocks'), icon: formTemplateSubscribeIcon, isDisabled: false },
	];
	const headerLayoutOptions = applyFilters('kadence.HeaderLayoutOptions', startOptions);
	const headerLayoutMobileOptions = applyFilters('kadence.HeaderLayoutMobileOptions', startMobileOptions);
	const headerDetailOptions = applyFilters('kadence.HeaderDetailOptions', detailOptions);
	const headerDetailMobileOptions = applyFilters('kadence.HeaderDetailMobileOptions', detailMobileOptions);
	return (
		<Placeholder
			className="kb-select-or-create-placeholder kb-adv-form-select"
			icon={headerBlockIcon}
			label={__('Advanced Header', 'kadence-blocks')}
		>
			<div className="kb-form-wizard-pagination">
				{map(formSteps, ({ name, key }, index) => (
					<Button
						key={key}
						className="kb-form-pagination-btn"
						isSmall
						onClick={() => {
							if (key === 'detail' && (template === 'skip' || template === '')) {
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
							{__('Select Initial Desktop Layout', 'kadence-blocks')}
						</div>
						<ButtonGroup
							className="kt-init-forms-btn-group"
							aria-label={__('Initial Desktop Layout', 'kadence-blocks')}
						>
							{map(headerLayoutOptions, ({ name, key, icon, isDisabled }) => (
								<Button
									key={key}
									className="kt-inital-form-style-btn"
									isSmall
									onClick={() => {
										setTemplate(key);
										if (tmpTitle === '') {
											'skip' === key
												? setTmpTitle(__('Blank Header', 'kadence-blocks'))
												: setTmpTitle(name + __(' Header', 'kadence-blocks'));
										}
										if ('skip' === key) {
											setWizardStep('title');
										} else {
											setWizardStep('detail'); // TODO: Set back to detail
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
				{wizardStep === 'detail' && (
					<>
						<div className="kt-select-starter-style-forms kt-select-starter-styles-only">
							<div className="kt-select-starter-style-forms-title">
								{__('Select Desktop Detailed Style', 'kadence-blocks')}
							</div>
							<ButtonGroup
								className="kt-init-forms-btn-group style-only"
								aria-label={__('Desktop Detailed Style', 'kadence-blocks')}
							>
								{map(headerDetailOptions, ({ name, key, icon, isDisabled }) => (
									<Button
										key={key}
										className="kt-inital-form-style-btn"
										isSmall
										onClick={() => {
											setDetail(key);
											setWizardStep('start-mobile');
										}}
										isPressed={detail == key}
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
				{wizardStep === 'start-mobile' && (
					<div className="kt-select-starter-style-forms">
						<div className="kt-select-starter-style-forms-title">
							{__('Select Initial Mobile Layout', 'kadence-blocks')}
						</div>
						<ButtonGroup
							className="kt-init-forms-btn-group"
							aria-label={__('Initial Desktop Layout', 'kadence-blocks')}
						>
							{map(headerLayoutMobileOptions, ({ name, key, icon, isDisabled }) => (
								<Button
									key={key}
									className="kt-inital-form-style-btn"
									isSmall
									onClick={() => {
										setTemplateMobile(key);
										if (tmpTitle === '') {
											'skip' === key
												? setTmpTitle(__('Blank Header', 'kadence-blocks'))
												: setTmpTitle(name + __(' Header', 'kadence-blocks'));
										}
										if ('skip' === key) {
											setWizardStep('title');
										} else {
											setWizardStep('detail-mobile');
										}
									}}
									isPressed={templateMobile == key}
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
				{wizardStep === 'detail-mobile' && (
					<>
						<div className="kt-select-starter-style-forms kt-select-starter-styles-only">
							<div className="kt-select-starter-style-forms-title">
								{__('Select Desktop Detailed Style', 'kadence-blocks')}
							</div>
							<ButtonGroup
								className="kt-init-forms-btn-group style-only"
								aria-label={__('Desktop Detailed Style', 'kadence-blocks')}
							>
								{map(headerDetailMobileOptions, ({ name, key, icon, isDisabled }) => (
									<Button
										key={key}
										className="kt-inital-form-style-btn"
										isSmall
										onClick={() => {
											setDetailMobile(key);
											setWizardStep('title');
										}}
										isPressed={detailMobile == key}
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
							label={__('Give your header a title (required)', 'kadence-blocks')}
							placeholder={__('Contact Us', 'kadence-blocks')}
							help={__('This is used for your reference only.', 'kadence-blocks')}
							value={tmpTitle}
							onChange={setTmpTitle}
							autoFocus
						/>
						<TextareaControl
							label={__('Header Description', 'kadence-blocks')}
							placeholder={__('Optionally add an description about your header', 'kadence-blocks')}
							help={__('This is used for your reference only.', 'kadence-blocks')}
							value={initialDescription}
							onChange={setTmpDescription}
						/>
						<Button
							variant="primary"
							onClick={() => {
								setIsSaving(true);
								onAdd(tmpTitle, template, detail, templateMobile, detailMobile, initialDescription);
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
