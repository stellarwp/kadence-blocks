/**
 * Shared install/activate state machine for the Pro feature plugin.
 *
 * Both license views (unified activation flow, active license card) install
 * the same feature plugin and need identical `isInstalling`/`status`/`error`
 * bookkeeping around it; this hook is the single place that owns it.
 */
import { useCallback, useState } from '@wordpress/element';
import { installProFeature } from './helper';

/**
 * @param {string} featureSlug Feature/plugin slug to install and activate.
 * @param {string} featureName Human-readable name, used in progress messages.
 * @return {{
 *   isInstalling: boolean,
 *   status: string,
 *   error: string,
 *   setError: Function,
 *   install: () => Promise<boolean>
 * }}
 */
export default function useInstallProFeature(featureSlug, featureName) {
	const [isInstalling, setIsInstalling] = useState(false);
	const [status, setStatus] = useState('');
	const [error, setError] = useState('');

	const install = useCallback(async () => {
		setError('');
		setIsInstalling(true);

		try {
			await installProFeature(featureSlug, featureName, setStatus);
			return true;
		} catch (err) {
			setError(err.message);
			return false;
		} finally {
			setIsInstalling(false);
		}
	}, [featureSlug, featureName]);

	return { isInstalling, status, error, setError, install };
}
