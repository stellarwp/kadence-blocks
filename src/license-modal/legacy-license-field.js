/**
 * Mounts the PHP-rendered Uplink license field into the React modal.
 *
 * Uplink's License_Field stays as PHP markup so we reuse the existing
 * save/validate flow without reimplementing it. The Harbor notice is rendered
 * in React (see license-modal.js) because Render_Harbor_License_Notice is no
 * longer hooked on the PHP license field.
 */
import { useEffect, useRef } from '@wordpress/element';

export default function LegacyLicenseField() {
	const containerRef = useRef(null);

	useEffect(() => {
		const source = document.getElementById('kt-legacy-license-field');
		const container = containerRef.current;

		if (!source || !container) {
			return undefined;
		}

		while (source.firstChild) {
			container.appendChild(source.firstChild);
		}

		return () => {
			while (container.firstChild) {
				source.appendChild(container.firstChild);
			}
		};
	}, []);

	return <div ref={containerRef} className="kt-legacy-license-field-mount" />;
}
