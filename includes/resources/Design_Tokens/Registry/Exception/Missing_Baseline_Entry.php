<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Registry\Exception;

use RuntimeException;

/**
 * Thrown (under WP_DEBUG) when a declared token has no entry in the baseline document.
 *
 * @since TBD
 */
final class Missing_Baseline_Entry extends RuntimeException {
}
