import SmallResponsiveControl from '../small-responsive-control';
import { SelectControl } from '@wordpress/components';

export default function ResponsiveAlignControls({
	label,
	onChange,
	onChangeTablet,
	onChangeMobile,
	value,
	mobileValue,
	tabletValue,
	options,
}) {
	return (
		<SmallResponsiveControl
			label={label}
			desktopChildren={<SelectControl value={value} options={options} onChange={(value) => onChange(value)} />}
			tabletChildren={
				<SelectControl value={tabletValue} options={options} onChange={(value) => onChangeTablet(value)} />
			}
			mobileChildren={
				<SelectControl value={mobileValue} options={options} onChange={(value) => onChangeMobile(value)} />
			}
		></SmallResponsiveControl>
	);
}
