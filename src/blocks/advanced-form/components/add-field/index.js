/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Import Css
 */
import './editor.scss';
/**
 * WordPress dependencies
 */
import { Button, Tooltip, VisuallyHidden } from '@wordpress/components';
import { forwardRef } from '@wordpress/element';
import { _x, sprintf } from '@wordpress/i18n';
import { Icon, plus } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Inserter from './inserter';

function FieldBlockAppender(
	{ rootClientId, className, onFocus, tabIndex, inline = false, getRoot = false },
	ref
) {
	const { parentFormBlock, insertIndex } = useSelect(
		( select ) => {
			if ( ! getRoot ) {
				return {
					parentFormBlock: false,
					insertIndex: false,
				};
			}
			const { getBlockParentsByBlockName, getBlockIndex } = select( blockEditorStore );
			const sectionBlock = getBlockParentsByBlockName( getRoot, 'kadence/column' );
			const sectionBlockID = ( undefined !== sectionBlock && sectionBlock.length ? sectionBlock[ 0 ] : false );
			const formBlock = getBlockParentsByBlockName( getRoot, 'kadence/advanced-form' );
			const formBlockID = ( undefined !== formBlock && formBlock.length ? formBlock[ 0 ] : false );
			return {
				parentFormBlock: sectionBlockID || formBlockID,
				insertIndex: getBlockIndex( getRoot ) + 1,
			};
		},
		[ getRoot ]
	);
	return (
		<Inserter
			position="bottom center"
			inline={ inline }
			rootClientId={ parentFormBlock ? parentFormBlock : rootClientId }
			insertionIndex={ insertIndex ? insertIndex : undefined	}
			selectBlockOnInsert={ true }
			renderToggle={ ( {
				onToggle,
				disabled,
				isOpen,
				blockTitle,
				hasSingleBlockType,
			} ) => {
				let label;
				if ( hasSingleBlockType ) {
					label = sprintf(
						// translators: %s: the name of the block when there is only one
						_x( 'Add %s', 'directly add the only allowed block' ),
						blockTitle
					);
				} else {
					label = _x(
						'Add field',
						'Generic label for block inserter button'
					);
				}
				const isToggleButton = ! hasSingleBlockType;

				let inserterButton = (
					<Button
						ref={ ref }
						onFocus={ onFocus }
						tabIndex={ tabIndex }
						className={ classnames(
							className,
							{
							'block-editor-button-block-appender' : ! inline,
							'block-editor-inserter__toggle': inline,
							'has-icon': inline
							}
						) }
						onClick={ onToggle }
						aria-haspopup={ isToggleButton ? 'true' : undefined }
						aria-expanded={ isToggleButton ? isOpen : undefined }
						disabled={ disabled }
						label={ label }
					>
						{ ! hasSingleBlockType && (
							<VisuallyHidden as="span">{ label }</VisuallyHidden>
						) }
						<Icon icon={ plus } />
					</Button>
				);

				if ( isToggleButton || hasSingleBlockType ) {
					inserterButton = (
						<Tooltip text={ label }>{ inserterButton }</Tooltip>
					);
				}
				return inserterButton;
			} }
			isAppender
		/>
	);
}

export default forwardRef( FieldBlockAppender );