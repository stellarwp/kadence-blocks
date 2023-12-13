import { LOCATION_ONLINE_ONLY } from '../constants';

export function useAiWizardHelper(state, pages) {
	if (! state) {
		throw new Error('useAiWizardHelper requires state');
	}

	/**
	 * Get current page's required fields.
	 *
	 * @param {number} [currentPage] - Page index
	 *
	 * @return {string[]}
	 */
	function getCurrentPageRequiredFields(currentPage) {
		if (! Array.isArray(pages)) {
			return [];
		}

		return pages[currentPage || state.currentPageIndex]?.required ? pages[currentPage || state.currentPageIndex]?.required : [];
	}

	/**
	 * Identify and return missing fields for the current page.
	 *
	 * @return {string[]}
	 */
	function getMissingFields() {
		const requiredFields = getCurrentPageRequiredFields();

		const populatedFields = requiredFields.filter((field) => {
			// Return field if string is populated.
			if (typeof state[field] === 'string') {
				return state[field].trim().length;
			}

			// Return field if array is populated.
			if (Array.isArray(state[field])) {
				return state[field].length;
			}

			// Return field if boolean value is true.
			if (typeof state[field] === 'boolean') {
				return !! state[field];
			}
		});

		// Return only fields that are missing from requiredFields - this are missing.
		return requiredFields.filter((field) => {
			return ! populatedFields.includes(field);
		});
	}

	/**
	 * Check if the forward button is disabled.
	 *
	 * @return {boolean}
	 */
	function isForwardButtonDisabled() {
		const {
			currentPageIndex,
			locationType,
			locationInput,
			keywords,
			missionStatement,
		} = state;
		const missing = getMissingFields();
		const pageId = pages?.[currentPageIndex]?.id;

		switch(pageId) {
			case 'industry-information':
				return (missing.length > 0 || locationType !== LOCATION_ONLINE_ONLY && ! locationInput);
			case 'about-your-site':
				const missionLength = missionStatement.length >= 200 && missionStatement.length < 1500 ? false : true;

				return (missionLength || missing.length > 0) ? true : false;
			case 'the-details':
				const missingKeywords = keywords.length >= 5 ? false : true;

				return (missingKeywords || missing.length > 0) ? true : false;
			default:
				return missing.length > 0 ? true : false;
		}
	}

	/**
	 * Check if the finish button is disabled.
	 *
	 * @return {boolean}
	 */
	function isFinishButtonDisabled() {
		const { saving } = state;
		return saving;
	}

	return {
		isForwardButtonDisabled,
		isFinishButtonDisabled
	}
}
