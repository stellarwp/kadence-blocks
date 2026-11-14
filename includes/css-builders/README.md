# CSS builders

Every block's `build_css()` is one line:

```php
return Kadence_Blocks_Css_Builders::build( 'Kadence_Blocks_X_Css', $this, $this->block_name, $attributes, $css, $unique_id, $unique_style_id );
```

`Kadence_Blocks_Css_Builders` loads the entry class on demand, wraps the
block in `Kadence_Blocks_Css_Block_Context` (which reaches block members through `Kadence_Blocks_Css_Block_Bridge`),
and calls the entry class `build()`. An entry class extends `Kadence_Blocks_Css_Block_Builder`, which owns the
`build()` template (input, style id, write each section in order), and only declares `sections()`, plus `applies()`
(a guard, for blocks that read a post) and `derived()` (values worked out once from the attributes and the unique id)
when it needs them. Each `Kadence_Blocks_Css_Section` writes one group of rules
through `Kadence_Blocks_Css`. Generic sections live in `sections/` and are reused by Pro. Blocks whose CSS is the same
share an entry class, such as `Kadence_Blocks_Form_Field_Css` for the advanced form fields.

## Updating Free and Pro in any order

* Classes load through a generated class map, never through `require_once`: no file in `css-builders/` or `css-writers/`
  requires anything. Each plugin registers its map with `Kadence_Blocks_Css_Builders::add_classmap()`. After adding,
  moving or removing a class run `php bin/generate-css-classmap.php includes includes/css-builders/classmap.php css-builders css-writers`
  (Pro: `... css-builders`); `ClassmapTest` fails when a map is stale.
* Pro bundles a copy of the Free runtime classes in `kadence-blocks-pro/includes/css-runtime/`. Its autoloader
  (`Kadence_Blocks_Pro_Css_Runtime`) uses Free's file when it exists and the bundled copy otherwise, so old Free +
  new Pro works.
* New Free + old Pro works because Free's `build_css()` bodies never depend on Pro and the public API only grows.
* **Additive-only rule:** never remove, rename, or add required parameters to a public method of a class in
  `css-builders/` or `css-writers/`. `tests/wpunit/CssBuilders/Api/ApiContractTest.php` enforces this against
  `css-builders-api.json`. After an intentional addition run the suite with `KB_UPDATE_API_SNAPSHOT=1` and bump
  `KADENCE_BLOCKS_CSS_BUILDERS_VERSION`.
* After changing a shared Free class, run `php bin/bundle-css-runtime.php` in Pro; `RuntimeTest` fails if the bundle drifts.
