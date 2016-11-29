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

    this.gameConfig = {
        flood: {
            speed: 1000
        }
    };
};

var map = null;
var layer = null;
var cursors = null;
var player = null;
var world = null;
var group = null;
var clickRate = 100;
var nextClick = 0;
var animal = null;
var pathfinder = null;
var startTile = null;

DGame.Game.prototype = {    
    placeTreasure: function (world, treasureHiddenLimit) {
        //How hidden does a spot need to be for treasure?
        //I find treasureHiddenLimit 5 or 6 is good. 6 for very rare treasure.        
        for (var x = 0; x < world.length; x++) {
            for (var y = 0; y < world[0].length; y++) {
                if (world[x][y] == 0) {
                    var nbs = MapHandler.CountAliveNeighbours(world, x, y, [0, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
                    if (nbs <= treasureHiddenLimit) {
                        map.putTile(99, x, y);
                    }
                }
            }
        }

        return world;
    },    
    floodFill: function (mapData, x, y, oldVal, newVal) {
        var self = this;
        setTimeout(function () {
            var chosenTile = mapData.getTile(x, y);
            var mapWidth = world.length;
            var mapHeight = world[0].length;

            if (oldVal == null) {
                oldVal = mapData.getTile(x, y).index;
            }

            var floorDetailsIndexArray = [3, 4, 5, 6, 7, 8, 9, 10, 11];
            if (floorDetailsIndexArray.indexOf(chosenTile.index) !== -1) {
                mapData.putTile(newVal, chosenTile.x, chosenTile.y);
            } else
            if (chosenTile.index !== oldVal) {
                return true;
            }



            mapData.putTile(newVal, chosenTile.x, chosenTile.y);

            if (x > 0) {
                self.floodFill(mapData, x - 1, y, oldVal, newVal);
            }

            if (y > 0) {
                self.floodFill(mapData, x, y - 1, oldVal, newVal);
            }

            if (x < mapWidth - 1) {
                self.floodFill(mapData, x + 1, y, oldVal, newVal);
            }

            if (y < mapHeight - 1) {
                self.floodFill(mapData, x, y + 1, oldVal, newVal);
            }

        }, self.gameConfig.flood.speed);
    },
    create: function () {

        MapHandler.Init({
            width: 64,
            height: 40,
            chanceToStartAlive: 0.4,
            birthLimit: 4,
            deathLimit: 3,
            numberOfSteps: 3,
        });
        world = MapHandler.GenerateMap();
        var csvData = MapHandler.GetAsCsvData(world);
        
        NuhMapHandler.Init(this,csvData);
        NuhMapHandler.Builder.FillForest();        
        NuhMapHandler.Mobiles.CreateAnimals();
        NuhMapHandler.Mobiles.CreatePlayer();
        
        
        //layer.debug = true;
        this.physics.startSystem(Phaser.Physics.ARCADE);

        // //  Player
        // player = group.create(48, 48, 'player');
        // player.animations.add('left', [8, 9], 10, true);
        // player.animations.add('right', [1, 2], 10, true);
        // player.animations.add('up', [11, 12, 13], 10, true);
        // player.animations.add('down', [4, 5, 6], 10, true);
        // this.physics.enable(player, Phaser.Physics.ARCADE);
        // player.body.setSize(10, 14, 2, 1);
        // this.camera.follow(player);

        // cursors = this.input.keyboard.createCursorKeys();     

               

         pathfinder = this.game.plugins.add(Phaser.Plugin.PathFinderPlugin);
         pathfinder.setGrid(NuhMapHandler.Map().layers[0].data, [0, 3, 4, 5, 6, 7, 8, 9, 10, 11]);


        //sprite = new Pig(this, 30, 40);


        //group.add(sprite);
        //group.sort();        
    },

    update: function () {
        // this.physics.arcade.collide(player, layer);

        // player.body.velocity.set(0);

        // if (cursors.left.isDown) {
        //     player.body.velocity.x = -100;
        //     player.play('left');
        // } else if (cursors.right.isDown) {
        //     player.body.velocity.x = 100;
        //     player.play('right');
        // } else if (cursors.up.isDown) {
        //     player.body.velocity.y = -100;
        //     player.play('up');
        // } else if (cursors.down.isDown) {
        //     player.body.velocity.y = 100;
        //     player.play('down');
        // } else {
        //     player.animations.stop();
        // }
        //	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!



        //Just for debugging to start flood
        // if (this.input.activePointer.isDown) {
        //     if (this.time.now > nextClick) {
        //         nextClick = this.time.now + clickRate;
        //         var startTile = map.getTileWorldXY(this.input.activePointer.x, this.input.activePointer.y, 16, 16);
        //         this.floodFill(map, startTile.x, startTile.y, 0, 2);
                
        //     }

        // }

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