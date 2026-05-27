# Premium import failures under unified (LWSW) licenses — plan

## Problem

Customers with an active LiquidWeb **unified license key** (`LWSW-…`) can't import premium content (e.g., Pricing Table 11), seeing `"Invalid or expired license key."` and `"Error importing because of license validation…"`. Cause: the plugin never sends the unified key to the pattern servers, and even if it did, the servers don't know how to validate it.

The `"Custom Icons not working"` framing in the report is incidental — those icons live inside the premium pattern payload, so the failure is at the pattern-fetch step.

## What this API request gates

`api_key` is only sent when `library` is `templates | section | pages | template` (`class-kadence-blocks-prebuilt-library-rest-api.php:1378, 2306, 2362`). When it's empty/invalid:

- Pattern Library → **Patterns** tab (premium patterns) — `library=section` → `patterns.startertemplatecloud.com` — *this is what Pricing Table 11 hits*
- Pattern Library → **Pages** tab (premium prebuilt pages) — `library=pages` → same server
- **Starter Templates** (full-site demo imports) — `library=templates` → `api.startertemplatecloud.com`

Not affected (so we don't over-scope): premium blocks themselves, bundled Custom Icons, AI generation (already gated separately), customer-hosted Kadence Cloud libraries, free patterns.

---

## The fix — four changes

### 1. Plugin: pass the LWSW key

`stellarwp/kadence-blocks` — `includes/helper-functions.php:157`. `kadence_blocks_get_current_license_key()` currently only checks legacy Uplink keys; add a Harbor fallback so unified-only customers' keys make it onto the wire:

```php
function kadence_blocks_get_current_license_key() {
    // ...existing legacy checks unchanged...
    $legacy_key = get_license_key( 'kadence-blocks' );
    if ( ! empty( $legacy_key ) ) {
        return $legacy_key;
    }
    if ( function_exists( 'lw_harbor_get_unified_license_key' ) ) {
        $unified_key = lw_harbor_get_unified_license_key();
        if ( ! empty( $unified_key ) ) {
            return $unified_key;
        }
    }
    return '';
}
```

Safe to land independently — for legacy customers the legacy key still resolves first.

### 2. `stellarwp/kadence-cloud-kadencewp-license` *(gates premium pattern imports — the Pricing Table 11 path)*

Hooks `kadence_cloud_rest_request_access` for `/kadence-cloud/v1/single` (`inc/KadenceCloudKWPLicense/API/API_License_Validation.php:30-64`) and uses its own `License_Relay` (`inc/KadenceCloudKWPLicense/API/License_Relay.php`) to validate the `api_key`.

Add `stellarwp/licensing-api-client-wordpress` as a Composer dependency. In `License_Relay::validate_license()`, branch on key prefix:

- `LWSW-…` → proxy to the LiquidWeb licensing API via the SDK. Use `WordPressApiFactory::make( $config )->products()->catalog( $key, $domain )`. Map the returned `Catalog` into the existing `results[0]->api_invalid` response shape so the caller at `API_License_Validation.php:55` keeps working unchanged.
- Anything else → existing signed-Uplink path to `https://licensing.kadencewp.com/api/stellarwp/v3/license/validate`, untouched.

Cache successful validations and 404s in a transient keyed on `sha1( $key . '|' . $domain )` (5–15 min TTL). Don't cache transient failures.

### 3. `stellarwp/kadence-blocks-plugin-endpoints` *(gates SVG endpoint + any other relay consumers)*

Owns its own copy of `License_Relay` (`inc/KadenceBlocksPluginEndpoints/API/License_Relay.php:96`). The exact text `"Invalid or expired license key."` from the bug report originates here (`SVG_API_Endpoint.php:140-143`).

Same change as #2: identical LWSW branch in `validate_license()`, same SDK dependency, same response-shape mapping.

### 4. `stellarwp/kadence-starter-api` *(gates full-site starter template imports)*

Owns `Kadence_Starter_License_Relay` with the same wire format. Same change as #2 and #3 — identical LWSW branch in `validate_license()`. Caller at `kadence-starter-api-rest-controller.php:221` stays unchanged.

**Three identical relay copies.** Worth extracting into a shared Composer package (e.g., `stellarwp/kadence-license-relay`) so the LWSW dispatch lives in one place. Optional for the initial fix; recommended as the immediate follow-up.

---

## Open questions

1. **Auth on the LiquidWeb API.** The SDK calls `catalog()` with `optionalToken()`, suggesting anonymous access works. Confirm whether the pattern + starter servers need a service token to call `licensing.nexcess.com/api/liquidweb/v1/products` in production, and if so where it comes from.
2. **Required `product_slug`.** Catalog entries carry `product_slug`. What's the canonical slug that grants premium-pattern access (`kadence-blocks-pro`? `kadence-bundle`?)? Needed for the entitlement check.
3. **Per-site activation.** Does the unified API enforce per-domain seat activation, or are entitlements seat-unlimited at the validation layer? The catalog endpoint just reads entitlements; if activation is required, a separate call may be needed.

## Verification

After all three changes:

- Premium pattern import works for an LWSW-only test site (Pricing Table 11 is the canary).
- Premium page import works.
- Full-site starter template import works.
- Legacy customers still import successfully (regression check — their codepath is untouched, should be a no-op).
- Invalid LWSW keys produce a clear `invalid_license` error.
