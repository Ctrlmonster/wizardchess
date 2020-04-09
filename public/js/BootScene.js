const BootScene = new Phaser.Class({
  Extends : Phaser.Scene,
  initialize:

  function BootScene() {
    Phaser.Scene.call(this, {key: 'BootScene'});
  },

  preload: function () {
    this.load.image('tiles', 'assets/map/spritesheet.png');   // map tiles
    this.load.tilemapTiledJSON('map', 'assets/map/map.json');   // map in json format
    this.load.spritesheet('player', 'assets/RPG_assets.png', {frameWidth: 16, frameHeight: 16});
    this.load.spritesheet('otherPlayer', 'assets/RPG_assets.png', {frameWidth: 16, frameHeight: 16});

    this.load.image('dragonblue', 'assets/dragonblue.png');
    this.load.image('dragonorange', 'assets/dragonorange.png');
  },
  create: function() {
    createAnimations(this);
    this.scene.start('WorldScene');
  }
});