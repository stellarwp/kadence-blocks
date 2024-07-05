import { HoverToggleControl, PopColorControl } from '../';
import { __ } from '@wordpress/i18n';

//a group of color controls for displaying background and/or color controls with hover and active states
export default function ColorControlWithStates({
	colorBase = 'color',
	backgroundBase = 'background',
	colorLabel = 'Color',
	backgroundLabel = 'Background',
	size = '',
	suffix = '',
	includeBackground = true,
	includeActive = true,
	setAttributes,
	setMetaAttributes,
	attributes,
}) {
	const colorValue = attributes[colorBase + suffix + size];
	const backgroundValue = attributes[backgroundBase + suffix + size];
	const colorValueHover = attributes[colorBase + suffix + 'Hover' + size];
	const backgroundValueHover = attributes[backgroundBase + suffix + 'Hover' + size];
	const colorValueActive = attributes[colorBase + suffix + 'Active' + size];
	const backgroundValueActive = attributes[backgroundBase + suffix + 'Active' + size];

	const normalComponents = (
		<>
			<PopColorControl
				label={colorLabel}
				value={colorValue}
				default={''}
				onChange={(value) => setAttributes({ [colorBase + suffix + size]: value })}
				key={'normal'}
			/>
			{includeBackground && (
				<PopColorControl
					label={backgroundLabel}
					value={backgroundValue}
					default={''}
					onChange={(value) => setAttributes({ [backgroundBase + suffix + size]: value })}
					key={'normalb'}
				/>
			)}
		</>
	);

	const hoverComponents = (
		<>
			<PopColorControl
				label={colorLabel + __(' Hover', 'kadence-blocks-pro')}
				value={colorValueHover}
				default={''}
				onChange={(value) => setAttributes({ [colorBase + suffix + 'Hover' + size]: value })}
				key={'hover'}
			/>
			{includeBackground && (
				<PopColorControl
					label={backgroundLabel + __(' Hover', 'kadence-blocks-pro')}
					value={backgroundValueHover}
					default={''}
					onChange={(value) => setAttributes({ [backgroundBase + suffix + 'Hover' + size]: value })}
					key={'hoverb'}
				/>
			)}
		</>
	);

	const activeComponents = includeActive ? (
		<>
			<PopColorControl
				label={colorLabel + __(' Active', 'kadence-blocks-pro')}
				value={colorValueActive}
				default={''}
				onChange={(value) => setAttributes({ [colorBase + suffix + 'Active' + size]: value })}
				key={'active'}
			/>
			{includeBackground && (
				<PopColorControl
					label={backgroundLabel + __(' Active', 'kadence-blocks-pro')}
					value={backgroundValueActive}
					default={''}
					onChange={(value) => setAttributes({ [backgroundBase + suffix + 'Active' + size]: value })}
					key={'activeb'}
				/>
			)}
		</>
	) : null;

	return (
		<>
			<HoverToggleControl normal={normalComponents} hover={hoverComponents} active={activeComponents} />
		</>
	);
}
