document.addEventListener('DOMContentLoaded', function () {
	const triggers = document.querySelectorAll('.wp-block-kadence-off-canvas-trigger');
	triggers.forEach(function (trigger) {
		trigger.addEventListener('click', function () {
			const headerContainer = trigger.closest('.wp-block-kadence-header');
			const offCanvas = headerContainer.querySelector('.wp-block-kadence-off-canvas');

			if (offCanvas) {
				offCanvas.classList.toggle('active');
			}
		});
	});

	const overlays = document.querySelectorAll('.kb-off-canvas-overlay');
	overlays.forEach(function (overlay) {
		overlay.addEventListener('click', function () {
			const uniqueId = overlay.getAttribute('data-unique-id');

			if (uniqueId) {
				const offCanvas = document.querySelector('.wp-block-kadence-off-canvas' + uniqueId);

				if (offCanvas) {
					offCanvas.classList.toggle('active');
				}
			}
		});
	});
});
