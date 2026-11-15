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

## Extending the CSS of a block

The hooks below are public. Their names and arguments only ever grow (see the additive-only rule above), and
`tests/wpunit/CssBuilders/Hooks/HooksTest.php` pins them. `$block_name` is the block name without its namespace, such as
`infobox` or `header-column`.

| Hook | Kind | What it is for |
|---|---|---|
| `kadence_blocks_css_sections` (`$sections`, `$block_name`, `$attributes`) | filter | Add, remove, replace or reorder the sections that write a block's CSS. Items must implement `Kadence_Blocks_Css_Section`; anything else is dropped with a `_doing_it_wrong` notice. Applies to the top-level sections of every block builder. |
| `kadence_blocks_css_builder_class` (`$builder_class`, `$block_name`, `$block`) | filter | Replace the builder class of a block. The class must exist, take a `Kadence_Blocks_Css_Block_Context` in its constructor and have a `build()` method; extending `Kadence_Blocks_Css_Block_Builder` does all of that. |
| `kadence_blocks_css_built` (`$block_name`, `$attributes`, `$output`, `$unique_id`) | action | React to a block being built, for example to load assets or keep a log. The CSS itself is already stored by the CSS builder. |
| `kadence_blocks_css_output_media_queries` | filter | Existing: switch the media query output off. |
| `kadence_blocks_attachment_fixed_on_mobile` | filter | Existing: keep a fixed background fixed on mobile. |

Add a section to a block:

```php
add_filter(
	'kadence_blocks_css_sections',
	static function ( array $sections, string $block_name ) {
		if ( 'infobox' === $block_name ) {
			$sections[] = new My_Plugin_Infobox_Glow_Section();
		}

		return $sections;
	},
	10,
	2
);
```

A section implements `Kadence_Blocks_Css_Section::write( Kadence_Blocks_Css_Build_Input $input )`. It reads the attributes
from `$input`, sets a selector (`$input->css()->set_selector()`, `{id}` stands for the unique id in the selector
sections) and adds properties. Sections share one CSS builder and its current selector, so a section that adds properties
needs a selector before it, from `Kadence_Blocks_Css_Selector_Section` or its own `set_selector()`.

Build the CSS of a block from another plugin the same way Kadence Blocks Pro does: write a builder that extends
`Kadence_Blocks_Css_Block_Builder` and lists its sections, make it loadable (a class map registered with
`Kadence_Blocks_Css_Builders::add_classmap()`, or any autoloader), and have the block's `build_css()` call
`Kadence_Blocks_Css_Builders::build( 'My_Plugin_Block_Css', $this, $this->block_name, $attributes, $css, $unique_id, $unique_style_id )`.
