class Cell extends Phaser.GameObjects.Container {
  constructor(scene, x, y, children, moreText, normPos) {
    super(scene, x, y, children);
    scene.add.existing(this);
    this.scene = scene;
    this.graphics = children[0];
    this.textObject = children[1];
    this.moreText = moreText;
    this.defaultColor = 0x110022;
    this.attackColor = 0x990011;
    this.moveColor = 0x00ccc11;
    this.sprite = null;
    this.image = null; // for role
    this.extraImage = null; // for idling
    this.commanderImage = null;
    this.normPos = normPos;
  }

  setCommanderImage(image) {
    this.commanderImage = image;
    this.scene.add.existing(this.commanderImage);
  }

  clearCommanderImage() {
    if (this.commanderImage) {
      this.commanderImage.destroy();
      this.commanderImage = null;
    }
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
      this.graphics.clear(); // 0xeee2D5
      const col = (!(this.dataObject.pos.x % 2) === !(this.dataObject.pos.y % 2)) ? 0xD6D1C1 : 0xffffff;
      this.graphics.fillStyle(col)
        .setAlpha(0.5)
        .lineStyle(1, 0xbbbbbb)
    }
    else {
      this.graphics.clear();
      this.graphics.fillStyle(0x000000)
        .setAlpha(0.5)
        .lineStyle(1, 0xbbbbbb)
        .fillRect(1, 1, CELL_DRAW_SIZE, CELL_DRAW_SIZE)
        .strokeRect(1, 1, CELL_DRAW_SIZE, CELL_DRAW_SIZE);
    }

    Object.values(this.moreText).forEach((textObj, i) => {
      textObj.setText(``);
    });
    this.textObject.setText(``);

  }

  setEntityText(entity, friendly) {
    /*
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
*/
    this.setMoreEntityText(entity);
  }

  setMoreEntityText(entity) {

    //this.textObject.setFontSize(11);


    /*
    const moreText = {
      atk: this.scene.add.text(this.x+5, this.y+5, `${entity.atk}`),
      hp: this.scene.add.text(this.x+38, this.y+5, `${entity.hp}`),
      healPower: this.scene.add.text(this.x+5, this.y+20, `${entity.hp}`),
      casts: this.scene.add.text(this.x+38, this.y+20, `${entity.mana/10}`),
      magicPower: this.scene.add.text(this.x+5, this.y+35, `${entity.hp}`),
    };*/

    /*
    const moreText = {
     atk: null,
     hp: null,
     healPower: null,
     magicPower: null,
     casts: null
   };

    this.moreText.atk = entity.atk;
    this.moreText.hp = entity.hp;
    this.moreText.healPower = entity.healPower;
    this.moreText.magicPower = entity.magicPower;
    this.moreText.healPower = entity.healPower;*/

    const keys = Object.keys(this.moreText);
    const colors = {
      hp: "#ff0b00",
      healPower: "#009809",
      //atk: "#ffc31e",
      atk: "#5c4d00",

//      healPower: "#19be1f",
      //atk: "#000000",
      mana: "#0037ff",
//      mana: "#0037ff",
      magicPower: "#ff12e8",
      buff: "#000000",
      cc: "#000000",
    };
    //this.textObject.setText(text);

    /*
    if (entity.buffs.length) {
      ccText += 'B'
    }
    if (entity.hasCC) {
      ccText += ' CC'
    }*/

    entity.cc = !!(entity.hasCC) ? "CC" : " ";
    entity.buff = !!(entity.buffs.length) ? "B" : " ";

    Object.values(this.moreText).forEach((textObj, i) => {
      const key = keys[i];
      if (entity[key] === 0 && key !== 'mana') textObj.setText(``);
      else textObj.setText(entity[key]);

      textObj.setColor(colors[key]);
      textObj.setFontSize(11);
      textObj.setDepth(100);

      if (this.scene.rotateCanvas) {
        textObj.rotation = Math.PI;
        //console.log(this.normPos);
        //console.log(key);
        //console.log(this.normPos);
        textObj.x = this.normPos[key].x;
        textObj.y = this.normPos[key].y;
        //console.log(textObj.x);
        //console.log("----------------");

      }


      //textObj.setColor("#ff0000");
    });



    /*
      atk: null,
      hp: null,
      healPower: null,
      magicPower: null,
      casts: null
    */
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
    else this.graphics.setAlpha(1);
    */

    if (initSelection) {
      this.graphics.clear();
      this.graphics.fillStyle(0xffc31e)
        .setAlpha(0.9)
      //this.graphics.fillStyle(0xffa500)
      //const col = (!(this.dataObject.pos.x % 2) === !(this.dataObject.pos.y % 2)) ? 0xD6D1C1 : 0xffffff;
      //const col = 0xC2A1FF;
        .lineStyle(1, 0xbbbbbb)
        .fillRect(1, 1, CELL_DRAW_SIZE, CELL_DRAW_SIZE)
        .strokeRect(1, 1, CELL_DRAW_SIZE, CELL_DRAW_SIZE)
        //.setDepth(-1)
    }

    else {
      this.graphics.clear();
      this.graphics.fillStyle(0xaa22ff)
        .setAlpha(0.9)
        .lineStyle(1, 0xbbbbbb)
        .fillRect(1, 1, CELL_DRAW_SIZE, CELL_DRAW_SIZE)
        .strokeRect(1, 1, CELL_DRAW_SIZE, CELL_DRAW_SIZE);
    }


    //this.graphics.setAlpha(1);
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
        .setAlpha(0.5)
        .lineStyle(1, 0xbbbbbb)
        .fillRect(1, 1, CELL_DRAW_SIZE, CELL_DRAW_SIZE)
        .strokeRect(1, 1, CELL_DRAW_SIZE, CELL_DRAW_SIZE);
    }
    else {
      this.graphics.clear();
      //this.graphics.fillStyle(0xffffff)
      const col = (!(this.dataObject.pos.x % 2) === !(this.dataObject.pos.y % 2)) ? 0xD6D1C1 : 0xffffff;
      this.graphics.fillStyle(col)
        .setAlpha(0.5)
        .lineStyle(1, 0xbbbbbb)
        .fillRect(1, 1, CELL_DRAW_SIZE, CELL_DRAW_SIZE)
        .strokeRect(1, 1, CELL_DRAW_SIZE, CELL_DRAW_SIZE);
    }

    //this.graphics.setAlpha(1);
  }



}