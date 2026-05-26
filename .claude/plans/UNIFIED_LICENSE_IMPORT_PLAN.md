# Premium import failures under unified (Harbor) licenses — plan

## Problem

Customers with an active LiquidWeb **unified license key** (Harbor) see these errors when trying to import premium content (e.g., the Pricing Table 11 pattern) from the Kadence pattern library:

- *"Error importing because of license validation, please verify your license key is valid and activated"*
- *"Error invalid_license: invalid or expired license key"*

The errors appear even though the license is genuinely active. Symptoms attributed to "Custom Icons not working" are incidental: the icons live inside the premium pattern payload, and the failure is at the pattern-fetch step, not the icon-render step.

## Root cause

The plugin's helper `kadence_blocks_get_current_license_key()` (`includes/helper-functions.php:157`) only looks up legacy StellarWP Uplink keys (`kadence-blocks-pro`, `kadence-creative-kit`, `kadence-blocks`). For unified-only customers, all three return empty, so the helper returns an empty string.

That empty value is then sent as `api_key=` in the query string to the remote pattern server. The remote server's license validator (SureCart-based) sees no key, rejects the request as `invalid_access`, and the plugin surfaces the error message above.

A sibling helper, `kadence_blocks_is_license_authorized()` (`includes/helper-functions.php:248`), already does the correct dual-check (legacy → Harbor `lw_harbor_is_product_license_active( 'kadence' )`). The same fallback was simply not applied to key retrieval.

---

## What this API request is gating

The `api_key` parameter is attached only when `library` is one of `templates | section | pages | template` (`class-kadence-blocks-prebuilt-library-rest-api.php:1378, 2306, 2362`).

### Features that break for unified customers

| # | UI surface | `library` value | Server | What breaks |
|---|---|---|---|---|
| 1 | Pattern Library → **Patterns** tab (premium patterns, e.g. Pricing Table 11) | `section` | `patterns.startertemplatecloud.com/wp-json/kadence-cloud/v1/single` (and `/get`, `/categories`) | Browsing, category list, **and** single-pattern import |
| 2 | Pattern Library → **Pages** tab (premium prebuilt pages) | `pages` | `patterns.startertemplatecloud.com/wp-json/kadence-cloud/v1/pages` (and `/pages-categories`) | Same as #1, for full pages |
| 3 | **Starter Templates** (full-site demo imports) | `templates` | `api.startertemplatecloud.com/wp-json/kadence-starter/v1/get/` | Items marked `pro=true` are still listed but content is stripped, so import returns empty |
| 4 | AI credits balance display | n/a (separate endpoint) | `content.startertemplatecloud.com/wp-json/kadence-credits/v1/get-remaining` | Credit count fails to load — cosmetic only, AI is already disabled for Harbor-only customers (`Harbor_Provider.php:57-63`) |

### Features NOT gated by this `api_key` (still work today for unified customers)

- **Premium blocks themselves** (Info Box, Pricing Table, Countdown, etc.) — ship inside Kadence Blocks Pro, not via the API.
- **Custom Icons (kbcustom set)** — bundled in `includes/icons-kbcustom-array.php`; the bug report's framing is misleading.
- **Kadence AI generation** — uses `X-Prophecy-Token` auth, and is already gated off for Harbor-only customers.
- **Customer-hosted Kadence Cloud libraries** — use a per-library access key set in the Cloud plugin admin, independent of product license.
- **Core/free patterns and free starter templates** — no `api_key` required server-side.

---

## Current flow

```
Editor click "Import Pricing Table 11"
  ↓
JS: getPattern('section', ...) in src/plugins/prebuilt-library/data-fetch/get-async-data.js
  ↓
WP REST: /kb-design-library/v1/get_pattern_content   (in-plugin proxy)
  ↓
class-kadence-blocks-prebuilt-library-rest-api.php
  - get_license_keys()  →  kadence_blocks_get_current_license_data()
                        →  kadence_blocks_get_current_license_key()
                             ↳ checks Uplink only — returns "" for unified customers
  - sends ?api_key=<empty>&site=...&id=... to remote
  ↓
Remote: patterns.startertemplatecloud.com/wp-json/kadence-cloud/v1/single
  - stellarwp/kadence-cloud :: check_access()
       ↳ apply_filters('kadence_cloud_rest_request_access', false, $key, $request)
            ↳ stellarwp/kadence-cloud-surecart-license validator
                 ↳ SureCart::validate($key) → null → return false
  - returns WP_Error('invalid_access')
  ↓
Plugin surfaces error to user
```

---

## Proposed plugin-side fix (`stellarwp/kadence-blocks`)

**Primary change:** add a Harbor fallback in `kadence_blocks_get_current_license_key()`.

```php
function kadence_blocks_get_current_license_key() {
    $blocks_pro_key = class_exists( 'Kadence_Blocks_Pro' ) ? get_license_key( 'kadence-blocks-pro' ) : '';
    if ( ! empty( $blocks_pro_key ) ) {
        return $blocks_pro_key;
    }
    $creative_kit_key = class_exists( 'KadenceWP\CreativeKit\Core' ) ? get_license_key( 'kadence-creative-kit' ) : '';
    if ( ! empty( $creative_kit_key ) ) {
        return $creative_kit_key;
    }
    $legacy_key = get_license_key( 'kadence-blocks' );
    if ( ! empty( $legacy_key ) ) {
        return $legacy_key;
    }
    // Fall back to the unified Harbor license key for Harbor-only customers.
    if ( function_exists( 'lw_harbor_get_unified_license_key' ) ) {
        $unified_key = lw_harbor_get_unified_license_key();
        if ( ! empty( $unified_key ) ) {
            return $unified_key;
        }
    }
    return '';
}
```

**No `license_type` hint needed.** LWSW unified keys are self-describing — every unified key starts with the `LWSW-` prefix — so the server can dispatch by inspecting the key value itself. No extra query parameter required.

**Note on the product slug:** `kadence_blocks_get_current_product_slug()` (`helper-functions.php:172`) currently returns `'kadence-blocks'` as a fallback when no Uplink key is found, which is fine for Harbor customers. No change needed there unless the server-side validator needs `'kadence-blocks-pro'` to authorize Pro content; if so, add a Harbor branch that returns the matching slug.

---

## Proposed server-side fix

Legacy and unified customers now share the **same portal**, but the portal exposes **two distinct licensing APIs** — one for legacy keys (replacing what SureCart at `api.surecart.com` used to serve) and one for unified LWSW keys. Keys are format-distinguishable: every unified key starts with the `LWSW-` prefix (see `Harbor/Licensing/Registry/Product_Registry.php:14` and `License_Key::is_valid_format()`); legacy keys do not. The server can therefore dispatch by inspecting the incoming key:

- Starts with `LWSW-` → call the **unified** licensing API (`https://licensing.nexcess.com`, products/catalog endpoint).
- Otherwise → call the **legacy** licensing API on the new portal (URL TBD — see open questions).

The unified API is what the plugin itself already uses (`vendor/vendor-prefixed/stellarwp/harbor/src/Harbor/Licensing/License_Manager.php:442` calls `$this->client->products()->catalog( $key, $domain )`), so the server side can install the same Harbor PHP SDK (`stellarwp/harbor` Composer package) and reuse the same `Products` client. The catalog response is a `Product_Collection` keyed by product slug — that's the same data the entitlement check needs, no separate "is this key entitled to X" call required.

The legacy API replaces SureCart entirely. The existing `stellarwp/kadence-cloud-surecart-license` plugin uses a filterable base URL (`apply_filters( 'surecart_licensing_endpoint', 'https://api.surecart.com' )` at `kadence-cloud-surecart-license-client.php:229`), so depending on whether the new portal's legacy API is wire-compatible with SureCart's `/v1/public/licenses/{key}` + `/v1/public/activations` shape, the migration is either (a) a one-line filter override pointing at the new URL, or (b) a fork of the client to adapt to a different route shape. See open questions for the URL and shape.

Two distinct servers serve different libraries. Each needs its own change.

### Server A — `patterns.startertemplatecloud.com` (covers libraries `section`, `pages`, and their categories)

Repos involved:

- `stellarwp/kadence-cloud` — registers routes (`/get`, `/info`, `/categories`, `/single`, `/single-pattern`, `/patterns`, `/search`) and runs the `kadence_cloud_rest_request_access` filter (`kadence-cloud-rest-controller.php:757`).
- `stellarwp/kadence-cloud-surecart-license` — existing validator hooked on that filter, currently validates against SureCart (`kadence-cloud-surecart-license.php:269`). Will be repointed at the new portal's **legacy** API.
- `stellarwp/kadence-cloud-pages` — same pattern for `pages`/`pages-categories` routes.

**Change 1 — repoint the legacy validator at the new portal.** In `stellarwp/kadence-cloud-surecart-license`, override the `surecart_licensing_endpoint` filter (or hardcode the new URL — that filter is the existing extension point at `kadence-cloud-surecart-license-client.php:229`). If the new portal's legacy API is shape-compatible with SureCart's `GET /v1/public/licenses/{key}` and `POST /v1/public/activations`, this is a single-line change. If routes/payloads differ, fork the client class into a `Portal_Legacy_Client` adapter (same public methods, new wire shape) and swap the `new Client( $public_token )` instantiations at lines 98, 157, 236.

**Change 2 — add a sibling plugin for unified keys.** Create `stellarwp/kadence-cloud-harbor-license` that hooks `kadence_cloud_rest_request_access`, detects LWSW-prefixed keys, and validates them against the unified licensing API. Structure mirrors the (now-repointed) SureCart plugin:

```php
function kadence_cloud_harbor_check_cloud_access( $access, $key, $request ) {
    if ( $access ) {
        return $access; // Another handler already authorized.
    }
    if ( empty( $key ) || strpos( $key, 'LWSW-' ) !== 0 ) {
        // Not an LWSW unified key — let the legacy portal handler try.
        return $access;
    }

    $domain = preg_replace( '(^https?://)', '', (string) $request->get_param( 'site' ) );

    try {
        // Same SDK the plugin uses client-side. Talks to https://licensing.nexcess.com.
        $catalog = ( new \KadencePatternHub\Harbor\Client() )
            ->products()
            ->catalog( $key, $domain );
    } catch ( \KadencePatternHub\Harbor\Exceptions\NotFoundException $e ) {
        return false; // Definitively invalid — block.
    } catch ( \Throwable $e ) {
        // Soft-fail: licensing API down or transient. Don't grant access, but
        // also don't block legacy keys from being tried by later filters.
        error_log( '[kadence-cloud-harbor-license] catalog error: ' . $e->getMessage() );
        return $access;
    }

    // Product-level entitlement check — equivalent to SureCart's sc_license_products.
    $required_product_id = kadence_cloud_harbor_required_product_for_request( $request ); // e.g. 'kadence-blocks-pro'
    foreach ( $catalog->products->all() as $product ) {
        if ( $product->id === $required_product_id ) {
            return true;
        }
    }

    return false;
}
add_filter( 'kadence_cloud_rest_request_access', 'kadence_cloud_harbor_check_cloud_access', 9, 3 );
```

Priority `9` lets Harbor run before the legacy-portal handler's priority-`10`. Unified keys short-circuit on success; non-LWSW keys fall through untouched to the legacy validator. Legacy customers see no behavior change beyond the URL swap in Change 1.

The legacy validator already early-returns when `$access === true` (`kadence-cloud-surecart-license.php:197-199`), so this composes cleanly without touching it.

Apply the same plugin/handler to `stellarwp/kadence-cloud-pages` if it registers its own copy of the filter callback list.

**Caching note:** the catalog API call is a network round trip per pattern import. Consider caching the validated `key → product collection` mapping in a transient (5–15 min TTL) keyed on the license key, similar to how the plugin caches its own license auth at `helper-functions.php:268`. The licensing client already has throttling guards (`License_Manager.php:153`) but those are local to the calling site — the pattern server fielding many requests should add its own cache layer.

### Server B — `api.startertemplatecloud.com` (covers `library=templates`, full-site starter imports)

Repo: `stellarwp/kadence-starter-api`. This server does **not** use the filter pattern. License validation lives inline in `kadence-starter-api-rest-controller.php:162-249`, which currently has two branches:

1. iThemes API check (line 174-219) for legacy iThemes-bundled licenses.
2. `Kadence_Starter_License_Relay->validate_license()` (line 221-227) for everything else.

**Proposal:** add a third branch *before* the relay call, around line 220, that detects LWSW keys and calls the licensing API. Sketch:

```php
} else if ( strpos( $api_key, 'LWSW-' ) === 0 ) {
    $domain = preg_replace( '(^https?://)', '', (string) $site_url );
    try {
        $catalog = ( new \KadencePatternHub\Harbor\Client() )
            ->products()
            ->catalog( $api_key, $domain );
        foreach ( $catalog->products->all() as $product ) {
            if ( $product->id === 'kadence-blocks-pro' ) { // or whichever slug gates Pro starters
                $member = true;
                break;
            }
        }
    } catch ( \Throwable $e ) {
        // Soft-fail: leave $member = false. The user gets the free-tier view.
        error_log( '[kadence-starter-api] LWSW validation error: ' . $e->getMessage() );
    }
} else {
    // Existing relay path for legacy keys (will also need to be repointed
    // at the new portal's legacy API in step Change 1 above — same URL swap
    // as Server A, applied inside Kadence_Starter_License_Relay).
    $relay = new Kadence_Starter_License_Relay( $api_key, /* ... */ );
    // ...existing logic...
}
```

Smaller surface than Server A, but invasive — modifies an existing file rather than adding a sibling plugin. If a cleaner extension point is preferred, introduce a `kadence_starter_api_license_validated` filter and refactor existing branches to use it (larger change, easier to maintain).

---

## Open questions

1. **Legacy portal API URL.** What's the base URL of the new portal's legacy licensing API (the SureCart replacement)? Needed for Change 1 in Server A and the equivalent change inside `Kadence_Starter_License_Relay` for Server B.
2. **Legacy portal API shape.** Is the new portal wire-compatible with SureCart's existing routes (`GET /v1/public/licenses/{key}` returning `{ id, status, product }` and `POST /v1/public/activations` consuming `{ license, fingerprint, name }`), or does it require a route/payload adapter? Determines whether the migration is a filter-only change or a client fork.
3. **Legacy portal auth model.** Still bearer-token via the same `public_token` semantics, or different credential format? If different, the `sc_license_public_token` storage and the `kadence_pattern_hub_get_public_token()` bootstrap path (`kadence-cloud-surecart-license.php:276-302`) need updating.
4. **`product` field for legacy keys.** Does the legacy API on the new portal return the same product-id namespace as SureCart did? The validator gates on configured `sc_license_products` (`kadence-cloud-surecart-license.php:246-256`); if IDs have changed, the per-store configuration on the patterns server has to be rewritten alongside the URL swap.
5. **Product slug for unified (LWSW) keys.** The catalog response from the unified licensing API at `licensing.nexcess.com` returns a `Product_Collection`. What's the canonical product `id` for "Kadence Blocks Pro" / the bundle that grants premium-pattern access? The Harbor handler needs the equivalent canonical IDs to gate on (parallel to legacy's `sc_license_products` list).
6. **Per-site activation for unified keys.** The legacy path calls `$client->is_active( $license_object->id, $fingerprint, $product_name )` (`kadence-cloud-surecart-license.php:259`) to enforce per-site activations. The unified catalog endpoint doesn't appear to consume a seat — it just looks up entitlements. Is per-domain activation enforced elsewhere in the unified licensing flow, or are unified entitlements seat-unlimited at the validation layer? If activation needs to happen, the handler may need a different endpoint (something like `products/activate` rather than `products/catalog`).
7. **Cloud Pages and Page Wizard.** `stellarwp/kadence-cloud-pages` and `stellarwp/kadence-cloud-page-wizard` also register routes that may or may not run through the same filter. Confirm whether the Server A handlers (both legacy URL swap and Harbor sibling plugin) cover them automatically or if each repo needs its own registration.
8. **Caching strategy.** Both API calls add latency to every pattern import. Plugin-side caches license auth for the lifetime of the request (`helper-functions.php:268` static cache); the server side should probably cache validated `key → entitlement` mappings for ~5–15 min via transient. What's the cache-invalidation expectation when an entitlement is revoked mid-window (e.g., subscription cancelled)? An acceptable lag, or do we need an invalidation webhook from the portal?
9. **Throttling on the portal.** What's the rate limit / acceptable QPS the pattern server can hit each of the two portal APIs with? Pattern imports are user-driven so traffic is bursty; if either API has aggressive limits, the cache TTL needs to be tuned accordingly.

---

## Rollout / verification

1. **Plugin-side fix lands first**, behind no flag — for SureCart customers it's a no-op (the legacy keys still resolve first), so there's no regression risk.
2. **Before the server-side change ships**, the plugin fix alone will *not* unblock unified customers (the server still rejects unified keys). It also won't make things worse — they're already broken.
3. **Suggested rollout order on the server side** — two changes interact, so sequencing matters:
   1. Repoint the legacy validator at the new portal (Change 1). Ship this independently and verify legacy customers still import correctly. This is the higher-risk step because every legacy customer is affected on day one; ideally gate the URL behind a per-store override or a feature flag while verifying.
   2. Add the Harbor sibling plugin (Change 2). Lower risk — it only takes effect for LWSW-prefixed keys, so legacy customers can't be regressed by it. Unified customers stay broken (same as today) until this lands.
4. **After both server-side changes**, verify:
   - Premium pattern import works for a unified-license test site (Pricing Table 11 is a good canary because it's the user-reported case).
   - Premium page import works (Pattern Library → Pages tab).
   - Full-site starter template import works (Server B path, both legacy and unified key holders).
   - Legacy customers still import successfully via the new portal URL (regression check).
   - Unlicensed sites still see a clear error (failure-mode check).
5. **Logging.** During rollout, log on the server side which validator authorized each request (`harbor` for LWSW-prefixed, `legacy-portal`, `local_access_keys`). Log API errors at WARN so transient portal outages are visible without being treated as customer-side license failures.
