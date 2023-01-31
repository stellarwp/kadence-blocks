<?php
/**
 * Provides an API for rendering templates.
 *
 * @since 1.0.0
 *
 * @package KadenceWP\KadenceBlocks\StellarWP\Telemetry\Contracts
 *
 * @license GPL-2.0-or-later
 * Modified by kadencewp on 30-January-2023 using Strauss.
 * @see https://github.com/BrianHenryIE/strauss
 */

namespace KadenceWP\KadenceBlocks\StellarWP\Telemetry\Contracts;

/**
 * Interface that provides an API for rendering templates.
 */
interface Template_Interface {
	/**
	 * Renders the template.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function render();

	/**
	 * Enqueues assets for the rendered template.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function enqueue();

	/**
	 * Determines if the template should be rendered.
	 *
	 * @since 1.0.0
	 *
	 * @return boolean
	 */
	public function should_render();
}
