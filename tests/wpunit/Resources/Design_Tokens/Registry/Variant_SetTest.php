<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Registry;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Variant_Set;
use Tests\Support\Classes\TestCase;

final class Variant_SetTest extends TestCase {

	public function testItRetainsBlockAndVariants(): void {
		$set = Variant_Set::from_array(
			[
				'block'    => 'kadence/advancedbtn',
				'variants' => [ 'primary', 'secondary', 'ghost' ],
			]
		);

		$this->assertSame( 'kadence/advancedbtn', $set->block );
		$this->assertSame( [ 'primary', 'secondary', 'ghost' ], $set->variants );
	}

	public function testItDefaultsVariantsToAnEmptyList(): void {
		$set = Variant_Set::from_array( [ 'block' => 'kadence/advancedbtn' ] );

		$this->assertSame( [], $set->variants );
	}

	public function testItNormalizesVariantsToAList(): void {
		$set = Variant_Set::from_array(
			[
				'block'    => 'kadence/advancedbtn',
				'variants' => [ 2 => 'primary', 5 => 'secondary' ],
			]
		);

		$this->assertSame( [ 'primary', 'secondary' ], $set->variants );
	}

	public function testItThrowsWhenBlockIsMissing(): void {
		$this->expectException( InvalidArgumentException::class );

		Variant_Set::from_array( [ 'variants' => [ 'primary' ] ] );
	}
}
