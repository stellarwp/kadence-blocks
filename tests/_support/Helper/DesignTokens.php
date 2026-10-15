<?php

declare( strict_types=1 );

namespace Helper;

use Codeception\Module;
use Codeception\TestInterface;
use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Default_Css\Css_Builder as Block_Default_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Css_Builder as Css_Var_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Option\Palette_Filter;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Palette\Projector as Palette_Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Preset\Css_Builder as Preset_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Buttons\Theme_Button_Styles_Overlay;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Style_Guide_Overlay;
use ReflectionProperty;
use WP_Scripts;
use WP_Styles;

/**
 * Starts design token reads from the cold caches a new request has and, after
 * the test, drops what the test cached and restores the style and script
 * registries it replaced.
 */
final class DesignTokens extends Module {

	/**
	 * The per-request memos the token projections keep, by class.
	 *
	 * @since TBD
	 *
	 * @var array<class-string, string[]>
	 */
	private const MEMOS = [
		Token_Resolver::class        => [ 'memo', 'effective_memo' ],
		Css_Var_Builder::class       => [ 'memo' ],
		Preset_Builder::class        => [ 'memo', 'collected' ],
		Palette_Projector::class     => [ 'memo' ],
		Block_Default_Builder::class => [ 'memo' ],
	];

	/**
	 * Whether the current test read through the token caches.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private bool $cached = false;

	/**
	 * Whether the current test replaced the style and script registries.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private bool $swapped = false;

	/**
	 * The styles registry before the test replaced it.
	 *
	 * @since TBD
	 *
	 * @var WP_Styles|null
	 */
	private ?WP_Styles $styles = null;

	/**
	 * The scripts registry before the test replaced it.
	 *
	 * @since TBD
	 *
	 * @var WP_Scripts|null
	 */
	private ?WP_Scripts $scripts = null;

	public function _after( TestInterface $test ): void { // phpcs:ignore PSR2.Methods.MethodDeclaration.Underscore -- Codeception module hook.
		if ( $this->cached ) {
			$this->forget_token_caches();
			$this->cached = false;
		}

		if ( ! $this->swapped ) {
			return;
		}

		$GLOBALS['wp_styles']  = $this->styles;
		$GLOBALS['wp_scripts'] = $this->scripts;

		$this->swapped = false;
		$this->styles  = null;
		$this->scripts = null;
	}

	/**
	 * Drops the token and theme.json caches a new request starts without.
	 */
	public function forget_token_caches(): void {
		wp_cache_flush();
		wp_clean_theme_json_cache();

		$container = App::instance()->container();
		$container->get( Style_Guide_Overlay::class )->flush();
		$container->get( Theme_Button_Styles_Overlay::class )->flush();
		$container->get( Palette_Filter::class )->on_tokens_changed();

		foreach ( self::MEMOS as $class => $properties ) {
			foreach ( $properties as $property ) {
				$memo = new ReflectionProperty( $class, $property );
				$memo->setAccessible( true );
				$memo->setValue( $container->get( $class ), [] );
			}
		}

		$this->cached = true;
	}

	/**
	 * Replaces the style and script registries with empty ones, as a new request has.
	 */
	public function use_fresh_asset_registries(): void {
		if ( ! $this->swapped ) {
			$this->styles  = $GLOBALS['wp_styles'] ?? null;
			$this->scripts = $GLOBALS['wp_scripts'] ?? null;
			$this->swapped = true;
		}

		$GLOBALS['wp_styles']  = new WP_Styles();
		$GLOBALS['wp_scripts'] = new WP_Scripts();
	}
}
