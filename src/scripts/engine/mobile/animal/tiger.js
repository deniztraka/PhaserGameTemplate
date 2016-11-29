'use strict';
function Tiger(game,x,y){    
    Animal.call(this,game,x,y,"tiger");  
    this.speechChance = 1000;
    this.movementChance = 1000;
    this.speechText = "grrr";

    this.animations.add('right', [3, 4,5], 10, true);
    this.animations.add('left', [6, 7, 8], 10, true);
    this.animations.add('down', [0, 1, 2], 10, true);
    this.animations.add('up', [9, 10, 11], 10, true);  

    this.point = 15;
}

Tiger.prototype = Object.create(Animal.prototype);
Tiger.prototype.constructor = Tiger;

Tiger.prototype.update = function(){   
    Animal.prototype.update.call(this);    
     
};


