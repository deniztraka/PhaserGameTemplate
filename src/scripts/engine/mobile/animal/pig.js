function Pig(game,x,y){    
    Animal.call(this,game,x,y,"pig");
    
}

Pig.prototype = Object.create(Animal.prototype);
Pig.prototype.constructor = Pig;


