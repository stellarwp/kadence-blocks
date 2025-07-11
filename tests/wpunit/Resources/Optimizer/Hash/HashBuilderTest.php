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
		$html = '<html><head><link rel="stylesheet" href="style.css"><link rel="preload" href="font.woff2" as="font"></head><body>Content</body></html>';

		$hash = $this->hash_builder->build_hash( $html );

		$this->assertIsString( $hash );
		$this->assertNotEmpty( $hash );
	}

	public function testItBuildsHashWithInlineStyles(): void {
		$html = '<html><head><style>body { color: red; }</style></head><body>Content</body></html>';

		$hash = $this->hash_builder->build_hash( $html );

		$this->assertIsString( $hash );
		$this->assertNotEmpty( $hash );
	}

	public function testItBuildsHashWithBodyContent(): void {
		$html = '<html><body><div>Test content</div><p>Another paragraph</p></body></html>';

		$hash = $this->hash_builder->build_hash( $html );

		$this->assertIsString( $hash );
		$this->assertNotEmpty( $hash );
	}

	public function testItBuildsHashWithScriptsInBody(): void {
		$html = '<html><body><div>Content</div><script>console.log("test");</script><p>More content</p></body></html>';

		$hash = $this->hash_builder->build_hash( $html );

		$this->assertIsString( $hash );
		$this->assertNotEmpty( $hash );
	}

	public function testItBuildsHashWithComplexHtml(): void {
		$html = '<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"><style>body { margin: 0; }</style></head><body><header><h1>Title</h1></header><main><div>Content</div><script>var x = 1;</script><p>Text</p></main></body></html>';

		$hash = $this->hash_builder->build_hash( $html );

		$this->assertIsString( $hash );
		$this->assertNotEmpty( $hash );
	}

	public function testItBuildsHashWithNoBodyTag(): void {
		$html = '<html><head><link rel="stylesheet" href="style.css"></head><div>Content</div></html>';

		$hash = $this->hash_builder->build_hash( $html );

		$this->assertIsString( $hash );
		$this->assertNotEmpty( $hash );
	}

	public function testItBuildsHashWithEmptyBody(): void {
		$html = '<html><body></body></html>';

		$hash = $this->hash_builder->build_hash( $html );

		$this->assertIsString( $hash );
		$this->assertNotEmpty( $hash );
	}

	public function testItBuildsHashWithWhitespaceNormalization(): void {
		$html1 = '<html><body><div>Test content</div></body></html>';
		$html2 = '<html><body><div>Test    content</div></body></html>';

		$hash1 = $this->hash_builder->build_hash( $html1 );
		$hash2 = $this->hash_builder->build_hash( $html2 );

		// Should produce the same hash due to whitespace normalization.
		$this->assertSame( $hash1, $hash2 );
	}

	public function testItBuildsHashWithDifferentScriptContent(): void {
		$html1 = '<html><body><div>Content</div><script>var x = 1;</script></body></html>';
		$html2 = '<html><body><div>Content</div><script>var y = 2;</script></body></html>';

		$hash1 = $this->hash_builder->build_hash( $html1 );
		$hash2 = $this->hash_builder->build_hash( $html2 );

		// Should produce the same hash since scripts are stripped from body content.
		$this->assertSame( $hash1, $hash2 );
	}

	public function testItBuildsHashWithDifferentStylesheetLinks(): void {
		$html1 = '<html><head><link rel="stylesheet" href="style1.css"></head><body>Content</body></html>';
		$html2 = '<html><head><link rel="stylesheet" href="style2.css"></head><body>Content</body></html>';

		$hash1 = $this->hash_builder->build_hash( $html1 );
		$hash2 = $this->hash_builder->build_hash( $html2 );

		// Should produce different hashes due to different stylesheet links.
		$this->assertNotSame( $hash1, $hash2 );
	}

	public function testItBuildsHashWithDifferentInlineStyles(): void {
		$html1 = '<html><head><style>body { color: red; }</style></head><body>Content</body></html>';
		$html2 = '<html><head><style>body { color: blue; }</style></head><body>Content</body></html>';

		$hash1 = $this->hash_builder->build_hash( $html1 );
		$hash2 = $this->hash_builder->build_hash( $html2 );

		// Should produce different hashes due to different inline styles.
		$this->assertNotSame( $hash1, $hash2 );
	}

	public function testItBuildsHashWithDifferentBodyContent(): void {
		$html1 = '<html><body><div>Content 1</div></body></html>';
		$html2 = '<html><body><div>Content 2</div></body></html>';

		$hash1 = $this->hash_builder->build_hash( $html1 );
		$hash2 = $this->hash_builder->build_hash( $html2 );

		// Should produce different hashes due to different body content.
		$this->assertNotSame( $hash1, $hash2 );
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

	public function testItBuildsHashWithSpecialCharacters(): void {
		$html = '<html><body><div>Content with &amp; entities and "quotes"</div></body></html>';

		$hash = $this->hash_builder->build_hash( $html );

		$this->assertIsString( $hash );
		$this->assertNotEmpty( $hash );
	}

	public function testItBuildsHashWithUnicodeContent(): void {
		$html = '<html><body><div>Content with unicode: éñç</div></body></html>';

		$hash = $this->hash_builder->build_hash( $html );

		$this->assertIsString( $hash );
		$this->assertNotEmpty( $hash );
	}

	public function testItBuildsHashConsistency(): void {
		$html = '<html><head><link rel="stylesheet" href="style.css"><style>body { color: red; }</style></head><body><div>Test content</div><script>console.log("test");</script></body></html>';

		$hash1 = $this->hash_builder->build_hash( $html );
		$hash2 = $this->hash_builder->build_hash( $html );

		// Same input should produce the same hash.
		$this->assertSame( $hash1, $hash2 );
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

	public function testItBuildsHashWithNestedScripts(): void {
		$html = '<html><body><div>Content<script>var x = 1;</script>More content<script>var y = 2;</script></div></body></html>';

		$hash = $this->hash_builder->build_hash( $html );

		$this->assertIsString( $hash );
		$this->assertNotEmpty( $hash );
	}
}
