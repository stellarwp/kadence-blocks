/**
 * Internal dependencies
 */
import { findSection, filterTokensByGroup } from '../../helpers/navigation';
import { TokenList } from '../templates/TokenList';

/**
 * Foundation editor page for a schema group (Brand, Spacing, Font Sizes, etc.).
 *
 * @param {object}   props              Component props.
 * @param {string}   props.sectionId    Active foundation section id.
 * @param {object[]} props.sections     Built navigation sections.
 * @param {object[]} props.tokens       Flat token list.
 * @param {Record<string, string>} props.values Resolved values.
 * @param {boolean}  props.isReady      Whether the feed loaded.
 * @param {boolean}  props.isActive     Whether design tokens are active.
 * @param {boolean}  props.isResolved   Whether values resolved successfully.
 * @param {Function} props.onSave       Save handler for token fields.
 * @param {Function} props.getFieldState Field state accessor.
 * @return {JSX.Element|null} Foundation page or null when unknown.
 */
export function FoundationPage({
	sectionId,
	sections,
	tokens,
	values,
	isReady,
	isActive,
	isResolved,
	onSave,
	getFieldState,
}) {
	const section = findSection(sections, sectionId);

	if (!section || section.kind !== 'foundation') {
		return null;
	}

	const filtered = filterTokensByGroup(tokens, section.groupName);

	return (
		<div className="kadence-style-book__foundation-page">
			<header className="kadence-style-book__page-header">
				<h2>{section.label}</h2>
				<p>{section.description}</p>
			</header>

			<TokenList
				tokens={filtered}
				values={values}
				isReady={isReady}
				isActive={isActive}
				isResolved={isResolved}
				onSave={onSave}
				getFieldState={getFieldState}
				groupBySchema={false}
			/>
		</div>
	);
}
