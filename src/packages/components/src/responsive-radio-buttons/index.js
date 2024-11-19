/**
 * Radio Buttons control.
 *
 */
/**
 * Import Css
 */

import SmallResponsiveControl from '../small-responsive-control';
import KadenceRadioButtons from '../common/radio-buttons';

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function ResponsiveKadenceRadioButtons({
	label,
	className,
	hideLabel = false,
	wrap = false,
	allowClear = false,
	help = '',
	onChange,
	onChangeTablet,
	onChangeMobile,
	value,
	mobileValue,
	tabletValue,
	options = [],
	tabletOptions = options,
	mobileOptions = tabletOptions,
	...props
}) {
	return (
		<SmallResponsiveControl
			label={label}
			desktopChildren={
				<KadenceRadioButtons
					// className={'kadence-row-layout-radio-btns kb-acccordion-column-layout'}
					value={value}
					options={options}
					onChange={onChange}
					hideLabel={hideLabel}
					help={help}
					wrap={wrap}
					allowClear={allowClear}
				/>
			}
			tabletChildren={
				<KadenceRadioButtons
					// className={'kadence-row-layout-radio-btns kb-acccordion-column-layout'}
					value={tabletValue}
					options={tabletOptions}
					onChange={onChangeTablet}
					hideLabel={hideLabel}
					help={help}
					wrap={wrap}
					allowClear={true}
				/>
			}
			mobileChildren={
				<KadenceRadioButtons
					// className={'kadence-row-layout-radio-btns kb-acccordion-column-layout'}
					value={mobileValue}
					options={mobileOptions}
					onChange={onChangeMobile}
					hideLabel={hideLabel}
					help={help}
					wrap={wrap}
					allowClear={true}
				/>
			}
		/>
	);
}
