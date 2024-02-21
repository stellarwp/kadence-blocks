<?php

namespace Helper;

// here you can define custom actions
// all public methods declared in helper class will be available in $I

use Codeception\Exception\ModuleException;
use Codeception\Lib\InnerBrowser;
use Codeception\Module\WPBrowser;
use Codeception\Module\WPDb;
use Codeception\Module\WPFilesystem;
use Codeception\TestInterface;
use PHPUnit\Framework\Assert;
use function tad\WPBrowser\untrailslashit;

class Acceptance extends \Codeception\Module {

	use SharedGherkin;

	private $currentIp;
	private $haveIp;
	private $htaccess;
	private $tempDisableModulesConstant;

	public function _before( TestInterface $test ) {
		parent::_before( $test );

		$this->cli()->cli( [ 'core', 'update-db' ] );
		$this->cli()->cli( [ 'plugin', 'activate', 'kadence-blocks' ] );

		$this->haveIp = '';

		$htaccess = untrailslashit( $this->filesystem()->_getConfig( 'wpRootFolder' ) ) . '/.htaccess';

		if ( file_exists( $htaccess ) ) {
			$this->htaccess = file_get_contents( $htaccess );
		}
	}

	public function _after( TestInterface $test ) {
		parent::_after( $test );

		$this->currentIp = '';

		if ( $this->htaccess ) {
			$fs = $this->filesystem();
			$fs->writeToFile(
				untrailslashit( $fs->_getConfig( 'wpRootFolder' ) ) . '/.htaccess',
				$this->htaccess
			);
		}

		if ( $this->tempDisableModulesConstant ) {
			$this->clearTempDisableModulesConstant();
		}
	}

	/**
	 * Grab the home URL of the test site.
	 *
	 * @return string
	 */
	public function grabHomeUrl() {
		return $this->browser()->config['url'];
	}

	/**
	 * @return InnerBrowser
	 */
	private function browser() {
		return $this->getModule( 'WPBrowser' );
	}

	/**
	 * @return WPFilesystem
	 */
	private function filesystem() {
		return $this->getModule( 'WPFilesystem' );
	}

	/**
	 * @return WPDb
	 */
	private function db() {
		return $this->getModule( 'WPDb' );
	}

	private function cliToString( ...$args ) {
		return $this->cli()->cliToString( ...$args );
	}

}
