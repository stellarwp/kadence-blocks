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

**The patterns server runs `stellarwp/kadence-blocks-plugin-endpoints`** as a WordPress plugin to interact with the licensing API. Its `License_Relay` class (`inc/KadenceBlocksPluginEndpoints/API/License_Relay.php`) is the actual validator behind the user-reported error: the exact text *"Invalid or expired license key."* originates at `inc/KadenceBlocksPluginEndpoints/API/SVG_API_Endpoint.php:140-143`, returned as a `WP_Error` with code `invalid_license`. That's the same plugin that needs to learn about LWSW keys.

`License_Relay` today targets a single licensing server:

- **Base URL:** `https://licensing.kadencewp.com` (`License_Relay.php:34`, overridable via `STELLARWP_UPLINK_ORIGIN_BASE_URL` constant or `stellarwp/uplink_origin/base_url` filter)
- **API root:** `/api/stellarwp/v3/` (`License_Relay.php:43`)
- **Validate endpoint:** `GET https://licensing.kadencewp.com/api/stellarwp/v3/license/validate?key=…&plugin=kadence-blocks-pro&domain=…` (`validate_license()` at line 96)
- Request body is signed via `STELLARWP_UPLINK_SIGNED_SECRET` and dispatched through `request()` at line 173

That endpoint is the **legacy** licensing API on the new portal — no SureCart-URL swap is required because SureCart isn't on the request path here. (The `stellarwp/kadence-cloud-surecart-license` plugin still exists upstream of `kadence_cloud_rest_request_access`, but the failure-mode trace shows `License_Relay` is what surfaces the error users are seeing.)

The change: extend `License_Relay` to dispatch by key format. LWSW keys are self-describing — they start with the `LWSW-` prefix (see `Harbor/Licensing/Registry/Product_Registry.php:14` and `License_Key::is_valid_format()`). When the incoming key matches that prefix, call the **unified** licensing API instead of `licensing.kadencewp.com`; otherwise keep today's signed-Uplink behavior intact.

**Unified API endpoint** (the plugin's `License_Manager::call_products_api()` resolves to this URL):

```
GET https://licensing.nexcess.com/api/liquidweb/v1/products
    ?license_key=<LWSW-xxxx-...>
    &domain=<site-domain-without-scheme>
```

Returns a JSON array of catalog entries, each keyed by `product_slug` (see `vendor/vendor-prefixed/stellarwp/harbor/src/Harbor/Catalog/Clients/Http_Client.php:122`). Auth is `optionalToken()` per `ProductsResource::catalog()` — likely no auth needed for this lookup, but worth confirming (see open questions). HTTP 404 = unknown key (block); 200 with an entitled product matching the gate = grant; 200 without the entitled product = block.

**Why direct HTTP, no SDK install:** the pattern server is a backend service, not a customer WordPress site, so the Harbor / `stellarwp/licensing-api-client` SDKs (which exist to manage on-site license state, retries, throttling, repository persistence) are unnecessary weight. `License_Relay` already uses `wp_remote_request` for the legacy server; adding a second `wp_remote_get` branch for the unified server keeps the dependency surface minimal and the behavior auditable. The endpoint shape above was extracted by tracing the SDK to its HTTP layer.

Two distinct servers serve different libraries. Each needs its own change.

### Server A — `patterns.startertemplatecloud.com` (covers libraries `section`, `pages`, and their categories)

Repos involved:

- `stellarwp/kadence-blocks-plugin-endpoints` — **the plugin to change**. Owns `License_Relay` (the actual validator) and the endpoints whose `invalid_license` error matches the user-reported message.
- `stellarwp/kadence-cloud` — registers the underlying pattern routes (`/get`, `/info`, `/categories`, `/single`, `/single-pattern`, `/patterns`, `/search`) and exposes the `kadence_cloud_rest_request_access` filter (`kadence-cloud-rest-controller.php:757`). No change required unless a separate gate also needs LWSW awareness — see open questions.
- `stellarwp/kadence-cloud-pages` — same shape for `pages`/`pages-categories` routes; same answer.

**Change — extend `License_Relay` to dispatch by key format.** Add an LWSW branch inside `validate_license()` (`inc/KadenceBlocksPluginEndpoints/API/License_Relay.php:96`) that calls the LiquidWeb licensing API for `LWSW-`-prefixed keys and returns a result shape compatible with the existing consumers (`SVG_API_Endpoint.php:135` expects an object with a `results[0]` array carrying an `api_invalid` flag — matches the legacy server's response). Non-LWSW keys keep today's signed-Uplink path untouched.

Sketch:

```php
const LWSW_API_BASE         = 'https://licensing.nexcess.com';
const LWSW_API_PATH         = '/api/liquidweb/v1/products';
const LWSW_REQUIRED_PRODUCT = 'kadence-blocks-pro'; // canonical product_slug — TBD, see open questions

public function validate_license( $plugin_slug = 'kadence-blocks-pro' ) {
    if ( strpos( $this->key, 'LWSW-' ) === 0 ) {
        return $this->validate_lwsw_license( $plugin_slug );
    }

    // Existing signed-Uplink path — unchanged.
    $args = [
        'key'               => $this->key,
        'plugin'            => $plugin_slug,
        'domain'            => $this->site_domain,
        'wp_version'        => '',
        'multisite'         => '',
        'network_activated' => '',
        'active_sites'      => '',
        'origin'            => 'kadence',
    ];
    return $this->get( 'license/validate', $args, '/api/plugins/v2/' );
}

private function validate_lwsw_license( string $plugin_slug ): \stdClass {
    $url = add_query_arg(
        [
            'license_key' => $this->key,
            'domain'      => preg_replace( '(^https?://)', '', $this->site_domain ),
        ],
        self::LWSW_API_BASE . self::LWSW_API_PATH
    );

    $response = wp_remote_get(
        $url,
        [ 'timeout' => 10, 'headers' => [ 'Accept' => 'application/json' ] ]
    );

    // Shape the response to match what existing consumers expect:
    // an object with ->results[0]->api_invalid (truthy = invalid).
    $result = new \stdClass();
    $entry  = new \stdClass();
    $entry->api_invalid = '';
    $result->results = [ $entry ];

    if ( is_wp_error( $response ) ) {
        // Soft-fail: don't mark invalid on transient errors, but also don't
        // grant access. Empty results signal "could not validate".
        $result->results = [];
        return $result;
    }

    $status = (int) wp_remote_retrieve_response_code( $response );
    if ( $status === 404 ) {
        $entry->api_invalid = 'invalid_license';
        return $result;
    }
    if ( $status < 200 || $status >= 300 ) {
        $result->results = [];
        return $result;
    }

    $body = json_decode( wp_remote_retrieve_body( $response ), true );
    if ( ! is_array( $body ) ) {
        $result->results = [];
        return $result;
    }

    // Map plugin_slug → required product_slug (only one mapping today; expand as needed).
    $required = ( $plugin_slug === 'kadence-blocks-pro' ) ? self::LWSW_REQUIRED_PRODUCT : $plugin_slug;
    foreach ( $body as $entry_data ) {
        if ( ! empty( $entry_data['product_slug'] ) && $entry_data['product_slug'] === $required ) {
            return $result; // api_invalid stays empty → valid.
        }
    }

    // Authenticated but not entitled to this product.
    $entry->api_invalid = 'product_not_entitled';
    return $result;
}
```

This keeps the public contract of `License_Relay::validate_license()` stable so existing callers (`SVG_API_Endpoint.php:135` and any other endpoint added to this plugin) work without modification. Existing legacy customers see no behavior change — the LWSW branch only fires when the key prefix matches.

**Caching note:** add a transient cache around the `wp_remote_get` call, keyed on `sha1( $this->key . '|' . $this->site_domain )` with a 5–15 min TTL so repeat imports from the same site don't re-hit the licensing service. Cache successful entitlement checks and 404s (definitive); do not cache 5xx / transient failures.

### Server B — `api.startertemplatecloud.com` (covers `library=templates`, full-site starter imports)

Repo: `stellarwp/kadence-starter-api`. Owns its own `Kadence_Starter_License_Relay` class with the same `validate_license` shape as Server A's `License_Relay`. License validation lives inline in `kadence-starter-api-rest-controller.php:162-249`, which currently has two branches:

1. iThemes API check (line 174-219) for legacy iThemes-bundled licenses.
2. `Kadence_Starter_License_Relay->validate_license()` (line 221-227) for everything else.

**Proposal:** add the same LWSW dispatch inside `Kadence_Starter_License_Relay->validate_license()` (mirroring the Server A change). The caller at line 221 stays unchanged; the relay class internally routes LWSW keys to the LiquidWeb API and returns the same `results[0]->api_invalid` shape the caller already inspects.

**Optional cleanup:** the two relay classes (Server A's `License_Relay` and Server B's `Kadence_Starter_License_Relay`) are now logically identical apart from constants. Worth extracting into a shared Composer package (e.g., `stellarwp/kadence-license-relay`) so the LWSW dispatch lives in one place. That's a larger refactor — fine to ship the duplicated change first and consolidate later.

---

## Open questions

1. **Unified API auth.** The catalog endpoint is called with `optionalToken()` in the SDK (`ProductsResource.php:90`), suggesting auth is not required. Is that actually the case in production at `licensing.nexcess.com/api/liquidweb/v1/products`, or do the pattern + starter API servers need to be provisioned with a service token / Bearer credential to call it? If a token is needed, where does it come from and how is it rotated?
2. **Product slug for unified (LWSW) keys.** The catalog response is a JSON array of entries each carrying a `product_slug` field. What's the canonical `product_slug` for "Kadence Blocks Pro" / the bundle that grants premium-pattern access? The handler needs the equivalent canonical slugs to gate on. The sketch hardcodes `kadence-blocks-pro` as a placeholder; mapping table may need to grow if other plugin slugs are passed in (`kadence-creative-kit`, etc.).
3. **Per-site activation for unified keys.** The catalog endpoint just looks up entitlements — it doesn't appear to consume a seat. Is per-domain activation enforced elsewhere in the unified licensing flow, or are unified entitlements seat-unlimited at the validation layer? If activation needs to happen, the handler may need a separate call (something like `/activations`) before granting access.
4. **Response-shape compatibility.** The sketch wraps the LWSW response in an object that mimics the legacy `results[0]->api_invalid` shape so `SVG_API_Endpoint.php:147-156` keeps working. Are there other consumers of `License_Relay->validate_license()` outside the SVG endpoint that inspect different fields of the response (e.g., expiration date, product list)? If so, those fields need to be populated from the catalog response too.
5. **`kadence_cloud_rest_request_access` gate.** `stellarwp/kadence-cloud` exposes this filter, and `stellarwp/kadence-cloud-surecart-license` is hooked on it. Does that filter actually fire on pattern-content requests today, or has it been short-circuited / no-op'd on the patterns server in favor of the `License_Relay` path in `kadence-blocks-plugin-endpoints`? If the SureCart hook still gates premium content for some routes, the same LWSW-prefix dispatch needs to be added to that plugin too. Worth a live trace of one Pricing Table 11 request to confirm.
6. **Cloud Pages and Page Wizard.** `stellarwp/kadence-cloud-pages` and `stellarwp/kadence-cloud-page-wizard` also register routes. Confirm they go through `License_Relay` (so they're covered by the single change above) rather than maintaining their own validators.
7. **Caching strategy.** The catalog call adds latency to every pattern import. The transient cache sketched above (`sha1($key . '|' . $domain)`, 5–15 min TTL) helps but raises a question: what's the cache-invalidation expectation when an entitlement is revoked mid-window (e.g., subscription cancelled)? An acceptable lag, or do we need an invalidation webhook from the portal?
8. **Throttling on the portal.** What's the rate limit / acceptable QPS the pattern server can hit `licensing.nexcess.com` with? Pattern imports are user-driven so traffic is bursty; if the API has aggressive limits, the cache TTL needs to be tuned accordingly.
9. **Shared library vs. duplicated change.** Server A and Server B both maintain a `License_Relay` class with identical wire format. Extract to a shared Composer package now, or ship the duplicated LWSW change first and consolidate later? Lower-risk path is ship-then-consolidate.

---

## Rollout / verification

1. **Plugin-side fix lands first**, behind no flag — for SureCart customers it's a no-op (the legacy keys still resolve first), so there's no regression risk.
2. **Before the server-side change ships**, the plugin fix alone will *not* unblock unified customers (the server still rejects unified keys). It also won't make things worse — they're already broken.
3. **Server-side rollout is a single change per repo** — the LWSW branch in `License_Relay` only fires for `LWSW-`-prefixed keys, so legacy customers can't be regressed by it. The change is intrinsically low-risk on the legacy side and adds new capability on the unified side.
4. **After server-side changes ship**, verify:
   - Premium pattern import works for a unified-license test site (Pricing Table 11 is a good canary because it's the user-reported case).
   - Premium page import works (Pattern Library → Pages tab).
   - Full-site starter template import works (Server B path, both legacy and unified key holders).
   - Legacy customers still import successfully (regression check — should be a no-op since their codepath is untouched).
   - Unlicensed sites and invalid LWSW keys still produce a clear error (failure-mode check).
5. **Logging.** Inside the LWSW branch of `License_Relay`, log which path validated each request (`lwsw` vs. `legacy-uplink`). Log unified-API errors at WARN so transient licensing-service outages are visible without being misattributed as customer-side license failures.
