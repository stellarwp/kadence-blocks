/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Skeleton } from '../atoms/Skeleton';
import './AppShellSkeleton.scss';

// A fixed count, not derived from anything — there is no "expected nav item count" to read before
// the real sidebar arrives, so this just needs to fill the column plausibly.
const SKELETON_NAV_IDS = [0, 1, 2, 3, 4, 5, 6];

/**
 * The whole-app loading placeholder: a header-bar-shaped skeleton, a sidebar-nav-shaped skeleton,
 * and a blank content area, in the real `AppShell` markup (`.kadence-blocks-style-library__header`
 * / `__sidebar` / `__content` and the region classes the first two wrap) — used both for the app's
 * cold-start gate (`StyleLibraryApp.js`, before `feed.isReady`) and, reused as-is, for `AppShell`'s
 * library-switch overlay (`isBlocked`), so both loading moments render the same shape instead of a
 * spinner.
 *
 * The content area stays empty on purpose: the incoming screen's shape is not knowable from here —
 * a screen supplies its own skeleton once it mounts (`PresetScreen`'s row list, `ColorPaletteScreen`'s
 * swatch grid), and guessing one at this level would mean drawing a layout the screen may not have.
 *
 * The `__header` and `__sidebar` wrappers matter as much as the shapes inside them: they are what
 * carry the frame's opaque surface, its dividing rules and the sidebar's column width, so without
 * them the overlay's translucent scrim leaves the outgoing library's real header controls and nav
 * labels showing through the placeholder, and the nav column sizes itself to its own content
 * instead of the sidebar's width.
 *
 * @since TBD
 *
 * @return {JSX.Element} The shell-shaped skeleton.
 */
export function AppShellSkeleton() {
	return (
		<div
			className="kadence-blocks-style-library__shell-skeleton"
			role="status"
			aria-live="polite"
			aria-busy="true"
			aria-label={__('Loading…', 'kadence-blocks')}
		>
			<header className="kadence-blocks-style-library__header">
				<div className="kadence-blocks-style-library__header-bar">
					<Skeleton className="kadence-blocks-style-library__skeleton--bar" style={{ width: '8rem' }} />
					<div className="kadence-blocks-style-library__header-library">
						<Skeleton className="kadence-blocks-style-library__skeleton--bar" style={{ width: '12rem' }} />
					</div>
					<div className="kadence-blocks-style-library__header-actions">
						<Skeleton className="kadence-blocks-style-library__skeleton--bar" style={{ width: '6rem' }} />
					</div>
				</div>
			</header>
			<div className="kadence-blocks-style-library__body">
				<nav className="kadence-blocks-style-library__sidebar">
					<div className="kadence-blocks-style-library__nav">
						{SKELETON_NAV_IDS.map((id) => (
							<Skeleton
								key={id}
								className="kadence-blocks-style-library__skeleton--bar"
								style={{ width: '9rem' }}
							/>
						))}
					</div>
				</nav>
				<main className="kadence-blocks-style-library__content" />
			</div>
		</div>
	);
}
