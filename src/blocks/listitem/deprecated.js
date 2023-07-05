/**
 * BLOCK: Icon List
 *
 * Depreciated.
 */


/**
 * Internal block libraries
 */

import { IconSpanTag } from '@kadence/components';
import { RichText, useBlockProps } from '@wordpress/block-editor';
import classnames from "classnames";
import metadata from './block.json';

 export default [
	{
		attributes:  metadata.attributes,
		apiVersion: 2,
		save: ( { attributes } ) => {

			const {
				uniqueID,
				icon,
				link,
				target,
				width,
				text,
				style,
				level,
				showIcon,
				size,
			} = attributes;

			const classes = classnames( {
				'kt-svg-icon-list-item-wrap': true,
				[ `kt-svg-icon-list-item-${ uniqueID }` ]: uniqueID,
				[ `kt-svg-icon-list-style-${ style }` ]: style,
				[ `kt-svg-icon-list-level-${ level }` ]: level,
			} );
		
			const blockProps = useBlockProps.save( {
				className: classes,
			} );
		
			const iconName = icon ? icon : 'USE_PARENT_DEFAULT_ICON';
		
			const iconSpan = (
				<IconSpanTag extraClass={ 'kt-svg-icon-list-single' } name={ iconName } strokeWidth={ ( 'fe' === icon.substring( 0, 2 ) ? width : undefined ) } ariaHidden={ 'true' } />
			);
		
			const emptyIcon = ( size === 0 ?
					<></>
					:
					<div className="kt-svg-icon-list-single" style="display: inline-flex; justify-content: center; align-items: center;">
						<svg viewBox="0 0 24 24" height="1em" width="1em" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle;">
						</svg>
					</div>
			);

			return (
				<li {...blockProps}>
					{ link && (
						<a href={ link } className={ 'kt-svg-icon-link' } target={ ( '_blank' === target ? target : undefined ) } rel={ '_blank' === target ? 'noopener noreferrer' : undefined }>
							{ showIcon ? iconSpan : emptyIcon }
							<RichText.Content
								tagName="span"
								value={ text }
								className={ 'kt-svg-icon-list-text' }
							/>
						</a>
					) }
					{ ! link && (
						<>
							{ showIcon ? iconSpan : emptyIcon }
							<RichText.Content
								tagName="span"
								value={ text }
								className={ 'kt-svg-icon-list-text' }
							/>
						</>
					) }
				</li>
			);
		}
	},
	 {
		 attributes: {
			 "uniqueID": {
				 "type": "string",
				 "default": ""
			 },
			 "icon": {
				 "type": "string",
				 "default": ""
			 },
			 "link": {
				 "type": "string",
				 "default": ""
			 },
			 "target": {
				 "type": "string",
				 "default": "_self"
			 },
			 "size": {
				 "type": "number",
				 "default": ""
			 },
			 "width": {
				 "type": "number",
				 "default": ""
			 },
			 "text": {
				 "type": "string",
				 "default": ""
			 },
			 "color": {
				 "type": "string",
				 "default": ""
			 },
			 "background": {
				 "type": "string",
				 "default": ""
			 },
			 "border": {
				 "type": "string",
				 "default": ""
			 },
			 "borderRadius": {
				 "type": "number",
				 "default": ""
			 },
			 "padding": {
				 "type": "number",
				 "default": ""
			 },
			 "borderWidth": {
				 "type": "number",
				 "default": ""
			 },
			 "style": {
				 "type": "string",
				 "default": ""
			 },
			 "level": {
				 "type": "number",
				 "default": 0
			 }
		 },
		 save: ( { attributes } ) => {

			 const {
				 uniqueID,
				 icon,
				 link,
				 target,
				 width,
				 text,
				 style,
				 level
			 } = attributes;

			 const classes = classnames( {
				 'kt-svg-icon-list-item-wrap': true,
				 [ `kt-svg-icon-list-item-${ uniqueID }` ]: uniqueID,
				 [ `kt-svg-icon-list-style-${ style }` ]: style,
				 [ `kt-svg-icon-list-level-${ level }` ]: level,
			 } );

			 const blockProps = useBlockProps.save( {
				 className: classes,
			 } );

			 return (
				 <li {...blockProps}>
					 { link && (
						 <a href={ link } className={ 'kt-svg-icon-link' } target={ ( '_blank' === target ? target : undefined ) } rel={ '_blank' === target ? 'noopener noreferrer' : undefined }>
							 { icon && (
								 <IconSpanTag extraClass={ 'kt-svg-icon-list-single' } name={ icon } strokeWidth={ ( 'fe' === icon.substring( 0, 2 ) ? width : undefined ) } ariaHidden={ 'true' } />
							 ) }
							 <RichText.Content
								 tagName="span"
								 value={ text }
								 className={ 'kt-svg-icon-list-text' }
							 />
						 </a>
					 ) }
					 { ! link && (
						 <>
							 { icon && (
								 <IconSpanTag extraClass={ 'kt-svg-icon-list-single' } name={ icon } strokeWidth={ ( 'fe' === icon.substring( 0, 2 ) ? width : undefined ) } ariaHidden={ 'true' } />
							 ) }
							 <RichText.Content
								 tagName="span"
								 value={ text }
								 className={ 'kt-svg-icon-list-text' }
							 />
						 </>
					 ) }
				 </li>
			 );
		 }
	 }
 ];
