var NuhMapHandler = (function (my) {
    var map = null;
    var game = null;
    var layer = null;
    var forestGroup = null;
    var allGroups = null;

    var selfConfig = {
        world: {
            tiles: {
                indexes: {
                    dirts: [0, 3, 4, 5, 6, 7, 8, 9, 10],
                    trees: [1],
                    flood: [2]
                }
            }

        }
    };

    my.Init = function (pGame, csvData) {
        game = pGame;

        //  Add data to the cache
        game.cache.addTilemap('dynamicMap', null, csvData, Phaser.Tilemap.CSV);
        //  Create our map (the 16x16 is the tile size)
        map = game.add.tilemap('dynamicMap', 16, 16);
        //  'tiles' = cache image key, 16x16 = tile size
        map.addTilesetImage('tiles', 'tiles', 16, 16);

        map.setCollision(selfConfig.world.tiles.indexes.trees);

        //  Create our layer and scroll it
        layer = map.createLayer(0);
        layer.resizeWorld();
        // create our group

        allGroups = game.add.group();

        my.Builder.Init(game, map, layer, allGroups);
        my.Mobiles.Init(game, map, allGroups);

        allGroups.sort();
    };

    my.CountAliveNeighbours = function (x, y, aliveCellIndexArray) {
        var count = 0;
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                var nb_x = i + x;
                var nb_y = j + y;
                if (i === 0 && j === 0) {}
                //If it's at the edges, consider it to be solid (you can try removing the count = count + 1)
                else if (nb_x < 0 || nb_y < 0 ||
                    nb_x >= map.width ||
                    nb_y >= map.height) {
                    count = count + 1;
                } else {
                    var currentTile = map.getTile(nb_x, nb_y);
                    if (aliveCellIndexArray.indexOf(currentTile.index) != -1) {
                        count = count + 1;
                    }
                }
            }
        }
        return count;
    };

    my.Map = function () {
        return map;
    }

    my.Update = function () {
        allGroups.sort('y', Phaser.Group.SORT_ASCENDING);
    };

    return my;
}(NuhMapHandler || {}));

NuhMapHandler.Builder = (function (my, parent) {
    var map = null;
    var game = null;
    var layer = null;
    var forestGroup = null;

    my.FillForest = function () {
        //trees
        for (var i = 0; i < map.width; i++) {
            for (var j = 0; j < map.height; j++) {
                var currTile = map.getTile(i, j);
                if (currTile.index == 1) {
                    forestGroup.create(i * 16, (j * 16) - 10, 'trees', game.rnd.between(0, 2));
                }
            }
        }

        //shrubs
        for (var i = 0; i < map.width; i++) {
            for (var j = 0; j < map.height; j++) {
                var currTile = map.getTile(i, j);
                if (currTile.index == 0) {
                    if (game.rnd.between(0, 250) < 5) {
                        map.putTile(game.rnd.between(3, 8), i, j);
                    }
                }
            }
        }

        //grass
        for (var i = 0; i < world.length; i++) {
            for (var j = 0; j < world[0].length; j++) {
                var currTile = map.getTile(i, j);
                if (currTile.index == 0) {
                    if (game.rnd.between(0, 25) < 5) {
                        map.putTile(game.rnd.between(9, 11), i, j);
                    }
                }
            }
        }
    }

    my.Init = function (pGame, pMap, pLayer, pAllGroups) {
        map = pMap;
        game = pGame;
        layer = pLayer;
        allGroups = pAllGroups;
        forestGroup = game.add.group();
        allGroups.add(forestGroup);
    };

    return my;
}(NuhMapHandler.Builder || {}, NuhMapHandler));

NuhMapHandler.Mobiles = (function (my, parent) {

    var pathFinder = null;
    var game = null;
    var map = null;
    var mobilesGroup = null;
    var allGroups = null;
    var maxAnimalNumber = 10;

    var createAnimals = function (animalHiddenLimit) {
        var hiddenSpots = [];

        var shuffle = function () {
            var j, x, i;
            for (i = hiddenSpots.length; i; i--) {
                j = Math.floor(Math.random() * i);
                x = hiddenSpots[i - 1];
                hiddenSpots[i - 1] = hiddenSpots[j];
                hiddenSpots[j] = x;
            }
        }

        //How hidden does a spot need to be for animal?
        //I find animalHiddenLimit 5 or 6 is good. 6 for very rare.        
        for (var x = 0; x < map.width; x++) {
            for (var y = 0; y < map.height; y++) {
                var currentTile = map.getTile(x, y);
                if (currentTile.index == 0) {
                    var nbs = parent.CountAliveNeighbours(x, y, [0, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
                    if (nbs <= animalHiddenLimit) {
                        hiddenSpots.push(currentTile);
                    }
                }
            }
        }

        shuffle();
        var spawnedAnimalNumber = 0;
        for (var i = 0; i < hiddenSpots.length; i++) {

            if (spawnedAnimalNumber < hiddenSpots.length && spawnedAnimalNumber < maxAnimalNumber) {
                var pig = new Pig(game, hiddenSpots[i].worldX + hiddenSpots[i].width / 2, hiddenSpots[i].worldY + hiddenSpots[i].height / 2);
                mobilesGroup.add(pig);
                spawnedAnimalNumber++
            }
        }
    };

    my.Init = function (pGame, pMap, pAllGroups, pPathfinder) {
        map = pMap;
        game = pGame;
        allGroups = pAllGroups;
        pathfinder = pPathfinder;
        mobilesGroup = game.add.group();
        allGroups.add(mobilesGroup);
    };

    my.CreateAnimals = function () {
        createAnimals(3);
    };

    my.GetRandomNeighbour = function (mobile) {
        var count = 0;
        var tile = map.getTileWorldXY(mobile.x, mobile.y, 16, 16);
        var x = tile.x;
        var y = tile.y;
        var neighbours = [];

        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                var nb_x = i + x;
                var nb_y = j + y;
                if (i === 0 && j === 0) {}
                //If it's at the edges, consider it to be solid (you can try removing the count = count + 1)
                else if (nb_x < 0 || nb_y < 0 ||
                    nb_x >= map.width ||
                    nb_y >= map.height) {
                    count = count + 1;
                } else {
                    var currentTile = map.getTile(nb_x, nb_y);
                    if (currentTile.index == 0) {
                        neighbours.push(currentTile);
                    }
                }
            }
        }

        return neighbours[game.rnd.between(0, neighbours.length - 1)];
    }

    var moveSprite= function(mobile, worldX, worldY) {    
        //if (tween && tween.isRunning)    
        //{        
        //    tween.stop();    
        //}    
        //this.player.rotation = game.physics.angleToPointer(this.player, pointer);

    //  300 = 300 pixels per second = the speed the sprite will move at, regardless of the distance it has to travel    
        //var duration = (game.physics.distanceToPointer(this.player, pointer) / 300) * 1000;    
        game.add.tween(mobile).to({ x: worldX, y: worldY }, 1000, Phaser.Easing.Linear.None, true)
    ;}

    my.FindPathTo = function (mobile, destinationTile) {
        var selfMap = map;
        var startTile = map.getTileWorldXY(mobile.x, mobile.y);
        pathfinder.setCallbackFunction(function (path) {
            path = path || [];
            for (var i = 1, ilen = path.length; i < ilen; i++) {
                var currentDestinationTile = selfMap.getTile(path[i].x, path[i].y);
                //if (mobile.x != currentDestinationTile.worldX + 8 && mobile.y != currentDestinationTile.worldY + 8) {
                    //game.physics.arcade.moveToXY(mobile, currentDestinationTile.worldX + 8, currentDestinationTile.worldY + 8);
                    moveSprite(mobile,currentDestinationTile.worldX + 8,currentDestinationTile.worldY + 8);
                //}
                //map.putTile(46, path[i].x, path[i].y);
            }
            blocked = false;
        });

        pathfinder.preparePathCalculation([startTile.x, startTile.y], [destinationTile.x, destinationTile.y]);
        pathfinder.calculatePath();
    }

    return my;
}(NuhMapHandler.Mobiles || {}, NuhMapHandler));