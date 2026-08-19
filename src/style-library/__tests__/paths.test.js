/* eslint-env jest */
import {
	userPrimitivesPath,
	userPrimitiveReferencesPath,
	userPrimitivePath,
	userPrimitiveRenamePath,
	palettesPath,
	palettePath,
	paletteCurrentPath,
	documentsPath,
	libraryTitlePath,
	activeLibraryPath,
	activateLibraryPath,
	feedPath,
	tokenLabelPath,
	groupOrderPath,
	blockPresetsPath,
	blockPresetPath,
} from '../api/paths';

describe('palette paths', () => {
	it('builds the palettes collection path with the library query', () => {
		expect(palettesPath('kb-design-tokens/v1', 'default')).toBe('/kb-design-tokens/v1/palettes?library=default');
	});

	it('builds a single palette path with the id and library', () => {
		expect(palettePath('kb-design-tokens/v1', 'dark', 'default')).toBe(
			'/kb-design-tokens/v1/palettes/dark?library=default'
		);
	});

	it('builds the current-palette pointer path', () => {
		expect(paletteCurrentPath('kb-design-tokens/v1', 'default')).toBe(
			'/kb-design-tokens/v1/palettes/current?library=default'
		);
	});

	it('URL-encodes the palette id and library', () => {
		expect(palettePath('kb-design-tokens/v1', 'my id', 'my set')).toBe(
			'/kb-design-tokens/v1/palettes/my%20id?library=my%20set'
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

describe('documentsPath', () => {
	it('builds the documents collection path', () => {
		expect(documentsPath()).toBe('/kb-design-tokens/v1/documents');
	});
});

describe('libraryTitlePath', () => {
	it('hangs the title endpoint off the library document path', () => {
		expect(libraryTitlePath('kb-design-tokens/v1', 'brand-a')).toBe('/kb-design-tokens/v1/documents/brand-a/title');
	});

	it('falls back to the default library slug', () => {
		expect(libraryTitlePath('kb-design-tokens/v1')).toBe('/kb-design-tokens/v1/documents/default/title');
	});
});

describe('activeLibraryPath', () => {
	it('returns the active-library path', () => {
		expect(activeLibraryPath()).toBe('/kb-design-tokens/v1/active-library');
	});
});

describe('activateLibraryPath', () => {
	it('builds the activate path for a slug', () => {
		expect(activateLibraryPath('default')).toBe('/kb-design-tokens/v1/active-library/default');
	});

	it('escapes the slug', () => {
		expect(activateLibraryPath('my set')).toBe('/kb-design-tokens/v1/active-library/my%20set');
	});
});

describe('feedPath', () => {
	it('builds the feed path for a slug', () => {
		expect(feedPath('default')).toBe('/kb-design-tokens/v1/feed/default');
	});

	it('escapes the slug', () => {
		expect(feedPath('my set')).toBe('/kb-design-tokens/v1/feed/my%20set');
	});
});

describe('tokenLabelPath', () => {
	it('builds the label path for a token id', () => {
		expect(tokenLabelPath('default', 'semantic.color.button-primary-bg')).toBe(
			'/kb-design-tokens/v1/documents/default/labels/semantic.color.button-primary-bg'
		);
	});

	it('escapes the slug and the id', () => {
		expect(tokenLabelPath('my set', 'primitive.dimension.custom.radius 2')).toBe(
			'/kb-design-tokens/v1/documents/my%20set/labels/primitive.dimension.custom.radius%202'
		);
	});
});

describe('groupOrderPath', () => {
	it('builds the order path for a group', () => {
		expect(groupOrderPath('default', 'Border Radius')).toBe(
			'/kb-design-tokens/v1/documents/default/order/Border%20Radius'
		);
	});

	it('escapes the slug', () => {
		expect(groupOrderPath('my set', 'Border Radius')).toBe(
			'/kb-design-tokens/v1/documents/my%20set/order/Border%20Radius'
		);
	});
});

describe('blockPresetsPath', () => {
	it('builds the collection path with the library query', () => {
		expect(blockPresetsPath('kb-design-tokens/v1', 'kadence/singlebtn', 'default')).toBe(
			'/kb-design-tokens/v1/presets/kadence/singlebtn?library=default'
		);
	});

	it('encodes the vendor and block-name segments separately', () => {
		expect(blockPresetsPath('kb-design-tokens/v1', 'kadence/singlebtn', 'my set')).toBe(
			'/kb-design-tokens/v1/presets/kadence/singlebtn?library=my%20set'
		);
	});
});

describe('blockPresetPath', () => {
	it('builds a single preset path with the library query', () => {
		expect(blockPresetPath('kb-design-tokens/v1', 'kadence/singlebtn', 'primary', 'default')).toBe(
			'/kb-design-tokens/v1/presets/kadence/singlebtn/primary?library=default'
		);
	});

	it('escapes the preset slug and the library', () => {
		expect(blockPresetPath('kb-design-tokens/v1', 'kadence/singlebtn', 'my preset', 'my set')).toBe(
			'/kb-design-tokens/v1/presets/kadence/singlebtn/my%20preset?library=my%20set'
		);
	});
});
