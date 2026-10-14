/* eslint-env jest */

/**
 * The single button's deprecation moves a saved "Button Inherit Styles" value onto the preset the front
 * end already renders for it, and leaves every other button alone.
 */

/**
 * Internal dependencies
 */
import metadata from '../block.json';
import deprecated, { migrateToPreset, needsPresetMigration } from '../deprecated';

const [entry] = deprecated;

describe('the single button deprecation entry', () => {
	it('registers the current attributes and supports with a null save, so a dynamic block stays valid', () => {
		expect(deprecated).toHaveLength(1);
		expect(entry.attributes).toBe(metadata.attributes);
		expect(entry.supports).toBe(metadata.supports);
		expect(entry.save()).toBeNull();
		expect(entry.isEligible).toBe(needsPresetMigration);
		expect(entry.migrate).toBe(migrateToPreset);
	});

	it('keeps inheritStyles registered so the render-time mapping can still read it', () => {
		expect(metadata.attributes.inheritStyles).toEqual({ type: 'string', default: 'fill' });
	});
});

describe('needsPresetMigration', () => {
	it.each([
		['inherit', true],
		['inherit-secondary', true],
		['outline', true],
		['fill', false],
		['', false],
		[undefined, false],
	])('a button with no preset and inheritStyles %p needs the migration: %p', (inheritStyles, expected) => {
		expect(needsPresetMigration({ inheritStyles })).toBe(expected);
	});

	it('leaves a button that already has a preset alone', () => {
		expect(needsPresetMigration({ kbPreset: 'outline', inheritStyles: 'inherit' })).toBe(false);
	});

	it('is false for a block with no attributes at all', () => {
		expect(needsPresetMigration(undefined)).toBe(false);
	});
});

describe('migrateToPreset', () => {
	it.each([
		['inherit', 'theme-base'],
		['inherit-secondary', 'theme-secondary'],
		['outline', 'outline'],
	])('maps %s onto the %s preset and clears the retired value', (inheritStyles, kbPreset) => {
		expect(migrateToPreset({ inheritStyles, text: 'Hi' })).toEqual({ kbPreset, inheritStyles: '', text: 'Hi' });
	});

	it('keeps every other attribute as saved', () => {
		const attributes = { inheritStyles: 'inherit', text: 'Hi', link: '#', sizePreset: 'large', uniqueID: '1_a' };

		expect(migrateToPreset(attributes)).toEqual({ ...attributes, kbPreset: 'theme-base', inheritStyles: '' });
		expect(attributes.kbPreset).toBeUndefined();
	});
});
