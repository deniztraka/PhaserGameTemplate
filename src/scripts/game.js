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
};


var clickRate = 100;
var nextClick = 0;



DGame.Game.prototype = {
    create: function () {

        MapHandler.Init({
            width: 64,
            height: 40,
            chanceToStartAlive: 0.4,
            birthLimit: 4,
            deathLimit: 3,
            numberOfSteps: 3,
        });
        var world = MapHandler.GenerateMap();
        var csvData = MapHandler.GetAsCsvData(world);

        NuhMapHandler.Init(this, csvData, this.game.plugins.add(Phaser.Plugin.PathFinderPlugin));
        NuhMapHandler.Builder.FillForest();
        NuhMapHandler.Builder.PlaceShip();
        NuhMapHandler.Mobiles.CreateAnimals();
        NuhMapHandler.Mobiles.CreatePlayer();
        NuhMapHandler.Builder.InitFlood();
        NuhMapHandler.Builder.StartFlood();


        this.physics.startSystem(Phaser.Physics.ARCADE);

        // pathfinder = this.game.plugins.add(Phaser.Plugin.PathFinderPlugin);
        // pathfinder.setGrid(NuhMapHandler.Map().layers[0].data, [0, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

        //NuhMapHandler.Builder.StartFlood();
    },

    update: function () {
        //Just for debugging to start flood
        if (this.input.activePointer.isDown) {
            if (this.time.now > nextClick) {
                nextClick = this.time.now + clickRate;
                NuhMapHandler.Builder.StartFlood();
            }
        }

        NuhMapHandler.Update();
    },
    render: function () {
        //this.game.debug.spriteBounds(NuhMapHandler.Mobiles.Player);
        // for (var y = 0; y < world[0].length; y++) {
        //     for (var x = 0; x < world.length; x++) {
        //         //this.game.debug.text(MapHandler.ClosedNeighbourCount(world,x,y,0), (x*32)+8, (y*32)+12);
        //         //this.game.debug.text(MapHandler.ClosedNeighbourCount(world,x,y), (x*32)+8, (y*32)+12);
        //         //this.game.debug.text(world[x][y], (x*32)+8, (y*32)+26);
        //         //this.game.debug.text(world[x][y], (x*32)+8, (y*32)+26);                
        //     }
        // }
    }

};