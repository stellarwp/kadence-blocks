/**
 * BLOCK: Kadence Icon
 */

/**
 * Import Icons
 */
import editorIcons from '../../icons';

/**
 * Import Icon stuff
 */
import times from 'lodash/times';
import map from 'lodash/map';
import IconControl from '../../icon-control';
import IconRender from '../../icon-render';
import AdvancedColorControl from '../../advanced-color-control';
/**
 * Import Css
 */
import './style.scss';
import './editor.scss';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;

const {
	InspectorControls,
	URLInput,
	BlockControls,
	AlignmentToolbar,
	BlockAlignmentToolbar,
} = wp.blockEditor;
const {
	Component,
	Fragment,
} = wp.element;
const {
	PanelBody,
	RangeControl,
	TextControl,
	SelectControl,
	Button,
	ButtonGroup,
	Tooltip,
} = wp.components;

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const kticonUniqueIDs = [];

class KadenceIcons extends Component {
	constructor() {
		super( ...arguments );
		this.saveArrayUpdate = this.saveArrayUpdate.bind( this );
		this.state = {
			marginControl: 'linked',
			user: ( kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin' ),
		};
	}
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			kticonUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else if ( kticonUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			kticonUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else {
			kticonUniqueIDs.push( this.props.attributes.uniqueID );
		}
	}
	saveArrayUpdate( value, index ) {
		const { attributes, setAttributes } = this.props;
		const { icons } = attributes;

		const newItems = icons.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			icons: newItems,
		} );
	}
	render() {
		const { attributes: { iconCount, icons, blockAlignment, textAlignment }, className, setAttributes, clientId } = this.props;
		const { marginControl } = this.state;
		const controlTypes = [
			{ key: 'linked', name: __( 'Linked' ), micon: editorIcons.linked },
			{ key: 'individual', name: __( 'Individual' ), micon: editorIcons.individual },
		];
		const renderIconSettings = ( index ) => {
			return (
				<PanelBody
					title={ __( 'Icon' ) + ' ' + ( index + 1 ) + ' ' + __( 'Settings' ) }
					initialOpen={ ( 1 === iconCount ? true : false ) }
				>
					<IconControl
						value={ icons[ index ].icon }
						onChange={ value => {
							this.saveArrayUpdate( { icon: value }, index );
						} }
					/>
					<RangeControl
						label={ __( 'Icon Size' ) }
						value={ icons[ index ].size }
						onChange={ value => {
							this.saveArrayUpdate( { size: value }, index );
						} }
						min={ 5 }
						max={ 250 }
					/>
					{ icons[ index ].icon && 'fe' === icons[ index ].icon.substring( 0, 2 ) && (
						<RangeControl
							label={ __( 'Line Width' ) }
							value={ icons[ index ].width }
							onChange={ value => {
								this.saveArrayUpdate( { width: value }, index );
							} }
							step={ 0.5 }
							min={ 0.5 }
							max={ 4 }
						/>
					) }
					<AdvancedColorControl
						label={ __( 'Icon Color' ) }
						colorValue={ ( icons[ index ].color ? icons[ index ].color : '' ) }
						colorDefault={ '' }
						onColorChange={ value => {
							this.saveArrayUpdate( { color: value }, index );
						} }
					/>
					<SelectControl
						label={ __( 'Icon Style' ) }
						value={ icons[ index ].style }
						options={ [
							{ value: 'default', label: __( 'Default' ) },
							{ value: 'stacked', label: __( 'Stacked' ) },
						] }
						onChange={ value => {
							this.saveArrayUpdate( { style: value }, index );
						} }
					/>
					{ icons[ index ].style !== 'default' && (
						<Fragment>
							<AdvancedColorControl
								label={ __( 'background Color' ) }
								colorValue={ ( icons[ index ].background ? icons[ index ].background : '' ) }
								colorDefault={ '' }
								onColorChange={ value => {
									this.saveArrayUpdate( { background: value }, index );
								} }
							/>
						</Fragment>
					) }
					{ icons[ index ].style !== 'default' && (
						<Fragment>
							<AdvancedColorControl
								label={ __( 'Border Color' ) }
								colorValue={ ( icons[ index ].border ? icons[ index ].border : '' ) }
								colorDefault={ '' }
								onColorChange={ value => {
									this.saveArrayUpdate( { border: value }, index );
								} }
							/>
						</Fragment>
					) }
					{ icons[ index ].style !== 'default' && (
						<RangeControl
							label={ __( 'Border Size (px)' ) }
							value={ icons[ index ].borderWidth }
							onChange={ value => {
								this.saveArrayUpdate( { borderWidth: value }, index );
							} }
							min={ 0 }
							max={ 20 }
						/>
					) }
					{ icons[ index ].style !== 'default' && (
						<RangeControl
							label={ __( 'Border Radius (%)' ) }
							value={ icons[ index ].borderRadius }
							onChange={ value => {
								this.saveArrayUpdate( { borderRadius: value }, index );
							} }
							min={ 0 }
							max={ 50 }
						/>
					) }
					{ icons[ index ].style !== 'default' && (
						<RangeControl
							label={ __( 'Padding (px)' ) }
							value={ icons[ index ].padding }
							onChange={ value => {
								this.saveArrayUpdate( { padding: value }, index );
							} }
							min={ 0 }
							max={ 180 }
						/>
					) }
					<ButtonGroup className="kt-size-type-options kt-outline-control" aria-label={ __( 'Margin Control Type' ) }>
						{ map( controlTypes, ( { name, key, micon } ) => (
							<Tooltip text={ name }>
								<Button
									key={ key }
									className="kt-size-btn"
									isSmall
									isPrimary={ marginControl === key }
									aria-pressed={ marginControl === key }
									onClick={ () => this.setState( { marginControl: key } ) }
								>
									{ micon }
								</Button>
							</Tooltip>
						) ) }
					</ButtonGroup>
					{ marginControl && marginControl !== 'individual' && (
						<RangeControl
							label={ __( 'Margin (px)' ) }
							value={ ( icons[ index ].marginTop ? icons[ index ].marginTop : 0 ) }
							onChange={ ( value ) => {
								this.saveArrayUpdate( {
									marginTop: value,
									marginRight: value,
									marginBottom: value,
									marginLeft: value,
								}, index );
							} }
							min={ 0 }
							max={ 180 }
							step={ 1 }
						/>
					) }
					{ marginControl && marginControl === 'individual' && (
						<Fragment>
							<p>{ __( 'Margin (px)' ) }</p>
							<RangeControl
								className="kt-icon-rangecontrol"
								label={ editorIcons.outlinetop }
								value={ ( icons[ index ].marginTop ? icons[ index ].marginTop : 0 ) }
								onChange={ value => {
									this.saveArrayUpdate( { marginTop: value }, index );
								} }
								min={ 0 }
								max={ 180 }
								step={ 1 }
							/>
							<RangeControl
								className="kt-icon-rangecontrol"
								label={ editorIcons.outlineright }
								value={ ( icons[ index ].marginRight ? icons[ index ].marginRight : 0 ) }
								onChange={ value => {
									this.saveArrayUpdate( { marginRight: value }, index );
								} }
								min={ 0 }
								max={ 180 }
								step={ 1 }
							/>
							<RangeControl
								className="kt-icon-rangecontrol"
								label={ editorIcons.outlinebottom }
								value={ ( icons[ index ].marginBottom ? icons[ index ].marginBottom : 0 ) }
								onChange={ value => {
									this.saveArrayUpdate( { marginBottom: value }, index );
								} }
								min={ 0 }
								max={ 180 }
								step={ 1 }
							/>
							<RangeControl
								className="kt-icon-rangecontrol"
								label={ editorIcons.outlineleft }
								value={ ( icons[ index ].marginLeft ? icons[ index ].marginLeft : 0 ) }
								onChange={ value => {
									this.saveArrayUpdate( { marginLeft: value }, index );
								} }
								min={ 0 }
								max={ 180 }
								step={ 1 }
							/>
						</Fragment>
					) }
					<p className="components-base-control__label">{ __( 'Link' ) }</p>
					<URLInput
						autoFocus={ false }
						value={ icons[ index ].link }
						className="kt-btn-link-input"
						onChange={ value => {
							this.saveArrayUpdate( { link: value }, index );
						} }
					/>
					<SelectControl
						label={ __( 'Link Target' ) }
						value={ icons[ index ].target }
						options={ [
							{ value: '_self', label: __( 'Same Window' ) },
							{ value: '_blank', label: __( 'New Window' ) },
						] }
						onChange={ value => {
							this.saveArrayUpdate( { target: value }, index );
						} }
					/>
					<TextControl
						label={ __( 'Title for Accessibility' ) }
						value={ icons[ index ].title }
						onChange={ value => {
							this.saveArrayUpdate( { title: value }, index );
						} }
					/>
				</PanelBody>
			);
		};
		const renderSettings = (
			<div>
				{ times( iconCount, n => renderIconSettings( n ) ) }
			</div>
		);
		const renderIconsPreview = ( index ) => {
			return (
				<div className={ `kt-svg-style-${ icons[ index ].style } kt-svg-icon-wrap kt-svg-item-${ index }` } >
					{ icons[ index ].icon && (
						<IconRender className={ `kt-svg-icon kt-svg-icon-${ icons[ index ].icon }` } name={ icons[ index ].icon } size={ icons[ index ].size } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } style={ {
							color: ( icons[ index ].color ? icons[ index ].color : undefined ),
							backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? icons[ index ].background : undefined ),
							padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
							borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? icons[ index ].border : undefined ),
							borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
							borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
							marginTop: ( icons[ index ].marginTop ? icons[ index ].marginTop + 'px' : undefined ),
							marginRight: ( icons[ index ].marginRight ? icons[ index ].marginRight + 'px' : undefined ),
							marginBottom: ( icons[ index ].marginBottom ? icons[ index ].marginBottom + 'px' : undefined ),
							marginLeft: ( icons[ index ].marginLeft ? icons[ index ].marginLeft + 'px' : undefined ),
						} } />
					) }
				</div>
			);
		};
		return (
			<div className={ className }>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ blockAlignment }
						controls={ [ 'center', 'left', 'right' ] }
						onChange={ value => setAttributes( { blockAlignment: value } ) }
					/>
					<AlignmentToolbar
						value={ textAlignment }
						onChange={ value => setAttributes( { textAlignment: value } ) }
					/>
				</BlockControls>
				<InspectorControls>
					<PanelBody
						title={ __( 'Icon Count' ) }
						initialOpen={ true }
					>
						<RangeControl
							label={ __( 'Number of Icons' ) }
							value={ iconCount }
							onChange={ newcount => {
								const newicons = icons;
								if ( newicons.length < newcount ) {
									const amount = Math.abs( newcount - newicons.length );
									{ times( amount, n => {
										newicons.push( {
											icon: newicons[ 0 ].icon,
											link: newicons[ 0 ].link,
											target: newicons[ 0 ].target,
											size: newicons[ 0 ].size,
											width: newicons[ 0 ].width,
											title: newicons[ 0 ].title,
											color: newicons[ 0 ].color,
											background: newicons[ 0 ].background,
											border: newicons[ 0 ].border,
											borderRadius: newicons[ 0 ].borderRadius,
											borderWidth: newicons[ 0 ].borderWidth,
											padding: newicons[ 0 ].padding,
											style: newicons[ 0 ].style,
											marginTop: ( newicons[ 0 ].marginTop ? newicons[ 0 ].marginTop : 0 ),
											marginRight: ( newicons[ 0 ].marginRight ? newicons[ 0 ].marginRight : 0 ),
											marginBottom: ( newicons[ 0 ].marginBottom ? newicons[ 0 ].marginBottom : 0 ),
											marginLeft: ( newicons[ 0 ].marginLeft ? newicons[ 0 ].marginLeft : 0 ),
										} );
									} ); }
									setAttributes( { icons: newicons } );
									this.saveArrayUpdate( { title: icons[ 0 ].title }, 0 );
								}
								setAttributes( { iconCount: newcount } );
							} }
							min={ 1 }
							max={ 10 }
						/>
					</PanelBody>
					{ renderSettings }
				</InspectorControls>
				<div className={ `kt-svg-icons ${ clientId }` } style={ {
					textAlign: ( textAlignment ? textAlignment : 'center' ),
				} } >
					{ times( iconCount, n => renderIconsPreview( n ) ) }
				</div>
			</div>
		);
	}
}
export default ( KadenceIcons );

