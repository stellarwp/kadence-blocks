/**
 * Responsive Range Component
 *
 */

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import MeasurementControls from './measurement-control';
const {
	Fragment,
} = wp.element;
const {
	Dashicon,
	TabPanel,
} = wp.components;

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function ResponsiveMeasurementControls( {
	label,
	subLabel,
	onChange,
	onChangeTablet,
	onChangeMobile,
	mobileValue,
	tabletValue,
	value,
	onChangeMobileControl,
	mobileControl,
	onChangeTabletControl,
	tabletControl,
	onChangeControl,
	control,
	step = 1,
	max = 100,
	min = 0,
	allowEmpty = true,
} ) {
	const zero = ( allowEmpty ? '' : 0 );
	return [
		onChange && onChangeTablet && onChangeMobile && (
			<Fragment>
				<h2 className="kt-heading-size-title">{ label }</h2>
				<TabPanel className="kt-size-tabs"
					activeClass="active-tab"
					tabs={ [
						{
							name: 'desk',
							title: <Dashicon icon="desktop" />,
							className: 'kt-desk-tab',
						},
						{
							name: 'tablet',
							title: <Dashicon icon="tablet" />,
							className: 'kt-tablet-tab',
						},
						{
							name: 'mobile',
							title: <Dashicon icon="smartphone" />,
							className: 'kt-mobile-tab',
						},
					] }>
					{
						( tab ) => {
							let tabout;
							if ( tab.name ) {
								if ( 'mobile' === tab.name ) {
									tabout = (
										<MeasurementControls
											label={ __( 'Mobile:', 'kadence-blocks' ) + subLabel }
											measurement={ ( mobileValue ? mobileValue : [ '', '', '', '' ] ) }
											control={ ( mobileControl ? mobileControl : 'individual' ) }
											onChange={ ( size ) => onChangeMobile( size ) }
											onControl={ ( sizeControl ) => onChangeMobileControl( sizeControl ) }
											min={ min }
											max={ max }
											step={ step }
										/>
									);
								} else if ( 'tablet' === tab.name ) {
									tabout = (
										<MeasurementControls
											label={ __( 'Tablet:', 'kadence-blocks' ) + subLabel }
											measurement={ ( tabletValue ? tabletValue : [ '', '', '', '' ] ) }
											control={ ( tabletControl ? tabletControl : 'individual' ) }
											onChange={ ( size ) => onChangeTablet( size ) }
											onControl={ ( sizeControl ) => onChangeTabletControl( sizeControl ) }
											min={ min }
											max={ max }
											step={ step }
										/>
									);
								} else {
									tabout = (
										<MeasurementControls
											label={ subLabel }
											measurement={ ( value ? value : [ '', '', '', '' ] ) }
											control={ ( control ? control : 'individual' ) }
											onChange={ ( size ) => onChange( size ) }
											onControl={ ( sizeControl ) => onChangeControl( sizeControl ) }
											min={ min }
											max={ max }
											step={ step }
										/>
									);
								}
							}
							return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
						}
					}
				</TabPanel>
			</Fragment>
		),
	];
}
