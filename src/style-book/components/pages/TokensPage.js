/**
 * Internal dependencies
 */
import { SECTION_OVERVIEW, SECTION_VARIANTS } from '../../constants/navigation';
import { useDesignTokensFeed } from '../../hooks/use-design-tokens-feed';
import { useStyleBookNavigation } from '../../hooks/use-style-book-navigation';
import { useTokenEditor } from '../../hooks/use-token-editor';
import { FoundationPage } from '../pages/FoundationPage';
import { OverviewPage } from '../pages/OverviewPage';
import { VariantsPage } from '../pages/VariantsPage';
import { StyleBookShell } from '../templates/StyleBookShell';

/**
 * Style Book application page — sidebar shell and section routing.
 *
 * @return {JSX.Element} Style Book page.
 */
export function TokensPage() {
	const {
		tokens,
		isReady,
		isActive,
		isResolved,
		values: feedValues,
		rest,
		version,
		feed,
	} = useDesignTokensFeed();
	const { values, saveToken, getFieldState } = useTokenEditor(rest, feedValues);
	const { section, setSection, sections } = useStyleBookNavigation(
		tokens,
		feed?.variants ?? {}
	);

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
		content = (
			<OverviewPage
				sections={sections}
				tokens={tokens}
				values={values}
				variants={feed?.variants ?? {}}
				onNavigate={setSection}
			/>
		);
	} else if (section === SECTION_VARIANTS) {
		content = <VariantsPage variants={feed?.variants ?? {}} />;
	} else {
		content = (
			<FoundationPage
				sectionId={section}
				sections={sections}
				{...sharedListProps}
			/>
		);
	}

	return (
		<StyleBookShell
			section={section}
			sections={sections}
			onNavigate={setSection}
			version={version}
		>
			{content}
		</StyleBookShell>
	);
}
