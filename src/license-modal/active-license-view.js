/**
 * Active license status card (unified Harbor or Kadence Uplink).
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const FEATURES = [
	__('Updates enabled', 'kadence-blocks'),
	__('Premium blocks unlocked', 'kadence-blocks'),
	__('Support included', 'kadence-blocks'),
];

/**
 * @param {Object}   props
 * @param {'unified'|'kadence'} props.type License type.
 * @param {string}   props.maskedKey Masked unified key (unified only).
 * @param {string}   props.fullKey Full unified key for copy (unified only).
 * @param {string}   props.expires Formatted expiration label (unified only).
 * @param {string}   props.manageUrl Software Manager URL (unified only).
 * @param {Function} props.onManageKadence Open modal to manage Kadence key.
 */
export default function ActiveLicenseView({
	type,
	maskedKey,
	fullKey,
	expires,
	manageUrl,
	onManageKadence,
}) {
	const [copied, setCopied] = useState(false);
	const isUnified = type === 'unified';

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

			{isUnified ? (
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
			) : (
				<p className="kt-license-active-subtitle">{__('Updates & Support Active', 'kadence-blocks')}</p>
			)}

			<ul className="kt-license-active-features">
				{FEATURES.map((feature) => (
					<li key={feature}>
						<span className="dashicons dashicons-yes-alt" aria-hidden="true" />
						{feature}
					</li>
				))}
			</ul>

			{isUnified && manageUrl ? (
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
