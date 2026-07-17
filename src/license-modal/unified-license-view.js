/**
 * Unified (Harbor) license activation flow.
 *
 * Validation and Pro install/activate are still simulated until the real
 * unified-license endpoints are wired up.
 */
import { createInterpolateElement, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button, TextControl } from '@wordpress/components';

const STEPS = {
	INPUT: 'input',
	LOADING: 'loading',
	SUCCESS: 'success',
	INSTALLING: 'installing',
	DONE: 'done',
};

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

	const handleActivate = () => {
		const key = licenseKey.trim();
		if (!key) {
			setError(__('Please enter your unified license key.', 'kadence-blocks'));
			return;
		}

		setError('');
		setStep(STEPS.LOADING);

		// Simulated API call — no unified-license REST/AJAX endpoint exists yet.
		window.setTimeout(() => {
			setStep(STEPS.SUCCESS);
		}, 1500);
	};

	const handleDownloadActivate = () => {
		setStep(STEPS.INSTALLING);
		setInstallStatus(__('Downloading Kadence Blocks Pro…', 'kadence-blocks'));

		// Simulated download → install → activate sequence.
		window.setTimeout(() => {
			setInstallStatus(__('Installing Kadence Blocks Pro…', 'kadence-blocks'));
			window.setTimeout(() => {
				setInstallStatus(__('Activating Kadence Blocks Pro…', 'kadence-blocks'));
				window.setTimeout(() => {
					setStep(STEPS.DONE);
				}, 1000);
			}, 1200);
		}, 1200);
	};

	return (
		<div className="kt-license-view kt-license-view-unified">
			{step === STEPS.INPUT && (
				<div className="kt-unified-step kt-unified-step-input">
					<p className="kt-license-intro">
						{__(
							'Enter the unified license key from your Liquid Web account (starts with "LWSW").',
							'kadence-blocks'
						)}{' '}
						{licensePageUrl &&
							createInterpolateElement(
								__('Get your license key <a>here</a>.', 'kadence-blocks'),
								{
									// eslint-disable-next-line jsx-a11y/anchor-has-content
									a: <a href={licensePageUrl} target="_blank" rel="noopener noreferrer" />,
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
						<Button
							className="kt-unified-activate-button"
							variant="primary"
							onClick={handleActivate}
						>
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
					<Button
						className="kt-unified-download-button"
						variant="primary"
						onClick={handleDownloadActivate}
					>
						<span className="dashicons dashicons-download" aria-hidden="true" />
						{__('Install and Activate Kadence Blocks Pro', 'kadence-blocks')}
					</Button>
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
						{__('Kadence Blocks Pro is installed and active!', 'kadence-blocks')}
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

			{(step === STEPS.INPUT || step === STEPS.SUCCESS) && (
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
