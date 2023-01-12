/**
 * BLOCK: Kadence Spacer
 */

import { useBlockProps } from '@wordpress/block-editor';

/**
 * External dependencies
 */
import { IconSpanTag } from '@kadence/components';
/**
 * External dependencies
 */
import classnames from 'classnames';
import { times } from 'lodash';

function Save( { attributes, className } ) {
    // TODO: get vertical alignment from parent
    const verticalAlignment = false;
    const blockAlignment = 'none';
    const textAlignment = '';

    const {
        inQueryBlock,
        icon,
        link,
        target,
        size,
        width,
        title,
        text,
        hColor,
        hBackground,
        tabletSize,
        hBorder,
        color,
        background,
        border,
        borderRadius,
        padding,
        borderWidth,
        style,
        linkTitle,
        level,
        tabletMargin,
        mobileSize,
        uniqueID
    } = attributes;

    const classes = classnames( {
        'kt-svg-icons': true,
        [ `kt-svg-icons${ uniqueID }` ]: uniqueID,
        [ `align${ ( blockAlignment ? blockAlignment : 'none' ) }` ]: true,
        [ `kb-icon-valign-${ verticalAlignment }` ]: verticalAlignment,
    } );

    const blockProps = useBlockProps.save( {
        className: classes,
    } );

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
}

export default Save;
