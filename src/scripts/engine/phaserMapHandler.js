var NuhMapHandler = (function (my) {
    var map = null;
    var game = null;
    var layer = null;
    var group = null;

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
        group = game.add.group();

        my.Builder.Init(game, map, layer, group);

        group.sort();
    };

    my.Map = function () {
        return map;
    }

    my.Update = function () {
        group.sort('y', Phaser.Group.SORT_ASCENDING);
    };

    return my;
} (NuhMapHandler || {}));

NuhMapHandler.Builder = (function (my, parent) {
    var map = null;
    var game = null;
    var layer = null;
    var group = null;

    my.FillForest = function () {
        //trees
        for (var i = 0; i < map.width; i++) {
            for (var j = 0; j < map.height; j++) {
                var currTile = map.getTile(i, j);
                if (currTile.index == 1) {
                    group.create(i * 16, (j * 16) - 10, 'trees', game.rnd.between(0, 2));
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

    my.Init = function (pGame, pMap, pLayer, pGroup) {
        map = pMap;
        game = pGame;
        layer = pLayer;
        group = pGroup;
    };

    return my;
} (NuhMapHandler.Builder || {}, NuhMapHandler));