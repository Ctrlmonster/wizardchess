const cardContainer = document.getElementById("cardContainer");
const cellTooltip = document.getElementById("cellTooltip");
const cellTooltipDetails = document.querySelectorAll("#cellTooltip div");
const heroSkillContainer = document.getElementById("heroSkillsContainer");
const heroStatsContainer = document.getElementById("heroStatsContainer");
const heroSkills = document.querySelectorAll(".heroSkill");
let gameCanvas; // needs to wait for canvas creation by phaser
const heroHp = document.getElementById("heroHp");
const heroClass = document.getElementById("heroClass");
const heroMana = document.getElementById("heroMana");
const cardsLeft = document.getElementById("cardsLeft");
const historyContainer = document.getElementById("historyContainer");
const gameOverMessage = document.getElementById("gameOverMessage");
const returnToLobbyButton = document.getElementById("returnToLobby");
const lossOrWinDisplay = document.getElementById("lossOrWin");

returnToLobbyButton.addEventListener("click", () => {
  location.reload();
});

function showGameElements() {
  heroSkills.forEach(skill => skill.classList.remove("hideTooltip"));
  historyContainer.classList.remove("hideTooltip");
  heroStatsContainer.classList.remove("hideTooltip");
  endTurnButton.classList.remove("hideTooltip");

}

function updateHeroSkill(skillData) {
  const skillElem = heroSkills[skillData.skillIndex];
  //const cd = (skillData.coolDown === 0) ? 'Now' : `${skillData.coolDown} Rounds`;
  const cd = `Cd: ${skillData.coolDown} / ${skillData.maxCoolDown} Rounds`;
  skillElem.innerHTML =
    `
<div>${skillData.name}<br>
${cd}</br>
${skillData.mana} Mana</div>`;

  if (skillData.playable) {
    skillElem.classList.add('playableSkill');
  } else {
    skillElem.classList.remove('playableSkill');
  }

  const tooltipElem = document.createElement('DIV');
  tooltipElem.classList.add("hideTooltip");
  tooltipElem.innerHTML = skillData.info;

  skillElem.addEventListener("mouseout", () => {
    tooltipElem.classList.add("hideTooltip");
    tooltipElem.classList.remove("displayHeroSkillTooltip");
  });

  skillElem.addEventListener("mouseover", () => {
    tooltipElem.classList.remove("hideTooltip");
    tooltipElem.classList.add("displayHeroSkillTooltip");
  });

  skillElem.appendChild(tooltipElem);
}


function initHeroSkills() {
  let battleScene = game.scene.getScene('BattleScene');
  heroSkills.forEach((skillElem, i) => {
    skillElem.addEventListener('click', () => {
      battleScene.selectSkill(i);
    });
  });

  heroSkillContainer.addEventListener('mouseover', () => {
    battleScene.setSelectionMode('skill');
  })
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
  dataElem.style.borderBottom = "1px solid black";
  cardContentElem.appendChild(dataElem);

  dataElem = document.createElement("DIV");
  dataElem.innerHTML = `${stringToUpperCase(displayData.cardType)}`;
  cardContentElem.appendChild(dataElem);

  dataElem = document.createElement("DIV");
  dataElem.innerHTML = `Mana: ${displayData.mana}`;
  cardContentElem.appendChild(dataElem);

  if (displayData.cardType === "monster") {
    dataElem = document.createElement("DIV");
    dataElem.innerHTML = `Atk: ${displayData.atk}`;
    cardContentElem.appendChild(dataElem);

    dataElem = document.createElement("DIV");
    dataElem.innerHTML = `HP: ${displayData.hp}`;
    cardContentElem.appendChild(dataElem);
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
  gameCanvas = document.querySelector("canvas");

  gameCanvas.addEventListener('mouseover', () => {
    battleScene.setSelectionMode('board');
  });

  // cell hovering
  /*gameCanvas.addEventListener('mousemove', evt => {
    console.log();
  })*/

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

  entry.innerHTML = `${friendly? "<span style='color: #223fff'>Myself</span>": "<span style='color: crimson'>Enemy</span>"} Turn Nr. <span>${turn}</span><br>`;
  entry.innerHTML += `${type}: ${name}`;

  historyContainer.appendChild(entry);
  console.log(historyContainer.scrollHeight);
  historyContainer.scrollTop = historyContainer.scrollHeight
}

function stringToUpperCase(string) {
  return string[0].toUpperCase() + string.slice(-string.length+1);
}