class WorldScene extends Phaser.Scene {
  constructor(config={key: 'WorldScene'}) {
    super(config);
    // this.client = null TODO:


  }

  preload() {

  }

  create() {
    client = new GameClient(this);
    initPlayer(this);
    login(this);

    initGraphics(this);
    initCamera(this);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.sys.events.on('wake', this.wake, this);
  }

  wake() {
    console.log("Worldscene woken up");
  }



  update(time, delta) {
    //console.log(this.player.x,this.player.y);
    playerControlsLoop(this);
    resetOthersPlayersAnimation(time, delta);
  }

  switchToBattleScene() {
    // TODO: think about how to display in match players to others outside the match
    this.scene.sleep();
    this.scene.launch('BattleScene'); // launch to prevent client data loss
  }
}





// =====================================================================
// pre es6 init

//let W = new WorldScene();

/*
let WorldScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize:
  function WorldScene() {
    Phaser.Scene.call(this, {key: 'WorldScene'});
  },
  preload() {},
  create: function () {
    client = new GameClient(this);
    initPlayer(this);
    login(this);
    initGraphics(this);
    initCamera(this);
    this.cursors = this.input.keyboard.createCursorKeys();
  },
  update: function(time, delta) {
    playerControlsLoop(this);
    resetOthersPlayersAnimation(time, delta);
  },
  switchToBattleScene: function() {
    console.log("switch to battle scene");
    this.scene.switch('BattleScene');
  },

});

*/