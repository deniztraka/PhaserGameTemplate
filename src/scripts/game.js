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
var world = null;
var fillRate = 500;
var nextFill = 0;
var clickRate = 100;
var nextClick = 0;
var started = false;
var chosenTile = null;

function customFill(x, y) {
    var mapWidth = 32;
    var mapHeight = 24;

    map.putTile(22, chosenTile.x, chosenTile.y);
    for (var i = 0; i < mapWidth; i++) {
        var put = false;
        for (var j = 0; j < mapHeight; j++) {
            var tile = map.getTile(i, j);
            if (tile.index == 22) {
                var currX = tile.x;
                var currY = tile.y;
                var left = map.getTile(currX - 1, currY);
                var topLeft = map.getTile(currX - 1, currY - 1);
                var top = map.getTile(currX, currY - 1);
                var topRight = map.getTile(currX + 1, currY - 1);
                var right = map.getTile(currX + 1, currY);
                var downRight = map.getTile(currX + 1, currY + 1);
                var down = map.getTile(currX, currY + 1);
                var downLeft = map.getTile(currX - 1, currY + 1);

                if (left.index == 0) {
                    map.putTile(22, left.x, left.y);
                    put = true;
                    break;
                }
                if (topLeft.index == 0) {
                    map.putTile(22, topLeft.x, topLeft.y);
                    put = true;
                    break;
                }
                if (top.index == 0) {
                    map.putTile(22, top.x, top.y);
                    put = true;
                    break;
                }
                if (topRight.index == 0) {
                    map.putTile(22, topRight.x, topRight.y);
                    put = true;
                    break;
                }
                if (right.index == 0) {
                    map.putTile(22, right.x, right.y);
                    put = true;
                    break;
                }
                if (downRight.index == 0) {
                    map.putTile(22, downRight.x, downRight.y);
                    put = true;
                    break;
                }
                if (down.index == 0) {
                    map.putTile(22, down.x, down.y);
                    put = true;
                    break;
                }
                if (downLeft.index == 0) {
                    map.putTile(22, downLeft.x, downLeft.y);
                    put = true;
                    break;
                }
            }
            if (put) {
                break;
            }
        }
    }
    //started = false;
};

function floodFill(mapData, x, y, oldVal, newVal) {
    setTimeout(function () {
        var chosenTile = mapData.getTile(x, y);
        //mapData.putTile(22,chosenTile.x,chosenTile.y,null);
        oldVal = 0;


        var mapWidth = 32,
            mapHeight = 24;

        if (oldVal == null) {
            oldVal = mapData.getTile(x, y).index;
        }

        if (chosenTile.index !== oldVal) {
            return true;
        }

        mapData.putTile(newVal, chosenTile.x, chosenTile.y);

        //mapData[x][y] = newVal;

        if (x > 0) {

            floodFill(mapData, x - 1, y, oldVal, newVal);

        }

        if (y > 0) {
            floodFill(mapData, x, y - 1, oldVal, newVal);
        }

        if (x < mapWidth - 1) {
            floodFill(mapData, x + 1, y, oldVal, newVal);
        }

        if (y < mapHeight - 1) {
            floodFill(mapData, x, y + 1, oldVal, newVal);
        }
        
    }, 1000);
}


DGame.Game.prototype = {

    create: function () {

        MapHandler.Init({
            width: 32,
            height: 24,
            chanceToStartAlive: 0.4,
            birthLimit: 4,
            deathLimit: 3,
            numberOfSteps: 3,
        });
        world = MapHandler.GenerateMap();
        var csvData = MapHandler.GetAsCsvData(world);
        //  Add data to the cache
        this.cache.addTilemap('dynamicMap', null, csvData, Phaser.Tilemap.CSV);
        //  Create our map (the 16x16 is the tile size)
        map = this.game.add.tilemap('dynamicMap', 32, 32);
        //  'tiles' = cache image key, 16x16 = tile size
        map.addTilesetImage('tiles', 'tiles', 32, 32);
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
        map.setCollision([99, 11, 16, 6, 7, 8, 9, 14, 19, 24, 23, 22, 21, 20, 15, 10, 5, 12, 13, 17, 18]);
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

        if (this.input.activePointer.isDown) {
            if (this.time.now > nextClick) {
                nextClick = this.time.now + clickRate;
                chosenTile = map.getTileWorldXY(this.input.activePointer.x, this.input.activePointer.y, 32, 32);
                setTimeout(function () {
                    floodFill(map, chosenTile.x, chosenTile.y, null, 22, layer);
                }, 1000);
                started = true;
            }

        }

        // if (started && this.time.now > nextFill) {
        //     nextFill = this.time.now + fillRate;
        //     customFill();
        // }
    },
    render: function () {
        //this.game.debug.body(player);
        for (var y = 0; y < world[0].length; y++) {
            for (var x = 0; x < world.length; x++) {
                //this.game.debug.text(MapHandler.ClosedNeighbourCount(world,x,y,0), (x*32)+8, (y*32)+12);
                //this.game.debug.text(MapHandler.ClosedNeighbourCount(world,x,y), (x*32)+8, (y*32)+12);
                //this.game.debug.text(world[x][y], (x*32)+8, (y*32)+26);
                //this.game.debug.text(world[x][y], (x*32)+8, (y*32)+26);                
            }
        }
    }

};