<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Registry;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Exception\Missing_Baseline_Entry;
use KadenceWP\KadenceBlocks\Psr\Log\LoggerInterface;

/**
 * Enforces "every declared token must have a baseline entry."
 *
 * Policy:
 *   - Always log the missing ids.
 *   - Under WP_DEBUG: throw Missing_Baseline_Entry so dev/CI cannot miss the misconfiguration.
 *   - In production: deactivate token projection (fall back to existing KB behaviour) + admin notice.
 *     Never white-screen a live site.
 *
 * @since TBD
 */
final class Baseline_Guard {

	private Token_Registry $registry;
	private Baseline_Document $baseline;
	private LoggerInterface $logger;

	/**
	 * Whether a missing entry throws. Resolves to WP_DEBUG when null (the production/dev default).
	 *
	 * @since TBD
	 *
	 * @var bool|null
	 */
	private ?bool $throw_on_missing;

	/**
	 * @since TBD
	 *
	 * @param Token_Registry    $registry         The registry whose declared tokens are validated.
	 * @param Baseline_Document $baseline         The baseline to validate the declared tokens against.
	 * @param LoggerInterface   $logger           Logger for the missing-entry diagnostics.
	 * @param bool|null         $throw_on_missing Force the throw-vs-degrade decision; null defers to
	 *                                            WP_DEBUG. Exposed for testability; the container
	 *                                            leaves it null.
	 */
	public function __construct(
		Token_Registry $registry,
		Baseline_Document $baseline,
		LoggerInterface $logger,
		?bool $throw_on_missing = null
	) {
		$this->registry         = $registry;
		$this->baseline         = $baseline;
		$this->logger           = $logger;
		$this->throw_on_missing = $throw_on_missing;
	}

	/**
	 * Run the guard: log, then either throw (debug) or fail closed (production) on missing entries.
	 *
	 * @since TBD
	 *
	 * @throws Missing_Baseline_Entry When WP_DEBUG is on and any declared token lacks a baseline entry.
	 *
	 * @return void
	 */
	public function run(): void {
		// TODO (SOFT-3377): this walks every declared token against the baseline on each run — O(n) per
		// request once it runs against the real baseline. Cache the result and recompute only when a token
		// is added/updated/removed so the common (unchanged-registry) path stays cheap.
		$missing = $this->registry->missing_from_baseline( $this->baseline );

		if ( empty( $missing ) ) {
			return;
		}

		$message = sprintf(
			'Design tokens disabled: %d declared token(s) have no baseline entry: %s',
			count( $missing ),
			implode( ', ', $missing )
		);

		// TODO (SOFT-3377): the guard moves off `init` and runs against the real baseline, so this would
		// otherwise log once per front-end/admin/REST/AJAX/cron request on a misconfigured site. A missing
		// baseline entry is a deterministic deploy-time error (identical every request), so throttle to
		// once per process with a static flag before this stops being a no-op.
		$this->logger->error( $message );

		if ( $this->should_throw() ) {
			throw new Missing_Baseline_Entry( $message );
		}

		// Production: fail closed but stay up.
		$this->registry->deactivate();
		$this->register_admin_notice( $missing );
	}

	/**
	 * Whether to throw on a misconfiguration. Honours an injected override, else defers to WP_DEBUG —
	 * the seam lets tests exercise both branches without redefining the WP_DEBUG constant.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	private function should_throw(): bool {
		if ( $this->throw_on_missing !== null ) {
			return $this->throw_on_missing;
		}

		return defined( 'WP_DEBUG' ) && WP_DEBUG;
	}

	/**
	 * Register the production admin notice explaining why token projection is disabled.
	 *
	 * @since TBD
	 *
	 * @param string[] $missing The token ids missing a baseline entry.
	 *
	 * @return void
	 */
	private function register_admin_notice( array $missing ): void {
		add_action(
			'admin_notices',
			static function () use ( $missing ): void {
				// Only surface the misconfiguration to users who could act on it, and avoid leaking
				// internal token ids to lower-privileged admin-area users.
				if ( ! current_user_can( 'manage_options' ) ) {
					return;
				}

				printf(
					'<div class="notice notice-error"><p>%s</p></div>',
					esc_html(
						sprintf(
							/* translators: %s: comma-separated token ids. */
							__( 'Kadence Blocks design tokens are disabled because these tokens have no baseline entry: %s', 'kadence-blocks' ),
							implode( ', ', $missing )
						)
					)
				);
			}
		);
	}
}
