/**
 * Wire design-token behavior into the token-agnostic `@kadence/components` control seams.
 *
 * The shared controls expose neutral `kadence.components.control.editor` / `.actions`
 * `@wordpress/hooks` seams and know nothing about design tokens. Here Kadence Blocks registers the
 * token behavior on both: the editor seam swaps a numeric editor for a read-only `TokenChip` when the
 * slot holds a `{dot.alias}`, and the actions seam adds the `TokenPickerButton` (or, for the
 * whole-shadow box-shadow control, a chip-or-picker). All token knowledge lives here; the package
 * stays clean, and the picker lights up for every block that passes a `context` to a shared control.
 *
 * Each seam call carries neutral context `{ control, index, value, onChange, context }`, where
 * `context = { blockName, attribute, onChange? }` is the opaque blob the consuming block passes in.
 * The pickable-token list is resolved per control from `pickableTokensForControl`, and an unlink
 * converts the token's resolved literal back to the control's bare-number slot via `parseCssLength`.
 */

/**
 * Internal block libraries
 */
import { addFilter, removeFilter } from '@wordpress/hooks';
import { pickableTokensForControl } from '../token-picker';
import { parseCssLength } from '../token-picker/parse-css-length';
import { isTokenAlias, findTokenEntry, TokenChip, TokenPickerButton } from './component-token-ui';

const NAMESPACE = 'kadence-blocks/component-token';
const EDITOR_HOOK = 'kadence.components.control.editor';
const ACTIONS_HOOK = 'kadence.components.control.actions';

/**
 * Per-control-kind value-shape adapters. Each shared control reports a `control` string and a value in
 * its own shape; these adapters read the slot being edited, write a literal or alias back, and answer
 * whether the whole control is token-driven — so the seam filters stay shape-agnostic.
 *
 * @since TBD
 *
 * @type {Object<string, Object>}
 */
const ADAPTERS = {
	// Four-array [top,right,bottom,left]; index null = the linked "all" slot, 0-3 = a side.
	measureRange: {
		leaf: (value, index) => (Array.isArray(value) ? value[index ?? 0] : undefined),
		writeLeaf: (value, index, next) => {
			if (index === null || index === undefined) {
				return [next, next, next, next];
			}
			const arr = Array.isArray(value) ? [...value] : ['', '', '', ''];
			arr[index] = next;
			return arr;
		},
		writeAll: (value, alias) => [alias, alias, alias, alias],
		isActive: (value) => Array.isArray(value) && value.every(isTokenAlias),
	},
	// A single scalar value (the range slider / the border width slot).
	range: {
		leaf: (value) => value,
		writeLeaf: (value, index, next) => next,
		writeAll: (value, alias) => alias,
		isActive: (value) => isTokenAlias(value),
	},
	singleBorder: {
		leaf: (value) => value,
		writeLeaf: (value, index, next) => next,
		writeAll: (value, alias) => alias,
		isActive: (value) => isTokenAlias(value),
	},
	// Side-keyed object { top:[color,style,width], … }; the width is index [2]. Actions only.
	border: {
		writeAll: (value, alias) => {
			const next = { ...(value || {}) };
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				const arr = Array.isArray(next[side]) ? [...next[side]] : ['', '', ''];
				arr[2] = alias;
				next[side] = arr;
			});
			return next;
		},
		isActive: (value) => ['top', 'right', 'bottom', 'left'].every((side) => isTokenAlias(value?.[side]?.[2])),
	},
	// Whole-shadow token: a single opaque alias, chip-or-picker in the header. Actions only.
	boxShadow: {
		writeAll: (value, alias) => alias,
		isActive: (value) => isTokenAlias(value),
	},
};

// `measure` shares MeasureRange's four-array shape.
ADAPTERS.measure = ADAPTERS.measureRange;

/**
 * The pickable-token list for a seam call, resolved from the block + attribute the consuming block
 * passed in `context`. Empty when no context is supplied.
 *
 * @param {Object} ctx The seam context.
 *
 * @since TBD
 *
 * @return {Array} The pickable-token list ([{ id, alias, label, value, … }]).
 */
function tokensFor(ctx) {
	const { blockName, attribute } = ctx.context || {};
	if (!blockName || !attribute) {
		return [];
	}
	return pickableTokensForControl(blockName, attribute) || [];
}

/**
 * The write handler for a seam call: `ctx.onChange` when the control passes one (the value editors),
 * otherwise `ctx.context.onChange` (the box-shadow header, whose token write the block supplies).
 *
 * @param {Object} ctx The seam context.
 *
 * @since TBD
 *
 * @return {?Function} The write handler, or null when none is available.
 */
function writerFor(ctx) {
	return ctx.onChange || ctx.context?.onChange || null;
}

/**
 * Editor seam: render a read-only `TokenChip` in place of the numeric editor when the edited slot holds
 * a `{dot.alias}`, else the control's own editor untouched. Unlink converts the token's resolved
 * literal back to the control's bare-number slot.
 *
 * @param {*}      defaultEditor The control's own editor node for this slot.
 * @param {Object} ctx           Neutral seam context: { control, index, value, onChange, context }.
 *
 * @since TBD
 *
 * @return {*} The chip when the slot is aliased, otherwise `defaultEditor`.
 */
function editorFilter(defaultEditor, ctx) {
	const adapter = ADAPTERS[ctx.control];
	if (!adapter || !adapter.leaf) {
		return defaultEditor;
	}

	const leaf = adapter.leaf(ctx.value, ctx.index);
	if (!isTokenAlias(leaf)) {
		return defaultEditor;
	}

	const tokens = tokensFor(ctx);
	const write = writerFor(ctx);
	const onUnlink = write
		? () => {
				const entry = findTokenEntry(tokens, leaf);
				const parsed = entry ? parseCssLength(entry.value) : null;
				write(adapter.writeLeaf(ctx.value, ctx.index, parsed ? parsed.size : ''));
			}
		: undefined;

	return <TokenChip value={leaf} tokens={tokens} onUnlink={onUnlink} />;
}

/**
 * Actions seam: append the token affordance beside the control label. For the box-shadow control the
 * header is a chip-or-picker for the whole-shadow token; for every other control it is the picker,
 * which writes the picked alias into the control's value.
 *
 * @param {Array}  actions The default action nodes (empty).
 * @param {Object} ctx     Neutral seam context: { control, value, onChange, context, readOnly? }.
 *
 * @since TBD
 *
 * @return {Array} The action nodes to render.
 */
function actionsFilter(actions, ctx) {
	const adapter = ADAPTERS[ctx.control];
	if (!adapter) {
		return actions;
	}

	const tokens = tokensFor(ctx);
	if (!tokens.length) {
		return actions;
	}

	const write = writerFor(ctx);

	if (ctx.control === 'boxShadow') {
		if (isTokenAlias(ctx.value)) {
			return [
				...actions,
				<TokenChip
					key="kb-token"
					value={ctx.value}
					tokens={tokens}
					onUnlink={write ? () => write('') : undefined}
				/>,
			];
		}
		return [
			...actions,
			<TokenPickerButton key="kb-token" tokens={tokens} onSelect={write ? (alias) => write(alias) : undefined} />,
		];
	}

	return [
		...actions,
		<TokenPickerButton
			key="kb-token"
			tokens={tokens}
			onSelect={write ? (alias) => write(adapter.writeAll(ctx.value, alias)) : undefined}
			isActive={adapter.isActive(ctx.value)}
		/>,
	];
}

/**
 * Register the design-token listeners on the `@kadence/components` control seams. Idempotent: it
 * removes any prior listener under this namespace first, so it is safe to call more than once (editor
 * init plus a test's setup).
 *
 * @since TBD
 *
 * @return {void}
 */
export function registerComponentTokenFilters() {
	removeFilter(EDITOR_HOOK, NAMESPACE);
	addFilter(EDITOR_HOOK, NAMESPACE, editorFilter);
	removeFilter(ACTIONS_HOOK, NAMESPACE);
	addFilter(ACTIONS_HOOK, NAMESPACE, actionsFilter);
}
