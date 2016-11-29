function Mobile(game,x,y,texture){
    this.game = game;
    this.map = NuhMapHandler.Map();
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
    
};

Mobile.prototype.render = function () {
       
    console.log("asd");    
    this.game.debug.spriteBounds(this);
};
