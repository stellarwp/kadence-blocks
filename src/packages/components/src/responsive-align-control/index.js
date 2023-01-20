/**
 * Responsive Range Component
 *
 */

/**
 * Internal block libraries
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { map } from 'lodash';
import { capitalizeFirstLetter } from '@kadence/helpers'

import {
	arrowUp,
	arrowLeft,
	arrowRight,
	arrowDown,
} from '@wordpress/icons';

import {
	Dashicon,
	Button,
	ButtonGroup,
} from '@wordpress/components';
import { AlignmentToolbar, JustifyToolbar, BlockVerticalAlignmentToolbar } from '@wordpress/blockEditor';
import './editor.scss';
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function ResponsiveAlignControls( {
	label,
	onChange,
	onChangeTablet,
	onChangeMobile,
	mobileValue,
	tabletValue,
	value,
	isCollapsed = false,
	type = 'textAlign',
} ) {
	const [ deviceType, setDeviceType ] = useState( 'Desktop' );
	const theDevice = useSelect( ( select ) => {
		return select( 'kadenceblocks/data' ).getPreviewDeviceType();
	}, [] );
	if ( theDevice !== deviceType ) {
		setDeviceType( theDevice );
	}
	const {
		setPreviewDeviceType,
	} = useDispatch( 'kadenceblocks/data' );
	const customSetPreviewDeviceType = ( device ) => {
		setPreviewDeviceType( capitalizeFirstLetter( device ) );
		setDeviceType( capitalizeFirstLetter( device ) );
	};
	let alignmentControls = '';
	let UIComponent = AlignmentToolbar;
	if ( type === 'justify' ) {
		UIComponent = JustifyToolbar;
	} else if ( type === 'vertical' ) {
		UIComponent = BlockVerticalAlignmentToolbar;
	} else if ( type === 'orientation' ) {
		alignmentControls = [
			{
				icon: arrowRight,
				title: __( 'Horizontal Direction' ),
				align: 'row',
			},
			{
				icon: arrowDown,
				title: __( 'Vertical Direction' ),
				align: 'column',
			},
			{
				icon: arrowLeft,
				title: __( 'Horizontal Reverse' ),
				align: 'row-reverse',
			},
			{
				icon: arrowUp,
				title: __( 'Vertical Reverse' ),
				align: 'column-reverse',
			},
		]
	}
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
	const output = {};
	output.Mobile = (
		<UIComponent
			value={ ( mobileValue ? mobileValue : '' ) }
			isCollapsed={ isCollapsed }
			onChange={ ( align ) => onChangeMobile( align ) }
			alignmentControls={ alignmentControls ? alignmentControls : undefined }
		/>
	);
	output.Tablet = (
		<UIComponent
			value={ ( tabletValue ? tabletValue : '' ) }
			isCollapsed={ isCollapsed }
			onChange={ ( align ) => onChangeTablet( align ) }
			alignmentControls={ alignmentControls ? alignmentControls : undefined }
		/>
	);
	output.Desktop = (
		<UIComponent
			value={ ( value ? value : '' ) }
			isCollapsed={ isCollapsed }
			onChange={ ( align ) => onChange( align ) }
			alignmentControls={ alignmentControls ? alignmentControls : undefined }
		/>
	);
	return [
		onChange && onChangeTablet && onChangeMobile && (
			<div className={ 'components-base-control kb-sidebar-alignment kb-responsive-align-control' }>
				<div className="kadence-title-bar">
					{ label && (
						<span className="kadence-control-title">{ label }</span>
					) }
					<ButtonGroup className="kb-measure-responsive-options" aria-label={ __( 'Device', 'kadence-blocks' ) }>
						{ map( devices, ( { name, key, title, itemClass } ) => (
							<Button
								key={ key }
								className={ `kb-responsive-btn ${ itemClass }${ name === deviceType ? ' is-active' : '' }` }
								isSmall
								aria-pressed={ deviceType === name }
								onClick={ () => customSetPreviewDeviceType( name ) }
							>
								{ title }
							</Button>
						) ) }
					</ButtonGroup>
				</div>
				<div className="kb-responsive-align-control-inner">
					{ ( output[ deviceType ] ? output[ deviceType ] : output.Desktop ) }
				</div>
			</div>
		),
	];
}
