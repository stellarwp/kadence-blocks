<?php
/**
 * Handles the methods for rendering the "Exit Interview" modal on plugin deactivation.
 *
 * @since 1.0.0
 *
 * @package StellarWP\Telemetry
 *
 * @license GPL-2.0-or-later
 * Modified by kadencewp on 30-January-2023 using Strauss.
 * @see https://github.com/BrianHenryIE/strauss
 */

namespace KadenceWP\KadenceBlocks\StellarWP\Telemetry\Exit_Interview;

use KadenceWP\KadenceBlocks\StellarWP\ContainerContract\ContainerInterface;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Admin\Resources;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Config;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Contracts\Template_Interface;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Core;

/**
 * The primary class for rendering the "Exit Interview" modal on plugin deactivation.
 *
 * @since 1.0.0
 *
 * @package StellarWP\Telemetry
 */
class Template implements Template_Interface {

	/**
	 * The plugin container.
	 *
	 * @since 1.0.0
	 *
	 * @var \KadenceWP\KadenceBlocks\StellarWP\ContainerContract\ContainerInterface
	 */
	protected $container;

	/**
	 * The class constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param \KadenceWP\KadenceBlocks\StellarWP\ContainerContract\ContainerInterface $container The container.
	 */
	public function __construct( ContainerInterface $container ) {
		$this->container = $container;
	}

	/**
	 * Gets the arguments for configuring the "Exit Interview" modal.
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	protected function get_args() {
		/**
		 * Filters the "Exit Interview" modal arguments.
		 *
		 * @since 1.0.0
		 *
		 * @param array $args The arguments used to configure the modal.
		 */
		return apply_filters(
			'stellarwp/telemetry/' . Config::get_stellar_slug() . '/exit_interview_args',
			[
				'plugin_slug'        => Config::get_stellar_slug(),
				'plugin_logo'        => Resources::get_asset_path() . 'resources/images/stellar-logo.svg',
				'plugin_logo_width'  => 151,
				'plugin_logo_height' => 32,
				'plugin_logo_alt'    => 'StellarWP Logo',
				'heading'            => __( 'We’re sorry to see you go.', 'stellarwp-telemetry' ),
				'intro'              => __( 'We’d love to know why you’re leaving so we can improve our plugin.', 'stellarwp-telemetry' ),
				'uninstall_reasons'  => [
					[
						'uninstall_reason_id' => 'confusing',
						'uninstall_reason'    => __( 'I couldn’t understand how to make it work.', 'stellarwp-telemetry' ),
					],
					[
						'uninstall_reason_id' => 'better-plugin',
						'uninstall_reason'    => __( 'I found a better plugin.', 'stellarwp-telemetry' ),
					],
					[
						'uninstall_reason_id' => 'no-feature',
						'uninstall_reason'    => __( 'I need a specific feature it doesn’t provide.', 'stellarwp-telemetry' ),
					],
					[
						'uninstall_reason_id' => 'broken',
						'uninstall_reason'    => __( 'The plugin doesn’t work.', 'stellarwp-telemetry' ),
					],
					[
						'uninstall_reason_id' => 'other',
						'uninstall_reason'    => __( 'Other', 'stellarwp-telemetry' ),
						'show_comment'        => true,
					],
				],
			]
		);
	}

	/**
	 * @inheritDoc
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function render() {
		load_template( dirname( dirname( __DIR__ ) ) . '/views/exit-interview.php', true, $this->get_args() );
	}

	/**
	 * @inheritDoc
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function enqueue() {
		// TODO: Implement enqueue() method.
	}

	/**
	 * @inheritDoc
	 *
	 * @since 1.0.0
	 *
	 * @return boolean
	 */
	public function should_render() {
		/**
		 * Filters whether the "Exit Interview" modal should render.
		 *
		 * @since 1.0.0
		 *
		 * @param bool $should_render Whether the modal should render.
		 */
		return apply_filters( 'stellarwp/telemetry/' . Config::get_hook_prefix() . 'exit_interview_should_render', true );
	}

	/**
	 * Renders the template if it should be rendered.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function maybe_render() {
		if ( $this->should_render() ) {
			$this->render();
		}
	}
}
