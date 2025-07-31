<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Lazy_Load;

use KadenceWP\KadenceBlocks\Optimizer\Lazy_Load\Block_Finder;
use Tests\Support\Classes\TestCase;
use WP_Block;

final class BlockFinderTest extends TestCase {

	private Block_Finder $block_finder;

	protected function setUp(): void {
		parent::setUp();

		$this->block_finder = $this->container->get( Block_Finder::class );
	}

	public function testContainsBlockReturnsFalseWhenNoInnerBlocks(): void {
		$block = new WP_Block(
			[
				'blockName'    => 'core/group',
				'attrs'        => [],
				'innerBlocks'  => [],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$result = $this->block_finder->contains_block( $block, 'core/paragraph' );

		$this->assertFalse( $result );
	}

	public function testContainsBlockReturnsTrueWhenDirectMatch(): void {
		$inner_block = new WP_Block(
			[
				'blockName'    => 'core/paragraph',
				'attrs'        => [],
				'innerBlocks'  => [],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$block = new WP_Block(
			[
				'blockName'    => 'core/group',
				'attrs'        => [],
				'innerBlocks'  => [ $inner_block ],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$result = $this->block_finder->contains_block( $block, 'core/paragraph' );

		$this->assertTrue( $result );
	}

	public function testContainsBlockReturnsFalseWhenNoMatch(): void {
		$inner_block = new WP_Block(
			[
				'blockName'    => 'core/heading',
				'attrs'        => [],
				'innerBlocks'  => [],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$block = new WP_Block(
			[
				'blockName'    => 'core/group',
				'attrs'        => [],
				'innerBlocks'  => [ $inner_block ],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$result = $this->block_finder->contains_block( $block, 'core/paragraph' );

		$this->assertFalse( $result );
	}

	public function testContainsBlockReturnsTrueWhenNestedMatch(): void {
		$nested_inner_block = new WP_Block(
			[
				'blockName'    => 'core/paragraph',
				'attrs'        => [],
				'innerBlocks'  => [],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$inner_block = new WP_Block(
			[
				'blockName'    => 'core/group',
				'attrs'        => [],
				'innerBlocks'  => [ $nested_inner_block ],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$block = new WP_Block(
			[
				'blockName'    => 'core/columns',
				'attrs'        => [],
				'innerBlocks'  => [ $inner_block ],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$result = $this->block_finder->contains_block( $block, 'core/paragraph' );

		$this->assertTrue( $result );
	}

	public function testContainsBlockReturnsTrueWhenDeepNestedMatch(): void {
		$deep_nested_block = new WP_Block(
			[
				'blockName'    => 'core/paragraph',
				'attrs'        => [],
				'innerBlocks'  => [],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$nested_inner_block = new WP_Block(
			[
				'blockName'    => 'core/column',
				'attrs'        => [],
				'innerBlocks'  => [ $deep_nested_block ],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$inner_block = new WP_Block(
			[
				'blockName'    => 'core/columns',
				'attrs'        => [],
				'innerBlocks'  => [ $nested_inner_block ],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$block = new WP_Block(
			[
				'blockName'    => 'core/group',
				'attrs'        => [],
				'innerBlocks'  => [ $inner_block ],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$result = $this->block_finder->contains_block( $block, 'core/paragraph' );

		$this->assertTrue( $result );
	}

	public function testContainsBlockReturnsFalseWhenDeepNestedNoMatch(): void {
		$deep_nested_block = new WP_Block(
			[
				'blockName'    => 'core/heading',
				'attrs'        => [],
				'innerBlocks'  => [],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$nested_inner_block = new WP_Block(
			[
				'blockName'    => 'core/column',
				'attrs'        => [],
				'innerBlocks'  => [ $deep_nested_block ],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$inner_block = new WP_Block(
			[
				'blockName'    => 'core/columns',
				'attrs'        => [],
				'innerBlocks'  => [ $nested_inner_block ],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$block = new WP_Block(
			[
				'blockName'    => 'core/group',
				'attrs'        => [],
				'innerBlocks'  => [ $inner_block ],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$result = $this->block_finder->contains_block( $block, 'core/paragraph' );

		$this->assertFalse( $result );
	}

	public function testContainsBlockReturnsTrueWhenMultipleMatches(): void {
		$first_inner_block = new WP_Block(
			[
				'blockName'    => 'core/heading',
				'attrs'        => [],
				'innerBlocks'  => [],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$second_inner_block = new WP_Block(
			[
				'blockName'    => 'core/paragraph',
				'attrs'        => [],
				'innerBlocks'  => [],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$block = new WP_Block(
			[
				'blockName'    => 'core/group',
				'attrs'        => [],
				'innerBlocks'  => [ $first_inner_block, $second_inner_block ],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$result = $this->block_finder->contains_block( $block, 'core/paragraph' );

		$this->assertTrue( $result );
	}

	public function testContainsBlockReturnsTrueWhenMatchInFirstBlock(): void {
		$first_inner_block = new WP_Block(
			[
				'blockName'    => 'core/paragraph',
				'attrs'        => [],
				'innerBlocks'  => [],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$second_inner_block = new WP_Block(
			[
				'blockName'    => 'core/heading',
				'attrs'        => [],
				'innerBlocks'  => [],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$block = new WP_Block(
			[
				'blockName'    => 'core/group',
				'attrs'        => [],
				'innerBlocks'  => [ $first_inner_block, $second_inner_block ],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$result = $this->block_finder->contains_block( $block, 'core/paragraph' );

		$this->assertTrue( $result );
	}

	public function testContainsBlockHandlesEmptyBlockName(): void {
		$inner_block = new WP_Block(
			[
				'blockName'    => '',
				'attrs'        => [],
				'innerBlocks'  => [],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$block = new WP_Block(
			[
				'blockName'    => 'core/group',
				'attrs'        => [],
				'innerBlocks'  => [ $inner_block ],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$result = $this->block_finder->contains_block( $block, '' );

		$this->assertTrue( $result );
	}

	public function testContainsBlockHandlesComplexNestedStructure(): void {
		// Create a complex nested structure with multiple levels
		$deepest_block = new WP_Block(
			[
				'blockName'    => 'core/paragraph',
				'attrs'        => [],
				'innerBlocks'  => [],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$level_3_block = new WP_Block(
			[
				'blockName'    => 'core/group',
				'attrs'        => [],
				'innerBlocks'  => [ $deepest_block ],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$level_2_block = new WP_Block(
			[
				'blockName'    => 'core/column',
				'attrs'        => [],
				'innerBlocks'  => [ $level_3_block ],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$level_1_block = new WP_Block(
			[
				'blockName'    => 'core/columns',
				'attrs'        => [],
				'innerBlocks'  => [ $level_2_block ],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$block = new WP_Block(
			[
				'blockName'    => 'core/group',
				'attrs'        => [],
				'innerBlocks'  => [ $level_1_block ],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$result = $this->block_finder->contains_block( $block, 'core/paragraph' );

		$this->assertTrue( $result );
	}

	public function testContainsBlockReturnsFalseForComplexStructureWithNoMatch(): void {
		// Create a complex nested structure without the target block
		$deepest_block = new WP_Block(
			[
				'blockName'    => 'core/heading',
				'attrs'        => [],
				'innerBlocks'  => [],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$level_3_block = new WP_Block(
			[
				'blockName'    => 'core/group',
				'attrs'        => [],
				'innerBlocks'  => [ $deepest_block ],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$level_2_block = new WP_Block(
			[
				'blockName'    => 'core/column',
				'attrs'        => [],
				'innerBlocks'  => [ $level_3_block ],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$level_1_block = new WP_Block(
			[
				'blockName'    => 'core/columns',
				'attrs'        => [],
				'innerBlocks'  => [ $level_2_block ],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$block = new WP_Block(
			[
				'blockName'    => 'core/group',
				'attrs'        => [],
				'innerBlocks'  => [ $level_1_block ],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$result = $this->block_finder->contains_block( $block, 'core/paragraph' );

		$this->assertFalse( $result );
	}

	public function testContainsBlockHandlesMixedBlockTypes(): void {
		// Test with a mix of different block types
		$paragraph_block = new WP_Block(
			[
				'blockName'    => 'core/paragraph',
				'attrs'        => [],
				'innerBlocks'  => [],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$heading_block = new WP_Block(
			[
				'blockName'    => 'core/heading',
				'attrs'        => [],
				'innerBlocks'  => [],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$image_block = new WP_Block(
			[
				'blockName'    => 'core/image',
				'attrs'        => [],
				'innerBlocks'  => [],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$group_block = new WP_Block(
			[
				'blockName'    => 'core/group',
				'attrs'        => [],
				'innerBlocks'  => [ $paragraph_block, $heading_block ],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		$block = new WP_Block(
			[
				'blockName'    => 'core/columns',
				'attrs'        => [],
				'innerBlocks'  => [ $group_block, $image_block ],
				'innerHTML'    => '',
				'innerContent' => [],
			]
		);

		// Test finding paragraph block
		$result = $this->block_finder->contains_block( $block, 'core/paragraph' );
		$this->assertTrue( $result );

		// Test finding heading block
		$result = $this->block_finder->contains_block( $block, 'core/heading' );
		$this->assertTrue( $result );

		// Test finding image block
		$result = $this->block_finder->contains_block( $block, 'core/image' );
		$this->assertTrue( $result );

		// Test finding non-existent block
		$result = $this->block_finder->contains_block( $block, 'core/button' );
		$this->assertFalse( $result );
	}
}
