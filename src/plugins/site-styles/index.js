/**
 * The Kadence panel for site-level block styles, in the Site Editor in the
 * Kadence theme's FSE mode.
 */
import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';
import { isFseMode } from '../../site-styles/supported-blocks';
import { registerSiteStylesStore } from './store';
import SiteStylesModal from './modal';
import { watchStylesScreens } from './launch-item';
import './editor.scss';

/**
 * Mounts the modal host in its own React root, so it works in the Site
 * Editor's browse mode, where plugin sidebars aren't rendered.
 */
function mountModal() {
	const container = document.createElement('div');
	container.className = 'kb-site-styles-modal-root';
	document.body.appendChild(container);
	createRoot(container).render(<SiteStylesModal />);
}

if (isFseMode() && 'site-editor' === window.pagenow) {
	registerSiteStylesStore();
	domReady(() => {
		mountModal();
		watchStylesScreens();
	});
}
