/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Display the token type as a compact label.
 *
 * @param {{ type: string }} props Component props.
 * @return {JSX.Element} Type badge.
 */
export function TokenTypeBadge( { type } ) {
	return <span className="kadence-style-book__type-badge">{ type || __( 'unknown', 'kadence-blocks' ) }</span>;
}
