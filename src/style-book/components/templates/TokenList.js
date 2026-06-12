/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Notice, Spinner } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { TokenField } from '../molecules/TokenField';
import { TokenGroup } from '../organisms/TokenGroup';

/**
 * Group flat token definitions by their schema group name.
 *
 * @param {object[]} tokens Flat token list from the feed.
 * @return {Record<string, object[]>} Tokens keyed by group name.
 */
function groupTokens( tokens ) {
	return tokens.reduce( ( groups, token ) => {
		const key = token.group || __( 'Other', 'kadence-blocks' );

		if ( ! groups[ key ] ) {
			groups[ key ] = [];
		}

		groups[ key ].push( token );

		return groups;
	}, {} );
}

/**
 * Full token editor list grouped by schema sections.
 *
 * @param {object}   props              Component props.
 * @param {object[]} props.tokens       Flat token definitions.
 * @param {Record<string, string>} props.values Resolved values.
 * @param {boolean}  props.isReady      Whether the feed loaded.
 * @param {boolean}  props.isActive     Whether design tokens are active.
 * @param {boolean}  props.isResolved   Whether values resolved successfully.
 * @param {Function} props.onSave       Save handler for token fields.
 * @param {Function} props.getFieldState Field state accessor.
 * @param {string}   [props.emptyMessage] Message when no tokens match.
 * @param {boolean}  [props.groupBySchema] Whether to subgroup by schema group label.
 * @return {JSX.Element} Token list template.
 */
export function TokenList( {
	tokens,
	values,
	isReady,
	isActive,
	isResolved,
	onSave,
	getFieldState,
	emptyMessage,
	groupBySchema = true,
} ) {
	const grouped = useMemo( () => groupTokens( tokens ), [ tokens ] );

	if ( ! isReady ) {
		return (
			<div className="kadence-style-book__loading">
				<Spinner />
			</div>
		);
	}

	if ( ! isActive ) {
		return (
			<Notice status="warning" isDismissible={ false }>
				{ __( 'Design tokens are not active on this site.', 'kadence-blocks' ) }
			</Notice>
		);
	}

	return (
		<div className="kadence-style-book__token-list">
			{ ! isResolved && (
				<Notice status="warning" isDismissible={ false }>
					{ __(
						'Token values could not be resolved. You can still browse structure, but previews may be empty.',
						'kadence-blocks'
					) }
				</Notice>
			) }

			{ tokens.length === 0 ? (
				<p className="kadence-style-book__empty">
					{ emptyMessage ?? __( 'No tokens available.', 'kadence-blocks' ) }
				</p>
			) : groupBySchema ? (
				Object.entries( grouped ).map( ( [ groupName, groupTokensList ] ) => (
					<TokenGroup
						key={ groupName }
						groupName={ groupName }
						tokens={ groupTokensList }
						values={ values }
						onSave={ onSave }
						getFieldState={ getFieldState }
					/>
				) )
			) : (
				<div className="kadence-style-book__token-group-list">
					{ tokens.map( ( token ) => (
						<TokenField
							key={ token.id }
							token={ token }
							value={ values[ token.id ] ?? '' }
							onSave={ onSave }
							fieldState={ getFieldState( token.id ) }
						/>
					) ) }
				</div>
			) }
		</div>
	);
}
