function Player(game, x, y, collisionLayer) {
    Mobile.call(this, game, x, y, "player");
    this.cursors = game.input.keyboard.createCursorKeys();
    this.animations.add('left', [9, 10, 11, 12, 13, 14, 15, 16, 17], 10, true);
    this.animations.add('down', [18, 19, 20, 21, 22, 23, 24, 25, 26], 10, true);
    this.animations.add('up', [0, 1, 2, 3, 4, 5, 6, 7, 8], 10, true);
    this.animations.add('right', [27, 28, 29, 30, 31, 32, 33, 34], 10, true);
    this.collisionLayer = collisionLayer;
    this.inventory = new Inventory(2);
    this.say = function(message){
        var bubble = this.game.world.add(new SpeechBubble(this.game, this.x, this.y, null, this, message));
    }
    this.pickUp = function(object){
        var pickUpResult =  this.inventory.addItem(object);
        var pickUpMessage = "";
        if(pickUpResult){
            pickUpMessage = "yay :)";
        }else{
            pickUpMessage = "my inventory is full :(";
        }

        this.say(pickUpMessage);
        return pickUpResult;
    }

    this.score = 0;
    this.addPoint = function (point) {
        this.score += point;
    };

    game.physics.enable(this, Phaser.Physics.ARCADE);
    game.camera.follow(this);
    this.body.setSize(13, 13, 9, 16);
}

Player.prototype = Object.create(Mobile.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function () {
    Mobile.prototype.update.call(this);
    if (this.alive) {
        //player map collision set
        this.game.physics.arcade.collide(this, this.collisionLayer);

        this.body.velocity.set(0);
        if (this.cursors.left.isDown) {
            this.body.velocity.x = -50;
            this.play('left');
        } else if (this.cursors.right.isDown) {
            this.body.velocity.x = 50;
            this.play('right');
        } else if (this.cursors.up.isDown) {
            this.body.velocity.y = -50;
            this.play('up');
        } else if (this.cursors.down.isDown) {
            this.body.velocity.y = 50;
            this.play('down');
        } else {
            this.animations.stop();
        }
    }

    //refreshVisibility(this.getTile());
};

Player.prototype.render = function () {
    Mobile.prototype.render.call(this);
};