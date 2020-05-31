class GameClient { // rename api service or something
  constructor(game_ref) {
    this.player_id = null;
    this.selectedHero = null;
    this.socket = null;
    // TODO: game_ref really a scene ref?
    this.game_ref = game_ref; // only needed for socket msg defines atm
    this.game = game_ref;

    this.sendIdleMessage = this.sendIdleMessage.bind(this);
    this.sendIdleMessage();
  }

  // idle pings to the server -> every 10 seconds
  sendIdleMessage() {
    return axios.post(url('sendIdleMessage'), {
      id: this.player_id
    }).then(() => { // send the message again in 10 seconds
      setTimeout(this.sendIdleMessage, 10000);
    })
  }

  login(game_ref) {
    this.requestLogin()
      .then(res => { // get player id and position from the url
        const {id, pos} = res.data;
        //createPlayer(game_ref, pos);
        createQueueButton(game_ref);

        // init the client-url connection
        this.setPlayerId(id);
        this.initSocketConnection(game_ref);
        // init fetch for other players
        getDataAndUpdateOtherPlayers(game_ref);
      });
  }



  initSocketConnection() {
    this.socket = new WebSocket(ws_url('connect'));

    // send the player id on connection open
    this.socket.onopen = () => this.socket.send(this.player_id);
    // define different ws messages and how to react to them
    this.socket.onmessage = (message) => {
      switch (message.data) {
        case "idle":
          //console.log("received ws idle message from server");
          break;
        case "game_over_timeout":
          lossOrWinDisplay.innerHTML = "You won by Timeout!";
          lossOrWinDisplay.style.color = "gold";
          gameOverMessage.classList.remove("hideTooltip");
          showConfetti();
          timer.pause();
          blitzTimer.pause();
          break;
        case "game_over":
          this.getMatchData().then(res => {
            if (timer) timer.pause();
            if (blitzTimer) blitzTimer.pause();
            //console.log(res);
            let gameResult;
            if (res.data.hp <= 0 && res.data.enemyHp <= 0) {
              gameResult = "¯\\_(ツ)_/¯";
              gameOverMessage.style.backgroundImage = "none";
            }
            if (res.data.hp <= 0 && res.data.enemyHp > 0) {
              gameResult = "You lost.";
              gameOverMessage.style.backgroundImage = "none";
            }
            if (res.data.hp > 0 && res.data.enemyHp <= 0) {
              gameResult = "You won!";
              lossOrWinDisplay.style.color = "gold";
              showConfetti();
            }

            lossOrWinDisplay.innerHTML = gameResult;
            gameOverMessage.classList.remove("hideTooltip");
          });

          break;
        // event approach
        case "action_request":
          this.getActionRequest().then(res => {
            //let battleScene = this.game_ref.scene.get('BattleScene');
            this.game.saveActionRequestData(res.data); // TODO: look at this field again
            //battleScene.highlightCells(res.data);
            this.game.updateHighlighting();
          });
          break;

        case "animation_damage":
          this.getAnimationData("damage").then(res => {
            const animatedPositions = [];
            res.data.forEach(dmg => {
              const {pos, amount} = dmg;
              const cell = this.game.tableData[pos.x][pos.y];
              let numAnimsOnSamePos = animatedPositions.filter(prevPos => prevPos.x === pos.x && prevPos.y === pos.y).length;

              const showTimer = numAnimsOnSamePos * 600;
              //const hideTimer = showTimer + 100;
              //console.log(`show: ${showTimer} - hide: ${hideTimer}`);
              setTimeout(function() {
                cell.dmgHitImage.classList.remove("hideCellContent");
                cell.dmgHitImage.innerHTML = `-${amount}`;

                setTimeout(function() {
                  cell.dmgHitImage.classList.add("hideCellContent");
                  cell.dmgHitImage.innerHTML = "";
                }, 350);

              }, showTimer);

              animatedPositions.push(pos);
            });
            //this.game.tableData[]
          });

          break;

        case "game_update":
          this.sendSelectionMode("board");
          this.getMatchData().then(res => {
            // TODO: update sprite and client table
            // TODO: needs func to update table from grid
            //let battleS = this.game_ref.scene.get('BattleScene');
            // update the data
            this.game.updateHistory(res.data.eventHistory);
            this.game.updateMatchData(res.data);
            //this.game.updateTableData(); // update the local grid
            this.game.createPlayerHand(true); // create player hand from the new cards
            // UPDATE SKILL BAR
            this.game.updateHeroSkillBar();
            this.game.updateHeroUi(); // update hero hp/mana display

            //battleS.updateHeroSprites(); // update player and opponent sprite positions


            this.game.updateHTMLGameTable();
            this.game.updateHighlighting(); // update highlighting
          });
          break;


        // ======================================000
        case "start_mulligan":
          this.getMulliganHand().then(res => {
            //console.log(res.data);
            this.game.mulliganHand = res.data;
            this.game.createMulliganHand();

          });
          break;
        case "mulligan_over":
          this.getMatchData().then(res => {
            //finishMulligan();
            this.game.mulliganHand = null;
            this.game.mulliganedCards = null;
            this.game.updateMatchData(res.data);
            fadeMulliganMessage();
          });
          break;
        case "new_data":
          getDataAndUpdateOtherPlayers(this.game);
          break;
        case "new_match":
          this.game.create();
          //this.game_ref.switchToBattleScene();
          break;
        case "exit_battle":
          /*
          console.log("exit battle!");
          let battle = this.game_ref.scene.get('BattleScene');
          battle.switchToWorldScene(); // TODO: candidate for second client
          */
          break;

        default: // TODO: temp used for deletion of players (ids are send directly)
          //// console.log(`${message.data} is dc'd`);
          deletePlayer(Number(message.data));
          break;
      }
    };
  }

  sendBlitzTimeout() {
    return axios.post(url('sendBlitzTimeout'), {
      id: this.player_id
    });
  }

  getMulliganHand() {
    return axios.post(url('getMulliganHand'), {
      id: this.player_id
    });
  }

  confirmMulligan() {
    return axios.post(url('confirmMulligan'), {
      id: this.player_id,
      mulliganedCards: [...this.game.mulliganedCards].map(k => k[1])
    });
  }

  getAnimationData() {
    return axios.post(url('getAnimationData'), {
      id: this.player_id
    });
  }

  getMatchData() {
    return axios.post(url('getMatchData'), {
      id: this.player_id
    });
  }

  exitBattle() {
    return axios.post(url('exitBattle'), {
      id: this.player_id
    });
  }

  setPlayerId(id) {
    this.player_id = id;
  }

  requestLogin() {
    return axios.post(url('requestLogin'))
  }

  joinQueue() {
    if (this.selectedHero == null) return;

    return axios.post(url('lookingForGame'), {
      id: this.player_id,
      hero: this.selectedHero,
    })
  }


  sendPlayerAction(actions) {
    return axios.post(url('sendPlayerAction'), {
      id: this.player_id, // TODO: could be filled with temp data if player moves too early (depends on temp data)
      actions
    })
  }

  requestOtherPlayerData() {
    return axios.post(url('requestOtherPlayerData'), {
      id: this.player_id
    })
  }

  // ==================================
  // battle routes


  sendReadyForMatchMessage() {
    return axios.post(url('sendReadyForMatchMessage'), {
      id: this.player_id,
    })
  }

  getBoardUpdate() {
    return axios.post(url('getBoardUpdate'), {
      id: this.player_id,
    })
  }

  // ==================================
  // Event Approach

  getActionRequest() {
    return axios.post(url('getActionRequest'), {
      id: this.player_id,
    })
  }

  sendActionResponse(selectedAction) {
    return axios.post(url('sendActionResponse'), {
      id: this.player_id,
      data: selectedAction,
    })
  }

  endTurn() {
    return axios.post(url('endTurn'), {
      id: this.player_id,
    })
  }

  // cards -------------------

  getPlayerHand() {
    return axios.post(url('getPlayerHand'), {
      id: this.player_id
    })
  }

  sendSelectionMode(mode) {
    return axios.post(url('sendSelectionMode'), {
      id: this.player_id,
      data: mode,
    })
  }

  getTooltipInformation(hoverData) {
    return axios.post(url('getTooltipInformation'), {
      id: this.player_id,
      data: hoverData,
    })
  }





  // end of class
}
