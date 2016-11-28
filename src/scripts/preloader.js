DGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;
};

DGame.Preloader.prototype = {
	preload: function () {
		this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');
		this.load.setPreloadSprite(this.preloadBar);

		this.load.image('tiles','assets/img/tiles/EasyTiles.png');
		this.load.spritesheet('trees', 'assets/img/spritesheets/EasyTiles_Trees_16x32.png', 16, 32);
		this.load.spritesheet('player', 'assets/img/spritesheets/spaceman.png', 16, 16);
		this.load.image('pig', 'assets/img/tiles/agac3.png', 16, 16);
		this.load.spritesheet('cat', 'assets/img/spritesheets/animals/cat.png', 16, 16);
		this.load.spritesheet('chicken', 'assets/img/spritesheets/animals/chicken.png', 16, 16);
		this.load.spritesheet('bunny', 'assets/img/spritesheets/animals/bunny.png', 16, 16);
		this.load.spritesheet('frog', 'assets/img/spritesheets/animals/frog.png', 16, 16);
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
