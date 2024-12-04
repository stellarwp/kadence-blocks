import SmallResponsiveControl from '../small-responsive-control';
import { SelectControl } from '@wordpress/components';

export default function ResponsiveSelectControl({
	label,
	onChange,
	onChangeTablet,
	onChangeMobile,
	value,
	mobileValue,
	tabletValue,
	options,
	tabletOptions = options,
	mobileOptions = tabletOptions,
	help,
}) {
	return (
		<SmallResponsiveControl
			label={label}
			desktopChildren={
				<SelectControl value={value} options={options} onChange={(value) => onChange(value)} help={help} />
			}
			tabletChildren={
				<SelectControl
					value={tabletValue}
					options={tabletOptions}
					onChange={(value) => onChangeTablet(value)}
					help={help}
				/>
			}
			mobileChildren={
				<SelectControl
					value={mobileValue}
					options={mobileOptions}
					onChange={(value) => onChangeMobile(value)}
					help={help}
				/>
			}
		></SmallResponsiveControl>
	);
}
