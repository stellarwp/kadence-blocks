/**
 * Judge a typed name against the rules every rename in this app has to pass, in one place, so the
 * form that shows the problem and the button that refuses to submit can never disagree. What
 * counts as a duplicate differs per thing being renamed (a library compares display titles, a
 * palette compares labels), so that one rule is passed in.
 *
 * Unchanged counts as not savable alongside empty and duplicate: a rename to the same name would
 * spend a request and bump a version to change nothing.
 *
 * @param {string}   typed       The typed name.
 * @param {string}   currentName The current name.
 * @param {Function} isDuplicate Called with the trimmed name; true when something else already uses it.
 *
 * @since TBD
 *
 * @return {{trimmed: string, isDuplicate: boolean, isSavable: boolean}} The name as it would be
 *         saved, whether something else already uses it, and whether it may be saved at all.
 */
export function checkRename(typed, currentName, isDuplicate) {
	const trimmed = String(typed ?? '').trim();
	const isTaken = trimmed !== '' && Boolean(isDuplicate(trimmed));
	const isUnchanged = trimmed === String(currentName ?? '').trim();

	return {
		trimmed,
		isDuplicate: isTaken,
		isSavable: trimmed !== '' && !isTaken && !isUnchanged,
	};
}
