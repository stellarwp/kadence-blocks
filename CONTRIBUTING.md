# Contributing to Kadence Blocks

This guide covers how to set up the plugin for local development and build it from source.

## Prerequisites

- **PHP** 7.4+ and **[Composer](https://getcomposer.org/)** — for PHP dependencies (managed with Strauss for namespace prefixing).
- **[Bun](https://bun.sh/)** — for JavaScript dependencies and build scripts. This project has migrated from npm to Bun.
- A **GitHub Personal Access Token** — required to install the `@stellarwp`-scoped package, which is hosted on GitHub Packages rather than the public npm registry.

## 1. Create a GitHub auth token

The `@stellarwp` scope resolves to GitHub Packages (`npm.pkg.github.com`), which requires authentication. See `bunfig.toml` for the scope configuration.

1. Create a **classic** Personal Access Token at https://github.com/settings/tokens/new with the **`read:packages`** scope.
2. Create a `.env` file in the root of the plugin and add your token:

   ```
   BUN_AUTH_TOKEN=your_token_here
   GITHUB_TOKEN=your_token_here
   ```

   Bun reads `BUN_AUTH_TOKEN` from this `.env` file when authenticating to the `@stellarwp` registry. `GITHUB_TOKEN` (the same token works) authenticates the `github:stellarwp/...` tarball fetches for the `@kadence/*` packages — without it those downloads hit GitHub's unauthenticated rate limit and fail with 504s. Do not commit `.env`.

## 2. Install PHP dependencies

```bash
composer install
```

This installs Composer packages and runs the Strauss post-install steps that prefix vendor namespaces into `vendor/vendor-prefixed/`.

> **Note:** Never edit files in `vendor/vendor-prefixed/` directly — they are regenerated on every `composer install`.

## 3. Install JavaScript dependencies

> **Migrating from a previous npm build?** If you've built this plugin with npm before, delete the existing `node_modules` directory first so Bun installs cleanly:
>
> ```bash
> rm -rf node_modules
> ```

```bash
bun install
```

The `postinstall` step builds the `@kadence/*` packages (`helpers`, `icons`, `components`) automatically.

> **Why this build step exists:** The `@kadence/*` packages are pulled directly from GitHub (see the `github:stellarwp/...` entries in `package.json`), and those repos ship **source only** — not the compiled `dist/` output that Kadence Blocks imports. So after install they must be transpiled with Babel. The `build:packages` script does this, but only for packages whose `dist/cjs/index.js` is missing (already-built packages are skipped).
>
> The script uses `npm install --omit=prod` rather than `bun install` for this one step on purpose: `@kadence/helpers` declares `@kadence/icons` as a **production git dependency**, and a full install would try to git-clone it (which fails / rate-limits in CI). `--omit=prod` installs only the Babel devDependencies needed to transpile and skips that git dependency entirely.

## 4. Build the assets

For active development (webpack watch + gulp watch, run concurrently):

```bash
bun run start
```

For a one-off production build:

```bash
bun run build
```

## Useful scripts

| Command | Description |
|---|---|
| `bun run start` | Watch mode — rebuilds JS/CSS on change |
| `bun run build` | Production build (`wp-scripts build` + `gulp build`) |
| `bun run build-wp` | Webpack build only |
| `bun run build-gulp` | Gulp build only (legacy JS/CSS) |
| `bun run lint-js` | Lint JavaScript |
| `bun run lint-js-fix` | Lint and auto-fix JavaScript |
| `bun run format` | Format source files |
| `composer lint` | PHP CodeSniffer |
| `composer phpstan` | PHP static analysis |

## Troubleshooting

- **`401 Unauthorized` on `bun install`** — your `BUN_AUTH_TOKEN` is missing, expired, or lacks the `read:packages` scope. Confirm `.env` exists in the plugin root and the token is valid.
- **`@kadence/*` imports fail during the build** — re-run `bun install` so the `postinstall` step rebuilds the local packages, and verify the `node_modules/@kadence/*` directories were fetched.
