<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Lazy_Load;

use KadenceWP\KadenceBlocks\Optimizer\Analysis_Registry;
use KadenceWP\KadenceBlocks\Optimizer\Lazy_Load\Sections\Lazy_Render_Decider;
use KadenceWP\KadenceBlocks\Optimizer\Request\Request;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;
use KadenceWP\KadenceBlocks\Traits\Viewport_Trait;

final class Provider extends Provider_Contract {

	use Viewport_Trait;

	public function register(): void {
		$this->register_analysis_registry();
		$this->register_element_lazy_loader();
		$this->register_slider_lazy_loader();
		$this->register_video_poster_lazy_loader();
		$this->register_background_lazy_loader();
	}

	private function register_analysis_registry(): void {
		$this->container->singleton( Analysis_Registry::class, Analysis_Registry::class );

		$this->container->when( Analysis_Registry::class )
						->needs( '$is_mobile' )
						->give( fn(): bool => $this->is_mobile() );
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

	private function register_video_poster_lazy_loader(): void {
		$this->container->singleton( Video_Poster_Lazy_Loader::class, Video_Poster_Lazy_Loader::class );

		// Do not perform slider lazy loading on optimizer requests.
		if ( $this->container->get( Request::class )->is_optimizer_request() ) {
			return;
		}

		add_filter(
			'kadence_blocks_row_video_attrs',
			$this->container->callback( Video_Poster_Lazy_Loader::class, 'lazy_load_row_video_poster' ),
			10,
			1
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

		add_filter(
			'kadence_blocks_column_html',
			$this->container->callback( Background_Lazy_Loader::class, 'lazy_load_column_backgrounds' ),
			20,
			2
		);
	}
}
