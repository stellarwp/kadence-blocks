import { useMemo, useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { useEntityBlockEditor } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import { get } from 'lodash';
import ModalClose from './close';
import Desktop from './desktop';
import './editor.scss';

export default function VisualBuilder({ id, startVisible = false }) {
	// Don't commit, active for testing
	const [isVisible, setIsVisible] = useState(!startVisible);
	const [tab, setTab] = useState('desktop');

	const [blocks, onChange] = useEntityBlockEditor('postType', 'kadence_header', { id });

	// const desktopBlocks = useMemo(() => get(blocks, [0, 'innerBlocks', 0, 'innerBlocks']), [blocks]);
	// const tabletBlocks = useMemo(() => get(blocks, [0, 'innerBlocks', 1, 'innerBlocks']), [blocks]);
	// const offCanvasBlocks = useMemo(() => get(blocks, [0, 'innerBlocks', 2, 'innerBlocks']), [blocks]);

	return (
		<div class={'kb-header-visual-builder'}>
			<div class={'kb-header-visual-builder__toggle'}>
				<button onClick={() => setIsVisible(!isVisible)}>{isVisible ? 'Hide' : 'Show'} Visual Builder</button>
			</div>

			{isVisible && (
				<div class={'kb-header-visual-builder-modal'}>
					<div class={'tabs'}>
						<Button isPrimary={tab === 'desktop'} onClick={() => setTab('desktop')}>
							{__('Desktop', 'kadence-blocks')}
						</Button>
						<Button isPrimary={tab === 'tablet'} onClick={() => setTab('tablet')}>
							{__('Tablet', 'kadence-blocks')}
						</Button>
						<Button isPrimary={tab === 'off-canvas'} onClick={() => setTab('off-canvas')}>
							{__('Off Canvas', 'kadence-blocks')}
						</Button>
						<ModalClose isVisible={isVisible} setIsVisible={setIsVisible} />
					</div>

					<div class={'content'}>
						{tab === 'desktop' && <Desktop id={id} />}

						{tab === 'tablet' && <>Tablet Content</>}

						{tab === 'off-canvas' && <>Off Canvas Content</>}
					</div>
				</div>
			)}
		</div>
	);
}
