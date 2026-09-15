<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Projection;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Media_Queries;
use Tests\Support\Classes\TestCase;

final class Media_QueriesTest extends TestCase {

	/**
	 * The breakpoint map reads the same filterable KB media queries every projector used to build on its
	 * own, keyed by the resolver's breakpoint keys.
	 *
	 * @return void
	 */
	public function testItReturnsTheFilteredKadenceBreakpoints(): void {
		$this->assertSame(
			[
				'tablet' => '(max-width: 1024px)',
				'mobile' => '(max-width: 767px)',
			],
			Media_Queries::all()
		);

		add_filter( 'kadence_tablet_media_query', static fn(): string => '(max-width: 900px)' );

		$this->assertSame( '(max-width: 900px)', Media_Queries::all()['tablet'] );

		remove_all_filters( 'kadence_tablet_media_query' );
	}
}
