<?php

namespace Helper;

use Codeception\Exception\ModuleException;
use Codeception\Module;
use Codeception\TestInterface;
use PHPUnit\Framework\RiskyTestError;
use PHPUnit\Framework\SkippedTestError;
use tad\WPBrowser\Exceptions\WpCliException;
use tad\WPBrowser\Traits\WithWpCli;

class WPVersion extends Module {

	use WithWpCli;

	/** @var string */
	protected $version;

	/** @var bool */
	protected $installed = false;

	protected $blocked_global_env_vars = [];

	public function _initialize() {
		parent::_initialize();

		$this->setUpWpCli( $this->config['path'] );

		if ( ! empty( $this->config['installEarly'] ) && ! empty( $this->config['version'] ) ) {
			$this->download( trim( $this->config['version'], " \t\n\r\0\x0B'\"" ) );
		}
	}

	public function _beforeSuite( $settings = [] ) {
		if ( ! empty( $this->config['version'] ) && ! $this->installed ) {
			$this->update( trim( $this->config['version'], " \t\n\r\0\x0B'\"" ) );
		}

		if ( isset( $GLOBALS['wp_version'] ) ) {
			$this->version = $GLOBALS['wp_version'];
		} else {
			$this->version = trim( $this->runCommand( 'core', 'version' )->getOutput() );
		}
	}

	public function _before( TestInterface $test ) {
		if ( ! $requires = $test->getMetadata()->getParam( 'requires' ) ) {
			return;
		}

		foreach ( $requires as $require ) {
			if ( ! preg_match( '/^WP\s+(?P<operator>[<>=!]{0,2})\s*(?P<version>[\d\.-]+)$/', $require, $matches ) ) {
				throw new RiskyTestError( 'Invalid @requires annotation.' );
			}

			$operator = $matches['operator'];
			$version  = $matches['version'];

			list( $wp_version ) = explode( '-', $this->version );

			if ( ! version_compare( $wp_version, $version, $operator ) ) {
				throw new SkippedTestError( sprintf( 'WP %s %s is required.', $operator, $version ) );
			}
		}
	}

	protected function update( $version ) {
		$this->debugSection( 'WPVersion', sprintf( 'Updating to WordPress %s', $version ) );

		try {
			$process = $this->runCommand( 'core', 'update', '--version=' . $version );
			$out     = $process->getOutput() ?: $process->getStdErr();

			if ( ! $process->isSuccessful() ) {
				echo 'Failed to update WordPress: ' . $out . PHP_EOL;
				throw new ModuleException( $this, sprintf( 'Failed to update WordPress %s: %s', $version, $out ) );
			}

			echo sprintf( 'Installed WordPress: %s', $version ) . PHP_EOL;
			$this->installed = true;
		} catch ( WpCliException $e ) {
			echo 'Caught exception: ', $e->getMessage(), '\n';
			throw new ModuleException( $this, $e->getMessage() );
		}
	}

	protected function download( $version ) {
		$this->debugSection( 'WPVersion', sprintf( 'Installing WordPress %s', $version ) );

		try {
			$process = $this->runCommand( 'core', 'download', '--force', '--version=' . $version );
			$out     = $process->getOutput() ?: $process->getStdErr();

			if ( ! $process->isSuccessful() ) {
				throw new ModuleException( $this, sprintf( 'Failed to download WordPress %s: %s', $version, $out ) );
			}

			echo sprintf( 'Downloaded WordPress: %s', $version ) . PHP_EOL;
			$this->installed = true;
		} catch ( WpCliException $e ) {
			throw new ModuleException( $this, $e->getMessage() );
		}
	}

	protected function runCommand( ...$user_command ) {
		$options = [];

		if ( ! empty( $this->config['allow-root'] ) ) {
			$options[] = '--allow-root';
		}

		$command = array_merge( $options, $user_command );

		$this->debugSection( 'WPVersion', $command );

		$process = $this->executeWpCliCommand( $command, null );
		$out     = $process->getOutput() ?: $process->getStdErr();
		$this->debugSection( 'WPVersion', $out );

		return $process;
	}
}
