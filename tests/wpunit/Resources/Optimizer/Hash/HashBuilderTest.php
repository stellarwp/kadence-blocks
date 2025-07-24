<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Hash;

use KadenceWP\KadenceBlocks\Optimizer\Hash\Hash_Builder;
use Tests\Support\Classes\TestCase;

final class HashBuilderTest extends TestCase {

	private Hash_Builder $hash_builder;

	protected function setUp(): void {
		parent::setUp();

		$this->hash_builder = $this->container->get( Hash_Builder::class );
	}

	public function testItBuildsHashWithStylesheetLinks(): void {
		$html1 = '<html><head><link rel="stylesheet" href="style1.css"></head><body>Content</body></html>';
		$html2 = '<html><head><link rel="stylesheet" href="style2.css"></head><body>Content</body></html>';

		$hash1 = $this->hash_builder->build_hash( $html1 );
		$hash2 = $this->hash_builder->build_hash( $html2 );

		// Should produce different hashes due to different stylesheet links.
		$this->assertNotSame( $hash1, $hash2 );
	}

	public function testItBuildsHashWithPreloadLinks(): void {
		$html1 = '<html><head><link rel="preload" href="font1.woff2" as="font"></head><body>Content</body></html>';
		$html2 = '<html><head><link rel="preload" href="font2.woff2" as="font"></head><body>Content</body></html>';

		$hash1 = $this->hash_builder->build_hash( $html1 );
		$hash2 = $this->hash_builder->build_hash( $html2 );

		// Should produce different hashes due to different preload links.
		$this->assertNotSame( $hash1, $hash2 );
	}

	public function testItBuildsHashWithInlineStyles(): void {
		$html1 = '<html><head><style>body { color: red; }</style></head><body>Content</body></html>';
		$html2 = '<html><head><style>body { color: blue; }</style></head><body>Content</body></html>';

		$hash1 = $this->hash_builder->build_hash( $html1 );
		$hash2 = $this->hash_builder->build_hash( $html2 );

		// Should produce different hashes due to different inline styles.
		$this->assertNotSame( $hash1, $hash2 );
	}

	public function testItBuildsHashWithKadenceBlocks(): void {
		$html1 = '<html><body><!-- wp:kadence/advancedheading {"level":1} --><h1>Title</h1><!-- /wp:kadence/advancedheading --></body></html>';
		$html2 = '<html><body><!-- wp:kadence/advancedbtn {"text":"Button"} --><a href="#">Button</a><!-- /wp:kadence/advancedbtn --></body></html>';

		$hash1 = $this->hash_builder->build_hash( $html1 );
		$hash2 = $this->hash_builder->build_hash( $html2 );

		// Should produce different hashes due to different block types.
		$this->assertNotSame( $hash1, $hash2 );
	}

	public function testItBuildsHashWithCoreBlocks(): void {
		$html1 = '<html><body><!-- wp:paragraph --><p>Content</p><!-- /wp:paragraph --></body></html>';
		$html2 = '<html><body><!-- wp:heading {"level":1} --><h1>Title</h1><!-- /wp:heading --></body></html>';

		$hash1 = $this->hash_builder->build_hash( $html1 );
		$hash2 = $this->hash_builder->build_hash( $html2 );

		// Should produce different hashes due to different block types.
		$this->assertNotSame( $hash1, $hash2 );
	}

	public function testItBuildsHashWithMixedBlocks(): void {
		$html1 = '<html><body><!-- wp:paragraph --><p>Content</p><!-- /wp:paragraph --><!-- wp:kadence/advancedheading {"level":1} --><h1>Title</h1><!-- /wp:kadence/advancedheading --></body></html>';
		$html2 = '<html><body><!-- wp:heading {"level":1} --><h1>Title</h1><!-- /wp:heading --><!-- wp:kadence/advancedbtn {"text":"Button"} --><a href="#">Button</a><!-- /wp:kadence/advancedbtn --></body></html>';

		$hash1 = $this->hash_builder->build_hash( $html1 );
		$hash2 = $this->hash_builder->build_hash( $html2 );

		// Should produce different hashes due to different block combinations.
		$this->assertNotSame( $hash1, $hash2 );
	}

	public function testItBuildsHashWithStructuralElements(): void {
		$html1 = '<html><body><div>Content</div><section>Section</section></body></html>';
		$html2 = '<html><body><article>Article</article><header>Header</header></body></html>';

		$hash1 = $this->hash_builder->build_hash( $html1 );
		$hash2 = $this->hash_builder->build_hash( $html2 );

		// Should produce different hashes due to different structural elements.
		$this->assertNotSame( $hash1, $hash2 );
	}

	public function testItBuildsHashWithElementCounts(): void {
		$html1 = '<html><body><div>Content</div></body></html>';
		$html2 = '<html><body><div>Content</div><div>More content</div></body></html>';

		$hash1 = $this->hash_builder->build_hash( $html1 );
		$hash2 = $this->hash_builder->build_hash( $html2 );

		// Should produce different hashes due to different element counts.
		$this->assertNotSame( $hash1, $hash2 );
	}

	public function testItBuildsHashWithComplexStructure(): void {
		$html = '<html><head><link rel="stylesheet" href="style.css"><style>body { margin: 0; }</style></head><body><!-- wp:paragraph --><p>Content</p><!-- /wp:paragraph --><!-- wp:kadence/advancedheading {"level":1} --><h1>Title</h1><!-- /wp:kadence/advancedheading --><div>Wrapper</div><section>Section</section></body></html>';

		$hash = $this->hash_builder->build_hash( $html );

		$this->assertIsString( $hash );
		$this->assertNotEmpty( $hash );
	}

	public function testItBuildsHashConsistency(): void {
		$html = '<html><head><link rel="stylesheet" href="style.css"><style>body { color: red; }</style></head><body><!-- wp:paragraph --><p>Content</p><!-- /wp:paragraph --><div>Wrapper</div></body></html>';

		$hash1 = $this->hash_builder->build_hash( $html );
		$hash2 = $this->hash_builder->build_hash( $html );

		// Same input should produce the same hash.
		$this->assertSame( $hash1, $hash2 );
	}

	public function testItBuildsHashWithNoBlocks(): void {
		$html = '<html><body><div>Content</div><p>Text</p></body></html>';

		$hash = $this->hash_builder->build_hash( $html );

		$this->assertIsString( $hash );
		$this->assertNotEmpty( $hash );
	}

	public function testItBuildsHashWithNoStylesheets(): void {
		$html = '<html><body><!-- wp:paragraph --><p>Content</p><!-- /wp:paragraph --></body></html>';

		$hash = $this->hash_builder->build_hash( $html );

		$this->assertIsString( $hash );
		$this->assertNotEmpty( $hash );
	}

	public function testItBuildsHashWithEmptyHtml(): void {
		$html = '';

		$hash = $this->hash_builder->build_hash( $html );

		$this->assertIsString( $hash );
		$this->assertNotEmpty( $hash );
	}

	public function testItBuildsHashWithNonHtmlContent(): void {
		$html = 'This is not HTML content';

		$hash = $this->hash_builder->build_hash( $html );

		$this->assertIsString( $hash );
		$this->assertNotEmpty( $hash );
	}

	public function testItBuildsHashWithMalformedHtml(): void {
		$html = '<html><body><div>Content<div><p>Unclosed tag</body>';

		$hash = $this->hash_builder->build_hash( $html );

		$this->assertIsString( $hash );
		$this->assertNotEmpty( $hash );
	}

	public function testItBuildsHashWithMultipleStylesheets(): void {
		$html = '<html><head><link rel="stylesheet" href="style1.css"><link rel="stylesheet" href="style2.css"><link rel="preload" href="font.woff2" as="font"></head><body>Content</body></html>';

		$hash = $this->hash_builder->build_hash( $html );

		$this->assertIsString( $hash );
		$this->assertNotEmpty( $hash );
	}

	public function testItBuildsHashWithMultipleInlineStyles(): void {
		$html = '<html><head><style>body { color: red; }</style><style>div { margin: 10px; }</style></head><body>Content</body></html>';

		$hash = $this->hash_builder->build_hash( $html );

		$this->assertIsString( $hash );
		$this->assertNotEmpty( $hash );
	}

	public function testItBuildsHashWithMultipleBlocks(): void {
		$html = '<html><body><!-- wp:paragraph --><p>First paragraph</p><!-- /wp:paragraph --><!-- wp:paragraph --><p>Second paragraph</p><!-- /wp:paragraph --><!-- wp:kadence/advancedheading {"level":2} --><h2>Subtitle</h2><!-- /wp:kadence/advancedheading --></body></html>';

		$hash = $this->hash_builder->build_hash( $html );

		$this->assertIsString( $hash );
		$this->assertNotEmpty( $hash );
	}

	public function testItBuildsHashWithBlockAttributes(): void {
		$html1 = '<html><body><!-- wp:kadence/advancedheading {"level":1} --><h1>Title</h1><!-- /wp:kadence/advancedheading --></body></html>';
		$html2 = '<html><body><!-- wp:kadence/advancedheading {"level":2} --><h2>Title</h2><!-- /wp:kadence/advancedheading --></body></html>';

		$hash1 = $this->hash_builder->build_hash( $html1 );
		$hash2 = $this->hash_builder->build_hash( $html2 );

		// Should produce different hashes due to different block attributes.
		$this->assertNotSame( $hash1, $hash2 );
	}
}
