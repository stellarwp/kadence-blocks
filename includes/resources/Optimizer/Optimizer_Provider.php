<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer;

use KadenceWP\KadenceBlocks\Optimizer\Database\Optimizer_Query;
use KadenceWP\KadenceBlocks\Optimizer\Database\Optimizer_Table;
use KadenceWP\KadenceBlocks\Optimizer\Database\Viewport_Hash_Table;
use KadenceWP\KadenceBlocks\Optimizer\Database\Viewport_Query;
use KadenceWP\KadenceBlocks\Optimizer\Hash\Hash_Builder;
use KadenceWP\KadenceBlocks\Optimizer\Hash\Hash_Handler;
use KadenceWP\KadenceBlocks\Optimizer\Hash\Hash_Store;
use KadenceWP\KadenceBlocks\Optimizer\Image\Image_Processor;
use KadenceWP\KadenceBlocks\Optimizer\Image\Processors\Lazy_Load_Processor;
use KadenceWP\KadenceBlocks\Optimizer\Image\Processors\Sizes_Attribute_Processor;
use KadenceWP\KadenceBlocks\Optimizer\Indexing\Post_Sort_Indexer;
use KadenceWP\KadenceBlocks\Optimizer\Lazy_Load\Background_Lazy_Loader;
use KadenceWP\KadenceBlocks\Optimizer\Lazy_Load\Element_Lazy_Loader;
use KadenceWP\KadenceBlocks\Optimizer\Lazy_Load\Sections\Lazy_Render_Decider;
use KadenceWP\KadenceBlocks\Optimizer\Lazy_Load\Slider_Lazy_Loader;
use KadenceWP\KadenceBlocks\Optimizer\Nonce\Nonce;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Column;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Column_Hook_Manager;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Column_Registrar;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Renderers\Optimizer_Renderer;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Sorters\Meta_Sort_Exists;
use KadenceWP\KadenceBlocks\Optimizer\Rest\Optimize_Rest_Controller;
use KadenceWP\KadenceBlocks\Optimizer\Skip_Rules\Rule_Collection;
use KadenceWP\KadenceBlocks\Optimizer\Skip_Rules\Rules\Ignored_Query_Var_Rule;
use KadenceWP\KadenceBlocks\Optimizer\Skip_Rules\Rules\Logged_In_Rule;
use KadenceWP\KadenceBlocks\Optimizer\Skip_Rules\Rules\Optimizer_Request_Rule;
use KadenceWP\KadenceBlocks\Optimizer\Store\Cached_Store_Decorator;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Optimizer\Store\Expired_Store_Decorator;
use KadenceWP\KadenceBlocks\Optimizer\Store\Table_Store;
use KadenceWP\KadenceBlocks\Optimizer\Translation\Text_Repository;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider;
use KadenceWP\KadenceBlocks\StellarWP\SuperGlobals\SuperGlobals;
use KadenceWP\KadenceBlocks\Traits\Viewport_Trait;

final class Optimizer_Provider extends Provider {

	use Viewport_Trait;

	public const OPTIMIZER_COLUMN           = 'kadence_blocks.optimizer.optimizer_column';
	public const OPTIMIZER_COLUMN_REGISTRAR = 'kadence_blocks.optimizer.optimizer_column_registrar';

	public function register(): void {
		$this->container->singleton( State::class, State::class );

		/**
		 * Filter the optimizer enabled state.
		 *
		 * @param bool $enabled Whether the optimizer is enabled or not.
		 */
		$enabled = (bool) apply_filters(
			'kadence_blocks_optimizer_enabled',
			$this->container->get( State::class )->enabled()
		);

		if ( ! $enabled ) {
			return;
		}

		$this->register_mobile_override();
		$this->register_optimizer_query();
		$this->register_viewport_query();
		$this->register_translation();
		$this->register_hash_store();
		$this->register_nonce();
		$this->register_request_anonymizer();
		$this->register_store();
		$this->register_analysis_registry();
		$this->register_asset_loader();
		$this->register_post_list_table();
		$this->register_rest();
		$this->register_request();
		$this->register_element_lazy_loader();
		$this->register_slider_lazy_loader();
		$this->register_background_lazy_loader();
		$this->register_hash_handling();
		$this->register_image_processor();
	}

	/**
	 * Allow force overriding wp_is_mobile with a query string variable.
	 *
	 * @return void
	 */
	private function register_mobile_override(): void {
		add_filter(
			'wp_is_mobile',
			static function ( bool $is_mobile ): bool {
				if ( SuperGlobals::get_get_var( 'kadence_is_mobile' ) ) {
					return true;
				}

				return $is_mobile;
			},
			10,
			1
		);
	}

	private function register_optimizer_query(): void {
		$this->container->singleton( Optimizer_Query::class, Optimizer_Query::class );

		$this->container->when( Optimizer_Query::class )
						->needs( '$table' )
						->give( static fn(): string => Optimizer_Table::table_name( false ) );
	}

	private function register_viewport_query(): void {
		$this->container->singleton( Viewport_Query::class, Viewport_Query::class );

		$this->container->when( Viewport_Query::class )
						->needs( '$table' )
						->give( static fn(): string => Viewport_Hash_Table::table_name( false ) );
	}

	/**
	 * If you update the text repository translations, ensure to match to the
	 * assets/js/optimizer/constant.js file.
	 */
	private function register_translation(): void {
		$this->container->singleton( Text_Repository::class, Text_Repository::class );

		$this->container->when( Text_Repository::class )
						->needs( '$labels' )
						->give(
							static fn(): array => [
								Text_Repository::RUN_OPTIMIZER => __( 'Run Optimizer', 'kadence-blocks' ),
								Text_Repository::REMOVE_OPTIMIZATION => __( 'Remove Optimization', 'kadence-blocks' ),
								Text_Repository::OPTIMIZED => __( 'Optimized', 'kadence-blocks' ),
								Text_Repository::OPTIMIZING => __( 'Optimizing', 'kadence-blocks' ),
								Text_Repository::NOT_OPTIMIZED => __( 'Not Optimized', 'kadence-blocks' ),
								Text_Repository::NOT_OPTIMIZABLE => __( 'Not Optimizable', 'kadence-blocks' ),
								Text_Repository::OPTIMIZATION_OUTDATED => __( 'Optimization Outdated', 'kadence-blocks' ),
								Text_Repository::OPTIMIZATION_OUTDATED_RUN => __( 'Optimization Outdated. Run again?', 'kadence-blocks' ),
							]
						);
	}

	private function register_hash_store(): void {
		$this->container->singleton( Hash_Store::class, Hash_Store::class );
	}

	private function register_nonce(): void {
		$this->container->singleton( Nonce::class, Nonce::class );

		add_filter(
			'nonce_user_logged_out',
			$this->container->callback( Nonce::class, 'customize_nonce_id' ),
			10,
			2
		);
	}

	private function register_request_anonymizer(): void {
		$this->container->singleton( Request_Anonymizer::class, Request_Anonymizer::class );

		add_action(
			'plugins_loaded',
			function () {
				$this->container->get( Request_Anonymizer::class )->force_anonymous_request();
			},
			2
		);
	}

	private function register_store(): void {
		// Grab from Table > Object Cache > Ensure not Expired.
		$this->container->bindDecorators(
			Store::class,
			[
				Expired_Store_Decorator::class,
				Cached_Store_Decorator::class,
				Table_Store::class,
			]
		);
	}

	private function register_analysis_registry(): void {
		$this->container->singleton( Analysis_Registry::class, Analysis_Registry::class );

		$this->container->when( Analysis_Registry::class )
						->needs( '$is_mobile' )
						->give( fn(): bool => $this->is_mobile() );
	}

	private function register_asset_loader(): void {
		$this->container->singleton( Asset_Loader::class, Asset_Loader::class );

		add_action(
			'enqueue_block_editor_assets',
			$this->container->callback( Asset_Loader::class, 'enqueue_block_editor_scripts' ),
			20,
			0
		);

		add_action(
			'admin_enqueue_scripts',
			$this->container->callback( Asset_Loader::class, 'enqueue_post_list_table' )
		);
	}

	private function register_post_list_table(): void {
		$this->container->singleton( Optimizer_Renderer::class, Optimizer_Renderer::class );

		// Register the renderer.
		$this->container->when( Optimizer_Renderer::class )
						->needs( Store::class )
						->give(
							function () {
								$store = $this->container->get( Table_Store::class );

								return new Cached_Store_Decorator( $store );
							}
						);

		// Register the column.
		$this->container->singleton(
			self::OPTIMIZER_COLUMN,
			static fn(): Column  => new Column(
				'kadence_optimizer',
				__( 'Kadence Optimizer', 'kadence-blocks' ),
				Post_Sort_Indexer::KEY
			)
		);

		// Register the column registrar for this column.
		$this->container->singleton(
			self::OPTIMIZER_COLUMN_REGISTRAR,
			function (): Column_Registrar {
				$column        = $this->container->get( self::OPTIMIZER_COLUMN );
				$renderer      = $this->container->get( Optimizer_Renderer::class );
				$sort_strategy = $this->container->get( Meta_Sort_Exists::class );

				return new Column_Registrar( $column, $renderer, $sort_strategy, true );
			}
		);

		// Register the hook manager for all configured columns.
		$this->container
			->when( Column_Hook_Manager::class )
			->needs( '$columns' )
			->give(
				fn(): array => [
					$this->container->get( self::OPTIMIZER_COLUMN_REGISTRAR ),
				]
			);

		$this->container->singleton( Column_Hook_Manager::class, Column_Hook_Manager::class );

		// Add post list table columns.
		add_action(
			'admin_init',
			$this->container->callback( Column_Hook_Manager::class, 'register_hooks' )
		);
	}

	private function register_rest(): void {
		add_action(
			'rest_api_init',
			function (): void {
				$this->container->get( Optimize_Rest_Controller::class )->register_routes();
			}
		);
	}

	private function register_request(): void {
		$this->container->singleton( Request::class, Request::class );
	}

	private function register_element_lazy_loader(): void {
		$this->container->singleton( Lazy_Render_Decider::class, Lazy_Render_Decider::class );
		$this->container->singleton( Element_Lazy_Loader::class, Element_Lazy_Loader::class );

		/**
		 * Filters the list of CSS classes that should be excluded from lazy loading for
		 * section elements.
		 *
		 * @param string[] $excluded_classes An array of CSS class names. If a row has one
		 *                                   of these classes, it will be excluded from lazy loading.
		 */
		$excluded_classes = apply_filters(
			'kadence_blocks_optimizer_section_lazy_load_excluded_classes',
			[
				'kt-jarallax',
			]
		);

		$this->container->when( Lazy_Render_Decider::class )
						->needs( '$excluded_classes' )
						->give( static fn(): array => $excluded_classes );

		// Do not perform element lazy loading on optimizer requests.
		if ( $this->container->get( Request::class )->is_optimizer_request() ) {
			return;
		}

		add_filter(
			'kadence_blocks_row_wrapper_args',
			$this->container->callback( Element_Lazy_Loader::class, 'set_content_visibility_for_row' ),
			10,
			2
		);

		add_filter(
			'kadence_blocks_column_html',
			$this->container->callback( Element_Lazy_Loader::class, 'modify_column_html' ),
			10,
			1
		);
	}

	private function register_slider_lazy_loader(): void {
		$this->container->singleton( Slider_Lazy_Loader::class, Slider_Lazy_Loader::class );

		// Do not perform slider lazy loading on optimizer requests.
		if ( $this->container->get( Request::class )->is_optimizer_request() ) {
			return;
		}

		add_filter(
			'kadence_blocks_row_slider_attrs',
			$this->container->callback( Slider_Lazy_Loader::class, 'lazy_load_row_slider' ),
			10,
			2
		);
	}

	private function register_background_lazy_loader(): void {
		$this->container->singleton( Background_Lazy_Loader::class, Background_Lazy_Loader::class );

		// Do not perform background lazy loading on optimizer requests.
		if ( $this->container->get( Request::class )->is_optimizer_request() ) {
			return;
		}

		add_filter(
			'kadence_blocks_row_wrapper_args',
			$this->container->callback( Background_Lazy_Loader::class, 'lazy_load_row_background_images' ),
			20,
			2
		);
	}

	private function register_hash_handling(): void {
		$this->container->singleton( Hash_Builder::class, Hash_Builder::class );

		/**
		 * Filter the list of query variables, that if present and truthy,
		 * will bypass the hash check.
		 *
		 * @param string[] $query_vars The query variable names.
		 */
		$query_vars = apply_filters(
			'kadence_blocks_optimizer_rule_skip_query_vars',
			[
				'preview',
			]
		);

		$this->container->when( Ignored_Query_Var_Rule::class )
			->needs( '$query_vars' )
			->give(
				static fn(): array => $query_vars
			);

		$this->container->when( Rule_Collection::class )
			->needs( '$rules' )
			->give(
				fn(): array => [
					$this->container->get( Optimizer_Request_Rule::class ),
					$this->container->get( Ignored_Query_Var_Rule::class ),
					$this->container->get( Logged_In_Rule::class ),
				]
			);

		$this->container->singleton( Hash_Handler::class, Hash_Handler::class );

		add_action(
			'template_redirect',
			$this->container->callback( Hash_Handler::class, 'start_buffering' ),
			1,
			0
		);

		// Don't register the shutdown hook when uninstalling.
		if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) && ! wp_installing() ) {
			add_action(
				'shutdown',
				$this->container->callback( Hash_Handler::class, 'check_hash' ),
				PHP_INT_MAX - 1,
				0
			);
		}
	}

	private function register_image_processor(): void {
		$this->container->singleton( Image_Processor::class, Image_Processor::class );

		$this->container->when( Image_Processor::class )
			->needs( '$processors' )
			->give(
				fn(): array => [
					// Add additional image processors here.
					$this->container->get( Lazy_Load_Processor::class ),
					$this->container->get( Sizes_Attribute_Processor::class ),
				]
			);

		add_action(
			'template_redirect',
			$this->container->callback( Image_Processor::class, 'start_buffering' ),
			1,
			0
		);
	}
}
