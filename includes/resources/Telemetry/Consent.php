<?php declare( strict_types=1 );
// cspell:ignore optin .

namespace KadenceWP\KadenceBlocks\Telemetry;

use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Config;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Opt_In\Opt_In_Subscriber;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Opt_In\Opt_In_Template;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Opt_In\Status;

/**
 * Lets an administrator change their usage data sharing consent after the opt-in prompt.
 */
final class Consent {

	/**
	 * The admin-post action and nonce name.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const ACTION = 'kadence_blocks_telemetry_consent';

	/**
	 * The checkbox field name.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const FIELD = 'kadence_blocks_telemetry';

	/**
	 * The telemetry opt-in status store.
	 *
	 * @since TBD
	 *
	 * @var Status
	 */
	private Status $status;

	/**
	 * The telemetry library's opt-in handler.
	 *
	 * @since TBD
	 *
	 * @var Opt_In_Subscriber
	 */
	private Opt_In_Subscriber $subscriber;

	/**
	 * The telemetry library's opt-in prompt.
	 *
	 * @since TBD
	 *
	 * @var Opt_In_Template
	 */
	private Opt_In_Template $template;

	/**
	 * Constructor.
	 *
	 * @since TBD
	 *
	 * @param Status            $status     The telemetry opt-in status store.
	 * @param Opt_In_Subscriber $subscriber The telemetry library's opt-in handler.
	 * @param Opt_In_Template   $template   The telemetry library's opt-in prompt.
	 */
	public function __construct(
		Status $status,
		Opt_In_Subscriber $subscriber,
		Opt_In_Template $template
	) {
		$this->status     = $status;
		$this->subscriber = $subscriber;
		$this->template   = $template;
	}

	/**
	 * The admin-post action and nonce name.
	 *
	 * @since TBD
	 *
	 * @return string The action name.
	 */
	public static function get_action(): string {
		return self::ACTION;
	}

	/**
	 * The checkbox field name.
	 *
	 * @since TBD
	 *
	 * @return string The field name.
	 */
	public static function get_field(): string {
		return self::FIELD;
	}

	/**
	 * Whether this plugin is currently opted in to usage data sharing.
	 *
	 * @since TBD
	 *
	 * @return bool True when opted in.
	 */
	public function is_enabled(): bool {
		$option = $this->status->get_option();

		return true === ( $option['plugins'][ Config::get_stellar_slug() ]['optin'] ?? false );
	}

	/**
	 * Opt in, registering the site with the telemetry server.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function enable(): void {
		$slug = Config::get_stellar_slug();

		$this->subscriber->opt_in( $slug );

		// Don't show the opt-in prompt again.
		update_option( $this->template->get_option_name( $slug ), '0' );
	}

	/**
	 * Withdraw consent, which stops any further collection and sending.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function disable(): void {
		$this->status->set_status( false, Config::get_stellar_slug() );
	}

	/**
	 * Handle the settings form submission.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function handle_request(): void {
		check_admin_referer( self::ACTION );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die(
				esc_html__( 'Sorry, you are not allowed to change this setting.', 'kadence-blocks' ),
				'',
				403
			);
		}

		$value = isset( $_POST[ self::FIELD ] ) ? sanitize_text_field( wp_unslash( $_POST[ self::FIELD ] ) ) : '';

		if ( '1' === $value ) {
			$this->enable();
		} else {
			$this->disable();
		}

		wp_safe_redirect( admin_url( 'admin.php?page=kadence-blocks' ) );
		exit;
	}

	/**
	 * Render the settings section.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function render(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		?>
		<h2><?php echo esc_html__( 'Usage Data Sharing', 'kadence-blocks' ); ?></h2>
		<div class="kt-promo-row-area">
			<form action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post">
				<input type="hidden" name="action" value="<?php echo esc_attr( self::ACTION ); ?>">
				<?php wp_nonce_field( self::ACTION ); ?>
				<p>
					<label>
						<input type="checkbox" name="<?php echo esc_attr( self::FIELD ); ?>" value="1" <?php checked( $this->is_enabled() ); ?>>
						<?php echo esc_html__( 'Share usage data to help improve Kadence Blocks.', 'kadence-blocks' ); ?>
					</label>
				</p>
				<p>
					<a href="https://www.liquidweb.com/policies/kadence-in-app-telemetry/" target="_blank" rel="noopener noreferrer">
						<?php echo esc_html__( 'Learn what data is shared', 'kadence-blocks' ); ?>
					</a>
				</p>
				<?php submit_button( __( 'Save Changes', 'kadence-blocks' ) ); ?>
			</form>
		</div>
		<div class="kt-dashboard-spacer"></div>
		<?php
	}
}
