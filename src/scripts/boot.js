DGame = {

    /* Your game can check BasicGame.orientated in internal loops to know if it should pause or not */
    orientated: false

};

DGame.Boot = function (game) {
};

DGame.Boot.prototype = {

    init: function () {

        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.setMinMax(480, 260, 1024, 768);
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        if (!this.game.device.desktop)
        {
            this.scale.forceOrientation(true, false);
            this.scale.setResizeCallback(this.gameResized, this);
            this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
        }

    },

    preload: function () {

        //  Here we load the assets required for our preloader (in this case a background and a loading bar)
        //  this.load.image('preloaderBackground', '../../assets/img/preloader_background.jpg');
        this.load.image('preloaderBar', '../../assets/img/preloader-bar.png');

    },

    create: function () {

        this.state.start('Preloader');

    },

    gameResized: function (width, height) {
        console.log("hede");
        //  This could be handy if you need to do any extra processing if the game resizes.
        //  A resize could happen if for example swapping orientation on a device or resizing the browser window.
        //  Note that this callback is only really useful if you use a ScaleMode of RESIZE and place it inside your main game state.

    },

    enterIncorrectOrientation: function () {

        DGame.orientated = false;

        document.getElementById('orientation').style.display = 'block';

    },

    leaveIncorrectOrientation: function () {

        DGame.orientated = true;

        document.getElementById('orientation').style.display = 'none';

    }

};
