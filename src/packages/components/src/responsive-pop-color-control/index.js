import SmallResponsiveControl from '../small-responsive-control';
import PopColorControl from '../pop-color-control';

export default function ResponsivePopColorControl( {
	label,
	onChange,
	onChange2,
	onChange3,
	onChangeTablet,
	onChange2Tablet,
	onChange3Tablet,
	onChangeMobile,
	onChange2Mobile,
	onChange3Mobile,
	value,
	value2,
	value3,
	mobileValue,
	mobileValue2,
	mobileValue3,
	tabletValue,
	tabletValue2,
	tabletValue3,
	colorDefault,
	colorDefault2,
	colorDefault3,
	colorDefaultTablet,
	colorDefault2Tablet,
	colorDefault3Tablet,
	colorDefaultMobile,
	colorDefault2Mobile,
	colorDefault3Mobile,
} ) {
	return (
		<SmallResponsiveControl
			label={ label }
			desktopChildren={
				<PopColorControl
					value={ value }
					value2={ value2 }
					value3={ value3 }
					onChange={ ( value ) => onChange( value ) }
					onChange2={ onChange2 ? ( value ) => onChange2( value ) : null }
					onChange3={ onChange3 ? ( value ) => onChange3( value ) : null }
					colorDefault={ colorDefault }
					colorDefault2={ colorDefault2 }
					colorDefault3={ colorDefault3 }
				/>
			}
			tabletChildren={
				<PopColorControl
					value={ tabletValue }
					value2={ tabletValue2 }
					value3={ tabletValue3 }
					onChange={ ( value ) => onChangeTablet( value ) }
					onChange2={ onChange2Tablet ? ( value ) => onChange2Tablet( value ) : null }
					onChange3={ onChange3Tablet ? ( value ) => onChange3Tablet( value ) : null }
					colorDefault={ colorDefaultTablet }
					colorDefault2={ colorDefault2Tablet }
					colorDefault3={ colorDefault3Tablet }
				/>
			}
			mobileChildren={
				<PopColorControl
					value={ mobileValue }
					value2={ mobileValue2 }
					value3={ mobileValue3 }
					onChange={ ( value ) => onChangeMobile( value ) }
					onChange2={ onChange2Mobile ? ( value ) => onChange2Mobile( value ) : null }
					onChange3={ onChange3Mobile ? ( value ) => onChange3Mobile( value ) : null }
					colorDefault={ colorDefaultMobile }
					colorDefault2={ colorDefault2Mobile }
					colorDefault3={ colorDefault3Mobile }
				/>
			}
		></SmallResponsiveControl>
	);
}
