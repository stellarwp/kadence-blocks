import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import ModalClose from './close';
import './editor.scss';

export default function VisualBuilder({ attributes, setAttributes, id, startVisible = false }) {
	const [isVisible, setIsVisible] = useState(startVisible);

	return (
		<div class={'kb-header-visual-builder'}>
			<div class={'kb-header-visual-builder__toggle'}>
				<button onClick={() => setIsVisible(!isVisible)}>{isVisible ? 'Hide' : 'Show'} Visual Builder</button>
			</div>

			{isVisible && (
				<div class={'kb-header-visual-builder-modal'}>
					<ModalClose isVisible={isVisible} setIsVisible={setIsVisible} />
					This is the visual builder for {id}
				</div>
			)}
		</div>
	);
}
