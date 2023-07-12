import './image-picker.scss';
import { createRoot, render } from "@wordpress/element";
import InstantImages from "./components/ImagePicker";

import buildURL from "./functions/buildURL";
import getProvider from "./functions/getProvider";
import getQueryOptions from "./functions/getQueryOptions";
import { deleteSession, getSession, saveSession } from "./functions/session";

console.log('starting', kadenceExtensionImagePicker);

// Global vars
let activeFrameId = "";
let activeFrame = "";

// Load MediaFrame deps
const oldMediaFrame = wp.media.view.MediaFrame.Post;
const oldMediaFrameSelect = wp.media.view.MediaFrame.Select;

// Create Instant Images Tabs
wp.media.view.MediaFrame.Select = oldMediaFrameSelect.extend({
	// Tab / Router
	browseRouter(routerView) {
		oldMediaFrameSelect.prototype.browseRouter.apply(this, arguments);
		routerView.set({
			instantimages: {
				text: 'Kadence Images', // eslint-disable-line no-undef
				priority: 120,
			},
		});
	},

	// Handlers
	bindHandlers() {
		oldMediaFrameSelect.prototype.bindHandlers.apply(this, arguments);
		this.on("content:create:instantimages", this.frameContent, this);
	},

	/**
	 * Render callback for the content region in the `browse` mode.
	 */
	frameContent() {
		const state = this.state();
		// Get active frame
		if (state) {
			activeFrameId = state.id;
			activeFrame = state.frame.el;
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

wp.media.view.MediaFrame.Post = oldMediaFrame.extend({
	// Tab / Router
	browseRouter(routerView) {
		oldMediaFrameSelect.prototype.browseRouter.apply(this, arguments);
		routerView.set({
			instantimages: {
				text: 'Kadence Images', // eslint-disable-line no-undef
				priority: 120,
			},
		});
	},

	// Handlers
	bindHandlers() {
		oldMediaFrame.prototype.bindHandlers.apply(this, arguments);
		this.on("content:create:instantimages", this.frameContent, this);
	},

	/**
	 * Render callback for the content region in the `browse` mode.
	 */
	frameContent() {
		const state = this.state();
		// Get active frame
		if (state) {
			activeFrameId = state.id;
			activeFrame = state.frame.el;
		}
	},

	getFrame(id) {
		return this.states.findWhere({ id });
	},
});

// Render Instant Images
const instantImagesMediaTab = () => {
	if (!activeFrame) {
		return false; // Exit if not a frame.
	}

	const modal = activeFrame.querySelector(".media-frame-content"); // Get all media modals
	if (!modal) {
		return false; // Exit if not modal.
	}

	modal.innerHTML = ""; // Clear any existing modals.

	const html = createWrapperHTML(); // Create HTML wrapper
	modal.appendChild(html); // Append Instant Images to modal.

	const element = modal.querySelector(
		"#kadence-blocks-image-picker-router-" + activeFrameId
	);
	if (!element) {
		return false; // Exit if not element.
	}

	getMediaModalProvider(element);
};

/**
 * Get the provider before initializing Instant Images.
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

	console.log('rolling', url, options);

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
			console.log('success', provider, results)
			saveSession(url, results);
		} catch (error) {
			console.log('oops', provider, status);
			deleteSession(url);
		}
	}
};

/**
 * Render the main Instant Images App component.
 *
 * @param {Element}     element  The Instant Images HTML element to initialize.
 * @param {string}      provider The verified provider.
 * @param {Array}       results  The API results.
 * @param {object|null} error    The API error object.
 */
const renderApp = (element, provider, results, error) => {
	if (createRoot) {
		const root = createRoot(element);
		root.render(
			<InstantImages
				editor="media-modal"
				data={results}
				container={element}
				api_error={error}
				provider={provider}
			/>
		);
	} else {
		render(
			<InstantImages
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
 * Create HTML markup to wrap Instant Images.
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
	frame.setAttribute("id", "kadence-blocks-image-picker-router-" + activeFrameId);

	container.appendChild(frame);
	wrapper.appendChild(container);

	return wrapper;
};

// Document Ready
jQuery(document).ready(function ($) {
	console.log('kick off');
	if (wp.media) {
		// Open
		wp.media.view.Modal.prototype.on("open", function () {
			if (!activeFrame) {
				return false;
			}
			const selectedTab = activeFrame.querySelector(
				".media-router button.media-menu-item.active"
			);
			if (selectedTab && selectedTab.id === "menu-item-instantimages") {
				instantImagesMediaTab();
			}
		});

		// Click Handler
		$(document).on(
			"click",
			".media-router button.media-menu-item",
			function () {
				const selectedTab = activeFrame.querySelector(
					".media-router button.media-menu-item.active"
				);
				if (selectedTab && selectedTab.id === "menu-item-instantimages") {
					instantImagesMediaTab();
				}
			}
		);
	}
});
