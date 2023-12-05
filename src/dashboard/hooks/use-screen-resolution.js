import { useEffect, useState } from "@wordpress/element";

export function useScreenResolution() {
	const [screenResolution, setScreenResolution] = useState({
		width: 0,
		height: 0,
	});

	useEffect(() => {
		function handleResize() {
			setScreenResolution({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}

		handleResize();

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return screenResolution;
}
