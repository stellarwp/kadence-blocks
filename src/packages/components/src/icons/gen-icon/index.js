import PropTypes from 'prop-types';

import { createElement } from '@wordpress/element';

const walkChildren = ( children ) => {
	return children.map( ( child, idx ) => {
		const { nE, aBs: attribsMap, children: gchildren = null } = child;

		//fill, stroke
		const attribs = Object.keys( attribsMap )
			.filter( key => key !== 'fill' && key !== 'stroke' && attribsMap[ key ] !== 'none' )
			.reduce( ( partial, key ) => {

				//partial[camelcase(key)] = attribsMap[key];
				partial[ key ] = attribsMap[ key ];
				return partial;
			}, {} );
		//special case, it has fill and stroke at the same time
		let merge = {};
		if ( attribsMap.fill === 'none' && attribsMap.stroke ) {
			merge = { fill: 'none', stroke: 'currentColor' };
		}
		return createElement( nE, { key: idx, ...attribs, ...merge }, gchildren === null ? gchildren : walkChildren( gchildren ) );
	} );
};

export const GenIcon = ( props ) => {
	const { style, className, icon, name, htmltag, ...others } = props;
	const type = name.substring( 0, 2 );
	const typeL = name.substring( 0, 3 );
	const lineIcon = ( type && 'fe' == type ? true : false );
	const fill = ( lineIcon ? 'none' : 'currentColor' );
	const strokeWidth = ( lineIcon ? props.strokeWidth : undefined );
	const stroke = ( lineIcon ? 'currentColor' : undefined );
	const strokeLinecap = ( lineIcon ? 'round' : undefined );
	const strokeLinejoin = ( lineIcon ? 'round' : undefined );
	const ariaHidden = ( props.ariaHidden ? 'true' : undefined );
	const HtmlTagOut = ( htmltag ? htmltag : 'div' );
	const viewB = ( props.icon && props.icon.vB ? props.icon.vB.split( ' ' ) : false );
	return (
		<HtmlTagOut style={ { display: 'inline-flex', justifyContent: 'center', alignItems: 'center', ...style } } className={ `${className} ${props.size === 0 ? 'kb-icon-transparent' : ''}` }>
			<svg style={ { display: 'inline-block', verticalAlign: 'middle' } } viewBox={ ( ! props.icon ? '0 0 24 24' : props.icon.vB ) } height={ props.size === 0 ? '24' : props.size } width={ props.size === 0 ? '24' : props.size } fill={ fill } stroke={ stroke } xmlns={ props.xmlns } preserveAspectRatio={ ( typeL && 'fas' !== typeL && 'fe_' !== typeL && 'ic_' !== typeL && viewB && ( ( undefined !== viewB[ 0 ] && viewB[ 0 ] !== 0 ) || ( undefined !== viewB[ 1 ] && viewB[ 1 ] !== 0 ) ) ? 'xMinYMin meet' : undefined ) } stroke-width={ strokeWidth } stroke-linecap={ strokeLinecap } stroke-linejoin={ strokeLinejoin } aria-hidden={ ariaHidden }>
				{ props.title ? <title>{ props.title }</title> : null }
				{ props.icon && (
					walkChildren( props.icon.cD )
				) }
			</svg>
		</HtmlTagOut>
	);
};

GenIcon.defaultProps = {
	size: 24,
	xmlns: 'http://www.w3.org/2000/svg',
	strokeWidth: 2,
	htmltag: 'div',
};

GenIcon.propTypes = {
	icon: PropTypes.object.isRequired,
	size: PropTypes.oneOfType( [ PropTypes.number, PropTypes.string ] ),
	style: PropTypes.object,
	className: PropTypes.string,
};

export default GenIcon;
