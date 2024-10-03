/**
 * Responsive Single Border Control Component
 *
 */

/**
 * Internal block libraries
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useRef, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { map, isEqual } from 'lodash';
import SingleBorderControl from '../single-border-control';
import { capitalizeFirstLetter } from '@kadence/helpers';
import { undo } from '@wordpress/icons';
/**
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose';
import { Dashicon, Button, ButtonGroup } from '@wordpress/components';
import { outlineTopIcon, outlineRightIcon, outlineBottomIcon, outlineLeftIcon } from '@kadence/icons';
import { settings, link, linkOff } from '@wordpress/icons';
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function ResponsiveSingleBorderControl({
	label,
	onChange,
	onChangeTablet,
	onChangeMobile,
	onControl,
	value = '',
	tabletValue = '',
	mobileValue = '',
	control = 'individual',
	units = ['px', 'em', 'rem'],
	firstIcon = outlineTopIcon,
	secondIcon = outlineRightIcon,
	thirdIcon = outlineBottomIcon,
	fourthIcon = outlineLeftIcon,
	linkIcon = link,
	unlinkIcon = linkOff,
	styles = ['solid', 'dashed', 'dotted', 'double'],
	deskDefault = {
		top: ['', '', ''],
		right: ['', '', ''],
		bottom: ['', '', ''],
		left: ['', '', ''],
		unit: 'px',
	},
	tabletDefault = {
		top: ['', '', ''],
		right: ['', '', ''],
		bottom: ['', '', ''],
		left: ['', '', ''],
		unit: '',
	},
	mobileDefault = {
		top: ['', '', ''],
		right: ['', '', ''],
		bottom: ['', '', ''],
		left: ['', '', ''],
		unit: '',
	},
	reset = true,
	defaultLinked = true,
}) {
	const instanceId = useInstanceId(ResponsiveSingleBorderControl);
	const measureIcons = {
		first: firstIcon,
		second: secondIcon,
		third: thirdIcon,
		fourth: fourthIcon,
		link: linkIcon,
		unlink: unlinkIcon,
	};

	const currentDesktopObject = value?.[0] || deskDefault;
	const currentTabletObject = tabletValue?.[0] || tabletDefault;
	const currentMobileObject = mobileValue?.[0] || mobileDefault;
	const [theControl, setTheControl] = useState(control);
	const realControl = onControl ? control : theControl;
	const realSetOnControl = onControl ? onControl : setTheControl;
	const [deviceType, setDeviceType] = useState('Desktop');
	const theDevice = useSelect((select) => {
		return select('kadenceblocks/data').getPreviewDeviceType();
	}, []);
	if (theDevice !== deviceType) {
		setDeviceType(theDevice);
	}
	useEffect(() => {
		//if the mobile or tablet units are the same as desktop, unset them so they now inherit / follow desktop.
		if (currentMobileObject && isEqual(currentDesktopObject.unit, currentMobileObject?.unit)) {
			currentMobileObject.unit = '';
			handleOnChangeMobile('', 'unit');
		}
		if (currentTabletObject && isEqual(currentDesktopObject.unit, currentTabletObject?.unit)) {
			currentTabletObject.unit = '';
			handleOnChangeTablet('', 'unit');
		}
	}, []);
	const { setPreviewDeviceType } = useDispatch('kadenceblocks/data');
	const customSetPreviewDeviceType = (device) => {
		setPreviewDeviceType(capitalizeFirstLetter(device));
		setDeviceType(capitalizeFirstLetter(device));
	};
	const devices = [
		{
			name: 'Desktop',
			title: <Dashicon icon="desktop" />,
			itemClass: 'kb-desk-tab',
		},
		{
			name: 'Tablet',
			title: <Dashicon icon="tablet" />,
			itemClass: 'kb-tablet-tab',
		},
		{
			name: 'Mobile',
			key: 'mobile',
			title: <Dashicon icon="smartphone" />,
			itemClass: 'kb-mobile-tab',
		},
	];
	let liveValue = currentDesktopObject;
	if (deviceType === 'Tablet') {
		liveValue = currentTabletObject;
	} else if (deviceType === 'Mobile') {
		liveValue = currentMobileObject;
	}
	const onReset = () => {
		if (deviceType === 'Tablet') {
			onChangeTablet([tabletDefault]);
		} else if (deviceType === 'Mobile') {
			onChangeMobile([mobileDefault]);
		} else {
			onChange([deskDefault]);
		}
	};
	const output = {};
	const mobileUnit = currentMobileObject?.unit
		? currentMobileObject.unit
		: currentDesktopObject?.unit
		? currentDesktopObject.unit
		: 'px';
	const tabletUnit = currentTabletObject?.unit
		? currentTabletObject.unit
		: currentDesktopObject?.unit
		? currentDesktopObject.unit
		: 'px';

	const handleOnChangeDesktop = (size, attr) => {
		var newVal = JSON.parse(JSON.stringify(value));
		newVal[0][attr] = size;
		onChange(newVal);
	};
	const handleOnChangeTablet = (size, attr) => {
		var newVal = JSON.parse(JSON.stringify(tabletValue));
		newVal[0][attr] = size;
		onChangeTablet(newVal);
	};
	const handleOnChangeMobile = (size, attr) => {
		var newVal = JSON.parse(JSON.stringify(mobileValue));
		newVal[0][attr] = size;
		onChangeMobile(newVal);
	};

	output.Mobile = (
		<SingleBorderControl
			key={'mobile' + instanceId}
			value={currentMobileObject?.bottom ? JSON.parse(JSON.stringify(currentMobileObject?.bottom)) : undefined}
			unit={currentMobileObject?.unit ? JSON.parse(JSON.stringify(currentMobileObject?.unit)) : 'px'}
			onChange={(size) => handleOnChangeMobile(size, 'bottom')}
			onUnit={(unit) => handleOnChangeMobile(unit, 'unit')}
			defaultValue={mobileDefault?.bottom}
			styles={styles}
			units={[mobileUnit]}
			firstIcon={firstIcon}
			secondIcon={secondIcon}
			thirdIcon={thirdIcon}
			fourthIcon={fourthIcon}
		/>
	);
	output.Tablet = (
		<SingleBorderControl
			key={'tablet' + instanceId}
			value={currentTabletObject?.bottom ? JSON.parse(JSON.stringify(currentTabletObject?.bottom)) : undefined}
			unit={currentTabletObject?.unit ? JSON.parse(JSON.stringify(currentTabletObject?.unit)) : 'px'}
			onChange={(size) => handleOnChangeTablet(size, 'bottom')}
			onUnit={(unit) => handleOnChangeTablet(unit, 'unit')}
			defaultValue={tabletDefault?.bottom}
			styles={styles}
			units={[tabletUnit]}
			firstIcon={firstIcon}
			secondIcon={secondIcon}
			thirdIcon={thirdIcon}
			fourthIcon={fourthIcon}
		/>
	);
	output.Desktop = (
		<SingleBorderControl
			key={'desktop' + instanceId}
			value={currentDesktopObject?.bottom ? JSON.parse(JSON.stringify(currentDesktopObject?.bottom)) : undefined}
			unit={currentDesktopObject?.unit ? JSON.parse(JSON.stringify(currentDesktopObject?.unit)) : 'px'}
			onChange={(size) => handleOnChangeDesktop(size, 'bottom')}
			onUnit={(unit) => handleOnChangeDesktop(unit, 'unit')}
			defaultValue={deskDefault?.bottom}
			styles={styles}
			units={units}
			firstIcon={firstIcon}
			secondIcon={secondIcon}
			thirdIcon={thirdIcon}
			fourthIcon={fourthIcon}
		/>
	);
	let currentDefault = deskDefault;
	if ('Mobile' === deviceType) {
		currentDefault = mobileDefault;
	} else if ('Mobile' === deviceType) {
		currentDefault = tabletDefault;
	}
	return [
		onChange && onChangeTablet && onChangeMobile && (
			<div
				className={`components-base-control kb-responsive-border-control kadence-border-box-control kadence-border-box-control${instanceId}`}
			>
				<div className={'kadence-border-control__header kadence-component__header'}>
					{label && (
						<div className="kadence-component__header__title kadence-radio-range__title">
							<label className="components-base-control__label">{label}</label>
							{reset && (
								<div className="title-reset-wrap">
									<Button
										className="is-reset is-single"
										label="reset"
										isSmall
										disabled={isEqual(currentDefault, liveValue) ? true : false}
										icon={undo}
										onClick={() => onReset()}
									/>
								</div>
							)}
						</div>
					)}
					<ButtonGroup
						className="kb-responsive-options kb-measure-responsive-options"
						aria-label={__('Device', 'kadence-blocks')}
					>
						{map(devices, ({ name, key, title, itemClass }) => (
							<Button
								key={key}
								className={`kb-responsive-btn ${itemClass}${name === deviceType ? ' is-active' : ''}`}
								isSmall
								aria-pressed={deviceType === name}
								onClick={() => customSetPreviewDeviceType(name)}
							>
								{title}
							</Button>
						))}
					</ButtonGroup>
				</div>
				<div className="kb-responsive-border-control-inner">
					{output[deviceType] ? output[deviceType] : output.Desktop}
				</div>
			</div>
		),
	];
}
