// cspell:ignore labelledby -- the ARIA attribute name.
/**
 * The theme presets the active theme does not offer but the library still holds overrides for. They
 * are parked: not listed with the live presets, not painted on any button, kept exactly as they were
 * so a switch back to the theme re-attaches them. This group names them and offers the two ways out —
 * keep the look as a preset of the user's own, or drop the stored overrides.
 */

/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { writableThemeValues } from '../../helpers/presets';
import './DormantPresets.scss';

/**
 * Render the "Not available in the current theme" group.
 *
 * @param {Object}   props           The component props.
 * @param {?Object}  props.dormant   The REST payload's dormant map: slug => { label, tokens, themeSnapshot }.
 * @param {Function} props.onKeep    Called with `(slug, { label, tokens })` — the theme snapshot under the
 *                                   overrides, the full look the preset had when it was last saved, less
 *                                   any theme value a preset write has no slot for.
 * @param {Function} props.onDiscard Called with the slug to drop the stored overrides.
 * @param {boolean}  [props.isBusy]  Whether the screen is mid-request; both actions are disabled then.
 *
 * @since TBD
 *
 * @return {?JSX.Element} The group, or null when nothing is dormant.
 */
export function DormantPresets({ dormant, onKeep, onDiscard, isBusy = false }) {
	const entries = Object.entries(dormant ?? {});

	if (!entries.length) {
		return null;
	}

	return (
		<section className="kadence-blocks-style-library__dormant" aria-labelledby="kb-sl-dormant-title">
			<h3 id="kb-sl-dormant-title" className="kadence-blocks-style-library__dormant-title">
				{__('Not available in the current theme', 'kadence-blocks')}
			</h3>
			<p className="kadence-blocks-style-library__dormant-note">
				{__(
					'These presets came from another theme. Your changes to them are kept until that theme is active again.',
					'kadence-blocks'
				)}
			</p>
			<ul className="kadence-blocks-style-library__dormant-list">
				{entries.map(([slug, entry]) => {
					const label = entry?.label || slug;
					const tokens = { ...writableThemeValues(entry?.themeSnapshot), ...(entry?.tokens ?? {}) };

					return (
						<li key={slug} className="kadence-blocks-style-library__dormant-item">
							<span className="kadence-blocks-style-library__dormant-label">{label}</span>
							<span className="kadence-blocks-style-library__dormant-actions">
								<Button
									variant="secondary"
									data-action="keep"
									disabled={isBusy}
									onClick={() => onKeep(slug, { label, tokens })}
								>
									{__('Keep as custom preset', 'kadence-blocks')}
								</Button>
								<Button
									variant="tertiary"
									isDestructive
									data-action="discard"
									disabled={isBusy}
									onClick={() => onDiscard(slug)}
								>
									{__('Discard changes', 'kadence-blocks')}
								</Button>
							</span>
						</li>
					);
				})}
			</ul>
		</section>
	);
}
