function Mobile(game,x,y,texture){
    this.game = game;
    Phaser.Sprite.call(this,game,x,y,texture);
    game.add.existing(this);
    this.anchor.setTo(0.5,0.5); 
    game.physics.enable(this, Phaser.Physics.ARCADE);       
}

Mobile.prototype = Object.create(Phaser.Sprite.prototype);
Mobile.prototype.constructor = Mobile;

Mobile.prototype.update = function(){
   
};
