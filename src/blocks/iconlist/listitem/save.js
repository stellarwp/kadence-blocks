/**
 * BLOCK: Kadence Spacer
 */

import {
    useBlockProps,
} from '@wordpress/block-editor';
/**
 * Kadence dependencies
 */
import { IconSpanTag } from '@kadence/components';
/**
 * External dependencies
 */
import classnames from 'classnames';
import { RichText } from '@wordpress/block-editor';

function Save( { attributes } ) {
    const {
        uniqueID,
        icon,
        link,
        target,
        size,
        width,
        text,
        color,
        background,
        border,
        borderRadius,
        padding,
        borderWidth,
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

export default Save;
