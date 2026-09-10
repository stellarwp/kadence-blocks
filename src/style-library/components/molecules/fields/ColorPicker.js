/**
 * The Style Library's solid-color picker.
 *
 * Relocated to `src/token-controls/molecules/ColorPicker.js` so `ColorControl`'s Custom tab and the
 * Style Library's own fields share one implementation — the same one-way dependency direction the
 * library already establishes elsewhere (`src/style-library/helpers/tokens.js` already imports
 * `noneEntryForRole` from `token-controls`, never the reverse). This file stays as a thin re-export
 * so every existing call site keeps working unchanged.
 */

export { ColorPicker } from '../../../../token-controls';
