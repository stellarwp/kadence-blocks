/**
 * WordPress dependencies
 */
import { ToolbarButton } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useImageEditingContext } from './context';

export default function FormControls() {
	const { isInProgress, apply, cancel } = useImageEditingContext();
	return (
		<>
			<ToolbarButton onClick={apply} disabled={isInProgress}>
				{__('Apply', 'kadence-blocks')}
			</ToolbarButton>
			<ToolbarButton onClick={cancel}>{__('Cancel', 'kadence-blocks')}</ToolbarButton>
		</>
	);
}
