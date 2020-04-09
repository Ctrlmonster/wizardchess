class MyUIScene extends Phaser.Scene {
  constructor(config={key: 'MyUIScene'}) {
    super(config);
    this.graphics = null;
    this.menu = null;
    this.graphics = null;
  }

  preload() {}

  create() {

    // draw some background for the menu
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(1, 0xffffff);
    this.graphics.fillStyle(0xff00ff, 1);
    // this.drawFakeCards(5);




    // basic container to hold all menus
    this.menu = this.add.container();

  }
  update() {}


  drawFakeCards(n) {
    let cardWidth = 80;
    let offset = 15;
    let rects = [];
    for (let i = 0; i < n; i++) {
      this.graphics.strokeRect(offset + i*cardWidth, 325, 50, 75);
      this.graphics.fillRect(offset + i*cardWidth, 325, 50, 75);
      rects.push([i*cardWidth, 300, 50, 100])
    }
    return rects;
  }

}