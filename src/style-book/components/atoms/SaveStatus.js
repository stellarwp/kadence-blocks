/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Inline save status for a token field.
 *
 * @param {{ status: string, error?: string|null }} props Component props.
 * @return {JSX.Element|null} Status message or null when idle.
 */
export function SaveStatus({ status, error = null }) {
	if (status === 'saving') {
		return (
			<span className="kadence-style-book__save-status kadence-style-book__save-status--saving">
				{__('Saving…', 'kadence-blocks')}
			</span>
		);
	}

	if (status === 'saved') {
		return (
			<span className="kadence-style-book__save-status kadence-style-book__save-status--saved">
				{__('Saved', 'kadence-blocks')}
			</span>
		);
	}

	if (status === 'error' && error) {
		return <span className="kadence-style-book__save-status kadence-style-book__save-status--error">{error}</span>;
	}

	return null;
}
