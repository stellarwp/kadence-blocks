/**
 * License key modal app — open button + Modal for unified / legacy license entry,
 * or the Active status card when a license is already authorized.
 */
import { createInterpolateElement, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { Modal } from '@wordpress/components';
import UnifiedLicenseView from './unified-license-view';
import LegacyLicenseField from './legacy-license-field';
import ActiveLicenseView from './active-license-view';

const VIEWS = {
	UNIFIED: 'unified',
	LEGACY: 'legacy',
};

const params = window.kadenceLicenseModalParams || {};
const licenseStatus = params.licenseStatus || {};

/**
 * Harbor notice previously rendered by Render_Harbor_License_Notice on the
 * PHP Uplink license field. That hook is commented out in Harbor_Provider;
 * the notice now lives here on the legacy React view.
 *
 * @param {Object}   props
 * @param {Function} props.onSwitchToUnified Switch to the unified license view.
 */
function HarborLicenseNotice({ onSwitchToUnified }) {
	const productName = __('Kadence Blocks', 'kadence-blocks');

	return (
		<div className="kt-harbor-notice-box">
			<h4>
				<span className="dashicons dashicons-info" aria-hidden="true" />
				{__('Liquid Web Software Manager', 'kadence-blocks')}
			</h4>
			<p>
				{createInterpolateElement(
					sprintf(
						/* translators: %1$s: product name (e.g. Kadence Blocks). */
						__(
							"%1$s is now part of Liquid Web's software offerings. This field is still available for managing legacy licenses from your previous Kadence account. If you purchased a new plan through Liquid Web, enter your Kadence license key from <a>here</a>.",
							'kadence-blocks'
						),
						productName
					),
					{
						a: (
							// eslint-disable-next-line jsx-a11y/anchor-has-content
							<a
								href="#unified-license"
								onClick={(event) => {
									event.preventDefault();
									onSwitchToUnified();
								}}
							/>
						),
					}
				)}
			</p>
		</div>
	);
}

export default function LicenseModalApp() {
	const [isOpen, setIsOpen] = useState(false);
	const [view, setView] = useState(VIEWS.UNIFIED);
	const [legacyKey, setLegacyKey] = useState(0);

	const licenseType = licenseStatus.type || 'none';
	const isActive = licenseType === 'unified' || licenseType === 'kadence';

	const openModal = (initialView = VIEWS.UNIFIED) => {
		setView(initialView);
		setLegacyKey((key) => key + 1);
		setIsOpen(true);
	};

	const closeModal = () => {
		setIsOpen(false);
	};

	const title =
		view === VIEWS.LEGACY
			? __('Enter Kadence License Key', 'kadence-blocks')
			: __('Enter Unified Liquid Web License Key', 'kadence-blocks');

	return (
		<>
			{isActive ? (
				<ActiveLicenseView
					type={licenseType}
					maskedKey={licenseStatus.maskedKey || ''}
					fullKey={licenseStatus.fullKey || ''}
					expires={licenseStatus.expires || ''}
					manageUrl={licenseStatus.manageUrl || ''}
					isProInstalled={Boolean(params.isProInstalled)}
					isProActive={Boolean(params.isProActive)}
					onManageKadence={() => openModal(VIEWS.LEGACY)}
				/>
			) : (
				<>
					<h2>{__('License', 'kadence-blocks')}</h2>
					<p>
						{__('Enter your license key to unlock updates, premium blocks, and support.', 'kadence-blocks')}
					</p>
					<button type="button" className="sidebar-btn-link" onClick={() => openModal(VIEWS.UNIFIED)}>
						{__('Enter License Key', 'kadence-blocks')}
					</button>
				</>
			)}
			{isOpen && (
				<Modal className="kt-license-modal" title={title} onRequestClose={closeModal}>
					{view === VIEWS.UNIFIED ? (
						<UnifiedLicenseView
							key={`unified-${legacyKey}`}
							licensePageUrl={params.licensePageUrl || ''}
							onSwitchToLegacy={() => setView(VIEWS.LEGACY)}
						/>
					) : (
						<div className="kt-license-view kt-license-view-legacy">
							<p className="kt-license-intro">
								{__(
									'If you purchased Kadence Blocks Pro before April 2026, enter your legacy Kadence license key here.',
									'kadence-blocks'
								)}
							</p>
							<LegacyLicenseField key={`legacy-${legacyKey}`} />
							<HarborLicenseNotice onSwitchToUnified={() => setView(VIEWS.UNIFIED)} />
							<p className="kt-license-toggle kt-license-toggle-back">
								<button
									type="button"
									className="kt-license-toggle-link"
									onClick={() => setView(VIEWS.UNIFIED)}
								>
									&larr; {__('Back to unified license key', 'kadence-blocks')}
								</button>
							</p>
						</div>
					)}
				</Modal>
			)}
		</>
	);
}
