function Animal(game, x, y, texture) {
    Mobile.call(this, game, x, y, texture);

}

Animal.prototype = Object.create(Mobile.prototype);
Animal.prototype.constructor = Animal;

Animal.prototype.update = function () {
    //console.log("Mobile update called.");
    if (Math.floor(Math.random() * 20) === 0) {
        
        this.game.physics.arcade.moveToXY(this, 100, 100);
    }

};