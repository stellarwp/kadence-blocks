<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer;

use KadenceWP\KadenceBlocks\Optimizer\Hash\Hash_Handler;
use KadenceWP\KadenceBlocks\Optimizer\Hash\Rule\Rule_Collection;
use KadenceWP\KadenceBlocks\Optimizer\Hash\Rule\Rules\Ignored_Query_Var_Rule;
use KadenceWP\KadenceBlocks\Optimizer\Hash\Rule\Rules\Logged_In_Rule;
use KadenceWP\KadenceBlocks\Optimizer\Hash\Rule\Rules\Optimizer_Request_Rule;
use KadenceWP\KadenceBlocks\Optimizer\Lazy_Load\Background_Lazy_Loader;
use KadenceWP\KadenceBlocks\Optimizer\Lazy_Load\Element_Lazy_Loader;
use KadenceWP\KadenceBlocks\Optimizer\Nonce\Nonce;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Column;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Column_Hook_Manager;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Column_Registrar;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Renderers\Optimizer_Renderer;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Sorters\Meta_Sort_Exists;
use KadenceWP\KadenceBlocks\Optimizer\Rest\Optimize_Rest_Controller;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Optimizer\Store\Expired_Meta_Store_Decorator;
use KadenceWP\KadenceBlocks\Optimizer\Store\Meta_Store;
use KadenceWP\KadenceBlocks\Optimizer\Translation\Text_Repository;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider;

final class Optimizer_Provider extends Provider {

	public const OPTIMIZER_COLUMN = 'kadence_blocks.optimizer.optimizer_column';

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

		$this->register_translation();
		$this->register_nonce();
		$this->register_request_anonymizer();
		$this->register_store();
		$this->register_asset_loader();
		$this->register_post_list_table();
		$this->register_rest();
		$this->register_request();
		$this->register_element_lazy_loader();
		$this->register_background_lazy_loader();
		$this->register_hash_handling();
	}

	private function register_translation(): void {
		$this->container->singleton( Text_Repository::class, Text_Repository::class );

		$this->container->when( Text_Repository::class )
						->needs( '$labels' )
						->give(
							static fn(): array => [
								Text_Repository::RUN_OPTIMIZER => __( 'Run Optimizer', 'kadence-blocks' ),
								Text_Repository::REMOVE_OPTIMIZATION => __( 'Remove Optimization', 'kadence-blocks' ),
								Text_Repository::OPTIMIZED => __( 'Optimized', 'kadence-blocks' ),
								Text_Repository::NOT_OPTIMIZED => __( 'Not Optimized', 'kadence-blocks' ),
								Text_Repository::NOT_OPTIMIZABLE => __( 'Not Optimizable', 'kadence-blocks' ),
								Text_Repository::OPTIMIZATION_OUTDATED => __( 'Optimization Outdated', 'kadence-blocks' ),
								Text_Repository::OPTIMIZATION_OUTDATED_RUN => __( 'Optimization Outdated. Run again?', 'kadence-blocks' ),
							]
						);
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
		$this->container->bindDecorators(
			Store::class,
			[
				Expired_Meta_Store_Decorator::class,
				Meta_Store::class,
			]
		);
	}

	private function register_asset_loader(): void {
		add_action(
			'admin_print_styles-edit.php',
			$this->container->callback( Asset_Loader::class, 'enqueue' )
		);

		add_action(
			'enqueue_block_editor_assets',
			$this->container->callback( Asset_Loader::class, 'enqueue' ),
			20
		);
	}

	private function register_post_list_table(): void {
		$this->container->singleton(
			self::OPTIMIZER_COLUMN,
			function (): Column_Registrar {
				$column = new Column(
					'kadence_optimizer',
					__( 'Kadence Optimizer', 'kadence-blocks' ),
					Meta_Store::KEY
				);

				$sort_strategy = $this->container->get( Meta_Sort_Exists::class );
				$renderer      = $this->container->get( Optimizer_Renderer::class );

				return new Column_Registrar( $column, $sort_strategy, $renderer );
			}
		);

		$this->container
			->when( Column_Hook_Manager::class )
			->needs( '$columns' )
			->give(
				fn(): array => [
					$this->container->get( self::OPTIMIZER_COLUMN ),
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
		$this->container->singleton( Element_Lazy_Loader::class, Element_Lazy_Loader::class );

		// Do not perform element lazy loading on optimizer requests.
		if ( $this->container->get( Request::class )->is_optimizer_request() ) {
			return;
		}

		add_filter(
			'kadence_blocks_row_wrapper_args',
			$this->container->callback( Element_Lazy_Loader::class, 'modify_row_layout_block_wrapper_args' ),
			10,
			2
		);
	}


	private function register_background_lazy_loader(): void {
		$this->container->singleton( Background_Lazy_Loader::class, Background_Lazy_Loader::class );

		// Do not perform element lazy loading on optimizer requests.
		if ( $this->container->get( Request::class )->is_optimizer_request() ) {
			return;
		}

		add_filter(
			'kadence_blocks_row_wrapper_args',
			$this->container->callback( Background_Lazy_Loader::class, 'modify_row_layout_block_wrapper_args' ),
			20,
			2
		);
	}

	private function register_hash_handling(): void {
		/**
		 * Filter the list of query variables, that if present and truthy,
		 * will bypass the hash check.
		 *
		 * @param string[] $query_vars The query variable names.
		 */
		$query_vars = apply_filters(
			'kadence_blocks_optimizer_skip_has_check_query_vars',
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

		add_action(
			'shutdown',
			$this->container->callback( Hash_Handler::class, 'check_hash' ),
			PHP_INT_MAX - 1,
			0
		);
	}
}
