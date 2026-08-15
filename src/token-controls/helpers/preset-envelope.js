/**
 * The DTCG leaf shape a responsive token value is stored in, and the only place either host reads or
 * writes it.
 *
 * A responsive-capable leaf keeps its desktop value as a plain scalar `$value` — so flat DTCG
 * consumers still work — and carries per-breakpoint overrides under its own vendor extension:
 *
 *     { $value: '0.5rem', $extensions: { 'com.kadence.designTokens': {
 *           responsive: { tablet: '0.375rem', mobile: '0.25rem' }
 *     } } }
 *
 * `responsive` and `clamp` are mutually exclusive on one leaf. Both mirror
 * `Schema\Vocabulary\Responsive` on the server, which is the authority for every key spelled here.
 */

/**
 * The vendor extension key every Kadence design-token leaf hangs its structured shapes under.
 *
 * @since TBD
 */
export const KADENCE_TOKEN_NAMESPACE = 'com.kadence.designTokens';

/**
 * The sentinel key a leaf wraps its base value in, mirroring `Sentinels::get_value_key()`.
 *
 * @since TBD
 */
export const ENVELOPE_VALUE_KEY = '$value';

/**
 * The breakpoints a responsive value can carry an override for, desktop first. Desktop is the leaf's
 * own `$value`, never an entry in the override map.
 *
 * @since TBD
 */
export const PRESET_BREAKPOINTS = ['desktop', 'tablet', 'mobile'];

/**
 * Whether a stored preset token entry is a responsive envelope: `{ $value, $extensions: {
 * "com.kadence.designTokens": { responsive: { tablet, mobile } } } }`. Only the base `$value` is
 * read here — the breakpoint overrides are an editor concern, out of scope for the Style Library's
 * single-value preview/picker surface. An object is checked rather than any array, since a slot
 * list (see `isSlotList`) is a plain array and never carries a `$value` key.
 *
 * @param {*} value The stored token entry.
 *
 * @since TBD
 *
 * @return {boolean} True when `value` is a responsive envelope.
 */
export function isPresetEnvelope(value) {
	return Boolean(value) && typeof value === 'object' && !Array.isArray(value) && ENVELOPE_VALUE_KEY in value;
}

/**
 * Read one breakpoint out of a stored preset value.
 *
 * A responsive leaf keeps its desktop value as a plain scalar `$value` so flat DTCG consumers still
 * work, and carries the per-breakpoint map under its own `$extensions`. A flat value — no envelope
 * at all — is the desktop value and has no overrides.
 *
 * @param {*}      raw        The stored preset value: scalar, slot list, or responsive envelope.
 * @param {string} breakpoint One of `PRESET_BREAKPOINTS`.
 *
 * @since TBD
 *
 * @return {*} The value at that breakpoint, or '' when there is no override for it.
 */
export function readPresetBreakpoint(raw, breakpoint) {
	if (!isPresetEnvelope(raw)) {
		return breakpoint === 'desktop' ? (raw ?? '') : '';
	}

	if (breakpoint === 'desktop') {
		return raw[ENVELOPE_VALUE_KEY] ?? '';
	}

	return raw.$extensions?.[KADENCE_TOKEN_NAMESPACE]?.responsive?.[breakpoint] ?? '';
}

/**
 * Resolve what is actually in effect at a breakpoint, stepping down the cascade until something is
 * set.
 *
 * The overrides are stepped, not independent. The projected CSS emits tablet at `max-width: 1024px`
 * and mobile at `max-width: 767px`, so a mobile viewport matches the tablet query too — a mobile with
 * no override of its own renders the *tablet* value, and only falls through to desktop when tablet is
 * unset as well. Reading the base `$value` directly would report desktop and be wrong whenever tablet
 * is set.
 *
 * This is the counterpart to `readPresetBreakpoint`, which stays deliberately raw: that answers "does
 * this breakpoint carry an override", which is what an editing surface needs, while this answers
 * "what does this breakpoint render", which is what a preview needs.
 *
 * @param {*}      raw        The stored preset value.
 * @param {string} breakpoint One of `PRESET_BREAKPOINTS`.
 *
 * @since TBD
 *
 * @return {*} The value in effect, or '' when nothing is set anywhere in the chain.
 */
export function resolvePresetBreakpoint(raw, breakpoint) {
	const index = PRESET_BREAKPOINTS.indexOf(breakpoint);
	const chain = index === -1 ? [PRESET_BREAKPOINTS[0]] : PRESET_BREAKPOINTS.slice(0, index + 1);

	// Walked widest-last so the narrowest breakpoint that is actually set wins.
	for (let step = chain.length - 1; step >= 0; step--) {
		const value = readPresetBreakpoint(raw, chain[step]);

		if (!isCleared(value)) {
			return value;
		}
	}

	return '';
}

/**
 * Whether a value carries no override at all: unset, or a slot list whose every slot is unset.
 *
 * @param {*} value The value to test.
 *
 * @since TBD
 *
 * @return {boolean} True when the value overrides nothing.
 */
function isCleared(value) {
	if (Array.isArray(value)) {
		return value.every(isCleared);
	}

	return value === '' || value === undefined || value === null;
}

/**
 * Write one breakpoint into a stored preset value.
 *
 * A desktop write on a flat value stays flat — a property only ever edited at desktop round-trips as
 * the plain scalar it was, so nothing gains an envelope it does not need. The first tablet or mobile
 * override upgrades it, and clearing the last one collapses it back.
 *
 * `responsive` and `clamp` are mutually exclusive on one leaf (`Schema\Vocabulary\Responsive`), so
 * writing a stepped override drops any existing `clamp` rather than producing a leaf the validator
 * would reject.
 *
 * @param {*}      raw        The current stored value.
 * @param {string} breakpoint One of `PRESET_BREAKPOINTS`.
 * @param {*}      value      The value to write at that breakpoint.
 *
 * @since TBD
 *
 * @return {*} The next stored value.
 */
export function writePresetBreakpoint(raw, breakpoint, value) {
	const envelope = isPresetEnvelope(raw);

	if (breakpoint === 'desktop') {
		return envelope ? { ...raw, [ENVELOPE_VALUE_KEY]: value } : value;
	}

	const base = envelope ? (raw[ENVELOPE_VALUE_KEY] ?? '') : (raw ?? '');
	const vendor = envelope ? (raw.$extensions?.[KADENCE_TOKEN_NAMESPACE] ?? {}) : {};
	// `responsive` is pulled out alongside `clamp` so `keep` holds only the vendor keys this write does
	// not own — what is left decides whether the namespace survives a full clear.
	const { clamp, responsive: previous, ...keep } = vendor;
	const responsive = { ...(previous ?? {}) };

	// Clearing an override deletes its key instead of storing an empty one. An empty string is not a
	// valid value for any responsive-capable DTCG type, so a leftover `{ tablet: '' }` makes the whole
	// document fail server-side validation — the write is rejected and the override the user just
	// cleared stays in place.
	if (isCleared(value)) {
		delete responsive[breakpoint];
	} else {
		responsive[breakpoint] = value;
	}

	// With no overrides left there is nothing an envelope is for, so the leaf collapses back to the
	// plain scalar it was before the first override — otherwise clearing them one by one would leave
	// an empty `responsive` map behind.
	if (Object.keys(responsive).length === 0) {
		if (Object.keys(keep).length === 0) {
			const { [KADENCE_TOKEN_NAMESPACE]: dropped, ...siblings } = envelope ? (raw.$extensions ?? {}) : {};

			if (Object.keys(siblings).length === 0) {
				return base;
			}

			return { ...raw, [ENVELOPE_VALUE_KEY]: base, $extensions: siblings };
		}

		return {
			...(envelope ? raw : {}),
			[ENVELOPE_VALUE_KEY]: base,
			$extensions: {
				...(envelope ? (raw.$extensions ?? {}) : {}),
				[KADENCE_TOKEN_NAMESPACE]: keep,
			},
		};
	}

	return {
		...(envelope ? raw : {}),
		[ENVELOPE_VALUE_KEY]: base,
		$extensions: {
			...(envelope ? (raw.$extensions ?? {}) : {}),
			[KADENCE_TOKEN_NAMESPACE]: { ...keep, responsive },
		},
	};
}
