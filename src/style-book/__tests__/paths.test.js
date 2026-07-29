/* eslint-env jest */
import {
	userPrimitivesPath,
	userPrimitiveReferencesPath,
	userPrimitivePath,
	userPrimitiveRenamePath,
	palettesPath,
	palettePath,
	paletteCurrentPath,
} from '../api/paths';

describe('palette paths', () => {
	it('builds the palettes collection path with the set query', () => {
		expect(palettesPath('kb-design-tokens/v1', 'default')).toBe('/kb-design-tokens/v1/palettes?set=default');
	});

	it('builds a single palette path with the id and set', () => {
		expect(palettePath('kb-design-tokens/v1', 'dark', 'default')).toBe(
			'/kb-design-tokens/v1/palettes/dark?set=default'
		);
	});

	it('builds the current-palette pointer path', () => {
		expect(paletteCurrentPath('kb-design-tokens/v1', 'default')).toBe(
			'/kb-design-tokens/v1/palettes/current?set=default'
		);
	});

	it('URL-encodes the palette id and set', () => {
		expect(palettePath('kb-design-tokens/v1', 'my id', 'my set')).toBe(
			'/kb-design-tokens/v1/palettes/my%20id?set=my%20set'
		);
	});
});

describe('userPrimitivesPath', () => {
	it('builds the collection path for a slug', () => {
		expect(userPrimitivesPath('default')).toBe('/kb-design-tokens/v1/documents/default/user-primitives');
	});

	it('URL-encodes special characters in the slug', () => {
		expect(userPrimitivesPath('my set')).toContain('my%20set');
	});
});

describe('userPrimitiveReferencesPath', () => {
	it('appends /references to the primitive path', () => {
		expect(userPrimitiveReferencesPath('default', 'primitive.color.custom.blue')).toBe(
			'/kb-design-tokens/v1/documents/default/user-primitives/primitive.color.custom.blue/references'
		);
	});
});

describe('userPrimitivePath', () => {
	it('builds the single-resource path', () => {
		expect(userPrimitivePath('default', 'primitive.color.custom.blue')).toBe(
			'/kb-design-tokens/v1/documents/default/user-primitives/primitive.color.custom.blue'
		);
	});
});

describe('userPrimitiveRenamePath', () => {
	it('appends /rename to the primitive path', () => {
		expect(userPrimitiveRenamePath('default', 'primitive.color.custom.blue')).toBe(
			'/kb-design-tokens/v1/documents/default/user-primitives/primitive.color.custom.blue/rename'
		);
	});
});
