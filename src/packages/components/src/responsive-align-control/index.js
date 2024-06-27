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
const alignBottom = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M15 4H9v11h6V4zM4 18.5V20h16v-1.5H4z" />
	</SVG>
);

const alignCenter = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M20 11h-5V4H9v7H4v1.5h5V20h6v-7.5h5z" />
	</SVG>
);

const alignTop = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M9 20h6V9H9v11zM4 4v1.5h16V4H4z" />
	</SVG>
);

const alignStretch = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M4 4L20 4L20 5.5L4 5.5L4 4ZM10 7L14 7L14 17L10 17L10 7ZM20 18.5L4 18.5L4 20L20 20L20 18.5Z" />
	</SVG>
);

const verticalSpaceBetween = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M7 4H17V8L7 8V4ZM7 16L17 16V20L7 20V16ZM20 11.25H4V12.75H20V11.25Z" />
	</SVG>
);
const verticalSpaceEvenly = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
		<Path d="M8 8v3h32V8H8zm32 29H8v3h32v-3zM17.911 14.318v8h12v-8h-12zM17.983 25.637v8h12v-8h-12z" />
	</SVG>
);
const verticalSpaceAround = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
		<Path d="M8 8v3h32V8H8zm32 29H8v3h32v-3zM17.911 12.605v8h12v-8h-12zM17.993 27.275v8h12v-8h-12z" />
	</SVG>
);
const spaceAround = (
	<SVG
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 48 48"
    >
      <Path d="M8 40h3V8H8v32zM37 8v32h3V8h-3z"/>
      <Path d="M12.605 18.089H20.605V30.089H12.605z"/>
      <Path d="M27.275 18.007H35.275V30.007H27.275z"/>
    </SVG>
);

const spaceEvenly = (
	<SVG
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 48 48"
    >
		<Path d="M8 40h3V8H8v32zM37 8v32h3V8h-3z"/>
		<Path d="M14.318 18.089H22.317999999999998V30.089H14.318z"/>
		<Path d="M25.637 18.017H33.637V30.017H25.637z"/>
    </SVG>
);

import {
	arrowUp,
	arrowLeft,
	arrowRight,
	arrowDown,
	justifyLeft,
	justifyCenter,
	justifyRight,
	justifySpaceBetween,
	justifyStretch,
} from '@wordpress/icons';
import {
	Dashicon,
	Button,
	ButtonGroup,
	Path, SVG
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
	reverse = false,
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
				title: __( 'Horizontal Direction', 'kadence-blocks' ),
				align: 'row',
			},
			{
				icon: arrowDown,
				title: __( 'Vertical Direction', 'kadence-blocks' ),
				align: 'column',
			},
			{
				icon: arrowLeft,
				title: __( 'Horizontal Reverse', 'kadence-blocks' ),
				align: 'row-reverse',
			},
			{
				icon: arrowUp,
				title: __( 'Vertical Reverse', 'kadence-blocks' ),
				align: 'column-reverse',
			},
		]
	} else if ( type === 'vertical-column' ) {
		alignmentControls = [
			{
				icon: alignTop,
				title: __( 'Top', 'kadence-blocks' ),
				align: 'top',
			},
			{
				icon: alignCenter,
				title: __( 'Middle', 'kadence-blocks' ),
				align: 'middle',
			},
			{
				icon: alignBottom,
				title: __( 'Bottom', 'kadence-blocks' ),
				align: 'bottom',
			},
			{
				icon: alignStretch,
				title: __( 'Stretch', 'kadence-blocks' ),
				align: 'stretch',
			},
		]
	} else if ( type === 'orientation-column' ) {
		alignmentControls = [
			{
				icon: arrowDown,
				title: __( 'Vertical Direction', 'kadence-blocks' ),
				align: 'vertical',
			},
			{
				icon: arrowRight,
				title: __( 'Horizontal Direction', 'kadence-blocks' ),
				align: 'horizontal',
			},
			{
				icon: arrowUp,
				title: __( 'Vertical Reverse', 'kadence-blocks' ),
				align: 'vertical-reverse',
			},
			{
				icon: arrowLeft,
				title: __( 'Horizontal Reverse', 'kadence-blocks' ),
				align: 'horizontal-reverse',
			},
		]
	} else if ( type === 'justify-align' ) {
		if ( reverse ) {
			alignmentControls = [
				{
					icon: justifyRight,
					title: __( 'Start', 'kadence-blocks' ),
					align: 'flex-start',
				},
				{
					icon: justifyCenter,
					title: __( 'Center', 'kadence-blocks' ),
					align: 'center',
				},
				{
					icon: justifyLeft,
					title: __( 'End', 'kadence-blocks' ),
					align: 'flex-end',
				},
				{
					icon: justifyStretch,
					title: __( 'Stretch', 'kadence-blocks' ),
					align: 'stretch',
				},
			]
		} else {
			alignmentControls = [
				{
					icon: justifyLeft,
					title: __( 'Start', 'kadence-blocks' ),
					align: 'flex-start',
				},
				{
					icon: justifyCenter,
					title: __( 'Center', 'kadence-blocks' ),
					align: 'center',
				},
				{
					icon: justifyRight,
					title: __( 'End', 'kadence-blocks' ),
					align: 'flex-end',
				},
				{
					icon: justifyStretch,
					title: __( 'Stretch', 'kadence-blocks' ),
					align: 'stretch',
				},
			]
		}
	} else if ( type === 'justify-column' ) {
		if ( reverse ) {
			alignmentControls = [
				{
					icon: justifyRight,
					title: __( 'Start', 'kadence-blocks' ),
					align: 'flex-start',
				},
				{
					icon: justifyCenter,
					title: __( 'Center', 'kadence-blocks' ),
					align: 'center',
				},
				{
					icon: justifyLeft,
					title: __( 'End', 'kadence-blocks' ),
					align: 'flex-end',
				},
				{
					icon: justifySpaceBetween,
					title: __( 'Space Between', 'kadence-blocks' ),
					align: 'space-between',
				},
				{
					icon: spaceAround,
					title: __( 'Space Around', 'kadence-blocks' ),
					align: 'space-around',
				},
				{
					icon: spaceEvenly,
					title: __( 'Space Evenly', 'kadence-blocks' ),
					align: 'space-evenly',
				},
			]
		} else {
			alignmentControls = [
				{
					icon: justifyLeft,
					title: __( 'Start', 'kadence-blocks' ),
					align: 'flex-start',
				},
				{
					icon: justifyCenter,
					title: __( 'Center', 'kadence-blocks' ),
					align: 'center',
				},
				{
					icon: justifyRight,
					title: __( 'End', 'kadence-blocks' ),
					align: 'flex-end',
				},
				{
					icon: justifySpaceBetween,
					title: __( 'Space Between', 'kadence-blocks' ),
					align: 'space-between',
				},
				{
					icon: spaceAround,
					title: __( 'Space Around', 'kadence-blocks' ),
					align: 'space-around',
				},
				{
					icon: spaceEvenly,
					title: __( 'Space Evenly', 'kadence-blocks' ),
					align: 'space-evenly',
				},
			]
		}
	} else if ( type === 'justify-vertical' ) {
		if ( reverse ) {
			alignmentControls = [
				{
					icon: alignBottom,
					title: __( 'Bottom', 'kadence-blocks' ),
					align: 'top',
				},
				{
					icon: alignCenter,
					title: __( 'Middle', 'kadence-blocks' ),
					align: 'middle',
				},
				{
					icon: alignTop,
					title: __( 'Top', 'kadence-blocks' ),
					align: 'bottom',
				},
				{
					icon: verticalSpaceBetween,
					title: __( 'Space Between', 'kadence-blocks' ),
					align: 'space-between',
				},
				{
					icon: verticalSpaceAround,
					title: __( 'Space Around', 'kadence-blocks' ),
					align: 'space-around',
				},
				{
					icon: verticalSpaceEvenly,
					title: __( 'Space Evenly', 'kadence-blocks' ),
					align: 'space-evenly',
				},
			]
		} else {
			alignmentControls = [
				{
					icon: alignTop,
					title: __( 'Top', 'kadence-blocks' ),
					align: 'top',
				},
				{
					icon: alignCenter,
					title: __( 'Middle', 'kadence-blocks' ),
					align: 'middle',
				},
				{
					icon: alignBottom,
					title: __( 'Bottom', 'kadence-blocks' ),
					align: 'bottom',
				},
				{
					icon: verticalSpaceBetween,
					title: __( 'Space Between', 'kadence-blocks' ),
					align: 'space-between',
				},
				{
					icon: verticalSpaceAround,
					title: __( 'Space Around', 'kadence-blocks' ),
					align: 'space-around',
				},
				{
					icon: verticalSpaceEvenly,
					title: __( 'Space Evenly', 'kadence-blocks' ),
					align: 'space-evenly',
				},
			]
		}
	}
	
	const devices = [
		{
			name: 'Desktop',
			key: 'desktop',
			title: <Dashicon icon="desktop" />,
			itemClass: 'kb-desk-tab',
		},
		{
			name: 'Tablet',
			key: 'tablet',
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
			<div className={ `components-base-control kb-sidebar-alignment kb-responsive-align-control kb-responsive-align-${ type }` }>
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
