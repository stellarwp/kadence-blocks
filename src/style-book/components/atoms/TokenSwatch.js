/**
 * Internal dependencies
 */
import { isColorType, normalizeHexColor } from '../../helpers/tokens';
import './token-swatch.scss';

/**
 * A small color preview swatch for color tokens.
 *
 * @param {{ type: string, value: string }} props Component props.
 * @return {JSX.Element|null} Swatch element or null when not applicable.
 */
export function TokenSwatch({ type, value }) {
	if (!isColorType(type)) {
		return null;
	}

	const hex = normalizeHexColor(value);
	const background = hex ?? value;

	return (
		<span
			className="kadence-blocks-style-book__swatch"
			style={{ backgroundColor: background }}
			aria-hidden="true"
		/>
	);
}
