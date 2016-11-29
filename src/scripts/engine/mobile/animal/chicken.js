function Chicken(game,x,y){    
    Animal.call(this,game,x,y,"chicken"); 
    this.speechChance = 1000;
    this.movementChance = 1000; 
    this.speechText = "üü-rü-üüüü";  
    this.animations.add('left', [3, 4,5], 10, true);
    this.animations.add('right', [6, 7, 8], 10, true);
    this.animations.add('up', [0, 1, 2], 10, true);
    this.animations.add('down', [9, 10, 11], 10, true);
    
    this.point = 3;
}

Chicken.prototype = Object.create(Animal.prototype);
Chicken.prototype.constructor = Chicken;

Chicken.prototype.update = function(){   
    Animal.prototype.update.call(this);

     
};



