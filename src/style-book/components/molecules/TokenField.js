/**
 * Internal dependencies
 */
import { isColorType, isResponsiveType } from '../../helpers/tokens';
import { ColorTokenField } from './ColorTokenField';
import { GenericTokenField } from './GenericTokenField';
import { ResponsiveTokenField } from './ResponsiveTokenField';

/**
 * Route a token row to the appropriate field editor for its type.
 *
 * @param {object} props Token field props forwarded to the typed editor.
 * @return {JSX.Element} Typed token field row.
 */
export function TokenField(props) {
	if (isColorType(props.token.type)) {
		return <ColorTokenField {...props} />;
	}

	if (isResponsiveType(props.token.type)) {
		return <ResponsiveTokenField {...props} />;
	}

	return <GenericTokenField {...props} />;
}
