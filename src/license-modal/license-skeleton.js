/**
 * License sidebar skeleton (matches PHP preload markup).
 */
import { __ } from '@wordpress/i18n';

export default function LicenseSkeleton() {
	return (
		<div
			className="kt-skeleton kt-license-skeleton"
			role="status"
			aria-label={__('Loading license…', 'kadence-blocks')}
		>
			<div className="kt-skeleton__row kt-license-skeleton__header">
				<span className="kt-skeleton__bone kt-license-skeleton__title" />
			</div>
			<span className="kt-skeleton__bone kt-license-skeleton__badge" />
			<span className="kt-skeleton__bone kt-license-skeleton__type" />
			<span className="kt-skeleton__bone kt-license-skeleton__key" />
			<span className="kt-skeleton__bone kt-license-skeleton__meta" />
			<span className="kt-skeleton__bone kt-license-skeleton__button" />
		</div>
	);
}
