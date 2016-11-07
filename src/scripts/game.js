
DGame.Game = function (game) {

    //	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    //this.game;		//	a reference to the currently running game
    //this.add;		//	used to add sprites, text, groups, etc
    //this.camera;	//	a reference to the game camera
    //this.cache;		//	the game cache
    //this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    //this.load;		//	for preloading assets
    //this.math;		//	lots of useful common math operations
    //this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    //this.stage;		//	the game stage
    //this.time;		//	the clock
    //this.tweens;	//	the tween manager
    //this.world;		//	the game world
    //this.particles;	//	the particle manager
    //this.physics;	//	the physics manager
    //this.rnd;		//	the repeatable random number generator

    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

var cursors = null;

DGame.Game.prototype = {

    create: function () {
        
        //  Create some map data dynamically
        //  Map size is 128x128 tiles
        var data = '';

        for (var y = 0; y < 8; y++) {
            for (var x = 0; x < 8; x++) {
                data += this.rnd.between(0, 20).toString();

                if (x < 7) {
                    data += ',';
                }
            }

            if (y < 7) {
                data += "\n";
            }
        }

        // console.log(data);

        //  Add data to the cache
        this.cache.addTilemap('dynamicMap', null, data, Phaser.Tilemap.CSV);

        //  Create our map (the 16x16 is the tile size)
        map = this.game.add.tilemap('dynamicMap', 16, 16);

        //  'tiles' = cache image key, 16x16 = tile size
        map.addTilesetImage('tiles', 'tiles', 16, 16);

        //  0 is important
        var layer = map.createLayer(0);

        //  Scroll it
        layer.resizeWorld();

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        cursors = this.input.keyboard.createCursorKeys();

    },

    update: function () {
        if (cursors.left.isDown)
        {
            this.camera.x--;
        }
        else if (cursors.right.isDown)
        {
            this.camera.x++;
        }

        if (cursors.up.isDown)
        {
            this.camera.y--;
        }
        else if (cursors.down.isDown)
        {
            this.camera.y++;
        }
        //	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

    },

    quitGame: function (pointer) {

        //	Here you should destroy anything you no longer need.
        //	Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //	Then let's go back to the main menu.
        this.state.start('MainMenu');

    }

};
