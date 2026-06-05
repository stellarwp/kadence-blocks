<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Contracts;

/**
 * Marker contract for all design-token projectors.
 *
 * Projectors consume a resolved token set and produce output in a format specific to their target
 * (CSS custom properties, theme.json preset array, REST payload, etc.). The output type varies
 * across projectors, so no method signature is enforced here — each concrete class declares its
 * own. The interface provides a named type for container registrations and makes projectors
 * discoverable by tooling or admin UI that enumerates available projectors.
 *
 * @since TBD
 */
interface Projector {
}
