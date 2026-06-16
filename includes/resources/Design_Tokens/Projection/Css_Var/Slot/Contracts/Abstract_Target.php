<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Slot\Contracts;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Definition;

/**
 * Base for slot targets: supplies the projection-key, token resolution and custom-property logic from
 * three consts, so a concrete slot family only declares its projection key, variable prefix and the
 * slugs Kadence Blocks ships.
 *
 * The consts are protected, not private: a private const is visible only inside its declaring class, so
 * the inherited methods could not read it through late static binding. Protected is the minimum that
 * lets the logic defined here resolve the child's values via static::PROJECTION / VAR_PREFIX / SLOTS.
 *
 * @since TBD
 */
abstract class Abstract_Target implements Target {

	/**
	 * The projection key a token declares to claim a slot in this family, e.g. "kb_spacing_slot". Concrete
	 * families override.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	protected const PROJECTION = '';

	/**
	 * The custom-property prefix Kadence Blocks emits each slug under, e.g. "--global-kb-spacing-".
	 * Concrete families override.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	protected const VAR_PREFIX = '';

	/**
	 * The slugs Kadence Blocks ships for this family; a claim on any other slug is ignored so the override
	 * can never point at a slug no block reads. Concrete families override.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	protected const SLOTS = [];

	/**
	 * The claimed slug, e.g. "lg".
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public string $slot;

	/**
	 * Final so `new static()` in from_token() is safe: no subclass can change the constructor signature.
	 * Protected (not public) keeps from_token() the only way to build a target.
	 *
	 * @param string $slot The claimed slug.
	 */
	final protected function __construct( string $slot ) {
		$this->slot = $slot;
	}

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 */
	final public static function get_projection_key(): string {
		return static::PROJECTION;
	}

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 */
	final public static function from_token( Token_Definition $token ): ?self {
		if ( ! $token->has_projection( static::PROJECTION ) ) {
			return null;
		}

		$slot = $token->projections[ static::PROJECTION ] ?? null;

		if ( ! is_string( $slot ) || ! in_array( $slot, static::SLOTS, true ) ) {
			return null;
		}

		return new static( $slot );
	}

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 */
	final public function css_property(): string {
		return static::VAR_PREFIX . $this->slot;
	}
}
