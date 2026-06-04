<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception;

use RuntimeException;

/**
 * Thrown when an alias references a dot-path that does not resolve to a token leaf
 * (the path is missing, or points at a group rather than a token with a $value).
 * Caught by the REST write layer and surfaced as HTTP 422.
 *
 * @since TBD
 */
final class Dangling_Alias_Exception extends RuntimeException {}
