const config = {
  type: Phaser.AUTO,
  // parent: 'phaser-example',
  parent: 'gameContainer',
  width: WIDTH,
  height: HEIGHT,
  pixelArt: true,
  zoom: 2,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },

    scene: [
      BootScene,
      BattleScene,
      MyUIScene,
      WorldScene
    ],
};
 
const game = new Phaser.Game(config);


