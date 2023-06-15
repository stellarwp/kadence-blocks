/**
 * BLOCK: Kadence Spacer
 */

import metadata from './block.json';
/**
 * External dependencies
 */
import { IconSpanTag } from '@kadence/components';

const v1 = {
	attributes: metadata.attributes,
	supports: metadata.supports,
	apiVersion: 2,
	save: ( { attributes } ) => {
		const {
			icon,
			link,
			target,
			width,
			title,
			style,
			linkTitle,
			uniqueID
		} = attributes;
		return (
			<div className={ `kt-svg-style-${ style } kt-svg-icon-wrap kt-svg-item-${ uniqueID }` }>
				{ icon && link && (
					<a href={ link } className={ 'kt-svg-icon-link' } target={ ( '_blank' === target ? target : undefined ) } rel={ '_blank' === target ? 'noopener noreferrer' : undefined } aria-label={ ( undefined !== linkTitle && '' !== linkTitle ? linkTitle : undefined ) }>
						<IconSpanTag name={ icon } strokeWidth={ ( 'fe' === icon.substring( 0, 2 ) ? width : undefined ) } title={ ( title ? title : '' ) } />
					</a>
				) }
				{ icon && ! link && (
					<IconSpanTag name={ icon } strokeWidth={ ( 'fe' === icon.substring( 0, 2 ) ? width : undefined ) } title={ ( title ? title : '' ) } />
				) }
			</div>
		);
	},
};
export default [ v1 ];