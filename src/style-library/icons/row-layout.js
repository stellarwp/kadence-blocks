/**
 * WordPress dependencies
 */
import { SVG, Path, Defs, Rect, Circle, G } from '@wordpress/primitives';

/**
 * The Row Layout block's glyph, for its preset screen. The mask keeps a thin gap between the frame
 * and the circle, and the plus is cut out of the circle, so the row's background shows through both.
 *
 * @since TBD
 */
export const rowLayout = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
		<Defs>
			<mask id="kb-sl-row-layout-icon-gap" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
				<Rect width="16" height="16" fill="white" />
				<Circle cx="8" cy="10.722" r="2.946" fill="black" />
			</mask>
		</Defs>
		<G mask="url(#kb-sl-row-layout-icon-gap)">
			<Path d="M15.5021 2.62567H0.498102C0.336768 2.62567 0.204102 2.75834 0.204102 2.91967V10.8013C0.204102 10.9627 0.336768 11.0953 0.498102 11.0953H15.5021C15.6634 11.0953 15.7961 10.9627 15.7961 10.8013V2.918C15.7951 2.75734 15.6627 2.62567 15.5021 2.62567ZM15.2081 10.509H0.792102V3.21367H15.2081V10.509Z" />
			<Path d="M14.471 3.8443H1.5293V9.87631H14.471V3.8443Z" />
		</G>
		<Path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M8 8.363a2.359 2.359 0 1 0 0 4.718a2.359 2.359 0 1 0 0-4.718Z M6.93757 10.513H7.70657V9.74334C7.70657 9.58201 7.83923 9.44934 8.00057 9.44934C8.1619 9.44934 8.29457 9.58201 8.29457 9.74334V10.513H9.06357C9.22457 10.513 9.35757 10.6457 9.35757 10.807C9.35757 10.9683 9.22457 11.101 9.06357 11.101H8.29457V11.87C8.29457 12.0313 8.1619 12.164 8.00057 12.164C7.83923 12.164 7.70657 12.0313 7.70657 11.87V11.101H6.93757C6.77657 11.101 6.64355 10.9683 6.64355 10.807C6.64355 10.6457 6.77657 10.513 6.93757 10.513Z"
		/>
	</SVG>
);
