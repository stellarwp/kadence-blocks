const kbVidForEach = function (array, callback, scope) {
	for (let i = 0; i < array.length; i++) {
		callback.call(scope, i, array[i]); // passes back stuff we need.
	}
};
const pauseBtns = document.getElementsByClassName('kb-background-video-pause');
kbVidForEach(pauseBtns, function (index, value) {
	value.addEventListener('click', function () {
		const player = this.parentNode.parentNode.getElementsByTagName('video')[0];
		player.pause();
		this.parentNode.getElementsByClassName('kb-background-video-play')[0].style.display = 'inline-block';
		this.parentNode.getElementsByClassName('kb-background-video-play')[0].setAttribute('aria-hidden', 'false');
		this.setAttribute('aria-hidden', 'true');
		this.style.display = 'none';
	});
});
const playBtns = document.getElementsByClassName('kb-background-video-play');
kbVidForEach(playBtns, function (index, value) {
	value.addEventListener('click', function () {
		const player = this.parentNode.parentNode.getElementsByTagName('video')[0];
		player.play();
		this.parentNode.getElementsByClassName('kb-background-video-pause')[0].style.display = 'inline-block';
		this.parentNode.getElementsByClassName('kb-background-video-pause')[0].setAttribute('aria-hidden', 'false');
		this.setAttribute('aria-hidden', 'true');
		this.style.display = 'none';
	});
});
const muteBtns = document.getElementsByClassName('kb-background-video-mute');
kbVidForEach(muteBtns, function (index, value) {
	value.addEventListener('click', function () {
		const player = this.parentNode.parentNode.getElementsByTagName('video')[0];
		player.muted = true;
		this.parentNode.getElementsByClassName('kb-background-video-unmute')[0].style.display = 'inline-block';
		this.parentNode.getElementsByClassName('kb-background-video-unmute')[0].setAttribute('aria-hidden', 'false');
		this.setAttribute('aria-hidden', 'true');
		this.style.display = 'none';
	});
});
const unmuteBtns = document.getElementsByClassName('kb-background-video-unmute');
kbVidForEach(unmuteBtns, function (index, value) {
	value.addEventListener('click', function () {
		const player = this.parentNode.parentNode.getElementsByTagName('video')[0];
		player.muted = false;
		this.parentNode.getElementsByClassName('kb-background-video-mute')[0].style.display = 'inline-block';
		this.parentNode.getElementsByClassName('kb-background-video-mute')[0].setAttribute('aria-hidden', 'false');
		this.setAttribute('aria-hidden', 'true');
		this.style.display = 'none';
	});
});
