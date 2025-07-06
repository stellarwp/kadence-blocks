/**
 * Use the IntersectionObserver to replace our lazy load attributes with the originals
 * when the element comes into the viewport.
 *
 * @param {{rootMargin: string}} options The lazy loader options.
 */
export const createLazyLoader = (options = { rootMargin: '300px' }) => {
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

							// Merge or set values if the attribute already exists.
							const mergedValue = existingValue ? `${existingValue} ${lazyValue}` : lazyValue;

							e.target.setAttribute(attributeName, mergedValue);
						}
					});
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
