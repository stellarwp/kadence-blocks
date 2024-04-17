import { useEffect, useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import ModalClose from './close';
import Desktop from './desktop';
import './editor.scss';

export default function VisualBuilder({ attributes, setAttributes, id, startVisible = false }) {
	// Don't commit, active for testing
	const [isVisible, setIsVisible] = useState(!startVisible);
	const [tab, setTab] = useState('desktop');

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
						{tab === 'desktop' && <Desktop />}

						{tab === 'tablet' && <>Tablet Content</>}

						{tab === 'off-canvas' && <>Off Canvas Content</>}
					</div>
				</div>
			)}
		</div>
	);
}
