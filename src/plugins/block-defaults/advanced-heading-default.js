import TypographyControls from '../../components/typography/typography-control';
import range from 'lodash/range';
import map from 'lodash/map';
import AdvancedPopColorControl from '../../advanced-pop-color-control-default';
import HeadingLevelIcon from '../../blocks/advanced-heading/heading-icons';
/**
 * Internal block libraries
 */
import { __, sprintf } from '@wordpress/i18n';
const {
	Component,
	Fragment,
} = wp.element;
const {
	AlignmentToolbar,
} = wp.blockEditor;
const {
	PanelBody,
	Toolbar,
	RangeControl,
	ButtonGroup,
	Button,
	Dashicon,
	Modal,
	SelectControl,
} = wp.components;

import icons from '../../icons';

class KadenceAdvancedHeadingDefault extends Component {
	constructor() {
		super( ...arguments );
		this.saveConfig = this.saveConfig.bind( this );
		this.saveConfigState = this.saveConfigState.bind( this );
		this.clearDefaults = this.clearDefaults.bind( this );
		this.clearAllDefaults = this.clearAllDefaults.bind( this );
		this.state = {
			isOpen: false,
			isSaving: false,
			resetConfirm: false,
			configuration: ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : {} ),
		};
	}
	saveConfig( blockID, settingArray ) {
		this.setState( { isSaving: true } );
		const config = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : {} );
		if ( ! config[ blockID ] ) {
			config[ blockID ] = {};
		}
		config[ blockID ] = settingArray;
		const settingModel = new wp.api.models.Settings( { kadence_blocks_config_blocks: JSON.stringify( config ) } );
		settingModel.save().then( response => {
			this.setState( { isSaving: false, configuration: config, isOpen: false } );
			kadence_blocks_params.configuration = JSON.stringify( config );
		} );
	}
	saveConfigState( key, value ) {
		const config = this.state.configuration;
		if ( config[ 'kadence/advancedheading' ] === undefined || config[ 'kadence/advancedheading' ].length == 0 ) {
			config[ 'kadence/advancedheading' ] = {};
		}
		config[ 'kadence/advancedheading' ][ key ] = value;
		this.setState( { configuration: config } );
	}
	clearDefaults( key ) {
		const config = this.state.configuration;
		if ( config[ 'kadence/advancedheading' ] === undefined || config[ 'kadence/advancedheading' ].length == 0 ) {
			config[ 'kadence/advancedheading' ] = {};
		}
		if ( undefined !== config[ 'kadence/advancedheading' ][ key ] ) {
			delete config[ 'kadence/advancedheading' ][ key ];
		}
		this.setState( { configuration: config } );
	}
	clearAllDefaults() {
		const config = this.state.configuration;
		config[ 'kadence/advancedheading' ] = {};
		this.setState( { configuration: config } );
	}
	render() {
		const { configuration, isOpen } = this.state;
		const headingConfig = ( configuration && configuration[ 'kadence/advancedheading' ] ? configuration[ 'kadence/advancedheading' ] : {} );
		const marginTypes = [
			{ key: 'px', name: __( 'px' ) },
			{ key: 'em', name: __( 'em' ) },
			{ key: '%', name: __( '%' ) },
			{ key: 'vh', name: __( 'vh' ) },
			{ key: 'rem', name: __( 'rem' ) },
		];
		const marginMin = ( ( undefined !== headingConfig.marginType ? headingConfig.marginType : 'px' ) === 'em' || ( undefined !== headingConfig.marginType ? headingConfig.marginType : 'px' ) === 'rem' ? 0.1 : 1 );
		const marginMax = ( ( undefined !== headingConfig.marginType ? headingConfig.marginType : 'px' ) === 'em' || ( undefined !== headingConfig.marginType ? headingConfig.marginType : 'px' ) === 'rem' ? 12 : 100 );
		const marginStep = ( ( undefined !== headingConfig.marginType ? headingConfig.marginType : 'px' ) === 'em' || ( undefined !== headingConfig.marginType ? headingConfig.marginType : 'px' ) === 'rem' ? 0.1 : 1 );
		const createLevelControl = ( targetLevel ) => {
			return [ {
				icon: 'heading',
				title: sprintf(
					/* translators: %d: heading level e.g: "1", "2", "3" */
					__( 'Heading %d', 'kadence-blocks' ),
					targetLevel
					),
				isActive: targetLevel === ( undefined !== headingConfig.level ? headingConfig.level : 2 ),
				onClick: () => this.saveConfigState( 'level', targetLevel ),
				subscript: String( targetLevel ),
			} ];
		};
		const level = ( undefined !== headingConfig.level ? headingConfig.level : 2 );
		const htmlTag = ( undefined !== headingConfig.htmlTag ? headingConfig.htmlTag : 'heading' );
		const sizeTypes = [
			{ key: 'px', name: __( 'px' ) },
			{ key: 'em', name: __( 'em' ) },
			{ key: 'rem', name: __( 'rem' ) },
		];
		const headingOptions = [
			[
				{
					icon: <HeadingLevelIcon level={ 1 } isPressed={ ( 1 === level && htmlTag && htmlTag === 'heading' ? true : false ) } />,
					title: __( 'Heading 1', 'kadence-blocks' ),
					isActive: ( 1 === level && htmlTag && htmlTag === 'heading' ? true : false ),
					onClick: () => {
						this.saveConfigState( 'level', 1 );
						this.saveConfigState( 'htmlTag', 'heading' );
					},
				},
			],
			[
				{
					icon: <HeadingLevelIcon level={ 2 } isPressed={ ( 2 === level && htmlTag && htmlTag === 'heading' ? true : false ) } />,
					title: __( 'Heading 2', 'kadence-blocks' ),
					isActive: ( 2 === level && htmlTag && htmlTag === 'heading' ? true : false ),
					onClick: () => {
						this.saveConfigState( 'level', 2 );
						this.saveConfigState( 'htmlTag', 'heading' );
					},
				},
			],
			[
				{
					icon: <HeadingLevelIcon level={ 3 } isPressed={ ( 3 === level && htmlTag && htmlTag === 'heading' ? true : false ) } />,
					title: __( 'Heading 3', 'kadence-blocks' ),
					isActive: ( 3 === level && htmlTag && htmlTag === 'heading' ? true : false ),
					onClick: () => {
						this.saveConfigState( 'level', 3 );
						this.saveConfigState( 'htmlTag', 'heading' );
					},
				},
			],
			[
				{
					icon: <HeadingLevelIcon level={ 4 } isPressed={ ( 4 === level && htmlTag && htmlTag === 'heading' ? true : false ) } />,
					title: __( 'Heading 4', 'kadence-blocks' ),
					isActive: ( 4 === level && htmlTag && htmlTag === 'heading' ? true : false ),
					onClick: () => {
						this.saveConfigState( 'level', 4 );
						this.saveConfigState( 'htmlTag', 'heading' );
					},
				},
			],
			[
				{
					icon: <HeadingLevelIcon level={ 5 } isPressed={ ( 5 === level && htmlTag && htmlTag === 'heading' ? true : false ) } />,
					title: __( 'Heading 5', 'kadence-blocks' ),
					isActive: ( 5 === level && htmlTag && htmlTag === 'heading' ? true : false ),
					onClick: () => {
						this.saveConfigState( 'level', 5 );
						this.saveConfigState( 'htmlTag', 'heading' );
					},
				},
			],
			[
				{
					icon: <HeadingLevelIcon level={ 6 } isPressed={ ( 6 === level && htmlTag && htmlTag === 'heading' ? true : false ) } />,
					title: __( 'Heading 6', 'kadence-blocks' ),
					isActive: ( 6 === level && htmlTag && htmlTag === 'heading' ? true : false ),
					onClick: () => {
						this.saveConfigState( 'level', 6 );
						this.saveConfigState( 'htmlTag', 'heading' );
					},
				},
			],
			[
				{
					icon: <HeadingLevelIcon level={ 'p' } isPressed={ ( htmlTag && htmlTag === 'p' ? true : false ) } />,
					title: __( 'Paragraph', 'kadence-blocks' ),
					isActive: ( htmlTag && htmlTag === 'p' ? true : false ),
					onClick: () => {
						this.saveConfigState( 'htmlTag', 'p' );
					},
				},
			],
		];
		return (
			<Fragment>
				<Button className="kt-block-defaults" onClick={ () => this.setState( { isOpen: true } ) }>
					<span className="kt-block-icon">{ icons.headingBlock }</span>
					{ __( 'Advanced Text', 'kadence-blocks' ) }
				</Button>
				{ isOpen ?
					<Modal
						className="kt-block-defaults-modal"
						title={ __( 'Kadence Advanced Text', 'kadence-blocks' ) }
						onRequestClose={ () => {
							this.saveConfig( 'kadence/advancedheading', headingConfig );
						} }>
						<PanelBody
							title={ __( 'Advanced Text Controls', 'kadence-blocks' ) }
							initialOpen={ true }
						>
							<div className="components-base-control">
								<p className="kt-setting-label">{ __( 'HTML Tag', 'kadence-blocks' ) }</p>
								<Toolbar controls={ headingOptions } />
							</div>
							<div className="components-base-control">
								<p className="kt-setting-label">{ __( 'Alignment', 'kadence-blocks' ) }</p>
								<AlignmentToolbar
									value={ ( undefined !== headingConfig.align ? headingConfig.align : '' ) }
									onChange={ ( nextAlign ) => {
										this.saveConfigState( 'align', nextAlign );
									} }
								/>
							</div>
							<div className="components-base-control">
								<AdvancedPopColorControl
									label={ __( 'Color', 'kadence-blocks' ) }
									colorValue={ ( undefined !== headingConfig.color ? headingConfig.color : '' ) }
									colorDefault={ '' }
									onColorChange={ value => this.saveConfigState( 'color', value ) }
								/>
							</div>
							<div className="components-base-control">
								<p className="kt-setting-label">{ __( 'Font Size Units', 'kadence-blocks' ) }</p>
								<ButtonGroup className="kt-size-type-options-defaults" aria-label={ __( 'Size Type' ) }>
									{ map( sizeTypes, ( { name, key } ) => (
										<Button
											key={ key }
											className="kt-size-btn"
											isSmall
											isPrimary={ ( undefined !== headingConfig.sizeType ? headingConfig.sizeType : 'px' ) === key }
											aria-pressed={ ( undefined !== headingConfig.sizeType ? headingConfig.sizeType : 'px' ) === key }
											onClick={ () => this.saveConfigState( 'sizeType', key ) }
										>
											{ name }
										</Button>
									) ) }
								</ButtonGroup>
							</div>
							<div className="components-base-control">
								<p className="kt-setting-label">{ __( 'Line Heights Units', 'kadence-blocks' ) }</p>
								<ButtonGroup className="kt-size-type-options-defaults" aria-label={ __( 'Size Type', 'kadence-blocks' ) }>
									{ map( sizeTypes, ( { name, key } ) => (
										<Button
											key={ key }
											className="kt-size-btn"
											isSmall
											isPrimary={ ( undefined !== headingConfig.lineType ? headingConfig.lineType : 'px' ) === key }
											aria-pressed={ ( undefined !== headingConfig.lineType ? headingConfig.lineType : 'px' ) === key }
											onClick={ () => this.saveConfigState( 'lineType', key ) }
										>
											{ name }
										</Button>
									) ) }
								</ButtonGroup>
							</div>
						</PanelBody>
						<PanelBody
							title={ __( 'Advanced Typography Settings', 'kadence-blocks' ) }
							initialOpen={ false }
						>
							<TypographyControls
								letterSpacing={ ( undefined !== headingConfig.letterSpacing ? headingConfig.letterSpacing : '' ) }
								onLetterSpacing={ ( value ) => this.saveConfigState( 'letterSpacing', value ) }
								fontFamily={ ( undefined !== headingConfig.typography ? headingConfig.typography : '' ) }
								onFontFamily={ ( value ) => this.saveConfigState( 'typography', value ) }
								onFontChange={ ( select ) => {
									this.saveConfigState( 'typography', select.value );
									this.saveConfigState( 'googleFont', select.google );
								} }
								googleFont={ ( undefined !== headingConfig.googleFont ? headingConfig.googleFont : false ) }
								onGoogleFont={ ( value ) => this.saveConfigState( 'googleFont', value ) }
								loadGoogleFont={ ( undefined !== headingConfig.loadGoogleFont ? headingConfig.loadGoogleFont : true ) }
								onLoadGoogleFont={ ( value ) => this.saveConfigState( 'loadGoogleFont', value ) }
								fontVariant={ ( undefined !== headingConfig.fontVariant ? headingConfig.fontVariant : '' ) }
								onFontVariant={ ( value ) => this.saveConfigState( 'fontVariant', value ) }
								fontWeight={ ( undefined !== headingConfig.fontWeight ? headingConfig.fontWeight : 'regular' ) }
								onFontWeight={ ( value ) => this.saveConfigState( 'fontWeight', value ) }
								fontStyle={ ( undefined !== headingConfig.fontStyle ? headingConfig.fontStyle : 'normal' ) }
								onFontStyle={ ( value ) => this.saveConfigState( 'fontStyle', value ) }
								fontSubset={ ( undefined !== headingConfig.fontSubset ? headingConfig.fontSubset : '' ) }
								onFontSubset={ ( value ) => this.saveConfigState( 'fontSubset', value ) }
								textTransform={ ( undefined !== headingConfig.textTransform ? headingConfig.textTransform : '' ) }
								onTextTransform={ ( value ) => this.saveConfigState( 'textTransform', value ) }
							/>
						</PanelBody>
						<PanelBody
							title={ __( 'Highlight Settings', 'kadence-blocks' ) }
							initialOpen={ false }
						>
							<div className="components-base-control">
								<AdvancedPopColorControl
									label={ __( 'Highlight Color', 'kadence-blocks' ) }
									colorValue={ ( undefined !== headingConfig.markColor ? headingConfig.markColor : '#f76a0c' ) }
									colorDefault={ '#f76a0c' }
									onColorChange={ value => this.saveConfigState( 'markColor', value ) }
								/>
							</div>
							<div className="components-base-control">
								<AdvancedPopColorControl
									label={ __( 'Highlight Background', 'kadence-blocks' ) }
									colorValue={ ( undefined !== headingConfig.markBG ? headingConfig.markBG : '' ) }
									colorDefault={ '' }
									onColorChange={ value => this.saveConfigState( 'markBG', value ) }
									opacityValue={ ( undefined !== headingConfig.markBGOpacity ? headingConfig.markBGOpacity : 1 ) }
									onOpacityChange={ value => this.saveConfigState( 'markBGOpacity', value ) }
								/>
							</div>
							<AdvancedPopColorControl
								label={ __( 'Highlight Border Color', 'kadence-blocks' ) }
								colorValue={ ( undefined !== headingConfig.markBorder ? headingConfig.markBorder : '' ) }
								colorDefault={ '' }
								onColorChange={ value => this.saveConfigState( 'markBorder', value ) }
								opacityValue={ ( undefined !== headingConfig.markBorderOpacity ? headingConfig.markBorderOpacity : 1 ) }
								onOpacityChange={ value => this.saveConfigState( 'markBorderOpacity', value ) }
							/>
							<SelectControl
								label={ __( 'Highlight Border Style', 'kadence-blocks' ) }
								value={ ( undefined !== headingConfig.markBorderStyle ? headingConfig.markBorderStyle : 'solid' ) }
								options={ [
									{ value: 'solid', label: __( 'Solid' ) },
									{ value: 'dashed', label: __( 'Dashed' ) },
									{ value: 'dotted', label: __( 'Dotted' ) },
								] }
								onChange={ value => this.saveConfigState( 'markBorderStyle', value ) }
							/>
							<RangeControl
								label={ __( 'Highlight Border Width', 'kadence-blocks' ) }
								value={ ( undefined !== headingConfig.markBorderWidth ? headingConfig.markBorderWidth : 0 ) }
								onChange={ value => this.saveConfigState( 'markBorderWidth', value ) }
								min={ 0 }
								max={ 20 }
								step={ 1 }
							/>
							<div className="components-base-control">
								<p className="kt-setting-label">{ __( 'Mark Font Size Units', 'kadence-blocks' ) }</p>
								<ButtonGroup className="kt-size-type-options-defaults" aria-label={ __( 'Size Type', 'kadence-blocks' ) }>
									{ map( sizeTypes, ( { name, key } ) => (
										<Button
											key={ key }
											className="kt-size-btn"
											isSmall
											isPrimary={ ( undefined !== headingConfig.markSizeType ? headingConfig.markSizeType : 'px' ) === key }
											aria-pressed={ ( undefined !== headingConfig.markSizeType ? headingConfig.markSizeType : 'px' ) === key }
											onClick={ () => this.saveConfigState( 'markSizeType', key ) }
										>
											{ name }
										</Button>
									) ) }
								</ButtonGroup>
							</div>
							<div className="components-base-control">
								<p className="kt-setting-label">{ __( 'Mark Line Heights Units', 'kadence-blocks' ) }</p>
								<ButtonGroup className="kt-size-type-options-defaults" aria-label={ __( 'Size Type', 'kadence-blocks' ) }>
									{ map( sizeTypes, ( { name, key } ) => (
										<Button
											key={ key }
											className="kt-size-btn"
											isSmall
											isPrimary={ ( undefined !== headingConfig.markLineType ? headingConfig.markLineType : 'px' ) === key }
											aria-pressed={ ( undefined !== headingConfig.markLineType ? headingConfig.markLineType : 'px' ) === key }
											onClick={ () => this.saveConfigState( 'markLineType', key ) }
										>
											{ name }
										</Button>
									) ) }
								</ButtonGroup>
							</div>
							<TypographyControls
								letterSpacing={ ( undefined !== headingConfig.markLetterSpacing ? headingConfig.markLetterSpacing : '' ) }
								onLetterSpacing={ ( value ) => this.saveConfigState( 'markLetterSpacing', value ) }
								fontFamily={ ( undefined !== headingConfig.markTypography ? headingConfig.markTypography : '' ) }
								onFontFamily={ ( value ) => this.saveConfigState( 'markTypography', value ) }
								onFontChange={ ( select ) => {
									this.saveConfigState( 'markTypography', select.value );
									this.saveConfigState( 'markGoogleFont', select.google );
								} }
								googleFont={ ( undefined !== headingConfig.markGoogleFont ? headingConfig.markGoogleFont : false ) }
								onGoogleFont={ ( value ) => this.saveConfigState( 'markGoogleFont', value ) }
								loadGoogleFont={ ( undefined !== headingConfig.markLoadGoogleFont ? headingConfig.markLoadGoogleFont : true ) }
								onLoadGoogleFont={ ( value ) => this.saveConfigState( 'markLoadGoogleFont', value ) }
								fontVariant={ ( undefined !== headingConfig.markFontVariant ? headingConfig.markFontVariant : '' ) }
								onFontVariant={ ( value ) => this.saveConfigState( 'markFontVariant', value ) }
								fontWeight={ ( undefined !== headingConfig.markFontWeight ? headingConfig.markFontWeight : 'regular' ) }
								onFontWeight={ ( value ) => this.saveConfigState( 'markFontWeight', value ) }
								fontStyle={ ( undefined !== headingConfig.markFontStyle ? headingConfig.markFontStyle : 'normal' ) }
								onFontStyle={ ( value ) => this.saveConfigState( 'markFontStyle', value ) }
								fontSubset={ ( undefined !== headingConfig.markFontSubset ? headingConfig.markFontSubset : '' ) }
								onFontSubset={ ( value ) => this.saveConfigState( 'markFontSubset', value ) }
								padding={ ( undefined !== headingConfig.markPadding ? headingConfig.markPadding : [ 0, 0, 0, 0 ] ) }
								onPadding={ ( value ) => this.saveConfigState( 'markPadding', value ) }
								paddingControl={ ( undefined !== headingConfig.markPaddingControl ? headingConfig.markPaddingControl : 'linked' ) }
								onPaddingControl={ ( value ) => this.saveConfigState( 'markPaddingControl', value ) }
								textTransform={ ( undefined !== headingConfig.markTextTransform ? headingConfig.markTextTransform : '' ) }
								onTextTransform={ ( value ) => this.saveConfigState( 'markTextTransform', value ) }
							/>
						</PanelBody>
						<PanelBody
							title={ __( 'Margin Settings', 'kadence-blocks' ) }
							initialOpen={ false }
						>
							<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Margin Type', 'kadence-blocks' ) }>
								{ map( marginTypes, ( { name, key } ) => (
									<Button
										key={ key }
										className="kt-size-btn"
										isSmall
										isPrimary={ ( undefined !== headingConfig.marginType ? headingConfig.marginType : 'px' ) === key }
										aria-pressed={ ( undefined !== headingConfig.marginType ? headingConfig.marginType : 'px' ) === key }
										onClick={ () => this.saveConfigState( 'marginType', key ) }
									>
										{ name }
									</Button>
								) ) }
							</ButtonGroup>
							<RangeControl
								label={ __( 'Top Margin', 'kadence-blocks' ) }
								value={ ( undefined !== headingConfig.topMargin ? headingConfig.topMargin : '' ) }
								onChange={ ( value ) => this.saveConfigState( 'topMargin', value ) }
								min={ marginMin }
								max={ marginMax }
								step={ marginStep }
							/>
							<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Margin Type', 'kadence-blocks' ) }>
								{ map( marginTypes, ( { name, key } ) => (
									<Button
										key={ key }
										className="kt-size-btn"
										isSmall
										isPrimary={ ( undefined !== headingConfig.marginType ? headingConfig.marginType : 'px' ) === key }
										aria-pressed={ ( undefined !== headingConfig.marginType ? headingConfig.marginType : 'px' ) === key }
										onClick={ () => this.saveConfigState( 'marginType', key ) }
									>
										{ name }
									</Button>
								) ) }
							</ButtonGroup>
							<RangeControl
								label={ __( 'Bottom Margin', 'kadence-blocks' ) }
								value={ ( undefined !== headingConfig.bottomMargin ? headingConfig.bottomMargin : '' ) }
								onChange={ ( value ) => this.saveConfigState( 'bottomMargin', value ) }
								min={ marginMin }
								max={ marginMax }
								step={ marginStep }
							/>
						</PanelBody>
						<div className="kb-modal-footer">
							{ ! this.state.resetConfirm && (
								<Button className="kt-defaults-save" isDestructive disabled={ ( JSON.stringify( this.state.configuration[ 'kadence/advancedheading' ] ) === JSON.stringify( {} ) ? true : false ) } onClick={ () => {
									this.setState( { resetConfirm: true } );
								} }>
									{ __( 'Reset', 'kadence-blocks' ) }
								</Button>
							) }
							{ this.state.resetConfirm && (
								<Button className="kt-defaults-save" isDestructive onClick={ () => {
									this.clearAllDefaults();
									this.setState( { resetConfirm: false } );
								} }>
									{ __( 'Confirm Reset', 'kadence-blocks' ) }
								</Button>
							) }
							<Button className="kt-defaults-save" isPrimary onClick={ () => {
								this.saveConfig( 'kadence/advancedheading', headingConfig );
							} }>
								{ __( 'Save/Close', 'kadence-blocks' ) }
							</Button>
						</div>
					</Modal>
					: null }
			</Fragment>
		);
	}
}
export default KadenceAdvancedHeadingDefault;
