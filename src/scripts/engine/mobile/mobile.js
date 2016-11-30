function Mobile(game,x,y,texture){
    this.game = game;
    this.map = NuhMapHandler.Map();
    this.lastFloodCheckTime = game.time.now;
    this.floodCheckRate = 1000;
    Phaser.Sprite.call(this,game,x,y,texture);
    game.add.existing(this);
    this.anchor.setTo(0.5,0.5); 
    game.physics.enable(this, Phaser.Physics.ARCADE);  

    this.getTile = function(){
        return this.map.getTileWorldXY(this.x,this.y,16,16);
    }     
}

Mobile.prototype = Object.create(Phaser.Sprite.prototype);
Mobile.prototype.constructor = Mobile;

Mobile.prototype.update = function(){
    //console.log(this);
    if(this.alive && this.lastFloodCheckTime + this.floodCheckRate < this.game.time.now){
        var currentTile = this.getTile();
        this.lastFloodCheckTime = this.game.time.now;
        if(currentTile.index == 2){
            this.destroy();
        }
    }    
};
