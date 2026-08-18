/* eslint-env jest */
import { readPresetBreakpoint, resolvePresetBreakpoint, writePresetBreakpoint } from '../helpers/preset-envelope';

describe('readPresetBreakpoint', () => {
	const envelope = {
		$value: '0.5rem',
		$extensions: { 'com.kadence.designTokens': { responsive: { tablet: '0.375rem', mobile: '0.25rem' } } },
	};

	it('reads the base $value at desktop, per the server vocabulary', () => {
		expect(readPresetBreakpoint(envelope, 'desktop')).toBe('0.5rem');
	});

	it('reads a stepped override at tablet and mobile', () => {
		expect(readPresetBreakpoint(envelope, 'tablet')).toBe('0.375rem');
		expect(readPresetBreakpoint(envelope, 'mobile')).toBe('0.25rem');
	});

	it('treats a flat value as the desktop value with no overrides', () => {
		expect(readPresetBreakpoint('0.5rem', 'desktop')).toBe('0.5rem');
		expect(readPresetBreakpoint('0.5rem', 'tablet')).toBe('');
	});

	it('reads an absent override as empty rather than undefined', () => {
		expect(readPresetBreakpoint({ $value: '1rem' }, 'mobile')).toBe('');
	});
});

describe('writePresetBreakpoint', () => {
	it('leaves a desktop-only edit flat, so nothing gains an envelope it does not need', () => {
		expect(writePresetBreakpoint('0.5rem', 'desktop', '1rem')).toBe('1rem');
	});

	it('upgrades a flat value to an envelope on the first stepped override, keeping the base', () => {
		expect(writePresetBreakpoint('0.5rem', 'tablet', '0.375rem')).toEqual({
			$value: '0.5rem',
			$extensions: { 'com.kadence.designTokens': { responsive: { tablet: '0.375rem' } } },
		});
	});

	it('keeps existing overrides when adding another breakpoint', () => {
		const once = writePresetBreakpoint('0.5rem', 'tablet', '0.375rem');

		expect(writePresetBreakpoint(once, 'mobile', '0.25rem').$extensions['com.kadence.designTokens']).toEqual({
			responsive: { tablet: '0.375rem', mobile: '0.25rem' },
		});
	});

	it('writes the base without disturbing overrides when editing desktop on an envelope', () => {
		const withOverride = writePresetBreakpoint('0.5rem', 'tablet', '0.375rem');
		const next = writePresetBreakpoint(withOverride, 'desktop', '1rem');

		expect(next.$value).toBe('1rem');
		expect(next.$extensions['com.kadence.designTokens'].responsive).toEqual({ tablet: '0.375rem' });
	});

	it('drops clamp when a stepped override is written, since the two are mutually exclusive', () => {
		const clamped = {
			$value: '1rem',
			$extensions: {
				'com.kadence.designTokens': { clamp: { min: '1rem', preferred: '2vw', max: '2rem' } },
			},
		};

		const next = writePresetBreakpoint(clamped, 'tablet', '0.5rem');

		expect(next.$extensions['com.kadence.designTokens'].clamp).toBeUndefined();
		expect(next.$extensions['com.kadence.designTokens'].responsive).toEqual({ tablet: '0.5rem' });
	});

	it('round-trips through the reader at every breakpoint', () => {
		let value = '0.5rem';

		value = writePresetBreakpoint(value, 'tablet', '0.375rem');
		value = writePresetBreakpoint(value, 'mobile', '0.25rem');

		expect(readPresetBreakpoint(value, 'desktop')).toBe('0.5rem');
		expect(readPresetBreakpoint(value, 'tablet')).toBe('0.375rem');
		expect(readPresetBreakpoint(value, 'mobile')).toBe('0.25rem');
	});

	it('deletes a cleared override rather than storing an empty one', () => {
		const value = writePresetBreakpoint('0.5rem', 'tablet', '0.375rem');
		const next = writePresetBreakpoint(value, 'mobile', '0.25rem');

		const cleared = writePresetBreakpoint(next, 'tablet', '');

		expect(cleared.$extensions['com.kadence.designTokens'].responsive).toEqual({ mobile: '0.25rem' });
		expect(readPresetBreakpoint(cleared, 'tablet')).toBe('');
		expect(readPresetBreakpoint(cleared, 'desktop')).toBe('0.5rem');
	});

	it('collapses back to a flat scalar once the last override is cleared', () => {
		const value = writePresetBreakpoint('0.5rem', 'tablet', '0.375rem');

		expect(writePresetBreakpoint(value, 'tablet', '')).toBe('0.5rem');
	});

	it('treats an all-empty slot list as a cleared override', () => {
		const value = writePresetBreakpoint('0.5rem', 'tablet', ['0.25rem', '0.25rem', '0.25rem', '0.25rem']);

		expect(writePresetBreakpoint(value, 'tablet', ['', '', '', ''])).toBe('0.5rem');
	});

	it('keeps a slot list that still holds one corner', () => {
		const value = writePresetBreakpoint('0.5rem', 'tablet', ['0.25rem', '', '', '']);

		expect(readPresetBreakpoint(value, 'tablet')).toEqual(['0.25rem', '', '', '']);
	});

	it('keeps sibling vendor keys when the last override is cleared', () => {
		const value = {
			$value: '0.5rem',
			$extensions: {
				'com.kadence.designTokens': { responsive: { tablet: '0.375rem' } },
				'com.other.vendor': { note: 'keep me' },
			},
		};

		expect(writePresetBreakpoint(value, 'tablet', '')).toEqual({
			$value: '0.5rem',
			$extensions: { 'com.other.vendor': { note: 'keep me' } },
		});
	});
});

describe('resolvePresetBreakpoint', () => {
	const NS = 'com.kadence.designTokens';

	it('steps mobile down to tablet when mobile has no override of its own', () => {
		// The projected tablet media query covers mobile widths, so this is what actually renders.
		const value = {
			$value: '0.1875rem',
			$extensions: { [NS]: { responsive: { tablet: '0.5rem' } } },
		};

		expect(resolvePresetBreakpoint(value, 'mobile')).toBe('0.5rem');
	});

	it('falls through to desktop when neither tablet nor mobile is set', () => {
		expect(resolvePresetBreakpoint({ $value: '0.1875rem' }, 'mobile')).toBe('0.1875rem');
	});

	it('prefers a mobile override over the tablet one', () => {
		const value = {
			$value: '0.1875rem',
			$extensions: { [NS]: { responsive: { tablet: '0.5rem', mobile: '0.25rem' } } },
		};

		expect(resolvePresetBreakpoint(value, 'mobile')).toBe('0.25rem');
		expect(resolvePresetBreakpoint(value, 'tablet')).toBe('0.5rem');
		expect(resolvePresetBreakpoint(value, 'desktop')).toBe('0.1875rem');
	});

	it('skips an all-empty slot list when stepping down', () => {
		const value = {
			$value: '0.1875rem',
			$extensions: { [NS]: { responsive: { tablet: '0.5rem', mobile: ['', '', '', ''] } } },
		};

		expect(resolvePresetBreakpoint(value, 'mobile')).toBe('0.5rem');
	});

	it('resolves a flat value at every breakpoint', () => {
		expect(resolvePresetBreakpoint('0.5rem', 'mobile')).toBe('0.5rem');
	});
});

describe('writePresetBreakpoint data preservation on clear', () => {
	const NS = 'com.kadence.designTokens';

	it('keeps the clamp when a responsive override is cleared', () => {
		// The clamp is dropped when a stepped override replaces it, because the schema makes the two
		// mutually exclusive. A clear writes no override, so nothing conflicts with the clamp.
		const clamped = {
			$value: '1rem',
			$extensions: { [NS]: { clamp: { min: '1rem', max: '2rem' }, responsive: { tablet: '2rem' } } },
		};

		expect(writePresetBreakpoint(clamped, 'tablet', '')).toEqual({
			$value: '1rem',
			$extensions: { [NS]: { clamp: { min: '1rem', max: '2rem' } } },
		});
	});

	it('keeps root-level DTCG fields when the last override is cleared', () => {
		const described = {
			$value: '1rem',
			$type: 'dimension',
			$description: 'Card radius',
			$extensions: { [NS]: { responsive: { tablet: '2rem' } } },
		};

		expect(writePresetBreakpoint(described, 'tablet', '')).toEqual({
			$value: '1rem',
			$type: 'dimension',
			$description: 'Card radius',
		});
	});

	it('collapses to a bare scalar only when $value was all the envelope carried', () => {
		const bare = { $value: '1rem', $extensions: { [NS]: { responsive: { tablet: '2rem' } } } };

		expect(writePresetBreakpoint(bare, 'tablet', '')).toBe('1rem');
	});

	it('is a true no-op when the cleared breakpoint has no override', () => {
		const clamped = { $value: '1rem', $type: 'dimension', $extensions: { [NS]: { clamp: { min: '1rem' } } } };

		expect(writePresetBreakpoint(clamped, 'tablet', '')).toBe(clamped);
	});

	it('still drops the clamp when a stepped override is written', () => {
		const clamped = { $value: '1rem', $extensions: { [NS]: { clamp: { min: '1rem', max: '2rem' } } } };

		expect(writePresetBreakpoint(clamped, 'tablet', '2rem')).toEqual({
			$value: '1rem',
			$extensions: { [NS]: { responsive: { tablet: '2rem' } } },
		});
	});
});
