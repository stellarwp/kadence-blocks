# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kadence Blocks is a comprehensive WordPress plugin that provides advanced Gutenberg blocks and design controls. It includes 45+ custom blocks, advanced typography and color controls, responsive settings, and dynamic content features.

## Essential Commands

### Development
```bash
# Start development (watches both webpack and gulp)
npm run start

# Build for production
npm run build

# Build specific parts
npm run build:css      # Only CSS
npm run build:gulp     # Only Gulp tasks
npm run build:scripts  # Only JavaScript
```

### Testing
```bash
# Run all tests
composer test

# Run specific test suites
composer wpunit                    # Unit tests only
composer acceptance                # Acceptance tests only
composer phpunit -- --filter Test  # Run specific test

# Individual test files
vendor/bin/codecept run wpunit tests/wpunit/ExampleTest.php
```

### Code Quality
```bash
# JavaScript linting
npm run lint-js
npm run lint:fix  # Auto-fix JS issues

# PHP code standards
composer phpcs
composer phpcbf  # Auto-fix PHP issues

# PHP compatibility checks (7.4 - 8.4)
composer php74-compat
composer php80-compat
composer php81-compat
composer php82-compat
composer php83-compat
composer php84-compat
```

### Release & Distribution
```bash
# Create distribution build
npm run dist

# Update version across all files
npm run update-version
```

## Architecture & Code Structure

### Directory Structure
- `src/` - React/JavaScript source for blocks and components
  - `blocks/` - Individual block implementations
  - `components/` - Shared React components
  - `plugins/` - Gutenberg editor plugins
  - `packages/` - Shared functionality packages
  
- `includes/` - PHP backend code
  - `blocks/` - PHP block registration and server-side rendering
  - `rest-api/` - REST API endpoints
  - `blocks-helper-uploader.php` - Main plugin class and initialization
  
- `dist/` - Built JavaScript and CSS files (gitignored)
- `vendor/` - PHP dependencies via Composer (gitignored, prefixed with Strauss)

### Key Architectural Patterns

1. **Block Registration**: Each block extends `AbstractBlock` or `AbstractBlockType` base classes
   - PHP registration in `includes/blocks/class-kadence-blocks-*.php`
   - React components in `src/blocks/*/index.js`
   - Server-side rendering via `render_callback` when needed

2. **REST API Structure**: Endpoints extend `AbstractRestController`
   - Located in `includes/rest-api/`
   - Namespaced under `/kb-design-library/v1/` or `/kb-mailerlite/v1/`
   - Authentication via WordPress capabilities

3. **Asset Loading**: Performance-optimized loading system
   - Only loads CSS/JS for blocks actually used on the page
   - Separate frontend and editor assets
   - Dynamic style generation for responsive controls

4. **Dependency Injection**: Uses lucatume/di52 container
   - Services registered in `includes/service-providers/`
   - Accessed via `kadence_blocks()` function

5. **Dynamic Content**: Advanced dynamic content system
   - Post fields, custom fields, ACF integration
   - Conditional display logic
   - Query loops and filtering

### Critical Files

- `kadence-blocks.php` - Main plugin file
- `includes/class-kadence-blocks.php` - Core plugin class
- `includes/init.php` - Block registration and initialization
- `webpack.config.js` - Build configuration
- `gulpfile.js` - Additional build tasks

### Testing Approach

Tests use Codeception with WP Browser for WordPress integration:
- Unit tests mock WordPress functions
- Acceptance tests run against full WordPress installation
- Test database is reset between tests
- Fixtures in `tests/_data/`

### Performance Considerations

- Blocks are lazy-loaded on demand
- CSS is generated dynamically and cached
- REST API responses are cached where appropriate
- Assets are minified in production builds
- Conditional loading based on block usage

### WordPress Integration Points

- Hooks into `init`, `enqueue_block_editor_assets`, `enqueue_block_assets`
- Custom post types for Forms and Design Library
- Integration with WordPress REST API
- Compatibility with Classic Editor via shortcodes
- Gutenberg feature detection for progressive enhancement

### Common Development Tasks

When implementing new blocks:
1. Create PHP class extending `AbstractBlock` in `includes/blocks/`
2. Add React component in `src/blocks/[block-name]/`
3. Register in `includes/init.php`
4. Add to `$block_names` array in main plugin class

When adding REST endpoints:
1. Create controller extending `AbstractRestController`
2. Place in `includes/rest-api/`
3. Register in appropriate service provider

When modifying build process:
1. Webpack config for JS/React: `webpack.config.js`
2. Gulp tasks for other assets: `gulpfile.js`
3. Both are run together with `npm run start`