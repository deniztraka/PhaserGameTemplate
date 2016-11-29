'use strict';
function Lion(game,x,y){    
    Animal.call(this,game,x,y,"lion");  
    this.speechChance = 1000;
    this.movementChance = 1000;
    this.speechText = "roooarrr";

    this.animations.add('left', [3, 4,5], 10, true);
    this.animations.add('right', [6, 7, 8], 10, true);
    this.animations.add('up', [0, 1, 2], 10, true);
    this.animations.add('down', [9, 10, 11], 10, true);  

    this.point = 20;
}

Lion.prototype = Object.create(Animal.prototype);
Lion.prototype.constructor = Lion;

Lion.prototype.update = function(){   
    Animal.prototype.update.call(this);    
     
};


