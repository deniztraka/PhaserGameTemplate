var NuhMapHandler = (function(my) {
    var map = null;
    var game = null;
    var layer = null;
    var forestGroup = null;
    var allGroups = null;
    var pathFinder = null

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

    my.Init = function(pGame, csvData, pathfinder) {
        game = pGame;
        pathFinder = pathfinder;
        
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

        pathFinder.setGrid(map.layers[0].data, [0, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

        my.Builder.Init(game, map, layer, allGroups);
        my.Mobiles.Init(game, map, layer, allGroups, pathFinder);

        

        allGroups.sort();
    };

    my.CountAliveNeighbours = function(x, y, aliveCellIndexArray) {
        var count = 0;
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                var nb_x = i + x;
                var nb_y = j + y;
                if (i === 0 && j === 0) { }
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

    my.Map = function() {
        return map;
    }

    my.Update = function() {
        allGroups.sort('y', Phaser.Group.SORT_ASCENDING);
    };

    return my;
} (NuhMapHandler || {}));

NuhMapHandler.Builder = (function(my, parent) {
    var map = null;
    var game = null;
    var layer = null;
    var forestGroup = null;
    var floodStartTile = null;

    var floodFill = function (x, y, oldVal, newVal) {
        var self = this;
        setTimeout(function () {
            var chosenTile = map.getTile(x, y);
            var mapWidth = map.width;
            var mapHeight = map.height;

            if (oldVal == null) {
                oldVal = map.getTile(x, y).index;
            }

            var floorDetailsIndexArray = [3, 4, 5, 6, 7, 8, 9, 10, 11];
            if (floorDetailsIndexArray.indexOf(chosenTile.index) !== -1) {
                map.putTile(newVal, chosenTile.x, chosenTile.y);
            } else
            if (chosenTile.index !== oldVal) {
                return true;
            }



            map.putTile(newVal, chosenTile.x, chosenTile.y);

            if (x > 0) {
                floodFill( x - 1, y, oldVal, newVal);
            }

            if (y > 0) {
                floodFill( x, y - 1, oldVal, newVal);
            }

            if (x < mapWidth - 1) {
                floodFill( x + 1, y, oldVal, newVal);
            }

            if (y < mapHeight - 1) {
                floodFill(x, y + 1, oldVal, newVal);
            }

        }, 250);
    };

    my.FillForest = function() {
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
        for (var i = 0; i < map.width; i++) {
            for (var j = 0; j < map.height; j++) {
                var currTile = map.getTile(i, j);
                if (currTile.index == 0) {
                    if (game.rnd.between(0, 25) < 5) {
                        map.putTile(game.rnd.between(9, 11), i, j);
                    }
                }
            }
        }
    };

    my.InitFlood = function() {
        var placeFound = false;
        for (var i = map.width - 1; i >= 0; i--) {
            for (var j = map.height - 1; j >= 0; j--) {
                var currTile = map.getTile(i, j);
                if (currTile.index == 0 && !placeFound) {
                    placeFound = true;
                    floodStartTile = currTile;
                }
            }
        }
    };

    my.StartFlood = function () {        
        floodFill(floodStartTile.x, floodStartTile.y, 0, 2);
    };

    my.Init = function(pGame, pMap, pLayer, pAllGroups) {
        map = pMap;
        game = pGame;
        layer = pLayer;
        allGroups = pAllGroups;
        forestGroup = game.add.group();
        allGroups.add(forestGroup);
    };

    return my;
} (NuhMapHandler.Builder || {}, NuhMapHandler));

NuhMapHandler.Mobiles = (function(my, parent) {
    var player = null;
    var layer = null;
    var pathFinder = null;
    var game = null;
    var map = null;
    var mobilesGroup = null;
    var allGroups = null;
    var maxAnimalNumber = 20;

    my.Player = null;

    var createAnimals = function(animalHiddenLimit) {
        var hiddenSpots = [];

        var shuffle = function() {
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
                var animal = null;
                switch (game.rnd.between(0, 5)) {
                    case 0:
                        animal = new Cat(game.game, hiddenSpots[i].worldX + hiddenSpots[i].width / 2, hiddenSpots[i].worldY + hiddenSpots[i].height / 2);
                        break;
                    case 1:
                        animal = new Chicken(game.game, hiddenSpots[i].worldX + hiddenSpots[i].width / 2, hiddenSpots[i].worldY + hiddenSpots[i].height / 2);
                        break;
                    case 2:
                        animal = new Bunny(game.game, hiddenSpots[i].worldX + hiddenSpots[i].width / 2, hiddenSpots[i].worldY + hiddenSpots[i].height / 2);
                        break;
                    case 3:
                        animal = new Frog(game.game, hiddenSpots[i].worldX + hiddenSpots[i].width / 2, hiddenSpots[i].worldY + hiddenSpots[i].height / 2);
                        break;
                    case 4:
                        animal = new Tiger(game.game, hiddenSpots[i].worldX + hiddenSpots[i].width / 2, hiddenSpots[i].worldY + hiddenSpots[i].height / 2);
                        break;
                    case 5:
                        animal = new Lion(game.game, hiddenSpots[i].worldX + hiddenSpots[i].width / 2, hiddenSpots[i].worldY + hiddenSpots[i].height / 2);
                        break;
                }

                mobilesGroup.add(animal);
                spawnedAnimalNumber++
            }
        }
    };

    my.Init = function(pGame, pMap, pLayer, pAllGroups, pathfinder) {
        map = pMap;
        game = pGame;
        allGroups = pAllGroups;
        layer = pLayer;
        pathFinder = pathfinder;
        mobilesGroup = game.add.group();
        allGroups.add(mobilesGroup);
    };

    my.CreateAnimals = function() {
        createAnimals(3);
    };

    my.CreatePlayer = function() {
        var placeFound = false;
        for (var i = 0; i < map.width; i++) {
            for (var j = 0; j < map.height; j++) {
                var currTile = map.getTile(i, j);
                if (currTile.index == 0 && !placeFound) {
                    placeFound = true;
                    my.Player = new Player(game.game, currTile.worldX + currTile.width / 2, currTile.worldY + currTile.height / 2, layer);
                }
            }
        }
    };

    my.GetRandomNeighbour = function(mobile) {
        var count = 0;
        var tile = map.getTileWorldXY(mobile.x, mobile.y, 16, 16);
        var x = tile.x;
        var y = tile.y;
        var neighbours = [];

        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                var nb_x = i + x;
                var nb_y = j + y;
                if (i === 0 && j === 0) { }
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

    my.FindPathTo = function(mobile, destinationTile, callBackFunction) {
        var selfMap = map;
        var startTile = map.getTileWorldXY(mobile.x, mobile.y);
        pathFinder.setCallbackFunction(callBackFunction);

        pathFinder.preparePathCalculation([startTile.x, startTile.y], [destinationTile.x, destinationTile.y]);
        pathFinder.calculatePath();
    }

    return my;
} (NuhMapHandler.Mobiles || {}, NuhMapHandler));