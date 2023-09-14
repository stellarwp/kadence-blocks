/**
 * Props to Instant Image & StockPak for the inspiration for this code. 
 */
import './image-picker.scss';
import { createRoot, render } from "@wordpress/element";
import ImagePicker from "./components/ImagePicker";

import buildURL from "./functions/buildURL";
import getProvider from "./functions/getProvider";
import getQueryOptions from "./functions/getQueryOptions";
import { deleteSession, getSession, saveSession } from "./functions/session";
import { __ } from '@wordpress/i18n';

// Global vars
window.kadenceImagePickerId = "";
window.kadenceImagePickerFrame = "";
const kadenceImagePickerInit = () => {
	// Load MediaFrame deps
	const initialMediaFrame = wp.media.view.MediaFrame.Post;
	const initialMediaFrameSelect = wp.media.view.MediaFrame.Select;

	// Create Image Picker Tab
	wp.media.view.MediaFrame.Post = initialMediaFrame.extend({
		// Tab / Router
		browseRouter(routerView) {
			initialMediaFrameSelect.prototype.browseRouter.apply(this, arguments);
			routerView.set({
				kadenceimagepicker: {
					text: 'Pexels',
					priority: 120,
				},
			});
		},

		// Handlers
		bindHandlers() {
			initialMediaFrame.prototype.bindHandlers.apply(this, arguments);
			this.on("content:create:kadenceimagepicker", this.frameContent, this);
		},

		/**
		 * Render callback for the content region in the `browse` mode.
		 */
		frameContent() {
			const state = this.state();
			// Get active frame
			if (state) {
				window.kadenceImagePickerId = state.id;
				window.kadenceImagePickerFrame = state.frame;
			}
		},

		getFrame(id) {
			return this.states.findWhere({ id });
		},
	});
	// Create Image Picker Tab
	wp.media.view.MediaFrame.Select = initialMediaFrameSelect.extend({
		// Tab / Router
		browseRouter(routerView) {
			initialMediaFrameSelect.prototype.browseRouter.apply(this, arguments);
			routerView.set({
				kadenceimagepicker: {
					text: __( 'Pexels' ), // eslint-disable-line no-undef
					priority: 120,
				},
			});
		},

		// Handlers
		bindHandlers() {
			initialMediaFrameSelect.prototype.bindHandlers.apply(this, arguments);
			this.on("content:create:kadenceimagepicker", this.frameContent, this);
		},

		/**
		 * Render callback for the content region in the `browse` mode.
		 */
		frameContent() {
			const state = this.state();
			// Get active frame
			if (state) {
				window.kadenceImagePickerId = state.id;
				window.kadenceImagePickerFrame = state.frame;
			}
		},

		/**
		 * Get the current frame.
		 *
		 * @param {string} id The ID.
		 */
		getFrame(id) {
			return this.states.findWhere({ id });
		},
	});
}

// Render Image Picker
const imagePickerMediaTab = () => {
	if (!window.kadenceImagePickerFrame?.el) {
		return false; // Exit if not a frame.
	}

	const modal = window.kadenceImagePickerFrame.el.querySelector(".media-frame-content"); // Get all media modals
	if (!modal) {
		return false; // Exit if not modal.
	}

	modal.innerHTML = ""; // Clear any existing modals.

	const html = createWrapperHTML(); // Create HTML wrapper
	modal.appendChild(html); // Append Image Picker to modal.

	const element = modal.querySelector(
		"#kadence-blocks-image-picker-router-" + window.kadenceImagePickerId
	);
	if (!element) {
		return false; // Exit if not element.
	}

	getMediaModalProvider(element);
};

/**
 * Get the provider before initializing Image Picker.
 *
 * @param {Element} element The ImagePicker HTML element to initialize.
 */
const getMediaModalProvider = async (element) => {
	// Get provider and options from settings.
	const provider = getProvider();

	// Build URL.
	const options = getQueryOptions(provider);
	const url = buildURL("search");

	// Get session storage.
	//const sessionData = getSession(url);
	const sessionData = false;

	if (sessionData) {
		// Display results from session.
		renderApp(element, provider, sessionData, null);
	} else {
		// Dispatch API fetch request.
		const response = await fetch(url, options);
		const { status, headers } = response;
		//checkRateLimit(headers);

		try {
			const results = await response.json();
			const { error = null } = results;
			renderApp(element, provider, results, error);
			saveSession(url, results);
		} catch (error) {
			deleteSession(url);
		}
	}
};

/**
 * Render the main Image Picker App component.
 *
 * @param {Element}     element  The Image Picker HTML element to initialize.
 * @param {string}      provider The verified provider.
 * @param {Array}       results  The API results.
 * @param {object|null} error    The API error object.
 */
const renderApp = (element, provider, results, error) => {
	if (createRoot) {
		const root = createRoot(element);
		root.render(
			<ImagePicker
				editor="media-modal"
				data={results}
				container={element}
				api_error={error}
				provider={provider}
			/>
		);
	} else {
		render(
			<ImagePicker
				editor="media-modal"
				data={results}
				container={element}
				api_error={error}
				provider={provider}
			/>,
			element
		);
	}
};

/**
 * Create HTML markup to wrap Image Picker.
 *
 * @return {Element} Create the HTML markup for the media modal.
 */
const createWrapperHTML = () => {
	const wrapper = document.createElement("div");
	wrapper.classList.add("kadence-blocks-image-picker");

	const container = document.createElement("div");
	container.classList.add("kadence-blocks-image-picker-wrapper");

	const frame = document.createElement("div");
	frame.classList.add("kadence-blocks-image-picker-router");
	frame.setAttribute("id", "kadence-blocks-image-picker-router-" + window.kadenceImagePickerId);

	container.appendChild(frame);
	wrapper.appendChild(container);

	return wrapper;
};

// Document Ready
jQuery(document).ready(function ($) {
	kadenceImagePickerInit();
	if (wp.media) {
		// Open
		wp.media.view.Modal.prototype.on("open", function () {
			if (!window.kadenceImagePickerFrame?.el) {
				return false;
			}
			const selectedTab = window.kadenceImagePickerFrame.el.querySelector(
				".media-router button.media-menu-item.active"
			);
			if (selectedTab && selectedTab.id === "menu-item-kadenceimagepicker") {
				imagePickerMediaTab();
			}
		});

		// Click Handler
		$(document).on(
			"click",
			".media-router button.media-menu-item",
			function () {
				if (!window.kadenceImagePickerFrame?.el) {
					return false;
				}
				const selectedTab = window.kadenceImagePickerFrame.el.querySelector(
					".media-router button.media-menu-item.active"
				);
				if (selectedTab && selectedTab.id === "menu-item-kadenceimagepicker") {
					imagePickerMediaTab();
				}
			}
		);
		// Click Handler
		$(document).on(
			"click",
			".media-frame-menu .media-menu button.media-menu-item",
			function () {
				if (!window.kadenceImagePickerFrame?.el) {
					return false;
				}
				const selectedTab = window.kadenceImagePickerFrame.el.querySelector(
					".media-router button.media-menu-item.active"
				);
				if (selectedTab && selectedTab.id === "menu-item-kadenceimagepicker") {
					imagePickerMediaTab();
				}
			}
		);
	}
});
