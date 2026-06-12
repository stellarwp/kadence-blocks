/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useDesignTokensFeed } from '../../hooks/use-design-tokens-feed';
import { useTokenEditor } from '../../hooks/use-token-editor';
import { TokenList } from '../templates/TokenList';

/**
 * Style Book tokens page — read and edit resolved design token values.
 *
 * @return {JSX.Element} Tokens editor page.
 */
export function TokensPage() {
	const { tokens, isReady, isActive, isResolved, values: feedValues, rest, version } = useDesignTokensFeed();
	const { values, saveToken, getFieldState } = useTokenEditor(rest, feedValues);

	return (
		<div className="kadence-style-book__tokens-page">
			<header className="kadence-style-book__header">
				<h1 className="kadence-style-book__title">{__('Style Book', 'kadence-blocks')}</h1>
				<p className="kadence-style-book__intro">
					{__(
						'Preview and edit Kadence design tokens. Changes save to the token store via the REST API.',
						'kadence-blocks'
					)}
				</p>
				{version ? (
					<p className="kadence-style-book__version">
						{__('Store version:', 'kadence-blocks')} <code>{version}</code>
					</p>
				) : null}
			</header>

			<TokenList
				tokens={tokens}
				values={values}
				isReady={isReady}
				isActive={isActive}
				isResolved={isResolved}
				onSave={saveToken}
				getFieldState={getFieldState}
			/>
		</div>
	);
}
