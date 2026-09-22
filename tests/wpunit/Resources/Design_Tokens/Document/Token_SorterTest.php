<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Document;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Token_Order_Index;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Token_Sorter;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use Tests\Support\Classes\TestCase;

/**
 * Covers the shared stored-order permutation both the admin feed and the editor's pickable-token pool
 * apply, so the two surfaces can never disagree about where a token sits.
 *
 * @since TBD
 */
final class Token_SorterTest extends TestCase {

	/**
	 * The sorter under test.
	 *
	 * @since TBD
	 *
	 * @var Token_Sorter
	 */
	private Token_Sorter $sorter;

	/**
	 * Build a fresh sorter before each test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->sorter = new Token_Sorter( new Token_Order_Index() );
	}

	/**
	 * Permuting rows by a stored order yields the expected id sequence, across the orders a group can
	 * be handed: none, a full one, a partial one, one naming ids the group does not contain, and one
	 * that reverses the group.
	 *
	 * @dataProvider sortProvider
	 *
	 * @param array<int, string> $ids      The row ids in their incoming (declaration) order.
	 * @param array<int, string> $order    The stored flat ordered token id list.
	 * @param array<int, string> $expected The id sequence the permutation must produce.
	 *
	 * @return void
	 */
	public function testSortPermutesRowsByTheStoredOrder( array $ids, array $order, array $expected ): void {
		$sorted = $this->sorter->sort( $this->rows( $ids ), $order );

		$this->assertSame( $expected, array_column( $sorted, 'id' ) );
	}

	/**
	 * A permutation carries every row's other keys through untouched, so sorting a schema row never
	 * costs it the label, type or projection data the surface renders from.
	 *
	 * @return void
	 */
	public function testSortPreservesTheRowPayload(): void {
		$rows = [
			[
				'id'    => 'primitive.dimension.radius.sm',
				'label' => 'Small',
				'type'  => 'dimension',
			],
			[
				'id'    => 'primitive.dimension.radius.lg',
				'label' => 'Large',
				'type'  => 'dimension',
			],
		];

		$sorted = $this->sorter->sort( $rows, [ 'primitive.dimension.radius.lg', 'primitive.dimension.radius.sm' ] );

		$this->assertSame( [ $rows[1], $rows[0] ], $sorted );
	}

	/**
	 * A permutation never reduces the row set: every incoming row survives exactly once, so a stored
	 * order can reorder tokens but never hide or duplicate one.
	 *
	 * @return void
	 */
	public function testSortNeverAddsOrDropsARow(): void {
		$ids = [ 'a.one', 'a.two', 'a.three', 'a.four' ];

		$sorted = $this->sorter->sort( $this->rows( $ids ), [ 'a.four', 'a.stale', 'a.two' ] );

		$actual = array_column( $sorted, 'id' );

		sort( $ids );
		sort( $actual );

		$this->assertSame( $ids, $actual );
	}

	/**
	 * The order read off a document is the flat list stored in the module's $extensions section, and an
	 * empty list for a document carrying none — the same fail-soft read the admin feed gets.
	 *
	 * @return void
	 */
	public function testOrderForReadsTheStoredList(): void {
		$order = [ 'primitive.dimension.radius.lg', 'primitive.dimension.radius.sm' ];

		$document = [
			Extensions::get_extensions_key() => [
				Extensions::get_namespace() => [
					Extensions::get_section_token_order() => $order,
				],
			],
		];

		$this->assertSame( $order, $this->sorter->order_for( $document ) );
		$this->assertSame( [], $this->sorter->order_for( [] ) );
	}

	/**
	 * @return Generator
	 */
	public function sortProvider(): Generator {
		yield 'no stored order leaves declaration order' => [
			'ids'      => [ 'a.one', 'a.two', 'a.three' ],
			'order'    => [],
			'expected' => [ 'a.one', 'a.two', 'a.three' ],
		];

		yield 'a full order sorts every row by position' => [
			'ids'      => [ 'a.one', 'a.two', 'a.three' ],
			'order'    => [ 'a.three', 'a.one', 'a.two' ],
			'expected' => [ 'a.three', 'a.one', 'a.two' ],
		];

		yield 'unlisted ids append in declaration order' => [
			'ids'      => [ 'a.one', 'a.two', 'a.three', 'a.four' ],
			'order'    => [ 'a.three', 'a.one' ],
			'expected' => [ 'a.three', 'a.one', 'a.two', 'a.four' ],
		];

		yield 'ids from another group are ignored' => [
			'ids'      => [ 'a.one', 'a.two' ],
			'order'    => [ 'b.one', 'a.two', 'b.two', 'a.one' ],
			'expected' => [ 'a.two', 'a.one' ],
		];

		yield 'a stale id in the order drops nothing' => [
			'ids'      => [ 'a.one', 'a.two' ],
			'order'    => [ 'a.deleted', 'a.two', 'a.one' ],
			'expected' => [ 'a.two', 'a.one' ],
		];
	}

	/**
	 * Build the minimal rows the sorter reads — it only ever looks at the `id` key.
	 *
	 * @param array<int, string> $ids The row ids, in order.
	 *
	 * @return array<int, array<string, mixed>> The rows.
	 */
	private function rows( array $ids ): array {
		return array_map( static fn( string $id ): array => [ 'id' => $id ], $ids );
	}
}
