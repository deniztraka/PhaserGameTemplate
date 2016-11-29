'use strict';
function Cat(game,x,y){    
    Animal.call(this,game,x,y,"cat");  
    this.speechChance = 1000;
    this.movementChance = 1000;
    this.speechText = "meaaw";

    this.animations.add('left', [3, 4,5], 10, true);
    this.animations.add('right', [6, 7, 8], 10, true);
    this.animations.add('up', [0, 1, 2], 10, true);
    this.animations.add('down', [9, 10, 11], 10, true);  
    // this.animations.add('left', [81, 82, 83], 10, true);
    // this.animations.add('right', [93, 94, 95], 10, true);
    // this.animations.add('up', [105, 106, 107], 10, true);
    // this.animations.add('down', [69, 70, 71], 10, true);
}

Cat.prototype = Object.create(Animal.prototype);
Cat.prototype.constructor = Cat;

Cat.prototype.update = function(){   
    Animal.prototype.update.call(this);    
     
};


