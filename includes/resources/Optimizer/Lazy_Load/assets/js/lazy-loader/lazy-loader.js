/**
 * Use the IntersectionObserver to replace our lazy load attributes with the originals
 * when the element comes into the viewport.
 *
 * @param {IntersectionObserverInit} options The IntersectionObserver options.
 */
export const createLazyLoader = (options = { rootMargin: '300px 0px' }) => {
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((e) => {
			if (e.isIntersecting) {
				observer.unobserve(e.target);

				// Get the attributes to replace: data-kadence-lazy-attrs.
				const lazyAttributes = e.target.dataset.kadenceLazyAttrs;

				// Merge or copy the attribute values back to their original attributes.
				if (lazyAttributes) {
					lazyAttributes.split(',').forEach((attributeName) => {
						const lazyValue = e.target.getAttribute(`data-kadence-lazy-${attributeName}`);

						if (lazyValue) {
							const existingValue = e.target.getAttribute(attributeName);

							if (attributeName === 'class') {
								// Merge class names.
								e.target.classList.add(...lazyValue.trim().split(/\s+/));
							} else {
								// Merge or set values if the attribute already exists.
								const mergedValue = existingValue
									? `${existingValue.trim()} ${lazyValue}`.trim()
									: lazyValue;

								e.target.setAttribute(attributeName, mergedValue);
							}
						}
					});

					// Clean up the lazy data attributes.
					[...e.target.attributes]
						.filter((attr) => attr.name.startsWith('data-kadence-lazy'))
						.forEach((attr) => e.target.removeAttribute(attr.name));

					// Fire an event so other JS scripts can hook into this and re-run their initialization.
					window.dispatchEvent(
						new CustomEvent('kadence-lazy-loaded', {
							detail: { element: e.target },
						})
					);
				}
			}
		});
	}, options);

	const observeElements = (selector = "[data-kadence-lazy-trigger='viewport']") => {
		const elements = document.querySelectorAll(selector);
		elements.forEach((e) => observer.observe(e));
	};

	return { observeElements };
};
