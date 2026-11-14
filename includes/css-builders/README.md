# CSS builders

Every block's `build_css()` is one line:

```php
return Kadence_Blocks_Css_Builders::build( 'Kadence_Blocks_X_Css', $this, $this->block_name, $attributes, $css, $unique_id, $unique_style_id );
```

`Kadence_Blocks_Css_Builders` loads the entry class (`class-<kebab-name>.php`) from the registered directories, wraps the
block in `Kadence_Blocks_Css_Block_Context` (which reaches block members through `Kadence_Blocks_Css_Block_Bridge`),
and calls the entry class `build()`. The entry class loops over small `Kadence_Blocks_Css_Section` classes, each
writing one group of rules through `Kadence_Blocks_Css`. Generic sections live in `sections/` and are reused by Pro.

## Updating Free and Pro in any order

* Pro registers its own directory with `Kadence_Blocks_Css_Builders::add_directory()`.
* Pro bundles a copy of the Free runtime classes in `kadence-blocks-pro/includes/css-runtime/`. Its autoloader
  (`Kadence_Blocks_Pro_Css_Runtime`) uses Free's file when it exists and the bundled copy otherwise, so old Free +
  new Pro works.
* New Free + old Pro works because Free's `build_css()` bodies never depend on Pro and the public API only grows.
* **Additive-only rule:** never remove, rename, or add required parameters to a public method of a class in
  `css-builders/` or `css-writers/`. `tests/wpunit/CssBuilders/Api/ApiContractTest.php` enforces this against
  `css-builders-api.json`. After an intentional addition run the suite with `KB_UPDATE_API_SNAPSHOT=1` and bump
  `KADENCE_BLOCKS_CSS_BUILDERS_VERSION`.
* After changing a shared Free class, run `php bin/bundle-css-runtime.php` in Pro; `RuntimeTest` fails if the bundle drifts.
