/**
 * Active license status card (unified Harbor or Kadence Uplink).
 */
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { installAndActivateFeature } from '../harbor';

const FEATURES = [
	__('Updates enabled', 'kadence-blocks'),
	__('Premium blocks unlocked', 'kadence-blocks'),
	__('Support included', 'kadence-blocks'),
];

const params = window.kadenceLicenseModalParams || {};
const PRO_FEATURE_SLUG = params.proFeatureSlug || 'kadence-blocks-pro';
const PRO_FEATURE_NAME = params.proFeatureName || __('Kadence Blocks Pro', 'kadence-blocks');

/**
 * @param {Object}   props
 * @param {'unified'|'kadence'} props.type License type.
 * @param {string}   props.maskedKey Masked unified key (unified only).
 * @param {string}   props.fullKey Full unified key for copy (unified only).
 * @param {string}   props.expires Formatted expiration label (unified only).
 * @param {string}   props.manageUrl Software Manager URL (unified only).
 * @param {boolean}  props.isProInstalled Whether Kadence Blocks Pro is on disk.
 * @param {boolean}  props.isProActive Whether Kadence Blocks Pro is active.
 * @param {Function} props.onManageKadence Open modal to manage Kadence key.
 */
export default function ActiveLicenseView({
	type,
	maskedKey,
	fullKey,
	expires,
	manageUrl,
	isProInstalled = false,
	isProActive = false,
	onManageKadence,
}) {
	const [copied, setCopied] = useState(false);
	const [isInstalling, setIsInstalling] = useState(false);
	const [installStatus, setInstallStatus] = useState('');
	const [installError, setInstallError] = useState('');
	const isUnified = type === 'unified';
	const showInstallPro = isUnified && !isProInstalled;
	const showActivatePro = isUnified && isProInstalled && !isProActive;
	const showProAction = showInstallPro || showActivatePro;

	const copyKey = async () => {
		if (!fullKey || !navigator.clipboard) {
			return;
		}
		try {
			await navigator.clipboard.writeText(fullKey);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch (e) {
			// Clipboard may be unavailable in some admin contexts.
		}
	};

	const handleProAction = async () => {
		setInstallError('');
		setIsInstalling(true);
		setInstallStatus(
			showActivatePro
				? sprintf(
					/* translators: %s: plugin name */
					__('Activating %s…', 'kadence-blocks'),
					PRO_FEATURE_NAME
				)
				: sprintf(
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
			window.location.reload();
		} catch (err) {
			setInstallError(
				err?.message ||
				sprintf(
					/* translators: %s: plugin name */
					__('Failed to install or activate %s.', 'kadence-blocks'),
					PRO_FEATURE_NAME
				)
			);
			setIsInstalling(false);
			setInstallStatus('');
		}
	};

	return (
		<div className="kt-license-active">
			<h2>
				{__('License & Updates', 'kadence-blocks')}
				<span className="kt-license-active-shield dashicons dashicons-shield-alt" aria-hidden="true" />
			</h2>

			<span className="kt-license-active-badge">{__('Active', 'kadence-blocks')}</span>

			<p className="kt-license-active-type">
				{isUnified
					? __('Unified Liquid Web License', 'kadence-blocks')
					: __('Kadence License', 'kadence-blocks')}
			</p>

			{isUnified && (
				<div className="kt-license-active-meta">
					{maskedKey && (
						<div className="kt-license-active-key-row">
							<code className="kt-license-active-key">{maskedKey}</code>
							<button
								type="button"
								className="kt-license-active-copy"
								onClick={copyKey}
								aria-label={__('Copy license key', 'kadence-blocks')}
								title={copied ? __('Copied!', 'kadence-blocks') : __('Copy', 'kadence-blocks')}
							>
								<span
									className={`dashicons ${copied ? 'dashicons-yes' : 'dashicons-admin-page'}`}
									aria-hidden="true"
								/>
							</button>
						</div>
					)}
					{expires && <p className="kt-license-active-expires">{expires}</p>}
				</div>
			)}

			<ul className="kt-license-active-features">
				{FEATURES.map((feature) => (
					<li key={feature}>
						<span className="dashicons dashicons-yes-alt" aria-hidden="true" />
						{feature}
					</li>
				))}
			</ul>

			{showProAction ? (
				<>
					{isInstalling ? (
						<p className="kt-license-active-install-status">
							<span className="kt-spinner" aria-hidden="true" />
							{installStatus}
						</p>
					) : (
						<button
							type="button"
							className="sidebar-btn-link kt-license-manage-btn"
							onClick={handleProAction}
						>
							<span
								className={showActivatePro ? '' : 'dashicons dashicons-download'}
								aria-hidden="true"
							/>
							{showActivatePro
								? sprintf(
									/* translators: %s: plugin name */
									__('Activate %s', 'kadence-blocks'),
									PRO_FEATURE_NAME
								)
								: sprintf(
									/* translators: %s: plugin name */
									__('Install and Activate %s', 'kadence-blocks'),
									PRO_FEATURE_NAME
								)}
						</button>
					)}
					{installError && <p className="kt-unified-error">{installError}</p>}
				</>
			) : isUnified && manageUrl ? (
				<a className="sidebar-btn-link kt-license-manage-btn" href={manageUrl}>
					<span className="dashicons dashicons-admin-generic" aria-hidden="true" />
					{__('Manage License', 'kadence-blocks')}
				</a>
			) : (
				<button type="button" className="sidebar-btn-link kt-license-manage-btn" onClick={onManageKadence}>
					<span className="dashicons dashicons-admin-generic" aria-hidden="true" />
					{__('Manage License', 'kadence-blocks')}
				</button>
			)}
		</div>
	);
}
