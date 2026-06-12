/**
 * Internal dependencies
 */
import { SECTION_OVERVIEW } from '../../constants/navigation';
import { findSection } from '../../helpers/navigation';
import { useDesignTokensFeed } from '../../hooks/use-design-tokens-feed';
import { useStyleBookNavigation } from '../../hooks/use-style-book-navigation';
import { useTokenEditor } from '../../hooks/use-token-editor';
import { FoundationPage } from '../pages/FoundationPage';
import { OverviewPage } from '../pages/OverviewPage';
import { StyleBookShell } from '../templates/StyleBookShell';

/**
 * Style Book application page — sidebar shell and section routing.
 *
 * @return {JSX.Element} Style Book page.
 */
export function TokensPage() {
	const { tokens, isReady, isActive, isResolved, values: feedValues, rest, version } = useDesignTokensFeed();
	const { values, saveToken, getFieldState } = useTokenEditor(rest, feedValues);
	const { section, setSection, sections } = useStyleBookNavigation(tokens);

	const sharedListProps = {
		tokens,
		values,
		isReady,
		isActive,
		isResolved,
		onSave: saveToken,
		getFieldState,
	};

	let content = null;

	if (section === SECTION_OVERVIEW) {
		content = <OverviewPage sections={sections} tokens={tokens} values={values} onNavigate={setSection} />;
	} else if (findSection(sections, section)?.kind === 'foundation') {
		content = <FoundationPage sectionId={section} sections={sections} {...sharedListProps} />;
	}

	return (
		<StyleBookShell section={section} sections={sections} onNavigate={setSection} version={version}>
			{content}
		</StyleBookShell>
	);
}
