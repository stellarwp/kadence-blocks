/* eslint-env jest */
import {
	userPrimitivesPath,
	userPrimitiveReferencesPath,
	userPrimitivePath,
	userPrimitiveRenamePath,
} from '../api/paths';

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
