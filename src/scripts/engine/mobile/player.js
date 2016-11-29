function Player(game, x, y) {
    Mobile.call(this, game, x, y, "player");
    this.cursors = game.input.keyboard.createCursorKeys();
    this.animations.add('left', [9, 10, 11, 12, 13, 14, 15, 16, 17], 10, true);
    this.animations.add('down', [18, 19, 20, 21, 22, 23, 24, 25, 26], 10, true);
    this.animations.add('up', [0, 1, 2, 3, 4, 5, 6, 7, 8], 10, true);
    this.animations.add('right', [27, 28, 29, 30, 31, 32, 33, 34], 10, true);


    game.physics.enable(this, Phaser.Physics.ARCADE);
    game.camera.follow(this);
    //this.body.setSize(10, 14, 2, 1);
    //// Player
    //// player = group.create(48, 48, 'player');
    //// player.animations.add('left', [8, 9], 10, true);
    //// player.animations.add('right', [1, 2], 10, true);
    //// player.animations.add('up', [11, 12, 13], 10, true);
    //// player.animations.add('down', [4, 5, 6], 10, true);
    //// this.physics.enable(player, Phaser.Physics.ARCADE);
    this.body.setSize(15, 15, 8, 16);
    //// this.camera.follow(player);
    
        
}

Player.prototype = Object.create(Mobile.prototype);
Player.prototype.constructor = Player;


Player.prototype.update = function () {
    Mobile.prototype.update.call();
    this.game.physics.arcade.collide(this, NuhMapHandler.layer);

    this.body.velocity.set(0);

    if (this.cursors.left.isDown) {
        this.body.velocity.x = -100;
        this.play('left');
    } else if (this.cursors.right.isDown) {
        this.body.velocity.x = 100;
        this.play('right');
    } else if (this.cursors.up.isDown) {
        this.body.velocity.y = -100;
        this.play('up');
    } else if (this.cursors.down.isDown) {
        this.body.velocity.y = 100;
        this.play('down');
    } else {
        this.animations.stop();
    }
};

Player.prototype.render = function () {
    Mobile.prototype.render.call(this);       
};