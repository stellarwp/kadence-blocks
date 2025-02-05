import { createRoot } from '@wordpress/element';
import { VisualBuilder } from '../src/blocks/header/components';
import { useSelect } from '@wordpress/data';

const VisualBuilderContainer = () => {
	const { previewDevice, visualBuilderClientId, modalPosition } = useSelect(
		(select) => ({
			previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			visualBuilderClientId: select('kadenceblocks/data').getSelectedHeaderVisualBuilderId(),
			modalPosition: select('kadenceblocks/data').getOpenHeaderVisualBuilderPosition(),
		}),
		[]
	);

	if (!visualBuilderClientId) {
		return null;
	}

	return (
		<>
			<VisualBuilder clientId={visualBuilderClientId} previewDevice={previewDevice} isSelected={true} />
			<style>
				{` .editor-visual-editor.is-iframed {
             ${modalPosition === 'top' ? 'margin-top: 290px;' : ''}
                }
             `}
			</style>
		</>
	);
};

document.addEventListener('DOMContentLoaded', () => {
	const fixedContainer = document.createElement('div');
	fixedContainer.id = 'kb-header-visual-builder';
	document.body.appendChild(fixedContainer);

	// Create a root and render
	const root = createRoot(fixedContainer);
	root.render(<VisualBuilderContainer />);
});
