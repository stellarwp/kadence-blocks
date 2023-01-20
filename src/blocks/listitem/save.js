/**
 * BLOCK: Kadence Spacer
 */

import {
    useBlockProps,
} from '@wordpress/block-editor';
import { dispatch, select } from "@wordpress/data";
import { RichText } from '@wordpress/block-editor';

/**
 * Kadence dependencies
 */
import { IconSpanTag } from '@kadence/components';
/**
 * External dependencies
 */
import classnames from 'classnames';

function Save( props ) {

    const { attributes, clientId } = props;
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

    const iconName = icon ? icon : 'USE_PARENT_DEFAULT_ICON';

    return (
        <li {...blockProps}>
            { link && (
                <a href={ link } className={ 'kt-svg-icon-link' } target={ ( '_blank' === target ? target : undefined ) } rel={ '_blank' === target ? 'noopener noreferrer' : undefined }>
                    <IconSpanTag extraClass={ 'kt-svg-icon-list-single' } name={ iconName } strokeWidth={ ( 'fe' === icon.substring( 0, 2 ) ? width : undefined ) } ariaHidden={ 'true' } />
                    <RichText.Content
                        tagName="span"
                        value={ text }
                        className={ 'kt-svg-icon-list-text' }
                    />
                </a>
            ) }
            { ! link && (
                <>
                    <IconSpanTag extraClass={ 'kt-svg-icon-list-single' } name={ iconName } strokeWidth={ ( 'fe' === icon.substring( 0, 2 ) ? width : undefined ) } ariaHidden={ 'true' } />
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
