let map, obstacles;
const initGraphics = (game_ref) => {
  map = game_ref.make.tilemap({ key: 'map' });
  let tiles = map.addTilesetImage('spritesheet', 'tiles');
  let grass = map.createStaticLayer('Grass', tiles, 0, 0);
  obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0);
  obstacles.setCollisionByExclusion([-1]); // makes all objects collidable
  // player physics and boundaries
  game_ref.physics.world.bounds.width = map.widthInPixels;
  game_ref.physics.world.bounds.height = map.heightInPixels;
  // game_ref.player.setCollideWorldBounds(true);
  game_ref.physics.add.collider(game_ref.player, obstacles);
};

function playerAnimation(player, action) {
  switch (action) {
    case 'left':
      player.anims.play('left', true);
      break;
    case 'right':
      player.anims.play('right', true);
      break;
    case 'up':
      player.anims.play('up', true);
      break;
    case 'down':
      player.anims.play('down', true);
      break;
    default:
      break;
  }
}

function calcOtherPlayersActions(oldPos, newPos) {
  let diff = {
    x: oldPos.x - newPos.x,
    y: oldPos.y - newPos.y
  };
  let actions = [];
  if (diff.x < 0) actions.push('right');
  else if (diff.x > 0) actions.push('left');
  if (diff.y < 0) actions.push('down');
  else if (diff.y > 0) actions.push('up');
  return actions;
}

const createAnimations = (game_ref) => {
  //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
  game_ref.anims.create({
    key: 'left',
    frames: game_ref.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13]}),
    frameRate: 10,
    repeat: -1
  });
  // animation with key 'right'
  game_ref.anims.create({
    key: 'right',
    frames: game_ref.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13] }),
    frameRate: 10,
    repeat: -1
  });
  game_ref.anims.create({
    key: 'up',
    frames: game_ref.anims.generateFrameNumbers('player', { frames: [2, 8, 2, 14]}),
    frameRate: 10,
    repeat: -1
  });
  game_ref.anims.create({
    key: 'down',
    frames: game_ref.anims.generateFrameNumbers('player', { frames: [ 0, 6, 0, 12 ] }),
    frameRate: 10,
    repeat: -1
  });
};

const initCamera = (game_ref) => {
  game_ref.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  game_ref.cameras.main.startFollow(game_ref.player);
  game_ref.cameras.main.roundPixels = true;
};



// =============================================================================
// =============================================================================
// =============================================================================

// Own functions
let queueButton, leaveButton, endTurnButton;
let otherPlayersMap = new Map();

function createQueueButton(game_ref) {
  queueButton = document.getElementById("queue");
  queueButton.addEventListener('click', () => client.joinQueue(game_ref)
    .then(res => {
      // start game
    }));
}

function createLeaveButton(game_ref) {
  leaveButton = document.getElementById('leaveGame');
  leaveButton.addEventListener("click", () => {
    game_ref.exitBattle(game_ref.player_id);
  });
}

function createEndTurnButton(game_ref) {
  endTurnButton = document.getElementById('endTurn');
  endTurnButton.addEventListener('click', function() {
    this.children[1].src = "public/assets/gui/Card_game_GUI/Parts/Button_Medium_Off.png";
    game_ref.actionRequestData = null; // clear previous turns ar data (just for belows highlighting fn)
    game_ref.updateHighlighting(); // remove highlighting
    endTurnButton.classList.add("endOfTurnButtonStyle");
    endTurnButton.classList.remove("highlightButton");
    client.endTurn().then(res => { // remove end turn highlighting
      heroSkills.forEach(skill => skill.classList.remove("playableSkill"))
    })
  })
}

// end turn for above
function endTurn() {

}


const initPlayer = (game_ref) => {
  game_ref.player = game_ref.physics.add.sprite(100, 100, 'player', 6);
};


const createPlayer = (game_ref, pos) => {
  game_ref.player = game_ref.physics.add.sprite(pos.x, pos.y, 'player', 6);
  game_ref.player.setCollideWorldBounds(true);
};

function addOtherPlayer(game_ref, playerData) {
  const {id, pos} = playerData; // create a new player at given position with random color
  const otherPlayer = game_ref.add.sprite(pos.x, pos.y, 'otherPlayer', 6);
  otherPlayer.setTint(Math.random() * 0xffffff);
  otherPlayersMap.set(id, otherPlayer);
}

function deletePlayer(player_id) {
  otherPlayersMap.get(player_id).destroy();
  otherPlayersMap.delete(player_id);
}



// quick fix for handling other players animation
// stops the animation every n*delta seconds (new player events start them again)
let timeOfLastAnimationReset = 0;
function resetOthersPlayersAnimation(time, delta) {
  if ((time - timeOfLastAnimationReset) > (10*delta)) {
    otherPlayersMap.forEach(player => {
      player.anims.stop();
    });
    timeOfLastAnimationReset = time;
  }
}

function updateOtherPlayers(game_ref, otherPlayers) {
  // if (otherPlayers.length - otherPlayersObject.size) TODO: use this to determine who has more players and needs update
  for (let i = 0; i < otherPlayers.length; i++) {
    let data = {id, pos} = otherPlayers[i]; // check if the player exists
    if (!otherPlayersMap.has(id)) addOtherPlayer(game_ref, data);
    else {
      // check the position difference and play the fitting animation
      let otherPlayer = otherPlayersMap.get(id);
      let prevPosition = {x,y} = otherPlayer;
      let actions = calcOtherPlayersActions(prevPosition, pos);
      actions.forEach(action => playerAnimation(otherPlayer, action));
      otherPlayer.setPosition(pos.x, pos.y);
    }
  }
}


function getDataAndUpdateOtherPlayers(game_ref) {
  client.requestOtherPlayerData()
    .then(/*updateOtherPlayers(game_ref, res.data)*/);
}

function login(game_ref) {
  client.requestLogin()
    .then(res => { // get player id and position from the url
      const {id, pos} = res.data;
      createQueueButton(game_ref);

      // init the client-url connection
      client.setPlayerId(id);
      client.initSocketConnection(game_ref);
      // init fetch for other players
      getDataAndUpdateOtherPlayers(game_ref);
    });
}


function playerControlsLoop(game_ref) {
  // update all velocities if arrow keys are pressed
  const {up, down, left, right} = game_ref.cursors;
  let pressedKeys = [];
  if (up.isDown) pressedKeys.push("up");
  if (down.isDown) pressedKeys.push("down");
  if (left.isDown) pressedKeys.push("left");
  if (right.isDown) pressedKeys.push("right");

  // check if any key was pressed and the running animation should be played
  if (pressedKeys.length === 0) game_ref.player.anims.stop();
  else pressedKeys.forEach(action => {
    playerAnimation(game_ref.player, action)
  });
  // new position is send to the url and then updated locally
  if (pressedKeys.length) { // TODO: null can be send if player moves to early (bug will vanish if an app establishes connections before the game start
    client.sendPlayerAction(pressedKeys).then(res => {
      game_ref.player.setPosition(res.data.x, res.data.y);
    })
  }
}

