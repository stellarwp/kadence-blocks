import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { get } from 'lodash';
import classnames from 'classnames';

import DeleteBlockButton from './delete';
import SelectBlockButton from './selectBlock';
import AddBlockButton from './add';
import { DESKTOP_SECTION_NAMES, DESKTOP_BLOCK_POSITIONS, DESKTOP_CLIENT_ID_POSITIONS, ROW_TO_KEY } from './constants';

const computeSections = (thisRow, blocks) =>
	useMemo(() => {
		return DESKTOP_SECTION_NAMES.map((name, index) => ({
			name,
			blocks: get(thisRow, DESKTOP_BLOCK_POSITIONS[index], []),
			clientId: get(thisRow, DESKTOP_CLIENT_ID_POSITIONS[index], []),
		}));
	}, [blocks]);

const DesktopRow = ({ position, blocks }) => {
	const thisRow = get(blocks, [ROW_TO_KEY[position]], []);
	const sections = computeSections(thisRow, blocks);

	// If mid columns are empty, and the center is empty, don't show mid columns
	const isCenterEmpty = sections[2].blocks.length === 0;
	const areMidColumnsEmpty = sections[1].blocks.length === 0 && sections[3].blocks.length === 0;
	const showMidColumns = !isCenterEmpty || !areMidColumnsEmpty;

	return (
		<div className={'visual-row-wrapper'} key={position}>
			<SelectBlockButton clientId={thisRow.clientId} />
			<div className={`visual-desktop-row visual-desktop-row-${position}`}>
				<div className={'visual-section-wrapper visual-section-wrapper-left'}>
					<InnerBlocks blocks={sections[0].blocks} className={'left'} />
					<AddBlockButton position={'left'} clientId={sections[0].clientId} showMidColumns={showMidColumns} />
					{showMidColumns && (
						<>
							<InnerBlocks
								blocks={sections[1].blocks}
								className={'center-left'}
								isCenterEmpty={isCenterEmpty}
							/>
							<AddBlockButton position={'center-left'} clientId={sections[1].clientId} />
						</>
					)}
				</div>
				<div className={'visual-section-wrapper visual-section-wrapper-center'}>
					<InnerBlocks blocks={sections[2].blocks} className={'center'} />
					<AddBlockButton position={'center'} clientId={sections[2].clientId} />
				</div>
				<div className={'visual-section-wrapper visual-section-wrapper-right'}>
					{showMidColumns && (
						<>
							<InnerBlocks
								blocks={sections[3].blocks}
								className={'center-right'}
								isCenterEmpty={isCenterEmpty}
							/>
							<AddBlockButton position={'center-right'} clientId={sections[3].clientId} />
						</>
					)}
					<InnerBlocks blocks={sections[4].blocks} className={'right'} />
					<AddBlockButton
						position={'right'}
						clientId={sections[4].clientId}
						showMidColumns={showMidColumns}
					/>
				</div>
			</div>
		</div>
	);
};

const InnerBlock = ({ block }) => {
	return (
		<div className={'visual-inner-block'}>
			{block.name.replace('kadence/', '').replace('core/', '')}
			{/*<SelectBlockButton clientId={block.clientId} />*/}
			{/*<DeleteBlockButton clientId={block.clientId} />*/}
		</div>
	);
};

const InnerBlocks = ({ blocks, className, isCenterEmpty = false }) => {
	// Don't show mid-columns if center is empty
	const hideIfEmpty = className.includes('center-') && isCenterEmpty;

	const classNames = classnames({
		'visual-column-wrapper': true,
		[`visual-column-wrapper-${className}`]: true,
		'visual-column-wrapper-empty-center': hideIfEmpty,
	});

	if (blocks) {
		return (
			<div className={classNames}>
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
