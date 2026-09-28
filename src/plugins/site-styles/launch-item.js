/**
 * The "Custom Kadence styles" item on core's Styles > Blocks screen of a
 * supported block, which opens the Kadence panel.
 *
 * Core's per-block Styles screen has no extension API, so the item is appended
 * to the screen by a MutationObserver. It only ever appends its own node, and
 * any error leaves the screen as core rendered it: a core markup change means
 * a missing item, never a broken Styles screen. The Block Defaults button is
 * the route to the panel that doesn't depend on core's markup.
 */
import { __, isRTL } from '@wordpress/i18n';
import { dispatch } from '@wordpress/data';
import { createRoot } from '@wordpress/element';
import { getBlockType } from '@wordpress/blocks';
import { chevronLeft, chevronRight } from '@wordpress/icons';
import {
	FlexItem,
	Icon,
	__experimentalHStack as HStack,
	__experimentalItem as Item,
	__experimentalItemGroup as ItemGroup,
	__experimentalSpacer as Spacer,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { getSupportedBlockNames } from '../../site-styles/supported-blocks';
import { STORE_NAME } from './store';

/**
 * Built like core's own Styles sections (e.g. Typography > Font Sizes), so it
 * matches the screen.
 *
 * @param {Object} props           Component props.
 * @param {string} props.blockName Block name.
 * @return {Element} The item.
 */
function LaunchItem({ blockName }) {
	return (
		<Spacer padding={4}>
			<VStack spacing={2}>
				<ItemGroup isBordered isSeparated>
					<Item as="button" onClick={() => dispatch(STORE_NAME).openSiteStyles(blockName)}>
						<HStack direction="row">
							<FlexItem>{__('Custom Kadence styles', 'kadence-blocks')}</FlexItem>
							<Icon icon={isRTL() ? chevronLeft : chevronRight} />
						</HStack>
					</Item>
				</ItemGroup>
			</VStack>
		</Spacer>
	);
}

/**
 * @param {Element|null} heading The screen heading.
 * @return {string|undefined} The supported block whose screen this is. The heading
 * is matched, not the URL: in canvas mode the URL keeps the last block screen
 * after navigating back.
 */
function screenBlockName(heading) {
	const title = heading?.textContent.trim();

	return title ? getSupportedBlockNames().find((name) => getBlockType(name)?.title === title) : undefined;
}

/**
 * Starts adding the item to supported blocks' Styles screens.
 */
export function watchStylesScreens() {
	let root = null;
	let node = null;
	let current = null;

	const unmount = () => {
		if (root) {
			root.unmount();
		}
		if (node) {
			node.remove();
		}
		root = null;
		node = null;
		current = null;
	};

	const update = () => {
		try {
			const heading = document.querySelector('h2.global-styles-ui-header');
			const blockName = screenBlockName(heading);
			const screen = heading?.closest('.global-styles-ui-sidebar__navigator-screen');

			if (!blockName || !screen) {
				unmount();
				return;
			}

			if (node?.isConnected && screen.contains(node) && current === blockName) {
				return;
			}

			unmount();
			node = document.createElement('div');
			node.className = 'kb-site-styles-launch';
			screen.appendChild(node);
			root = createRoot(node);
			root.render(<LaunchItem blockName={blockName} />);
			current = blockName;
		} catch (error) {
			// Leave core's screen as it is.
		}
	};

	new window.MutationObserver(update).observe(document.body, { childList: true, subtree: true });
}
