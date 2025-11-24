<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Image;

use KadenceWP\KadenceBlocks\Optimizer\Image\Processors\Lazy_Load_Processor;
use KadenceWP\KadenceBlocks\Optimizer\Image\Processors\Sizes_Attribute_Processor;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

final class Provider extends Provider_Contract {

	public function register(): void {
		$this->container->singleton( Lazy_Load_Processor::class, Lazy_Load_Processor::class );
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
