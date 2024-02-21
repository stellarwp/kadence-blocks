<?php

namespace Helper;

use Behat\Gherkin\Node\PyStringNode;
use Behat\Gherkin\Node\TableNode;
use Codeception\Module\WPFilesystem;
use Codeception\TestInterface;
use PHPUnit\Framework\Assert;
use DMS\PHPUnitExtensions\ArraySubset;
use function tad\WPBrowser\untrailslashit;

class WPCLI extends \Codeception\Module {

	use SharedGherkin;

	/** @var array */
	private $variables = [];

	private $lastOutput;

	private $wpConfig;

	public function _before( TestInterface $test ) {
		parent::_before( $test );

		$this->cli()->cli( [ 'core', 'update-db' ] );
		$this->cli()->cli( [ 'plugin', 'activate', 'kadence-blocks' ] );

		$wpConfig = untrailslashit( $this->filesystem()->_getConfig( 'wpRootFolder' ) ) . '/wp-config.php';

		if ( file_exists( $wpConfig ) ) {
			$this->wpConfig = file_get_contents( $wpConfig );
		}
	}

	public function _after( TestInterface $test ) {
		$this->variables = [];

		if ( $this->wpConfig ) {
			$fs = $this->filesystem();
			$fs->writeToFile(
				untrailslashit( $fs->_getConfig( 'wpRootFolder' ) ) . '/wp-config.php',
				$this->wpConfig
			);
		}
	}

	/**
	 * @When I run :command
	 *
	 * @param string $command
	 *
	 * @return string
	 */
	public function run( $command ) {
		if ( $command[0] === '[' && substr( $command, - 1 ) === ']' ) {
			$command = json_decode( $command, true );
		}

		return $this->lastOutput = $this->cli()->cliToString( $command );
	}

	/**
	 * @When I run with variables :command
	 *
	 * @param string $command
	 *
	 * @return string
	 */
	public function runWithVariables( $command ) {
		$command = $this->replaceVariables( $command );

		return $this->run( $command );
	}

	/**
	 * @When I save output as :variable
	 *
	 * @param string $variable
	 */
	public function saveOutputAs( $variable ) {
		$this->variables[ $variable ] = trim( $this->lastOutput );
	}

	/**
	 * @Then I see shell output is: :output
	 *
	 * @param PyStringNode $output
	 */
	public function seeShellOutputIs( PyStringNode $output ) {
		$this->assertEquals( $this->replaceVariables( $output->getRaw() ), trim( $this->lastOutput ) );
	}

	/**
	 * @Then I see shell output is empty
	 */
	public function seeShellOutputIsEmpty() {
		$this->assertEquals( '', trim( $this->lastOutput ) );
	}

	/**
	 * @Then I see shell output is not empty
	 */
	public function seeShellOutputIsNotEmpty() {
		$this->assertNotEquals( '', trim( $this->lastOutput ) );
	}

	/**
	 * @Then I see :text in shell output
	 *
	 * @param string $text
	 */
	public function seeInShellOutput( $text ) {
		$this->cli()->seeInShellOutput( $this->replaceVariables( $text ) );
	}

	/**
	 * @Then I don't see :text in shell output
	 *
	 * @param string $text
	 */
	public function dontSeeInShellOutput( $text ) {
		$this->cli()->dontSeeInShellOutput( $this->replaceVariables( $text ) );
	}

	/**
	 * @Then I see the shell output matches :regex
	 *
	 * @param string $regex
	 */
	public function seeShellOutputMatches( $regex ) {
		$this->cli()->seeShellOutputMatches( $regex );
	}

	/**
	 * @Then I see the result code is :code
	 *
	 * @param int $code
	 */
	public function seeResultCodeIs( $code ) {
		$this->cli()->seeResultCodeIs( $code );
	}

	/**
	 * @Then I see the result code is not :code
	 *
	 * @param int $code
	 */
	public function seeResultCodeIsNot( $code ) {
		$this->cli()->seeResultCodeIsNot( $code );
	}

	/**
	 * @Then /^I see the result is a JSON object containing:$/
	 *
	 * @param TableNode $table
	 */
	public function seeTheResultIsAJSONObjectContaining( TableNode $table ) {
		$object = [];

		foreach ( $table->getRows() as $i => list( $key, $value ) ) {
			if ( 0 === $i ) {
				continue; // Table header
			}

			$value = $this->replaceVariables( trim( $value ) );

			if ( strpos( $value, '[' ) === 0 || strpos( $value, '{' ) === 0 ) {
				$decoded = json_decode( $value );

				if ( json_last_error() === JSON_ERROR_NONE ) {
					$value = $decoded;
				}
			}

			$object[ $key ] = $value;
		}

		Assert::assertJson( $this->lastOutput );
		ArraySubset\Assert::assertArraySubset( $object, json_decode( $this->lastOutput, true ), false, 'Output: ' . $this->lastOutput );
	}

	/**
	 * Replace variables in a string.
	 *
	 * @param string $string
	 *
	 * @return string
	 */
	private function replaceVariables( $string ) {
		return str_replace( array_keys( $this->variables ), array_values( $this->variables ), $string );
	}

	private function filesystem(): WPFilesystem {
		return $this->getModule( 'WPFilesystem' );
	}
}
