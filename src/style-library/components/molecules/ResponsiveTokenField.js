/**
 * WordPress dependencies
 */
import { useEffect, useMemo, useState } from '@wordpress/element';
import { Button, ButtonGroup, TextControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SaveStatus } from '../atoms/SaveStatus';
import { TokenSwatch } from '../atoms/TokenSwatch';
import { TokenTypeBadge } from '../atoms/TokenTypeBadge';
import './token-field.scss';

/**
 * The stepped device tabs, in cascade order. Desktop is the base ($value); tablet / mobile are the
 * max-width overrides stored under the responsive shape.
 *
 * @since TBD
 *
 * @type {{ key: string, label: string }[]}
 */
const DEVICES = [
	{ key: 'desktop', label: __('Desktop', 'kadence-blocks') },
	{ key: 'tablet', label: __('Tablet', 'kadence-blocks') },
	{ key: 'mobile', label: __('Mobile', 'kadence-blocks') },
];

/**
 * Derive the initial editor state from the authored shape (when present) or the flat resolved value.
 *
 * @since TBD
 *
 * @param {string}                 value      Flat resolved value (desktop fallback).
 * @param {object|undefined}       responsive Authored shape: { base, responsive?: {...} } or { base, clamp?: {...} }.
 * @return {{ mode: string, desktop: string, tablet: string, mobile: string, clamp: { min: string, preferred: string, max: string } }}
 */
function hydrate(value, responsive) {
	const base = responsive?.base ?? value ?? '';

	if (responsive?.clamp) {
		return {
			mode: 'fluid',
			desktop: base,
			tablet: '',
			mobile: '',
			clamp: {
				min: responsive.clamp.min ?? '',
				preferred: responsive.clamp.preferred ?? '',
				max: responsive.clamp.max ?? '',
			},
		};
	}

	return {
		mode: 'stepped',
		desktop: base,
		tablet: responsive?.responsive?.tablet ?? '',
		mobile: responsive?.responsive?.mobile ?? '',
		clamp: { min: '', preferred: '', max: '' },
	};
}

/**
 * Assemble the structured value the save path serializes into a DTCG leaf ($value + $extensions).
 *
 * @since TBD
 *
 * @param {{ mode: string, desktop: string, tablet: string, mobile: string, clamp: object }} state Editor state.
 * @return {{ base: string, responsive?: object, clamp?: object }} Structured value: base plus the stepped
 *         responsive map, or base plus the clamp slots in fluid mode.
 */
function toStructuredValue(state) {
	if (state.mode === 'fluid') {
		const { min, preferred, max } = state.clamp;

		return {
			base: `clamp(${min}, ${preferred}, ${max})`,
			clamp: { min, preferred, max },
		};
	}

	return {
		base: state.desktop,
		responsive: { tablet: state.tablet, mobile: state.mobile },
	};
}

/**
 * Responsive-aware token row for the dimension / lineHeight types: a per-breakpoint (desktop / tablet /
 * mobile) editor with an optional fluid clamp() helper. Desktop is the base value; tablet / mobile and the
 * clamp slots are stored under the token's responsive $extensions. Device state is local to the field so
 * the Style Library admin app needs no block-editor preview store.
 *
 * @since TBD
 *
 * @param {object}   props            Component props.
 * @param {object}   props.token      Token definition from the schema.
 * @param {string}   props.value      Current flat resolved value (desktop fallback).
 * @param {object}   [props.responsive] Authored responsive / clamp shape for hydration.
 * @param {Function} props.onSave     Async save handler (tokenId, type, structuredValue).
 * @param {object}   props.fieldState Save status for this field.
 * @return {JSX.Element} Token field row.
 */
export function ResponsiveTokenField({ token, value, responsive, onSave, fieldState }) {
	const initial = useMemo(() => hydrate(value, responsive), [value, responsive]);
	const [device, setDevice] = useState('desktop');
	const [state, setState] = useState(initial);

	const isSaving = fieldState.status === 'saving';

	useEffect(() => {
		setState(initial);
	}, [initial]);

	const isDirty = useMemo(
		() => JSON.stringify(toStructuredValue(state)) !== JSON.stringify(toStructuredValue(initial)),
		[state, initial]
	);

	const setField = (key, next) => setState((current) => ({ ...current, [key]: next }));
	const setClampSlot = (slot, next) =>
		setState((current) => ({ ...current, clamp: { ...current.clamp, [slot]: next } }));

	// In fluid mode every clamp slot must be filled — otherwise the base would assemble to an invalid
	// `clamp(, , )` value. Block the save (and disable the button) until the curve is complete.
	const clampIncomplete =
		state.mode === 'fluid' &&
		[state.clamp.min, state.clamp.preferred, state.clamp.max].some((slot) => slot.trim() === '');

	const handleSave = async () => {
		if (!isDirty || isSaving || clampIncomplete) {
			return;
		}

		await onSave(token.id, token.type, toStructuredValue(state));
	};

	const previewValue = state.mode === 'fluid' ? state.clamp.preferred : state[device] || state.desktop;

	return (
		<div className="kadence-blocks-style-library__token-field">
			<div className="kadence-blocks-style-library__token-field-meta">
				<TokenSwatch type={token.type} value={previewValue} />
				<div className="kadence-blocks-style-library__token-field-labels">
					<strong className="kadence-blocks-style-library__token-label">{token.label}</strong>
					<code className="kadence-blocks-style-library__token-id">{token.id}</code>
				</div>
				<TokenTypeBadge type={token.type} />
			</div>

			<div className="kadence-blocks-style-library__token-field-controls">
				<ToggleControl
					className="kadence-blocks-style-library__token-fluid-toggle"
					label={__('Fluid (clamp)', 'kadence-blocks')}
					checked={state.mode === 'fluid'}
					disabled={isSaving}
					onChange={(checked) => setField('mode', checked ? 'fluid' : 'stepped')}
				/>

				{state.mode === 'stepped' ? (
					<>
						<ButtonGroup className="kadence-blocks-style-library__token-devices">
							{DEVICES.map(({ key, label }) => (
								<Button
									key={key}
									size="small"
									variant={device === key ? 'primary' : 'secondary'}
									onClick={() => setDevice(key)}
								>
									{label}
								</Button>
							))}
						</ButtonGroup>

						<TextControl
							className="kadence-blocks-style-library__token-input"
							value={state[device]}
							onChange={(next) => setField(device, next)}
							disabled={isSaving}
							placeholder={device === 'desktop' ? '' : __('Inherits desktop', 'kadence-blocks')}
							help={device === 'desktop' ? token.cssVar : undefined}
						/>
					</>
				) : (
					<div className="kadence-blocks-style-library__token-clamp">
						<TextControl
							label={__('Min', 'kadence-blocks')}
							value={state.clamp.min}
							onChange={(next) => setClampSlot('min', next)}
							disabled={isSaving}
						/>
						<TextControl
							label={__('Preferred', 'kadence-blocks')}
							value={state.clamp.preferred}
							onChange={(next) => setClampSlot('preferred', next)}
							disabled={isSaving}
							help={__('A fluid expression, e.g. 0.995rem + 0.326vw', 'kadence-blocks')}
						/>
						<TextControl
							label={__('Max', 'kadence-blocks')}
							value={state.clamp.max}
							onChange={(next) => setClampSlot('max', next)}
							disabled={isSaving}
						/>
					</div>
				)}

				{clampIncomplete && (
					<p className="kadence-blocks-style-library__token-hint">
						{__('Enter all three clamp values (min, preferred, max) to save.', 'kadence-blocks')}
					</p>
				)}
				<Button
					variant="secondary"
					onClick={handleSave}
					disabled={!isDirty || isSaving || clampIncomplete}
					isBusy={isSaving}
				>
					{__('Save', 'kadence-blocks')}
				</Button>
				<SaveStatus status={fieldState.status} error={fieldState.error} />
			</div>
		</div>
	);
}
