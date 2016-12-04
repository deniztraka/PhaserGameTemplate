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
    hede: function () {
        var map = NuhMapHandler.Map();
        var playerTile = NuhMapHandler.Mobiles.Player.getTile();
        var maxDistance = 10;

        function oct(row, col) {
            for (var row = 1; row < maxDistance; row++) {
                for (var col = 0; col <= row; col++) {
                    var x = playerTile.x + col;
                    var y = playerTile.y - row;

                    map.putTile(100, x, y);
                }
            }
        }

        function transformOctant(row, col, octant) {
            switch (octant) {
                case 0: return oct(col, -row);
                case 1: return oct(row, -col);
                case 2: return oct(row, col);
                case 3: return oct(col, row);
                case 4: return oct(-col, row);
                case 5: return oct(-row, col);
                case 6: return oct(-row, -col);
                case 7: return oct(-col, -row);
            }
        }
            transformOctant(1,1,0);
            transformOctant(1,1,1);


        return;

        //0
        for (var row = 1; row < maxDistance; row++) {
            for (var col = 0; col <= row; col++) {
                var x = playerTile.x + col;
                var y = playerTile.y - row;

                map.putTile(100, x, y);
            }
        }

        //1
        for (var row = 1; row < maxDistance; row++) {
            for (var col = 0; col <= row; col++) {
                var x = playerTile.x + row;
                var y = playerTile.y - col;

                map.putTile(100, x, y);
            }
        }

        //2
        for (var row = 1; row < maxDistance; row++) {
            for (var col = 0; col <= row; col++) {
                var x = playerTile.x + row;
                var y = playerTile.y + col;

                map.putTile(100, x, y);
            }
        }

        //3
        for (var row = 1; row < maxDistance; row++) {
            for (var col = 0; col <= row; col++) {
                var x = playerTile.x + col;
                var y = playerTile.y + row;

                map.putTile(100, x, y);
            }
        }

        //4
        for (var row = 1; row < maxDistance; row++) {
            for (var col = 0; col <= row; col++) {
                var x = playerTile.x - col;
                var y = playerTile.y + row;

                map.putTile(100, x, y);
            }
        }

        //5
        for (var row = 1; row < maxDistance; row++) {
            for (var col = 0; col <= row; col++) {
                var x = playerTile.x - row;
                var y = playerTile.y + col;

                map.putTile(100, x, y);
            }
        }

        //6
        for (var row = 1; row < maxDistance; row++) {
            for (var col = 0; col <= row; col++) {
                var x = playerTile.x - row;
                var y = playerTile.y - col;

                map.putTile(100, x, y);
            }
        }

        //7
        for (var row = 1; row < maxDistance; row++) {
            for (var col = 0; col <= row; col++) {
                var x = playerTile.x - col;
                var y = playerTile.y - row;

                map.putTile(100, x, y);
            }
        }

    },

    create: function () {

        MapHandler.Init({
            width: 64,
            height: 48,
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

        fovMap = NuhMapHandler.Map();


        this.physics.startSystem(Phaser.Physics.ARCADE);



        var emitter = this.game.add.emitter(this.game.world.centerX, -450, 400);

        emitter.width = this.game.world.width;
        emitter.angle = 30; // uncomment to set an angle for the rain.

        emitter.makeParticles('rain');

        emitter.minParticleScale = 0.05;
        emitter.maxParticleScale = 0.25;

        emitter.setYSpeed(300, 600);
        emitter.setXSpeed(-5, 5);
        //emitter.lifespan = 500;

        emitter.minRotation = 0;
        emitter.maxRotation = 0;

        emitter.start(false, 1600, 5, 0);


    },

    update: function () {
        //Just for debugging to start flood
        if (this.input.activePointer.isDown) {
            if (this.time.now > nextClick) {
                nextClick = this.time.now + clickRate;
                //this.hede();
            }
        }

        NuhMapHandler.Update();
    },
    render: function () {
        this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
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