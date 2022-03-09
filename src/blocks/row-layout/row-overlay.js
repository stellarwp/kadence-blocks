/**
 * BLOCK Section: Kadence Row / Layout Overlay
 */

 import memoize from 'memize';

 import KadenceColorOutput from '../../components/color/kadence-color-output';

import {
	Component,
	Fragment,
} from '@wordpress/element';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
const overlayOpacityOutput = memoize( ( opacity ) => {
	if ( opacity < 10 ) {
		return '0.0' + opacity;
	} else if ( opacity >= 100 ) {
		return '1';
	}
	return '0.' + opacity;
} );

class Overlay extends Component {
	constructor() {
		super( ...arguments );
		this.getPreviewSize = this.getPreviewSize.bind( this );
	}
	getPreviewSize( device, desktopSize, tabletSize, mobileSize ) {
		if ( device === 'Mobile' ) {
			if ( undefined !== mobileSize && '' !== mobileSize && null !== mobileSize ) {
				return mobileSize;
			} else if ( undefined !== tabletSize && '' !== tabletSize && null !== tabletSize ) {
				return tabletSize;
			}
		} else if ( device === 'Tablet' ) {
			if ( undefined !== tabletSize && '' !== tabletSize && null !== tabletSize ) {
				return tabletSize;
			}
		}
		return desktopSize;
	}
	render() {
		const { attributes: { uniqueID, columns, mobileLayout, currentTab, colLayout, tabletLayout, columnGutter, collapseGutter, collapseOrder, topPadding, bottomPadding, leftPadding, rightPadding, topPaddingM, bottomPaddingM, leftPaddingM, rightPaddingM, topMargin, bottomMargin, topMarginM, bottomMarginM, bgColor, bgImg, bgImgAttachment, bgImgSize, bgImgPosition, bgImgRepeat, bgImgID, verticalAlignment, overlayOpacity, overlayBgImg, overlayBgImgAttachment, overlayBgImgID, overlayBgImgPosition, overlayBgImgRepeat, overlayBgImgSize, currentOverlayTab, overlayBlendMode, overlayGradAngle, overlayGradLoc, overlayGradLocSecond, overlayGradType, overlay, overlaySecond, tabletOverlay,  mobileOverlay, overlaySecondOpacity, overlayFirstOpacity }, toggleSelection, className, setAttributes, clientId } = this.props;
		// Overlay Color.
		const previewOverlayColor = this.getPreviewSize( this.props.getPreviewDevice, ( overlay ? KadenceColorOutput( overlay, ( undefined !== overlayFirstOpacity && '' !== overlayFirstOpacity ? overlayFirstOpacity : 1 ) ) : undefined ), ( undefined !== tabletOverlay && tabletOverlay[0] && tabletOverlay[0].overlay && tabletOverlay[0].enable ? KadenceColorOutput( tabletOverlay[0].overlay ) : '' ), ( undefined !== mobileOverlay && mobileOverlay[0] && mobileOverlay[0].overlay && mobileOverlay[0].enable ? KadenceColorOutput( mobileOverlay[0].overlay ) : '' ) );
		const previewOverlaySecondColor = this.getPreviewSize( this.props.getPreviewDevice, ( overlaySecond ? KadenceColorOutput( overlaySecond, ( undefined !== overlaySecondOpacity && '' !== overlaySecondOpacity ? overlaySecondOpacity : 1 ) ) : undefined ), KadenceColorOutput( undefined !== tabletOverlay && tabletOverlay[0] && tabletOverlay[0].overlaySecond && tabletOverlay[0].enable ? tabletOverlay[0].overlaySecond : '' ), KadenceColorOutput( undefined !== mobileOverlay && mobileOverlay[0] && mobileOverlay[0].overlaySecond && mobileOverlay[0].enable ? mobileOverlay[0].overlaySecond : '' ) );
		// Overlay Tab.
		const previewCurrentOverlayTab = this.getPreviewSize( this.props.getPreviewDevice, ( currentOverlayTab ? currentOverlayTab : 'normal' ), ( undefined !== tabletOverlay && tabletOverlay[0] && tabletOverlay[0].currentOverlayTab && tabletOverlay[0].enable ? tabletOverlay[0].currentOverlayTab : '' ), ( undefined !== mobileOverlay && mobileOverlay[0] && mobileOverlay[0].currentOverlayTab && mobileOverlay[0].enable ? mobileOverlay[0].currentOverlayTab : '' ) );
		// Grad Type.
		const previewOverlayGradType = this.getPreviewSize( this.props.getPreviewDevice, ( overlayGradType ? overlayGradType : 'linear' ), ( undefined !== tabletOverlay && tabletOverlay[0] && tabletOverlay[0].overlayGradType && tabletOverlay[0].enable ? tabletOverlay[0].overlayGradType : '' ), ( undefined !== mobileOverlay && mobileOverlay[0] && mobileOverlay[0].overlayGradType && mobileOverlay[0].enable ? mobileOverlay[0].overlayGradType : '' ) );
		// Grad Angle.
		const previewOverlayGradAngle = this.getPreviewSize( this.props.getPreviewDevice, ( overlayGradAngle ? overlayGradAngle : 180 ), ( undefined !== tabletOverlay && tabletOverlay[0] && tabletOverlay[0].overlayGradAngle && tabletOverlay[0].enable ? tabletOverlay[0].overlayGradAngle : '' ), ( undefined !== mobileOverlay && mobileOverlay[0] && mobileOverlay[0].overlayGradAngle && mobileOverlay[0].enable ? mobileOverlay[0].overlayGradAngle : '' ) );
		// Overlay Background Image.
		const previewOverlayImage = this.getPreviewSize( this.props.getPreviewDevice, ( overlayBgImg ? `url(${ overlayBgImg })` : undefined ), ( undefined !== tabletOverlay && tabletOverlay[0] && tabletOverlay[0].overlayBgImg && tabletOverlay[0].enable ? `url(${ tabletOverlay[0].overlayBgImg })` : '' ), ( undefined !== mobileOverlay && mobileOverlay[0] && mobileOverlay[0].overlayBgImg && mobileOverlay[0].enable ? `url(${ mobileOverlay[0].overlayBgImg })` : '' ) );

		const previewOverlaySize = this.getPreviewSize( this.props.getPreviewDevice, ( overlayBgImgSize ? overlayBgImgSize : undefined ), ( undefined !== tabletOverlay && tabletOverlay[0] && tabletOverlay[0].overlayBgImgSize && tabletOverlay[0].enable ? tabletOverlay[0].overlayBgImgSize : '' ), ( undefined !== mobileOverlay && mobileOverlay[0] && mobileOverlay[0].overlayBgImgSize && mobileOverlay[0].enable ? mobileOverlay[0].overlayBgImgSize : '' ) );
		const previewOverlayPosition = this.getPreviewSize( this.props.getPreviewDevice, ( overlayBgImgPosition ? overlayBgImgPosition : undefined ), ( undefined !== tabletOverlay && tabletOverlay[0] && tabletOverlay[0].overlayBgImgPosition && tabletOverlay[0].enable ? tabletOverlay[0].overlayBgImgPosition : '' ), ( undefined !== mobileOverlay && mobileOverlay[0] && mobileOverlay[0].overlayBgImgPosition && mobileOverlay[0].enable ? mobileOverlay[0].overlayBgImgPosition : '' ) );
		const previewOverlayRepeat = this.getPreviewSize( this.props.getPreviewDevice, ( overlayBgImgRepeat ? overlayBgImgRepeat : undefined ), ( undefined !== tabletOverlay && tabletOverlay[0] && tabletOverlay[0].overlayBgImgRepeat && tabletOverlay[0].enable ? tabletOverlay[0].overlayBgImgRepeat : '' ), ( undefined !== mobileOverlay && mobileOverlay[0] && mobileOverlay[0].overlayBgImgRepeat && mobileOverlay[0].enable ? mobileOverlay[0].overlayBgImgRepeat : '' ) );
		const previewOverlayAttachment = this.getPreviewSize( this.props.getPreviewDevice, ( overlayBgImgAttachment ? overlayBgImgAttachment : undefined ), ( undefined !== tabletOverlay && tabletOverlay[0] && tabletOverlay[0].overlayBgImgAttachment && tabletOverlay[0].enable ? tabletOverlay[0].overlayBgImgAttachment : '' ), ( undefined !== mobileOverlay && mobileOverlay[0] && mobileOverlay[0].overlayBgImgAttachment && mobileOverlay[0].enable ? mobileOverlay[0].overlayBgImgAttachment : '' ) );
		const previewOverlayOpacity = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== overlayOpacity ? overlayOpacity : undefined ), ( undefined !== tabletOverlay && tabletOverlay[0] && '' !== tabletOverlay[0].overlayOpacity && tabletOverlay[0].enable ? tabletOverlay[0].overlayOpacity : '' ), ( undefined !== mobileOverlay && mobileOverlay[0] && '' !== mobileOverlay[0].overlayOpacity && mobileOverlay[0].enable ? mobileOverlay[0].overlayOpacity : '' ) );
		const previewOverlayBlendMode = this.getPreviewSize( this.props.getPreviewDevice, ( overlayBlendMode ? overlayBlendMode : undefined ), ( undefined !== tabletOverlay && tabletOverlay[0] && tabletOverlay[0].overlayBlendMod && tabletOverlay[0].enable ? tabletOverlay[0].overlayBlendMod : '' ), ( undefined !== mobileOverlay && mobileOverlay[0] && mobileOverlay[0].overlayBlendMod && mobileOverlay[0].enable ? mobileOverlay[0].overlayBlendMod : '' ) );
		const previewOverlayGradLoc = this.getPreviewSize( this.props.getPreviewDevice, ( overlayGradLoc ? overlayGradLoc : 0 ), ( undefined !== tabletOverlay && tabletOverlay[0] && tabletOverlay[0].overlayGradLoc && tabletOverlay[0].enable ? tabletOverlay[0].overlayGradLoc : '' ), ( undefined !== mobileOverlay && mobileOverlay[0] && mobileOverlay[0].overlayGradLoc && mobileOverlay[0].enable ? mobileOverlay[0].overlayGradLoc : '' ) );

		const previewOverlayGradLocSecond = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== overlayGradLocSecond ? overlayGradLocSecond : 100 ), ( undefined !== tabletOverlay && tabletOverlay[0] && tabletOverlay[0].overlayGradLocSecond && tabletOverlay[0].enable ? tabletOverlay[0].overlayGradLocSecond : '' ), ( undefined !== mobileOverlay && mobileOverlay[0] && mobileOverlay[0].overlayGradLocSecond && mobileOverlay[0].enable ? mobileOverlay[0].overlayGradLocSecond : '' ) );
		return (
			<Fragment>
				{ ( ! previewCurrentOverlayTab || 'grad' !== previewCurrentOverlayTab ) && (
					<div className={ `kt-row-layout-overlay kt-row-overlay-normal${ previewOverlayImage && previewOverlayAttachment === 'parallax' ? ' kt-jarallax' : '' }` } data-bg-img-id={ overlayBgImgID } style={ {
						backgroundColor: ( previewOverlayColor ? previewOverlayColor : undefined ),
						backgroundImage: ( previewOverlayImage ? previewOverlayImage : undefined ),
						backgroundSize: ( previewOverlaySize ? previewOverlaySize : undefined ),
						backgroundPosition: ( previewOverlayPosition ? previewOverlayPosition : undefined ),
						backgroundRepeat: ( previewOverlayRepeat ? previewOverlayRepeat : undefined ),
						backgroundAttachment: ( previewOverlayAttachment === 'parallax' ? 'fixed' : previewOverlayAttachment ),
						mixBlendMode:  ( previewOverlayBlendMode ? previewOverlayBlendMode : undefined ),
						opacity: ( undefined !== previewOverlayOpacity && Number.isInteger( previewOverlayOpacity ) ? overlayOpacityOutput( previewOverlayOpacity ) : undefined ),
					} }>
					</div>
				) }
				{ previewCurrentOverlayTab && 'grad' === previewCurrentOverlayTab && (
					<div className={ 'kt-row-layout-overlay kt-row-overlay-gradient' } data-bg-img-id={ overlayBgImgID } style={ {
						backgroundImage: ( 'radial' === previewOverlayGradType ? `radial-gradient(at ${ previewOverlayPosition }, ${ ( previewOverlayColor ? previewOverlayColor : '' ) } ${ previewOverlayGradLoc }%, ${ ( previewOverlaySecondColor ? previewOverlaySecondColor : '' ) } ${ previewOverlayGradLocSecond }%)` : `linear-gradient(${ previewOverlayGradAngle }deg, ${ ( previewOverlayColor ? previewOverlayColor : '' ) } ${ previewOverlayGradLoc }%, ${ ( previewOverlaySecondColor ? previewOverlaySecondColor : '' ) } ${ previewOverlayGradLocSecond }%)` ),
						mixBlendMode:  ( previewOverlayBlendMode ? previewOverlayBlendMode : undefined ),
						opacity: ( undefined !== previewOverlayOpacity && Number.isInteger( previewOverlayOpacity ) ? overlayOpacityOutput( previewOverlayOpacity ) : undefined ),
					} }>
					</div>
				) }
			</Fragment>
		);
	}
}
export default compose( [
	withSelect( ( select, ownProps ) => {
		return {
			getPreviewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
		};
	} ),
] )( Overlay );
