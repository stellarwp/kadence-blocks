<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Global_Styles;

use Exception;

/**
 * Thrown when a Site Editor preset value cannot be translated to a DTCG leaf — an unsupported
 * category (e.g. "shadow") or a malformed literal (an empty color/dimension/font-family value, or
 * a font-family stack that is only commas).
 *
 * @since TBD
 */
final class Untranslatable_Value_Exception extends Exception {
}
