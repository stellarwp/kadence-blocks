/**
 * WordPress dependencies
 */
import { ToolbarButton, RangeControl, Dropdown } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { search } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { MIN_ZOOM, MAX_ZOOM, POPOVER_PROPS } from './constants';
import { useImageEditingContext } from './context';

export default function ZoomDropdown() {
	const { isInProgress, zoom, setZoom } = useImageEditingContext();
	return (
		<Dropdown
			contentClassName="wp-block-kadence-image__zoom"
			popoverProps={POPOVER_PROPS}
			renderToggle={({ isOpen, onToggle }) => (
				<ToolbarButton
					icon={search}
					label={__('Zoom', 'kadence-blocks')}
					onClick={onToggle}
					aria-expanded={isOpen}
					disabled={isInProgress}
				/>
			)}
			renderContent={() => (
				<RangeControl
					label={__('Zoom', 'kadence-blocks')}
					min={MIN_ZOOM}
					max={MAX_ZOOM}
					value={Math.round(zoom)}
					onChange={setZoom}
				/>
			)}
		/>
	);
}
