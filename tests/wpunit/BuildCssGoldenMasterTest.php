<?php declare( strict_types=1 );

namespace Tests\wpunit;

use Generator;
use Kadence_Blocks_Abstract_Block;
use Kadence_Blocks_CSS;
use ReflectionMethod;
use ReflectionProperty;
use Tests\Support\Classes\Build_Css_Fuzzer;
use Tests\Support\Classes\Css_Normalizer;
use Tests\Support\Classes\TestCase;
use Throwable;

/**
 * Golden-master guard for every block's `build_css()`.
 *
 * For each block class it feeds a fixed set of seeded, schema-driven attribute sets through
 * `build_css()` and compares a hash of the CSS (or of the thrown exception) with the hashes stored
 * in `tests/_data/build-css-golden/`. The CSS is compared by meaning, not by layout: for every media
 * query and selector, the final value of every property. Rule order, how a selector's declarations
 * are split across blocks and repeated declarations do not matter; any changed, added or missing
 * value, selector or media query fails the test.
 *
 * To record the golden files from the current code, run with `BUILD_CSS_GOLDEN_WRITE=1`. Set
 * `BUILD_CSS_ONLY` to a block class name to run a single block, and `BUILD_CSS_DEBUG` to print the
 * errors `build_css()` throws.
 */
final class BuildCssGoldenMasterTest extends TestCase {

	/**
	 * How many attribute sets are generated for each block.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private const CASES_PER_BLOCK = 400;

	/**
	 * Blocks whose `build_css()` reads its settings from a custom post type through `$attributes['id']`.
	 *
	 * Attribute fuzzing cannot reach their logic without post fixtures, so the golden master only
	 * pins their (near-empty) output here and the variety check skips them. They need dedicated
	 * fixture-based tests before any change to their `build_css()` is trusted.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private const CPT_DRIVEN_BLOCKS = [
		'Kadence_Blocks_Advanced_Form_Block',
		'Kadence_Blocks_Header_Block',
		'Kadence_Blocks_Header_Column_Block',
		'Kadence_Blocks_Header_Container_Desktop_Block',
		'Kadence_Blocks_Header_Container_Tablet_Block',
		'Kadence_Blocks_Header_Row_Block',
		'Kadence_Blocks_Header_Section_Block',
		'Kadence_Blocks_Navigation_Block',
		'Kadence_Blocks_Off_Canvas_Block',
		'Kadence_Blocks_Off_Canvas_Trigger_Block',
	];

	/**
	 * `build_css()` output for the generated attribute sets matches the recorded golden hashes.
	 *
	 * @dataProvider blockProvider
	 *
	 * @param string $class_name The block class.
	 *
	 * @return void
	 */
	public function testBuildCssMatchesGoldenMaster( string $class_name ): void {
		$results = $this->run_cases( $class_name );
		$file    = codecept_data_dir( 'build-css-golden/' . $class_name . '.json' );

		if ( getenv( 'BUILD_CSS_GOLDEN_WRITE' ) ) {
			if ( ! is_dir( dirname( $file ) ) ) {
				mkdir( dirname( $file ), 0775, true );
			}
			file_put_contents( $file, json_encode( $results, JSON_PRETTY_PRINT ) . "\n" );
			$this->assertNotEmpty( $results['hashes'] );

			return;
		}

		$this->assertFileExists( $file, 'No golden file; record it with BUILD_CSS_GOLDEN_WRITE=1.' );
		$golden = json_decode( (string) file_get_contents( $file ), true );

		$this->assertSame( $golden['semantic'], $results['semantic'], $this->first_difference( $golden['semantic'], $results['semantic'] ) );
	}

	/**
	 * The generated attribute sets drive `build_css()` to emit varied output, so the golden hashes are meaningful.
	 *
	 * @dataProvider blockProvider
	 *
	 * @param string $class_name The block class.
	 *
	 * @return void
	 */
	public function testGeneratedCasesProduceVariedOutput( string $class_name ): void {
		if ( in_array( $class_name, self::CPT_DRIVEN_BLOCKS, true ) ) {
			$this->markTestSkipped( $class_name . ' reads a custom post type; attribute fuzzing cannot vary its output.' );
		}

		$results = $this->run_cases( $class_name );

		$this->assertGreaterThan( 1, count( array_unique( $results['hashes'] ) ), 'The fuzzer produced almost no distinct CSS for ' . $class_name );
	}

	/**
	 * Every block class that defines its own `build_css()`.
	 *
	 * @return Generator
	 */
	public static function blockProvider(): Generator {
		$only = getenv( 'BUILD_CSS_ONLY' );

		foreach ( self::block_classes() as $class_name ) {
			if ( $only && $only !== $class_name ) {
				continue;
			}
			yield $class_name => [ 'class_name' => $class_name ];
		}
	}

	/**
	 * Find the block classes that declare `build_css()`.
	 *
	 * @return string[]
	 */
	private static function block_classes(): array {
		$classes  = [];
		$iterator = new \RecursiveIteratorIterator( new \RecursiveDirectoryIterator( KADENCE_BLOCKS_PATH . 'includes/blocks', \FilesystemIterator::SKIP_DOTS ) );
		foreach ( $iterator as $file ) {
			if ( 'php' !== $file->getExtension() ) {
				continue;
			}
			$source = (string) file_get_contents( $file->getPathname() );
			if ( ! preg_match_all( '/^(?:final\s+)?class\s+(\w+)\s+extends\s+\w+/m', $source, $matches ) ) {
				continue;
			}
			foreach ( $matches[1] as $class_name ) {
				if ( class_exists( $class_name ) && method_exists( $class_name, 'build_css' ) && ( new ReflectionMethod( $class_name, 'build_css' ) )->class === $class_name ) {
					$classes[] = $class_name;
				}
			}
		}
		sort( $classes );

		return array_values( array_unique( $classes ) );
	}

	/**
	 * Run the generated attribute sets through a block's `build_css()`.
	 *
	 * @param string $class_name The block class.
	 *
	 * @return array{block: string, cases: int, pool: string[], hashes: string[], semantic: string[]}
	 */
	private function run_cases( string $class_name ): array {
		/** @var Kadence_Blocks_Abstract_Block $block */
		$block  = method_exists( $class_name, 'get_instance' ) ? $class_name::get_instance() : new $class_name();
		$schema = $this->schema_for( $block );
		$pool   = $this->pool_for( $class_name );

		$hashes     = [];
		$semantic   = [];
		$normalizer = new Css_Normalizer();
		for ( $seed = 1; $seed <= self::CASES_PER_BLOCK; $seed++ ) {
			$attributes = ( new Build_Css_Fuzzer( $seed, $pool ) )->attributes( $schema );
			$this->dump_seed( $class_name, $seed, $attributes, $block );
			$css        = $this->css_for( $block, $attributes );
			$hashes[]   = sha1( $css );
			$semantic[] = $normalizer->hash( $css );
		}

		$this->dump_cases( $schema, $pool );

		return [
			'block'    => $class_name,
			'cases'    => self::CASES_PER_BLOCK,
			'pool'     => $pool,
			'hashes'   => $hashes,
			'semantic' => $semantic,
		];
	}

	/**
	 * The string pool for a block: the one stored in its golden file, or, when recording, the literals in its source.
	 *
	 * The pool is stored so the generated attributes stay identical when the CSS code moves between files, and
 * is only derived from source the first time a block is recorded.
	 *
	 * @param string $class_name The block class.
	 *
	 * @return string[]
	 */
	private function pool_for( string $class_name ): array {
		$file = codecept_data_dir( 'build-css-golden/' . $class_name . '.json' );

		if ( is_readable( $file ) ) {
			$golden = json_decode( (string) file_get_contents( $file ), true );

			if ( isset( $golden['pool'] ) ) {
				return $golden['pool'];
			}
		}

		return Build_Css_Fuzzer::literals_from_source( $this->source_for( $class_name ) );
	}

	/**
	 * The PHP source the fuzzer takes its string literals from: the block class and, once the CSS logic has
	 * moved there, its CSS builder class.
	 *
	 * @param string $class_name The block class.
	 *
	 * @return string
	 */
	private function source_for( string $class_name ): string {
		$source  = (string) file_get_contents( ( new \ReflectionClass( $class_name ) )->getFileName() );
		$builder = preg_replace( '/_Block$/', '_Css', $class_name );
		$file    = KADENCE_BLOCKS_PATH . 'includes/css-builders/class-' . strtolower( str_replace( '_', '-', $builder ) ) . '.php';

		return is_readable( $file ) ? $source . (string) file_get_contents( $file ) : $source;
	}

	/**
	 * Write the attributes and the CSS of one seed to `tests/_output` for comparison with the original code.
	 *
	 * Only runs when `BUILD_CSS_DUMP_SEED` names the seed.
	 *
	 * @param string               $class_name The block class.
	 * @param int                  $seed       The seed being run.
	 * @param array<string, mixed> $attributes The generated attributes.
	 * @param object               $block      The block.
	 *
	 * @return void
	 */
	private function dump_seed( string $class_name, int $seed, array $attributes, object $block ): void {
		if ( (int) getenv( 'BUILD_CSS_DUMP_SEED' ) !== $seed ) {
			return;
		}

		$base = KADENCE_BLOCKS_PATH . 'tests/_output/seed-' . $class_name;
		file_put_contents( $base . '.json', json_encode( $attributes ) );
		$css = $this->css_for( $block, $attributes );
		file_put_contents( $base . '.new.css', $css );
		file_put_contents( $base . '.new.normalized.json', json_encode( ( new Css_Normalizer() )->normalize( $css ), JSON_PRETTY_PRINT ) );
	}

	/**
	 * Build CSS for one attribute set, folding exceptions into the result.
	 *
	 * @param Kadence_Blocks_Abstract_Block $block      The block.
	 * @param array<string, mixed>          $attributes Block attributes.
	 *
	 * @return string
	 */
	private function css_for( Kadence_Blocks_Abstract_Block $block, array $attributes ): string {
		// Legacy build_css() code raises notices on missing keys; they are not part of the contract.
		set_error_handler(
			static function () {
				return true;
			} 
		);

		try {
			$css = $block->build_css( $attributes, new Kadence_Blocks_CSS(), 'fuzz', 'fuzz' );

			return is_string( $css ) ? $css : 'non-string:' . gettype( $css );
		} catch ( Throwable $e ) {
			if ( getenv( 'BUILD_CSS_DEBUG' ) ) {
				fwrite( STDERR, "\nDEBUG " . get_class( $e ) . ': ' . $e->getMessage() . ' @ ' . basename( $e->getFile() ) . ':' . $e->getLine() . "\n" );
			}

			return 'EXCEPTION:' . get_class( $e );
		} finally {
			restore_error_handler();
		}
	}

	/**
	 * The attribute schema from a block's `block.json`.
	 *
	 * @param Kadence_Blocks_Abstract_Block $block The block.
	 *
	 * @return array<string, array<string, mixed>>
	 */
	private function schema_for( Kadence_Blocks_Abstract_Block $block ): array {
		if ( ! property_exists( $block, 'block_name' ) ) {
			return [];
		}

		$property = new ReflectionProperty( $block, 'block_name' );
		$property->setAccessible( true );
		$name  = (string) $property->getValue( $block );
		$index = self::schema_index();

		return $index[ 'kadence/' . $name ] ?? $index[ 'dir:' . $name ] ?? [];
	}

	/**
	 * Attribute schemas of every block in `src/blocks`, keyed by block name.
	 *
	 * Blocks can sit in nested folders (table data, header sections), so the folder is scanned
	 * and each `block.json` is keyed by the name it declares.
	 *
	 * @return array<string, array<string, array<string, mixed>>>
	 */
	private static function schema_index(): array {
		static $index = null;
		if ( null !== $index ) {
			return $index;
		}
		$index    = [];
		$iterator = new \RecursiveIteratorIterator( new \RecursiveDirectoryIterator( KADENCE_BLOCKS_PATH . 'src/blocks', \FilesystemIterator::SKIP_DOTS ) );
		foreach ( $iterator as $file ) {
			if ( 'block.json' !== $file->getFilename() ) {
				continue;
			}
			$json = json_decode( (string) file_get_contents( $file->getPathname() ), true );
			if ( is_array( $json ) && isset( $json['name'] ) && is_array( $json['attributes'] ?? null ) ) {
				$index[ $json['name'] ] = $json['attributes'];
				// Fallback for blocks whose class `block_name` is their folder name, not their declared name.
				$index[ 'dir:' . basename( dirname( $file->getPathname() ) ) ] = $json['attributes'];
			}
		}

		return $index;
	}

	/**
	 * Describe the first case whose hash changed.
	 *
	 * @param string[] $expected Golden hashes.
	 * @param string[] $actual   Current hashes.
	 *
	 * @return string
	 */
	private function first_difference( array $expected, array $actual ): string {
		foreach ( $expected as $index => $hash ) {
			if ( ( $actual[ $index ] ?? null ) !== $hash ) {
				return 'First differing case is seed ' . ( $index + 1 ) . '; ' . count( array_diff_assoc( $expected, $actual ) ) . ' of ' . count( $expected ) . ' cases differ.';
			}
		}

		return 'Case count changed.';
	}

	/**
	 * Write extra generated attribute sets to `tests/_output/<prefix>-cases.json`, for comparing against the original code.
	 *
	 * Only runs when `BUILD_CSS_DUMP_CASES` names how many to write and `BUILD_CSS_DUMP_PREFIX` the file prefix.
	 *
	 * @param array<string, array<string, mixed>> $schema The attribute schema.
	 * @param string[]                            $pool   The string pool.
	 *
	 * @return void
	 */
	private function dump_cases( array $schema, array $pool ): void {
		$count = (int) getenv( 'BUILD_CSS_DUMP_CASES' );

		if ( $count < 1 ) {
			return;
		}

		$cases = [];

		for ( $seed = 20001; $seed < 20001 + $count; $seed++ ) {
			$cases[ 's' . $seed ] = ( new Build_Css_Fuzzer( $seed, $pool ) )->attributes( $schema );
		}

		file_put_contents( KADENCE_BLOCKS_PATH . 'tests/_output/' . getenv( 'BUILD_CSS_DUMP_PREFIX' ) . '-cases.json', json_encode( $cases ) );
	}
}
