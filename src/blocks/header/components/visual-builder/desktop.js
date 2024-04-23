import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import { get } from 'lodash';
import DeleteBlockButton from './delete';
import SelectBlockButton from './selectBlock';
import { DESKTOP_SECTION_NAMES, DESKTOP_BLOCK_POSITIONS, ROW_TO_KEY } from './constants';

const DesktopRow = ({ position, blocks }) => {
	const thisRow = get(blocks, [ROW_TO_KEY[position]], []);
	const sections = useMemo(() => {
		return DESKTOP_SECTION_NAMES.map((name, index) => ({
			name,
			blocks: get(thisRow, DESKTOP_BLOCK_POSITIONS[index], []),
		}));
	}, [blocks]);

	return (
		<div className={'visual-row-wrapper'} key={position}>
			<SelectBlockButton clientId={thisRow.clientId} />
			<div className={`visual-desktop-row visual-desktop-row-${position}`}>
				<div className={'visual-section-wrapper visual-section-wrapper-left'}>
					<InnerBlocks blocks={sections[0].blocks} className={'left'} />
					<InnerBlocks blocks={sections[1].blocks} className={'center-left'} />
				</div>
				<div className={'visual-section-wrapper visual-section-wrapper-center'}>
					<InnerBlocks blocks={sections[2].blocks} className={'center'} />
				</div>
				<div className={'visual-section-wrapper visual-section-wrapper-right'}>
					<InnerBlocks blocks={sections[3].blocks} className={'center-right'} />
					<InnerBlocks blocks={sections[4].blocks} className={'right'} />
				</div>
			</div>
		</div>
	);
};

const InnerBlock = ({ block }) => {
	return (
		<div className={'visual-inner-block'}>
			{block.name.replace('kadence/', '').replace('core/', '')}
			<SelectBlockButton clientId={block.clientId} />
			<DeleteBlockButton clientId={block.clientId} />
		</div>
	);
};

const InnerBlocks = ({ blocks, className }) => {
	if (blocks) {
		return (
			<div className={'visual-column-wrapper visual-column-wrapper-' + className}>
				{blocks.map((block) => (
					<InnerBlock key={block.clientId} block={block} />
				))}
			</div>
		);
	}

	return __('Loading blocks…', 'kadence-blocks');
};

export default function Desktop({ blocks }) {
	const rowPositions = ['top', 'middle', 'bottom'];
	const innerBlocks = useMemo(() => get(blocks, ['innerBlocks'], []), [blocks]);

	return (
		<div className={'visual-desktop-container'}>
			{rowPositions.map((position, index) => (
				<DesktopRow key={position} position={position} blocks={innerBlocks} />
			))}
		</div>
	);
}
