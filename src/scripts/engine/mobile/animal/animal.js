function Animal(game, x, y, texture) {
    Mobile.call(this, game, x, y, texture);
    var self = this;
    this.destinationXY = [];
    this.lastMoveTime = game.time.now;
    this.lastSpeechTime = game.time.now;
    this.speechRate = 1000;
    this.speechChance = 1000;
    this.idleMovementRate = 1000;
    this.movementChance = 1000;

    this.point = 0;

    this.hitPlayer = function(player) {
        player.addPoint(self.point);
        self.destroy();
    };
}

Animal.prototype = Object.create(Mobile.prototype);
Animal.prototype.constructor = Animal;

Animal.prototype.moveToTile = function(path, animal) {
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
        tween.onComplete.add(function() {
            self.animations.stop();
        });
    }
    blocked = false;
}

Animal.prototype.update = function() {
    Mobile.prototype.update.call(this);
    if (this.alive) {
        //player animal collision check
        this.game.physics.arcade.collide(NuhMapHandler.Mobiles.Player, this, this.hitPlayer);

        //Idle movement implementation
        if (Math.floor(Math.random() * this.movementChance) === 0 && this.lastMoveTime + this.idleMovementRate < this.game.time.now) {
            var self = this;
            var neighbourTile = NuhMapHandler.Mobiles.GetRandomNeighbour(this);
            var tileEmpty = true;

            if (neighbourTile) {
                self.parent.forEachAlive(function(animal) {
                    var currentTile = animal.getTile();
                    if (currentTile.x == neighbourTile.x && currentTile.y == neighbourTile.y) {
                        tileEmpty = false;
                        //console.log("cant walk");
                    }
                }, this);
                //console.log("can walk"); 
                if (tileEmpty) {
                    NuhMapHandler.Mobiles.FindPathTo(this, neighbourTile, function(path) {
                        self.moveToTile(path, self)
                    });
                }
            }
        }

        //speech implementation    
        if (Math.floor(Math.random() * this.speechChance) === 0 && this.lastSpeechTime + this.speechRate < this.game.time.now) {
            var bubble = this.game.world.add(new SpeechBubble(this.game, this.x, this.y, null, this, this.speechText));
        }

        
    }
};