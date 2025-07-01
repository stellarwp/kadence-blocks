/**
 * WordPress dependencies
 */
import {
	TextControl,
	SelectControl,
	ToggleControl,
	Button,
	TextareaControl,
	Spinner,
	ExternalLink,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps, store as blockEditorStore } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	KadencePanelBody,
	InspectorControlTabs,
	ResponsiveRangeControls,
	SelectParentBlock,
} from '@kadence/components';
import { useEffect, useState } from '@wordpress/element';
import { uniqueIdHelper, getPreviewSize } from '@kadence/helpers';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import classNames from 'classnames';
import { FieldBlockAppender, getUniqueFieldId } from '../../components';
import { get } from 'lodash';
import ReCAPTCHA from 'react-google-recaptcha';
import Turnstile from 'react-turnstile';
import HCaptcha from '@hcaptcha/react-hcaptcha';

/**
 * Import Css
 */
import './editor.scss';

function FieldCaptcha(props) {
	const { attributes, setAttributes, isSelected, clientId, context, name } = props;
	//usekcsettings is to use settings from the seperate kadence captcha plugin
	//usekbsettings is to use the global kadence blocks settings for captions
	const {
		uniqueID,
		hideRecaptcha,
		type,
		useKcSettings,
		useKbSettings,
		showRecaptchaNotice,
		recaptchaNotice,
		theme,
		size,
		maxWidth,
		minWidth,
		maxWidthUnit,
		minWidthUnit,
		requiredMessage,
		recaptchaSiteKey,
		recaptchaSecretKey,
		recaptchaLanguage,
		hCaptchaSiteKey,
		hCaptchaSecretKey,
		turnstileSiteKey,
		turnstileSecretKey,
	} = attributes;
	const [activeTab, setActiveTab] = useState('general');
	const { previewDevice } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			};
		},
		[clientId]
	);

	useEffect(() => {
		// Doesn't worry about if a filed is duplicated. Duplicated fields get a custom ID through the watch at the form level.
		const uniqueId = getUniqueFieldId(uniqueID, clientId);
		if (uniqueId !== uniqueID) {
			attributes.uniqueID = uniqueId;
			setAttributes({ uniqueID: uniqueId });
		}
	}, []);

	useEffect(() => {
		const neededFields = [
			'kadence_blocks_recaptcha_site_key',
			'kadence_blocks_recaptcha_secret_key',
			'kadence_blocks_recaptcha_language',
			'kadence_blocks_hcaptcha_site_key',
			'kadence_blocks_hcaptcha_secret_key',
			'kadence_blocks_turnstile_site_key',
			'kadence_blocks_turnstile_secret_key',
			'kt_recaptcha',
		];

		/**
		 * Get settings
		 */
		apiFetch({
			path: addQueryArgs('/wp/v2/settings', { _fields: neededFields }),
			method: 'GET',
		}).then((response) => {
			setRecaptchaSiteKeyState(response.kadence_blocks_recaptcha_site_key);
			setRecaptchaSecretKeyState(response.kadence_blocks_recaptcha_secret_key);
			setRecaptchaLanguageState(response.kadence_blocks_recaptcha_language);

			setHCaptchaSiteKeyState(response.kadence_blocks_hcaptcha_site_key);
			setHCaptchaSecretKeyState(response.kadence_blocks_hcaptcha_secret_key);

			setTurnstileSiteKeyState(response.kadence_blocks_turnstile_site_key);
			setTurnstileSecretKeyState(response.kadence_blocks_turnstile_secret_key);

			try {
				setKadenceRecaptha(JSON.parse(get(response, 'kt_recaptcha', {})));
			} catch (e) {
				setKadenceRecaptha({});
			}

			setSettingsLoaded(true);
		});
	}, [type]);

	const previewMaxWidth = getPreviewSize(
		previewDevice,
		maxWidth && maxWidth[0] ? maxWidth[0] : '',
		maxWidth && maxWidth[1] ? maxWidth[1] : '',
		maxWidth && maxWidth[2] ? maxWidth[2] : ''
	);
	const previewMinWidth = getPreviewSize(
		previewDevice,
		minWidth && minWidth[0] ? minWidth[0] : '',
		minWidth && minWidth[1] ? minWidth[1] : '',
		minWidth && minWidth[2] ? minWidth[2] : ''
	);

	const hasKadenceCaptcha = kadence_blocks_params.hasKadenceCaptcha !== '';

	const classes = classNames({
		'kb-adv-form-field': true,
	});
	const blockProps = useBlockProps({
		className: classes,
		style: {
			maxWidth: '' !== previewMaxWidth ? previewMaxWidth + (maxWidthUnit ? maxWidthUnit : '%') : undefined,
			minWidth: '' !== previewMinWidth ? previewMinWidth + (minWidthUnit ? minWidthUnit : 'px') : undefined,
		},
	});

	const [settingsLoaded, setSettingsLoaded] = useState(false);
	const [recaptchaSiteKeyState, setRecaptchaSiteKeyState] = useState('-');
	const [recaptchaSecretKeyState, setRecaptchaSecretKeyState] = useState('');
	const [recaptchaLanguageState, setRecaptchaLanguageState] = useState('');
	const [hCaptchaSiteKeyState, setHCaptchaSiteKeyState] = useState('-');
	const [hCaptchaSecretKeyState, setHCaptchaSecretKeyState] = useState('');
	const [turnstileSiteKeyState, setTurnstileSiteKeyState] = useState('-');
	const [turnstileSecretKeyState, setTurnstileSecretKeyState] = useState('');

	const [kadenceRecaptha, setKadenceRecaptha] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const allowedTabs = ['general', 'style', 'advanced'];
	const linkToKadenceCaptchaSettings = (
		<a
			href={kadence_blocks_params.adminUrl + 'options-general.php?page=kadence-recaptcha-settings'}
			target={'_blank'}
			rel="noreferrer"
		>
			{__('Modify Kadence Captcha settings', 'kadence-blocks')}
		</a>
	);

	const kcKeyToType = (key) => {
		const types = ['googlev2', 'googlev3', 'turnstile'];

		return types[key];
	};

	const previewType = useKcSettings ? kcKeyToType(get(kadenceRecaptha, 'enable_v3', 0)) : type;
	const previewRecaptchaSiteKey = useKcSettings
		? get(kadenceRecaptha, 'v3_re_site_key', '-')
		: useKbSettings
		? recaptchaSiteKeyState
		: recaptchaSiteKey;
	const previewRecaptchaSecretKey = useKbSettings ? recaptchaSecretKeyState : recaptchaSecretKey;
	const previewRecaptchaLanguage = useKbSettings ? recaptchaLanguageState : recaptchaLanguage;
	const previewTurnstileSiteKey = useKcSettings
		? get(kadenceRecaptha, 'v3_re_site_key', '-')
		: useKbSettings
		? turnstileSiteKeyState
		: turnstileSiteKey;
	const previewTurnstileSecretKey = useKbSettings ? turnstileSecretKeyState : turnstileSecretKey;
	const previewhCaptchaSiteKey = useKcSettings
		? get(kadenceRecaptha, 'v3_re_site_key', '-')
		: useKbSettings
		? hCaptchaSiteKeyState
		: hCaptchaSiteKey;
	const previewhCaptchaSecretKey = useKbSettings ? hCaptchaSecretKeyState : hCaptchaSecretKey;
	const previewTheme = useKcSettings ? get(kadenceRecaptha, 'kt_re_theme', 'light') : theme;
	const previewSize = useKcSettings ? get(kadenceRecaptha, 'kt_re_size', 'normal') : size;
	const previewHide = useKcSettings ? get(kadenceRecaptha, 'hide_v3_badge', false) : hideRecaptcha;
	const previewShowNotice = useKcSettings ? get(kadenceRecaptha, 'show_v3_notice', true) : showRecaptchaNotice;
	const previewNotice = useKcSettings ? get(kadenceRecaptha, 'v3_notice', '') : recaptchaNotice;
	const googlev3HiddenNotice =
		previewNotice !== ''
			? previewNotice
			: __(
					'This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply',
					'kadence-blocks'
			  );

	const googleV2RerenderKey = theme + size + previewRecaptchaLanguage + previewRecaptchaSiteKey + recaptchaSecretKey;

	const saveCaptchaSetting = () => {
		setIsSaving(true);

		if (type === 'turnstile') {
			const settingModel = new wp.api.models.Settings({
				kadence_blocks_turnstile_site_key: turnstileSiteKeyState,
				kadence_blocks_turnstile_secret_key: turnstileSecretKeyState,
				kadence_blocks_recaptcha_language: recaptchaLanguageState,
			});

			settingModel.save().then((response) => {
				setIsSaving(false);
			});
		} else if (type === 'googlev2' || type === 'googlev3') {
			const settingModel = new wp.api.models.Settings({
				kadence_blocks_recaptcha_site_key: recaptchaSiteKeyState,
				kadence_blocks_recaptcha_secret_key: recaptchaSecretKeyState,
				kadence_blocks_recaptcha_language: recaptchaLanguageState,
			});

			settingModel.save().then((response) => {
				setIsSaving(false);
			});
		} else if (type === 'hcaptcha') {
			const settingModel = new wp.api.models.Settings({
				kadence_blocks_hcaptcha_site_key: hCaptchaSiteKeyState,
				kadence_blocks_hcaptcha_secret_key: hCaptchaSecretKeyState,
				kadence_blocks_recaptcha_language: recaptchaLanguageState,
			});

			settingModel.save().then((response) => {
				setIsSaving(false);
			});
		}
	};

	return (
		<>
			<style>
				{isSelected && (
					<>
						{`.block-editor-block-popover__inbetween-container .block-editor-block-list__insertion-point.is-with-inserter { display: none }`}
						;
					</>
				)}
			</style>
			<div {...blockProps}>
				<InspectorControls>
					<SelectParentBlock
						label={__('View Form Settings', 'kadence-blocks')}
						clientId={clientId}
						parentSlug={'kadence/advanced-form'}
					/>
					<InspectorControlTabs
						panelName={'advanced-form-date-general'}
						setActiveTab={(value) => setActiveTab(value)}
						activeTab={activeTab}
						allowedTabs={allowedTabs}
					/>
					{activeTab === 'general' && (
						<>
							<KadencePanelBody initialOpen={true} panelName={'kb-adv-form-captcha-controls'}>
								{hasKadenceCaptcha && (
									<ToggleControl
										label={__('Use Kadence Captcha Settings', 'kadence-blocks')}
										checked={useKcSettings}
										onChange={(value) => setAttributes({ useKcSettings: value })}
										help={__('Use settings from Kadence Captcha Plugin', 'kadence-blocks')}
									/>
								)}

								{hasKadenceCaptcha && useKcSettings ? (
									linkToKadenceCaptchaSettings
								) : (
									<>
										<SelectControl
											label={__('Captcha Type', 'kadence-blocks')}
											value={type}
											options={[
												{ value: 'googlev2', label: __('Google V2', 'kadence-blocks') },
												{ value: 'googlev3', label: __('Google V3', 'kadence-blocks') },
												{ value: 'turnstile', label: __('Turnstile', 'kadence-blocks') },
												{ value: 'hcaptcha', label: __('hCaptcha', 'kadence-blocks') },
											]}
											onChange={(value) => {
												setAttributes({ type: value });
											}}
										/>

										{type === 'turnstile' && (
											<>
												<TextControl
													label={__('Turnstile Site Key', 'kadence-blocks')}
													value={previewTurnstileSiteKey}
													onChange={(value) =>
														useKbSettings
															? setTurnstileSiteKeyState(value)
															: setAttributes({ turnstileSiteKey: value })
													}
												/>

												<TextControl
													label={__('Turnstile Secret Key', 'kadence-blocks')}
													value={previewTurnstileSecretKey}
													onChange={(value) =>
														useKbSettings
															? setTurnstileSecretKeyState(value)
															: setAttributes({ turnstileSecretKey: value })
													}
												/>

												{useKbSettings && (
													<div className="components-base-control">
														<Button
															isPrimary
															onClick={() => saveCaptchaSetting()}
															disabled={
																'' === previewTurnstileSiteKey ||
																'' === previewTurnstileSecretKey
															}
														>
															{isSaving
																? __('Saving', 'kadence-blocks')
																: __('Save', 'kadence-blocks')}
														</Button>
													</div>
												)}
											</>
										)}

										{(type === 'googlev2' || type === 'googlev3') && (
											<>
												<TextControl
													label={__('Recaptcha Site Key', 'kadence-blocks')}
													value={previewRecaptchaSiteKey}
													onChange={(value) =>
														useKbSettings
															? setRecaptchaSiteKeyState(value)
															: setAttributes({ recaptchaSiteKey: value })
													}
												/>

												<TextControl
													label={__('Recaptcha Secret Key', 'kadence-blocks')}
													value={previewRecaptchaSecretKey}
													onChange={(value) =>
														useKbSettings
															? setRecaptchaSecretKeyState(value)
															: setAttributes({ recaptchaSecretKey: value })
													}
												/>

												<TextControl
													label={__('Force Specific Language', 'kadence-blocks')}
													value={previewRecaptchaLanguage}
													onChange={(value) =>
														useKbSettings
															? setRecaptchaLanguageState(value)
															: setAttributes({ recaptchaLanguage: value })
													}
												/>
												<p className="kb-small-help">
													<ExternalLink
														href={'https://developers.google.com/recaptcha/docs/language/'}
													>
														{__('View language codes here', 'kadence-blocks')}
													</ExternalLink>
												</p>

												{useKbSettings && (
													<div className="components-base-control">
														<Button
															isPrimary
															onClick={() => saveCaptchaSetting()}
															disabled={
																'' === previewRecaptchaSiteKey ||
																'' === previewRecaptchaSecretKey
															}
														>
															{isSaving
																? __('Saving', 'kadence-blocks')
																: __('Save', 'kadence-blocks')}
														</Button>
													</div>
												)}
											</>
										)}

										{type === 'hcaptcha' && (
											<>
												<TextControl
													label={__('hCaptcha Site Key', 'kadence-blocks')}
													value={previewhCaptchaSiteKey}
													onChange={(value) =>
														useKbSettings
															? setHCaptchaSiteKeyState(value)
															: setAttributes({ hCaptchaSiteKey: value })
													}
												/>

												<TextControl
													label={__('hCaptcha Secret Key', 'kadence-blocks')}
													value={previewhCaptchaSecretKey}
													onChange={(value) =>
														useKbSettings
															? setHCaptchaSecretKeyState(value)
															: setAttributes({ hCaptchaSecretKey: value })
													}
												/>

												<TextControl
													label={__('Force Specific Language', 'kadence-blocks')}
													value={previewRecaptchaLanguage}
													onChange={(value) =>
														useKbSettings
															? setRecaptchaLanguageState(value)
															: setAttributes({ recaptchaLanguage: value })
													}
												/>

												{useKbSettings && (
													<div className="components-base-control">
														<Button
															isPrimary
															onClick={() => saveCaptchaSetting()}
															disabled={
																'' === previewhCaptchaSiteKey ||
																'' === previewhCaptchaSecretKey
															}
														>
															{isSaving
																? __('Saving', 'kadence-blocks')
																: __('Save', 'kadence-blocks')}
														</Button>
													</div>
												)}
											</>
										)}
										<ToggleControl
											label={__('Use Global Kadence Settings', 'kadence-blocks')}
											checked={useKbSettings}
											onChange={(value) => setAttributes({ useKbSettings: value })}
											help={__(
												'Use settings shared for all Kadence Form Captchas',
												'kadence-blocks'
											)}
										/>
									</>
								)}
							</KadencePanelBody>
						</>
					)}
					{activeTab === 'style' && (
						<KadencePanelBody>
							{type === 'googlev3' && useKcSettings === false && (
								<>
									<ToggleControl
										label={__('Hide reCAPTCHA badge', 'kadence-blocks')}
										checked={hideRecaptcha}
										onChange={(value) => setAttributes({ hideRecaptcha: value })}
										help={__(
											'Hiding requires that information about recaptcha be added to your form',
											'kadence-blocks'
										)}
									/>

									{hideRecaptcha && (
										<>
											<ToggleControl
												label={__('Add reCAPTCHA notice info to form', 'kadence-blocks')}
												checked={showRecaptchaNotice}
												onChange={(value) => setAttributes({ showRecaptchaNotice: value })}
												help={__(
													'This will add the required reCAPTCHA version 3 informtion to your form.',
													'kadence-blocks'
												)}
											/>

											{showRecaptchaNotice && (
												<TextareaControl
													label={__('Optional - Custom reCaptcha notice', 'kadence-blocks')}
													value={recaptchaNotice}
													onChange={(value) => setAttributes({ recaptchaNotice: value })}
													help={__(
														'If left empty then "This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply" is used.',
														'kadence-blocks'
													)}
												/>
											)}
										</>
									)}
								</>
							)}
							{useKcSettings === true && linkToKadenceCaptchaSettings}
							{useKcSettings === false && (
								<SelectControl
									label={__('Color Theme', 'kadence-blocks')}
									value={theme}
									options={[
										{ label: __('Light', 'kadence-blocks'), value: 'light' },
										{ label: __('Dark', 'kadence-blocks'), value: 'dark' },
									]}
									onChange={(value) => setAttributes({ theme: value })}
								/>
							)}

							{type !== 'googlev3' && (
								<SelectControl
									label={__('Size', 'kadence-blocks')}
									options={[
										{ label: __('Normal', 'kadence-blocks'), value: 'normal' },
										{ label: __('Compact', 'kadence-blocks'), value: 'compact' },
									]}
									value={size}
									onChange={(value) => setAttributes({ size: value })}
								/>
							)}
						</KadencePanelBody>
					)}
					{activeTab === 'advanced' && (
						<>
							<KadencePanelBody
								title={__('Field Width', 'kadence-blocks')}
								initialOpen={true}
								panelName={'kb-adv-form-date-width'}
							>
								<ResponsiveRangeControls
									label={__('Max Width', 'kadence-blocks')}
									value={undefined !== maxWidth && undefined !== maxWidth[0] ? maxWidth[0] : ''}
									onChange={(value) => {
										setAttributes({
											maxWidth: [
												value,
												undefined !== maxWidth && undefined !== maxWidth[1] ? maxWidth[1] : '',
												undefined !== maxWidth && undefined !== maxWidth[2] ? maxWidth[2] : '',
											],
										});
									}}
									tabletValue={undefined !== maxWidth && undefined !== maxWidth[1] ? maxWidth[1] : ''}
									onChangeTablet={(value) => {
										setAttributes({
											maxWidth: [
												undefined !== maxWidth && undefined !== maxWidth[0] ? maxWidth[0] : '',
												value,
												undefined !== maxWidth && undefined !== maxWidth[2] ? maxWidth[2] : '',
											],
										});
									}}
									mobileValue={undefined !== maxWidth && undefined !== maxWidth[2] ? maxWidth[2] : ''}
									onChangeMobile={(value) => {
										setAttributes({
											maxWidth: [
												undefined !== maxWidth && undefined !== maxWidth[0] ? maxWidth[0] : '',
												undefined !== maxWidth && undefined !== maxWidth[1] ? maxWidth[1] : '',
												value,
											],
										});
									}}
									min={0}
									max={maxWidthUnit === 'px' ? 2000 : 100}
									step={1}
									unit={maxWidthUnit ? maxWidthUnit : '%'}
									onUnit={(value) => {
										setAttributes({ maxWidthUnit: value });
									}}
									units={['px', '%', 'vw']}
								/>
								<ResponsiveRangeControls
									label={__('Min Width', 'kadence-blocks')}
									value={undefined !== minWidth && undefined !== minWidth[0] ? minWidth[0] : ''}
									onChange={(value) => {
										setAttributes({
											minWidth: [
												value,
												undefined !== minWidth && undefined !== minWidth[1] ? minWidth[1] : '',
												undefined !== minWidth && undefined !== minWidth[2] ? minWidth[2] : '',
											],
										});
									}}
									tabletValue={undefined !== minWidth && undefined !== minWidth[1] ? minWidth[1] : ''}
									onChangeTablet={(value) => {
										setAttributes({
											minWidth: [
												undefined !== minWidth && undefined !== minWidth[0] ? minWidth[0] : '',
												value,
												undefined !== minWidth && undefined !== minWidth[2] ? minWidth[2] : '',
											],
										});
									}}
									mobileValue={undefined !== minWidth && undefined !== minWidth[2] ? minWidth[2] : ''}
									onChangeMobile={(value) => {
										setAttributes({
											minWidth: [
												undefined !== minWidth && undefined !== minWidth[0] ? minWidth[0] : '',
												undefined !== minWidth && undefined !== minWidth[1] ? minWidth[1] : '',
												value,
											],
										});
									}}
									min={0}
									max={minWidthUnit === 'px' ? 2000 : 100}
									step={1}
									unit={minWidthUnit ? minWidthUnit : 'px'}
									onUnit={(value) => {
										setAttributes({ minWidthUnit: value });
									}}
									units={['px', '%', 'vw']}
								/>
							</KadencePanelBody>
						</>
					)}
				</InspectorControls>
				<div style={{ minHeight: type !== 'googlev3' ? '74px' : undefined }}>
					{!useKbSettings || settingsLoaded ? (
						<>
							{previewType === 'hcaptcha' && (
								<>
									{previewhCaptchaSiteKey && (
										<HCaptcha
											reCaptchaCompat={false}
											theme={previewTheme}
											size={previewSize}
											sitekey={previewhCaptchaSiteKey}
											onVerify={(token, ekey) => {
												return null;
											}}
										/>
									)}
									{!previewhCaptchaSiteKey && (
										<div
											className={
												'preview-captcha  preview-captcha-' +
												previewSize +
												' preview-captcha-' +
												previewTheme
											}
										>
											{__('Please Add API Key', 'kadence-blocks')}
										</div>
									)}
								</>
							)}

							{previewType === 'googlev2' && (
								<>
									{previewRecaptchaSiteKey && googleV2RerenderKey && (
										<ReCAPTCHA
											key={googleV2RerenderKey}
											sitekey={previewRecaptchaSiteKey}
											theme={previewTheme}
											hl={previewRecaptchaLanguage}
											size={previewSize}
											onChange={() => {
												return null;
											}}
										/>
									)}
									{(!previewRecaptchaSiteKey || !googleV2RerenderKey) && (
										<div
											className={
												'preview-captcha  preview-captcha-' +
												previewSize +
												' preview-captcha-' +
												previewTheme
											}
										>
											{__('Please Add API Keys', 'kadence-blocks')}
										</div>
									)}
								</>
							)}

							{previewType === 'googlev3' && (
								<>
									{previewHide === false && <em>{__('Google V3 reCAPTCHA', 'kadence-blocks')}</em>}
									{previewHide && !previewShowNotice && (
										<em>{__('Placeholder for hidden Google V3 reCaptcha', 'kadence-blocks')}</em>
									)}
									{previewHide && previewShowNotice && (
										<span
											style={{
												fontSize: '11px',
												color: '#555',
												lineHeight: '1.2',
												display: 'block',
												marginBottom: '16px',
												// maxWidth: '400px',
												padding: '10px',
												background: '#f2f2f2',
											}}
											className={'kt-recaptcha-branding-string'}
										>
											{googlev3HiddenNotice}
										</span>
									)}
								</>
							)}

							{previewType === 'turnstile' && (
								<>
									{previewTurnstileSiteKey && (
										<Turnstile
											theme={previewTheme}
											size={previewSize}
											sitekey={previewTurnstileSiteKey}
											onVerify={(token) => {
												return null;
											}}
										/>
									)}
									{!previewTurnstileSiteKey && (
										<div
											className={
												'preview-captcha  preview-captcha-' +
												previewSize +
												' preview-captcha-' +
												previewTheme
											}
										>
											{__('Please Add API Key', 'kadence-blocks')}
										</div>
									)}
								</>
							)}
						</>
					) : (
						<div
							className={
								'preview-captcha  preview-captcha-' + previewSize + ' preview-captcha-' + previewTheme
							}
						>
							{__(' Loading Captcha Settings', 'kadence-blocks')}
							<Spinner />
						</div>
					)}
				</div>
				<FieldBlockAppender inline={true} className="kb-custom-inbetween-inserter" getRoot={clientId} />
			</div>
		</>
	);
}

export default FieldCaptcha;
