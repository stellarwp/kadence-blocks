/**
 * Shows the hover state in the panel's preview. No DOM API forces `:hover`, and
 * `BlockPreview` makes its frame inert, so every `:hover` rule in the frame is
 * copied to a class that the previewed block and its elements get.
 */
import { useEffect } from '@wordpress/element';

const STYLE_ID = 'kb-site-styles-preview-hover';
const HOVER_CLASS = 'kb-site-styles-force-hover';

/**
 * @param {CSSRuleList} rules   The rules to copy from.
 * @param {string}      wrapper The enclosing at-rule prelude, empty at the top level.
 * @param {string[]}    out     The copied rules.
 */
function copyHoverRules(rules, wrapper, out) {
	for (const rule of rules) {
		if (rule.cssRules && rule.media) {
			copyHoverRules(rule.cssRules, '@media ' + rule.media.mediaText, out);
		} else if (rule.cssRules && !rule.selectorText) {
			copyHoverRules(rule.cssRules, wrapper, out);
		} else if (rule.selectorText && rule.selectorText.includes(':hover')) {
			const selectors = rule.selectorText
				.split(',')
				.filter((selector) => selector.includes(':hover'))
				.map((selector) => selector.replace(/:hover/g, '.' + HOVER_CLASS))
				.join(',');
			// Important, so the hover values win over the normal-state rules as a real hover would.
			const declarations = [...rule.style]
				.map((property) => `${property}:${rule.style.getPropertyValue(property)} !important`)
				.join(';');
			const css = `${selectors}{${declarations}}`;

			out.push(wrapper ? `${wrapper}{${css}}` : css);
		}
	}
}

/**
 * @param {Document} doc The preview frame's document.
 * @return {string[]} Every `:hover` rule in the frame, rewritten to the hover class.
 */
function hoverRules(doc) {
	const out = [];

	for (const sheet of doc.styleSheets) {
		if (sheet.ownerNode?.id === STYLE_ID) {
			continue;
		}
		try {
			copyHoverRules(sheet.cssRules, '', out);
		} catch (error) {
			// A cross-origin sheet can't be read; its hover rules aren't previewed.
		}
	}

	return out;
}

/**
 * Writes the rules to the frame's hover sheet, only when they changed:
 * replacing the sheet restarts hover transitions.
 *
 * @param {Document} doc   The preview frame's document.
 * @param {string[]} rules The rewritten hover rules.
 */
function writeHoverSheet(doc, rules) {
	let style = doc.getElementById(STYLE_ID);

	if (!style) {
		style = doc.createElement('style');
		style.id = STYLE_ID;
		doc.head.appendChild(style);
	}

	const key = `${rules.length}:${rules.join('').length}`;
	if (style.dataset.key === key) {
		return;
	}

	style.dataset.key = key;
	style.textContent = '';
	// One rule at a time: a single rule the parser rejects would void a sheet written as text.
	rules.forEach((rule) => {
		try {
			style.sheet.insertRule(rule, style.sheet.cssRules.length);
		} catch (error) {
			// Skip a rule this browser can't parse.
		}
	});
}

/**
 * Turns the forced hover state on or off in a preview document.
 *
 * @param {Document} doc      The preview frame's document.
 * @param {boolean}  on       Whether to show the hover state.
 * @param {string}   clientId The previewed block's client ID.
 */
function setPreviewHover(doc, on, clientId) {
	if (!on) {
		doc.getElementById(STYLE_ID)?.remove();
		doc.querySelectorAll('.' + HOVER_CLASS).forEach((node) => node.classList.remove(HOVER_CLASS));
		return;
	}

	writeHoverSheet(doc, hoverRules(doc));

	// The block's own elements, whichever of them its hover rules target.
	const block = doc.querySelector(`[data-block="${clientId}"]`);
	if (block) {
		[block, ...block.querySelectorAll('*')].forEach((node) => node.classList.add(HOVER_CLASS));
	}
}

/**
 * Keeps the preview frame in the chosen state. `BlockPreview` creates the frame
 * after it renders, replaces its document on load and re-renders it with every
 * change, so the container and the frame's document are watched and the state
 * is applied again, at most once per animation frame.
 *
 * @param {{current: ?HTMLElement}} containerRef The element that holds the preview frame.
 * @param {boolean}                 on           Whether to show the hover state.
 * @param {string}                  clientId     The previewed block's client ID.
 */
export function usePreviewHover(containerRef, on, clientId) {
	useEffect(() => {
		const container = containerRef.current;
		if (!container) {
			return undefined;
		}

		let frame = null;
		let watchedRoot = null;
		let scheduled = 0;

		const apply = () => {
			scheduled = 0;
			const doc = frame?.contentDocument;
			if (doc?.head && doc.body) {
				setPreviewHover(doc, on, clientId);
			}
		};
		const schedule = () => {
			scheduled = scheduled || window.requestAnimationFrame(apply);
		};
		const observer = new window.MutationObserver(() => {
			watch();
			schedule();
		});
		const onLoad = () => {
			watch();
			schedule();
		};
		const watch = () => {
			const current = container.querySelector('iframe');
			if (current && current !== frame) {
				frame?.removeEventListener('load', onLoad);
				frame = current;
				frame.addEventListener('load', onLoad);
			}

			const root = frame?.contentDocument?.documentElement;
			if (root && root !== watchedRoot) {
				watchedRoot = root;
				observer.observe(root, { childList: true, subtree: true });
			}
		};

		observer.observe(container, { childList: true, subtree: true });
		watch();
		schedule();

		return () => {
			observer.disconnect();
			frame?.removeEventListener('load', onLoad);
			window.cancelAnimationFrame(scheduled);
			if (frame?.contentDocument?.head) {
				setPreviewHover(frame.contentDocument, false, clientId);
			}
		};
	}, [containerRef, on, clientId]);
}
