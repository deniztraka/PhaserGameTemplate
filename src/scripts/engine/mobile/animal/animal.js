function Animal(game, x, y, texture) {
    Mobile.call(this, game, x, y, texture);
    this.destinationXY = [];
    this.lastMoveTime = game.time.now;
    this.idleMovementRate = 1000;
}

Animal.prototype = Object.create(Mobile.prototype);
Animal.prototype.constructor = Animal;

Animal.prototype.moveToTile = function (path, animal) {
    path = path || [];
    var map = NuhMapHandler.Map();

    for (var i = 1, ilen = path.length; i < ilen; i++) {

        var currentDestinationTile = map.getTile(path[i].x, path[i].y);

        if (animal.x != currentDestinationTile.worldX + 8) {
            if (animal.x < currentDestinationTile.worldX + 8) {
                this.animations.play('right');
            } else {
                this.animations.play('left');
            }
        } else {
            if (animal.y < currentDestinationTile.worldY + 8) {
                this.animations.play('down');
            } else {
                this.animations.play('up');
            }
        }
        var self = this;
        animal.lastMoveTime = animal.game.time.now;
        var tween = animal.game.add.tween(animal).to({ x: currentDestinationTile.worldX + 8, y: currentDestinationTile.worldY + 8 }, this.idleMovementRate, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(function(){
            self.animations.stop();
        });
    }
    blocked = false;
}

Animal.prototype.update = function () {
    //console.log("Mobile update called.");


    if (Math.floor(Math.random() * 1000) === 0 && this.lastMoveTime + this.idleMovementRate < this.game.time.now) {
        var self = this;
        var neighbourTile = NuhMapHandler.Mobiles.GetRandomNeighbour(this);
        if (neighbourTile) {
            //console.log(NuhMapHandler.Mobiles.GetRandomNeighbour(this));            
            NuhMapHandler.Mobiles.FindPathTo(this, neighbourTile, function (path) {
                self.moveToTile(path, self)
            });
        }
    }
};