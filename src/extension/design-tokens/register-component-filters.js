/**
 * Wire design-token behavior into the token-agnostic `@kadence/components` control seams.
 *
 * The shared controls expose neutral `kadence.components.control.editor` / `.actions`
 * `@wordpress/hooks` seams and know nothing about design tokens. Here Kadence Blocks registers the
 * token behavior on both. For a control with per-slot fields (measure, measure-range, range, single
 * border) the editor seam replaces each slot's numeric input with a `TokenFieldControl`: a trigger
 * that reads like the input and opens a Style Library/Custom popover, so the field itself is the token
 * entry point. The whole-value box-shadow control has no such field, so it keeps the actions-seam
 * chip-or-picker.
 *
 * Each seam call carries neutral context `{ control, index, value, onChange, context }`, where
 * `context = { blockName, attribute, unit?, onChange? }` is the opaque blob the consuming block passes
 * in. The pickable-token list is resolved per control from `pickableTokensForControl`; per-slot picks
 * write through the adapter's `writeLeaf`, so a linked slot writes every side and an individual slot
 * writes only its own — per-corner tokens fall out for free.
 */

/**
 * Internal block libraries
 */
import { addFilter, removeFilter } from '@wordpress/hooks';
import { pickableTokensForControl } from '../token-picker';
import { isTokenAlias, TokenChip, TokenPickerButton, TokenFieldControl } from './component-token-ui';

const NAMESPACE = 'kadence-blocks/component-token';
const EDITOR_HOOK = 'kadence.components.control.editor';
const ACTIONS_HOOK = 'kadence.components.control.actions';

/**
 * Per-control-kind value-shape adapters. Each shared control reports a `control` string and a value in
 * its own shape; a field adapter reads/writes the single slot the seam is editing (`leaf`/`writeLeaf`),
 * so the field filter stays shape-agnostic. The whole-value box-shadow control writes its alias
 * directly and needs no adapter.
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
	},
	// A single scalar value (the range slider / the border width slot).
	range: {
		leaf: (value) => value,
		writeLeaf: (value, index, next) => next,
	},
	singleBorder: {
		leaf: (value) => value,
		writeLeaf: (value, index, next) => next,
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
 * Editor seam: replace a field control's numeric slot with a `TokenFieldControl` — the trigger + token
 * popover — whenever the control is token-mapped (a `context` resolves pickable tokens). Falls back to
 * the control's own editor for a control with no field adapter, no tokens, or no write handler.
 *
 * @param {*}      defaultEditor The control's own editor node for this slot.
 * @param {Object} ctx           Neutral seam context: { control, index, value, onChange, context }.
 *
 * @since TBD
 *
 * @return {*} The token field when the control is token-mapped, otherwise `defaultEditor`.
 */
function editorFilter(defaultEditor, ctx) {
	const adapter = ADAPTERS[ctx.control];
	if (!adapter || !adapter.leaf) {
		return defaultEditor;
	}

	const tokens = tokensFor(ctx);
	const write = writerFor(ctx);
	if (!tokens.length || !write) {
		return defaultEditor;
	}

	const leaf = adapter.leaf(ctx.value, ctx.index);

	return (
		<TokenFieldControl
			value={leaf}
			unit={ctx.context?.unit || ''}
			units={ctx.context?.units}
			onUnit={ctx.context?.onUnit}
			defaultValue={ctx.context?.defaultValue}
			icon={defaultEditor?.props?.icon}
			min={ctx.context?.min}
			max={ctx.context?.max}
			step={ctx.context?.step}
			tokens={tokens}
			onPick={(alias) => write(adapter.writeLeaf(ctx.value, ctx.index, alias))}
			onClear={() => write(adapter.writeLeaf(ctx.value, ctx.index, ''))}
			onCustom={(next) => write(adapter.writeLeaf(ctx.value, ctx.index, next))}
		/>
	);
}

/**
 * Actions seam: the whole-value box-shadow control has no per-slot field, so its token affordance lives
 * beside the label — a `TokenChip` when a token is set (unlink clears it), else a `TokenPickerButton`.
 * Field controls carry their affordance in the editor seam, so they append nothing here.
 *
 * @param {Array}  actions The default action nodes (empty).
 * @param {Object} ctx     Neutral seam context: { control, value, onChange, context, readOnly? }.
 *
 * @since TBD
 *
 * @return {Array} The action nodes to render.
 */
function actionsFilter(actions, ctx) {
	if (ctx.control !== 'boxShadow') {
		return actions;
	}

	const tokens = tokensFor(ctx);
	if (!tokens.length) {
		return actions;
	}

	const write = writerFor(ctx);

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
