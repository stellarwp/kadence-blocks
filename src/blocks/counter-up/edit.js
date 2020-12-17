/**
 * BLOCK: Kadence Counter Up
 */

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import KadenceColorOutput from '../../kadence-color-output';
import WebfontLoader from '../../fontloader';

/**
 * Import External
 */
import CountUp from 'react-countup';
import classnames from 'classnames';

/**
 * Import Css
 */
import './style.scss';
import './editor.scss';

/**
 * Internal block libraries
 */
const { createBlock } = wp.blocks;
const { withSelect, withDispatch } = wp.data;
const { compose } = wp.compose;
const { Component, Fragment } = wp.element;
const { RichText } = wp.blockEditor;
const { __, sprintf } = wp.i18n;

/**
 * Build the counter up edit
 */
class KadenceCounterUp extends Component {
	constructor() {
		super( ...arguments );

	}

	componentDidMount() {

		const { attributes } = this.props;
		const { uniqueID } = attributes;

		if ( ! uniqueID ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
		}

		this.props.setAttributes( {
			titleFont: [...this.props.attributes.titleFont],
		} );

		this.props.setAttributes( {
			numberFont: [...this.props.attributes.numberFont],
		} );
	}

	render() {

		const {
			clientId,
			attributes,
			className,
			isSelected,
			setAttributes
		} = this.props;

		const {
			uniqueID,
			title,
			start,
			end,
			prefix,
			suffix,
			duration,
			separator,
			displayTitle,
			titleFont,
			titleColor,
			titleHoverColor,
			titleMinHeight,
			numberFont,
			numberColor,
			numberHoverColor,
			numberMinHeight,
		} = attributes

		const titleTagName = 'h' + titleFont[ 0 ].level;

		const gconfig = {
			google: {
				families: [ titleFont[ 0 ].family + ( titleFont[ 0 ].variant ? ':' + titleFont[ 0 ].variant : '' ) ],
			},
		};
		const config = ( titleFont[ 0 ].google ? gconfig : '' );
		const ngconfig = {
			google: {
				families: [ numberFont[ 0 ].family + ( numberFont[ 0 ].variant ? ':' + numberFont[ 0 ].variant : '' ) ],
			},
		};
		const nconfig = ( numberFont[ 0 ].google ? ngconfig : '' );

		const renderCSS = (
			<style>
				{ ( titleHoverColor ? `#kt-counter-up-${ uniqueID }:hover .kt-counter-up-title { color: ${ KadenceColorOutput( titleHoverColor ) } !important; }` : '' ) }
				{ ( numberHoverColor ? `#kt-counter-up-${ uniqueID }:hover .kt-counter-up-number { color: ${ KadenceColorOutput( numberHoverColor ) } !important; }` : '' ) }

			</style>
		);

		return (
			<Fragment>
				{ isSelected && <Inspector {...this.props} /> }

				{ displayTitle && titleFont[ 0 ].google && (
					<WebfontLoader config={ config } />
				) }

				{ numberFont[ 0 ].google && (
					<WebfontLoader config={ nconfig } />
				) }

				{ renderCSS }

				<div id={ `kt-counter-up-${uniqueID}` } className={ classnames( 'kt-counter-up' ) }>
					<div
						className={ classnames( 'kt-counter-up-number' ) }
						style={ {
							fontWeight: numberFont[ 0 ].weight,
							fontStyle: numberFont[ 0 ].style,
							display: 'inline-flex',
							color: KadenceColorOutput( numberColor ),
							fontSize: numberFont[ 0 ].size[ 0 ] + numberFont[ 0 ].sizeType,
							lineHeight: ( numberFont[ 0 ].lineHeight && numberFont[ 0 ].lineHeight[ 0 ] ? numberFont[ 0 ].lineHeight[ 0 ] + numberFont[ 0 ].lineType : undefined ),
							letterSpacing: numberFont[ 0 ].letterSpacing + 'px',
							fontFamily: ( numberFont[ 0 ].family ? numberFont[ 0 ].family : '' ),
							padding: ( numberFont[ 0 ].padding ? numberFont[ 0 ].padding[ 0 ] + 'px ' + numberFont[ 0 ].padding[ 1 ] + 'px ' + numberFont[ 0 ].padding[ 2 ] + 'px ' + numberFont[ 0 ].padding[ 3 ] + 'px' : '' ),
							margin: ( numberFont[ 0 ].margin ? numberFont[ 0 ].margin[ 0 ] + 'px ' + numberFont[ 0 ].margin[ 1 ] + 'px ' + numberFont[ 0 ].margin[ 2 ] + 'px ' + numberFont[ 0 ].margin[ 3 ] + 'px' : '' ),
							minHeight: ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 0 ] ? titleMinHeight[ 0 ] + 'px' : undefined ),
						} }
					>
						<CountUp
						  start={ start }
						  end={ end }
						  duration={ duration }
						  separator={ separator ? ',' : '' }
						  prefix={ prefix }
						  suffix={ suffix }
						/>
					</div>

					{ 	displayTitle &&
						<RichText
							tagName={ titleTagName }
							className={ classnames( 'kt-counter-up-title' ) }
							value={ title }
							onChange={ (content) => setAttributes({ title: content }) }
							placeholder={ __( 'Type Here...' ) }
							style={ {
								fontWeight: titleFont[ 0 ].weight,
								fontStyle: titleFont[ 0 ].style,
								color: KadenceColorOutput( titleColor ),
								fontSize: titleFont[ 0 ].size[ 0 ] + titleFont[ 0 ].sizeType,
								lineHeight: ( titleFont[ 0 ].lineHeight && titleFont[ 0 ].lineHeight[ 0 ] ? titleFont[ 0 ].lineHeight[ 0 ] + titleFont[ 0 ].lineType : undefined ),
								letterSpacing: titleFont[ 0 ].letterSpacing + 'px',
								fontFamily: ( titleFont[ 0 ].family ? titleFont[ 0 ].family : '' ),
								padding: ( titleFont[ 0 ].padding ? titleFont[ 0 ].padding[ 0 ] + 'px ' + titleFont[ 0 ].padding[ 1 ] + 'px ' + titleFont[ 0 ].padding[ 2 ] + 'px ' + titleFont[ 0 ].padding[ 3 ] + 'px' : '' ),
								margin: ( titleFont[ 0 ].margin ? titleFont[ 0 ].margin[ 0 ] + 'px ' + titleFont[ 0 ].margin[ 1 ] + 'px ' + titleFont[ 0 ].margin[ 2 ] + 'px ' + titleFont[ 0 ].margin[ 3 ] + 'px' : '' ),
								minHeight: ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 0 ] ? titleMinHeight[ 0 ] + 'px' : undefined ),
							} }
						/>
					}
				</div>
			</Fragment>
		)
	}
}
export default KadenceCounterUp
