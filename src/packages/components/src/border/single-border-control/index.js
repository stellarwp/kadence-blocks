/**
 * Single Border Component
 *
 */
import {
	pxIcon,
	emIcon,
	remIcon,
	vhIcon,
	vwIcon,
	percentIcon,
	outlineTopIcon,
	outlineRightIcon,
	outlineBottomIcon,
	outlineLeftIcon,
	individualIcon,
	linkedIcon,
	topLeftIcon,
	topRightIcon,
	bottomRightIcon,
	bottomLeftIcon,
	radiusLinkedIcon,
	radiusIndividualIcon,
} from '@kadence/icons';
import { settings, link, linkOff } from '@wordpress/icons';
import { flow } from 'lodash';
/**
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose';
/**
 * Import Externals
 */
import PopColorControl from '../../pop-color-control';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalUnitControl as UnitControl,
	DropdownMenu,
	Flex,
	FlexItem,
	MenuGroup,
	MenuItem,
} from '@wordpress/components';
/**
 * Build the Border controls
 * @returns {object} Border Control.
 */
export default function SingleBorderControl({
	label,
	onChange,
	value = '',
	className = '',
	step = 1,
	max = 200,
	min = 0,
	unit = 'px',
	onUnit,
	units = ['px', 'em', 'rem'],
	styles = ['solid', 'dashed', 'dotted', 'double'],
	defaultLinked = true,
}) {
	const instanceId = useInstanceId(SingleBorderControl);
	const onChangeStyle = (style) => {
		const newVal = value;
		newVal[1] = style;
		onChange(newVal);
	};
	const currentStyle = value?.[1] || 'solid';
	const onChangeColor = (color) => {
		const newVal = value;
		newVal[0] = color;
		onChange(newVal);
	};
	const currentColor = value?.[0] || '';
	const currentSize = undefined !== value?.[2] && '' !== value?.[2] ? value[2] : '';
	const onChangeSize = (size) => {
		const isNumeric = !isNaN(parseFloat(size));
		const nextValue = isNumeric ? parseFloat(size) : '';
		const newVal = value;
		newVal[2] = nextValue;
		onChange(newVal);
	};

	const styleIcons = {
		solid: (
			<svg
				width="24"
				height="24"
				xmlns="http://www.w3.org/2000/svg"
				fillRule="evenodd"
				strokeLinejoin="round"
				strokeMiterlimit="2"
				clipRule="evenodd"
				viewBox="0 0 20 20"
			>
				<path d="M18.988 11.478V8.522H1.012v2.956h17.976z"></path>
			</svg>
		),
		dashed: (
			<svg
				width="24"
				height="24"
				xmlns="http://www.w3.org/2000/svg"
				fillRule="evenodd"
				strokeLinejoin="round"
				strokeMiterlimit="2"
				clipRule="evenodd"
				viewBox="0 0 20 20"
			>
				<path d="M12.512 11.478V8.522H7.488v2.956h5.024zM14.004 8.522v2.956h4.984V8.522h-4.984zM1.012 8.522v2.956H6.05V8.522H1.012z"></path>
			</svg>
		),
		dotted: (
			<svg
				width="24"
				height="24"
				xmlns="http://www.w3.org/2000/svg"
				fillRule="evenodd"
				strokeLinejoin="round"
				strokeMiterlimit="2"
				clipRule="evenodd"
				viewBox="0 0 20 20"
			>
				<circle cx="2.503" cy="10" r="1.487"></circle>
				<circle cx="17.486" cy="10" r="1.487"></circle>
				<circle cx="12.447" cy="10" r="1.487"></circle>
				<circle cx="7.455" cy="10" r="1.487"></circle>
			</svg>
		),
		double: (
			<svg
				width="24"
				height="24"
				xmlns="http://www.w3.org/2000/svg"
				fillRule="evenodd"
				strokeLinejoin="round"
				strokeMiterlimit="2"
				clipRule="evenodd"
				viewBox="0 0 20 20"
			>
				<path d="M1.02 6.561v2.957h17.968V6.561H1.02zM1.012 10.586v2.956H18.98v-2.956H1.012z"></path>
			</svg>
		),
	};
	const styleLabels = {
		solid: __('Solid', 'kadence-blocks'),
		dashed: __('Dashed', 'kadence-blocks'),
		dotted: __('Dotted', 'kadence-blocks'),
		double: __('Double', 'kadence-blocks'),
	};
	const controlUnits = units.map((unitItem) => ({
		value: unitItem,
		label: unitItem,
	}));
	return [
		onChange && (
			<div
				className={`components-base-control kadence-single-border-control kadence-single-border-control${instanceId}${
					className ? ' ' + className : ''
				}`}
			>
				{label && (
					<Flex justify="space-between" className={'kadence-border-control__header'}>
						<FlexItem>
							<label className="components-base-control__label">{label}</label>
						</FlexItem>
					</Flex>
				)}
				<div className={'kadence-single-border-control-wrap'}>
					<PopColorControl
						value={currentColor}
						default={''}
						hideClear={true}
						onChange={(value) => onChangeColor(value)}
					/>
					<DropdownMenu
						className="border-control-style-select"
						icon={styleIcons[currentStyle]}
						label={__('Border Style', 'kadence-blocks')}
						popoverProps={{
							className: 'border-control-style-select__popover',
							placement: 'bottom',
						}}
					>
						{({ onClose }) => (
							<>
								<MenuGroup>
									{styles.map((style) => (
										<MenuItem
											icon={styleIcons[style]}
											onClick={() => {
												onClose();
												onChangeStyle(style);
											}}
											label={styleLabels[style]}
										/>
									))}
								</MenuGroup>
							</>
						)}
					</DropdownMenu>
					<div className={'kadence-controls-content kadence-single-unit-control'}>
						<UnitControl
							min={min}
							max={max}
							step={step}
							units={controlUnits}
							value={currentSize}
							disableUnits={true}
							onChange={(newVal) => onChangeSize(newVal)}
						/>
						<div className={'kadence-measure-control-select-wrapper'}>
							<select
								className={'kadence-measure-control-select components-unit-control__select'}
								onChange={(event) => {
									onUnit(event.target.value);
								}}
								disabled={units.length === 1}
							>
								{units.map((option) => (
									<option value={option} selected={unit === option ? true : undefined} key={option}>
										{option}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>
			</div>
		),
	];
}
