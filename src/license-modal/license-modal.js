/**
 * License key modal app — open button + Modal for unified / legacy license entry.
 */
import { createInterpolateElement, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { Modal } from '@wordpress/components';
import UnifiedLicenseView from './unified-license-view';
import LegacyLicenseField from './legacy-license-field';

const VIEWS = {
	UNIFIED: 'unified',
	LEGACY: 'legacy',
};

const params = window.kadenceLicenseModalParams || {};

/**
 * Harbor notice previously rendered by Render_Harbor_License_Notice on the
 * PHP Uplink license field. That hook is commented out in Harbor_Provider;
 * the notice now lives here on the legacy React view.
 *
 * @param {Object} props
 * @param {string} props.licensePageUrl Harbor / Liquid Web Software Manager URL.
 */
function HarborLicenseNotice({ licensePageUrl }) {
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
						/* translators: %s: product name (e.g. Kadence Blocks). */
						__(
							'%1$s is now part of Liquid Web\'s software offerings. This field is still available for managing legacy licenses from your previous %1$s account. If you purchased a new plan through Liquid Web, enter your Kadence license key from <a>here</a>.',
							'kadence-blocks'
						),
						productName
					),
					{
						// eslint-disable-next-line jsx-a11y/anchor-has-content
						a: licensePageUrl ? (
							<a href={licensePageUrl} target="_blank" rel="noopener noreferrer" />
						) : (
							<span />
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

	const openModal = () => {
		setView(VIEWS.UNIFIED);
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
			<button type="button" className="sidebar-btn-link" onClick={openModal}>
				{__('Enter License Key', 'kadence-blocks')}
			</button>
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
							<HarborLicenseNotice licensePageUrl={params.licensePageUrl || ''} />
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
