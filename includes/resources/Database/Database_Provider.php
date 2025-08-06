<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Database;

use KadenceWP\KadenceBlocks\Optimizer\Database\Optimizer_Table;
use KadenceWP\KadenceBlocks\Optimizer\Database\Viewport_Hash_Table;
use KadenceWP\KadenceBlocks\Psr\Log\LoggerInterface;
use KadenceWP\KadenceBlocks\StellarWP\DB\Database\Exceptions\DatabaseQueryException;
use KadenceWP\KadenceBlocks\StellarWP\DB\DB;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider;
use KadenceWP\KadenceBlocks\StellarWP\Schema\Config;
use KadenceWP\KadenceBlocks\StellarWP\Schema\Register;

final class Database_Provider extends Provider {

	public const SCHEMA_TABLES = 'kadence_blocks.database.schema_tables';

	/**
	 * Configure the stellarwp/schema library.
	 *
	 * @throws DatabaseQueryException If we failed to create or update the database tables.
	 *
	 * @return void
	 */
	public function register(): void {
		Config::set_container( $this->container );
		Config::set_db( DB::class );

		// Add all schema tables to be registered here.
		$this->container->setVar(
			self::SCHEMA_TABLES,
			[
				Viewport_Hash_Table::class,
				Optimizer_Table::class,
			]
		);

		try {
			Register::tables( $this->container->getVar( self::SCHEMA_TABLES ) );
		} catch ( DatabaseQueryException $e ) {
			$this->container->get( LoggerInterface::class )->emergency(
				'Unable to create or update database tables',
				[
					'query_errors' => $e->getQueryErrors(),
					'query'        => $e->getQuery(),
					'exception'    => $e,
				]
			);

			throw $e;
		}
	}
}
