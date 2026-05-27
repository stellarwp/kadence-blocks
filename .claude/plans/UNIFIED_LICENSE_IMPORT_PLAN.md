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

## The fix — three changes

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

### 2. Server A: `stellarwp/kadence-blocks-plugin-endpoints`

Owns `License_Relay` (`inc/KadenceBlocksPluginEndpoints/API/License_Relay.php:96`) — this is the validator behind the user-reported error (`SVG_API_Endpoint.php:140-143` returns the exact text `"Invalid or expired license key."`).

Add `stellarwp/licensing-api-client-wordpress` as a Composer dependency. In `validate_license()`, branch on key prefix:

- `LWSW-…` → proxy to the LiquidWeb licensing API via the SDK. Use `WordPressApiFactory::make( $config )->products()->catalog( $key, $domain )`. Map the returned `Catalog` to the existing `results[0]->api_invalid` response shape so `SVG_API_Endpoint.php:147-156` and other callers keep working unchanged.
- Anything else → existing signed-Uplink path to `https://licensing.kadencewp.com/api/stellarwp/v3/license/validate`, untouched.

Cache successful validations and 404s in a transient keyed on `sha1( $key . '|' . $domain )` (5–15 min TTL). Don't cache transient failures.

### 3. Server B: `stellarwp/kadence-starter-api`

Owns its own `Kadence_Starter_License_Relay` with the same wire format as Server A. Make the identical change inside its `validate_license()`. Caller at `kadence-starter-api-rest-controller.php:221` stays unchanged.

Both relay classes are now logically identical apart from constants — optional follow-up to extract into a shared Composer package; not required to ship.

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
