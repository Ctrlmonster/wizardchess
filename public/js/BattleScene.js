class BattleScene extends Phaser.Scene {
  constructor(config={key: 'BattleScene'}) {
    super(config);
    this.gridCells = null;
    this.gameTable = null;

    // ------------------------------------
    this.htmlTable = null;

    this.selectionMode = null; // hand | board | skill
    this.mouseX = 0;
    this.mouseY = 0;
    // -----------------------------------
    // player stats
    this.rotateCanvas = null;
    this.player_index = null;
    this.board = null;
    this.turn = null;
    this.myTurn = null;
    this.hand = [];
    this.prevHand = [];
    this.zoomedCard = null;
    // hero stats;
    this.hero = null;
    this.pos = null;
    this.hp = null;
    this.mana = null;
    this.cardsLeft = null;

    this.enemyHero = null;
    this.enemyCardsLeft = null;
    this.enemyHp = null;
    this.enemyMana = null;

    this.active_highlight = null;
    this.hoveredCell = null;

    // other player
    this.otherPos = null;
    this.otherPlayer = null;

    this.eventHistory = [];
    this.eventHistoryIndex = 0;
    // -----------------------------------
    // event/actions
    this.actionRequestData = null;

    this.selectCard = this.selectCard.bind(this);
  }

  preload() {
    //this.load.plugin('rexgridtableplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgridtableplugin.min.js', true);
    this.load.plugin('rexgridtableplugin', 'public/lib/phaser/plugins/rexgridtableplugin.min.js', true);
  }

  setSelectionMode(mode, forceSend=false) {
    // todo: this needs some reworking
    if (!forceSend) {
      if ((mode === this.selectionMode || !this.myTurn))// && (initCall || (this.actionRequestData && this.actionRequestData.length)))
        return;
    }

    this.selectionMode = mode;
    client.sendSelectionMode(mode).then(res => {
      if (res.data === 'done')
        endTurnButton.classList.add("highlightButton");
      else
        endTurnButton.classList.remove("highlightButton");
    });
  }


  createHTMLGameTable() {
    const table = document.createElement("TABLE");
    table.setAttribute("id", "htmlGameTable");

    for (let y = 0; y < GRID_NUM_ROWS; y++) {
      const row = document.createElement("TR");
      for (let x = 0; x < GRID_NUM_COLS; x++) {

        const cellContainer = document.createElement("TD");
        const cell = document.createElement("DIV");
        const [wrapper, contentImage] = this.createCellElement();

        cell.setAttribute("id", `${x}${y}`);
        cell.classList.add("gameTableCell");

        cell.appendChild(wrapper);
        cellContainer.appendChild(cell);
        row.appendChild(cellContainer);

        // create a link to the elem for the data object
        this.board[x][y].htmlElem = {
          cell,
          wrapper,
          contentImage,
        };
      }
      table.appendChild(row);
    }

    this.htmlTable = table;
    document.body.appendChild(this.htmlTable);
  }

  createCellElement() {
    const wrapper = document.createElement("DIV");
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';

    const contentImage = document.createElement("IMG");
    //contentImage.src = "//:0";
    //contentImage.src = "http://probablyprogramming.com/wp-content/uploads/2009/03/handtinytrans.gif";
    const contentBorder = document.createElement("IMG");
    contentBorder.src = "/public/assets/gui/dragon_TCG-assets/border_card01.png";

    wrapper.appendChild(contentImage);
    wrapper.appendChild(contentBorder);

    return [wrapper, contentImage];
  }

  updateHTMLGameTable() {
    for (let x = 0; x < this.board.length; x++) {
      for (let y = 0; y < this.board[x].length; y++) {
        const cellData = this.board[x][y];
        if (cellData.content == null) {
          //cellData.htmlElem.cell.classList.add("hideCellContent");
          cellData.htmlElem.contentImage.src = "//:0";
          //cellData.htmlElem.cellImage.src = "http://probablyprogramming.com/wp-content/uploads/2009/03/handtinytrans.gif";
        }
        else {
          //cellData.htmlElem.cell.classList.remove("hideCellContent");
          cellData.htmlElem.contentImage.src = `public/${cellData.content.icon}`;
        }
      }
    }
  }



  updateTableData() {
    const {cells: tableCells} = this.gameTable.table;

    for (let x = 0; x < this.board.length; x++) {
      for (let y = 0; y < this.board[x].length; y++) {
        let cell = this.board[x][y];
        let flatIndex = GRID_NUM_COLS * y + x;

        tableCells[flatIndex].clearData();
        if (cell.content && !cell.content.visible) tableCells[flatIndex].setData("content", cell);

        let {container} = tableCells[flatIndex];
        // link both
        cell.drawingObject = container;
        container.dataObject = cell;

        if (container.sprite != null) {
          container.clearSprite();
          container.clearImage();
          /*container.clearExtraImage();
          container.clearCommanderImage();*/
        }
        container.clearExtraImage();
        container.clearCommanderImage();
        // set text for cells with entities
        if (cell.content && cell.content.visible) {
          container.setEntityText(cell.content, cell.friendly);

          if (cell.content.commander) {
            if (container.commanderImage == null)
              /*if (cell.content.type === 'hero')
                container.setCommanderImage(this.createHeroIcon({x,y}));
              else*/
              if (cell.content.type !== 'hero')
                container.setCommanderImage(this.createCommanderIcon({x,y}));
          }

          if (cell.content.idling) {
            /*console.log(cell.content);
            console.log(container.extraImage);*/
            if (container.extraImage == null)
              container.setExtraImage(this.createIdlingIcon({x,y}));
          }

          //if (container.sprite == null) {
          if (cell.content.type === "monster") {
            // check for monster types
            if (cell.content.monsterType) {
                switch (cell.content.monsterType) {
                  case "healer":
                    if (container.image == null) // check if an image already exists
                      container.setImage(this.createHealerImage({x,y}));
                    break;
                  case "melee":
                    if (container.image == null) // check if an image already exists
                      //container.setImage(this.createRogueImage({x,y}));
                      container.setImage(this.createMeleeImage({x,y}));
                    break;
                  case "caster":
                    if (container.image == null) // check if an image already exists
                      container.setImage(this.createCasterImage({x,y}));
                    break;
                  case "tank":
                    if (container.image == null) // check if an image already exists
                      container.setImage(this.createTankImage({x,y}));
                    break;
                }
              }

            if (cell.friendly) {
              container.setSprite(this.createFriendlyEntity({x, y}))
            }
            else {
              container.setSprite(this.createEnemyEntity({x,y}));
            }
          }
          else {
            container.clearSprite();
            container.clearImage();
            //container.clearExtraImage();
          }
        }
        else {
          container.clearSprite();
          container.clearImage();
          container.clearExtraImage();
          container.setPosText(cell.cellType);
        }
      }
    }
  }

  createRogueImage(pos) {
    let rogue_image = new Phaser.GameObjects.Sprite(this,
      pos.x*CELL_DRAW_SIZE+CELL_DRAW_OFFSET,
      pos.y*CELL_DRAW_SIZE+CELL_DRAW_OFFSET,
      'rogue_test', 6);
    //this.add.existing(this.player);
    rogue_image.displayWidth *= 0.75;
    rogue_image.displayHeight *= 0.75;
    rogue_image.setDepth(99);
    return rogue_image;

    /*
    let icon_offset = CELL_DRAW_OFFSET;
    rogue_image = new Phaser.GameObjects.Image(this, pos.x*CELL_DRAW_SIZE+icon_offset, pos.y*CELL_DRAW_SIZE+2, 'rogue_test');
    //healer_icon.setAlpha(0.5);
    rogue_image.displayWidth = CELL_DRAW_SIZE/3;
    rogue_image.displayHeight = CELL_DRAW_SIZE/3;
    rogue_image.setDepth(99);
    return rogue_image;*/
  }

  createCommanderIcon(pos) {
    let icon_offset = CELL_DRAW_OFFSET;
    let idling_icon = new Phaser.GameObjects.Image(this, pos.x*CELL_DRAW_SIZE+icon_offset, pos.y*CELL_DRAW_SIZE+CELL_DRAW_SIZE-2.5, 'commander_icon');
    //let idling_icon = new Phaser.GameObjects.Image(this, pos.x*CELL_DRAW_SIZE+icon_offset, pos.y*CELL_DRAW_SIZE+2, 'commander_icon');
    //idling_icon.setAlpha(0.5);
    idling_icon.displayWidth = CELL_DRAW_SIZE * 0.85;
    idling_icon.displayHeight = CELL_DRAW_SIZE * .2;

    if (this.rotateCanvas) {
      idling_icon.rotation = Math.PI;
    }
    //idling_icon.setDepth(5);
    return idling_icon;
  }

  createHeroIcon(pos) {
    let icon_offset = CELL_DRAW_OFFSET;
    let idling_icon = new Phaser.GameObjects.Image(this, pos.x*CELL_DRAW_SIZE+icon_offset, pos.y*CELL_DRAW_SIZE+icon_offset, 'hero_icon');
    //let idling_icon = new Phaser.GameObjects.Image(this, pos.x*CELL_DRAW_SIZE+icon_offset, pos.y*CELL_DRAW_SIZE+2, 'commander_icon');
    //idling_icon.setAlpha(0.5);
    idling_icon.setAlpha(0.4);
    idling_icon.displayWidth = CELL_DRAW_SIZE * 1;
    idling_icon.displayHeight = CELL_DRAW_SIZE * 1;
    idling_icon.setDepth(5);
    return idling_icon;
  }

  createIdlingIcon(pos) {
    let icon_offset = CELL_DRAW_OFFSET;
    let idling_icon = new Phaser.GameObjects.Image(this, pos.x*CELL_DRAW_SIZE+icon_offset, pos.y*CELL_DRAW_SIZE+2, 'idling_icon');
    //healer_icon.setAlpha(0.5);
    idling_icon.displayWidth = CELL_DRAW_SIZE/3;
    idling_icon.displayHeight = CELL_DRAW_SIZE/3;
    idling_icon.setDepth(99);

    if (this.rotateCanvas) {
      idling_icon.rotation = Math.PI;
    }
    return idling_icon;
  }

  createMeleeImage(pos) {
    /*
    const monsterImage = document.createElement("IMG");
    monsterImage.src = "public/assets/searched_images/cosmic_dragon.jpg";
    monsterImage.style.position = 'absolute';
    monsterImage.style.top = String(pos.y*CELL_DRAW_SIZE)+"px";
    monsterImage.style.left = String(pos.x*CELL_DRAW_SIZE)+"px";
    monsterImage.style.height = String(CELL_DRAW_SIZE*2)+"px";
    monsterImage.style.width = String(CELL_DRAW_SIZE*2)+"px";
    monsterImage.style.zIndex = String(1000000000000000000000000000);
    canvasContainer.appendChild(monsterImage);
    //document.body.appendChild(monsterImage);
*/

    let icon_offset = CELL_DRAW_OFFSET;
    //let melee_icon = new Phaser.GameObjects.Image(this, pos.x*CELL_DRAW_SIZE+icon_offset, pos.y*CELL_DRAW_SIZE+icon_offset, 'monster_test');
    let melee_icon = new Phaser.GameObjects.Image(this, pos.x*CELL_DRAW_SIZE+icon_offset, pos.y*CELL_DRAW_SIZE+icon_offset*1.8, 'melee_icon');
    //healer_icon.setAlpha(0.5);
//    melee_icon.setScale(0.03);
    melee_icon.displayWidth = CELL_DRAW_SIZE/3;
    melee_icon.displayHeight = CELL_DRAW_SIZE/3;
    melee_icon.setDepth(99);

    if (this.rotateCanvas) {
      melee_icon.rotation = Math.PI;
    }
    return melee_icon;
  }

  createCasterImage(pos) {
    let icon_offset = CELL_DRAW_OFFSET;
    let caster_icon = new Phaser.GameObjects.Image(this, pos.x*CELL_DRAW_SIZE+icon_offset, pos.y*CELL_DRAW_SIZE+icon_offset*1.8, 'caster_icon');
    //healer_icon.setAlpha(0.5);
    caster_icon.displayWidth = CELL_DRAW_SIZE/3;
    caster_icon.displayHeight = CELL_DRAW_SIZE/3;
    caster_icon.setDepth(99);

    if (this.rotateCanvas) {
      caster_icon.rotation = Math.PI;
    }
    return caster_icon;
  }

  createTankImage(pos) {
    let icon_offset = CELL_DRAW_OFFSET;
    let caster_icon = new Phaser.GameObjects.Image(this, pos.x*CELL_DRAW_SIZE+icon_offset, pos.y*CELL_DRAW_SIZE+icon_offset*1.8, 'tank_icon');
    //healer_icon.setAlpha(0.5);
    caster_icon.displayWidth = CELL_DRAW_SIZE/3;
    caster_icon.displayHeight = CELL_DRAW_SIZE/3;
    caster_icon.setDepth(99);
    return caster_icon;
  }

  createHealerImage(pos) {
    let icon_offset = CELL_DRAW_OFFSET;
    let healer_icon = new Phaser.GameObjects.Image(this, pos.x*CELL_DRAW_SIZE+icon_offset, pos.y*CELL_DRAW_SIZE+icon_offset*1.8, 'healer_icon');
    //healer_icon.setAlpha(0.5);
    healer_icon.displayWidth = CELL_DRAW_SIZE/3;
    healer_icon.displayHeight = CELL_DRAW_SIZE/3;
    healer_icon.setDepth(99);

    if (this.rotateCanvas) {
      healer_icon.rotation = Math.PI;
    }
    return healer_icon;

    // background style
    /*let icon_offset = CELL_DRAW_OFFSET+2;
    let healer_icon = new Phaser.GameObjects.Image(this, pos.x*CELL_DRAW_SIZE+icon_offset, pos.y*CELL_DRAW_SIZE+icon_offset, 'healer_icon');
    healer_icon.setAlpha(0.5);
    healer_icon.displayWidth = CELL_DRAW_SIZE-2;
    healer_icon.displayHeight = CELL_DRAW_SIZE-2;
    return healer_icon;*/
  }

  createFriendlyEntity(pos) {
    const entity = this.add.sprite(pos.x*CELL_DRAW_SIZE+CELL_DRAW_OFFSET, pos.y*CELL_DRAW_SIZE+CELL_DRAW_OFFSET,
      `dragonblue`, 6);
    entity.setDepth(10);
    if (this.rotateCanvas) {
      entity.rotation = Math.PI;
    }
    return entity;
  }

  createEnemyEntity(pos) {
    const entity = this.add.sprite(pos.x*CELL_DRAW_SIZE+CELL_DRAW_OFFSET, pos.y*CELL_DRAW_SIZE+CELL_DRAW_OFFSET,
      `dragonorange`, 6);
    entity.setDepth(10);
    if (this.rotateCanvas) {
      entity.rotation = Math.PI;
    }
    return entity;
  }

  updateHistory(newHistory) {
    if (!newHistory) return;
    if (newHistory.length === this.eventHistory.length) return;

    //let startIndex = this.eventHistory.length-1;
    for (let i = this.eventHistoryIndex; i < newHistory.length; i++) {
      createNewHistoryEntry(newHistory[i]);
    }
    this.eventHistoryIndex = newHistory.length;
  }

  updateMatchData(data) {
    this.cardsLeft = data.cardsLeft;
    this.hero = data.hero;
    this.mana = data.mana;
    this.hp = data.hp;

    this.classIcon = data.classIcon;
    this.otherClassIcon = data.otherClassIcon;

    this.enemyCardsLeft = data.enemyCardsLeft;
    this.enemyHero = data.enemyHero;
    this.enemyMana = data.enemyMana;
    this.enemyHp = data.enemyHp;

    this.eventHistory = data.eventHistory;
    this.player_index = data.player_index;
    this.pos = data.pos;
    this.board = data.board;
    this.turn = data.turn;
    this.nextTurn = data.nextTurn;
    this.phase = data.phase;
    this.myTurn = data.myTurn;
    this.otherPos = data.otherPos;
    this.hand = data.hand;
    this.skills = data.skills;
    this.opponentSkills = data.opponentSkills;

    //console.log(this.skills);
    //console.log(this.opponentSkills);
  }

  updateHeroSprites() {
    this.player.setPosition(
      this.pos.x*CELL_DRAW_SIZE+CELL_DRAW_OFFSET,
      this.pos.y*CELL_DRAW_SIZE+CELL_DRAW_OFFSET,
    );
    this.otherPlayer.setPosition(
      this.otherPos.x*CELL_DRAW_SIZE+CELL_DRAW_OFFSET,
      this.otherPos.y*CELL_DRAW_SIZE+CELL_DRAW_OFFSET,
    );
    // set enemy hero to invisible
    if (!this.board[this.otherPos.x][this.otherPos.y].content.visible) this.otherPlayer.setAlpha(0);
    else this.otherPlayer.setAlpha(1);
  }

  create() {
    this.initTable();

    // get initial match data
    client.getMatchData().then(res => {
      this.updateMatchData(res.data);
      this.updateTableData();

      this.initPlayers();
      //this.showActiveHighlight();

      // notify server that initial data was retrieved
      client.sendReadyForMatchMessage().then(res => {
        initMatchSelectionModes();

        // check if player one or two and if the canvas needs to be rotated
        if (this.player_index === -1) { // set to 0 later if positions is adapted as well
          this.rotateCanvas = true;
          gameCanvas.classList.add('rotateCanvas');
          this.player.rotation = Math.PI;
          this.otherPlayer.rotation = Math.PI;


          /*
          const tableCells = this.gameTable.cells;
          tableCells.forEach(cell => {
            let {container} = cell;
            //container.setRotation(Math.PI);
            console.log(container.moreText);
            Object.values(container.moreText).forEach((textObj, i) => {
              //textObj.setRotation(Math.PI)
            });
          });*/


        }
      });

      this.setSelectionMode('board', true);
      showGameElements();
      this.createPlayerHand();
      this.updateHeroUi();
      initHeroSkills();


      /*setTimeout(() => {
        //console.log(this.gameTable);
        const tableCells = this.gameTable.table.cells;
        tableCells.forEach(cell => {
          let {container} = cell;
          Object.values(container.moreText).forEach((textObj, i) => {
            textObj.setRotation(Math.PI)
          });
        });
      }, 1000);*/
    });


    // ==================================00
    //createLeaveButton(this);
    createEndTurnButton(this);
    //this.cameras.main.setBackgroundColor(0xffaa00);
    this.scene.launch("MyUIScene");

    document.getElementById("queue").classList.add("hideTooltip");
    document.getElementById("heroSelect").classList.add("hideTooltip");
  }


  initPlayers() { // showcases the two different ways of adding sprites
    // SET PLAYER
    this.player = new Phaser.GameObjects.Sprite(this,
      this.pos.x*CELL_DRAW_SIZE+CELL_DRAW_OFFSET,
      this.pos.y*CELL_DRAW_SIZE+CELL_DRAW_OFFSET,
      'player', 6);
    this.add.existing(this.player);

    let cellIndex = this.pos.y * GRID_NUM_COLS + this.pos.x;
    this.gameTable.table.cells[cellIndex].container.setSprite(this.player);

    // SET OTHER PLAYER
    this.otherPlayer = this.add.sprite(this.otherPos.x*CELL_DRAW_SIZE+CELL_DRAW_OFFSET, this.otherPos.y*CELL_DRAW_SIZE+CELL_DRAW_OFFSET, 'otherPlayer', 6);
    this.otherPlayer.setTint(0xff0000);
    cellIndex = this.otherPos.y * GRID_NUM_COLS + this.otherPos.x;
    this.gameTable.table.cells[cellIndex].container.setSprite(this.otherPlayer);
  }

  // ------------------------------------------------
  // own methods

  initTable() {
    const newCellObject = function (scene, cell) {
      const bg = scene.add.graphics(0, 0)
        .fillStyle(0xffffff)
        .setAlpha(1)
        .fillRect(2, 2, CELL_DRAW_SIZE, CELL_DRAW_SIZE)
        .strokeRect(2, 2, CELL_DRAW_SIZE, CELL_DRAW_SIZE);
      const txt = scene.add.text(5, 5, ``);
      //const txt = scene.add.text(5, 5, `${cell.colIndx}|${cell.rowIndx}`);
      let x = cell.colIndx * CELL_DRAW_SIZE;
      let y = cell.rowIndx * CELL_DRAW_SIZE;


      let moreText = {
          atk: scene.add.text(x+5, y+2.5, ``),
          hp: scene.add.text(x+38, y+2, ``),
          healPower: scene.add.text(x+5, y+15, ``),
          mana: scene.add.text(x+38, y+14, ``),
          magicPower: scene.add.text(x+5, y+27, ``),
          buff: scene.add.text(x+5, y+39, ``),
          cc: scene.add.text(x+36, y+38, ``),
        };


      /*const moreText = {
        atk: null,
        hp: null,
        healPower: null,
        magicPower: null,
        casts: null
      };*/
      let rotX = (cell.colIndx+1) * CELL_DRAW_SIZE;
      let rotY = (cell.rowIndx+1) * CELL_DRAW_SIZE;
      const posObj = (x,y) => ({x,y});
      const rotPos = {
        atk: posObj(rotX-5, rotY-2.5),
        hp: posObj(rotX-38, rotY-2),
        healPower: posObj(rotX-5, rotY-15),
        mana: posObj(rotX-38, rotY-14),
        magicPower: posObj(rotX-5, rotY-27),
        buff: posObj(rotX-5, rotY-39),
        cc: posObj(rotX-36, rotY-38)
      };

      // TODO: add multiple text objects for better positioning and easier styling
      // game.scene.scenes[1].gameTable.table.cells[0].container.list[1].text
      return new Cell(scene, 0, 0, [bg, txt], moreText, rotPos);
    };

    const onCellVisible = function (cell) {
      const newContainer = newCellObject(this, cell);
      cell.setContainer(newContainer);
    };

    this.gameTable = this.add.rexGridTable(WIDTH/2, HEIGHT/2, WIDTH, HEIGHT, {
      cellHeight: CELL_DRAW_SIZE,
      cellWidth: CELL_DRAW_SIZE,
      cellsCount: GRID_NUM_ROWS * GRID_NUM_COLS,
      columns: GRID_NUM_ROWS,
      cellVisibleCallback: onCellVisible.bind(this),
    });


    // enable click events
    this.gameTable.setInteractive();

    this.gameTable.on('pointermove', (pointer) => {
      let pos = {
        x: Math.trunc(pointer.x/CELL_DRAW_SIZE),
        y: Math.trunc(pointer.y/CELL_DRAW_SIZE)
      };
      this.showCellContentTooltip(this.board[pos.x][pos.y])
    });

    this.gameTable.on('pointerdown', (pointer) => {
      let pos = {
        x: Math.trunc(pointer.x/CELL_DRAW_SIZE),
        y: Math.trunc(pointer.y/CELL_DRAW_SIZE)
      };
      this.selectCell(pos);
    });


    // draw bound
  //  this.active_highlight = this.add.graphics();
//    this.active_highlight.lineStyle(3, 0x000000).strokeRectShape(this.gameTable.getBounds()).setAlpha(1);
  }

  showCellContentTooltip(cell, keepZoomedCard=false) {
    //cellTooltipDetails.forEach(cell => cell.innerHTML = ""); // start with a reset


    if (this.hoveredCell === cell) return;
    else {
      this.hoveredCell = null;
      cellTooltip.classList.add("hideTooltip");
      if (!keepZoomedCard) this.removeZoomedCard();
    }

    const {content} = cell;
    if (content == null || (!content.visible && !cell.friendly)) {
      return;
    }



    this.hoveredCell = cell;

    cellTooltipDetails[0].innerHTML = `${cell.friendly? "<span style='color: #3E92FF'>Friendly</span>": "<span style='color: crimson'>Enemy</span>"}`;

    if (content.name) cellTooltipDetails[1].innerHTML = `<div style='border-bottom: 1px solid #333'>Name: ${content.name}</div>`;
    else cellTooltipDetails[1].innerHTML = "";

    cellTooltipDetails[2].innerHTML = `Atk: ${content.atk} - HP: ${content.hp}`;

    cellTooltipDetails[3].innerHTML = `${(content.type !== 'hero') ? "Magic Power: " + content.magicPower : ""}`;
    cellTooltipDetails[4].innerHTML = `${(content.type !== 'hero') ? "Heal Power: " + content.healPower : ""}`;

    cellTooltipDetails[5].innerHTML = `${(content.type === 'hero') ? "Cards on Hand: " + content.cardsOnHand : (content.mana != null) ? "Mana for Casts: " + content.mana : ""}`;

  //<br>${Number.isInteger(content.magicPower) ? "MagicPower" : }: ${content.magicPower}<br>HealPower: ${content.healPower}<br>Casts left:${content.mana}


    cellTooltipDetails[6].innerHTML = `Type: ${content.type}`;

    cellTooltipDetails[7].innerHTML = `Can Move: ${content.canMove && content.allowedToMove}`;
    cellTooltipDetails[8].innerHTML = `Can Fight: ${content.canFight && content.allowedToFight}`;
    cellTooltipDetails[9].innerHTML = `Can Defend: ${content.canDefend}`;
    cellTooltipDetails[9].innerHTML = `Idling: ${content.idling}`;

    if (content.buffs.length) {
      cellTooltipDetails[10].innerHTML = `Buffs:<br>`;
      content.buffs.forEach(buff => {
        let {timer} = buff;
        if (buff.endPhase) {

          // if buff.friendly dann kann endphase type geglaubt werden, sonst umgedreht
          let phaseOwner;
          if (buff.friendly) {
            phaseOwner = (buff.timer.phaseOwner === 'hostile') ? 'Enemy' : 'My';
          } else {
            phaseOwner = (buff.timer.phaseOwner === 'hostile') ? 'My' : 'Enemy';
          }

          let msg = `Buff ends: ${buff.endPhase.type} of ${phaseOwner} Turn Nr. ${buff.endPhase.address[0]+1}`;
          cellTooltipDetails[10].innerHTML += `* ${buff.name} <br>${msg}<br>`
        }
        else cellTooltipDetails[10].innerHTML += `* ${buff.name}<br>`
      });
    } else {
      cellTooltipDetails[10].innerHTML = "";
    }


    cellTooltip.classList.remove("hideTooltip");
    if (content.type === 'hero') return;


    // create a zoomed card highlight for minions
    const dataForZoomedCard = {
      mana: content.manaCost,
      hp: content.maxHp,
      healPower: content.healPower,
      magicPower: content.magicPower,
      atk : content.atk,
      monsterType : content.monsterType,
      commanderMinion: content.commander,
      info: content.info,
      icon: content.icon,
      name: content.name
    };
    createMonsterCard(dataForZoomedCard, null, null, true, this);
  }


  showActiveHighlight() {
    if (this.myTurn) {
      this.active_highlight
        //.lineStyle(3, 0xffaa00)
        .strokeRectShape(this.gameTable.getBounds());
    } else {
      this.active_highlight
        .lineStyle(3, 0x000000)
        .strokeRectShape(this.gameTable.getBounds());
    }
  }


  // ------------------------------------------------

  updateZoomedCard(zoomedCardElem) {
    if (!zoomedCardElem.isSameNode(this.zoomedCard)) {
      if (this.zoomedCard != null) {
        this.zoomedCard.remove(); // remove the old element
      }
      this.zoomedCard = zoomedCardElem;
      this.zoomedCard.setAttribute("id", "zoomCard");
      heroAreas.appendChild(this.zoomedCard);
    }
  }
  removeZoomedCard() {
    if (this.zoomedCard != null) {
      this.zoomedCard.remove();
      this.zoomedCard = null;
    }
  }

  createPlayerHand() {
    // clear the previous card elements
    this.prevHand.forEach((cardData, i) => {
      if (cardData.element)
        cardData.element.remove()
    });

    // create new card elements
    this.hand.forEach((cardData, i) => {
      if (cardData) {
        if (this.prevHand.indexOf(cardData) === -1) {
          if (cardData.cardType !== 'monster')
            createSpellCard(cardData, i, this.selectCard, this);
          else
            createMonsterCard(cardData, i, this.selectCard, false, this)
        }
        if (cardData.playable) {
          switch(cardData.cardType) {
            case 'monster':
              cardData.element.classList.add('playableMinion');
              break;
            case 'spell':
              cardData.element.classList.add('playableSpell');
              break;
          }
        }
      }
    });
    this.prevHand = this.hand;
  }

  updateHeroUi() {
    //heroClass.innerHTML = stringToUpperCase(this.hero);
    heroImage.src = `${client_address}/public/${this.classIcon}`;
    enemyHeroImage.src = `${client_address}/public/${this.otherClassIcon}`;

    heroHp.innerHTML = this.hp;
    heroMana.innerHTML = this.mana;
    cardsLeft.innerHTML = this.cardsLeft;

    enemyHeroClass.innerHTML = stringToUpperCase(this.enemyHero);
    enemyHeroHp.innerHTML = this.enemyHp;
    enemyHeroMana.innerHTML = this.enemyMana;
    enemyCardsLeft.innerHTML = this.enemyCardsLeft;

    phaseOwnerElem.innerHTML = this.myTurn ? 'My' : "Enemy's";//this.phase.type; // not needed right now
    turnNumberElem.innerHTML = (this.phase.address) ? this.phase.address[0]+1 : 0;
    //turnNumberElem.innerHTML = this.turn;

    nextPhaseOwnerElem.innerHTML = this.myTurn ? "Enemy's" : "My";//this.phase.type; // not needed right now
    nextTurnNumberElem.innerHTML = this.nextTurn;

    if (this.myTurn)
      endTurnButton.children[1].src = "public/assets/gui/Card_game_GUI/Parts/Button_Medium_On.png";
  }

  updateHeroSkillBar() {
    this.skills.forEach((skill) => {
      updateHeroSkill(skill);
      updateHeroSkillIcon(skill);
    });
    this.opponentSkills.forEach((skill) => {
      updateHeroSkill(skill, true);
      updateHeroSkillIcon(skill, true);
    });

  }
  // ------------------------------------------------

  // selection functions: answering action requests

  selectSkill(skillIndex, selectByClick=true) {
    if (!this.myTurn || !this.actionRequestData.length) return;

    let options = this.actionRequestData.filter(option => option.type === 'skill');
    if (!options.length) return;

    const skill = this.skills[skillIndex];
    console.log(skillIndex);
    if (!skill) return; // avoid the possibility of selecting e.g. a 'skill 6' that doesn't exist

    const selectedOption = this.actionRequestData.find(option => option.data === skill.skillIndex);

    if (selectedOption) {
      client.sendActionResponse(selectedOption).then(res => {
        this.actionRequestData = [];
        if (selectByClick) this.setSelectionMode('skill', true);
        else this.setSelectionMode('board', true);
      });
    }
    else {
      client.sendActionResponse({}).then(res => {
        this.actionRequestData = [];
        if (selectByClick) this.setSelectionMode('skill', true);
        else this.setSelectionMode('board', true);
      });
      this.actionRequestData = [];
    }
  }

  selectSkillWithKeybind(skillIndex) {
    if (!this.myTurn) return;


    //if (this.selectionMode !== 'skill') {

      client.sendSelectionMode('skill').then(res => {
        if (res.data === 'done')
          endTurnButton.classList.add("highlightButton");
        else
          endTurnButton.classList.remove("highlightButton");

        this.selectionMode = res.data;

        if (this.selectionMode === 'skill') {
          client.getActionRequest().then(res => {
              this.saveActionRequestData(res.data); // TODO: look at this field again
              //this.updateHighlighting();
              this.selectSkill(skillIndex, false)
            })
        }
      });

    //}

    /*
    else {
      this.selectSkill(skillIndex)
    }
    */


  }



  selectCard(handIndex) {
    if (!this.myTurn || !this.actionRequestData.length) return;
    let options = this.actionRequestData.filter(option => option.type === 'card');
    if (!options.length) return;

    const card = this.hand[handIndex];
    const selectedOption = this.actionRequestData.find(option => option.data === card.handIndex);

    if (selectedOption) {
      client.sendActionResponse(selectedOption).then(res => {
        this.actionRequestData = [];
        //zoomedCard.remove();
        //this.setSelectionMode('board', true);
        this.setSelectionMode('hand', true);
        this.removeZoomedCard();
        // card.element.classList.add("selectedCard"); // TODO:
      });
    }
    else {
      client.sendActionResponse({}).then(res => {
        this.actionRequestData = [];
        //zoomedCard.remove();
        this.setSelectionMode('hand', true);
      });
      this.actionRequestData = [];
    }
  }


  // TODO: to implement n > 1 ar's, send n and only send the response here if the as many options have been selected
  // select an action request option (for type cell)
  selectCell(pos) {

    // early returns to stop players spamming the server
    if (!this.myTurn || (this.actionRequestData == null || !this.actionRequestData.length)) {
      return;
    }
    // get the relevant options and return if all available options are of a different type
    let options = this.actionRequestData.filter(option => option.type === 'cell');
    if (!options.length)  {
      return;
    }

    // check if the player clicked on one of the options
    let selection = options.find((option) => (option.data.x === pos.x) && (option.data.y === pos.y));
    if (selection) {
      // if the player selected a valid option send the obj back (including an option id)
      client.sendActionResponse(selection).then(res => {
        this.actionRequestData = [];
        this.updateHighlighting();
        this.setSelectionMode('board', true);
        // this.deselectedAllCells()
      })
    } // else just send the selected position (for now simply notifies that the client has clicked "outside")
    else {
      client.sendActionResponse({}).then(res => {
        this.actionRequestData = [];
        this.updateHighlighting();
        this.setSelectionMode('board', true);
        // this.deselectedAllCells()
      })
    }
    this.actionRequestData = [];
  }

  saveActionRequestData(data) {
    this.actionRequestData = data;
    /*if (this.actionRequestData == null)
      this.actionRequestData = data;
    else
      this.actionRequestData = this.actionRequestData.concat(data);*/
  }

  updateHighlighting() {
    if (this.myTurn) endTurnButton.classList.remove("endOfTurnButtonStyle");

    // reset highlights
    this.deselectedAllCells(); // TODO: add deselectAllCards

    if (this.actionRequestData == null) return;
    // highlight all received options
    this.actionRequestData.forEach(option => {
      switch (option.type) {
        case "cell":
          this.highlightCell(option.data, option.initSelection);
          break;
        case "card":
          // atm the complete hand is re-created on game update
          // with each card holding information about highlighting
          break;
        default:
          break;
      }
    });
  }

  highlightCell(pos, initSelection) {
    let cellIndex = (pos.y * GRID_NUM_COLS) + pos.x; // convert x/y table coords to 1d index
    let {container} = this.gameTable.table.cells[cellIndex];
    container.select(initSelection);
  }



  deselectedAllCells() {
    this.gameTable.table.cells.forEach(cell => {
      cell.container.deselect();
    });
  }






  // --------------------------------------------------
  // --------------------------------------------------


  createFakeGrid() {
    this.gridCells = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
    // this.physics.add.overlap(this.player, this.gridCells, this.specialZoneFunction, false, this);
    for (let x = CELL_DRAW_SIZE; x < WIDTH-CELL_DRAW_SIZE; x+=CELL_DRAW_SIZE) {
      for (let y = CELL_DRAW_SIZE; y < HEIGHT-CELL_DRAW_SIZE; y+=CELL_DRAW_SIZE) {
        this.gridCells.create(x, y, CELL_DRAW_SIZE, CELL_DRAW_SIZE);
      }
    }
  }

  returnToWorldInTime(time) {
    this.time.addEvent({delay: time, callback: this.exitBattle, callbackScope: this});
  }


  wake() { // not in use right now
    console.log("battlescene woken up");
    /*
    this.cameras.main.setBackgroundColor("rgba(9,4,30,0.94)");
    this.scene.launch("MyUIScene");
    this.createFakeGrid();

     */
  }


  switchToWorldScene() {
    this.scene.stop();
    this.scene.wake('WorldScene');
  }


  exitBattle() {
    client.exitBattle().then(res => {
      console.log(res);
      this.switchToWorldScene();
    })
  }


  // end of class
}
