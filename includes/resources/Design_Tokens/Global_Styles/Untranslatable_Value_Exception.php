<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Global_Styles;

use Exception;

/**
 * Thrown when a Site Editor preset value cannot be translated to a DTCG leaf — an unsupported
 * category (e.g. "shadow") or a malformed literal (empty, or a color that matches neither hex nor
 * a CSS color function).
 *
 * @since TBD
 */
final class Untranslatable_Value_Exception extends Exception {
}
