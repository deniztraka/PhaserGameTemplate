var fovMap = null;
function ShadowLine() {
    this.shadows = [];
    this.isInShadow = function (projection) {
        if (this.shadows.length > 0) {
            for (var shadow in this.shadows) {
                if (shadow.contains(projection)) return true;
            }
        }
    }

    this.isFullShadow = function () {
        return this.shadows.length == 1 &&
            this.shadows[0].start == 0 &&
            this.shadows[0].end == 1;
    }

    this.add = function (shadow) {
        // Figure out where to slot the new shadow in the list.
        var index = 0;
        for (index; index < _shadows.length; index++) {
            // Stop when we hit the insertion point.
            if (this.shadows[index].start >= shadow.start) break;
        }

        // The new shadow is going here. See if it overlaps the
        // previous or next.
        var overlappingPrevious;
        if (index > 0 && this.shadows[index - 1].end > shadow.start) {
            overlappingPrevious = _shadows[index - 1];
        }

        var overlappingNext;
        if (index < this.shadows.length &&
            this.shadows[index].start < shadow.end) {
            overlappingNext = this.shadows[index];
        }

        // Insert and unify with overlapping shadows.
        if (overlappingNext != null) {
            if (overlappingPrevious != null) {
                // Overlaps both, so unify one and delete the other.
                overlappingPrevious.end = overlappingNext.end;

                this.shadows.splice(index, 1);
            } else {
                // Overlaps the next one, so unify it with that.
                overlappingNext.start = shadow.start;
            }
        } else {
            if (overlappingPrevious != null) {
                // Overlaps the previous one, so unify it with that.
                overlappingPrevious.end = shadow.end;
            } else {
                // Does not overlap anything, so insert.
                this.shadows.splice(index, 0, shadow);
            }
        }
    }

    return false;
}

function Shadow(start, end) {
    this.start = start;
    this.end = end;

    this.contains = function (other) {
        return this.start <= other.start && this.end >= other.end;
    }

}

var transformOctant = function (row, col, octant, playerTile) {
    var maxDistance = 5;
    switch (octant) {
        case 0:

            for (var row = 1; row < maxDistance; row++) {
                for (var col = 0; col <= row; col++) {
                    var x = playerTile.x + col;
                    var y = playerTile.y - row;

                    return fovMap.getTile(x, y);
                }
            }
            break;
        case 1:
            for (var row = 1; row < maxDistance; row++) {
                for (var col = 0; col <= row; col++) {
                    var x = playerTile.x + row;
                    var y = playerTile.y - col;

                     return fovMap.getTile(x, y);
                }
            }
            break;
        case 2:
            for (var row = 1; row < maxDistance; row++) {
                for (var col = 0; col <= row; col++) {
                    var x = playerTile.x + row;
                    var y = playerTile.y + col;

                    return fovMap.getTile(x, y);
                }
            }
            break;
        case 3:
            for (var row = 1; row < maxDistance; row++) {
                for (var col = 0; col <= row; col++) {
                    var x = playerTile.x + col;
                    var y = playerTile.y + row;

                     return fovMap.getTile(x, y);
                }
            }

            break;
        case 4:
            for (var row = 1; row < maxDistance; row++) {
                for (var col = 0; col <= row; col++) {
                    var x = playerTile.x - col;
                    var y = playerTile.y + row;

                     return fovMap.getTile(x, y);
                }
            }
            break;
        case 5:
            for (var row = 1; row < maxDistance; row++) {
                for (var col = 0; col <= row; col++) {
                    var x = playerTile.x - row;
                    var y = playerTile.y + col;

                     return fovMap.getTile(x, y);
                }
            }
            break;
        case 6:
            for (var row = 1; row < maxDistance; row++) {
                for (var col = 0; col <= row; col++) {
                    var x = playerTile.x - row;
                    var y = playerTile.y - col;

                    return fovMap.getTile(x, y);
                }
            }
            break;
        case 7:
            for (var row = 1; row < maxDistance; row++) {
                for (var col = 0; col <= row; col++) {
                    var x = playerTile.x - col;
                    var y = playerTile.y - row;

                    return fovMap.getTile(x, y);
                }
            }
            break;
    }
    
}

var transformOctantTiles = function (row, col, octant, playerTile) {
    var maxDistance = 5;
    var tiles = [];
    switch (octant) {
        case 0:

            for (var row = 1; row < maxDistance; row++) {
                for (var col = 0; col <= row; col++) {
                    var x = playerTile.x + col;
                    var y = playerTile.y - row;

                    tiles.push(fovMap.getTile(x, y));
                }
            }
            break;
        case 1:
            for (var row = 1; row < maxDistance; row++) {
                for (var col = 0; col <= row; col++) {
                    var x = playerTile.x + row;
                    var y = playerTile.y - col;

                    tiles.push(fovMap.getTile(x, y));
                }
            }
            break;
        case 2:
            for (var row = 1; row < maxDistance; row++) {
                for (var col = 0; col <= row; col++) {
                    var x = playerTile.x + row;
                    var y = playerTile.y + col;

                    tiles.push(fovMap.getTile(x, y));
                }
            }
            break;
        case 3:
            for (var row = 1; row < maxDistance; row++) {
                for (var col = 0; col <= row; col++) {
                    var x = playerTile.x + col;
                    var y = playerTile.y + row;

                    tiles.push(fovMap.getTile(x, y));
                }
            }

            break;
        case 4:
            for (var row = 1; row < maxDistance; row++) {
                for (var col = 0; col <= row; col++) {
                    var x = playerTile.x - col;
                    var y = playerTile.y + row;

                    tiles.push(fovMap.getTile(x, y));
                }
            }
            break;
        case 5:
            for (var row = 1; row < maxDistance; row++) {
                for (var col = 0; col <= row; col++) {
                    var x = playerTile.x - row;
                    var y = playerTile.y + col;

                    tiles.push(fovMap.getTile(x, y));
                }
            }
            break;
        case 6:
            for (var row = 1; row < maxDistance; row++) {
                for (var col = 0; col <= row; col++) {
                    var x = playerTile.x - row;
                    var y = playerTile.y - col;

                    tiles.push(fovMap.getTile(x, y));
                }
            }
            break;
        case 7:
            for (var row = 1; row < maxDistance; row++) {
                for (var col = 0; col <= row; col++) {
                    var x = playerTile.x - col;
                    var y = playerTile.y - row;

                   tiles.push(fovMap.getTile(x, y));
                }
            }
            break;
    }
    return tiles;


    
}



function projectTile(row, col) {
    var topLeft = col / (row + 2);
    var bottomRight = (col + 1) / (row + 1);
    return new Shadow(topLeft, bottomRight);
}


var refreshVisibility = function (mobileTile) {
    for (var octant = 0; octant < 8; octant++) {
        refreshOctant(mobileTile, octant);
    }
}

var refreshOctant = function (mobileTile, octant) {
    var line = new ShadowLine();
    var fullShadow = false;

    for (var row = 1; row <= 5; row++) {
        // Stop once we go out of bounds.
        // var pos = transformOctant(row, 0, octant, mobileTile);
        // var octantTiles = transformOctantTiles(row, 0, octant, mobileTile);
        // octantTiles.push(mobileTile);
        // if (octantTiles.indexOf(pos) == -1) {
        //     debugger;
        //     break;
        // }

        for (var col = 0; col <= row; col++) {
         
            var pos = transformOctant(row, col, octant, mobileTile)
            pos.alpha = 0;
            // pos = transformOctant(row, col, octant, mobileTile);

            // // If we've traversed out of bounds, bail on this row.
            // octantTiles = transformOctantTiles(row, 0, octant, mobileTile);
            // octantTiles.push(mobileTile);
            // if (octantTiles.indexOf(pos) == -1) {
            //     debugger;
            //     break;
            // }
            // var tileProcessing = fovMap.getTile(pos.x, pos.y);
            // console.log(tileProcessing.x + "," + tileProcessing.y + " " + tileProcessing.index);
            // if (fullShadow) {
            //     tileProcessing.visible = false;
            //     //console.log(pos.x +","+ pos.y + " " + false );
            // } else {
            //     var projection = projectTile(row, col);

            //     // Set the visibility of this tile.
            //     var visible = !line.isInShadow(projection);
            //     tileProcessing.visible = visible;
            //     //console.log(pos.x +","+ pos.y + " " + visible );

            //     // Add any opaque tiles to the shadow map.

            //     if (visible && tileProcessing.index == 1) {
            //         line.add(projection);
            //         fullShadow = line.isFullShadow();
            //     }
            // }
        }
    }
}