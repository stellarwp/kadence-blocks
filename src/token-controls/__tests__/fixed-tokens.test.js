/* eslint-env jest */
import { autoEntry, noneEntryForRole } from '../helpers/fixed-tokens';

describe('noneEntryForRole', () => {
	it('builds a numeric-zero None entry for radius', () => {
		expect(noneEntryForRole('radius')).toEqual({
			id: 'ss-none-radius',
			label: 'None',
			value: '0',
			alias: 0,
			fixed: true,
			type: 'dimension',
			role: 'radius',
		});
	});

	it('builds a numeric-zero None entry for spacing', () => {
		expect(noneEntryForRole('spacing')).toMatchObject({
			id: 'ss-none-spacing',
			alias: 0,
			type: 'dimension',
			role: 'spacing',
		});
	});

	it('builds a numeric-zero None entry for border-width', () => {
		expect(noneEntryForRole('border-width')).toMatchObject({
			id: 'ss-none-border-width',
			alias: 0,
			type: 'dimension',
			role: 'border-width',
		});
	});

	it('builds a shorthand-string None entry for shadow', () => {
		expect(noneEntryForRole('shadow')).toEqual({
			id: 'ss-none-shadow',
			label: 'None',
			value: '0px 0px 0px 0px transparent',
			alias: '0px 0px 0px 0px transparent',
			fixed: true,
			type: 'shadow',
			role: 'shadow',
		});
	});

	it('returns null for a role with no None', () => {
		expect(noneEntryForRole('color')).toBeNull();
	});
});

describe('autoEntry', () => {
	it('builds the Auto sentinel', () => {
		expect(autoEntry()).toEqual({
			id: 'ss-auto',
			label: 'Auto',
			value: 'auto',
			alias: 'ss-auto',
			fixed: true,
			type: 'dimension',
			role: 'spacing',
		});
	});
});
