class BattleSceneBUG extends Phaser.Scene {
  constructor(config={key: 'BattleScene'}) {
    super(config);
    this.gridCells = null;
    this.gameTable = null;

    this.selectionMode = null; // hand | board | skill
    // -----------------------------------
    // player stats
    this.player_index = null;
    this.board = null;
    this.turn = null;
    this.myTurn = null;
    this.hand = [];
    // hero stats;
    this.pos = null;
    this.hp = null;
    this.mana = null;

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
    this.load.plugin('rexgridtableplugin', 'lib/phaser/plugins/rexgridtableplugin.min.js', true);
  }

  setSelectionMode(mode) {
    if (mode === this.selectionMode || !this.myTurn)
      return;

    this.selectionMode = mode;
    client.sendSelectionMode(mode).then(res => {
      if (res.data === 'done')
        endTurnButton.classList.add("highlightButton");
      else
        endTurnButton.classList.remove("highlightButton");
    });
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
        container.x = x;
        container.y = y;
        if (container.sprite != null) container.clearSprite();
        // set text for cells with entities
        if (cell.content && cell.content.visible) {
          container.setEntityText(cell.content, cell.friendly);
          //if (container.sprite == null) {
            if (cell.content.type === "monster") {
              if (cell.friendly) {
                container.setSprite(this.createFriendlyEntity({x,y}));
              }
              else {
                container.setSprite(this.createEnemyEntity({x,y}));
              }
            }
            else {
              container.clearSprite(true);
            }
          //}
        }
        else {
          container.clearSprite();
          container.setPosText(cell.cellType);
        }
      }
    }
  }

  createFriendlyEntity(pos) {
    const entity = this.add.sprite(pos.x*CELL_DRAW_SIZE+CELL_DRAW_OFFSET, pos.y*CELL_DRAW_SIZE+CELL_DRAW_OFFSET,
      `dragonblue`, 6);
    // TODO: check if old sprites need to be removed
    return entity;
  }

  createEnemyEntity(pos) {
    const entity = this.add.sprite(pos.x*CELL_DRAW_SIZE+CELL_DRAW_OFFSET, pos.y*CELL_DRAW_SIZE+CELL_DRAW_OFFSET,
      `dragonorange`, 6);
    return entity;
  }

  updateHistory(newHistory) {
    console.log(newHistory);
    if (!newHistory) return;
    if (newHistory.length === this.eventHistory.length) return;

    //let startIndex = this.eventHistory.length-1;
    for (let i = this.eventHistoryIndex; i < newHistory.length; i++) {
      createNewHistoryEntry(newHistory[i]);
    }
    this.eventHistoryIndex = newHistory.length;
  }

  updateMatchData(data) {
    this.eventHistory = data.eventHistory;
    this.player_index = data.index;
    this.pos = data.pos;
    this.mana = data.mana;
    this.hp = data.hp;
    this.board = data.board;
    this.turn = data.turn;
    this.myTurn = data.myTurn;
    this.otherPos = data.otherPos;
    this.hand = data.hand;
    this.skills = data.skills;
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
      this.showActiveHighlight();

      // notify server that initial data was retrieved
      client.sendReadyForMatchMessage().then(res => {
        initMatchSelectionModes(); //
      });

      this.createPlayerHand();
      this.updateHeroUi();
      initHeroSkills();
    });


    // ==================================00
    //createLeaveButton(this);
    createEndTurnButton(this);
    this.cameras.main.setBackgroundColor(0xffaa00);
    this.scene.launch("MyUIScene");
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

  // ------------------------------------------------select
  // own methods

  initTable() {
    const newCellObject = function (scene, cell) {
      const bg = scene.add.graphics(0, 0)
        .fillStyle(0xffffff)
        .lineStyle(1, 0x000000)
        .fillRect(2, 2, CELL_DRAW_SIZE, CELL_DRAW_SIZE)
        .strokeRect(2, 2, CELL_DRAW_SIZE, CELL_DRAW_SIZE);
      const txt = scene.add.text(5, 5, `${cell.colIndx}|${cell.rowIndx}`);
      // game.scene.scenes[1].gameTable.table.cells[0].container.list[1].text
      return new Cell(scene, 0, 0, [bg, txt]);
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
    this.active_highlight = this.add.graphics();
  }

  showCellContentTooltip(cell) {
    if (this.hoveredCell === cell) return;
    else {
      this.hoveredCell = null;
      cellTooltip.classList.add("hideTooltip");
    }

    const {content} = cell;
    if (content == null || (!content.visible && !cell.friendly)) return;


    this.hoveredCell = cell;

    cellTooltipDetails[0].innerHTML = `${cell.friendly? "<span style='color: #31ff04'>Friendly</span>": "<span style='color: crimson'>Enemy</span>"}`;

    if (content.name) cellTooltipDetails[1].innerHTML = `<div style='border-bottom: 1px solid #333'>Name: ${content.name}</div>`;
    else cellTooltipDetails[1].innerHTML = "";

    cellTooltipDetails[2].innerHTML = `Atk: ${content.atk} - HP: ${content.hp}`;
    cellTooltipDetails[3].innerHTML = `Type: ${content.type}`;

    cellTooltipDetails[4].innerHTML = `Can Move: ${content.canMove && content.allowedToMove}`;
    cellTooltipDetails[5].innerHTML = `Can Fight: ${content.canFight && content.allowedToFight}`;
    cellTooltipDetails[6].innerHTML = `Can Defend: ${content.canDefend}`;

    if (content.buffs.length) {
      cellTooltipDetails[7].innerHTML = `Status:`;
      content.buffs.forEach(buff => {
        cellTooltipDetails[7].innerHTML += `${cell.friendly ? "<span style='color: #31ff04'>Buff:</span>" : "<span style='color: crimson'>Debuff:</span>"} ${buff.name} ${buff.ccType ? '('+ buff.ccType +')' : ''}<br>`
      })
    } else {
      cellTooltipDetails[7].innerHTML = `Status:`;
    }



    cellTooltip.classList.remove("hideTooltip");
    // friendly / hostile
    // type
    // atk
    // hp

    // show below probably if they're affected or exist in the case of cast
    // canMove && allowedToMove
    // canFight && allowedToMove
    // allowedToCast


    // effect
    // buffs?

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

  createPlayerHand() {
    // clear the previous card elements
    let prevElems = document.querySelectorAll("div.cardStyle");
    prevElems.forEach(elem => elem.remove());
    // create new card elements
    this.hand.forEach((cardData, i) => {
      createCardElem(cardData, i, this.selectCard)
    });
  }

  updateHeroUi() {
    heroHp.innerHTML = this.hp;
    heroMana.innerHTML = this.mana;
  }

  updateHeroSkillBar() {
    this.skills.forEach(skill => {
      updateHeroSkill(skill);
    });
  }
  // ------------------------------------------------

  // selection functions: answering action requests

  selectSkill(skillIndex) {
    if (!this.myTurn || !this.actionRequestData.length) return;
    let options = this.actionRequestData.filter(option => option.type === 'skill');
    if (!options.length) return;

    const skill = this.skills[skillIndex];
    const selectedOption = this.actionRequestData.find(option => option.data === skill.skillIndex);

    if (selectedOption) {
      console.log(selectedOption);
      client.sendActionResponse(selectedOption).then(res => {
        this.actionRequestData = [];
      });
    }
    else {
      client.sendActionResponse({}).then(res => {
        this.actionRequestData = [];
      });
      this.actionRequestData = [];
    }
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
      });
    }
    else {
      client.sendActionResponse({}).then(res => {
        this.actionRequestData = [];
      });
      this.actionRequestData = [];
    }
  }


  // TODO: to implement n > 1 ar's, send n and only send the response here if the as many options have been selected
  // select an action request option (for type cell)
  selectCell(pos) {
    // early returns to stop players spamming the server
    if (!this.myTurn || !this.actionRequestData.length) return;
    // get the relevant options and return if all available options are of a different type
    let options = this.actionRequestData.filter(option => option.type === 'cell');
    if (!options.length) return;

    // check if the player clicked on one of the options
    let selection = options.find((option) => (option.data.x === pos.x) && (option.data.y === pos.y));
    if (selection) {
      // if the player selected a valid option send the obj back (including an option id)
      client.sendActionResponse(selection).then(res => {
        this.actionRequestData = [];
        this.updateHighlighting();
        // this.deselectedAllCells()
      })
    } // else just send the selected position (for now simply notifies that the client has clicked "outside")
    else {
      client.sendActionResponse(pos).then(res => {
        this.actionRequestData = [];
        this.updateHighlighting();
        // this.deselectedAllCells()
      })
    }
  }

  saveActionRequestData(data) {
    console.log(data);
    this.actionRequestData = data;
  }

  updateHighlighting() {
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

    /*
    if (!initSelection) {
      container.select(this.board[pos.x][pos.y].friendly);
    } else {
      container.select();
    }*/

    container.select(initSelection);


    //container.select();
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
