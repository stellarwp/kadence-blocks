/**
 * BLOCK: Kadence Spacer
 */

import {
    useBlockProps,
    InnerBlocks
} from '@wordpress/block-editor';
/**
 * External dependencies
 */
import { IconRender } from '@kadence/components';
import { KadenceColorOutput } from '@kadence/helpers';
import { Fragment } from '@wordpress/element';
import { times } from 'lodash';
import { RichText } from '@wordpress/block-editor';

function Save( { attributes } ) {
    const {
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

    const index = 0;

    const blockProps = useBlockProps.save( {
        className: ''
    } );

    return (
        <li className={ `kt-svg-icon-list-style-${ style } kt-svg-icon-list-item-wrap kt-svg-icon-list-item-${ index } kt-svg-icon-list-level-${ level }` }>
            { link && (
                <a href={ link } className={ 'kt-svg-icon-link' } target={ ( '_blank' === target ? target : undefined ) } rel={ '_blank' === target ? 'noopener noreferrer' : undefined }>
                    { icon && (
                        <IconRender className={ `kt-svg-icon-list-single kt-svg-icon-list-single-${ icon }` } name={ icon } size={ size } strokeWidth={ ( 'fe' === icon.substring( 0, 2 ) ? width : undefined ) } ariaHidden={ 'true' } style={ {
                            color: ( color ? KadenceColorOutput( color ) : undefined ),
                            backgroundColor: ( background && style !== 'default' ? KadenceColorOutput( background ) : undefined ),
                            padding: ( padding && style !== 'default' ? padding + 'px' : undefined ),
                            borderColor: ( border && style !== 'default' ? KadenceColorOutput( border ) : undefined ),
                            borderWidth: ( borderWidth && style !== 'default' ? borderWidth + 'px' : undefined ),
                            borderRadius: ( borderRadius && style !== 'default' ? borderRadius + '%' : undefined ),
                        } } />
                    ) }
                    <RichText.Content
                        tagName="span"
                        value={ text }
                        className={ 'kt-svg-icon-list-text' }
                    />
                </a>
            ) }
            { ! link && (
                <Fragment>
                    { icon && (
                        <IconRender className={ `kt-svg-icon-list-single kt-svg-icon-list-single-${ icon }` } name={ icon } size={ size } strokeWidth={ ( 'fe' === icon.substring( 0, 2 ) ? width : undefined ) } ariaHidden={ 'true' } style={ {
                            color: ( color ? KadenceColorOutput( color ) : undefined ),
                            backgroundColor: ( background && style !== 'default' ? KadenceColorOutput( background ) : undefined ),
                            padding: ( padding && style !== 'default' ? padding + 'px' : undefined ),
                            borderColor: ( border && style !== 'default' ? KadenceColorOutput( border ) : undefined ),
                            borderWidth: ( borderWidth && style !== 'default' ? borderWidth + 'px' : undefined ),
                            borderRadius: ( borderRadius && style !== 'default' ? borderRadius + '%' : undefined ),
                            // marginTop: ( marginTop ? marginTop + 'px' : undefined ),
                            // marginRight: ( marginRight ? marginRight + 'px' : undefined ),
                            // marginBottom: ( marginBottom ? marginBottom + 'px' : undefined ),
                            // marginLeft: ( marginLeft ? marginLeft + 'px' : undefined ),
                        } } />
                    ) }
                    <RichText.Content
                        tagName="span"
                        value={ text }
                        className={ 'kt-svg-icon-list-text' }
                    />
                </Fragment>
            ) }
        </li>
    );
}

export default Save;
