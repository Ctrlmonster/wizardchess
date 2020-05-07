const BootScene = new Phaser.Class({
  Extends : Phaser.Scene,
  initialize:

  function BootScene() {
    Phaser.Scene.call(this, {key: 'BootScene'});
  },

  preload: function () {
    this.load.image('tiles', 'public/assets/map/spritesheet.png');   // map tiles
    this.load.tilemapTiledJSON('map', 'public/assets/map/map.json');   // map in json format
    this.load.spritesheet('player', 'public/assets/RPG_assets.png', {frameWidth: 16, frameHeight: 16});
    this.load.spritesheet('otherPlayer', 'public/assets/RPG_assets.png', {frameWidth: 16, frameHeight: 16});

    //this.load.image('healer_icon', 'public/assets/icons/healer.jpg');
    this.load.image('healer_icon', 'public/assets/icons/healer_icon3.png');
    this.load.image('melee_icon', 'public/assets/icons/dd.png');
    this.load.image('caster_icon', 'public/assets/icons/caster_icon.png');
    this.load.image('tank_icon', 'public/assets/icons/tank_icon2.png');
    this.load.image('idling_icon', 'public/assets/icons/idling_icon4.png');

    this.load.image('dragonblue', 'public/assets/dragonblue.png');
    this.load.image('dragonorange', 'public/assets/dragonorange.png');
  },
  create: function() {
    createAnimations(this);
    this.scene.start('WorldScene');
  }
});