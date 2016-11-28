'use strict';
function Bunny(game,x,y){    
    Animal.call(this,game,x,y,"bunny");  
    this.animations.add('left', [3, 4, 5], 10, true);
    this.animations.add('right', [6, 7, 8], 10, true);
    this.animations.add('up', [9, 10, 11], 10, true);
    this.animations.add('down', [0, 1, 2], 10, true);
}

Bunny.prototype = Object.create(Animal.prototype);
Bunny.prototype.constructor = Bunny;

Bunny.prototype.update = function(){   
    Animal.prototype.update.call(this);

     
};


