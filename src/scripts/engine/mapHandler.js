var MapHandler = (function (my) {
    var world = [
        []
    ];
    var secureSelf = {
        configurations: {
            chanceToStartAlive: 0.4,
            birthLimit: 4,
            deathLimit: 3,
            numberOfSteps: 5,
            width: 64,
            height: 48
        },
        worldConfig: {
            openCellId: 0,
            closeCellId: 11,
            closeCellIdX: 16,
            closeN0: 6,
            closeN1: 7,
            closeN2: 8,
            closeNE: 9,
            closeE0: 14,
            closeE1: 19,
            closeSE: 24,
            closeS0: 23,
            closeS1: 22,
            closeS2: 21,
            closeSW: 20,
            closeW0: 15,
            closeW1: 10,
            closeNW: 5,
            closeCurveSE: 12,
            closeCurveSW: 13,
            closeCurveNE: 17,
            closeCurveNW: 18,
            fillMapId: 1000,
            floodFillId: 30
        },
        initOptions: function (options) {
            this.configurations.width = options.width;
            this.configurations.height = options.height;
            this.configurations.chanceToStartAlive = options.chanceToStartAlive;
            this.configurations.deathLimit = options.deathLimit;
            this.configurations.birthLimit = options.birthLimit;
            this.configurations.numberOfSteps = options.numberOfSteps;
        }
    };

    var initializeMap = function (isRandom, map) {
        for (var x = 0; x < secureSelf.configurations.width; x++) {
            map[x] = [];
            for (var y = 0; y < secureSelf.configurations.height; y++) {
                map[x][y] = secureSelf.worldConfig.openCellId;
            }
        }

        if (isRandom) {
            for (var xx = 0; xx < secureSelf.configurations.width; xx++) {
                for (var yy = 0; yy < secureSelf.configurations.height; yy++) {

                    if (Math.random() < secureSelf.configurations.chanceToStartAlive) {
                        //We're using numbers, not booleans, to decide if something is solid here. 0 = not solid
                        map[xx][yy] = secureSelf.worldConfig.fillMapId;
                    }
                }
            }
        }
        return map;
    };

    var countAliveNeighbours = function (map, x, y) {
        var count = 0;
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                var nb_x = i + x;
                var nb_y = j + y;
                if (i === 0 && j === 0) { }
                //If it's at the edges, consider it to be solid (you can try removing the count = count + 1)
                else if (nb_x < 0 || nb_y < 0 ||
                    nb_x >= map.length ||
                    nb_y >= map[0].length) {
                    count = count + 1;
                } else if (map[nb_x][nb_y] !== secureSelf.worldConfig.openCellId) {
                    count = count + 1;
                }
            }
        }
        return count;
    };

    var doSimulationStep = function (map) {
        //Here's the new map we're going to copy our data into
        var newmap = [
            []
        ];
        for (var x = 0; x < map.length; x++) {
            newmap[x] = [];
            for (var y = 0; y < map[0].length; y++) {
                //Count up the neighbours
                var nbs = countAliveNeighbours(map, x, y);
                //If the tile is currently solid
                if (map[x][y] > 0) {
                    //See if it should die
                    if (nbs < secureSelf.configurations.deathLimit) {
                        newmap[x][y] = secureSelf.worldConfig.openCellId;
                    }
                    //Otherwise keep it solid
                    else {
                        newmap[x][y] = secureSelf.worldConfig.fillMapId;
                    }
                }
                //If the tile is currently empty
                else {
                    //See if it should become solid
                    if (nbs > secureSelf.configurations.birthLimit) {
                        newmap[x][y] = secureSelf.worldConfig.fillMapId;
                    } else {
                        newmap[x][y] = secureSelf.worldConfig.openCellId;;
                    }
                }
            }
        }

        return newmap;
    };

    var placeTreasure = function (world, treasureHiddenLimit) {
        //How hidden does a spot need to be for treasure?
        //I find treasureHiddenLimit 5 or 6 is good. 6 for very rare treasure.        
        for (var x = 0; x < worldWidth; x++) {
            for (var y = 0; y < worldHeight; y++) {
                if (world[x][y] == 0) {
                    var nbs = countAliveNeighbours(world, x, y);
                    if (nbs >= treasureHiddenLimit) {
                        world[x][y] = 2;
                    }
                }
            }
        }

        return world;
    };
    var fillForest = function (map) {
        map = randomizeForestInside(map);
        map = normalizeEdges(map);        
        //map = fixForestBugs(map);
        return map;
    }

    var fixForestBugs = function (map) {
        // for (var x = 0; x < map.length; x++) {
        //     for (var y = 0; y < map[0].length; y++) {
        //         if (map[x - 1] && map[x + 1] && map[x][y] != secureSelf.worldConfig.openCellId &&
        //             (
        //                 (
        //                     map[x][y + 1] == secureSelf.worldConfig.openCellId &&
        //                     map[x][y - 1] == secureSelf.worldConfig.openCellId
        //                 ) ||
        //                 (
        //                     map[x - 1][y] == secureSelf.worldConfig.openCellId &&
        //                     map[x + 1][y] == secureSelf.worldConfig.openCellId

        //                 )
        //             )
        //         ) {
        //             map[x][y] = 31;
        //             if (map[x][y - 1] == secureSelf.worldConfig.openCellId) {
        //                 map[x][y - 1] = 26;
        //             }
        //         }
        //     }
        // }

        // for (var x = 0; x < map.length; x++) {
        //     for (var y = 0; y < map[0].length; y++) {
        //         if (map[x][y] == 31) {
        //             if (
        //                 map[x][y + 1] == 31
        //                 || map[x][y + 1] == secureSelf.worldConfig.closeS0
        //                 || map[x][y + 1] == secureSelf.worldConfig.closeS1
        //                 || map[x][y + 1] == secureSelf.worldConfig.closeS2
        //                 || map[x][y + 1] == secureSelf.worldConfig.closeSW
        //                 || map[x][y + 1] == secureSelf.worldConfig.closeSE) {
        //                 map[x][y] = secureSelf.worldConfig.openCellId;
        //             }
        //         }
        //     }
        // }

        for (var x = 0; x < map.length; x++) {
            for (var y = 0; y < map[0].length; y++) {
                if (x < 0 || y < 0 ||
                    x >= map.length ||
                    y >= map[0].length) {

                    var aliveNeighbourCont = countAliveNeighbours(map, x, y);
                    if (aliveNeighbourCont == 5) {
                        debugger;
                        //map[x][y] = 99;//secureSelf.worldConfig.openCellId;
                    }
                }
            }
        }



        return map;
    }

    var randomizeForestInside = function (map) {
        for (var y = 0; y < map[0].length; y++) {
            for (var x = 0; x < map.length; x++) {
                if (countAliveNeighbours(map, x, y) == 8) {
                    debugger;
                    map[x][y] = Math.random() < 0.5 ? secureSelf.worldConfig.closeCellId : secureSelf.worldConfig.closeCellIdX;
                }
            }
        }
        return map;
    };

    var getSENeighbour = function (map, x, y) {
        return map[x + 1][y + 1];
    };

    var getSWNeighbour = function (map, x, y) {
        return map[x - 1][y + 1];
    };

    var getNENeighbour = function (map, x, y) {
        return map[x + 1][y - 1];
    };

    var getNWNeighbour = function (map, x, y) {
        return map[x - 1][y - 1];
    };

    var getENeighbour = function (map, x, y) {
        return map[x + 1][y];
    };

    var getWNeighbour = function (map, x, y) {
        return map[x - 1][y];
    };

    var getNNeighbour = function (map, x, y) {
        return map[x][y - 1];
    };

    var getSNeighbour = function (map, x, y) {
        return map[x][y + 1];
    };

    var normalizeEdges = function (map) {
        for (var x = 0; x < map.length; x++) {
            for (var y = 0; y < map[0].length; y++) {
                if (map[x][y] == secureSelf.worldConfig.fillMapId) {
                    console.log("asd");
                    map[x][y] == Math.random() > 0.5 ? secureSelf.worldConfig.closeCellId : secureSelf.worldConfig.closeCellIdX;
                }


                if (map[x] && map[x][y] == secureSelf.worldConfig.openCellId) {
                    if (map[x + 1] && map[x - 1]) {



                        // if (getNNeighbour(map,x,y) == secureSelf.worldConfig.fillMapId &&
                        //     getNENeighbour(map,x,y) == secureSelf.worldConfig.fillMapId &&
                        //     getNWNeighbour(map,x,y) == secureSelf.worldConfig.fillMapId &&
                        //     getSNeighbour(map,x,y) == secureSelf.worldConfig.openCellId
                        // ) {
                        //     map[x][y] = Utils.Random.Int(22, 24);
                        // }                        
                    }
                }
            }
        }
        return map;
    }

    var logMap = function () {
        var logString = "";
        for (var y = 0; y < secureSelf.configurations.height; y++) {
            for (var x = 0; x < secureSelf.configurations.width; x++) {
                if (mapData[x][y]) {
                    logString += "#";
                } else {
                    logString += ".";
                }
                if (x == secureSelf.configurations.width - 1) {
                    logString += "\n";
                }
            }
        }
        console.log(mapData);
        console.log(logString);
    };

    function floodFill(mapData, x, y, oldVal, newVal) {
        var mapWidth = mapData.length,
            mapHeight = mapData[0].length;

        if (oldVal == null) {
            oldVal = mapData[x][y];
        }

        if (mapData[x][y] !== oldVal) {
            return true;
        }

        mapData[x][y] = newVal;

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
    }

    var buildRandomWorld = function (map) {
        //And randomly scatter solid blocks
        map = initializeMap(true, map);;

        //Then, for a number of steps
        for (var i = 0; i < secureSelf.configurations.numberOfSteps; i++) {
            //We apply our simulation rules!
            map = doSimulationStep(map);
        }

        //closing edges
        for (var x = 0; x < map.length; x++) {
            for (var y = 0; y < map[0].length; y++) {
                if (x == map.length - 1 || x == 0 || y == map[0].length - 1 || y == 0) {
                    map[x][y] = secureSelf.worldConfig.fillMapId;
                }
            }
        }

        //random map is generated
        //now trying to shutdown closed areas            
        var openCellFound = false;
        while (!openCellFound) {
            var closedCellCount = 0;
            var randomX = Utils.Random.Int(0, map.length);
            var randomY = Utils.Random.Int(0, map[0].length);
            if (map[randomX][randomY] == secureSelf.worldConfig.openCellId) {
                openCellFound = true; //we found an open cell

                floodFill(map, randomX, randomY, 0, secureSelf.worldConfig.floodFillId);

                //set wall other open areas
                for (var x = 0; x < map.length; x++) {
                    for (var y = 0; y < map[0].length; y++) {
                        if (map[x][y] == secureSelf.worldConfig.openCellId) {
                            map[x][y] = secureSelf.worldConfig.fillMapId;
                        }
                    }
                }

                //set open flooded areas
                for (var x = 0; x < map.length; x++) {
                    for (var y = 0; y < map[0].length; y++) {
                        if (map[x][y] == secureSelf.worldConfig.floodFillId) {
                            map[x][y] = secureSelf.worldConfig.openCellId;
                        }
                    }
                }
            }
        }
        return map;
    };

    var checkMapIsOkey = function (map) {
        var checkIsMapOkey = false;
        var closedCellCount = 0;
        for (var x = 0; x < map.length; x++) {
            for (var y = 0; y < map[0].length; y++) {
                if (map[x][y] == secureSelf.worldConfig.fillMapId) {
                    closedCellCount++;
                }
            }
        }
        var closedRate = closedCellCount / (map.length * map[0].length);
        if (closedRate < 0.5) {
            checkIsMapOkey = true;
        }
        return checkIsMapOkey;
    };

    my.Init = function (options) {
        secureSelf.initOptions(options);
    };

    my.GenerateMap = function () {
        var tryCount = 0;
        var maxTryCount = 20;
        var isMapOkey = false;
        while (!isMapOkey && tryCount < maxTryCount) {
            map = buildRandomWorld([[]]);
            isMapOkey = checkMapIsOkey(map);
            if (isMapOkey) {
                mapData = map;
            }
            tryCount++;
        }
        if (tryCount >= maxTryCount) {
            console.log("yemedi");
        };
        //world is randomized in here 
        logMap();
        mapData = fillForest(map);
        
        //And we're done!
        return mapData;
    };

    my.GetAsCsvData = function (map) {
        var csvData = "";
        for (var y = 0; y < map[0].length; y++) {
            for (var x = 0; x < map.length; x++) {
                csvData += map[x][y];
                if (x < secureSelf.configurations.width - 1) {
                    csvData += ',';
                }
            }
            if (y < secureSelf.configurations.height - 1) {
                csvData += "\n";
            }
        }
        return csvData;
    };

    return my;
} (MapHandler || {}));