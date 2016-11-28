function Animal(game, x, y, texture) {
    Mobile.call(this, game, x, y, texture);
    this.destinationXY = [];

}

Animal.prototype = Object.create(Mobile.prototype);
Animal.prototype.constructor = Animal;

Animal.prototype.update = function () {
    //console.log("Mobile update called.");


    if (Math.floor(Math.random() * 1000) === 0) {
        var neighbourTile = NuhMapHandler.Mobiles.GetRandomNeighbour(this);
        if(neighbourTile){
        //console.log(NuhMapHandler.Mobiles.GetRandomNeighbour(this));
            this.destinationXY = [neighbourTile.worldX + 8, neighbourTile.worldY + 8];
            NuhMapHandler.Mobiles.FindPathTo(this,neighbourTile);  
        }      
    }    
};