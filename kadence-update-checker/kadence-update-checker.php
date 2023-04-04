<?php
/**
 * Kadence Update Checker
 * https://www.kadencewp.com
 *
 * Derived from:
 * Plugin Update Checker Library 4.10 and Kernl Update Checker v2.1.0
 *
 * Released under the MIT license.
 *
 * @package Kadence WP Products
 */

require dirname(__FILE__) . '/inc/InstalledPackage.php';
require dirname(__FILE__) . '/inc/Metadata.php';
require dirname(__FILE__) . '/inc/OAuthSignature.php';
require dirname(__FILE__) . '/inc/Scheduler.php';
require dirname(__FILE__) . '/inc/StateStore.php';
require dirname(__FILE__) . '/inc/Update.php';
require dirname(__FILE__) . '/inc/UpdateChecker.php';
require dirname(__FILE__) . '/inc/UpgraderStatus.php';
require dirname(__FILE__) . '/inc/Utils.php';
// Theme.
require dirname(__FILE__) . '/inc/Theme/UpdateChecker.php';
require dirname(__FILE__) . '/inc/Theme/Update.php';
require dirname(__FILE__) . '/inc/Theme/Package.php';
// Plugin.
require dirname(__FILE__) . '/inc/Plugin/UpdateChecker.php';
require dirname(__FILE__) . '/inc/Plugin/Update.php';
require dirname(__FILE__) . '/inc/Plugin/Ui.php';
require dirname(__FILE__) . '/inc/Plugin/Package.php';
require dirname(__FILE__) . '/inc/Plugin/Info.php';
// Vendor.
require dirname(__FILE__) . '/inc/vendor/KadencePucReadmeParser.php';
require dirname(__FILE__) . '/inc/vendor/Parsedown.php';
// Main File.
require dirname(__FILE__) . '/inc/Factory.php';
