function Music(src, options) {
	options || (options = {});
	var audio = this.audio = 	new Audio();
	audio.autoplay = !!options.autoplay;
	audio.loop = !!options.loop;
	audio.preload = !!options.preload;
	audio.src = src;
	if (options.autoplay) {
		//ios自动播放音乐需在body绑定touchstart模板
		var initPlay = function() {
			audio.play();
			document.body.removeEventListener('touchstart', initPlay, false);
		};
		document.querySelector('.audio').className = "audio active";
		document.body.addEventListener('touchstart', initPlay, false);
		audio.addEventListener('canplay', function() {
			if (!audio.paused) {
				document.body.removeEventListener('touchstart', initPlay, false);
			}
		}, false);
	}
}

var prop = Music.prototype;
prop.play = function() {
	try {
		this.audio.play();
		document.querySelector('.audio').className = "audio active";
	}
	catch (e) {
	}
};
prop.pause = function() {
	try {
		this.audio.pause();
		document.querySelector('.audio').className = "audio";
	}
	catch (e) {
	}
};
prop.stop = function() {
	this.pause();
	this.setTime(0);
	document.querySelector('.audio').className = "audio";
};
prop.replay = function() {
	this.setTime(0);
	this.play();
};
prop.setTime = function() {
	try {
		this.audio.currentTime = 0;
	}
	catch (e) {
	}
};
prop.toggle = function() {
	if (this.audio.paused) {
		this.play();
	}
	else {
		this.pause();
	}
};