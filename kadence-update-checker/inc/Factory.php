<?php
if ( !class_exists('Kadence_Update_Checker', false) ) :

	/**
	 * A factory that builds update checker instances.
	 *
	 * When multiple versions of the same class have been loaded (e.g. PluginUpdateChecker 4.0
	 * and 4.1), this factory will always use the latest available minor version. Register class
	 * versions by calling {@link Kadence_Update_Checker::addVersion()}.
	 *
	 * At the moment it can only build instances of the UpdateChecker class. Other classes are
	 * intended mainly for internal use and refer directly to specific implementations.
	 */
	class Kadence_Update_Checker {
		protected static $classVersions = array();
		protected static $sorted = false;

		protected static $myMajorVersion = '';
		protected static $latestCompatibleVersion = '';

		/**
		 * A wrapper method for buildUpdateChecker() that reads the metadata URL from the plugin or theme header.
		 *
		 * @param string $fullPath Full path to the main plugin file or the theme's style.css.
		 * @param array $args Optional arguments. Keys should match the argument names of the buildUpdateChecker() method.
		 * @return Kadence_Puc_Plugin_UpdateChecker|Kadence_Puc_Theme_UpdateChecker|Kadence_Puc_Vcs_BaseChecker
		 */
		public static function buildFromHeader($fullPath, $args = array()) {
			$fullPath = self::normalizePath($fullPath);

			//Set up defaults.
			$defaults = array(
				'metadataUrl'  => '',
				'slug'         => '',
				'checkPeriod'  => 12,
				'optionName'   => '',
				'muPluginFile' => '',
			);
			$args = array_merge($defaults, array_intersect_key($args, $defaults));
			extract($args, EXTR_SKIP);

			//Check for the service URI
			if ( empty($metadataUrl) ) {
				$metadataUrl = self::getServiceURI($fullPath);
			}

			/** @noinspection PhpUndefinedVariableInspection These variables are created by extract(), above. */
			return self::buildUpdateChecker($metadataUrl, $fullPath, $slug, $checkPeriod, $optionName, $muPluginFile);
		}

		/**
		 * Create a new instance of the update checker.
		 *
		 * This method automatically detects if you're using it for a plugin or a theme and chooses
		 * the appropriate implementation for your update source (JSON file, GitHub, BitBucket, etc).
		 *
		 * @see Kadence_Puc_UpdateChecker::__construct
		 *
		 * @param string $metadataUrl The URL of the metadata file, a GitHub repository, or another supported update source.
		 * @param string $fullPath Full path to the main plugin file or to the theme directory.
		 * @param string $slug Custom slug. Defaults to the name of the main plugin file or the theme directory.
		 * @param int $checkPeriod How often to check for updates (in hours).
		 * @param string $optionName Where to store book-keeping info about update checks.
		 * @param string $muPluginFile The plugin filename relative to the mu-plugins directory.
		 * @return Kadence_Puc_Plugin_UpdateChecker|Kadence_Puc_Theme_UpdateChecker
		 */
		public static function buildUpdateChecker($metadataUrl, $fullPath, $slug = '', $checkPeriod = 12, $optionName = '', $muPluginFile = '') {
			$fullPath = self::normalizePath($fullPath);
			$id = null;

			//Plugin or theme?
			$themeDirectory = self::getThemeDirectoryName($fullPath);
			if ( self::isPluginFile($fullPath) ) {
				$type = 'Plugin';
				$id = $fullPath;
				$checkerClass = 'Kadence_Puc_Plugin_UpdateChecker';
			} else if ( $themeDirectory !== null ) {
				$type = 'Theme';
				$id = $themeDirectory;
				$checkerClass = 'Kadence_Puc_Theme_UpdateChecker';
			} else {
				throw new RuntimeException(sprintf(
					'The update checker cannot determine if "%s" is a plugin or a theme. ' .
					'This is a bug. Please contact the PUC developer.',
					htmlentities($fullPath)
				));
			}

			if ( $checkerClass === null ) {
				trigger_error(
					sprintf(
						'PUC %s does not support updates for %ss %s',
						htmlentities(self::$latestCompatibleVersion),
						strtolower($type),
						'using JSON metadata'
					),
					E_USER_ERROR
				);
				return null;
			}
			//Plain old update checker.
			return new $checkerClass($metadataUrl, $id, $slug, $checkPeriod, $optionName, $muPluginFile);
		}

		/**
		 *
		 * Normalize a filesystem path. Introduced in WP 3.9.
		 * Copying here allows use of the class on earlier versions.
		 * This version adapted from WP 4.8.2 (unchanged since 4.5.0)
		 *
		 * @param string $path Path to normalize.
		 * @return string Normalized path.
		 */
		public static function normalizePath($path) {
			if ( function_exists('wp_normalize_path') ) {
				return wp_normalize_path($path);
			}
			$path = str_replace('\\', '/', $path);
			$path = preg_replace('|(?<=.)/+|', '/', $path);
			if ( substr($path, 1, 1) === ':' ) {
				$path = ucfirst($path);
			}
			return $path;
		}

		/**
		 * Check if the path points to a plugin file.
		 *
		 * @param string $absolutePath Normalized path.
		 * @return bool
		 */
		protected static function isPluginFile($absolutePath) {
			//Is the file inside the "plugins" or "mu-plugins" directory?
			$pluginDir = self::normalizePath(WP_PLUGIN_DIR);
			$muPluginDir = self::normalizePath(WPMU_PLUGIN_DIR);
			if ( (strpos($absolutePath, $pluginDir) === 0) || (strpos($absolutePath, $muPluginDir) === 0) ) {
				return true;
			}

			//Is it a file at all? Caution: is_file() can fail if the parent dir. doesn't have the +x permission set.
			if ( !is_file($absolutePath) ) {
				return false;
			}

			//Does it have a valid plugin header?
			//This is a last-ditch check for plugins symlinked from outside the WP root.
			if ( function_exists('get_file_data') ) {
				$headers = get_file_data($absolutePath, array('Name' => 'Plugin Name'), 'plugin');
				return !empty($headers['Name']);
			}

			return false;
		}

		/**
		 * Get the name of the theme's directory from a full path to a file inside that directory.
		 * E.g. "/abc/public_html/wp-content/themes/foo/whatever.php" => "foo".
		 *
		 * Note that subdirectories are currently not supported. For example,
		 * "/xyz/wp-content/themes/my-theme/includes/whatever.php" => NULL.
		 *
		 * @param string $absolutePath Normalized path.
		 * @return string|null Directory name, or NULL if the path doesn't point to a theme.
		 */
		protected static function getThemeDirectoryName($absolutePath) {
			if ( is_file($absolutePath) ) {
				$absolutePath = dirname($absolutePath);
			}

			if ( file_exists($absolutePath . '/style.css') ) {
				return basename($absolutePath);
			}
			return null;
		}

	}

endif;
