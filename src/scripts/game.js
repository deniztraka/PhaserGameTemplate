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

var map = null;
var layer = null;
var cursors = null;
var player = null;

DGame.Game.prototype = {

    create: function () {
        
        MapHandler.Init({width:64,height:48});        
        var csvData = MapHandler.GetAsCsvData();

        //  Add data to the cache
        this.cache.addTilemap('dynamicMap', null, csvData, Phaser.Tilemap.CSV);

        //  Create our map (the 16x16 is the tile size)
        map = this.game.add.tilemap('dynamicMap', 16, 16);

        //  'tiles' = cache image key, 16x16 = tile size
        map.addTilesetImage('tiles', 'tiles', 16, 16);

        //  Create our layer
        layer = map.createLayer(0);

        //  Scroll it
        layer.resizeWorld();



        //layer.debug = true;

        this.physics.startSystem(Phaser.Physics.ARCADE);

        //  Player
        player = this.game.add.sprite(48, 48, 'player', 1);
        player.animations.add('left', [8, 9], 10, true);
        player.animations.add('right', [1, 2], 10, true);
        player.animations.add('up', [11, 12, 13], 10, true);
        player.animations.add('down', [4, 5, 6], 10, true);




        this.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.setSize(10, 14, 2, 1);

        this.camera.follow(player);

        cursors = this.input.keyboard.createCursorKeys();

        //  This isn't totally accurate, but it'll do for now
        map.setCollision([1]);
    },

    update: function () {
        this.physics.arcade.collide(player, layer);

        player.body.velocity.set(0);

        if (cursors.left.isDown) {
            player.body.velocity.x = -100;
            player.play('left');
        } else if (cursors.right.isDown) {
            player.body.velocity.x = 100;
            player.play('right');
        } else if (cursors.up.isDown) {
            player.body.velocity.y = -100;
            player.play('up');
        } else if (cursors.down.isDown) {
            player.body.velocity.y = 100;
            player.play('down');
        } else {
            player.animations.stop();
        }
        //	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

    },
    render:function() {
        this.game.debug.body(player);
    }

};