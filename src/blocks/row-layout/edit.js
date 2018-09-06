/**
 * BLOCK: Kadence Row / Layout
 */

/**
 * Import Icons
 */
import icons from './icon';

/**
 * Import External
 */
import times from 'lodash/times';
import map from 'lodash/map';
import classnames from 'classnames';
import memoize from 'memize';
import ResizableBox from 're-resizable';
/**
 * Import Css
 */
import './style.scss';
import './editor.scss';
const {
	Component,
	Fragment,
} = wp.element;
const {
	MediaUpload,
	InnerBlocks,
	InspectorControls,
	ColorPalette,
	BlockControls,
	BlockAlignmentToolbar,
} = wp.editor;
const {
	Button,
	ButtonGroup,
	Tooltip,
	TabPanel,
	IconButton,
	PanelColor,
	Dashicon,
	PanelBody,
	RangeControl,
	Toolbar,
	SelectControl,
} = wp.components;
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;

const ALLOWED_BLOCKS = [ 'kadence/column' ];
/**
 * Returns the layouts configuration for a given number of columns.
 *
 * @param {number} columns Number of columns.
 *
 * @return {Object[]} Columns layout configuration.
 */
const getColumnsTemplate = memoize( ( columns ) => {
	return times( columns, n => [ 'kadence/column', { id: n + 1 } ] );
} );

const overlayOpacityOutput = memoize( ( opacity ) => {
	if ( opacity < 10 ) {
		return '0.0' + opacity;
	} else if ( opacity >= 100 ) {
		return '1';
	}
	return '0.' + opacity;
} );

/**
 * Build the row edit
 */
class KadenceRowLayout extends Component {
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
		} else if ( this.props.attributes.uniqueID && this.props.attributes.uniqueID !== '_' + this.props.clientId.substr( 2, 9 ) ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
		}
	}
	render() {
		const { attributes: { uniqueID, columns, blockAlignment, mobileLayout, currentTab, colLayout, tabletLayout, columnGutter, collapseOrder, topPadding, bottomPadding, leftPadding, rightPadding, topPaddingM, bottomPaddingM, leftPaddingM, rightPaddingM, topMargin, bottomMargin, topMarginM, bottomMarginM, bgColor, bgImg, bgImgAttachment, bgImgSize, bgImgPosition, bgImgRepeat, bgImgID, verticalAlignment, overlayOpacity, overlayBgImg, overlayBgImgAttachment, overlayBgImgID, overlayBgImgPosition, overlayBgImgRepeat, overlayBgImgSize, currentOverlayTab, overlayBlendMode, overlayGradAngle, overlayGradLoc, overlayGradLocSecond, overlayGradType, overlay, overlaySecond, htmlTag, minHeight, maxWidth }, toggleSelection, className, setAttributes } = this.props;
		const layoutClass = ( ! colLayout ? 'equal' : colLayout );
		const tabLayoutClass = ( ! tabletLayout ? 'inherit' : tabletLayout );
		const mobileLayoutClass = ( ! mobileLayout ? 'inherit' : mobileLayout );
		const hasBG = ( bgColor || bgImg || overlay || overlayBgImg ? 'kt-row-has-bg' : '' );
		const classes = classnames( className, `kt-has-${ columns }-columns kt-row-layout-${ layoutClass } kt-row-valign-${ verticalAlignment } kt-tab-layout-${ tabLayoutClass } kt-mobile-layout-${ mobileLayoutClass } current-tab-${ currentTab } ${ hasBG }` );
		let layoutOptions;
		let mobileLayoutOptions;
		const startlayoutOptions = [
			{ key: 'equal', col: 1, name: __( 'Row' ), icon: icons.row },
			{ key: 'equal', col: 2, name: __( 'Two: Equal' ), icon: icons.twocol },
			{ key: 'left-golden', col: 2, name: __( 'Two: Left Heavy 66/33' ), icon: icons.twoleftgolden },
			{ key: 'right-golden', col: 2, name: __( 'Two: Right Heavy 33/66' ), icon: icons.tworightgolden },
			{ key: 'equal', col: 3, name: __( 'Three: Equal' ), icon: icons.threecol },
			{ key: 'left-half', col: 3, name: __( 'Three: Left Heavy 50/25/25' ), icon: icons.lefthalf },
			{ key: 'right-half', col: 3, name: __( 'Three: Right Heavy 25/25/50' ), icon: icons.righthalf },
			{ key: 'center-half', col: 3, name: __( 'Three: Center Heavy 25/50/25' ), icon: icons.centerhalf },
			{ key: 'center-wide', col: 3, name: __( 'Three: Wide Center 20/60/20' ), icon: icons.widecenter },
			{ key: 'center-exwide', col: 3, name: __( 'Three: Wider Center 15/70/15' ), icon: icons.exwidecenter },
			{ key: 'equal', col: 4, name: __( 'Four: Equal' ), icon: icons.fourcol },
			{ key: 'left-forty', col: 4, name: __( 'Four: Left Heavy 40/20/20/20' ), icon: icons.lfourforty },
			{ key: 'right-forty', col: 4, name: __( 'Four: Right Heavy 20/20/20/40' ), icon: icons.rfourforty },
			{ key: 'equal', col: 5, name: __( 'Five: Equal' ), icon: icons.fivecol },
			{ key: 'equal', col: 6, name: __( 'Six: Equal' ), icon: icons.sixcol },
		];
		if ( 2 === columns ) {
			layoutOptions = [
				{ key: 'equal', name: __( 'Equal' ), icon: icons.twocol },
				{ key: 'left-golden', name: __( 'Left Heavy 66/33' ), icon: icons.twoleftgolden },
				{ key: 'right-golden', name: __( 'Right Heavy 33/66' ), icon: icons.tworightgolden },
			];
		} else if ( 3 === columns ) {
			layoutOptions = [
				{ key: 'equal', name: __( 'Equal' ), icon: icons.threecol },
				{ key: 'left-half', name: __( 'Left Heavy 50/25/25' ), icon: icons.lefthalf },
				{ key: 'right-half', name: __( 'Right Heavy 25/25/50' ), icon: icons.righthalf },
				{ key: 'center-half', name: __( 'Center Heavy 25/50/25' ), icon: icons.centerhalf },
				{ key: 'center-wide', name: __( 'Wide Center 20/60/20' ), icon: icons.widecenter },
				{ key: 'center-exwide', name: __( 'Wider Center 15/70/15' ), icon: icons.exwidecenter },
			];
		} else if ( 4 === columns ) {
			layoutOptions = [
				{ key: 'equal', name: __( 'Equal' ), icon: icons.fourcol },
				{ key: 'left-forty', name: __( 'Left Heavy 40/20/20/20' ), icon: icons.lfourforty },
				{ key: 'right-forty', name: __( 'Right Heavy 20/20/20/40' ), icon: icons.rfourforty },
			];
		} else if ( 5 === columns ) {
			layoutOptions = [
				{ key: 'equal', name: __( 'Equal' ), icon: icons.fivecol },
			];
		} else if ( 6 === columns ) {
			layoutOptions = [
				{ key: 'equal', name: __( 'Equal' ), icon: icons.sixcol },
			];
		} else {
			layoutOptions = [
				{ key: 'equal', name: __( 'Single Row' ), icon: icons.row },
			];
		}
		if ( 2 === columns ) {
			mobileLayoutOptions = [
				{ key: 'equal', name: __( 'Equal' ), icon: icons.twocol },
				{ key: 'left-golden', name: __( 'Left Heavy 66/33' ), icon: icons.twoleftgolden },
				{ key: 'right-golden', name: __( 'Right Heavy 33/66' ), icon: icons.tworightgolden },
				{ key: 'row', name: __( 'Collapse to Rows' ), icon: icons.collapserow },
			];
		} else if ( 3 === columns ) {
			mobileLayoutOptions = [
				{ key: 'equal', name: __( 'Equal' ), icon: icons.threecol },
				{ key: 'left-half', name: __( 'Left Heavy 50/25/25' ), icon: icons.lefthalf },
				{ key: 'right-half', name: __( 'Right Heavy 25/25/50' ), icon: icons.righthalf },
				{ key: 'center-half', name: __( 'Center Heavy 25/50/25' ), icon: icons.centerhalf },
				{ key: 'center-wide', name: __( 'Wide Center 20/60/20' ), icon: icons.widecenter },
				{ key: 'center-exwide', name: __( 'Wider Center 15/70/15' ), icon: icons.exwidecenter },
				{ key: 'row', name: __( 'Collapse to Rows' ), icon: icons.collapserowthree },
			];
		} else if ( 4 === columns ) {
			mobileLayoutOptions = [
				{ key: 'equal', name: __( 'Equal' ), icon: icons.fourcol },
				{ key: 'left-forty', name: __( 'Left Heavy 40/20/20/20' ), icon: icons.lfourforty },
				{ key: 'right-forty', name: __( 'Right Heavy 20/20/20/40' ), icon: icons.rfourforty },
				{ key: 'two-grid', name: __( 'Two Column Grid' ), icon: icons.grid },
				{ key: 'row', name: __( 'Collapse to Rows' ), icon: icons.collapserowfour },
			];
		} else if ( 5 === columns ) {
			mobileLayoutOptions = [
				{ key: 'equal', name: __( 'Equal' ), icon: icons.fivecol },
				{ key: 'row', name: __( 'Collapse to Rows' ), icon: icons.collapserowfive },
			];
		} else if ( 6 === columns ) {
			mobileLayoutOptions = [
				{ key: 'equal', name: __( 'Equal' ), icon: icons.sixcol },
				{ key: 'two-grid', name: __( 'Two Column Grid' ), icon: icons.grid },
				{ key: 'three-grid', name: __( 'Three Column Grid' ), icon: icons.threegrid },
				{ key: 'row', name: __( 'Collapse to Rows' ), icon: icons.collapserowsix },
			];
		} else {
			mobileLayoutOptions = [
				{ key: 'row', name: __( 'Single Row' ), icon: icons.row },
			];
		}
		const onTabSelect = ( tabName ) => {
			setAttributes( { currentTab: tabName } );
		};
		const onOverlayTabSelect = ( tabName ) => {
			setAttributes( { currentOverlayTab: tabName } );
		};
		const onSelectImage = img => {
			setAttributes( {
				bgImgID: img.id,
				bgImg: img.url,
			} );
		};
		const onSelectOverlayImage = img => {
			setAttributes( {
				overlayBgImgID: img.id,
				overlayBgImg: img.url,
			} );
		};
		const onRemoveImage = () => {
			setAttributes( {
				bgImgID: null,
				bgImg: null,
			} );
		};
		const onRemoveOverlayImage = () => {
			setAttributes( {
				overlayBgImgID: null,
				overlayBgImg: null,
			} );
		};
		const mobileControls = (
			<div>
				<PanelBody>
					<p className="components-base-control__label">{ __( 'Mobile Layout' ) }</p>
					<ButtonGroup aria-label={ __( 'Mobile Layout' ) }>
						{ map( mobileLayoutOptions, ( { name, key, icon } ) => (
							<Tooltip text={ name }>
								<Button
									key={ key }
									className="kt-layout-btn"
									isSmall
									isPrimary={ mobileLayout === key }
									aria-pressed={ mobileLayout === key }
									onClick={ () => setAttributes( { mobileLayout: key } ) }
								>
									{ icon }
								</Button>
							</Tooltip>
						) ) }
					</ButtonGroup>
					{ columns > 1 && (
						<SelectControl
							label={ __( 'Collapse Order' ) }
							value={ collapseOrder }
							options={ [
								{ value: 'left-to-right', label: __( 'Left to Right' ) },
								{ value: 'right-to-left', label: __( 'Right to Left' ) },
							] }
							onChange={ collapseOrder => setAttributes( { collapseOrder } ) }
						/>
					) }
				</PanelBody>
				<PanelBody
					title={ __( 'Mobile Padding/Margin' ) }
					initialOpen={ false }
				>
					<RangeControl
						label={ __( 'Mobile top padding (px)' ) }
						value={ topPaddingM }
						className="kt-padding-inputs kt-top-padding"
						onChange={ ( topPaddingM ) => {
							setAttributes( {
								topPaddingM: topPaddingM,
							} );
						} }
						min={ 0 }
						max={ 500 }
					/>
					<RangeControl
						label={ __( 'Mobile bottom padding (px)' ) }
						value={ bottomPaddingM }
						className="kt-padding-inputs kt-bottom-padding"
						onChange={ ( bottomPaddingM ) => {
							setAttributes( {
								bottomPaddingM: bottomPaddingM,
							} );
						} }
						min={ 0 }
						max={ 500 }
					/>
					<RangeControl
						label={ __( 'Mobile right padding (px)' ) }
						value={ rightPaddingM }
						className="kt-padding-inputs kt-right-padding"
						onChange={ ( rightPaddingM ) => {
							setAttributes( {
								rightPaddingM: rightPaddingM,
							} );
						} }
						min={ 0 }
						max={ 500 }
					/>
					<RangeControl
						label={ __( 'Mobile left padding (px)' ) }
						value={ leftPaddingM }
						className="kt-padding-inputs kt-left-padding"
						onChange={ ( leftPaddingM ) => {
							setAttributes( {
								leftPaddingM: leftPaddingM,
							} );
						} }
						min={ 0 }
						max={ 500 }
					/>
					<RangeControl
						label={ __( 'Mobile top margin (px)' ) }
						value={ topMarginM }
						className="kt-padding-inputs kt-top-margin"
						onChange={ ( topMarginM ) => {
							setAttributes( {
								topMarginM: topMarginM,
							} );
						} }
						min={ 0 }
						max={ 200 }
					/>
					<RangeControl
						label={ __( 'Mobile bottom margin (px)' ) }
						value={ bottomMarginM }
						className="kt-padding-inputs kt-bottom-margin"
						onChange={ ( bottomMarginM ) => {
							setAttributes( {
								bottomMarginM: bottomMarginM,
							} );
						} }
						min={ 0 }
						max={ 200 }
					/>
				</PanelBody>
			</div>
		);
		const tabletControls = (
			<PanelBody>
				<p className="components-base-control__label">{ __( 'Tablet Layout' ) }</p>
				<ButtonGroup aria-label={ __( 'Tablet Layout' ) }>
					{ map( mobileLayoutOptions, ( { name, key, icon } ) => (
						<Tooltip text={ name }>
							<Button
								key={ key }
								className="kt-layout-btn"
								isSmall
								isPrimary={ tabletLayout === key }
								aria-pressed={ tabletLayout === key }
								onClick={ () => setAttributes( { tabletLayout: key } ) }
							>
								{ icon }
							</Button>
						</Tooltip>
					) ) }
				</ButtonGroup>
			</PanelBody>
		);

		const deskControls = (
			<div>
				<PanelBody>
					<RangeControl
						label={ __( 'Columns' ) }
						value={ columns }
						onChange={ ( nextColumns ) => {
							setAttributes( {
								columns: nextColumns,
								colLayout: 'equal',
								tabletLayout: 'inherit',
								mobileLayout: 'row',
							} );
						} }
						min={ 1 }
						max={ 6 }
					/>
					<p className="components-base-control__label">{ __( 'Layout' ) }</p>
					<ButtonGroup aria-label={ __( 'Column Layout' ) }>
						{ map( layoutOptions, ( { name, key, icon } ) => (
							<Tooltip text={ name }>
								<Button
									key={ key }
									className="kt-layout-btn"
									isSmall
									isPrimary={ colLayout === key }
									aria-pressed={ colLayout === key }
									onClick={ () => {
										setAttributes( {
											colLayout: key,
										} );
									} }
								>
									{ icon }
								</Button>
							</Tooltip>
						) ) }
					</ButtonGroup>
					{ columns > 1 && (
						<SelectControl
							label={ __( 'Column Gutter' ) }
							value={ columnGutter }
							options={ [
								{ value: 'default', label: __( 'Default: 30px' ) },
								{ value: 'none', label: __( 'No Gutter' ) },
								{ value: 'skinny', label: __( 'Skinny: 10px' ) },
								{ value: 'narrow', label: __( 'Narrow: 20px' ) },
								{ value: 'wide', label: __( 'Wide: 40px' ) },
								{ value: 'wider', label: __( 'Wider: 60px' ) },
								{ value: 'widest', label: __( 'Widest: 80px' ) },
							] }
							onChange={ columnGutter => setAttributes( { columnGutter } ) }
						/>
					) }
				</PanelBody>
				<PanelBody
					title={ __( 'Padding/Margin' ) }
					initialOpen={ false }
				>
					<RangeControl
						label={ __( 'Top padding (px)' ) }
						value={ topPadding }
						className="kt-padding-inputs kt-top-padding"
						onChange={ ( topPadding ) => {
							setAttributes( {
								topPadding: topPadding,
							} );
						} }
						min={ 0 }
						max={ 500 }
					/>
					<RangeControl
						label={ __( 'Bottom padding (px)' ) }
						value={ bottomPadding }
						className="kt-padding-inputs kt-bottom-padding"
						onChange={ ( bottomPadding ) => {
							setAttributes( {
								bottomPadding: bottomPadding,
							} );
						} }
						min={ 0 }
						max={ 500 }
					/>
					<RangeControl
						label={ __( 'Right padding (px)' ) }
						value={ rightPadding }
						className="kt-padding-inputs kt-right-padding"
						onChange={ ( rightPadding ) => {
							setAttributes( {
								rightPadding: rightPadding,
							} );
						} }
						min={ 0 }
						max={ 500 }
					/>
					<RangeControl
						label={ __( 'Left padding (px)' ) }
						value={ leftPadding }
						className="kt-padding-inputs kt-left-padding"
						onChange={ ( leftPadding ) => {
							setAttributes( {
								leftPadding: leftPadding,
							} );
						} }
						min={ 0 }
						max={ 500 }
					/>
					<RangeControl
						label={ __( 'Top Margin (px)' ) }
						value={ topMargin }
						className="kt-padding-inputs kt-top-margin"
						onChange={ ( topMargin ) => {
							setAttributes( {
								topMargin: topMargin,
							} );
						} }
						min={ 0 }
						max={ 200 }
					/>
					<RangeControl
						label={ __( 'Bottom Margin (px)' ) }
						value={ bottomMargin }
						className="kt-padding-inputs kt-bottom-margin"
						onChange={ ( bottomMargin ) => {
							setAttributes( {
								bottomMargin: bottomMargin,
							} );
						} }
						min={ 0 }
						max={ 200 }
					/>
				</PanelBody>
			</div>
		);
		const overControls = (
			<div>
				<RangeControl
					label={ __( 'Overlay Opacity' ) }
					value={ overlayOpacity }
					onChange={ ( overlayOpacity ) => {
						setAttributes( {
							overlayOpacity: overlayOpacity,
						} );
					} }
					min={ 0 }
					max={ 100 }
				/>
				<PanelColor
					title={ __( 'Overlay Color' ) }
					colorValue={ overlay }
				>
					<ColorPalette
						value={ overlay }
						onChange={ overlay => setAttributes( { overlay } ) }
					/>
				</PanelColor>
				<MediaUpload
					onSelect={ onSelectOverlayImage }
					type="image"
					value={ overlayBgImgID }
					render={ ( { open } ) => (
						<Button
							className={ 'components-button components-icon-button kt-cta-upload-btn' }
							onClick={ open }
						>
							<Dashicon icon="format-image" />
							{ __( 'Select Image' ) }
						</Button>
					) }
				/>
				{ overlayBgImg && (
					<Tooltip text={ __( 'Remove Image' ) }>
						<Button
							className={ 'components-button components-icon-button kt-remove-img kt-cta-upload-btn' }
							onClick={ onRemoveOverlayImage }
						>
							<Dashicon icon="no-alt" />
						</Button>
					</Tooltip>
				) }
				<SelectControl
					label={ __( 'Background Image Size' ) }
					value={ overlayBgImgSize }
					options={ [
						{ value: 'cover', label: __( 'Cover' ) },
						{ value: 'contain', label: __( 'Contain' ) },
						{ value: 'auto', label: __( 'Auto' ) },
					] }
					onChange={ overlayBgImgSize => setAttributes( { overlayBgImgSize } ) }
				/>
				<SelectControl
					label={ __( 'Background Image Position' ) }
					value={ overlayBgImgPosition }
					options={ [
						{ value: 'center top', label: __( 'Center Top' ) },
						{ value: 'center center', label: __( 'Center Center' ) },
						{ value: 'center bottom', label: __( 'Center Bottom' ) },
						{ value: 'left top', label: __( 'Left Top' ) },
						{ value: 'left center', label: __( 'Left Center' ) },
						{ value: 'left bottom', label: __( 'Center Bottom' ) },
						{ value: 'right top', label: __( 'Right Top' ) },
						{ value: 'right center', label: __( 'Right Center' ) },
						{ value: 'right bottom', label: __( 'Right Bottom' ) },
					] }
					onChange={ overlayBgImgPosition => setAttributes( { overlayBgImgPosition } ) }
				/>
				<SelectControl
					label={ __( 'Background Image Repeat' ) }
					value={ overlayBgImgRepeat }
					options={ [
						{ value: 'no-repeat', label: __( 'No Repeat' ) },
						{ value: 'repeat', label: __( 'Repeat' ) },
						{ value: 'repeat-x', label: __( 'Repeat-x' ) },
						{ value: 'repeat-y', label: __( 'Repeat-y' ) },
					] }
					onChange={ overlayBgImgRepeat => setAttributes( { overlayBgImgRepeat } ) }
				/>
				<SelectControl
					label={ __( 'Background Image Attachment' ) }
					value={ overlayBgImgAttachment }
					options={ [
						{ value: 'scroll', label: __( 'Scroll' ) },
						{ value: 'fixed', label: __( 'Fixed' ) },
					] }
					onChange={ overlayBgImgAttachment => setAttributes( { overlayBgImgAttachment } ) }
				/>
				<SelectControl
					label={ __( 'Blend Mode' ) }
					value={ overlayBlendMode }
					options={ [
						{ value: 'normal', label: __( 'Normal' ) },
						{ value: 'multiply', label: __( 'Multiply' ) },
						{ value: 'screen', label: __( 'Screen' ) },
						{ value: 'overlay', label: __( 'Overlay' ) },
						{ value: 'darken', label: __( 'Darken' ) },
						{ value: 'lighten', label: __( 'Lighten' ) },
						{ value: 'color-dodge', label: __( 'Color Dodge' ) },
						{ value: 'color-burn', label: __( 'Color Burn' ) },
						{ value: 'difference', label: __( 'Difference' ) },
						{ value: 'exclusion', label: __( 'Exclusion' ) },
						{ value: 'hue', label: __( 'Hue' ) },
						{ value: 'saturation', label: __( 'Saturation' ) },
						{ value: 'color', label: __( 'Color' ) },
						{ value: 'luminosity', label: __( 'Luminosity' ) },

					] }
					onChange={ overlayBlendMode => setAttributes( { overlayBlendMode } ) }
				/>
				<p>{ __( 'Notice: Blend Mode not supported in all browsers' ) }</p>
			</div>
		);
		const overGradControls = (
			<div>
				<RangeControl
					label={ __( 'Overlay Opacity' ) }
					value={ overlayOpacity }
					onChange={ ( overlayOpacity ) => {
						setAttributes( {
							overlayOpacity: overlayOpacity,
						} );
					} }
					min={ 0 }
					max={ 100 }
				/>
				<PanelColor
					title={ __( 'Color' ) }
					colorValue={ overlay }
				>
					<ColorPalette
						value={ overlay }
						onChange={ overlay => setAttributes( { overlay } ) }
					/>
				</PanelColor>
				<RangeControl
					label={ __( 'Location' ) }
					value={ overlayGradLoc }
					onChange={ ( overlayGradLoc ) => {
						setAttributes( {
							overlayGradLoc: overlayGradLoc,
						} );
					} }
					min={ 0 }
					max={ 100 }
				/>
				<PanelColor
					title={ __( 'Second Color' ) }
					colorValue={ overlaySecond }
				>
					<ColorPalette
						value={ overlaySecond }
						onChange={ overlaySecond => setAttributes( { overlaySecond } ) }
					/>
				</PanelColor>
				<RangeControl
					label={ __( 'Location' ) }
					value={ overlayGradLocSecond }
					onChange={ ( overlayGradLocSecond ) => {
						setAttributes( {
							overlayGradLocSecond: overlayGradLocSecond,
						} );
					} }
					min={ 0 }
					max={ 100 }
				/>
				<SelectControl
					label={ __( 'Gradient Type' ) }
					value={ overlayGradType }
					options={ [
						{ value: 'linear', label: __( 'Linear' ) },
						{ value: 'radial', label: __( 'Radial' ) },
					] }
					onChange={ overlayGradType => setAttributes( { overlayGradType } ) }
				/>
				{ overlayGradType && 'linear' === overlayGradType && (
					<RangeControl
						label={ __( 'Gradient Angle' ) }
						value={ overlayGradAngle }
						onChange={ ( overlayGradAngle ) => {
							setAttributes( {
								overlayGradAngle: overlayGradAngle,
							} );
						} }
						min={ 0 }
						max={ 360 }
					/>
				) }
				{ overlayGradType && 'radial' === overlayGradType && (
					<SelectControl
						label={ __( 'Gradient Position' ) }
						value={ overlayBgImgPosition }
						options={ [
							{ value: 'center top', label: __( 'Center Top' ) },
							{ value: 'center center', label: __( 'Center Center' ) },
							{ value: 'center bottom', label: __( 'Center Bottom' ) },
							{ value: 'left top', label: __( 'Left Top' ) },
							{ value: 'left center', label: __( 'Left Center' ) },
							{ value: 'left bottom', label: __( 'Center Bottom' ) },
							{ value: 'right top', label: __( 'Right Top' ) },
							{ value: 'right center', label: __( 'Right Center' ) },
							{ value: 'right bottom', label: __( 'Right Bottom' ) },
						] }
						onChange={ overlayBgImgPosition => setAttributes( { overlayBgImgPosition } ) }
					/>
				) }
				<SelectControl
					label={ __( 'Blend Mode' ) }
					value={ overlayBlendMode }
					options={ [
						{ value: 'normal', label: __( 'Normal' ) },
						{ value: 'multiply', label: __( 'Multiply' ) },
						{ value: 'screen', label: __( 'Screen' ) },
						{ value: 'overlay', label: __( 'Overlay' ) },
						{ value: 'darken', label: __( 'Darken' ) },
						{ value: 'lighten', label: __( 'Lighten' ) },
						{ value: 'color-dodge', label: __( 'Color Dodge' ) },
						{ value: 'color-burn', label: __( 'Color Burn' ) },
						{ value: 'difference', label: __( 'Difference' ) },
						{ value: 'exclusion', label: __( 'Exclusion' ) },
						{ value: 'hue', label: __( 'Hue' ) },
						{ value: 'saturation', label: __( 'Saturation' ) },
						{ value: 'color', label: __( 'Color' ) },
						{ value: 'luminosity', label: __( 'Luminosity' ) },

					] }
					onChange={ overlayBlendMode => setAttributes( { overlayBlendMode } ) }
				/>
				<p>{ __( 'Notice: Blend Mode not supported in all browsers' ) }</p>
			</div>
		);
		const overlayControls = (
			<PanelBody
				title={ __( 'Background Overlay Settings' ) }
				initialOpen={ false }
			>
				<TabPanel className="kt-inspect-tabs kt-gradient-tabs"
					activeClass="active-tab"
					initialTabName={ currentOverlayTab }
					onSelect={ onOverlayTabSelect }
					tabs={ [
						{
							name: 'normal',
							title: __( 'Normal' ),
							className: 'kt-over-normal',
						},
						{
							name: 'grad',
							title: __( 'Gradient' ),
							className: 'kt-over-grad',
						},
					] }>
					{
						( tabName ) => {
							let tabout;
							if ( 'grad' === tabName ) {
								tabout = overGradControls;
							} else {
								tabout = overControls;
							}
							return <div>{ tabout }</div>;
						}
					}
				</TabPanel>
			</PanelBody>
		);
		const backgroundControls = (
			<PanelBody
				title={ __( 'Background Settings' ) }
				initialOpen={ false }
			>
				<PanelColor
					title={ __( 'Background Color' ) }
					colorValue={ bgColor }
				>
					<ColorPalette
						value={ bgColor }
						onChange={ bgColor => setAttributes( { bgColor } ) }
					/>
				</PanelColor>
				<MediaUpload
					onSelect={ onSelectImage }
					type="image"
					value={ bgImgID }
					render={ ( { open } ) => (
						<Button
							className={ 'components-button components-icon-button kt-cta-upload-btn' }
							onClick={ open }
						>
							<Dashicon icon="format-image" />
							{ __( 'Select Image' ) }
						</Button>
					) }
				/>
				{ bgImg && (
					<Tooltip text={ __( 'Remove Image' ) }>
						<Button
							className={ 'components-button components-icon-button kt-remove-img kt-cta-upload-btn' }
							onClick={ onRemoveImage }
						>
							<Dashicon icon="no-alt" />
						</Button>
					</Tooltip>
				) }
				<SelectControl
					label={ __( 'Background Image Size' ) }
					value={ bgImgSize }
					options={ [
						{ value: 'cover', label: __( 'Cover' ) },
						{ value: 'contain', label: __( 'Contain' ) },
						{ value: 'auto', label: __( 'Auto' ) },
					] }
					onChange={ bgImgSize => setAttributes( { bgImgSize } ) }
				/>
				<SelectControl
					label={ __( 'Background Image Size' ) }
					value={ bgImgPosition }
					options={ [
						{ value: 'center top', label: __( 'Center Top' ) },
						{ value: 'center center', label: __( 'Center Center' ) },
						{ value: 'center bottom', label: __( 'Center Bottom' ) },
						{ value: 'left top', label: __( 'Left Top' ) },
						{ value: 'left center', label: __( 'Left Center' ) },
						{ value: 'left bottom', label: __( 'Center Bottom' ) },
						{ value: 'right top', label: __( 'Right Top' ) },
						{ value: 'right center', label: __( 'Right Center' ) },
						{ value: 'right bottom', label: __( 'Right Bottom' ) },
					] }
					onChange={ bgImgPosition => setAttributes( { bgImgPosition } ) }
				/>
				<SelectControl
					label={ __( 'Background Image Repeat' ) }
					value={ bgImgRepeat }
					options={ [
						{ value: 'no-repeat', label: __( 'No Repeat' ) },
						{ value: 'repeat', label: __( 'Repeat' ) },
						{ value: 'repeat-x', label: __( 'Repeat-x' ) },
						{ value: 'repeat-y', label: __( 'Repeat-y' ) },
					] }
					onChange={ bgImgRepeat => setAttributes( { bgImgRepeat } ) }
				/>
				<SelectControl
					label={ __( 'Background Image Attachment' ) }
					value={ bgImgAttachment }
					options={ [
						{ value: 'scroll', label: __( 'Scroll' ) },
						{ value: 'fixed', label: __( 'Fixed' ) },
					] }
					onChange={ bgImgAttachment => setAttributes( { bgImgAttachment } ) }
				/>
			</PanelBody>
		);
		const tabControls = (
			<TabPanel className="kt-inspect-tabs"
				activeClass="active-tab"
				initialTabName={ currentTab }
				onSelect={ onTabSelect }
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
					( tabName ) => {
						let tabout;
						if ( 'mobile' === tabName ) {
							tabout = mobileControls;
						} else if ( 'tablet' === tabName ) {
							tabout = tabletControls;
						} else {
							tabout = deskControls;
						}
						return <div>{ tabout }</div>;
					}
				}
			</TabPanel>
		);
		return (
			<Fragment>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ blockAlignment }
						controls={ [ 'center', 'wide', 'full' ] }
						onChange={ blockAlignment => setAttributes( { blockAlignment } ) }
					/>
					<Toolbar>
						<MediaUpload
							onSelect={ onSelectImage }
							type="image"
							value={ null }
							render={ ( { open } ) => (
								<IconButton
									className="components-toolbar__control"
									label={ __( 'Background Image' ) }
									icon="format-image"
									onClick={ open }
								/>
							) }
						/>
					</Toolbar>
					<Toolbar>
						<Tooltip text={ __( 'Vertical Align Top' ) }>
							<Button
								className={ classnames(
									'components-icon-button',
									'components-toolbar__control',
									{ 'is-active': verticalAlignment === 'top' },
								) }
								onClick={ () => setAttributes( { verticalAlignment: 'top' } ) }
							>
								{ icons.aligntop }
							</Button>
						</Tooltip>
					</Toolbar>
					<Toolbar>
						<Tooltip text={ __( 'Vertical Align Middle' ) }>
							<Button
								className={ classnames(
									'components-icon-button',
									'components-toolbar__control',
									{ 'is-active': verticalAlignment === 'middle' },
								) }
								onClick={ () => setAttributes( { verticalAlignment: 'middle' } ) }
							>
								{ icons.alignmiddle }
							</Button>
						</Tooltip>
					</Toolbar>
					<Toolbar>
						<Tooltip text={ __( 'Vertical Align Bottom' ) }>
							<Button
								className={ classnames(
									'components-icon-button',
									'components-toolbar__control',
									{ 'is-active': verticalAlignment === 'bottom' },
								) }
								onClick={ () => setAttributes( { verticalAlignment: 'bottom' } ) }
							>
								{ icons.alignbottom }
							</Button>
						</Tooltip>
					</Toolbar>
				</BlockControls>
				<InspectorControls>
					{ tabControls }
					{ backgroundControls }
					{ overlayControls }
					<PanelBody
						title={ __( 'Structure Settings' ) }
						initialOpen={ false }
					>
						<SelectControl
							label={ __( 'Container HTML tag' ) }
							value={ htmlTag }
							options={ [
								{ value: 'div', label: __( 'div' ) },
								{ value: 'section', label: __( 'section' ) },
								{ value: 'article', label: __( 'article' ) },
								{ value: 'main', label: __( 'main' ) },
								{ value: 'aside', label: __( 'aside' ) },
							] }
							onChange={ htmlTag => setAttributes( { htmlTag } ) }
						/>
						<RangeControl
							label={ __( 'Minimium Height' ) }
							value={ minHeight }
							onChange={ ( minHeight ) => {
								setAttributes( {
									minHeight: minHeight,
								} );
							} }
							min={ 0 }
							max={ 1000 }
						/>
						<RangeControl
							label={ __( 'Content Max Width' ) }
							value={ maxWidth }
							onChange={ ( maxWidth ) => {
								setAttributes( {
									maxWidth: maxWidth,
								} );
							} }
							min={ 0 }
							max={ 2000 }
						/>
					</PanelBody>
				</InspectorControls>
				<div className={ classes } data-bg-img-id={ bgImgID } style={ {
					backgroundColor: ( bgColor ? bgColor : undefined ),
					backgroundImage: ( bgImg ? `url(${ bgImg })` : undefined ),
					backgroundSize: bgImgSize,
					backgroundPosition: bgImgPosition,
					backgroundRepeat: bgImgRepeat,
					backgroundAttachment: bgImgAttachment,
					marginBottom: bottomMargin,
					marginTop: topMargin,
				} }>
					{ ( ! currentOverlayTab || 'grad' !== currentOverlayTab ) && (
						<div className={ 'kt-row-layout-overlay kt-row-overlay-normal' } data-bg-img-id={ overlayBgImgID } style={ {
							backgroundColor: ( overlay ? overlay : undefined ),
							backgroundImage: ( overlayBgImg ? `url(${ overlayBgImg })` : undefined ),
							backgroundSize: overlayBgImgSize,
							backgroundPosition: overlayBgImgPosition,
							backgroundRepeat: overlayBgImgRepeat,
							backgroundAttachment: overlayBgImgAttachment,
							mixBlendMode: overlayBlendMode,
							opacity: overlayOpacityOutput( overlayOpacity ),
						} }>
						</div>
					) }
					{ currentOverlayTab && 'grad' === currentOverlayTab && (
						<div className={ 'kt-row-layout-overlay kt-row-overlay-gradient' } data-bg-img-id={ overlayBgImgID } style={ {
							backgroundImage: ( 'radial' === overlayGradType ? `radial-gradient(at ${ overlayBgImgPosition }, ${ overlay } ${ overlayGradLoc }%, ${ overlaySecond } ${ overlayGradLocSecond }%)` : `linear-gradient(${ overlayGradAngle }deg, ${ overlay } ${ overlayGradLoc }%, ${ overlaySecond } ${ overlayGradLocSecond }%)` ),
							mixBlendMode: overlayBlendMode,
							opacity: overlayOpacityOutput( overlayOpacity ),
						} }>
						</div>
					) }
					{ ! colLayout && (
						<div className="kt-select-layout">
							<div className="kt-select-layout-title">
								{ __( 'Select Your Layout' ) }
							</div>
							<ButtonGroup aria-label={ __( 'Column Layout' ) }>
								{ map( startlayoutOptions, ( { name, key, icon, col } ) => (
									<Tooltip text={ name }>
										<Button
											key={ key }
											className="kt-layout-btn"
											isSmall
											onClick={ () => setAttributes( {
												colLayout: key,
												columns: col,
											} ) }
										>
											{ icon }
										</Button>
									</Tooltip>
								) ) }
							</ButtonGroup>
						</div>
					) }
					<div style={ { height: '1px' } }></div>
					{ colLayout && (
						<ResizableBox
							size={ {
								height: topPadding,
							} }
							minHeight="0"
							handleClasses={ {
								top: 'wp-block-kadence-rowlayout-handler-top',
								bottom: 'wp-block-kadence-rowlayout-handler-bottom',
							} }
							enable={ {
								top: true,
								right: false,
								bottom: false,
								left: false,
								topRight: false,
								bottomRight: false,
								bottomLeft: false,
								topLeft: false,
							} }
							className={ 'kt-top-padding-resize kt-padding-resize-box' }
							onResize={ ( event, direction, elt, delta ) => {
								document.getElementById( 'row-top-' + uniqueID ).innerHTML = parseInt( topPadding + delta.height, 10 ) + 'px';
							} }
							onResizeStop={ ( event, direction, elt, delta ) => {
								setAttributes( {
									topPadding: parseInt( topPadding + delta.height, 10 ),
								} );
								toggleSelection( true );
							} }
							onResizeStart={ () => {
								toggleSelection( false );
							} }
						>
							{ uniqueID && (
								<div className="kt-row-padding">
									<span id={ `row-top-${ uniqueID }` } >
										{ topPadding + 'px' }
									</span>
								</div>
							) }
						</ResizableBox>
					) }
					{ colLayout && (
						<div className="innerblocks-wrap" style={ {
							maxWidth: maxWidth + 'px',
							minHeight: minHeight + 'px',
							paddingLeft: leftPadding + 'px',
							paddingRight: rightPadding + 'px',
						} }>
							<InnerBlocks
								template={ getColumnsTemplate( columns ) }
								templateLock="all"
								allowedBlocks={ ALLOWED_BLOCKS } />
						</div>
					) }
					{ colLayout && (
						<ResizableBox
							size={ {
								height: bottomPadding,
							} }
							minHeight="0"
							handleClasses={ {
								top: 'wp-block-kadence-rowlayout-handler-top',
								bottom: 'wp-block-kadence-rowlayout-handler-bottom',
							} }
							enable={ {
								top: false,
								right: false,
								bottom: true,
								left: false,
								topRight: false,
								bottomRight: false,
								bottomLeft: false,
								topLeft: false,
							} }
							className={ 'kt-bottom-padding-resize kt-padding-resize-box' }
							onResize={ ( event, direction, elt, delta ) => {
								document.getElementById( 'row-bottom-' + uniqueID ).innerHTML = parseInt( bottomPadding + delta.height, 10 ) + 'px';
							} }
							onResizeStop={ ( event, direction, elt, delta ) => {
								setAttributes( {
									bottomPadding: parseInt( bottomPadding + delta.height, 10 ),
								} );
								toggleSelection( true );
							} }
							onResizeStart={ () => {
								toggleSelection( false );
							} }
						>
							{ uniqueID && (
								<div className="kt-row-padding">
									<span id={ `row-bottom-${ uniqueID }` } >
										{ bottomPadding + 'px' }
									</span>
								</div>
							) }
						</ResizableBox>
					) }
					<div style={ { height: '1px' } }></div>
				</div>
			</Fragment>
		);
	}
}
export default ( KadenceRowLayout );
