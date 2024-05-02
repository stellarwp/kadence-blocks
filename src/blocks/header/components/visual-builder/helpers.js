import { get } from 'lodash';
import { DESKTOP_BLOCK_POSITIONS, DESKTOP_CLIENT_ID_POSITIONS, DESKTOP_SECTION_NAMES } from './constants';

export const computeDesktopSections = (thisRow) => {
	return DESKTOP_SECTION_NAMES.map((name, index) => ({
		name,
		blocks: get(thisRow, DESKTOP_BLOCK_POSITIONS[index], []),
		clientId: get(thisRow, DESKTOP_CLIENT_ID_POSITIONS[index], []),
	}));
};
