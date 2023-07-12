import { OPENVERSE_SOURCES } from "../../constants/openverse";

/**
 * Format the params for Openverse.
 *
 * @param {string} type   Query type (search, photos, id).
 * @param {Object} params Query params object.
 * @return {Object} 		  Updated params.
 */
export function openverseParams(type, params) {
	if (type === "photos" && !params.source) {
		// Add `wordpress` as the default `source` for openverse.
		params.source = "wordpress";
	}

	if (type === "search") {
		// Include these sources only.
		const sources = OPENVERSE_SOURCES.toString();
		params.source = sources;
	}

	return params;
}
