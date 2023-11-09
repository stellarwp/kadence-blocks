<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Cache;

/**
 * Caches AI Related files.
 */
final class Ai_Cache extends Block_Library_Cache {

	/**
	 * Create a hashed file name from provided identifier.
	 *
	 * @param mixed $identifier Unique data to identify this file.
	 *
	 * @return string
	 * @throws \InvalidArgumentException
	 * @throws \RuntimeException
	 */
	protected function filename( $identifier ): string {
		return $this->hasher->hash( [
			'kadence-ai-generated-content',
			$identifier,
		] ) . $this->ext;
	}

}
