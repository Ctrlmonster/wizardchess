class GameClient { // rename api service or something
  constructor(game_ref) {
    this.player_id = null;
    this.socket = null;
    // TODO: game_ref really a scene ref?
    this.game_ref = game_ref; // only needed for socket msg defines atm

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
        case "game_over":
          console.log("game is over");
          this.getMatchData().then(res => {
            let gameResult;
            if (res.data.hp <= 0 && res.data.otherHp <= 0)
              gameResult = "It ended in a Draw.";
            if (res.data.hp <= 0 && res.data.otherHp > 0)
              gameResult = "You lost.";
            if (res.data.hp > 0 && res.data.otherHp <= 0)
              gameResult = "You won!";

            lossOrWinDisplay.innerHTML = gameResult;
            gameOverMessage.classList.remove("hideTooltip");
          });

          break;
        // event approach
        case "action_request":
          this.getActionRequest().then(res => {
            let battleScene = this.game_ref.scene.get('BattleScene');
            battleScene.saveActionRequestData(res.data); // TODO: look at this field again
            //battleScene.highlightCells(res.data);
            battleScene.updateHighlighting();
          });
          break;

        case "game_update":
          this.sendSelectionMode("board");
          this.getMatchData().then(res => {
            // TODO: update sprite and client table
            // TODO: needs func to update table from grid
            let battleS = this.game_ref.scene.get('BattleScene');
            // update the data
            battleS.updateHistory(res.data.eventHistory);
            battleS.updateMatchData(res.data);
            battleS.updateTableData(); // update the local grid
            battleS.createPlayerHand(); // create player hand from the new cards
            // UPDATE SKILL BAR
            battleS.updateHeroSkillBar();
            battleS.updateHeroUi(); // update hero hp/mana display
            battleS.updateHeroSprites(); // update player and opponent sprite positions
            battleS.updateHighlighting(); // update highlighting
          });
          break;


        // ======================================000
        case "new_data":
          getDataAndUpdateOtherPlayers(this.game_ref);
          break;
        case "new_match":
          this.game_ref.switchToBattleScene();
          break;
        case "exit_battle":
          console.log("exit battle!");
          let battle = this.game_ref.scene.get('BattleScene');
          battle.switchToWorldScene(); // TODO: candidate for second client
          break;

        default: // TODO: temp used for deletion of players (ids are send directly)
          //// console.log(`${message.data} is dc'd`);
          deletePlayer(Number(message.data));
          break;
      }
    };
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
    return axios.post(url('lookingForGame'), {
      id: this.player_id
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
      pos
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
