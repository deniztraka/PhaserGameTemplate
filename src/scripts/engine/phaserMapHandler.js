var NuhMapHandler = (function (my) {
    var _map = null;
    var _game = null;

    var selfConfig = {
        
        worldConfig: {
            tiles:{
                indexes:{
                    dirts: [0,3,4,5,6,7,8,9,10],            
                    trees: [1],
                    flood: [2]
                }
            }
            
        }
    };

    my.Init = function (game,map) {
        _map = map;
        _game = game;
        
        _map.setCollision([1]);

        my.Builder.Init(game,map);
    };

    my.Map = function(){
        return _map;
    }

    return my;
} (NuhMapHandler || {}));

NuhMapHandler.Builder = (function (my,parent) {
    var _map = null;
    var _game = null;

    my.FillForest= function (group) {
        //trees
        for (var i = 0; i < _map.width; i++) {
            for (var j = 0; j < _map.height; j++) {
                var currTile = _map.getTile(i, j);
                if (currTile.index == 1) {
                    group.create(i * 16, (j * 16) - 10, 'trees', _game.rnd.between(0, 2));
                }
            }
        }

        //shrubs
        for (var i = 0; i < _map.width; i++) {
            for (var j = 0; j < _map.height; j++) {
                var currTile = _map.getTile(i, j);
                if (currTile.index == 0) {
                    if (_game.rnd.between(0, 250) < 5) {
                        _map.putTile(_game.rnd.between(3, 8), i, j);
                    }
                }
            }
        }

        //grass
        for (var i = 0; i < world.length; i++) {
            for (var j = 0; j < world[0].length; j++) {
                var currTile = _map.getTile(i, j);
                if (currTile.index == 0) {
                    if (_game.rnd.between(0, 25) < 5) {
                        _map.putTile(_game.rnd.between(9, 11), i, j);
                    }
                }
            }
        }
    }

    my.Init = function (game,map) {
        _map = map;
        _game = game;
    };

    return my;
} (NuhMapHandler.Builder || {},NuhMapHandler));