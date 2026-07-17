/**
 * License key entry modal for the Kadence Blocks settings sidebar.
 */
import { createRoot } from '@wordpress/element';
import LicenseModalApp from './license-modal';
import './editor.scss';

wp.domReady(() => {
	const container = document.getElementById('kt-license-modal-root');
	if (!container) {
		return;
	}

	const root = createRoot(container);
	root.render(<LicenseModalApp />);
});
