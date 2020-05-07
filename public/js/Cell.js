class Cell extends Phaser.GameObjects.Container {
  constructor(scene, x, y, children, cell) {
    super(scene, x, y, children);
    scene.add.existing(this);
    this.scene = scene;
    this.graphics = children[0];
    this.textObject = children[1];
    this.defaultColor = 0x110022;
    this.attackColor = 0x990011;
    this.moveColor = 0x00ccc11;
    this.sprite = null;
    this.image = null;
    this.extraImage = null;
  }

  setExtraImage(image) {
    this.extraImage = image;
    this.scene.add.existing(this.extraImage);
  }

  clearExtraImage() {
    if (this.extraImage) {
      this.extraImage.destroy();
      this.extraImage = null;
    }
  }

  setImage(image) {
    this.image = image;
    this.scene.add.existing(this.image);
  }

  clearImage() {
    if (this.image) {
      this.image.destroy();
      this.image = null;
    }
  }

  setSprite(sprite) {
    this.sprite = sprite;
  }

  clearSprite() {
    if (this.sprite && (this.sprite.texture.key === "dragonblue" || this.sprite.texture.key === "dragonorange")) {
      this.sprite.destroy();
      this.sprite = null;
    }
  }

  setPosText(cellType) {
    if (cellType !== 'blocked') {
      //const pos = {x: Math.trunc(this.x / CELL_DRAW_SIZE), y: Math.trunc(this.y / CELL_DRAW_SIZE)};
      //this.textObject.setFontSize(15);
      //this.textObject.setColor("#000000"); // comment-in to activate cell positions drawn
      this.textObject.setText(``);
      this.graphics.clear();
      this.graphics.fillStyle(0xffffff)
        .lineStyle(1, 0xcccccc)

      //this.textObject.setText(`${pos.x}|${pos.y}`);
    }
    else {
      //this.textObject.setFontSize(15);
      //this.textObject.setColor("#ffffff");
      this.graphics.clear();
      this.graphics.fillStyle(0x000000)
        .lineStyle(1, 0xcccccc)
        .fillRect(2, 2, CELL_DRAW_SIZE, CELL_DRAW_SIZE)
        .strokeRect(2, 2, CELL_DRAW_SIZE, CELL_DRAW_SIZE);
      this.textObject.setText(``);

      //this.textObject.setColor(0x000000);
    }

  }

  setEntityText(entity, friendly) {
    this.textObject.setFontSize(11);
    if (friendly) this.textObject.setColor("#223fff");
    else this.textObject.setColor("#ff0000");
    let text;

    if (entity.healPower != null && entity.mana != null) {
      text = `${entity.atk}    ${entity.hp}`;
      text += `\n${entity.healPower ? entity.healPower : entity.magicPower}    ${(entity.mana/10)}`;
      let ccText = `\n\n`;
      if (entity.buffs.length) {
        ccText += 'B'
      }
      if (entity.hasCC) {
        ccText += ' CC'
      }
      text += ccText;
    }
    else {
      text = `${entity.atk}    ${entity.hp}`;
      let ccText = `\n\n\n`;
      if (entity.buffs.length) {
        ccText += 'B'
      }
      if (entity.hasCC) {
        ccText += ' CC'
      }
      text += ccText;
    }

    this.textObject.setText(text);
    this.textObject.setDepth(100);
  }

  select(initSelection) {

    /*
    console.log("init selection");
    console.log(friendly);
    if (friendly) {
      this.graphics.fillStyle(`rgb(12, 190, 255)`)
        .lineStyle(1, 0xffffff)
        .fillRect(2, 2, CELL_DRAW_SIZE, CELL_DRAW_SIZE)
        .strokeRect(2, 2, CELL_DRAW_SIZE, CELL_DRAW_SIZE);
      this.graphics.setAlpha(1);
    }
    else this.graphics.setAlpha(0);
    */

    if (initSelection) {
      this.graphics.clear();
      this.graphics.fillStyle(0xffa500)
        .lineStyle(1, 0xcccccc)
        .fillRect(2, 2, CELL_DRAW_SIZE, CELL_DRAW_SIZE)
        .strokeRect(2, 2, CELL_DRAW_SIZE, CELL_DRAW_SIZE);
    }

    else {
      this.graphics.clear();
      this.graphics.fillStyle(0xaa22ff)
        .lineStyle(1, 0xcccccc)
        .fillRect(2, 2, CELL_DRAW_SIZE, CELL_DRAW_SIZE)
        .strokeRect(2, 2, CELL_DRAW_SIZE, CELL_DRAW_SIZE);
    }


    //this.graphics.setAlpha(0);
  }

  deselect() {
    //this.graphics.fillStyle(this.defaultColor);
    /*
    this.graphics.fillStyle(0xffffff)
      .lineStyle(1, 0xffffff)
      .fillRect(2, 2, CELL_DRAW_SIZE, CELL_DRAW_SIZE)
      .strokeRect(2, 2, CELL_DRAW_SIZE, CELL_DRAW_SIZE);
    */


    if (this.dataObject.cellType === 'blocked') {
      this.graphics.clear();
      this.graphics.fillStyle(0x000000)
        .lineStyle(1, 0xcccccc)
        .fillRect(2, 2, CELL_DRAW_SIZE, CELL_DRAW_SIZE)
        .strokeRect(2, 2, CELL_DRAW_SIZE, CELL_DRAW_SIZE);
    }
    else {
      this.graphics.clear();
      this.graphics.fillStyle(0xffffff)
        .lineStyle(1, 0xcccccc)
        .fillRect(2, 2, CELL_DRAW_SIZE, CELL_DRAW_SIZE)
        .strokeRect(2, 2, CELL_DRAW_SIZE, CELL_DRAW_SIZE);
    }

    //this.graphics.setAlpha(1);
  }



}