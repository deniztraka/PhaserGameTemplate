function Ship(game, x, y) {
    var self = this;
    this.game = game;
    this.map = NuhMapHandler.Map();
    Phaser.Sprite.call(this, game, x, y, "ship");
    game.add.existing(this);
    this.anchor.setTo(0.5, 0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.inventory = new Inventory(50);

    this.hitPlayer = function (player) {
        if (player.inventory.hasItems()) {
            var playerItems = player.inventory.getItems();
            if (playerItems.length > 0) {
                player.inventory.removeItems();
                for (var i = 0; i < playerItems.length; i++) {
                    if (playerItems[i] != null) {
                        self.inventory.addItem(playerItems[i]);
                    }
                }
            }
            player.say("!!!");
        }
    };

    this.getTile = function () {
        return this.map.getTileWorldXY(this.x, this.y, 16, 16);
    }
}

Ship.prototype = Object.create(Phaser.Sprite.prototype);
Ship.prototype.constructor = Ship;

Ship.prototype.update = function () {
    //player animal collision check
    this.game.physics.arcade.overlap(NuhMapHandler.Mobiles.Player, this, this.hitPlayer);

};
