/**
 * Responsive Range Component
 *
 */

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
import KadenceRange from './kadence-range-control';
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
export default function ResponsiveRangeControl( {
	label,
	onChange,
	onChangeTablet,
	onChangeMobile,
	mobileValue,
	tabletValue,
	value,
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
										<KadenceRange
											value={ ( mobileValue ? mobileValue : zero ) }
											onChange={ ( size ) => onChangeMobile( size ) }
											min={ min }
											max={ max }
											step={ step }
										/>
									);
								} else if ( 'tablet' === tab.name ) {
									tabout = (
										<KadenceRange
											value={ ( tabletValue ? tabletValue : zero ) }
											onChange={ ( size ) => onChangeTablet( size ) }
											min={ min }
											max={ max }
											step={ step }
										/>
									);
								} else {
									tabout = (
										<KadenceRange
											value={ ( value ? value : zero ) }
											onChange={ ( size ) => onChange( size ) }
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
