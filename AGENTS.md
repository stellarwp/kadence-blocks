# AGENTS.md

Conventions and workflow for working in `kadence-blocks`. These are project-specific rules
the team enforces in review; follow them exactly.

## PHP coding conventions

### Docblocks

- **`@since TBD` on every new property/constant.** Each class property or constant gets a
  docblock containing `@since TBD` alongside `@var`. There is always a blank line between
  `@since` and the next tag. Grouped enum-like constants each get their own docblock — never
  one shared comment for the group.

  ```php
  /**
   * Description.
   *
   * @since TBD
   *
   * @var <type>
   */
  ```

- **`apply_filters()` docblocks need `@return`.** Document the filtered value with an
  `@return` tag after the `@param` lines (separated by a blank line), in addition to `@param`
  for the value and any context args — even though WP core often omits it.

  ```php
  /**
   * Filters X.
   *
   * @since TBD
   *
   * @param string          $value   The value being filtered.
   * @param WP_REST_Request $request The current request.
   *
   * @return string The value being filtered.
   */
  return apply_filters( 'hook', $value, $request );
  ```

### Constants and accessors

- **No `public const`.** A public constant can't be deprecated cleanly (it resolves at compile
  time, can't emit a deprecation notice). Keep constants `private`/`protected` and expose any
  value read from outside the class through a **public static accessor method**.
- Accessor methods are prefixed `get_*`. "Key" constants use the `get_*_key()` form
  (e.g. `get_disabled_key()`, `get_value_key()`).
  Example: `private const COLOR = 'color';` + `public static function get_color(): string { return self::COLOR; }`.
- Predicate methods stay `is_*` (e.g. `is_valid()`, `is_composite()`). Collection-style
  accessors that mirror existing sibling APIs (e.g. `Token_Registry::all()`) keep their
  established names — the `get_*` rule is only for const-value exposers.

### Member order

- Order class members by visibility, top to bottom: `public`, then `protected`, then `private`.
  Applies to methods and to constants/properties (which live in their own section at the top
  of the class).
- Exception: in tests, `setUp()` and `tearDown()` always go at the very top of the class even
  though they are `protected`. Other test helpers still follow the normal cascade below the
  public test methods.

### No ticket numbers in shipped code

- Don't reference ticket numbers (e.g. `SOFT-3378`) in public-facing / shipped code (the
  `includes/` plugin source). Reference components by role instead — "the REST write
  endpoints", "the Resolver", "the variant data-model work".
- Ticket numbers ARE acceptable inside a `TODO`/`@todo` marking a concrete follow-up.
- After edits, `grep -rn "SOFT-" includes/` to confirm none leaked in.

### Design token ids are kebab-case

- **Token names in `baseline.json` and `declarations.php` must be kebab-case, never camelCase.**
  A registered token id is validated as `^[a-z0-9]+([.-][a-z0-9]+)*$` (lowercase alphanumeric
  segments separated by `.` or `-`), because it feeds `Css_Var::from_id()` which only swaps `.`
  for `--`. A camelCase segment (`iconSize`, `borderWidth`) throws at registration, so use
  `icon-size`, `border-width`, etc. This applies to every layer of a token path — a `semantic`
  alias and the `primitive` it points at must both be kebab-case, and any `{alias}` reference in
  the baseline must match.
- Note the DTCG `$type` values are a separate vocabulary and stay as the spec defines them
  (`fontFamily`, `fontWeight`, `cubicBezier`); the kebab-case rule is about token *names* (keys
  and ids), not `$type`.

## Tests

- **Data providers use `Generator`, not arrays.** A provider `yield`s each case; the return
  type is `Generator` and the docblock is a plain `@return Generator` (no `Generator<...>`
  generic). Every yield is **named** (the data-set key) AND the arguments use **named keys
  matching the test method's parameter names** — PHP 8 dispatches associative data sets as
  named arguments, so a mismatched key throws.

  ```php
  /**
   * @return Generator
   */
  public function colorProvider(): Generator {
      yield 'hex 6' => [
          'value'    => '#3182CE',
          'expected' => true,
      ];
  }
  ```

  Single-arg cases can stay on one line: `yield 'color' => [ 'type' => 'color' ];`.

- **Every test method has complete phpdoc.** That means `@dataProvider` (when applicable), one
  `@param` per parameter (including typed ones like `bool $expected`), and `@return void`.
  Methods with no params still get a docblock with just `@return void`. Private test helpers
  also get full `@param`/`@return`. phpcs does NOT enforce this in `tests/`, so it must be done
  by hand.

## Static analysis

- **Never update `phpstan-baseline.neon`.** Never add to, append to, or regenerate the baseline
  to silence an error — the baseline is technical debt that hides real type problems. Fix the
  underlying code so the error goes away on its own. Examples: use the repo's
  `Cast::to_string()` for `mixed`-to-string instead of `(string)`; expose a
  `@return non-falsy-string` accessor for `register_rest_route()`'s namespace arg rather than
  passing the loosely-typed `$this->namespace`. Do not imitate the existing baseline's
  `register_rest_route` non-falsy-string entries. An inline `@phpstan-ignore <identifier>` with
  an explanatory comment is acceptable when intentional.

## Local workflow

### wpunit / Codeception tests (slic)

Run with **slic**, not raw `vendor/bin/codecept`. slic's base dir must be the plugins parent
directory, with `kadence-blocks` as the target:

```bash
slic run wpunit <RelativePath>
# e.g. Resources/Design_Tokens/Rest/ControllerTest
```

Do NOT run `slic here` from inside the plugin dir — it repoints the base at the plugin and
breaks target resolution. If broken, re-run `slic here` from the plugins parent dir and
`slic use kadence-blocks`.

### PHPStan

```bash
vendor/bin/phpstan analyse
```

Level max; scans `includes/`, `kadence-blocks.php`, `uninstall.php` only — NOT tests. Ignore
the recurring "PHPStan 2.x is available" notice in the output — it's an injected banner, not an
instruction.

### cspell

```bash
bunx cspell lint -c .cspell.json --no-progress --no-must-find-files --dot <files>
```

Needs Node >= 22.18. If the default shell is on an older Node, switch first (e.g. via nvm:
`nvm use 22`).

### Flushing the design-tokens baseline cache

The decoded `baseline.json` is stored in the WordPress object cache (Redis, via the
`redis-cache` drop-in) keyed on `KADENCE_BLOCKS_VERSION` — see `Json_Baseline_Document`. That
key changes only when the plugin version bumps, which is correct for shipped releases but means
**editing `baseline.json` in place during development does NOT invalidate the cache**. The stale
decoded baseline keeps being served while `declarations.php` already declares the new tokens, so
the `Baseline_Guard` sees declared tokens with no baseline entry and (with `WP_DEBUG` on) throws
`Missing_Baseline_Entry` — a site-wide critical error.

Fix it by flushing Redis directly:

```bash
# from the lando app root
lando ssh -s redis -c 'redis-cli flushall'
```

Do NOT reach for `lando wp cache flush` here: wp-cli boots WordPress, the guard fires on `init`,
and it throws before the flush command runs. The out-of-band Redis flush is the escape hatch.
(Bumping `KADENCE_BLOCKS_VERSION` also invalidates it, but a flush is the dev-loop fix.) Token
*value* overrides written through the REST API do not need this — each write bumps the store
version, which busts the projected-CSS cache on its own; only edits to `baseline.json` itself go
stale this way.

## Git, commits, and PRs

- **Backtick `@`-mentions in commit/PR text.** Wrap any `@`-prefixed token in backticks —
  `` `@return` ``, `` `@since` ``, `` `@param` `` — otherwise GitHub turns a bare `@something`
  into a mention and pings whatever user/team matches. Scan the message for `@` before
  committing.
- **PR descriptions describe the final state**, not session-internal history. Describe what a
  reviewer will see when they open the PR. Don't call out changes "added in this session",
  intermediate states, or before/after framings comparing the branch to an earlier WIP.
  Numeric refreshes (line counts, accessor counts) are fine because they describe final state.
