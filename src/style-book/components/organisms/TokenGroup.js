/**
 * Internal dependencies
 */
import { TokenField } from '../molecules/TokenField';

/**
 * A schema group of editable tokens.
 *
 * @param {object}   props              Component props.
 * @param {string}   props.groupName    Display name for the group.
 * @param {object[]} props.tokens       Tokens belonging to this group.
 * @param {Record<string, string>} props.values Resolved values keyed by token id.
 * @param {Function} props.onSave       Save handler passed to each field.
 * @param {Function} props.getFieldState Field state accessor.
 * @return {JSX.Element} Token group section.
 */
export function TokenGroup({ groupName, tokens, values, onSave, getFieldState }) {
	return (
		<section className="kadence-style-book__token-group">
			<h2 className="kadence-style-book__token-group-title">{groupName}</h2>
			<div className="kadence-style-book__token-group-list">
				{tokens.map((token) => (
					<TokenField
						key={token.id}
						token={token}
						value={values[token.id] ?? ''}
						onSave={onSave}
						fieldState={getFieldState(token.id)}
					/>
				))}
			</div>
		</section>
	);
}
