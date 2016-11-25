function Pig(game,x,y){    
    Animal.call(this,game,x,y,"pig");
    
}

Pig.prototype = Object.create(Animal.prototype);
Pig.prototype.constructor = Pig;

Pig.prototype.update = function(){
    //console.log("Mobile update called.");
    this.game.physics.arcade.moveToXY(this, 100, 100);
};
