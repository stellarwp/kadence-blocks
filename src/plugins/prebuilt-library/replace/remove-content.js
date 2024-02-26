/**
 * WordPress dependencies
 */
const getStringBetween = (str, start, end, from) => {
	// Check if form is there?
	if (!str.includes('kb-pattern-delete-block')) {
		return '';
	}
	// get the start of the container.
	const startpos = str.indexOf(start, from);
	if (-1 === startpos) {
		return '';
	}
	const pos = startpos + start.length;
	const endPost = str.indexOf(end, pos);
	const sub = str.substring(pos, endPost);
	if (!sub) {
		return '';
	}
	if (!sub.includes('kb-pattern-delete-block')) {
		return getStringBetween(str, start, end, endPost + end.length);
	}
	return sub;
};
export default function removeContent(content) {
	if (!content) {
		return content;
	}
	let remove_content = getStringBetween(content, '<!-- wp:kadence/column', '<!-- /wp:kadence/column -->', 0);
	if (remove_content) {
		content = content.replace('<!-- wp:kadence/column' + remove_content + '<!-- /wp:kadence/column -->', '');
	}

	return content;
}
