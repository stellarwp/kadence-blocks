/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import './token-list.scss';
import { Notice, Spinner } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { TokenGroup } from '../organisms/TokenGroup';

/**
 * Group flat token definitions by their schema group name.
 *
 * @param {object[]} tokens Flat token list from the feed.
 * @return {Record<string, object[]>} Tokens keyed by group name.
 */
function groupTokens(tokens) {
	return tokens.reduce((groups, token) => {
		const key = token.group || __('Other', 'kadence-blocks');

		if (!groups[key]) {
			groups[key] = [];
		}

		groups[key].push(token);

		return groups;
	}, {});
}

/**
 * Full token editor list grouped by schema sections.
 *
 * @param {object}   props                      Component props.
 * @param {object[]} props.tokens               Flat token definitions.
 * @param {Record<string, string>} props.values Resolved values.
 * @param {Record<string, object>} [props.responsive] Authored responsive / clamp shapes by token id.
 * @param {boolean}  props.isReady              Whether the feed loaded.
 * @param {boolean}  props.isActive             Whether design tokens are active.
 * @param {boolean}  props.isResolved           Whether values resolved successfully.
 * @param {Function} props.onSave               Save handler for token fields.
 * @param {Function} props.getFieldState        Field state accessor.
 * @param {string}   [props.emptyMessage]       Message when no tokens match.
 * @param {boolean}  [props.groupBySchema]      Whether to subgroup by schema group label.
 * @param {Function} [props.onCreatePrimitive]  Async create fn.
 * @param {Function} [props.onDeletePrimitive]  Async delete fn.
 * @param {Function} [props.onRenamePrimitive]  Async rename fn.
 * @param {Function} [props.onFetchPreview]     Async preview fn.
 * @param {Function} [props.onMutationSuccess]  Mutation success callback.
 * @return {JSX.Element} Token list template.
 */
export function TokenList({
	tokens,
	values,
	responsive,
	isReady,
	isActive,
	isResolved,
	onSave,
	getFieldState,
	emptyMessage,
	groupBySchema = true,
	onCreatePrimitive,
	onDeletePrimitive,
	onRenamePrimitive,
	onFetchPreview,
	onMutationSuccess,
}) {
	const grouped = useMemo(() => groupTokens(tokens), [tokens]);

	if (!isReady) {
		return (
			<div className="kadence-blocks-style-book__loading">
				<Spinner />
			</div>
		);
	}

	if (!isActive) {
		return (
			<Notice status="warning" isDismissible={false}>
				{__('Design tokens are not active on this site.', 'kadence-blocks')}
			</Notice>
		);
	}

	return (
		<div className="kadence-blocks-style-book__token-list">
			{!isResolved && (
				<Notice status="warning" isDismissible={false}>
					{__(
						'Token values could not be resolved. You can still browse structure, but previews may be empty.',
						'kadence-blocks'
					)}
				</Notice>
			)}

			{tokens.length === 0 && !onCreatePrimitive ? (
				<p className="kadence-blocks-style-book__empty">
					{emptyMessage ?? __('No tokens available.', 'kadence-blocks')}
				</p>
			) : groupBySchema ? (
				Object.entries(grouped).map(([groupName, groupTokensList]) => {
					const hasUserCreated = groupTokensList.some((t) => t.userCreated);

					return (
						<TokenGroup
							key={groupName}
							groupName={groupName}
							tokens={groupTokensList}
							values={values}
							responsive={responsive}
							onSave={onSave}
							getFieldState={getFieldState}
							isUserCreatedGroup={hasUserCreated}
							onCreatePrimitive={hasUserCreated ? onCreatePrimitive : undefined}
							onDeletePrimitive={hasUserCreated ? onDeletePrimitive : undefined}
							onRenamePrimitive={hasUserCreated ? onRenamePrimitive : undefined}
							onFetchPreview={hasUserCreated ? onFetchPreview : undefined}
							onMutationSuccess={hasUserCreated ? onMutationSuccess : undefined}
						/>
					);
				})
			) : (
				// The section's own <header> already shows the group title, so the
				// nested TokenGroup renders without a heading — only its add/rename/
				// delete controls, which is what a single, ungrouped section needs.
				<TokenGroup
					groupName=""
					tokens={tokens}
					values={values}
					responsive={responsive}
					onSave={onSave}
					getFieldState={getFieldState}
					isUserCreatedGroup={Boolean(onCreatePrimitive)}
					onCreatePrimitive={onCreatePrimitive}
					onDeletePrimitive={onDeletePrimitive}
					onRenamePrimitive={onRenamePrimitive}
					onFetchPreview={onFetchPreview}
					onMutationSuccess={onMutationSuccess}
				/>
			)}
		</div>
	);
}
