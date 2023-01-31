<?php
/**
 * @license GPL-2.0-or-later
 *
 * Modified by kadencewp on 30-January-2023 using Strauss.
 * @see https://github.com/BrianHenryIE/strauss
 */

namespace KadenceWP\KadenceBlocks\StellarWP\ContainerContract;

/**
 * Describes the interface of a container that exposes methods to read its entries.
 */
interface ContainerInterface {
	/**
	 * Binds an interface, a class or a string slug to an implementation.
	 *
	 * Existing implementations are replaced.
	 *
	 * @param string $id             Identifier of the entry to look for.
	 * @param mixed  $implementation The implementation that should be bound to the alias(es); can be a
	 *                               class name, an object or a closure.
	 *
	 * @return mixed Entry.
	 */
	public function bind( string $id, $implementation = null );

	/**
	 * Finds an entry of the container by its identifier and returns it.
	 *
	 * @param string $id Identifier of the entry to look for.
	 *
	 * @return mixed Entry.
	 */
	public function get( string $id );

	/**
	 * Returns true if the container can return an entry for the given identifier.
	 * Returns false otherwise.
	 *
	 * `has($id)` returning true does not mean that `get($id)` will not throw an exception.
	 * It does however mean that `get($id)` will not throw a `NotFoundExceptionInterface`.
	 *
	 * @param string $id Identifier of the entry to look for.
	 *
	 * @return bool
	 */
	public function has( string $id );

	/**
	 * Binds an interface a class or a string slug to an implementation and will always return the same instance.
	 *
	 * @param string $id             Identifier of the entry to look for.
	 * @param mixed  $implementation The implementation that should be bound to the alias(es); can be a
	 *                               class name, an object or a closure.
	 *
	 * @return void This method does not return any value.
	 */
	public function singleton( string $id, $implementation = null );
}
