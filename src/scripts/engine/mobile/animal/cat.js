'use strict';
function Cat(game,x,y){    
    Animal.call(this,game,x,y,"cat");    
    this.animations.add('left', [12, 13,14], 10, true);
    this.animations.add('right', [24, 25, 26], 10, true);
    this.animations.add('up', [36, 37, 38], 10, true);
    this.animations.add('down', [0, 1, 2], 10, true);
}

Cat.prototype = Object.create(Animal.prototype);
Cat.prototype.constructor = Cat;

Cat.prototype.update = function(){   
    Animal.prototype.update.call(this);

     
};


