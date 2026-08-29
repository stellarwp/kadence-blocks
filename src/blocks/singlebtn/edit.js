/**
 * BLOCK: Kadence Advanced Btn Single.
 *
 * Editor for Advanced Btn
 */
import {
	KadenceColorOutput,
	getPreviewSize,
	showSettings,
	getSpacingOptionOutput,
	getFontSizeOptionOutput,
	typographyStyle,
	getBorderStyle,
	getBorderColor,
	uniqueIdHelper,
	getInQueryBlock,
	compareVersions,
} from '@kadence/helpers';

import {
	PopColorControl,
	TypographyControls,
	SmallResponsiveControl,
	ResponsiveRangeControls,
	IconRender,
	HoverToggleControl,
	KadenceIconPicker,
	KadencePanelBody,
	URLInputControl,
	KadenceWebfontLoader,
	BackgroundTypeControl,
	KadenceRadioButtons,
	URLInputInline,
	ResponsiveAlignControls,
	GradientControl,
	InspectorControlTabs,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	SpacingVisualizer,
	CopyPasteAttributes,
	DynamicTextControl,
	DynamicInlineReplaceControl,
	Tooltip,
} from '@kadence/components';
import classnames from 'classnames';
import { times, filter, map, uniqueId, get, upperFirst } from 'lodash';

import metadata from './block.json';
/**
 * Internal block libraries
 */
import { __, sprintf } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import { tooltip as tooltipIcon } from '@kadence/icons';
import { link as linkIcon } from '@wordpress/icons';
import { displayShortcut, isKeyboardEvent } from '@wordpress/keycodes';
import { useEffect, useState } from '@wordpress/element';
import {
	RichText,
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
	InspectorAdvancedControls,
	JustifyContentControl,
	BlockVerticalAlignmentControl,
	useBlockProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	TextControl,
	ToolbarGroup,
	SelectControl,
	ToggleControl,
	ToolbarButton,
	Spinner,
	TextareaControl,
	Dropdown,
	Button,
} from '@wordpress/components';
import { addFilter, applyFilters, doAction } from '@wordpress/hooks';
import BackendStyles from './components/backend-styles';
import { PresetButton } from '../../extension/preset-picker/PresetButton';
import {
	usePresetBinding,
	resetAttr,
	presetPropertyValueForDevice,
	deriveStateBinding,
	useLinkedMeasureState,
} from '../../extension/token-indicators';
import {
	anyCornerInherited,
	inheritedMeasureSlots,
	measureAttrsForDevice,
	presetValueForDevice,
	presetValueOr,
} from '../../extension/token-indicators/normalize';
import { EditorBoxControl } from '../../extension/design-tokens/components/EditorBoxControl';
import { EditorBorderControl } from '../../extension/design-tokens/components/EditorBorderControl';
import {
	EditorShadowControl,
	combineColorOpacity,
	splitColorOpacity,
} from '../../extension/design-tokens/components/EditorShadowControl';
import { pickableTokensForControl, pickableTokensForKey } from '../../extension/token-picker';
import { ColorControl, ColorControlGroup } from '../../token-controls';
import { BUTTON_MARGIN_FALLBACK, BUTTON_PADDING_FALLBACK } from '../../token-controls/helpers/button-box-defaults';
import { useColorGroups } from '../../extension/design-tokens/hooks/use-color-groups';
import { resolveColorLiteral } from '../../extension/design-tokens/color-literal';

/**
 * `EditorBorderControl`'s `renderColor` render-prop: reuses the block's existing `PopColorControl`
 * unchanged. `BorderControl`'s row anatomy always calls this once per row with that row's own
 * resolved color scalar (via `readSlot()`), never the whole four-element axis, so this only ever
 * renders one swatch per call — the same way it already reads `width`/`style` per row. Color is out
 * of this plan's scope entirely; this only wires the existing color-picking mechanism back in.
 *
 * @param {Object}   props          The render-prop's argument.
 * @param {*}        props.value    The row's own resolved color scalar.
 * @param {Function} props.onChange Called with the next color scalar.
 * @param {?string}  [props.label]  The row's own bare side name (e.g. "top"), or `null` while
 *                                  linked, from `BorderControl`'s per-row `renderColor` call.
 *
 * @since TBD
 *
 * @return {JSX.Element} The rendered color field.
 */
function renderBorderColor({ value, onChange, label }) {
	return (
		<PopColorControl
			swatchLabel={
				label
					? sprintf(
							/* translators: %s: border side (Top, Right, Bottom, Left) */
							__('%s Border Color', 'kadence-blocks'),
							upperFirst(label)
						)
					: undefined
			}
			value={value || ''}
			default={''}
			hideClear={true}
			onChange={onChange}
		/>
	);
}

/**
 * `EditorShadowControl`'s `renderColor` render-prop: reuses the block's existing `PopColorControl`
 * unchanged, wired through its own two-channel `opacityValue`/`onArrayChange` props so the swatch's
 * opacity slider keeps working exactly as it did on the native `@kadence/components` `BoxShadowControl`
 * (see `node_modules/@kadence/components/src/box-shadow-control/index.js`). The composite's `color`
 * slot arrives combined (`combineColorOpacity`); this is the one place that has to split it apart for
 * `PopColorControl` and recombine on every write, using the exact same rules `EditorShadowControl`
 * itself uses to read/write the native attribute, so both directions agree.
 *
 * @param {Object}   props          The render-prop's argument.
 * @param {string}   props.value    The composite's combined color slot (a plain hex, or `rgba(...)`).
 * @param {Function} props.onChange Called with the next combined color slot.
 *
 * @since TBD
 *
 * @return {JSX.Element} The rendered color field.
 */
function renderShadowColor({ value, onChange }) {
	const { color, opacity } = splitColorOpacity(value);

	return (
		<PopColorControl
			value={color || ''}
			default={'#000000'}
			hideClear={true}
			opacityValue={opacity}
			onChange={(next) => onChange(combineColorOpacity(next, opacity))}
			onOpacityChange={(next) => onChange(combineColorOpacity(color, next))}
			onArrayChange={(next, nextOpacity) => onChange(combineColorOpacity(next, nextOpacity))}
		/>
	);
}

export default function KadenceButtonEdit(props) {
	const { attributes, setAttributes, isSelected, context, clientId, name } = props;
	const {
		uniqueID,
		text,
		link,
		target,
		sponsored,
		download,
		noFollow,
		sizePreset,
		padding,
		tabletPadding,
		mobilePadding,
		paddingUnit,
		color,
		background,
		backgroundType,
		textBackgroundType,
		textGradient,
		textBackgroundHoverType,
		textGradientHover,
		gradient,
		colorHover,
		backgroundHover,
		backgroundHoverType,
		gradientHover,
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle,
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle,
		typography,
		borderRadius,
		tabletBorderRadius,
		mobileBorderRadius,
		borderRadiusUnit,
		borderHoverRadius,
		tabletBorderHoverRadius,
		mobileBorderHoverRadius,
		borderHoverRadiusUnit,
		icon,
		iconSide,
		iconHover,
		width,
		widthUnit,
		widthType,
		shadow,
		shadowHover,
		inheritStyles,
		iconSize,
		iconPadding,
		tabletIconPadding,
		mobileIconPadding,
		iconPaddingUnit,
		onlyIcon,
		onlyText,
		iconColor,
		iconColorHover,
		label,
		marginUnit,
		margin,
		iconSizeUnit,
		tabletMargin,
		mobileMargin,
		kadenceAOSOptions,
		kadenceAnimation,
		hideLink,
		iconTitle,
		textUnderline,
		inQueryBlock,
		kadenceDynamic,
		className,
		colorTransparent,
		colorTransparentHover,
		backgroundTransparent,
		backgroundTransparentType,
		gradientTransparent,
		backgroundTransparentHover,
		backgroundTransparentHoverType,
		gradientTransparentHover,
		borderTransparentStyle,
		tabletBorderTransparentStyle,
		mobileBorderTransparentStyle,
		borderTransparentHoverStyle,
		tabletBorderTransparentHoverStyle,
		mobileBorderTransparentHoverStyle,
		borderTransparentRadius,
		tabletBorderTransparentRadius,
		mobileBorderTransparentRadius,
		borderTransparentRadiusUnit,
		borderTransparentHoverRadius,
		tabletBorderTransparentHoverRadius,
		mobileBorderTransparentHoverRadius,
		borderTransparentHoverRadiusUnit,
		shadowTransparent,
		shadowTransparentHover,
		colorSticky,
		colorStickyHover,
		backgroundSticky,
		backgroundStickyType,
		gradientSticky,
		backgroundStickyHover,
		backgroundStickyHoverType,
		gradientStickyHover,
		borderStickyStyle,
		tabletBorderStickyStyle,
		mobileBorderStickyStyle,
		borderStickyHoverStyle,
		tabletBorderStickyHoverStyle,
		mobileBorderStickyHoverStyle,
		borderStickyRadius,
		tabletBorderStickyRadius,
		mobileBorderStickyRadius,
		borderStickyRadiusUnit,
		borderStickyHoverRadius,
		tabletBorderStickyHoverRadius,
		mobileBorderStickyHoverRadius,
		borderStickyHoverRadiusUnit,
		shadowSticky,
		shadowStickyHover,
		tooltip,
		tooltipPlacement,
		buttonRole,
		iconReveal,
	} = attributes;

	// Support rank math content analysis.
	if (uniqueID !== '') {
		const rankMathContent =
			'<!-- KB:BTN:' +
			uniqueID +
			' -->' +
			(link !== '' ? '<a href="' + link + '">' + text + '</a>' : '<button>' + text + '</button>') +
			'<!-- /KB:BTN:' +
			uniqueID +
			' -->';
		addFilter('rank_math_content', 'kadence/advbtn', (content) => {
			const regex = new RegExp('<!-- KB:BTN:' + uniqueID + ' -->[^]*?<!-- /KB:BTN:' + uniqueID + ' -->', 'g');
			return content.replace(regex, '') + rankMathContent;
		});
	}
	const { updateBlockAttributes } = useDispatch(blockEditorStore);
	const { btnsBlock, rootID } = useSelect(
		(select) => {
			const { getBlockRootClientId, getBlocksByClientId } = select(blockEditorStore);
			const rootID = getBlockRootClientId(clientId);
			const btnsBlock = getBlocksByClientId(rootID);
			return {
				btnsBlock: undefined !== btnsBlock ? btnsBlock : '',
				rootID: undefined !== rootID ? rootID : '',
			};
		},
		[clientId]
	);
	const updateParentBlock = (key, value) => {
		updateBlockAttributes(rootID, { [key]: value });
	};
	const { previewDevice } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			};
		},
		[clientId]
	);
	// The Border Radius control keeps ONE linked/individual mode but writes a different attribute per
	// breakpoint, so the mode must be read from — and "link" must collapse — whichever device is active.
	const borderRadiusForDevice = measureAttrsForDevice(
		attributes,
		'borderRadius',
		{ tablet: 'tabletBorderRadius', mobile: 'mobileBorderRadius' },
		previewDevice
	);
	// Padding keeps the same one-mode-per-device shape as Border Radius above — one linked/individual
	// mode, but a different stored attribute per breakpoint.
	const paddingForDevice = measureAttrsForDevice(
		attributes,
		'padding',
		{ tablet: 'tabletPadding', mobile: 'mobilePadding' },
		previewDevice
	);
	// Design-token indicators: the per-attribute bound/overridden state for the selected preset, plus a
	// reset that clears the mapped attribute back to the preset value (served by the existing scoped CSS).
	const tokenBinding = usePresetBinding('kadence/singlebtn', attributes, undefined, previewDevice);
	const resetToken = (attr) => resetAttr(attr, setAttributes, tokenBinding[attr]?.kind);
	// One fetch of the block's effective palette groups, shared by every `ColorControl` instance on
	// this block — the palette data is identical for all fourteen of them.
	const colorGroups = useColorGroups(clientId);

	const borderRadiusPresetValue = presetValueForDevice(
		tokenBinding.borderRadius?.presetValue,
		tokenBinding.borderRadius?.responsive,
		previewDevice
	);

	// What an unset Border Width field falls back to: the active preset's own resolved width.
	// `button-border-width` shares `borderStyle`'s `control_attr` with style/color, and
	// `tokenBinding.borderStyle` combines all three axes into one entry keyed by that shared attribute
	// — there is no per-axis width-only entry to pull a value out of, so this reads the width axis
	// directly by its own property key instead. Shown as `EditorBorderControl`'s `defaultValue` —
	// without it, a cleared width field renders empty and collapses to zero height (its
	// `TokenSelector`'s trigger has nothing to show), which reads as broken rather than reset.
	const borderWidthPresetValue = presetPropertyValueForDevice(
		'kadence/singlebtn',
		'button-border-width',
		attributes,
		undefined,
		previewDevice
	);

	// Read directly: `button-shadow` declares no `control_attr`, so `usePresetBinding` skips it.
	const shadowPresetValue = presetPropertyValueForDevice(
		'kadence/singlebtn',
		'button-shadow',
		attributes,
		undefined,
		previewDevice
	);

	// What an unset Border Radius corner falls back to on the active device: another breakpoint's corner
	// before the preset's, matching the cascade the button actually renders through. The corners stay
	// stored-empty — this only tells the field's popover which size is in effect and where it came from.
	const inheritedBorderRadius = inheritedMeasureSlots(
		previewDevice,
		{ desktop: borderRadius, tablet: tabletBorderRadius },
		borderRadiusPresetValue
	);

	// The fallback only catches a custom preset that omits the key, which would otherwise read as blank.
	const paddingPresetValue = presetValueOr(
		presetValueForDevice(tokenBinding.padding?.presetValue, tokenBinding.padding?.responsive, previewDevice),
		BUTTON_PADDING_FALLBACK
	);

	// What an unset Padding side falls back to on the active device — same cascade as Border Radius
	// above, run over sides rather than corners.
	const inheritedPadding = inheritedMeasureSlots(
		previewDevice,
		{ desktop: padding, tablet: tabletPadding },
		paddingPresetValue
	);

	// Margin keeps the same one-mode-per-device shape as Padding above.
	const marginForDevice = measureAttrsForDevice(
		attributes,
		'margin',
		{ tablet: 'tabletMargin', mobile: 'mobileMargin' },
		previewDevice
	);

	// Same reasoning as `paddingPresetValue` above, for `button-margin`.
	const marginPresetValue = presetValueOr(
		presetValueForDevice(tokenBinding.margin?.presetValue, tokenBinding.margin?.responsive, previewDevice),
		BUTTON_MARGIN_FALLBACK
	);

	// What an unset Margin side falls back to on the active device — same cascade as Padding above.
	const inheritedMargin = inheritedMeasureSlots(
		previewDevice,
		{ desktop: margin, tablet: tabletMargin },
		marginPresetValue
	);

	useEffect(() => {
		setAttributes({ inQueryBlock: getInQueryBlock(context, inQueryBlock) });

		if (!inQueryBlock) {
			doAction('kadence.triggerDynamicUpdate', 'link', 'link', props);
		}
	}, []);

	uniqueIdHelper(props);

	const [activeTab, setActiveTab] = useState('general');
	const [isEditingURL, setIsEditingURL] = useState(false);

	// Everything the new box control needs that the block already knows, gathered in one place rather
	// than inlined into the JSX.
	const { setPreviewDeviceType: setPreviewDevice } = useDispatch('kadenceblocks/data');
	const borderRadiusTokens = pickableTokensForControl('kadence/singlebtn', 'borderRadius') || [];
	const borderRadiusIsRelative = borderRadiusUnit === 'em' || borderRadiusUnit === 'rem';
	// Border width and shadow bind through their bindings KEY, not `pickableTokensForControl`'s
	// `control_attr` reverse lookup: `button-shadow`'s PHP binding declares no `control_attr` at all
	// (its native attribute is a composite shape a `control_attr` lookup can't target), and
	// `button-border-width` shares its `control_attr` ('borderStyle') with style/color, which would make
	// a control_attr-keyed lookup ambiguous among the three (see declarations.php's `kadence/singlebtn`
	// block). One PHP binding exists per property (`button-border-width`, `button-shadow`) — there is
	// one border-width scale and one shadow scale, not a separate one per state — so every
	// hover/sticky/transparent variant below reuses the same resolved list rather than re-filtering the
	// pool per state.
	const borderWidthPickableTokens = pickableTokensForKey('kadence/singlebtn', 'button-border-width');
	// The shared narrowing in `pickableTokensForKey` already prepends the fixed "None" sentinel for the
	// shadow role, so this list must NOT prepend a second one.
	const shadowPickableTokens = pickableTokensForKey('kadence/singlebtn', 'button-shadow');
	const paddingPickableTokens = pickableTokensForKey('kadence/singlebtn', 'button-padding');
	const marginPickableTokens = pickableTokensForKey('kadence/singlebtn', 'button-margin');

	// The border-radius/padding linked/individual mode is derived from the stored slots (all equal reads
	// as linked), so no new attribute is needed and old buttons open in the right mode. The hook's own
	// override only records an explicit "unlink" of already-equal slots for the current session — it
	// resets on remount, matching how the control's mode has always been session-local. It is keyed by
	// device internally: the responsive control keeps ONE mode but writes three attributes, so a choice
	// made on Tablet must not flip Desktop's slots (and vice versa). It also resets whenever the active
	// preset changes (via `resetOn`), since an override records a choice about the PREVIOUS preset's
	// slots — otherwise an explicit "link" would stick and hide a new preset's per-slot value.
	const { isLinked: borderRadiusIsLinked, toggleLink: toggleBorderRadiusLink } = useLinkedMeasureState({
		forDevice: borderRadiusForDevice,
		previewDevice,
		setAttributes,
		resetOn: attributes.kbPreset,
	});

	// Padding's linked/individual mode, mirroring Border Radius's own hook call above with "corner"
	// swapped for "side". `resetOn` clears the remembered choice, which belonged to the old preset.
	const { isLinked: paddingIsLinked, toggleLink: togglePaddingLink } = useLinkedMeasureState({
		forDevice: paddingForDevice,
		previewDevice,
		setAttributes,
		resetOn: attributes.kbPreset,
	});

	// Margin's linked/individual mode, mirroring Padding's own hook call above — same shape, run over
	// `marginForDevice` instead, `resetOn` included for the same reason.
	const { isLinked: marginIsLinked, toggleLink: toggleMarginLink } = useLinkedMeasureState({
		forDevice: marginForDevice,
		previewDevice,
		setAttributes,
		resetOn: attributes.kbPreset,
	});

	// Hover/Transparent/Transparent Hover/Sticky/Sticky Hover each store their own 4 corners, so each
	// gets its own call to the hook above — sharing Normal's linked state would couple these states'
	// link/unlink UI together even though the underlying attributes are independent. All 6 states still
	// read/write the same `tokenBinding.borderRadius` preset binding and `borderRadiusTokens` pool, since
	// there is only one border-radius preset property.
	const borderHoverRadiusForDevice = measureAttrsForDevice(
		attributes,
		'borderHoverRadius',
		{ tablet: 'tabletBorderHoverRadius', mobile: 'mobileBorderHoverRadius' },
		previewDevice
	);
	const inheritedBorderHoverRadius = inheritedMeasureSlots(
		previewDevice,
		{ desktop: borderHoverRadius, tablet: tabletBorderHoverRadius },
		borderRadiusPresetValue
	);
	const { isLinked: borderHoverRadiusIsLinked, toggleLink: toggleBorderHoverRadiusLink } = useLinkedMeasureState({
		forDevice: borderHoverRadiusForDevice,
		previewDevice,
		setAttributes,
		resetOn: attributes.kbPreset,
	});

	const borderTransparentRadiusForDevice = measureAttrsForDevice(
		attributes,
		'borderTransparentRadius',
		{ tablet: 'tabletBorderTransparentRadius', mobile: 'mobileBorderTransparentRadius' },
		previewDevice
	);
	const inheritedBorderTransparentRadius = inheritedMeasureSlots(
		previewDevice,
		{ desktop: borderTransparentRadius, tablet: tabletBorderTransparentRadius },
		borderRadiusPresetValue
	);
	const { isLinked: borderTransparentRadiusIsLinked, toggleLink: toggleBorderTransparentRadiusLink } =
		useLinkedMeasureState({
			forDevice: borderTransparentRadiusForDevice,
			previewDevice,
			setAttributes,
			resetOn: attributes.kbPreset,
		});

	const borderTransparentHoverRadiusForDevice = measureAttrsForDevice(
		attributes,
		'borderTransparentHoverRadius',
		{ tablet: 'tabletBorderTransparentHoverRadius', mobile: 'mobileBorderTransparentHoverRadius' },
		previewDevice
	);
	const inheritedBorderTransparentHoverRadius = inheritedMeasureSlots(
		previewDevice,
		{ desktop: borderTransparentHoverRadius, tablet: tabletBorderTransparentHoverRadius },
		borderRadiusPresetValue
	);
	const { isLinked: borderTransparentHoverRadiusIsLinked, toggleLink: toggleBorderTransparentHoverRadiusLink } =
		useLinkedMeasureState({
			forDevice: borderTransparentHoverRadiusForDevice,
			previewDevice,
			setAttributes,
			resetOn: attributes.kbPreset,
		});

	const borderStickyRadiusForDevice = measureAttrsForDevice(
		attributes,
		'borderStickyRadius',
		{ tablet: 'tabletBorderStickyRadius', mobile: 'mobileBorderStickyRadius' },
		previewDevice
	);
	const inheritedBorderStickyRadius = inheritedMeasureSlots(
		previewDevice,
		{ desktop: borderStickyRadius, tablet: tabletBorderStickyRadius },
		borderRadiusPresetValue
	);
	const { isLinked: borderStickyRadiusIsLinked, toggleLink: toggleBorderStickyRadiusLink } = useLinkedMeasureState({
		forDevice: borderStickyRadiusForDevice,
		previewDevice,
		setAttributes,
		resetOn: attributes.kbPreset,
	});

	const borderStickyHoverRadiusForDevice = measureAttrsForDevice(
		attributes,
		'borderStickyHoverRadius',
		{ tablet: 'tabletBorderStickyHoverRadius', mobile: 'mobileBorderStickyHoverRadius' },
		previewDevice
	);
	const inheritedBorderStickyHoverRadius = inheritedMeasureSlots(
		previewDevice,
		{ desktop: borderStickyHoverRadius, tablet: tabletBorderStickyHoverRadius },
		borderRadiusPresetValue
	);
	const { isLinked: borderStickyHoverRadiusIsLinked, toggleLink: toggleBorderStickyHoverRadiusLink } =
		useLinkedMeasureState({
			forDevice: borderStickyHoverRadiusForDevice,
			previewDevice,
			setAttributes,
			resetOn: attributes.kbPreset,
		});

	// Each of the 5 non-Normal states' OWN Border Radius/Border indicator and reset — derived from the
	// shared preset entry above (`tokenBinding.borderRadius`/`tokenBinding.borderStyle`, the same one
	// Normal's own fields read) plus this state's own resolved value at the active device. Reusing
	// Normal's `tokenBinding` entries directly here (as every call site once did) would report Normal's
	// divergence on a field the user never opened, and its `onReset` would silently clear NORMAL's
	// attributes while leaving this state's own untouched — see `deriveStateBinding`'s own docblock.
	const borderHoverBorderForDevice = measureAttrsForDevice(
		attributes,
		'borderHoverStyle',
		{ tablet: 'tabletBorderHoverStyle', mobile: 'mobileBorderHoverStyle' },
		previewDevice
	);
	const borderHoverRadiusIsRelative = borderHoverRadiusUnit === 'em' || borderHoverRadiusUnit === 'rem';
	const borderHoverRadiusBinding = deriveStateBinding({
		shared: tokenBinding.borderRadius,
		kind: 'dimension',
		value: borderHoverRadiusForDevice.value,
		unit: borderHoverRadiusUnit,
		devicePresetValue: borderRadiusPresetValue,
	});
	const borderHoverBorderBinding = deriveStateBinding({
		shared: tokenBinding.borderStyle,
		kind: 'border',
		value: borderHoverBorderForDevice.value,
		previewDevice,
	});
	const resetBorderHoverRadius = () => resetAttr('borderHoverRadius', setAttributes, 'dimension');
	const resetBorderHoverBorder = () => resetAttr('borderHoverStyle', setAttributes, 'border');

	const borderTransparentBorderForDevice = measureAttrsForDevice(
		attributes,
		'borderTransparentStyle',
		{ tablet: 'tabletBorderTransparentStyle', mobile: 'mobileBorderTransparentStyle' },
		previewDevice
	);
	const borderTransparentRadiusIsRelative =
		borderTransparentRadiusUnit === 'em' || borderTransparentRadiusUnit === 'rem';
	const borderTransparentRadiusBinding = deriveStateBinding({
		shared: tokenBinding.borderRadius,
		kind: 'dimension',
		value: borderTransparentRadiusForDevice.value,
		unit: borderTransparentRadiusUnit,
		devicePresetValue: borderRadiusPresetValue,
	});
	const borderTransparentBorderBinding = deriveStateBinding({
		shared: tokenBinding.borderStyle,
		kind: 'border',
		value: borderTransparentBorderForDevice.value,
		previewDevice,
	});
	const resetBorderTransparentRadius = () => resetAttr('borderTransparentRadius', setAttributes, 'dimension');
	const resetBorderTransparentBorder = () => resetAttr('borderTransparentStyle', setAttributes, 'border');

	const borderTransparentHoverBorderForDevice = measureAttrsForDevice(
		attributes,
		'borderTransparentHoverStyle',
		{ tablet: 'tabletBorderTransparentHoverStyle', mobile: 'mobileBorderTransparentHoverStyle' },
		previewDevice
	);
	const borderTransparentHoverRadiusIsRelative =
		borderTransparentHoverRadiusUnit === 'em' || borderTransparentHoverRadiusUnit === 'rem';
	const borderTransparentHoverRadiusBinding = deriveStateBinding({
		shared: tokenBinding.borderRadius,
		kind: 'dimension',
		value: borderTransparentHoverRadiusForDevice.value,
		unit: borderTransparentHoverRadiusUnit,
		devicePresetValue: borderRadiusPresetValue,
	});
	const borderTransparentHoverBorderBinding = deriveStateBinding({
		shared: tokenBinding.borderStyle,
		kind: 'border',
		value: borderTransparentHoverBorderForDevice.value,
		previewDevice,
	});
	const resetBorderTransparentHoverRadius = () =>
		resetAttr('borderTransparentHoverRadius', setAttributes, 'dimension');
	const resetBorderTransparentHoverBorder = () => resetAttr('borderTransparentHoverStyle', setAttributes, 'border');

	const borderStickyBorderForDevice = measureAttrsForDevice(
		attributes,
		'borderStickyStyle',
		{ tablet: 'tabletBorderStickyStyle', mobile: 'mobileBorderStickyStyle' },
		previewDevice
	);
	const borderStickyRadiusIsRelative = borderStickyRadiusUnit === 'em' || borderStickyRadiusUnit === 'rem';
	const borderStickyRadiusBinding = deriveStateBinding({
		shared: tokenBinding.borderRadius,
		kind: 'dimension',
		value: borderStickyRadiusForDevice.value,
		unit: borderStickyRadiusUnit,
		devicePresetValue: borderRadiusPresetValue,
	});
	const borderStickyBorderBinding = deriveStateBinding({
		shared: tokenBinding.borderStyle,
		kind: 'border',
		value: borderStickyBorderForDevice.value,
		previewDevice,
	});
	const resetBorderStickyRadius = () => resetAttr('borderStickyRadius', setAttributes, 'dimension');
	const resetBorderStickyBorder = () => resetAttr('borderStickyStyle', setAttributes, 'border');

	const borderStickyHoverBorderForDevice = measureAttrsForDevice(
		attributes,
		'borderStickyHoverStyle',
		{ tablet: 'tabletBorderStickyHoverStyle', mobile: 'mobileBorderStickyHoverStyle' },
		previewDevice
	);
	const borderStickyHoverRadiusIsRelative =
		borderStickyHoverRadiusUnit === 'em' || borderStickyHoverRadiusUnit === 'rem';
	const borderStickyHoverRadiusBinding = deriveStateBinding({
		shared: tokenBinding.borderRadius,
		kind: 'dimension',
		value: borderStickyHoverRadiusForDevice.value,
		unit: borderStickyHoverRadiusUnit,
		devicePresetValue: borderRadiusPresetValue,
	});
	const borderStickyHoverBorderBinding = deriveStateBinding({
		shared: tokenBinding.borderStyle,
		kind: 'border',
		value: borderStickyHoverBorderForDevice.value,
		previewDevice,
	});
	const resetBorderStickyHoverRadius = () => resetAttr('borderStickyHoverRadius', setAttributes, 'dimension');
	const resetBorderStickyHoverBorder = () => resetAttr('borderStickyHoverStyle', setAttributes, 'border');

	useEffect(() => {
		if (!isSelected) {
			setIsEditingURL(false);
		}
	}, [isSelected]);

	const themeVersion = window?.kadence_blocks_params?.tVersion ? window.kadence_blocks_params.tVersion : '1.0.0';
	const supportsSecondaryButton = compareVersions(themeVersion, '1.4.0') >= 0;

	function startEditing(event) {
		event.preventDefault();
		setIsEditingURL(true);
	}
	const saveTypography = (value) => {
		const newUpdate = typography.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			typography: newUpdate,
		});
	};
	const btnSizes = [
		{ value: 'small', label: __('SM', 'kadence-blocks') },
		{ value: 'standard', label: __('MD', 'kadence-blocks') },
		{ value: 'large', label: __('LG', 'kadence-blocks') },
		{ value: 'xlarge', label: __('XL', 'kadence-blocks') },
	];
	const btnWidths = [
		{ value: 'auto', label: __('Auto', 'kadence-blocks') },
		{ value: 'fixed', label: __('Fixed', 'kadence-blocks') },
		{ value: 'full', label: __('Full', 'kadence-blocks') },
	];
	const defineWidthType = (type) => {
		setAttributes({ widthType: type });
	};
	const buttonStyleOptions = supportsSecondaryButton
		? [
				{ value: 'fill', label: __('Fill', 'kadence-blocks') },
				{ value: 'outline', label: __('Outline', 'kadence-blocks') },
				{ value: 'inherit', label: __('Theme Base', 'kadence-blocks') },
				{ value: 'inherit-secondary', label: __('Theme Secondary', 'kadence-blocks') },
			]
		: [
				{ value: 'fill', label: __('Fill', 'kadence-blocks') },
				{ value: 'outline', label: __('Outline', 'kadence-blocks') },
				{ value: 'inherit', label: __('Theme Base', 'kadence-blocks') },
			];
	const previewMarginTop = getPreviewSize(
		previewDevice,
		undefined !== margin?.[0] ? margin[0] : '',
		undefined !== tabletMargin?.[0] ? tabletMargin[0] : '',
		undefined !== mobileMargin?.[0] ? mobileMargin[0] : ''
	);
	const previewMarginRight = getPreviewSize(
		previewDevice,
		undefined !== margin?.[1] ? margin[1] : '',
		undefined !== tabletMargin?.[1] ? tabletMargin[1] : '',
		undefined !== mobileMargin?.[1] ? mobileMargin[1] : ''
	);
	const previewMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== margin?.[2] ? margin[2] : '',
		undefined !== tabletMargin?.[2] ? tabletMargin[2] : '',
		undefined !== mobileMargin?.[2] ? mobileMargin[2] : ''
	);
	const previewMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== margin?.[3] ? margin[3] : '',
		undefined !== tabletMargin?.[3] ? tabletMargin[3] : '',
		undefined !== mobileMargin?.[3] ? mobileMargin[3] : ''
	);
	const previewMarginUnit = marginUnit ? marginUnit : 'px';

	const previewPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== padding?.[0] ? padding[0] : '',
		undefined !== tabletPadding?.[0] ? tabletPadding[0] : '',
		undefined !== mobilePadding?.[0] ? mobilePadding[0] : ''
	);
	const previewPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== padding?.[1] ? padding[1] : '',
		undefined !== tabletPadding?.[1] ? tabletPadding[1] : '',
		undefined !== mobilePadding?.[1] ? mobilePadding[1] : ''
	);
	const previewPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== padding?.[2] ? padding[2] : '',
		undefined !== tabletPadding?.[2] ? tabletPadding[2] : '',
		undefined !== mobilePadding?.[2] ? mobilePadding[2] : ''
	);
	const previewPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== padding?.[3] ? padding[3] : '',
		undefined !== tabletPadding?.[3] ? tabletPadding[3] : '',
		undefined !== mobilePadding?.[3] ? mobilePadding[3] : ''
	);

	const previewPaddingUnit = paddingUnit ? paddingUnit : 'px';

	const previewIconSize = getPreviewSize(
		previewDevice,
		undefined !== iconSize?.[0] ? iconSize[0] : '',
		undefined !== iconSize?.[1] ? iconSize[1] : '',
		undefined !== iconSize?.[2] ? iconSize[2] : ''
	);
	const previewIconPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== iconPadding?.[0] ? iconPadding[0] : '',
		undefined !== tabletIconPadding?.[0] ? tabletIconPadding[0] : '',
		undefined !== mobileIconPadding?.[0] ? mobileIconPadding[0] : ''
	);
	const previewIconPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== iconPadding?.[1] ? iconPadding[1] : '',
		undefined !== tabletIconPadding?.[1] ? tabletIconPadding[1] : '',
		undefined !== mobileIconPadding?.[1] ? mobileIconPadding[1] : ''
	);
	const previewIconPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== iconPadding?.[2] ? iconPadding[2] : '',
		undefined !== tabletIconPadding?.[2] ? tabletIconPadding[2] : '',
		undefined !== mobileIconPadding?.[2] ? mobileIconPadding[2] : ''
	);
	const previewIconPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== iconPadding?.[3] ? iconPadding[3] : '',
		undefined !== tabletIconPadding?.[3] ? tabletIconPadding[3] : '',
		undefined !== mobileIconPadding?.[3] ? mobileIconPadding[3] : ''
	);

	const previewFixedWidth = getPreviewSize(
		previewDevice,
		undefined !== width?.[0] ? width[0] : '',
		undefined !== width?.[1] ? width[1] : undefined,
		undefined !== width?.[2] ? width[2] : undefined
	);

	const previewAlign = getPreviewSize(
		previewDevice,
		undefined !== btnsBlock?.[0]?.attributes?.hAlign ? btnsBlock?.[0]?.attributes?.hAlign : '',
		undefined !== btnsBlock?.[0]?.attributes?.thAlign ? btnsBlock?.[0]?.attributes?.thAlign : '',
		undefined !== btnsBlock?.[0]?.attributes?.mhAlign ? btnsBlock?.[0]?.attributes?.mhAlign : ''
	);
	const previewVertical = getPreviewSize(
		previewDevice,
		undefined !== btnsBlock?.[0]?.attributes?.vAlign ? btnsBlock?.[0]?.attributes?.vAlign : '',
		undefined !== btnsBlock?.[0]?.attributes?.tvAlign ? btnsBlock?.[0]?.attributes?.tvAlign : '',
		undefined !== btnsBlock?.[0]?.attributes?.mvAlign ? btnsBlock?.[0]?.attributes?.mvAlign : ''
	);
	const previewOnlyIcon = getPreviewSize(
		previewDevice,
		undefined !== onlyIcon?.[0] ? onlyIcon[0] : '',
		undefined !== onlyIcon?.[1] ? onlyIcon[1] : undefined,
		undefined !== onlyIcon?.[2] ? onlyIcon[2] : undefined
	);
	const previewOnlyText = getPreviewSize(
		previewDevice,
		false,
		undefined !== onlyText?.[0] ? onlyText[0] : undefined,
		undefined !== onlyText?.[1] ? onlyText[1] : undefined
	);
	const nonTransAttrs = ['hideLink', 'link', 'target', 'download', 'text', 'sponsor'];
	const hasIcon = undefined !== previewOnlyText && previewOnlyText ? false : icon;
	const inheritClassSuffix = inheritStyles && 'inherit-secondary' === inheritStyles ? 'inherit' : inheritStyles;
	const btnClassName = classnames({
		'kt-button': true,
		[`kt-button-${uniqueID}`]: true,
		[`kb-btn-global-${inheritClassSuffix}`]: inheritClassSuffix,
		'wp-block-button__link':
			inheritStyles && ('inherit' === inheritStyles || 'inherit-secondary' === inheritStyles),
		'button-style-secondary': inheritStyles && 'inherit-secondary' === inheritStyles,
		[`kb-btn-has-icon`]: hasIcon,
		[`kt-btn-svg-show-${!iconHover ? 'always' : 'hover'}`]: icon,
		[`kb-btn-only-icon`]: previewOnlyIcon,
		[`kb-btn-only-text`]: previewOnlyText,
		[`kt-btn-size-${sizePreset ? sizePreset : 'standard'}`]: true,
		[`kb-btn-underline-${textUnderline}`]: textUnderline,
		[`${className}`]: className,
		[`icon-reveal`]: hasIcon && iconReveal,
	});
	const wrapClasses = classnames({
		[`kb-single-btn-${uniqueID}`]: true,
		[`kt-btn-width-type-${widthType ? widthType : 'auto'}`]: true,
	});
	const blockProps = useBlockProps({
		className: wrapClasses,
		style: {
			width:
				undefined !== widthType &&
				'fixed' === widthType &&
				'%' === (undefined !== widthUnit ? widthUnit : 'px') &&
				'' !== previewFixedWidth
					? previewFixedWidth + (undefined !== widthUnit ? widthUnit : 'px')
					: undefined,
		},
	});
	const isDynamicReplaced =
		undefined !== kadenceDynamic &&
		undefined !== kadenceDynamic.text &&
		undefined !== kadenceDynamic.text.enable &&
		kadenceDynamic.text.enable;
	const richTextFormatsBase = ['core/bold', 'core/italic', 'core/strikethrough', 'toolset/inline-field'];
	const richTextFormats = !kadenceDynamic?.text?.shouldReplace
		? [...['kadence/insert-dynamic'], ...richTextFormatsBase]
		: richTextFormatsBase;

	return (
		<div {...blockProps}>
			<BackendStyles {...props} previewDevice={previewDevice} />
			<BlockControls>
				<ToolbarGroup>
					<JustifyContentControl
						value={previewAlign}
						onChange={(value) => {
							if (previewDevice === 'Mobile') {
								updateParentBlock('mhAlign', value ? value : '');
							} else if (previewDevice === 'Tablet') {
								updateParentBlock('thAlign', value ? value : '');
							} else {
								updateParentBlock('hAlign', value ? value : 'center');
							}
						}}
					/>
					<BlockVerticalAlignmentControl
						value={previewVertical}
						onChange={(value) => {
							if (previewDevice === 'Mobile') {
								updateParentBlock('mvAlign', value ? value : '');
							} else if (previewDevice === 'Tablet') {
								updateParentBlock('tvAlign', value ? value : '');
							} else {
								updateParentBlock('vAlign', value ? value : 'center');
							}
						}}
					/>
				</ToolbarGroup>
				{!hideLink && (
					<ToolbarGroup>
						<ToolbarButton
							name="link"
							icon={linkIcon}
							title={__('Link', 'kadence-blocks')}
							shortcut={displayShortcut.primary('k')}
							onClick={startEditing}
						/>
					</ToolbarGroup>
				)}
				<ToolbarGroup group="tooltip">
					<Dropdown
						className="kb-popover-inline-tooltip-container components-dropdown-menu components-toolbar"
						contentClassName="kb-popover-inline-tooltip"
						placement="bottom"
						renderToggle={({ isOpen, onToggle }) => (
							<Button
								className="components-dropdown-menu__toggle kb-inline-tooltip-toolbar-icon"
								label={__('Tooltip Settings', 'kadence-blocks')}
								icon={tooltipIcon}
								onClick={onToggle}
								aria-expanded={isOpen}
							/>
						)}
						renderContent={() => (
							<>
								<div className="kb-inline-tooltip-control">
									<TextareaControl
										label={__('Tooltip Content', 'kadence-blocks')}
										value={tooltip}
										onChange={(newValue) => setAttributes({ tooltip: newValue })}
									/>
									<SelectControl
										label={__('Placement', 'kadence-blocks')}
										value={tooltipPlacement || 'top'}
										options={[
											{ label: __('Top', 'kadence-blocks'), value: 'top' },
											{ label: __('Top Start', 'kadence-blocks'), value: 'top-start' },
											{ label: __('Top End', 'kadence-blocks'), value: 'top-end' },
											{ label: __('Right', 'kadence-blocks'), value: 'right' },
											{ label: __('Right Start', 'kadence-blocks'), value: 'right-start' },
											{ label: __('Right End', 'kadence-blocks'), value: 'right-end' },
											{ label: __('Bottom', 'kadence-blocks'), value: 'bottom' },
											{ label: __('Bottom Start', 'kadence-blocks'), value: 'bottom-start' },
											{ label: __('Bottom End', 'kadence-blocks'), value: 'bottom-end' },
											{ label: __('Left', 'kadence-blocks'), value: 'left' },
											{ label: __('Left Start', 'kadence-blocks'), value: 'left-start' },
											{ label: __('Left End', 'kadence-blocks'), value: 'left-end' },
											{ label: __('Auto', 'kadence-blocks'), value: 'auto' },
											{ label: __('Auto Start', 'kadence-blocks'), value: 'auto-start' },
											{ label: __('Auto End', 'kadence-blocks'), value: 'auto-end' },
										]}
										onChange={(val) => {
											setAttributes({ tooltipPlacement: val });
										}}
									/>
								</div>
							</>
						)}
					/>
				</ToolbarGroup>
				<CopyPasteAttributes
					attributes={attributes}
					excludedAttrs={nonTransAttrs}
					defaultAttributes={metadata.attributes}
					blockSlug={metadata.name}
					onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
				/>
				{Boolean(kadenceDynamic?.text?.shouldReplace) && (
					<DynamicTextControl dynamicAttribute={'text'} {...props} />
				)}
			</BlockControls>
			{!hideLink && isSelected && isEditingURL && (
				<URLInputInline
					url={link}
					onChangeUrl={(value) => {
						setAttributes({ link: value });
					}}
					additionalControls={true}
					changeTargetType={true}
					opensInNewTab={undefined !== target ? target : ''}
					onChangeTarget={(value) => {
						setAttributes({ target: value });
					}}
					linkNoFollow={undefined !== noFollow ? noFollow : false}
					onChangeFollow={(value) => {
						setAttributes({ noFollow: value });
					}}
					linkSponsored={undefined !== sponsored ? sponsored : false}
					onChangeSponsored={(value) => {
						setAttributes({ sponsored: value });
					}}
					linkDownload={undefined !== download ? download : false}
					onChangeDownload={(value) => {
						setAttributes({ download: value });
					}}
					dynamicAttribute={'link'}
					allowClear={true}
					isSelected={isSelected}
					attributes={attributes}
					setAttributes={setAttributes}
					name={name}
					clientId={clientId}
					context={context}
				/>
			)}
			{showSettings('allSettings', 'kadence/advancedbtn') && (
				<>
					<InspectorControls>
						<PresetButton blockName={name} attributes={attributes} setAttributes={setAttributes} />

						<InspectorControlTabs
							panelName={'singlebtn'}
							setActiveTab={(value) => setActiveTab(value)}
							activeTab={activeTab}
						/>

						{activeTab === 'general' && (
							<>
								<KadencePanelBody
									title={__('Button Settings', 'kadence-blocks')}
									initialOpen={true}
									panelName={'kb-adv-single-btn'}
								>
									{!hideLink && (
										<URLInputControl
											label={__('Button Link', 'kadence-blocks')}
											url={link}
											onChangeUrl={(value) => {
												setAttributes({ link: value });
											}}
											additionalControls={true}
											changeTargetType={true}
											opensInNewTab={undefined !== target ? target : ''}
											onChangeTarget={(value) => {
												setAttributes({ target: value });
											}}
											linkNoFollow={undefined !== noFollow ? noFollow : false}
											onChangeFollow={(value) => {
												setAttributes({ noFollow: value });
											}}
											linkSponsored={undefined !== sponsored ? sponsored : false}
											onChangeSponsored={(value) => {
												setAttributes({ sponsored: value });
											}}
											linkDownload={undefined !== download ? download : false}
											onChangeDownload={(value) => {
												setAttributes({ download: value });
											}}
											dynamicAttribute={'link'}
											allowClear={true}
											isSelected={isSelected}
											attributes={attributes}
											setAttributes={setAttributes}
											name={name}
											clientId={clientId}
											context={context}
										/>
									)}
									<KadenceRadioButtons
										value={inheritStyles}
										className={'button-style-inherit-control'}
										options={buttonStyleOptions}
										hideLabel={false}
										label={__('Button Inherit Styles', 'kadence-blocks')}
										onChange={(value) => {
											setAttributes({
												inheritStyles: value,
											});
										}}
									/>
									{showSettings('sizeSettings', 'kadence/advancedbtn') && (
										<>
											<KadenceRadioButtons
												value={sizePreset}
												options={btnSizes}
												hideLabel={false}
												label={__('Button Size', 'kadence-blocks')}
												onChange={(value) => {
													setAttributes({
														sizePreset: value,
													});
												}}
											/>
											<KadenceRadioButtons
												value={widthType}
												options={btnWidths}
												hideLabel={false}
												label={__('Button Width', 'kadence-blocks')}
												onChange={(value) => {
													setAttributes({
														widthType: value,
													});
												}}
											/>
											{'fixed' === widthType && (
												<div className="kt-inner-sub-section">
													<ResponsiveRangeControls
														label={__('Fixed Width', 'kadence-blocks')}
														value={undefined !== width?.[0] ? width[0] : undefined}
														onChange={(value) => {
															setAttributes({
																width: [
																	value,
																	undefined !== width?.[1] ? width[1] : '',
																	undefined !== width?.[2] ? width[2] : '',
																],
															});
														}}
														tabletValue={undefined !== width?.[1] ? width[1] : undefined}
														onChangeTablet={(value) => {
															setAttributes({
																width: [
																	undefined !== width?.[0] ? width[0] : '',
																	value,
																	undefined !== width?.[2] ? width[2] : '',
																],
															});
														}}
														mobileValue={undefined !== width?.[2] ? width[2] : undefined}
														onChangeMobile={(value) => {
															setAttributes({
																width: [
																	undefined !== width?.[0] ? width[0] : '',
																	undefined !== width?.[1] ? width[1] : '',
																	value,
																],
															});
														}}
														min={0}
														max={(widthUnit ? widthUnit : 'px') !== 'px' ? 100 : 600}
														step={1}
														unit={widthUnit ? widthUnit : 'px'}
														onUnit={(value) => {
															setAttributes({ widthUnit: value });
														}}
														units={['px', '%']}
													/>
												</div>
											)}
										</>
									)}
								</KadencePanelBody>
							</>
						)}

						{activeTab === 'style' && (
							<>
								{showSettings('colorSettings', 'kadence/advancedbtn') && (
									<>
										<KadencePanelBody
											title={__('Button Styles', 'kadence-blocks')}
											initialOpen={true}
											panelName={'kb-adv-single-btn-styles'}
										>
											<HoverToggleControl
												hover={
													<>
														<BackgroundTypeControl
															label={__('Text Type Hover', 'kadence-blocks')}
															type={
																textBackgroundHoverType
																	? textBackgroundHoverType
																	: 'normal'
															}
															onChange={(value) =>
																setAttributes({ textBackgroundHoverType: value })
															}
															allowedTypes={['normal', 'gradient']}
														/>
														{'gradient' === textBackgroundHoverType && (
															<GradientControl
																value={textGradientHover}
																onChange={(value) =>
																	setAttributes({ textGradientHover: value })
																}
																gradients={[]}
															/>
														)}
														{'normal' === textBackgroundHoverType && (
															<ColorControl
																label={__('Color Hover', 'kadence-blocks')}
																value={colorHover ? colorHover : ''}
																groups={colorGroups}
																status={{
																	bound: !!tokenBinding.colorHover?.bound,
																	modified: !!tokenBinding.colorHover?.overridden,
																}}
																onReset={() => resetToken('colorHover')}
																onPick={(alias) => setAttributes({ colorHover: alias })}
																onCustom={(literal) =>
																	setAttributes({ colorHover: literal })
																}
																onClear={() => setAttributes({ colorHover: '' })}
																resolveLiteral={resolveColorLiteral}
															/>
														)}
														<BackgroundTypeControl
															label={__('Background Hover Type', 'kadence-blocks')}
															type={backgroundHoverType ? backgroundHoverType : 'normal'}
															onChange={(value) =>
																setAttributes({ backgroundHoverType: value })
															}
															allowedTypes={['normal', 'gradient']}
														/>
														{'gradient' === backgroundHoverType && (
															<GradientControl
																value={gradientHover}
																onChange={(value) =>
																	setAttributes({ gradientHover: value })
																}
																gradients={[]}
															/>
														)}
														{'normal' === backgroundHoverType && (
															<ColorControl
																label={__('Background Color', 'kadence-blocks')}
																value={backgroundHover ? backgroundHover : ''}
																groups={colorGroups}
																status={{
																	bound: !!tokenBinding.backgroundHover?.bound,
																	modified:
																		!!tokenBinding.backgroundHover?.overridden,
																}}
																onReset={() => resetToken('backgroundHover')}
																onPick={(alias) =>
																	setAttributes({ backgroundHover: alias })
																}
																onCustom={(literal) =>
																	setAttributes({ backgroundHover: literal })
																}
																onClear={() => setAttributes({ backgroundHover: '' })}
																resolveLiteral={resolveColorLiteral}
															/>
														)}
														<EditorBorderControl
															label={__('Border', 'kadence-blocks')}
															value={borderHoverStyle}
															tabletValue={tabletBorderHoverStyle}
															mobileValue={mobileBorderHoverStyle}
															onChange={(value) =>
																setAttributes({ borderHoverStyle: value })
															}
															onChangeTablet={(value) =>
																setAttributes({ tabletBorderHoverStyle: value })
															}
															onChangeMobile={(value) =>
																setAttributes({ mobileBorderHoverStyle: value })
															}
															previewDevice={previewDevice}
															onDeviceChange={setPreviewDevice}
															widthTokens={borderWidthPickableTokens}
															defaultValue={borderWidthPresetValue}
															renderColor={renderBorderColor}
															state={borderHoverBorderBinding}
															onReset={resetBorderHoverBorder}
														/>
														<EditorBoxControl
															label={__('Border Radius', 'kadence-blocks')}
															value={borderHoverRadiusForDevice.value}
															onChange={(next) =>
																setAttributes({
																	[borderHoverRadiusForDevice.attr]: next,
																})
															}
															previewDevice={previewDevice}
															onDeviceChange={setPreviewDevice}
															tokens={borderRadiusTokens}
															defaultValue={inheritedBorderHoverRadius.values}
															inherited={anyCornerInherited(
																inheritedBorderHoverRadius.inherited
															)}
															state={borderHoverRadiusBinding}
															onReset={resetBorderHoverRadius}
															isLinked={borderHoverRadiusIsLinked}
															onToggleLink={toggleBorderHoverRadiusLink}
															unit={borderHoverRadiusUnit}
															units={['px', 'em', 'rem', '%']}
															onUnit={(value) =>
																setAttributes({ borderHoverRadiusUnit: value })
															}
															max={borderHoverRadiusIsRelative ? 24 : 500}
															step={borderHoverRadiusIsRelative ? 0.1 : 1}
															min={0}
														/>
														<EditorShadowControl
															defaultValue={shadowPresetValue}
															label={__('Box Shadow', 'kadence-blocks')}
															value={shadowHover}
															onChange={(value) => setAttributes({ shadowHover: value })}
															tokens={shadowPickableTokens}
															renderColor={renderShadowColor}
														/>
													</>
												}
												normal={
													<>
														<BackgroundTypeControl
															label={__('Text Type', 'kadence-blocks')}
															type={textBackgroundType ? textBackgroundType : 'normal'}
															onChange={(value) =>
																setAttributes({ textBackgroundType: value })
															}
															allowedTypes={['normal', 'gradient']}
														/>
														{'gradient' === textBackgroundType && (
															<GradientControl
																value={textGradient}
																onChange={(value) =>
																	setAttributes({ textGradient: value })
																}
																gradients={[]}
															/>
														)}
														{'normal' === textBackgroundType && (
															<ColorControl
																label={__('Color', 'kadence-blocks')}
																value={color ? color : ''}
																groups={colorGroups}
																status={{
																	bound: !!tokenBinding.color?.bound,
																	modified: !!tokenBinding.color?.overridden,
																}}
																onReset={() => resetToken('color')}
																onPick={(alias) => setAttributes({ color: alias })}
																onCustom={(literal) =>
																	setAttributes({ color: literal })
																}
																onClear={() => setAttributes({ color: '' })}
																resolveLiteral={resolveColorLiteral}
															/>
														)}
														<BackgroundTypeControl
															label={__('Background Type', 'kadence-blocks')}
															type={backgroundType ? backgroundType : 'normal'}
															onChange={(value) =>
																setAttributes({ backgroundType: value })
															}
															allowedTypes={['normal', 'gradient']}
														/>
														{'gradient' === backgroundType && (
															<GradientControl
																value={gradient}
																onChange={(value) => setAttributes({ gradient: value })}
																gradients={[]}
															/>
														)}
														{'normal' === backgroundType && (
															<ColorControl
																label={__('Background Color', 'kadence-blocks')}
																value={background ? background : ''}
																groups={colorGroups}
																status={{
																	bound: !!tokenBinding.background?.bound,
																	modified: !!tokenBinding.background?.overridden,
																}}
																onReset={() => resetToken('background')}
																onPick={(alias) => setAttributes({ background: alias })}
																onCustom={(literal) =>
																	setAttributes({ background: literal })
																}
																onClear={() => setAttributes({ background: '' })}
																resolveLiteral={resolveColorLiteral}
															/>
														)}
														<EditorBorderControl
															label={__('Border', 'kadence-blocks')}
															value={borderStyle}
															tabletValue={tabletBorderStyle}
															mobileValue={mobileBorderStyle}
															onChange={(value) => setAttributes({ borderStyle: value })}
															onChangeTablet={(value) =>
																setAttributes({ tabletBorderStyle: value })
															}
															onChangeMobile={(value) =>
																setAttributes({ mobileBorderStyle: value })
															}
															previewDevice={previewDevice}
															onDeviceChange={setPreviewDevice}
															widthTokens={borderWidthPickableTokens}
															defaultValue={borderWidthPresetValue}
															renderColor={renderBorderColor}
															state={tokenBinding.borderStyle}
															onReset={() => resetToken('borderStyle')}
														/>
														<EditorBoxControl
															label={__('Border Radius', 'kadence-blocks')}
															value={borderRadiusForDevice.value}
															onChange={(next) =>
																setAttributes({ [borderRadiusForDevice.attr]: next })
															}
															previewDevice={previewDevice}
															onDeviceChange={setPreviewDevice}
															tokens={borderRadiusTokens}
															defaultValue={inheritedBorderRadius.values}
															inherited={anyCornerInherited(
																inheritedBorderRadius.inherited
															)}
															state={tokenBinding.borderRadius}
															onReset={() => resetToken('borderRadius')}
															isLinked={borderRadiusIsLinked}
															onToggleLink={toggleBorderRadiusLink}
															unit={borderRadiusUnit}
															units={['px', 'em', 'rem', '%']}
															onUnit={(value) =>
																setAttributes({ borderRadiusUnit: value })
															}
															min={0}
															max={borderRadiusIsRelative ? 24 : 500}
															step={borderRadiusIsRelative ? 0.1 : 1}
														/>
														<EditorShadowControl
															defaultValue={shadowPresetValue}
															label={__('Box Shadow', 'kadence-blocks')}
															value={shadow}
															onChange={(value) => setAttributes({ shadow: value })}
															tokens={shadowPickableTokens}
															renderColor={renderShadowColor}
														/>
													</>
												}
											/>
										</KadencePanelBody>
										{context?.['kadence/headerIsTransparent'] == '1' && (
											<KadencePanelBody
												title={__('Button Transparent Styles', 'kadence-blocks')}
												initialOpen={false}
												panelName={'kb-adv-single-btn-styles-transparent'}
											>
												<HoverToggleControl
													hover={
														<>
															<ColorControl
																label={__('Color Hover', 'kadence-blocks')}
																value={
																	colorTransparentHover ? colorTransparentHover : ''
																}
																groups={colorGroups}
																onPick={(alias) =>
																	setAttributes({ colorTransparentHover: alias })
																}
																onCustom={(literal) =>
																	setAttributes({ colorTransparentHover: literal })
																}
																onClear={() =>
																	setAttributes({ colorTransparentHover: '' })
																}
																resolveLiteral={resolveColorLiteral}
															/>
															<BackgroundTypeControl
																label={__('Hover Type', 'kadence-blocks')}
																type={
																	backgroundTransparentHoverType
																		? backgroundTransparentHoverType
																		: 'normal'
																}
																onChange={(value) =>
																	setAttributes({
																		backgroundTransparentHoverType: value,
																	})
																}
																allowedTypes={['normal', 'gradient']}
															/>
															{'gradient' === backgroundTransparentHoverType && (
																<GradientControl
																	value={gradientTransparentHover}
																	onChange={(value) =>
																		setAttributes({ gradientHover: value })
																	}
																	gradients={[]}
																/>
															)}
															{'normal' === backgroundTransparentHoverType && (
																<ColorControl
																	label={__('Background Color', 'kadence-blocks')}
																	value={
																		backgroundTransparentHover
																			? backgroundTransparentHover
																			: ''
																	}
																	groups={colorGroups}
																	onPick={(alias) =>
																		setAttributes({
																			backgroundTransparentHover: alias,
																		})
																	}
																	onCustom={(literal) =>
																		setAttributes({
																			backgroundTransparentHover: literal,
																		})
																	}
																	onClear={() =>
																		setAttributes({
																			backgroundTransparentHover: '',
																		})
																	}
																	resolveLiteral={resolveColorLiteral}
																/>
															)}
															<EditorBorderControl
																label={__('Border', 'kadence-blocks')}
																value={borderTransparentHoverStyle}
																tabletValue={tabletBorderTransparentHoverStyle}
																mobileValue={mobileBorderTransparentHoverStyle}
																onChange={(value) =>
																	setAttributes({
																		borderTransparentHoverStyle: value,
																	})
																}
																onChangeTablet={(value) =>
																	setAttributes({
																		tabletBorderTransparentHoverStyle: value,
																	})
																}
																onChangeMobile={(value) =>
																	setAttributes({
																		mobileBorderTransparentHoverStyle: value,
																	})
																}
																previewDevice={previewDevice}
																onDeviceChange={setPreviewDevice}
																widthTokens={borderWidthPickableTokens}
																defaultValue={borderWidthPresetValue}
																renderColor={renderBorderColor}
																state={borderTransparentHoverBorderBinding}
																onReset={resetBorderTransparentHoverBorder}
															/>
															<EditorBoxControl
																label={__('Border Radius', 'kadence-blocks')}
																value={borderTransparentHoverRadiusForDevice.value}
																onChange={(next) =>
																	setAttributes({
																		[borderTransparentHoverRadiusForDevice.attr]:
																			next,
																	})
																}
																previewDevice={previewDevice}
																onDeviceChange={setPreviewDevice}
																tokens={borderRadiusTokens}
																defaultValue={
																	inheritedBorderTransparentHoverRadius.values
																}
																inherited={anyCornerInherited(
																	inheritedBorderTransparentHoverRadius.inherited
																)}
																state={borderTransparentHoverRadiusBinding}
																onReset={resetBorderTransparentHoverRadius}
																isLinked={borderTransparentHoverRadiusIsLinked}
																onToggleLink={toggleBorderTransparentHoverRadiusLink}
																unit={borderTransparentHoverRadiusUnit}
																units={['px', 'em', 'rem', '%']}
																onUnit={(value) =>
																	setAttributes({
																		borderTransparentHoverRadiusUnit: value,
																	})
																}
																max={borderTransparentHoverRadiusIsRelative ? 24 : 500}
																step={borderTransparentHoverRadiusIsRelative ? 0.1 : 1}
																min={0}
															/>
															<EditorShadowControl
																defaultValue={shadowPresetValue}
																label={__('Box Shadow', 'kadence-blocks')}
																value={shadowTransparentHover}
																onChange={(value) =>
																	setAttributes({ shadowTransparentHover: value })
																}
																tokens={shadowPickableTokens}
																renderColor={renderShadowColor}
															/>
														</>
													}
													normal={
														<>
															<ColorControl
																label={__('Color', 'kadence-blocks')}
																value={colorTransparent ? colorTransparent : ''}
																groups={colorGroups}
																onPick={(alias) =>
																	setAttributes({ colorTransparent: alias })
																}
																onCustom={(literal) =>
																	setAttributes({ colorTransparent: literal })
																}
																onClear={() => setAttributes({ colorTransparent: '' })}
																resolveLiteral={resolveColorLiteral}
															/>
															<BackgroundTypeControl
																label={__('Type', 'kadence-blocks')}
																type={
																	backgroundTransparentType
																		? backgroundTransparentType
																		: 'normal'
																}
																onChange={(value) =>
																	setAttributes({ backgroundTransparentType: value })
																}
																allowedTypes={['normal', 'gradient']}
															/>
															{'gradient' === backgroundTransparentType && (
																<GradientControl
																	value={gradientTransparent}
																	onChange={(value) =>
																		setAttributes({ gradientTransparent: value })
																	}
																	gradients={[]}
																/>
															)}
															{'normal' === backgroundTransparentType && (
																<ColorControl
																	label={__('Background Color', 'kadence-blocks')}
																	value={
																		backgroundTransparent
																			? backgroundTransparent
																			: ''
																	}
																	groups={colorGroups}
																	onPick={(alias) =>
																		setAttributes({ backgroundTransparent: alias })
																	}
																	onCustom={(literal) =>
																		setAttributes({
																			backgroundTransparent: literal,
																		})
																	}
																	onClear={() =>
																		setAttributes({ backgroundTransparent: '' })
																	}
																	resolveLiteral={resolveColorLiteral}
																/>
															)}
															<EditorBorderControl
																label={__('Border', 'kadence-blocks')}
																value={borderTransparentStyle}
																tabletValue={tabletBorderTransparentStyle}
																mobileValue={mobileBorderTransparentStyle}
																onChange={(value) =>
																	setAttributes({ borderTransparentStyle: value })
																}
																onChangeTablet={(value) =>
																	setAttributes({
																		tabletBorderTransparentStyle: value,
																	})
																}
																onChangeMobile={(value) =>
																	setAttributes({
																		mobileBorderTransparentStyle: value,
																	})
																}
																previewDevice={previewDevice}
																onDeviceChange={setPreviewDevice}
																widthTokens={borderWidthPickableTokens}
																defaultValue={borderWidthPresetValue}
																renderColor={renderBorderColor}
																state={borderTransparentBorderBinding}
																onReset={resetBorderTransparentBorder}
															/>
															<EditorBoxControl
																label={__('Border Radius', 'kadence-blocks')}
																value={borderTransparentRadiusForDevice.value}
																onChange={(next) =>
																	setAttributes({
																		[borderTransparentRadiusForDevice.attr]: next,
																	})
																}
																previewDevice={previewDevice}
																onDeviceChange={setPreviewDevice}
																tokens={borderRadiusTokens}
																defaultValue={inheritedBorderTransparentRadius.values}
																inherited={anyCornerInherited(
																	inheritedBorderTransparentRadius.inherited
																)}
																state={borderTransparentRadiusBinding}
																onReset={resetBorderTransparentRadius}
																isLinked={borderTransparentRadiusIsLinked}
																onToggleLink={toggleBorderTransparentRadiusLink}
																unit={borderTransparentRadiusUnit}
																units={['px', 'em', 'rem', '%']}
																onUnit={(value) =>
																	setAttributes({
																		borderTransparentRadiusUnit: value,
																	})
																}
																max={borderTransparentRadiusIsRelative ? 24 : 500}
																step={borderTransparentRadiusIsRelative ? 0.1 : 1}
																min={0}
															/>
															<EditorShadowControl
																defaultValue={shadowPresetValue}
																label={__('Box Shadow', 'kadence-blocks')}
																value={shadowTransparent}
																onChange={(value) =>
																	setAttributes({ shadowTransparent: value })
																}
																tokens={shadowPickableTokens}
																renderColor={renderShadowColor}
															/>
														</>
													}
												/>
											</KadencePanelBody>
										)}
										{context?.['kadence/headerIsSticky'] == '1' && (
											<KadencePanelBody
												title={__('Button Sticky Styles', 'kadence-blocks')}
												initialOpen={false}
												panelName={'kb-adv-single-btn-styles-sticky'}
											>
												<HoverToggleControl
													hover={
														<>
															<ColorControl
																label={__('Color Hover', 'kadence-blocks')}
																value={colorStickyHover ? colorStickyHover : ''}
																groups={colorGroups}
																onPick={(alias) =>
																	setAttributes({ colorStickyHover: alias })
																}
																onCustom={(literal) =>
																	setAttributes({ colorStickyHover: literal })
																}
																onClear={() => setAttributes({ colorStickyHover: '' })}
																resolveLiteral={resolveColorLiteral}
															/>
															<BackgroundTypeControl
																label={__('Hover Type', 'kadence-blocks')}
																type={
																	backgroundStickyHoverType
																		? backgroundStickyHoverType
																		: 'normal'
																}
																onChange={(value) =>
																	setAttributes({
																		backgroundStickyHoverType: value,
																	})
																}
																allowedTypes={['normal', 'gradient']}
															/>
															{'gradient' === backgroundStickyHoverType && (
																<GradientControl
																	value={gradientStickyHover}
																	onChange={(value) =>
																		setAttributes({ gradientHover: value })
																	}
																	gradients={[]}
																/>
															)}
															{'normal' === backgroundStickyHoverType && (
																<ColorControl
																	label={__('Background Color', 'kadence-blocks')}
																	value={
																		backgroundStickyHover
																			? backgroundStickyHover
																			: ''
																	}
																	groups={colorGroups}
																	onPick={(alias) =>
																		setAttributes({
																			backgroundStickyHover: alias,
																		})
																	}
																	onCustom={(literal) =>
																		setAttributes({
																			backgroundStickyHover: literal,
																		})
																	}
																	onClear={() =>
																		setAttributes({ backgroundStickyHover: '' })
																	}
																	resolveLiteral={resolveColorLiteral}
																/>
															)}
															<EditorBorderControl
																label={__('Border', 'kadence-blocks')}
																value={borderStickyHoverStyle}
																tabletValue={tabletBorderStickyHoverStyle}
																mobileValue={mobileBorderStickyHoverStyle}
																onChange={(value) =>
																	setAttributes({
																		borderStickyHoverStyle: value,
																	})
																}
																onChangeTablet={(value) =>
																	setAttributes({
																		tabletBorderStickyHoverStyle: value,
																	})
																}
																onChangeMobile={(value) =>
																	setAttributes({
																		mobileBorderStickyHoverStyle: value,
																	})
																}
																previewDevice={previewDevice}
																onDeviceChange={setPreviewDevice}
																widthTokens={borderWidthPickableTokens}
																defaultValue={borderWidthPresetValue}
																renderColor={renderBorderColor}
																state={borderStickyHoverBorderBinding}
																onReset={resetBorderStickyHoverBorder}
															/>
															<EditorBoxControl
																label={__('Border Radius', 'kadence-blocks')}
																value={borderStickyHoverRadiusForDevice.value}
																onChange={(next) =>
																	setAttributes({
																		[borderStickyHoverRadiusForDevice.attr]: next,
																	})
																}
																previewDevice={previewDevice}
																onDeviceChange={setPreviewDevice}
																tokens={borderRadiusTokens}
																defaultValue={inheritedBorderStickyHoverRadius.values}
																inherited={anyCornerInherited(
																	inheritedBorderStickyHoverRadius.inherited
																)}
																state={borderStickyHoverRadiusBinding}
																onReset={resetBorderStickyHoverRadius}
																isLinked={borderStickyHoverRadiusIsLinked}
																onToggleLink={toggleBorderStickyHoverRadiusLink}
																unit={borderStickyHoverRadiusUnit}
																units={['px', 'em', 'rem', '%']}
																onUnit={(value) =>
																	setAttributes({
																		borderStickyHoverRadiusUnit: value,
																	})
																}
																max={borderStickyHoverRadiusIsRelative ? 24 : 500}
																step={borderStickyHoverRadiusIsRelative ? 0.1 : 1}
																min={0}
															/>
															<EditorShadowControl
																defaultValue={shadowPresetValue}
																label={__('Box Shadow', 'kadence-blocks')}
																value={shadowStickyHover}
																onChange={(value) =>
																	setAttributes({ shadowStickyHover: value })
																}
																tokens={shadowPickableTokens}
																renderColor={renderShadowColor}
															/>
														</>
													}
													normal={
														<>
															<ColorControl
																label={__('Color', 'kadence-blocks')}
																value={colorSticky ? colorSticky : ''}
																groups={colorGroups}
																onPick={(alias) =>
																	setAttributes({ colorSticky: alias })
																}
																onCustom={(literal) =>
																	setAttributes({ colorSticky: literal })
																}
																onClear={() => setAttributes({ colorSticky: '' })}
																resolveLiteral={resolveColorLiteral}
															/>
															<BackgroundTypeControl
																label={__('Type', 'kadence-blocks')}
																type={
																	backgroundStickyType
																		? backgroundStickyType
																		: 'normal'
																}
																onChange={(value) =>
																	setAttributes({ backgroundStickyType: value })
																}
																allowedTypes={['normal', 'gradient']}
															/>
															{'gradient' === backgroundStickyType && (
																<GradientControl
																	value={gradientSticky}
																	onChange={(value) =>
																		setAttributes({ gradientSticky: value })
																	}
																	gradients={[]}
																/>
															)}
															{'normal' === backgroundStickyType && (
																<ColorControl
																	label={__('Background Color', 'kadence-blocks')}
																	value={backgroundSticky ? backgroundSticky : ''}
																	groups={colorGroups}
																	onPick={(alias) =>
																		setAttributes({ backgroundSticky: alias })
																	}
																	onCustom={(literal) =>
																		setAttributes({ backgroundSticky: literal })
																	}
																	onClear={() =>
																		setAttributes({ backgroundSticky: '' })
																	}
																	resolveLiteral={resolveColorLiteral}
																/>
															)}
															<EditorBorderControl
																label={__('Border', 'kadence-blocks')}
																value={borderStickyStyle}
																tabletValue={tabletBorderStickyStyle}
																mobileValue={mobileBorderStickyStyle}
																onChange={(value) =>
																	setAttributes({ borderStickyStyle: value })
																}
																onChangeTablet={(value) =>
																	setAttributes({
																		tabletBorderStickyStyle: value,
																	})
																}
																onChangeMobile={(value) =>
																	setAttributes({
																		mobileBorderStickyStyle: value,
																	})
																}
																previewDevice={previewDevice}
																onDeviceChange={setPreviewDevice}
																widthTokens={borderWidthPickableTokens}
																defaultValue={borderWidthPresetValue}
																renderColor={renderBorderColor}
																state={borderStickyBorderBinding}
																onReset={resetBorderStickyBorder}
															/>
															<EditorBoxControl
																label={__('Border Radius', 'kadence-blocks')}
																value={borderStickyRadiusForDevice.value}
																onChange={(next) =>
																	setAttributes({
																		[borderStickyRadiusForDevice.attr]: next,
																	})
																}
																previewDevice={previewDevice}
																onDeviceChange={setPreviewDevice}
																tokens={borderRadiusTokens}
																defaultValue={inheritedBorderStickyRadius.values}
																inherited={anyCornerInherited(
																	inheritedBorderStickyRadius.inherited
																)}
																state={borderStickyRadiusBinding}
																onReset={resetBorderStickyRadius}
																isLinked={borderStickyRadiusIsLinked}
																onToggleLink={toggleBorderStickyRadiusLink}
																unit={borderStickyRadiusUnit}
																units={['px', 'em', 'rem', '%']}
																onUnit={(value) =>
																	setAttributes({
																		borderStickyRadiusUnit: value,
																	})
																}
																max={borderStickyRadiusIsRelative ? 24 : 500}
																step={borderStickyRadiusIsRelative ? 0.1 : 1}
																min={0}
															/>
															<EditorShadowControl
																defaultValue={shadowPresetValue}
																label={__('Box Shadow', 'kadence-blocks')}
																value={shadowSticky}
																onChange={(value) =>
																	setAttributes({ shadowSticky: value })
																}
																tokens={shadowPickableTokens}
																renderColor={renderShadowColor}
															/>
														</>
													}
												/>
											</KadencePanelBody>
										)}
									</>
								)}
								{showSettings('iconSettings', 'kadence/advancedbtn') && (
									<KadencePanelBody
										title={__('Icon Settings', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-adv-single-btn-icons'}
									>
										<div className="kt-select-icon-container">
											<KadenceIconPicker
												value={icon}
												onChange={(value) => {
													setAttributes({ icon: value });
												}}
												allowClear={true}
											/>
										</div>
										<SmallResponsiveControl
											label={__('Icon and Text Display', 'kadence-blocks')}
											desktopChildren={
												<SelectControl
													value={
														undefined !== onlyIcon?.[0] && onlyIcon[0] ? 'true' : 'false'
													}
													options={[
														{
															value: 'false',
															label: __('Show Icon and Text', 'kadence-blocks'),
														},
														{
															value: 'true',
															label: __('Show Only Icon', 'kadence-blocks'),
														},
													]}
													onChange={(value) => {
														setAttributes({
															onlyIcon: [
																value === 'true' ? true : false,
																undefined !== onlyIcon?.[1] ? onlyIcon[1] : '',
																undefined !== onlyIcon?.[2] ? onlyIcon[2] : '',
															],
														});
													}}
												/>
											}
											tabletChildren={
												<SelectControl
													value={
														undefined !== onlyText?.[0] && onlyText[0]
															? 'text'
															: undefined !== onlyIcon?.[1] && onlyIcon[1]
																? 'true'
																: undefined !== onlyIcon?.[1] && false === onlyIcon[1]
																	? 'false'
																	: ''
													}
													options={[
														{ value: '', label: __('Inherit', 'kadence-blocks') },
														{
															value: 'false',
															label: __('Show Icon and Text', 'kadence-blocks'),
														},
														{
															value: 'true',
															label: __('Show Only Icon', 'kadence-blocks'),
														},
														{
															value: 'text',
															label: __('Show Only Text', 'kadence-blocks'),
														},
													]}
													onChange={(value) => {
														if ('text' !== value) {
															let newValue = value;
															if (value === 'true') {
																newValue = true;
															} else if (value === 'false') {
																newValue = false;
															}
															setAttributes({
																onlyIcon: [
																	undefined !== onlyIcon?.[0] ? onlyIcon[0] : '',
																	newValue,
																	undefined !== onlyIcon?.[2] ? onlyIcon[2] : '',
																],
																onlyText: [
																	undefined !== onlyText?.[0] ? false : '',
																	undefined !== onlyText?.[1] ? onlyText[1] : '',
																],
															});
														} else {
															setAttributes({
																onlyText: [
																	undefined !== onlyText?.[0] ? true : '',
																	undefined !== onlyText?.[1] ? onlyText[1] : '',
																],
																onlyIcon: [
																	undefined !== onlyIcon?.[0] ? onlyIcon[0] : '',
																	false,
																	undefined !== onlyIcon?.[2] ? onlyIcon[2] : '',
																],
															});
														}
													}}
												/>
											}
											mobileChildren={
												<SelectControl
													value={
														undefined !== onlyText?.[1] && onlyText[1]
															? 'text'
															: undefined !== onlyIcon?.[2] && onlyIcon[2]
																? 'true'
																: undefined !== onlyIcon?.[2] && false === onlyIcon[2]
																	? 'false'
																	: ''
													}
													options={[
														{ value: '', label: __('Inherit', 'kadence-blocks') },
														{
															value: 'false',
															label: __('Show Icon and Text', 'kadence-blocks'),
														},
														{
															value: 'true',
															label: __('Show Only Icon', 'kadence-blocks'),
														},
														{
															value: 'text',
															label: __('Show Only Text', 'kadence-blocks'),
														},
													]}
													onChange={(value) => {
														if ('text' !== value) {
															let newValue = value;
															if (value === 'true') {
																newValue = true;
															} else if (value === 'false') {
																newValue = false;
															}
															setAttributes({
																onlyIcon: [
																	undefined !== onlyIcon?.[0] ? onlyIcon[0] : '',
																	undefined !== onlyIcon?.[1] ? onlyIcon[1] : '',
																	newValue,
																],
																onlyText: [
																	undefined !== onlyText?.[0] ? onlyText?.[0] : '',
																	undefined !== onlyText?.[1] ? false : '',
																],
															});
														} else {
															setAttributes({
																onlyText: [
																	undefined !== onlyText?.[0] ? onlyText?.[0] : '',
																	undefined !== onlyText?.[1] ? true : '',
																],
																onlyIcon: [
																	undefined !== onlyIcon?.[0] ? onlyIcon[0] : '',
																	undefined !== onlyIcon?.[1] ? onlyIcon[1] : '',
																	false,
																],
															});
														}
													}}
												/>
											}
										/>
										<SelectControl
											label={__('Icon Location', 'kadence-blocks')}
											value={iconSide}
											options={[
												{ value: 'right', label: __('Right', 'kadence-blocks') },
												{ value: 'left', label: __('Left', 'kadence-blocks') },
											]}
											onChange={(value) => {
												setAttributes({ iconSide: value });
											}}
										/>
										<ResponsiveRangeControls
											label={__('Icon Size', 'kadence-blocks')}
											value={undefined !== iconSize?.[0] ? iconSize[0] : ''}
											onChange={(value) => {
												setAttributes({
													iconSize: [
														value,
														undefined !== iconSize[1] ? iconSize[1] : '',
														undefined !== iconSize?.[2] && iconSize[2] ? iconSize[2] : '',
													],
												});
											}}
											tabletValue={undefined !== iconSize?.[1] ? iconSize[1] : ''}
											onChangeTablet={(value) => {
												setAttributes({
													iconSize: [
														undefined !== iconSize?.[0] ? iconSize[0] : '',
														value,
														undefined !== iconSize?.[2] ? iconSize[2] : '',
													],
												});
											}}
											mobileValue={undefined !== iconSize?.[2] ? iconSize[2] : ''}
											onChangeMobile={(value) => {
												setAttributes({
													iconSize: [
														undefined !== iconSize?.[0] ? iconSize[0] : '',
														undefined !== iconSize?.[1] ? iconSize[1] : '',
														value,
													],
												});
											}}
											min={0}
											max={(iconSizeUnit ? iconSizeUnit : 'px') !== 'px' ? 12 : 200}
											step={(iconSizeUnit ? iconSizeUnit : 'px') !== 'px' ? 0.1 : 1}
											unit={iconSizeUnit ? iconSizeUnit : 'px'}
											onUnit={(value) => {
												setAttributes({ iconSizeUnit: value });
											}}
											units={['px', 'em', 'rem']}
										/>
										<ColorControlGroup>
											<ColorControl
												label={__('Icon Color', 'kadence-blocks')}
												value={iconColor ? iconColor : ''}
												groups={colorGroups}
												onPick={(alias) => setAttributes({ iconColor: alias })}
												onCustom={(literal) => setAttributes({ iconColor: literal })}
												onClear={() => setAttributes({ iconColor: '' })}
												resolveLiteral={resolveColorLiteral}
											/>
											<ColorControl
												label={__('Hover Color', 'kadence-blocks')}
												value={iconColorHover ? iconColorHover : ''}
												groups={colorGroups}
												onPick={(alias) => setAttributes({ iconColorHover: alias })}
												onCustom={(literal) => setAttributes({ iconColorHover: literal })}
												onClear={() => setAttributes({ iconColorHover: '' })}
												resolveLiteral={resolveColorLiteral}
											/>
										</ColorControlGroup>
										<ResponsiveMeasureRangeControl
											label={__('Icon Padding', 'kadence-blocks')}
											value={undefined !== iconPadding ? iconPadding : ['', '', '', '']}
											tabletValue={
												undefined !== tabletIconPadding ? tabletIconPadding : ['', '', '', '']
											}
											mobileValue={
												undefined !== mobileIconPadding ? mobileIconPadding : ['', '', '', '']
											}
											onChange={(value) => setAttributes({ iconPadding: value })}
											onChangeTablet={(value) => setAttributes({ tabletIconPadding: value })}
											onChangeMobile={(value) => setAttributes({ mobileIconPadding: value })}
											min={iconPaddingUnit === 'em' || iconPaddingUnit === 'rem' ? -2 : -999}
											max={iconPaddingUnit === 'em' || iconPaddingUnit === 'rem' ? 12 : 999}
											step={iconPaddingUnit === 'em' || iconPaddingUnit === 'rem' ? 0.1 : 1}
											unit={iconPaddingUnit}
											units={['px', 'em', 'rem']}
											onUnit={(value) => setAttributes({ iconPaddingUnit: value })}
										/>
										<TextControl
											label={__('Title for screen readers', 'kadence-blocks')}
											help={__(
												'If no title added screen readers will ignore, good if the icon is purely decorative.',
												'kadence-blocks'
											)}
											value={iconTitle}
											onChange={(value) => {
												setAttributes({ iconTitle: value });
											}}
										/>
										<ToggleControl
											label={__('Icon Reveal on Hover', 'kadence-blocks')}
											checked={iconReveal}
											onChange={(value) => setAttributes({ iconReveal: value })}
										/>
									</KadencePanelBody>
								)}
								{showSettings('fontSettings', 'kadence/advancedbtn') && (
									<KadencePanelBody
										title={__('Typography Settings', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-adv-btn-font-family'}
									>
										<TypographyControls
											fontGroup={'button'}
											fontSize={typography[0].size}
											onFontSize={(value) => saveTypography({ size: value })}
											fontSizeType={typography[0].sizeType}
											onFontSizeType={(value) => saveTypography({ sizeType: value })}
											lineHeight={typography[0].lineHeight}
											onLineHeight={(value) => saveTypography({ lineHeight: value })}
											lineHeightType={typography[0].lineType}
											onLineHeightType={(value) => saveTypography({ lineType: value })}
											reLetterSpacing={typography[0].letterSpacing}
											onLetterSpacing={(value) => saveTypography({ letterSpacing: value })}
											letterSpacingType={typography[0].letterType}
											onLetterSpacingType={(value) => saveTypography({ letterType: value })}
											textTransform={typography[0].textTransform}
											onTextTransform={(value) => saveTypography({ textTransform: value })}
											fontFamily={typography[0].family}
											onFontFamily={(value) => saveTypography({ family: value })}
											context={{ blockName: 'kadence/singlebtn' }}
											onFontChange={(select) => {
												saveTypography({
													family: select.value,
													google: select.google,
												});
											}}
											onFontArrayChange={(values) => saveTypography(values)}
											googleFont={typography[0].google}
											onGoogleFont={(value) => saveTypography({ google: value })}
											loadGoogleFont={typography[0].loadGoogle}
											onLoadGoogleFont={(value) => saveTypography({ loadGoogle: value })}
											fontVariant={typography[0].variant}
											onFontVariant={(value) => saveTypography({ variant: value })}
											fontWeight={typography[0].weight}
											onFontWeight={(value) => saveTypography({ weight: value })}
											fontStyle={typography[0].style}
											onFontStyle={(value) => saveTypography({ style: value })}
											fontSubset={typography[0].subset}
											onFontSubset={(value) => saveTypography({ subset: value })}
										/>
										<SelectControl
											label={__('Text Underline', 'kadence-blocks')}
											value={textUnderline}
											options={[
												{ value: '', label: __('Unset', 'kadence-blocks') },
												{ value: 'none', label: __('None', 'kadence-blocks') },
												{ value: 'underline', label: __('Underline', 'kadence-blocks') },
											]}
											onChange={(value) => setAttributes({ textUnderline: value })}
										/>
									</KadencePanelBody>
								)}
							</>
						)}

						{activeTab === 'advanced' && (
							<>
								{showSettings('marginSettings', 'kadence/advancedbtn') && (
									<>
										<KadencePanelBody panelName={'kb-single-button-margin-settings'}>
											<EditorBoxControl
												label={__('Padding', 'kadence-blocks')}
												value={paddingForDevice.value}
												onChange={(next) => setAttributes({ [paddingForDevice.attr]: next })}
												previewDevice={previewDevice}
												onDeviceChange={setPreviewDevice}
												tokens={paddingPickableTokens}
												defaultValue={inheritedPadding.values}
												inherited={anyCornerInherited(inheritedPadding.inherited)}
												state={tokenBinding.padding}
												onReset={() => resetToken('padding')}
												isLinked={paddingIsLinked}
												onToggleLink={togglePaddingLink}
												role="sides"
												unit={paddingUnit}
												units={['px', 'em', 'rem']}
												onUnit={(value) => setAttributes({ paddingUnit: value })}
												min={paddingUnit === 'em' || paddingUnit === 'rem' ? -25 : -999}
												max={paddingUnit === 'em' || paddingUnit === 'rem' ? 25 : 999}
												step={paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1}
											/>
											<EditorBoxControl
												label={__('Margin', 'kadence-blocks')}
												value={marginForDevice.value}
												onChange={(next) => setAttributes({ [marginForDevice.attr]: next })}
												previewDevice={previewDevice}
												onDeviceChange={setPreviewDevice}
												tokens={marginPickableTokens}
												defaultValue={inheritedMargin.values}
												inherited={anyCornerInherited(inheritedMargin.inherited)}
												state={tokenBinding.margin}
												onReset={() => resetToken('margin')}
												isLinked={marginIsLinked}
												onToggleLink={toggleMarginLink}
												role="sides"
												unit={marginUnit}
												units={['px', 'em', 'rem']}
												onUnit={(value) => setAttributes({ marginUnit: value })}
												min={marginUnit === 'em' || marginUnit === 'rem' ? -25 : -999}
												max={marginUnit === 'em' || marginUnit === 'rem' ? 25 : 999}
												step={marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1}
											/>
											<TextControl
												label={__('Add Aria Label', 'kadence-blocks')}
												value={label ? label : ''}
												onChange={(value) => setAttributes({ label: value })}
												className={'kb-textbox-style'}
											/>
											<ToggleControl
												label={__('Button Role', 'kadence-blocks')}
												help={__(
													'If the button is used to trigger something in javascript enable this to apply the button role.',
													'kadence-blocks'
												)}
												checked={buttonRole}
												onChange={(value) => setAttributes({ buttonRole: value })}
											/>
										</KadencePanelBody>

										<div className="kt-sidebar-settings-spacer"></div>
									</>
								)}

								<KadenceBlockDefaults
									attributes={attributes}
									defaultAttributes={metadata.attributes}
									blockSlug={metadata.name}
									excludedAttrs={nonTransAttrs}
								/>
							</>
						)}
					</InspectorControls>

					<DynamicInlineReplaceControl dynamicAttribute={'text'} {...props} />
				</>
			)}
			<div
				id={`animate-id${uniqueID}`}
				className={'btn-inner-wrap aos-animate kt-animation-wrap'}
				data-aos={kadenceAnimation ? kadenceAnimation : undefined}
				data-aos-duration={
					kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].duration
						? kadenceAOSOptions[0].duration
						: undefined
				}
				data-aos-easing={
					kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].easing
						? kadenceAOSOptions[0].easing
						: undefined
				}
			>
				<Tooltip text={tooltip} placement={tooltipPlacement || 'top'}>
					<span
						className={btnClassName}
						style={{
							'--kb-button-icon-size': previewIconSize
								? getFontSizeOptionOutput(
										previewIconSize,
										undefined !== iconSizeUnit ? iconSizeUnit : 'px'
									)
								: undefined,
						}}
					>
						{icon && 'left' === iconSide && (
							<IconRender
								className={`kt-btn-svg-icon kt-btn-svg-icon-${icon} kt-btn-side-${iconSide}`}
								name={icon}
								size={'1em'}
								style={{
									fontSize: previewIconSize
										? getFontSizeOptionOutput(
												previewIconSize,
												undefined !== iconSizeUnit ? iconSizeUnit : 'px'
											)
										: undefined,
									paddingTop: previewIconPaddingTop,
									paddingBottom: previewIconPaddingBottom,
									paddingLeft: previewIconPaddingLeft,
									paddingRight: previewIconPaddingRight,
								}}
							/>
						)}
						{!isDynamicReplaced && (
							<RichText
								tagName="div"
								placeholder={__('Button…', 'kadence-blocks')}
								value={text}
								onChange={(value) => setAttributes({ text: value })}
								allowedFormats={applyFilters(
									'kadence.whitelist_richtext_formats',
									richTextFormats,
									'kadence/advancedbtn'
								)}
								className={'kt-button-text'}
								keepPlaceholderOnFocus
							/>
						)}
						{isDynamicReplaced && (
							<>
								{applyFilters(
									'kadence.dynamicContent',
									<Spinner />,
									attributes,
									'text',
									setAttributes,
									context
								)}
							</>
						)}
						{icon && 'left' !== iconSide && (
							<IconRender
								className={`kt-btn-svg-icon kt-btn-svg-icon-${icon} kt-btn-side-${iconSide}`}
								name={icon}
								size={'1em'}
								style={{
									fontSize: previewIconSize
										? getFontSizeOptionOutput(
												previewIconSize,
												undefined !== iconSizeUnit ? iconSizeUnit : 'px'
											)
										: undefined,
									paddingTop: previewIconPaddingTop,
									paddingBottom: previewIconPaddingBottom,
									paddingLeft: previewIconPaddingLeft,
									paddingRight: previewIconPaddingRight,
								}}
							/>
						)}
						<SpacingVisualizer
							type="inside"
							spacing={[
								getSpacingOptionOutput(previewPaddingTop, previewPaddingUnit),
								getSpacingOptionOutput(previewPaddingRight, previewPaddingUnit),
								getSpacingOptionOutput(previewPaddingBottom, previewPaddingUnit),
								getSpacingOptionOutput(previewPaddingLeft, previewPaddingUnit),
							]}
						/>
					</span>
				</Tooltip>
				<SpacingVisualizer
					type="inside"
					spacing={[
						getSpacingOptionOutput(previewMarginTop, previewMarginUnit),
						getSpacingOptionOutput(previewMarginRight, previewMarginUnit),
						getSpacingOptionOutput(previewMarginBottom, previewMarginUnit),
						getSpacingOptionOutput(previewMarginLeft, previewMarginUnit),
					]}
				/>
				{typography?.[0]?.google && (
					<KadenceWebfontLoader typography={typography} clientId={clientId} id={'typography'} />
				)}
			</div>
		</div>
	);
}
