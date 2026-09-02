<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception;

use RuntimeException;

/**
 * Thrown when alias resolution re-enters a dot-path already on the resolution stack.
 * Caught by the REST write layer and surfaced as HTTP 422.
 *
 * @since TBD
 */
final class Alias_Cycle_Exception extends RuntimeException {}
