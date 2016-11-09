var MapHandler = (function (my) {
    var world = [[]];
    var secureSelf = {
        configurations: {
            chanceToStartAlive: 0.4,
            birthLimit: 4,
            deathLimit: 3,
            numberOfSteps:5,
            width: 64,
            height: 48
        },
        initializeMap: function (isRandom, map) {
            for (var x = 0; x < this.configurations.width; x++) {
                map[x] = [];
                for (var y = 0; y < this.configurations.height; y++) {
                    map[x][y] = 0;
                }
            }

            if (isRandom) {
                for (var xx = 0; xx < this.configurations.width; xx++) {
                    for (var yy = 0; yy < this.configurations.height; yy++) {

                        if (Math.random() < this.configurations.chanceToStartAlive) {
                            //We're using numbers, not booleans, to decide if something is solid here. 0 = not solid
                            map[xx][yy] = 1;
                        }
                    }
                }
            }            
            return map;
        },
        initOptions: function (options) {
            this.configurations.width = options.width;
            this.configurations.height = options.height;
        }
    };

    var countAliveNeighbours = function (map, x, y) {
        var count = 0;
        for(var i = -1; i < 2; i++){
            for(var j = -1; j < 2; j++){
                var nb_x = i+x;
                var nb_y = j+y;
                if(i === 0 && j === 0){
                }
                //If it's at the edges, consider it to be solid (you can try removing the count = count + 1)
                else if(nb_x < 0 || nb_y < 0 ||
                        nb_x >= map.length ||
                        nb_y >= map[0].length){
                    count = count + 1;   
                }
                else if(map[nb_x][nb_y] === 1){
                    count = count + 1;
                }
            }
        }
        return count;
    };

    var doSimulationStep = function (map) {
        //Here's the new map we're going to copy our data into
        var newmap = [[]];
        for(var x = 0; x < map.length; x++){
            newmap[x] = [];
            for(var y = 0; y < map[0].length; y++)
            {    
                //Count up the neighbours
                var nbs = countAliveNeighbours(map, x, y);
                //If the tile is currently solid
                if(map[x][y] > 0){
                    //See if it should die
                    if(nbs < secureSelf.configurations.deathLimit){
                        newmap[x][y] = 0;
                    }
                    //Otherwise keep it solid
                    else{
                        newmap[x][y] = 1;   
                    }
                }
                //If the tile is currently empty
                else{
                    //See if it should become solid
                    if(nbs > secureSelf.configurations.birthLimit){
                        newmap[x][y] = 1;       
                    }
                    else{
                        newmap[x][y] = 0;      
                    }
                }
            }
        }
        
        return newmap;
    };

    var generateMap = function () {
        var map = [[]];
        //And randomly scatter solid blocks
        map = secureSelf.initializeMap(true, map);

        //Then, for a number of steps
        for (var i = 0; i < secureSelf.configurations.numberOfSteps; i++) {
            //We apply our simulation rules!
            map = doSimulationStep(map);
        }

        //And we're done!
        return map;
    };

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

    my.Init = function (options) {
        secureSelf.initOptions(options);
        mapData = generateMap();
        //logMap();
    };

    my.GetAsCsvData = function () {
        var csvData = "";
        for (var y = 0; y < secureSelf.configurations.height; y++) {
            for (var x = 0; x < secureSelf.configurations.width; x++) {
                csvData += mapData[x][y];
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