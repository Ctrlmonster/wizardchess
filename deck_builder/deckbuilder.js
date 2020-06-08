

const game = new Game();
const client = new GameClient(game);

const cardSelection = document.querySelector(".cardSelection");
const classCardSelection = document.querySelector(".classCardSelection");
const heroAreas = document.getElementById("heroAreas");
const deckList = document.getElementById("deckList");
const builtDeckSize = document.getElementById("builtDeckSize");
let selectedDeckHero = 'rogue';



let selectedDeck = [];



//console.log(client);
client.echo().then(res => console.log(res.data))

let cardPool;
client.getGeneralCards().then(res => {
  console.log(res.data)
  cardPool = res.data;
  listAllCards(cardPool.general.possessable, 'general', cardSelection)
  listAllCards(cardPool.classes.rogue.possessable, 'rogue', classCardSelection)
})

const heroImages = document.querySelectorAll("#heroAreas img");
heroImages[0].addEventListener("click", function() {
  Array.from(deckList.children).forEach(child => child.remove());
  selectedDeck = [];
  listAllCards(cardPool.classes.rogue.possessable, 'rogue', classCardSelection)
})
heroImages[1].addEventListener("click", function() {
  Array.from(deckList.children).forEach(child => child.remove());
  selectedDeck = [];
  listAllCards(cardPool.classes.warlock.possessable, 'warlock', classCardSelection)
})
heroImages[2].addEventListener("click", function() {
  Array.from(deckList.children).forEach(child => child.remove());
  selectedDeck = [];
  listAllCards(cardPool.classes.wizard.possessable, 'wizard', classCardSelection)
})

function listAllCards(cardList, type, containerElem) {
  Array.from(containerElem.children).forEach(child => child.remove())
  for (let cardName in cardList) {
    let card = cardList[cardName];

    if (card.tempPossessable === false) continue;

    const elem = document.createElement("DIV");
    elem.innerHTML = card.name;
    elem.classList.add("cardNumber")
    elem.classList.add("cardEntry")

    elem.addEventListener("mouseover", function() {
      if (card.cardType === 'monster') {
        const data = {...card};
        data.atk = data.stats.atk;
        data.hp = data.stats.hp;
        createMonsterCard(data, null, null, 'zoom', game);
      }
      if (card.cardType === 'spell') {
        const data = {...card};
        createSpellCard(data, null, null, 'zoom', game);
      }
    });

    elem.addEventListener("mouseout", function() {
      game.removeZoomedCard();
    });

    elem.addEventListener("click", function() {
      if (selectedDeck.length && selectedDeck.map(card => card.number).reduce((a,b) => a+b) === 30) return;

      let cardInDeck = selectedDeck.find(card => card.name === cardName);
      if (!cardInDeck) {
        selectedDeck.push({name: cardName, number: 1, cardRef: card, type});
      }
      else if (cardInDeck.number < 2) {
        cardInDeck.number++;
      }
      selectedDeck = selectedDeck.sort((a,b) => a.cardRef.mana - b.cardRef.mana)
      updateDeckList();

      builtDeckSize.innerHTML = selectedDeck.map(card => card.number).reduce((a,b) => a+b);
    });

    containerElem.appendChild(elem);
  }
}

function updateDeckList() {
  Array.from(deckList.children).forEach(child => child.remove());
  selectedDeck.forEach(card => {
    let elem = document.createElement("DIV");
    elem.classList.add("deckEntry");
    elem.innerHTML = `(${card.cardRef.mana}) ${card.name} x${card.number}`;

    elem.addEventListener("click", function() {
      let index = selectedDeck.findIndex(deckCard => deckCard.name === card.name);
      //let deckCard = selectedDeck[index];
      if (card.number > 1) card.number--;
      else {
        selectedDeck.splice(index, 1);
      }
      updateDeckList();
      builtDeckSize.innerHTML = selectedDeck.map(card => card.number).reduce((a,b) => a+b);
    })

    elem.addEventListener("mouseover", function() {
      if (card.cardRef.cardType === 'monster') {
        const data = {...card.cardRef};
        data.atk = data.stats.atk;
        data.hp = data.stats.hp;
        createMonsterCard(data, null, null, 'zoom', game);
      }
      if (card.cardRef.cardType === 'spell') {
        const data = {...card.cardRef};
        createSpellCard(data, null, null, 'zoom', game);
      }
    });

    elem.addEventListener("mouseout", function() {
      game.removeZoomedCard();
    });

    deckList.appendChild(elem)
  })
}

const genDeckList = document.getElementById("genDeckList");
const deckOutput = document.getElementById("deckOutput");
genDeckList.addEventListener("click", function() {
  if (parseInt(builtDeckSize.innerHTML) < 30) {
    deckOutput.innerHTML = "Your Deck needs 30 Cards!"
    return;
  }

  let deckString = `{hero: [`;
  //start with hero cards
  selectedDeck.filter(card => card.type !== 'general').forEach(card => {
    let cardString = `{name: "${card.name}", number: ${card.number}},`;
    deckString += cardString;
  });
  //continue with general cards
  deckString += "], general: ["
  selectedDeck.filter(card => card.type === 'general').forEach(card => {
    let cardString = `{name: "${card.name}", number: ${card.number}},`;
    deckString += cardString;
  });
  deckString += "]}";


  deckOutput.innerHTML = deckString;
});

//createMonsterCard(dataForZoomedCard, null, null, 'zoom', this);
