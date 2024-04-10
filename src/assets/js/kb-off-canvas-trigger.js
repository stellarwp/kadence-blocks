document.addEventListener('DOMContentLoaded', function () {
	var triggers = document.querySelectorAll('.wp-block-kadence-off-canvas-trigger');

	triggers.forEach(function (trigger) {
		trigger.addEventListener('click', function () {
			const headerContainer = trigger.closest('.wp-block-kadence-header');
			const offCanvas = headerContainer.querySelector('.wp-block-kadence-off-canvas');

			if (offCanvas) {
				offCanvas.style.display = offCanvas.style.display === 'block' ? '' : 'block';
			}
		});
	});
});
