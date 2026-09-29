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
 * A stored entry can arrive with no theme snapshot: the single-preset write only records one when the theme
 * renders values for the preset, and the collection write records none. Keep then has only the overrides to
 * work from, so the item says so and its action is named for what it really keeps.
 *
 * A snapshot can also be recorded yet hold no value a preset write accepts (every property a compound
 * literal); Keep has only the overrides then too, but the note says the values could not be carried over
 * rather than that they were never recorded.
 *
 * Both actions swallow the rejection their flow re-throws: the flow has already reported the failure
 * through the screen's error notice, and a click handler that returned the rejected promise would only
 * add an unhandled-rejection report for an error already shown.
 *
 * @param {Object}   props           The component props.
 * @param {?Object}  props.dormant   The REST payload's dormant map: slug => { label, tokens, themeSnapshot }.
 * @param {Function} props.onKeep    Called with `(slug, { label, tokens })` — the theme snapshot under the
 *                                   overrides, the full look the preset had when it was last saved, less
 *                                   any theme value a preset write has no slot for. May return a promise
 *                                   that rejects on failure.
 * @param {Function} props.onDiscard Called with the slug to drop the stored overrides. May return a promise
 *                                   that rejects on failure.
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
					const wasRecorded = Object.keys(entry?.themeSnapshot ?? {}).length > 0;
					const snapshot = writableThemeValues(entry?.themeSnapshot);
					const hasThemeValues = Object.keys(snapshot).length > 0;
					const tokens = { ...snapshot, ...(entry?.tokens ?? {}) };

					return (
						<li key={slug} className="kadence-blocks-style-library__dormant-item">
							<span className="kadence-blocks-style-library__dormant-label">
								{label}
								{!hasThemeValues && (
									<span className="kadence-blocks-style-library__dormant-warning">
										{wasRecorded
											? __(
													"The theme's own values for this preset cannot be saved in a preset, so only your changes can be kept.",
													'kadence-blocks'
												)
											: __(
													"The theme's own values for this preset were not recorded, so only your changes can be kept.",
													'kadence-blocks'
												)}
									</span>
								)}
							</span>
							<span className="kadence-blocks-style-library__dormant-actions">
								<Button
									variant="secondary"
									data-action="keep"
									disabled={isBusy}
									onClick={() => {
										void Promise.resolve(onKeep(slug, { label, tokens })).catch(() => undefined);
									}}
								>
									{hasThemeValues
										? __('Keep as custom preset', 'kadence-blocks')
										: __('Keep changes as custom preset', 'kadence-blocks')}
								</Button>
								<Button
									variant="tertiary"
									isDestructive
									data-action="discard"
									disabled={isBusy}
									onClick={() => {
										void Promise.resolve(onDiscard(slug)).catch(() => undefined);
									}}
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
