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
}) {
	return (
		<SmallResponsiveControl
			label={label}
			desktopChildren={<SelectControl value={value} options={options} onChange={(value) => onChange(value)} />}
			tabletChildren={
				<SelectControl value={tabletValue} options={tabletOptions} onChange={(value) => onChangeTablet(value)} />
			}
			mobileChildren={
				<SelectControl value={mobileValue} options={mobileOptions} onChange={(value) => onChangeMobile(value)} />
			}
		></SmallResponsiveControl>
	);
}
