<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Post_List_Table;

use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Renderers\Optimizer_Renderer;
use KadenceWP\KadenceBlocks\Optimizer\Status\Meta;
use KadenceWP\KadenceBlocks\Optimizer\Store\Cached_Store_Decorator;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Optimizer\Store\Table_Store;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

final class Provider extends Provider_Contract {

	public const OPTIMIZER_COLUMN           = 'kadence_blocks.optimizer.optimizer_column';
	public const OPTIMIZER_COLUMN_REGISTRAR = 'kadence_blocks.optimizer.optimizer_column_registrar';

	public function register(): void {
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
				Meta::KEY
			)
		);

		// Register the column registrar for this column.
		$this->container->singleton(
			self::OPTIMIZER_COLUMN_REGISTRAR,
			function (): Column_Registrar {
				$column   = $this->container->get( self::OPTIMIZER_COLUMN );
				$renderer = $this->container->get( Optimizer_Renderer::class );

				return new Column_Registrar( $column, $renderer );
			}
		);

		// Register the hook manager for all configured columns.
		$this->container->singleton( Column_Hook_Manager::class, Column_Hook_Manager::class );

		$this->container
			->when( Column_Hook_Manager::class )
			->needs( '$columns' )
			->give(
				fn(): array => [
					$this->container->get( self::OPTIMIZER_COLUMN_REGISTRAR ),
				]
			);

		// Add post list table columns.
		add_action(
			'admin_init',
			$this->container->callback( Column_Hook_Manager::class, 'register_hooks' )
		);

		// Bulk action dropdown for bulk optimization/remove optimization functionality.
		$this->container->singleton( Bulk_Action_Manager::class, Bulk_Action_Manager::class );

		add_filter(
			'bulk_actions-edit-post',
			$this->container->callback( Bulk_Action_Manager::class, 'register_actions' )
		);

		add_filter(
			'bulk_actions-edit-page',
			$this->container->callback( Bulk_Action_Manager::class, 'register_actions' )
		);

		$this->container->singleton( Filter::class, Filter::class );

		add_action(
			'restrict_manage_posts',
			$this->container->callback( Filter::class, 'render_filter' )
		);

		add_action(
			'pre_get_posts',
			$this->container->callback( Filter::class, 'filter_posts' )
		);

		$this->register_row_actions();
	}

	private function register_row_actions(): void {
		$this->container->singleton( Row_Action::class, Row_Action::class );

		add_filter(
			'post_row_actions',
			$this->container->callback( Row_Action::class, 'add_view_optimized_link' ),
			10,
			2
		);

		add_filter(
			'page_row_actions',
			$this->container->callback( Row_Action::class, 'add_view_optimized_link' ),
			10,
			2
		);
	}
}
