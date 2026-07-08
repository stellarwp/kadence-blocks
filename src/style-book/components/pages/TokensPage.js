/**
 * WordPress dependencies
 */
import { useCallback, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { CUSTOM_COLORS_GROUP_LABEL, SECTION_OVERVIEW } from '../../constants/navigation';
import { findSection } from '../../helpers/navigation';
import { useDesignTokensFeed } from '../../hooks/use-design-tokens-feed';
import { useStyleBookNavigation } from '../../hooks/use-style-book-navigation';
import { useTokenEditor } from '../../hooks/use-token-editor';
import { useUserPrimitiveEditor } from '../../hooks/use-user-primitive-editor';
import { FoundationPage } from '../pages/FoundationPage';
import { OverviewPage } from '../pages/OverviewPage';
import { StyleBookShell } from '../templates/StyleBookShell';

/**
 * Build an optimistic token definition from a create payload.
 *
 * The `cssVar` mirrors `Css_Var::from_id()` on the PHP side: prefix `--kb-token--`, then every
 * `.` in the dot-path id replaced with `--`. Ids and var names must not drift, so this is the
 * one JS spot that reconstructs the rule for the optimistic, pre-refresh token entry.
 *
 * @param {object} payload Create request payload { id, label, $value }.
 * @return {object} Token definition ready for the flat token list.
 */
function tokenFromCreatePayload(payload) {
	const id = `primitive.color.custom.${payload.id}`;
	const label = payload.label?.trim() || payload.id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

	return {
		id,
		type: 'color',
		label,
		cssVar: `--kb-token--${id.replace(/\./g, '--')}`,
		group: CUSTOM_COLORS_GROUP_LABEL,
		userCreated: true,
	};
}

/**
 * Style Book application page — sidebar shell and section routing.
 *
 * @return {JSX.Element} Style Book page.
 */
export function TokensPage() {
	const {
		tokens: feedTokens,
		isReady,
		isActive,
		isResolved,
		values: feedValues,
		rest,
		version: initialVersion,
		slug,
	} = useDesignTokensFeed();

	// Shared across every write surface on this page: the document version changes on any
	// write to the set (a semantic-token edit, a primitive create/rename/delete), so tracking it
	// once here — rather than letting each hook keep its own copy — keeps the write guard from
	// tripping a false-positive conflict when one surface's write is followed by another's.
	const [version, setVersion] = useState(initialVersion);

	const { values, saveToken, getFieldState, refreshValues } = useTokenEditor(rest, feedValues, setVersion, slug);

	const [localTokens, setLocalTokens] = useState(null);
	const tokens = localTokens ?? feedTokens;

	const { section, setSection, sections } = useStyleBookNavigation(tokens);

	const { createPrimitive, deletePrimitive, renamePrimitive, fetchPreview } = useUserPrimitiveEditor(
		version,
		slug,
		setVersion
	);

	const handleMutationSuccess = useCallback(
		({ type, payload, id, oldId, newToken }) => {
			setLocalTokens((current) => {
				const base = current ?? feedTokens;

				if (type === 'create') {
					return [...base, tokenFromCreatePayload(payload)];
				}

				if (type === 'delete') {
					return base.filter((t) => t.id !== id);
				}

				if (type === 'rename' && oldId && newToken) {
					return base.map((t) => (t.id === oldId ? newToken : t));
				}

				return base;
			});

			void refreshValues();
		},
		[feedTokens, refreshValues]
	);

	const sharedListProps = {
		tokens,
		values,
		isReady,
		isActive,
		isResolved,
		onSave: saveToken,
		getFieldState,
		onCreatePrimitive: createPrimitive,
		onDeletePrimitive: deletePrimitive,
		onRenamePrimitive: renamePrimitive,
		onFetchPreview: fetchPreview,
		onMutationSuccess: handleMutationSuccess,
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
