import { SVG } from '@wordpress/primitives';

export function LoadingDots() {
	return (
		<SVG width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
			<style>
				{`
      .spinner_qM83 { animation: spinner_8HQG 1.05s infinite; }
      .spinner_oXPr { animation-delay: 0.1s; }
      .spinner_ZTLf { animation-delay: 0.2s; }
				@keyframes spinner_8HQG {
					0%, 57.14% {
						animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
						transform: translate(0);
					}
					28.57% {
						animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
						transform: translateY(-3px);
					}
					100% {
						transform: translate(0);
					}
				}
      `}
			</style>
			<circle className="spinner_qM83" cx="2" cy="6" r="1" />
			<circle className="spinner_qM83 spinner_oXPr" cx="6" cy="6" r="1" />
			<circle className="spinner_qM83 spinner_ZTLf" cx="10" cy="6" r="1" />
		</SVG>
	);
}
