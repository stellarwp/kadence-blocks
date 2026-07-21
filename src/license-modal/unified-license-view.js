/**
 * Unified (Harbor) license activation flow.
 *
 * Saves the key and installs Pro via Harbor REST helpers in `src/harbor`.
 */
import { createInterpolateElement, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { Button, TextControl } from '@wordpress/components';
import { installAndActivateFeature, storeLicense, UNIFIED_KEY_PREFIX } from '../harbor';
import { getGlobalParam } from '../harbor/helper';

const STEPS = {
	INPUT: 'input',
	LOADING: 'loading',
	SUCCESS: 'success',
	INSTALLING: 'installing',
	DONE: 'done',
};

const params = getGlobalParam();
const PRO_FEATURE_SLUG = params.proFeatureSlug || 'kadence-blocks-pro';
const PRO_FEATURE_NAME = params.proFeatureName || __('Kadence Blocks Pro', 'kadence-blocks');

/**
 * @param {Object}   props
 * @param {string}   props.licensePageUrl Harbor license page URL, if available.
 * @param {Function} props.onSwitchToLegacy Switch to the legacy Kadence key view.
 */
export default function UnifiedLicenseView({ licensePageUrl, onSwitchToLegacy }) {
	const [step, setStep] = useState(STEPS.INPUT);
	const [licenseKey, setLicenseKey] = useState('');
	const [error, setError] = useState('');
	const [installStatus, setInstallStatus] = useState('');

	const handleActivate = async () => {
		const key = licenseKey.trim().toUpperCase();
		if (!key) {
			setError(__('Please enter your unified license key.', 'kadence-blocks'));
			return;
		}

		if (!key.startsWith(UNIFIED_KEY_PREFIX)) {
			setError(
				__('Unified license keys start with "LWSW-". Please check your key and try again.', 'kadence-blocks')
			);
			return;
		}

		setError('');
		setLicenseKey(key);
		setStep(STEPS.LOADING);

		try {
			await storeLicense(key);
			setStep(STEPS.SUCCESS);
		} catch (err) {
			setError(
				err?.message || __('Liquid Web Software Manager failed to validate your license.', 'kadence-blocks')
			);
			setStep(STEPS.INPUT);
		}
	};

	const handleDownloadActivate = async () => {
		setError('');
		setStep(STEPS.INSTALLING);
		setInstallStatus(
			sprintf(
				/* translators: %s: plugin name */
				__('Preparing to install %s…', 'kadence-blocks'),
				PRO_FEATURE_NAME
			)
		);

		try {
			await installAndActivateFeature(PRO_FEATURE_SLUG, {
				onStatus: (status) => {
					if (status === 'installing') {
						setInstallStatus(
							sprintf(
								/* translators: %s: plugin name */
								__('Downloading and installing %s…', 'kadence-blocks'),
								PRO_FEATURE_NAME
							)
						);
					} else if (status === 'activating') {
						setInstallStatus(
							sprintf(
								/* translators: %s: plugin name */
								__('Activating %s…', 'kadence-blocks'),
								PRO_FEATURE_NAME
							)
						);
					} else if (status === 'already_active') {
						setInstallStatus(
							sprintf(
								/* translators: %s: plugin name */
								__('%s is already active.', 'kadence-blocks'),
								PRO_FEATURE_NAME
							)
						);
					}
				},
			});
			setStep(STEPS.DONE);
		} catch (err) {
			setError(
				err?.message ||
					sprintf(
						/* translators: %s: plugin name */
						__('Failed to install or activate %s.', 'kadence-blocks'),
						PRO_FEATURE_NAME
					)
			);
			setStep(STEPS.SUCCESS);
		}
	};

	return (
		<div className="kt-license-view kt-license-view-unified">
			{step === STEPS.INPUT && (
				<div className="kt-unified-step kt-unified-step-input">
					<p className="kt-license-intro">
						{createInterpolateElement(
							__(
								'Enter your Liquid Web Unified License Key. It starts with <i>LWSW-</i> and can be found in your <a>Liquid Web account</a>.',
								'kadence-blocks'
							),
							{
								i: <i />,
								a: (
									// eslint-disable-next-line jsx-a11y/anchor-has-content
									<a href={params.harbor.accountUrl} target="_blank" rel="noopener noreferrer" />
								),
							}
						)}
					</p>
					<div className="kt-unified-input-row">
						<TextControl
							className="kt-unified-license-key"
							value={licenseKey}
							onChange={setLicenseKey}
							placeholder="LWSW-XXXXXXXX-XXXXXXXX-XXXXXXXX"
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
						<Button className="kt-unified-activate-button" variant="primary" onClick={handleActivate}>
							{__('Activate', 'kadence-blocks')}
						</Button>
					</div>
					{error && <p className="kt-unified-error">{error}</p>}
				</div>
			)}

			{step === STEPS.LOADING && (
				<div className="kt-unified-step kt-unified-step-loading">
					<span className="kt-spinner" aria-hidden="true" />
					<span className="kt-unified-status-text">
						{__('Validating your license key…', 'kadence-blocks')}
					</span>
				</div>
			)}

			{step === STEPS.SUCCESS && (
				<div className="kt-unified-step kt-unified-step-success">
					<p className="kt-unified-success-message">
						<span className="dashicons dashicons-yes-alt" aria-hidden="true" />
						{__('License activated! Your unified license is now connected.', 'kadence-blocks')}
					</p>
					<Button className="kt-unified-download-button" variant="primary" onClick={handleDownloadActivate}>
						<span className="dashicons dashicons-download" aria-hidden="true" />
						{sprintf(
							/* translators: %s: plugin name */
							__('Install and Activate %s', 'kadence-blocks'),
							PRO_FEATURE_NAME
						)}
					</Button>
					{error && <p className="kt-unified-error">{error}</p>}
				</div>
			)}

			{step === STEPS.INSTALLING && (
				<div className="kt-unified-step kt-unified-step-installing">
					<span className="kt-spinner" aria-hidden="true" />
					<span className="kt-unified-install-status-text">{installStatus}</span>
				</div>
			)}

			{step === STEPS.DONE && (
				<div className="kt-unified-step kt-unified-step-done">
					<p className="kt-unified-success-message">
						<span className="dashicons dashicons-yes-alt" aria-hidden="true" />
						{sprintf(
							/* translators: %s: plugin name */
							__('%s is installed and active!', 'kadence-blocks'),
							PRO_FEATURE_NAME
						)}
					</p>
					<p className="description">
						<button
							type="button"
							className="kt-unified-reload-link"
							onClick={() => window.location.reload()}
						>
							{__('Reload the page to start using it.', 'kadence-blocks')}
						</button>
					</p>
				</div>
			)}

			{step === STEPS.INPUT && (
				<p className="kt-license-toggle">
					{__('Purchased your license before April 2026?', 'kadence-blocks')}
					<br />
					<button type="button" className="kt-license-toggle-link" onClick={onSwitchToLegacy}>
						{__('Click here to enter the individual Kadence key.', 'kadence-blocks')}
					</button>
				</p>
			)}
		</div>
	);
}
