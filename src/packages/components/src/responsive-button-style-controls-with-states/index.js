import {
	HoverToggleControl,
	ResponsivePopColorControl,
	ResponsiveBorderControl,
	ResponsiveMeasurementControls,
	BoxShadowControl,
	BackgroundTypeControl,
	GradientControl,
} from '../';
import { __ } from '@wordpress/i18n';

//a group of color controls for displaying background and/or color controls with hover and active states
export default function ResponsiveButtonStyleControlsWithStates({
	colorBase = 'color',
	colorLabel = __('Color', 'kadence-blocks-pro'),
	backgroundBase = '',
	backgroundLabel = __('Background', 'kadence-blocks-pro'),
	backgroundTypeBase = '',
	backgroundTypeLabel = __('Type', 'kadence-blocks-pro'),
	backgroundGradientBase = '',
	backgroundGradientLabel = __('Gradient', 'kadence-blocks-pro'),
	borderBase = '',
	borderLabel = __('Border', 'kadence-blocks-pro'),
	borderRadiusBase = '',
	borderRadiusUnitBase = '',
	borderRadiusLabel = __('Border Radius', 'kadence-blocks-pro'),
	shadowBase = '',
	shadowLabel = __('Box Shadow', 'kadence-blocks-pro'),
	includeActive = true,
	setAttributes,
	setMetaAttribute,
	attributes,
	setActivePreview,
	activePreview,
}) {
	const colorValue = attributes[colorBase];
	const colorValueTablet = attributes[colorBase + 'Tablet'];
	const colorValueMobile = attributes[colorBase + 'Mobile'];
	const colorValueHover = attributes[colorBase + 'Hover'];
	const colorValueHoverTablet = attributes[colorBase + 'HoverTablet'];
	const colorValueHoverMobile = attributes[colorBase + 'HoverMobile'];
	const colorValueActive = attributes[colorBase + 'Active'];
	const colorValueActiveTablet = attributes[colorBase + 'ActiveTablet'];
	const colorValueActiveMobile = attributes[colorBase + 'ActiveMobile'];
	const backgroundTypeValue = attributes[backgroundTypeBase];
	const backgroundTypeValueHover = attributes[backgroundTypeBase + 'Hover'];
	const backgroundTypeValueActive = attributes[backgroundTypeBase + 'Active'];
	const backgroundGradientValue = attributes[backgroundGradientBase];
	const backgroundGradientValueHover = attributes[backgroundGradientBase + 'Hover'];
	const backgroundGradientValueActive = attributes[backgroundGradientBase + 'Active'];
	const backgroundValue = attributes[backgroundBase];
	const backgroundValueTablet = attributes[backgroundBase + 'Tablet'];
	const backgroundValueMobile = attributes[backgroundBase + 'Mobile'];
	const backgroundValueHover = attributes[backgroundBase + 'Hover'];
	const backgroundValueHoverTablet = attributes[backgroundBase + 'HoverTablet'];
	const backgroundValueHoverMobile = attributes[backgroundBase + 'HoverMobile'];
	const backgroundValueActive = attributes[backgroundBase + 'Active'];
	const backgroundValueActiveTablet = attributes[backgroundBase + 'ActiveTablet'];
	const backgroundValueActiveMobile = attributes[backgroundBase + 'ActiveMobile'];
	const borderValue = attributes[borderBase];
	const borderValueTablet = attributes[borderBase + 'Tablet'];
	const borderValueMobile = attributes[borderBase + 'Mobile'];
	const borderValueHover = attributes[borderBase + 'Hover'];
	const borderValueHoverTablet = attributes[borderBase + 'HoverTablet'];
	const borderValueHoverMobile = attributes[borderBase + 'HoverMobile'];
	const borderValueActive = attributes[borderBase + 'Active'];
	const borderValueActiveTablet = attributes[borderBase + 'ActiveTablet'];
	const borderValueActiveMobile = attributes[borderBase + 'ActiveMobile'];
	const borderRadiusValue = attributes[borderRadiusBase];
	const borderRadiusValueTablet = attributes[borderRadiusBase + 'Tablet'];
	const borderRadiusValueMobile = attributes[borderRadiusBase + 'Mobile'];
	const borderRadiusValueHover = attributes[borderRadiusBase + 'Hover'];
	const borderRadiusValueHoverTablet = attributes[borderRadiusBase + 'HoverTablet'];
	const borderRadiusValueHoverMobile = attributes[borderRadiusBase + 'HoverMobile'];
	const borderRadiusValueActive = attributes[borderRadiusBase + 'Active'];
	const borderRadiusValueActiveTablet = attributes[borderRadiusBase + 'ActiveTablet'];
	const borderRadiusValueActiveMobile = attributes[borderRadiusBase + 'ActiveMobile'];
	const borderRadiusUnitValue = attributes[borderRadiusUnitBase];
	const borderRadiusUnitValueHover = attributes[borderRadiusUnitBase + 'Hover'];
	const borderRadiusUnitValueActive = attributes[borderRadiusUnitBase + 'Active'];
	const shadowValue = attributes[shadowBase];
	const shadowValueHover = attributes[shadowBase + 'Hover'];
	const shadowValueActive = attributes[shadowBase + 'Active'];

	const saveFunction = (attributeName, value) => {
		if (setMetaAttribute) {
			setMetaAttribute(value, attributeName);
		} else {
			setAttributes({ [attributeName]: value });
		}
	};

	const saveObjectAttribute = (value, attributeName, attributes) => {
		const newUpdate = attributes[attributeName].map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		saveFunction(attributeName, newUpdate);
	};

	const normalComponents = (
		<>
			<ResponsivePopColorControl
				label={colorLabel}
				value={colorValue}
				tabletValue={colorValueTablet}
				mobileValue={colorValueMobile}
				default={''}
				onChange={(value) => saveFunction(colorBase, value)}
				onChangeTablet={(value) => saveFunction(colorBase + 'Tablet', value)}
				onChangeMobile={(value) => saveFunction(colorBase + 'Mobile', value)}
				key={'normal'}
			/>

			{backgroundBase && backgroundTypeBase && backgroundGradientBase && (
				<>
					<BackgroundTypeControl
						label={backgroundTypeLabel}
						type={backgroundTypeValue ? backgroundTypeValue : 'normal'}
						onChange={(value) => saveFunction(backgroundTypeBase, value)}
						allowedTypes={['normal', 'gradient']}
					/>
					{'gradient' === backgroundTypeValue && (
						<GradientControl
							value={backgroundGradientValue}
							onChange={(value) => saveFunction(backgroundGradientBase, value)}
							gradients={[]}
						/>
					)}
					{'normal' === backgroundTypeValue && (
						<ResponsivePopColorControl
							label={backgroundLabel}
							value={backgroundValue}
							tabletValue={backgroundValueTablet}
							mobileValue={backgroundValueMobile}
							default={''}
							onChange={(value) => saveFunction(backgroundBase, value)}
							onChangeTablet={(value) => saveFunction(backgroundBase + 'Tablet', value)}
							onChangeMobile={(value) => saveFunction(backgroundBase + 'Mobile', value)}
							key={'normalb'}
						/>
					)}
				</>
			)}
			{backgroundBase && !backgroundTypeBase && (
				<ResponsivePopColorControl
					label={backgroundLabel}
					value={backgroundValue}
					tabletValue={backgroundValueTablet}
					mobileValue={backgroundValueMobile}
					default={''}
					onChange={(value) => saveFunction(backgroundBase, value)}
					onChangeTablet={(value) => saveFunction(backgroundBase + 'Tablet', value)}
					onChangeMobile={(value) => saveFunction(backgroundBase + 'Mobile', value)}
					key={'normalb'}
				/>
			)}

			{borderBase && (
				<ResponsiveBorderControl
					key={'normalborderbase'}
					label={borderLabel}
					value={borderValue}
					tabletValue={borderValueTablet}
					mobileValue={borderValueMobile}
					onChange={(value) => saveFunction(borderBase, value)}
					onChangeTablet={(value) => saveFunction(borderBase + 'Tablet', value)}
					onChangeMobile={(value) => saveFunction(borderBase + 'Mobile', value)}
				/>
			)}
			{borderRadiusBase && (
				<ResponsiveMeasurementControls
					key={'normalborderradiusbase'}
					label={borderRadiusLabel}
					value={borderRadiusValue}
					tabletValue={borderRadiusValueTablet}
					mobileValue={borderRadiusValueMobile}
					onChange={(value) => saveFunction(borderRadiusBase, value.map(String))}
					onChangeTablet={(value) => saveFunction(borderRadiusBase + 'Tablet', value.map(String))}
					onChangeMobile={(value) => saveFunction(borderRadiusBase + 'Mobile', value.map(String))}
					min={0}
					max={borderRadiusUnitValue === 'em' || borderRadiusUnitValue === 'rem' ? 24 : 100}
					step={borderRadiusUnitValue === 'em' || borderRadiusUnitValue === 'rem' ? 0.1 : 1}
					unit={borderRadiusUnitValue}
					units={['px', 'em', 'rem', '%']}
					onUnit={(value) => saveFunction(borderRadiusUnitBase, value)}
					isBorderRadius={true}
					allowEmpty={true}
				/>
			)}
			{shadowBase && (
				<BoxShadowControl
					label={shadowLabel}
					enable={
						undefined !== shadowValue && undefined !== shadowValue[0] && undefined !== shadowValue[0].enable
							? shadowValue[0].enable
							: true
					}
					color={
						undefined !== shadowValue && undefined !== shadowValue[0] && undefined !== shadowValue[0].color
							? shadowValue[0].color
							: '#000000'
					}
					colorDefault={'#000000'}
					onArrayChange={(color, opacity) => {
						saveObjectAttribute({ color, opacity }, shadowBase, attributes);
					}}
					opacity={
						undefined !== shadowValue &&
						undefined !== shadowValue[0] &&
						undefined !== shadowValue[0].opacity
							? shadowValue[0].opacity
							: 0.2
					}
					hOffset={
						undefined !== shadowValue &&
						undefined !== shadowValue[0] &&
						undefined !== shadowValue[0].hOffset
							? shadowValue[0].hOffset
							: 0
					}
					vOffset={
						undefined !== shadowValue &&
						undefined !== shadowValue[0] &&
						undefined !== shadowValue[0].vOffset
							? shadowValue[0].vOffset
							: 0
					}
					blur={
						undefined !== shadowValue && undefined !== shadowValue[0] && undefined !== shadowValue[0].blur
							? shadowValue[0].blur
							: 14
					}
					spread={
						undefined !== shadowValue && undefined !== shadowValue[0] && undefined !== shadowValue[0].spread
							? shadowValue[0].spread
							: 0
					}
					inset={
						undefined !== shadowValue && undefined !== shadowValue[0] && undefined !== shadowValue[0].inset
							? shadowValue[0].inset
							: false
					}
					onEnableChange={(value) => {
						saveObjectAttribute({ enable: value }, shadowBase, attributes);
					}}
					onColorChange={(value) => {
						saveObjectAttribute({ color: value }, shadowBase, attributes);
					}}
					onOpacityChange={(value) => {
						saveObjectAttribute({ opacity: value }, shadowBase, attributes);
					}}
					onHOffsetChange={(value) => {
						saveObjectAttribute({ hOffset: value }, shadowBase, attributes);
					}}
					onVOffsetChange={(value) => {
						saveObjectAttribute({ vOffset: value }, shadowBase, attributes);
					}}
					onBlurChange={(value) => {
						saveObjectAttribute({ blur: value }, shadowBase, attributes);
					}}
					onSpreadChange={(value) => {
						saveObjectAttribute({ spread: value }, shadowBase, attributes);
					}}
					onInsetChange={(value) => {
						saveObjectAttribute({ inset: value }, shadowBase, attributes);
					}}
				/>
			)}
		</>
	);

	const hoverComponents = (
		<>
			<ResponsivePopColorControl
				label={colorLabel}
				value={colorValueHover}
				tabletValue={colorValueHoverTablet}
				mobileValue={colorValueHoverMobile}
				default={''}
				onChange={(value) => saveFunction(colorBase + 'Hover', value)}
				onChangeTablet={(value) => saveFunction(colorBase + 'HoverTablet', value)}
				onChangeMobile={(value) => saveFunction(colorBase + 'HoverMobile', value)}
				key={'hover'}
			/>

			{backgroundBase && backgroundTypeBase && backgroundGradientBase && (
				<>
					<BackgroundTypeControl
						label={backgroundTypeLabel}
						type={backgroundTypeValueHover ? backgroundTypeValueHover : 'normal'}
						onChange={(value) => saveFunction(backgroundTypeBase + 'Hover', value)}
						allowedTypes={['normal', 'gradient']}
					/>
					{'gradient' === backgroundTypeValueHover && (
						<GradientControl
							value={backgroundGradientValueHover}
							onChange={(value) => saveFunction(backgroundGradientBase + 'Hover', value)}
							gradients={[]}
						/>
					)}
					{'normal' === backgroundTypeValueHover && (
						<ResponsivePopColorControl
							label={backgroundLabel}
							value={backgroundValueHover}
							tabletValue={backgroundValueHoverTablet}
							mobileValue={backgroundValueHoverMobile}
							default={''}
							onChange={(value) => saveFunction(backgroundBase + 'Hover', value)}
							onChangeTablet={(value) => saveFunction(backgroundBase + 'HoverTablet', value)}
							onChangeMobile={(value) => saveFunction(backgroundBase + 'HoverMobile', value)}
							key={'hoverb'}
						/>
					)}
				</>
			)}
			{backgroundBase && !backgroundTypeBase && (
				<ResponsivePopColorControl
					label={backgroundLabel}
					value={backgroundValueHover}
					tabletValue={backgroundValueHoverTablet}
					mobileValue={backgroundValueHoverMobile}
					default={''}
					onChange={(value) => saveFunction(backgroundBase + 'Hover', value)}
					onChangeTablet={(value) => saveFunction(backgroundBase + 'HoverTablet', value)}
					onChangeMobile={(value) => saveFunction(backgroundBase + 'HoverMobile', value)}
					key={'hoverb'}
				/>
			)}
			{borderBase && (
				<ResponsiveBorderControl
					key={'hoverborderbase'}
					label={borderLabel}
					value={borderValueHover}
					tabletValue={borderValueHoverTablet}
					mobileValue={borderValueHoverMobile}
					onChange={(value) => saveFunction(borderBase + 'Hover', value)}
					onChangeTablet={(value) => saveFunction(borderBase + 'HoverTablet', value)}
					onChangeMobile={(value) => saveFunction(borderBase + 'HoverMobile', value)}
				/>
			)}
			{borderRadiusBase && (
				<ResponsiveMeasurementControls
					key={'hoverborderradiusbase'}
					label={borderRadiusLabel}
					value={borderRadiusValueHover}
					tabletValue={borderRadiusValueHoverTablet}
					mobileValue={borderRadiusValueHoverMobile}
					onChange={(value) => saveFunction(borderRadiusBase + 'Hover', value.map(String))}
					onChangeTablet={(value) => saveFunction(borderRadiusBase + 'HoverTablet', value.map(String))}
					onChangeMobile={(value) => saveFunction(borderRadiusBase + 'HoverMobile', value.map(String))}
					min={0}
					max={borderRadiusUnitValueHover === 'em' || borderRadiusUnitValueHover === 'rem' ? 24 : 100}
					step={borderRadiusUnitValueHover === 'em' || borderRadiusUnitValueHover === 'rem' ? 0.1 : 1}
					unit={borderRadiusUnitValueHover}
					units={['px', 'em', 'rem', '%']}
					onUnit={(value) => saveFunction(borderRadiusUnitBase + 'Hover', value)}
					isBorderRadius={true}
					allowEmpty={true}
				/>
			)}
			{shadowBase && (
				<BoxShadowControl
					label={shadowLabel}
					enable={
						undefined !== shadowValueHover &&
						undefined !== shadowValueHover[0] &&
						undefined !== shadowValueHover[0].enable
							? shadowValueHover[0].enable
							: true
					}
					color={
						undefined !== shadowValueHover &&
						undefined !== shadowValueHover[0] &&
						undefined !== shadowValueHover[0].color
							? shadowValueHover[0].color
							: '#000000'
					}
					colorDefault={'#000000'}
					onArrayChange={(color, opacity) => {
						saveObjectAttribute({ color, opacity }, shadowBase + 'Hover', attributes);
					}}
					opacity={
						undefined !== shadowValueHover &&
						undefined !== shadowValueHover[0] &&
						undefined !== shadowValueHover[0].opacity
							? shadowValueHover[0].opacity
							: 0.2
					}
					hOffset={
						undefined !== shadowValueHover &&
						undefined !== shadowValueHover[0] &&
						undefined !== shadowValueHover[0].hOffset
							? shadowValueHover[0].hOffset
							: 0
					}
					vOffset={
						undefined !== shadowValueHover &&
						undefined !== shadowValueHover[0] &&
						undefined !== shadowValueHover[0].vOffset
							? shadowValueHover[0].vOffset
							: 0
					}
					blur={
						undefined !== shadowValueHover &&
						undefined !== shadowValueHover[0] &&
						undefined !== shadowValueHover[0].blur
							? shadowValueHover[0].blur
							: 14
					}
					spread={
						undefined !== shadowValueHover &&
						undefined !== shadowValueHover[0] &&
						undefined !== shadowValueHover[0].spread
							? shadowValueHover[0].spread
							: 0
					}
					inset={
						undefined !== shadowValueHover &&
						undefined !== shadowValueHover[0] &&
						undefined !== shadowValueHover[0].inset
							? shadowValueHover[0].inset
							: false
					}
					onEnableChange={(value) => {
						saveObjectAttribute({ enable: value }, shadowBase + 'Hover', attributes);
					}}
					onColorChange={(value) => {
						saveObjectAttribute({ color: value }, shadowBase + 'Hover', attributes);
					}}
					onOpacityChange={(value) => {
						saveObjectAttribute({ opacity: value }, shadowBase + 'Hover', attributes);
					}}
					onHOffsetChange={(value) => {
						saveObjectAttribute({ hOffset: value }, shadowBase + 'Hover', attributes);
					}}
					onVOffsetChange={(value) => {
						saveObjectAttribute({ vOffset: value }, shadowBase + 'Hover', attributes);
					}}
					onBlurChange={(value) => {
						saveObjectAttribute({ blur: value }, shadowBase + 'Hover', attributes);
					}}
					onSpreadChange={(value) => {
						saveObjectAttribute({ spread: value }, shadowBase + 'Hover', attributes);
					}}
					onInsetChange={(value) => {
						saveObjectAttribute({ inset: value }, shadowBase + 'Hover', attributes);
					}}
				/>
			)}
		</>
	);

	const activeComponents = includeActive ? (
		<>
			<ResponsivePopColorControl
				label={colorLabel}
				value={colorValueActive}
				tabletValue={colorValueActiveTablet}
				mobileValue={colorValueActiveMobile}
				default={''}
				onChange={(value) => saveFunction(colorBase + 'Active', value)}
				onChangeTablet={(value) => saveFunction(colorBase + 'ActiveTablet', value)}
				onChangeMobile={(value) => saveFunction(colorBase + 'ActiveMobile', value)}
				key={'active'}
			/>

			{backgroundBase && backgroundTypeBase && backgroundGradientBase && (
				<>
					<BackgroundTypeControl
						label={backgroundTypeLabel}
						type={backgroundTypeValueActive ? backgroundTypeValueActive : 'normal'}
						onChange={(value) => saveFunction(backgroundTypeBase + 'Active', value)}
						allowedTypes={['normal', 'gradient']}
					/>
					{'gradient' === backgroundTypeValueActive && (
						<GradientControl
							value={backgroundGradientValueActive}
							onChange={(value) => saveFunction(backgroundGradientBase + 'Active', value)}
							gradients={[]}
						/>
					)}
					{'normal' === backgroundTypeValueActive && (
						<ResponsivePopColorControl
							label={backgroundLabel}
							value={backgroundValueActive}
							tabletValue={backgroundValueActiveTablet}
							mobileValue={backgroundValueActiveMobile}
							default={''}
							onChange={(value) => saveFunction(backgroundBase + 'Active', value)}
							onChangeTablet={(value) => saveFunction(backgroundBase + 'ActiveTablet', value)}
							onChangeMobile={(value) => saveFunction(backgroundBase + 'ActiveMobile', value)}
							key={'activeb'}
						/>
					)}
				</>
			)}
			{backgroundBase && !backgroundTypeBase && (
				<ResponsivePopColorControl
					label={backgroundLabel}
					value={backgroundValueActive}
					tabletValue={backgroundValueActiveTablet}
					mobileValue={backgroundValueActiveMobile}
					default={''}
					onChange={(value) => saveFunction(backgroundBase + 'Active', value)}
					onChangeTablet={(value) => saveFunction(backgroundBase + 'ActiveTablet', value)}
					onChangeMobile={(value) => saveFunction(backgroundBase + 'ActiveMobile', value)}
					key={'activeb'}
				/>
			)}
			{borderBase && (
				<ResponsiveBorderControl
					key={'activeborderbase'}
					label={borderLabel}
					value={borderValueActive}
					tabletValue={borderValueActiveTablet}
					mobileValue={borderValueActiveMobile}
					onChange={(value) => saveFunction(borderBase + 'Active', value)}
					onChangeTablet={(value) => saveFunction(borderBase + 'ActiveTablet', value)}
					onChangeMobile={(value) => saveFunction(borderBase + 'ActiveMobile', value)}
				/>
			)}
			{borderRadiusBase && (
				<ResponsiveMeasurementControls
					key={'activeborderradiusbase'}
					label={borderRadiusLabel}
					value={borderRadiusValueActive}
					tabletValue={borderRadiusValueActiveTablet}
					mobileValue={borderRadiusValueActiveMobile}
					onChange={(value) => saveFunction(borderRadiusBase + 'Active', value.map(String))}
					onChangeTablet={(value) => saveFunction(borderRadiusBase + 'ActiveTablet', value.map(String))}
					onChangeMobile={(value) => saveFunction(borderRadiusBase + 'ActiveMobile', value.map(String))}
					min={0}
					max={borderRadiusUnitValueActive === 'em' || borderRadiusUnitValueActive === 'rem' ? 24 : 100}
					step={borderRadiusUnitValueActive === 'em' || borderRadiusUnitValueActive === 'rem' ? 0.1 : 1}
					unit={borderRadiusUnitValueActive}
					units={['px', 'em', 'rem', '%']}
					onUnit={(value) => saveFunction(borderRadiusUnitBase + 'Active', value)}
					isBorderRadius={true}
					allowEmpty={true}
				/>
			)}
			{shadowBase && (
				<BoxShadowControl
					label={shadowLabel}
					enable={
						undefined !== shadowValueActive &&
						undefined !== shadowValueActive[0] &&
						undefined !== shadowValueActive[0].enable
							? shadowValueActive[0].enable
							: true
					}
					color={
						undefined !== shadowValueActive &&
						undefined !== shadowValueActive[0] &&
						undefined !== shadowValueActive[0].color
							? shadowValueActive[0].color
							: '#000000'
					}
					colorDefault={'#000000'}
					onArrayChange={(color, opacity) => {
						saveObjectAttribute({ color, opacity }, shadowBase + 'Active', attributes);
					}}
					opacity={
						undefined !== shadowValueActive &&
						undefined !== shadowValueActive[0] &&
						undefined !== shadowValueActive[0].opacity
							? shadowValueActive[0].opacity
							: 0.2
					}
					hOffset={
						undefined !== shadowValueActive &&
						undefined !== shadowValueActive[0] &&
						undefined !== shadowValueActive[0].hOffset
							? shadowValueActive[0].hOffset
							: 0
					}
					vOffset={
						undefined !== shadowValueActive &&
						undefined !== shadowValueActive[0] &&
						undefined !== shadowValueActive[0].vOffset
							? shadowValueActive[0].vOffset
							: 0
					}
					blur={
						undefined !== shadowValueActive &&
						undefined !== shadowValueActive[0] &&
						undefined !== shadowValueActive[0].blur
							? shadowValueActive[0].blur
							: 14
					}
					spread={
						undefined !== shadowValueActive &&
						undefined !== shadowValueActive[0] &&
						undefined !== shadowValueActive[0].spread
							? shadowValueActive[0].spread
							: 0
					}
					inset={
						undefined !== shadowValueActive &&
						undefined !== shadowValueActive[0] &&
						undefined !== shadowValueActive[0].inset
							? shadowValueActive[0].inset
							: false
					}
					onEnableChange={(value) => {
						saveObjectAttribute({ enable: value }, shadowBase + 'Active', attributes);
					}}
					onColorChange={(value) => {
						saveObjectAttribute({ color: value }, shadowBase + 'Active', attributes);
					}}
					onOpacityChange={(value) => {
						saveObjectAttribute({ opacity: value }, shadowBase + 'Active', attributes);
					}}
					onHOffsetChange={(value) => {
						saveObjectAttribute({ hOffset: value }, shadowBase + 'Active', attributes);
					}}
					onVOffsetChange={(value) => {
						saveObjectAttribute({ vOffset: value }, shadowBase + 'Active', attributes);
					}}
					onBlurChange={(value) => {
						saveObjectAttribute({ blur: value }, shadowBase + 'Active', attributes);
					}}
					onSpreadChange={(value) => {
						saveObjectAttribute({ spread: value }, shadowBase + 'Active', attributes);
					}}
					onInsetChange={(value) => {
						saveObjectAttribute({ inset: value }, shadowBase + 'Active', attributes);
					}}
				/>
			)}
		</>
	) : null;

	return (
		<>
			<HoverToggleControl
				normal={normalComponents}
				hover={hoverComponents}
				active={activeComponents}
				setActivePreview={setActivePreview}
				activePreview={activePreview}
			/>
		</>
	);
}
