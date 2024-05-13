/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Placeholder, Button, TextControl, ButtonGroup, TextareaControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { headerBlockIcon } from '@kadence/icons';
import { applyFilters } from '@wordpress/hooks';
import { map } from 'lodash';
import { DETAIL_MOBILE_OPTIONS, DETAIL_OPTIONS, FORM_STEPS, START_MOBILE_OPTIONS, START_OPTIONS } from './constants';

export default function HeaderOnboard({ isAdding, existingTitle, onAdd }) {
	const [tmpTitle, setTmpTitle] = useState(existingTitle);
	const [initialDescription, setTmpDescription] = useState('');
	const [wizardStep, setWizardStep] = useState('start');
	const [template, setTemplate] = useState('');
	const [detail, setDetail] = useState('');
	const [templateMobile, setTemplateMobile] = useState('');
	const [detailMobile, setDetailMobile] = useState('');
	const [isSaving, setIsSaving] = useState(false);

	const headerLayoutOptions = applyFilters('kadence.HeaderLayoutOptions', START_OPTIONS);
	const headerLayoutMobileOptions = applyFilters('kadence.HeaderLayoutMobileOptions', START_MOBILE_OPTIONS);
	const headerDetailOptions = applyFilters('kadence.HeaderDetailOptions', DETAIL_OPTIONS);
	const headerDetailMobileOptions = applyFilters('kadence.HeaderDetailMobileOptions', DETAIL_MOBILE_OPTIONS);

	return (
		<Placeholder
			className="kb-select-or-create-placeholder kb-adv-form-select"
			icon={headerBlockIcon}
			label={__('Advanced Header', 'kadence-blocks')}
		>
			<div className="kb-form-wizard-pagination">
				{map(FORM_STEPS, ({ name, key }, index) => (
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
							FORM_STEPS.length
						)}
						text={name}
						isPressed={wizardStep === key}
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
											setWizardStep('detail');
										}
									}}
									isPressed={template === key}
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
								{map(headerDetailOptions, ({ name, key, icon, isDisabled, templateKey }) => {
									if (template !== templateKey) {
										return null;
									}

									return (
										<Button
											key={key}
											className="kt-inital-form-style-btn"
											isSmall
											onClick={() => {
												setDetail(key);
												setWizardStep('start-mobile');
											}}
											isPressed={detail === key}
											isDisabled={isDisabled}
											label={name}
										>
											{name}
											{icon}
											<span className="template-select">{__('Select', 'kadence-blocks')}</span>
										</Button>
									);
								})}
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
									isPressed={templateMobile === key}
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
