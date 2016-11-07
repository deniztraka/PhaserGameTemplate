DGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;
};

DGame.Preloader.prototype = {
	preload: function () {
		this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');
		this.load.setPreloadSprite(this.preloadBar);

		this.load.image('tiles','assets/img/tiles/sci-fi-tiles.png');
	},
	create: function () {
		this.preloadBar.cropEnabled = false;

	},
	update: function () {
		if (this.ready === false) {
			this.ready = true;
			this.state.start('MainMenu');
		}
	}
};
