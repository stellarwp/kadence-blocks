import { useMemo } from '@wordpress/element';
import { useEntityBlockEditor } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { get } from 'lodash';
import DeleteBlockButton from './delete';
import SelectBlockButton from './selectBlock';
import { DESKTOP_SECTION_NAMES, DESKTOP_BLOCK_POSITIONS } from './constants';

const DesktopRow = ({ position, blocks, allBlocks, onChange, parentClientId }) => {
	const sections = useMemo(() => {
		return DESKTOP_SECTION_NAMES.map((name, index) => ({
			name,
			blocks: get(blocks, DESKTOP_BLOCK_POSITIONS[index], []),
		}));
	}, [blocks]);

	return (
		<div className={'visual-row-wrapper'} key={position}>
			<Button icon="admin-generic" onClick={() => console.log(`Clicked settings for desktop ${position} row`)} />
			<div className={`visual-desktop-row visual-desktop-row-${position}`}>
				{sections.map((section) => (
					<div key={section.name} className={`visual-section-wrapper visual-section-wrapper-${section.name}`}>
						<InnerBlocks
							blocks={section.blocks}
							allBlocks={allBlocks}
							onChange={onChange}
							parentClientId={parentClientId}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

const InnerBlock = ({ block, allBlocks, onChange, parentClientId }) => {
	return (
		<div className={'visual-inner-block'}>
			{block.name.replace('kadence/', '').replace('core/', '')}
			{/* TODO: Client ID doesn't match editor client ID so selection doesn't work */}
			{/*<SelectBlockButton clientId={block.clientId} />*/}
			<DeleteBlockButton
				block={block}
				allBlocks={allBlocks}
				onChange={onChange}
				parentClientId={parentClientId}
			/>
		</div>
	);
};

const InnerBlocks = ({ blocks, allBlocks, onChange, parentClientId }) => {
	if (blocks) {
		return blocks.map((block) => (
			<>
				<InnerBlock
					key={block.clientId}
					parentClientId={parentClientId}
					block={block}
					allBlocks={allBlocks}
					onChange={onChange}
				/>
			</>
		));
	}

	return __('Loading blocks…', 'kadence-blocks');
};

export default function Desktop({ id }) {
	const [blocks, , onChange] = useEntityBlockEditor('postType', 'kadence_header', { id });
	const innerBlocks = useMemo(() => get(blocks, [0, 'innerBlocks'], []), [blocks]);
	const desktopBlocks = useMemo(() => get(innerBlocks, [0, 'innerBlocks'], []), [blocks]);
	const parentClientId = get(blocks, [0, 'clientId']);

	const rowPositions = ['top', 'middle', 'bottom'];

	return (
		<div className={'visual-desktop-container'}>
			{rowPositions.map((position, index) => (
				<DesktopRow
					key={position}
					position={position}
					blocks={get(desktopBlocks, [index, 'innerBlocks'], [])}
					allBlocks={innerBlocks}
					onChange={onChange}
					parentClientId={parentClientId}
				/>
			))}
		</div>
	);
}
