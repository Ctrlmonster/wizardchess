const cardContainer = document.getElementById("cardContainer");
const cellTooltip = document.getElementById("cellTooltip");
const cellTooltipDetails = document.querySelectorAll("#cellTooltip div");
const heroSkillContainer = document.getElementById("heroSkillsContainer");
const heroArea = document.getElementById("heroArea");
const heroStatsContainer = document.getElementById("heroStatsContainer");
const enemyStatsContainer = document.getElementById("enemyStatsContainer");

// ===========================================================================================

const heroSkills = document.querySelectorAll("#heroSkillsContainer .heroSkill");
const enemySkills = document.querySelectorAll("#enemySkillsContainer .heroSkill");

const heroSkillTooltips = document.querySelectorAll("#heroSkillsContainer .heroSkillTooltip");
const enemySkillTooltips = document.querySelectorAll("#enemySkillsContainer .heroSkillTooltip");

const skillIconElems = document.querySelectorAll("#heroSkillsContainer .skillIcon");
const enemySkillIconElems = document.querySelectorAll("#enemySkillsContainer .enemySkillIcon");

const skillCdElems = document.querySelectorAll("#heroSkillsContainer .skillCd");
const enemySkillCdElems = document.querySelectorAll("#enemySkillsContainer .skillCd");

// ===========================================================================================
let gameCanvas; // needs to wait for canvas creation by phaser

const turnInfo = document.getElementById("turnInfo");
const phaseOwnerElem = document.getElementById("phaseOwner");
const turnNumberElem = document.getElementById("turnNumber");

const heroHp = document.getElementById("heroHp");
const heroClass = document.getElementById("heroClass");
const heroMana = document.getElementById("heroMana");
const cardsLeft = document.getElementById("cardsLeft");

const enemyHeroHp = document.getElementById("enemyHeroHp");
const enemyHeroClass = document.getElementById("enemyHeroClass");
const enemyHeroMana = document.getElementById("enemyHeroMana");
const enemyCardsLeft = document.getElementById("enemyCardsLeft");

const historyContainer = document.getElementById("historyContainer");
const historyHeader = document.getElementById("historyHeader");
const gameOverMessage = document.getElementById("gameOverMessage");
const startDuelMessage = document.getElementById("startDuelMessage");
const returnToLobbyButton = document.getElementById("returnToLobby");
const lossOrWinDisplay = document.getElementById("lossOrWin");

const introMessage = document.getElementById("introMessage");
const heroSelect = document.getElementById("heroSelect");

returnToLobbyButton.addEventListener("click", () => {
  location.reload();
});

function showGameElements() {
  heroSkills.forEach(skill => skill.classList.remove("hideTooltip"));
  enemySkills.forEach(skill => skill.classList.remove("hideTooltip"));

  historyContainer.classList.remove("hideTooltip");
  historyHeader.classList.remove("hideTooltip");
  heroStatsContainer.classList.remove("hideTooltip");
  enemyStatsContainer.classList.remove("hideTooltip");
  endTurnButton.classList.remove("hideTooltip");
  turnInfo.classList.remove("hideTooltip");
  introMessage.classList.add("hideTooltip");
}


function updateHeroSkillIcon(skillData, enemy=false) {
  const icon_path = client_address + `/public/${skillData.icon}`;
  const index = skillData.skillIndex;
  if (!enemy)
    skillIconElems[index].src = icon_path;
  else
    enemySkillIconElems[index].src = icon_path;

  // TODO auch nur einmal!
}

function updateHeroSkill(skillData, enemy=false) {
  let skillInfoElems = !enemy ? heroSkillTooltips[skillData.skillIndex] : enemySkillTooltips[skillData.skillIndex];
  let skillIcon = !enemy ? skillIconElems[skillData.skillIndex] : enemySkillIconElems[skillData.skillIndex];

  if (!skillData.playable) {
    skillIcon.classList.add('skillOnCd');
    if (!enemy) {
      heroSkills[skillData.skillIndex].classList.remove("playableSkill")
    }
  } else {
    skillIcon.classList.remove('skillOnCd');
    if (!enemy) {
      heroSkills[skillData.skillIndex].classList.add("playableSkill")
    }
  }

  if (!enemy)
    skillCdElems[skillData.skillIndex].innerHTML = (skillData.coolDown > 0) ? skillData.coolDown : '';
  else
    enemySkillCdElems[skillData.skillIndex].innerHTML = (skillData.coolDown > 0) ? skillData.coolDown : '';

  const cd = `Cd: ${skillData.coolDown} / ${skillData.maxCoolDown} Rounds`;
  const defaultText = `
<div>${skillData.name}<br>
${cd}</br>
${skillData.mana} Mana</div><br>
`;

  skillInfoElems.children[0].innerHTML = defaultText;
}

function initHeroSkillTooltips(skillData, enemy=false) {
  const skillInfoElems = !enemy ? heroSkillTooltips[skillData.skillIndex] : enemySkillTooltips[skillData.skillIndex];
  const skillContainer = !enemy ? heroSkills[skillData.skillIndex] : enemySkills[skillData.skillIndex];

  const cd = `Cd: ${skillData.coolDown} / ${skillData.maxCoolDown} Rounds`;
  const defaultText = `
<div>${skillData.name}<br>
${cd}</br>
${skillData.mana} Mana</div>
`;
  skillInfoElems.children[0].innerHTML = defaultText;

  //const tooltipElem = document.createElement('DIV');
  //skillInfo.children[1].classList.add("hideTooltip");
  skillInfoElems.children[1].innerHTML = skillData.info;

  skillContainer.addEventListener("mouseout", () => {
    skillInfoElems.classList.add("hideTooltip");
    skillInfoElems.classList.remove("displayHeroSkillTooltip");
  });

  skillContainer.addEventListener("mouseover", () => {
    skillInfoElems.classList.remove("hideTooltip");
    skillInfoElems.classList.add("displayHeroSkillTooltip");
  });

  //skillInfo.children[0].appendChild(tooltipElem);
}


function initHeroSkills() {
  let battleScene = game.scene.getScene('BattleScene');
  heroSkills.forEach((skillElem, i) => {
    skillElem.addEventListener('click', () => {
      console.log(`selected skill index ${i}`);
      battleScene.selectSkill(i);
    });
  });

  battleScene.skills.forEach((skill) => {
    initHeroSkillTooltips(skill)
  });
  battleScene.opponentSkills.forEach((skill) => {
    initHeroSkillTooltips(skill, true)
  });



  heroArea.addEventListener('mouseover', () => {
    battleScene.setSelectionMode('skill');
  })

  /*
  heroSkillContainer.addEventListener('mouseover', () => {
    //console.log("set select mode to skill");
    battleScene.setSelectionMode('skill');
  })*/
}


// -------------------------------------------------------------

function createCardElem(cardData, handIndex, dataCallback) {
  let displayData = Object.assign({}, cardData);
  delete displayData.handIndex;
  delete displayData.playable;
  delete displayData.cardId;

  let cardElem = document.createElement('DIV');
  let cardContentElem = document.createElement('DIV');

  cardElem.classList.add('cardStyle');
  cardContentElem.classList.add('cardContent');
  if (cardData.cardType === 'monster') cardElem.classList.add('minionCardStyle');
  if (cardData.cardType === 'spell') cardElem.classList.add('spellCardStyle');

  if (cardData.playable) {
    switch(displayData.cardType) {
      case 'monster':
        cardElem.classList.add('playableMinion');
        break;
      case 'spell':
        cardElem.classList.add('playableSpell');
        break;
    }
  }

  // ===================================================
  // add a tooltip box for special events
  if (displayData.special) {
    let infoElem = document.createElement("DIV");
    infoElem.innerHTML = displayData.info;
    infoElem.classList.add("hideTooltip");
    cardElem.classList.add("hasTooltip");

    cardElem.appendChild(infoElem);
  }

  if (displayData.special) {
    cardElem.addEventListener("mouseover", function() {
      let infoElem = this.childNodes[0];
      infoElem.classList.remove("hideTooltip");
      infoElem.classList.add("displayTooltip");

    });

    cardElem.addEventListener("mouseout", function() {
      let infoElem = this.childNodes[0];
      infoElem.classList.remove("displayTooltip");
      infoElem.classList.add("hideTooltip");
    });
  }

  delete displayData.info;
  // ===================================================


  /*for (let key in displayData) {
    if (displayData.hasOwnProperty(key)) {
      let dataElem = document.createElement("DIV");
      dataElem.innerHTML = `${key}: ${displayData[key]}`;
      cardContentElem.appendChild(dataElem);
    }
  }*/

  let dataElem = document.createElement("DIV");
  dataElem.innerHTML = `${displayData.name}<br>`;
  //dataElem.style.borderBottom = "1px solid black";
  cardContentElem.appendChild(dataElem);

  dataElem = document.createElement("DIV");
  dataElem.innerHTML = `Mana Cost: ${displayData.mana}`;
  dataElem.style.borderBottom = "1px solid black";
  cardContentElem.appendChild(dataElem);

  // spell cards
  if (displayData.cardType === 'spell') {
    dataElem = document.createElement("DIV");
    dataElem.innerHTML = `${stringToUpperCase(displayData.cardType)}`;
    cardContentElem.appendChild(dataElem);

    if (displayData.icon) {
      let iconContainer = document.createElement("DIV");
      iconContainer.classList.add("cardIconStyle");
      let cardIcon = document.createElement("IMG");
      const icon_path = client_address + `/public/${displayData.icon}`;
      iconContainer.appendChild(cardIcon);
      cardIcon.src = icon_path;
      cardIcon.style.width = "11rem";
      cardIcon.style.height = "11rem";
      cardContentElem.appendChild(iconContainer);
    }
  }

  // -----------------------------------------------------------------
  // monster cards
  if (displayData.cardType === "monster") {
    if (displayData.monsterType) {
      dataElem = document.createElement("DIV");
      dataElem.innerHTML = `${stringToUpperCase(displayData.monsterType)}`;
      cardContentElem.appendChild(dataElem);
    }

    dataElem = document.createElement("DIV");
    dataElem.innerHTML = `Atk: ${displayData.atk}`;
    cardContentElem.appendChild(dataElem);

    dataElem = document.createElement("DIV");
    dataElem.innerHTML = `HP: ${displayData.hp}`;
    cardContentElem.appendChild(dataElem);

    if (displayData.magicPower) {
      dataElem = document.createElement("DIV");
      dataElem.innerHTML = `Spellpower: ${displayData.magicPower}`;
      cardContentElem.appendChild(dataElem);
    }
    if (displayData.healPower) {
      dataElem = document.createElement("DIV");
      dataElem.innerHTML = `Healpower: ${displayData.healPower}`;
      cardContentElem.appendChild(dataElem);
    }
    if (displayData.monsterMana) {
      dataElem = document.createElement("DIV");
      dataElem.innerHTML = `Casts: ${displayData.monsterMana / 10}`;
      cardContentElem.appendChild(dataElem);
    }

    if (displayData.commanderMinion) {
      dataElem = document.createElement("DIV");
      dataElem.innerHTML = `Commander`;
      cardContentElem.appendChild(dataElem);
    }
  }


  cardElem.addEventListener("click", () => {
    dataCallback(handIndex)
  });

  cardElem.setAttribute("hand-index", String(handIndex));
  cardElem.appendChild(cardContentElem);
  cardContainer.appendChild(cardElem);
}


function initMatchSelectionModes() {
  let battleScene = game.scene.getScene('BattleScene');
  let gameContainer = document.querySelector("#gameContainer");
  let canvasContainer = document.querySelector("#canvasContainer");
  gameCanvas = document.querySelector("canvas");
  const canvasRect = gameCanvas.getBoundingClientRect();

  canvasContainer.addEventListener('mouseover', () => {
    battleScene.setSelectionMode('board');
  });

  /*
  gameContainer.addEventListener('mouseover', () => {
    battleScene.setSelectionMode('board');
  });*/



  gameContainer.addEventListener('click', (evt) => {
    if (!(evt.pageX > canvasRect.left && evt.pageX < canvasRect.right &&
        evt.pageY > canvasRect.top && evt.pageY < canvasRect.bottom)) {
      battleScene.selectCell({x: -1, y: -1}); // auto deselect if clicked outside of the board
    }
  });

  cardContainer.addEventListener('mouseover', () => {
    battleScene.setSelectionMode('hand');
  });
}


function createNewHistoryEntry(data) {
  console.log(data);
  let entry = document.createElement("DIV");
  entry.classList.add("historyEntry");
  entry.innerHTML = `Player`;

  let friendly = client.player_id === data.playerId;
  let type = stringToUpperCase(data.type);
  let name = data.name;
  let turn = data.turn;

  entry.innerHTML = `${friendly? "<span style='color: #3e92ff'>Myself</span>": "<span style='color: crimson'>Enemy</span>"} Turn Nr. <span>${turn}</span><br>`;
  entry.innerHTML += `${type}: ${name}`;

  historyContainer.appendChild(entry);
  console.log(historyContainer.scrollHeight);
  historyContainer.scrollTop = historyContainer.scrollHeight
}

function stringToUpperCase(string) {
  return string[0].toUpperCase() + string.slice(-string.length+1);
}


heroSelect.addEventListener('change', function() {
  client.selectedHero = this.value;
});





