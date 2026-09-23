# Tests

The suites run with [slic](https://github.com/stellarwp/slic). From the plugin
directory, after `slic use kadence-blocks`:

| Suite                           | Tests in                              | Theme               |
|---------------------------------|---------------------------------------|---------------------|
| `wpunit`                        | `tests/wpunit/`                       | Twenty Twenty-Three |
| `integration-kadence`           | `tests/integration/Kadence/`          | Kadence             |
| `integration-twentytwentythree` | `tests/integration/TwentyTwentyThree/` | Twenty Twenty-Three |
| `acceptance`                    | `tests/acceptance/`                   | —                   |

Run a suite with `slic run <suite>`.

`wpunit` tests classes and methods. Tests that depend on the active theme go
in an `integration-*` suite, one per theme: the directory a test sits in
decides the theme it runs with. `integration-kadence` covers the Kadence
theme in both its classic and its Full Site Editing mode.

## The `integration-kadence` suite

The Kadence theme is a test dependency, not a package. Put it in place once,
and again whenever you want a newer theme build:

```bash
dev_scripts/integration-theme.sh
```

The script:

1. clones `stellarwp/kadence` into `tests/_themes/kadence` (gitignored; the
   clone keeps its `.git`, so later runs only fetch), at the ref named by
   `KADENCE_THEME_GIT_REF` (default `release/fse`);
2. builds it with `composer -- pup build`;
3. links it into slic's themes directory as `kadence`, where WPLoader activates
   it by slug.

Test another theme branch with, for example:

```bash
KADENCE_THEME_GIT_REF=my-theme-branch dev_scripts/integration-theme.sh
slic run integration-kadence
```

The theme's Full Site Editing mode needs WordPress 7.1 or later; update the
slic site first if it runs an older version:

```bash
slic site-cli core update --version=latest --force
```

Tests switch the Full Site Editing mode with `Kadence\FSE\Mode::enable()` /
`disable()` inside a test. Never switch themes within a suite: WPLoader loads
the theme once at bootstrap, and its classes and hooks can't be unloaded. A
test for another theme goes in that theme's suite.

## Shared test code

Both `integration-*` suites enable the Codeception helpers in
`tests/_support/Helper/` (`Palette`, `GlobalEditorStyles`); tests call them
through `$this->tester`.

## CI

CI runs the steps above and both `integration-*` suites in the `integration` job of
`.github/workflows/tests.yml`. The theme ref comes from the workflow's
`kadence_theme_git_ref` input on a manual run, else the
`KADENCE_THEME_GIT_REF` repository variable, else `release/fse`.

### Stored expectations

`tests/_data/global-editor-styles/` holds the editor CSS each site shape
produces. When a change to that CSS is intended, update the matching file in
the same commit.
