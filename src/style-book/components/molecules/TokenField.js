/**
 * Internal dependencies
 */
import { isColorType } from '../../helpers/tokens';
import { ColorTokenField } from './ColorTokenField';
import { GenericTokenField } from './GenericTokenField';

/**
 * Route a token row to the appropriate field editor for its type.
 *
 * @param {object} props Token field props forwarded to the typed editor.
 * @return {JSX.Element} Typed token field row.
 */
export function TokenField( props ) {
	if ( isColorType( props.token.type ) ) {
		return <ColorTokenField { ...props } />;
	}

	return <GenericTokenField { ...props } />;
}
