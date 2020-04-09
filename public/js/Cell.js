class Cell extends Phaser.GameObjects.Container {
  constructor(scene, x, y, children, cell) {
    super(scene, x, y, children);
    scene.add.existing(this);
    this.scene = scene;
    this.graphics = children[0];
    this.textObject = children[1];
    this.sprite = null;
  }

  setSprite(sprite) {
    this.sprite = sprite;
  }

  clearSprite(log) {
    if (this.sprite && (this.sprite.texture.key === "dragonblue" || this.sprite.texture.key === "dragonorange")) {
      this.sprite.destroy();
      this.sprite = null;
    }
  }

  setPosText() {
    const pos = {x: this.x / CELL_DRAW_SIZE, y: this.y / CELL_DRAW_SIZE};
    this.textObject.setFontSize(15);
    this.textObject.setColor("#ffffff");
    this.textObject.setText(`${pos.x}|${pos.y}`);
  }

  setEntityText(entity, friendly) {
    this.textObject.setFontSize(11);
    if (friendly) this.textObject.setColor("#6cff46");
    else this.textObject.setColor("#ff0000");

    let text = `${entity.atk}    ${entity.hp}`;
    let ccText = `\n\n\n`;
    if (!entity.allowedToCast) {
      ccText += 'C '
    }
    if (!entity.allowedToMove) {
      ccText += 'M '
    }
    if (!entity.allowedToFight) {
      ccText += 'F '
    }
    text += ccText;
    this.textObject.setText(text);
  }

  select() {
    this.gameState = 'selected';
    this.graphics.setAlpha(0);
  }

  deselect() {
    this.gameState = null;
    this.graphics.setAlpha(1);
  }



}