function createMonsterCard(cardData, handIndex, playCallback, scene) {
  let displayData = Object.assign({}, cardData);

  const cardElem = document.createElement('DIV');
  cardElem.classList.add("cardElement");
  cardElem.classList.add("cardElementSize");

  const basecard = document.createElement("IMG");
  basecard.src = "/public/assets/gui/dragon_TCG-assets/base_card_03.png";
  basecard.style.position = 'absolute';

  const border_card = document.createElement("IMG");
  border_card.src = "/public/assets/gui/dragon_TCG-assets/border_card01.png";
  border_card.style.position = 'absolute';

  // ________________________________________________________________

  const card_image = document.createElement("IMG");
  const icon_path = client_address + `/public/${displayData.icon}`;
  card_image.src = icon_path;
  //card_image.src = `/public/assets/character_images/FantasyCardsPack_png/FantasyCardsPack_${num}.png`;
  card_image.style.position = "absolute";
  card_image.classList.add("cardImage");

  const border_illustration = document.createElement("IMG");
  border_illustration.src = "/public/assets/gui/dragon_TCG-assets/my_card_border_gold.png";
  //border_illustration.src = "/public/assets/gui/dragon_TCG-assets/border_illustration01.png";
  border_illustration.style.position = 'absolute';
  border_illustration.classList.add("cardImageBorder");

  const imageContainer = document.createElement("DIV");
  imageContainer.classList.add("cardImageContainer");

  const dragon_wing_left = document.createElement("IMG");
  dragon_wing_left.src = "/public/assets/gui/dragon_TCG-assets/dragon_wing_03.png";
  dragon_wing_left.style.position = 'absolute';
  dragon_wing_left.style.width = '90%';
  dragon_wing_left.style.left = "-6.5rem";
  dragon_wing_left.style.top = "-4.5rem";
  imageContainer.appendChild(dragon_wing_left);

  const dragon_head_right = document.createElement("IMG");
  dragon_head_right.src = "/public/assets/gui/dragon_TCG-assets/dragon_head_03.png";
  dragon_head_right.style.position = 'absolute';
  dragon_head_right.style.width = '75%';
  dragon_head_right.style.right = "-4.5rem";
  dragon_head_right.style.top = "-6rem";
  imageContainer.appendChild(dragon_head_right);


  imageContainer.appendChild(card_image);
  imageContainer.appendChild(border_illustration);

  /*
  const text_box = document.createElement("IMG");
  //text_box.src = "/public/assets/gui/dragon_TCG-assets/text_paper.png";
  text_box.src = "/public/assets/gui/dragon_TCG-assets/text_box_04.png";
  text_box.classList.add("cardTextBox");
  text_box.style.width = "95%";
  //text_box.style.width = "82%";
  text_box.style.left = ".25rem";
  //text_box.style.left = "1.2rem";
  text_box.style.marginTop = "-1rem";
  text_box.style.position = 'absolute';
*/
  const text_box = document.createElement("IMG");
  text_box.src = "/public/assets/gui/dragon_TCG-assets/text_box_04.png";
  text_box.style.width = "108%";
  text_box.style.right = "-.5rem";
  text_box.style.position = 'absolute';
  //text_box.style.marginTop = "-1rem";




  //const text_box = document.createElement("IMG");
  //text_box.src = "/public/assets/gui/dragon_TCG-assets/text_paper.png";
  /*text_box.style.width = "90%";
  text_box.style.left = ".55rem";
  text_box.style.marginTop = "-.9rem";
  text_box.style.position = 'absolute';*/

  const textContainer = document.createElement("DIV");
  textContainer.style.width = "90%";
  textContainer.style.left = ".55rem";
  textContainer.style.marginTop = "-.9rem";
  //textContainer.style.display = "flex";
  //textContainer.style.justifyContent = "center";

  textContainer.style.position = 'absolute';

  const textElem = document.createElement("DIV");
  console.log(displayData);
  textElem.innerHTML = `${stringToUpperCase(displayData.monsterType)}<br>`+ (displayData.info != null) ? displayData.info : '';
  textElem.style.position = 'absolute';
  //textElem.style.border = "1px solid red";
  textElem.style.width = "100%";//textContainer.style.width;
  textElem.style.height = "85%";
  textElem.style.padding = "15px";
  textElem.style.display = "flex";
  textElem.style.justifyContent = "center";
  textElem.style.fontFamily = "Bitter";
  textElem.style.fontSize = "0.5vw";
  textElem.style.boxSizing = "border-box";
  //textElem.style.fontWeight = "700";

  textContainer.appendChild(text_box);
  textContainer.appendChild(textElem);

//  cardElem.appendChild(textContainer);

  const border_cardname = document.createElement("IMG");
  border_cardname.src = "/public/assets/gui/dragon_TCG-assets/border_cardname01.png";
  border_cardname.style.position = 'absolute';

  const base_cardname = document.createElement("IMG");
  base_cardname.src = "/public/assets/gui/dragon_TCG-assets/base_cardname.png";
  base_cardname.style.position = 'absolute';

  const cardname_container = document.createElement("DIV");
  cardname_container.appendChild(base_cardname);
  cardname_container.appendChild(border_cardname);


  cardname_container.style.position = 'relative';
  cardname_container.style.width = '85%';
  cardname_container.style.margin = '-3.45rem auto 0';


  cardElem.appendChild(basecard);

  cardElem.appendChild(border_card);
  cardElem.appendChild(imageContainer);
  //cardElem.appendChild(text_box);
  cardElem.appendChild(textContainer);
  cardElem.appendChild(cardname_container);


  const sword1 = document.createElement("IMG");
  sword1.src = "/public/assets/gui/dragon_TCG-assets/sword_03.png";
  sword1.style.position = 'absolute';
  sword1.style.bottom = '-1.1rem';
  sword1.style.left = '-.1rem';
  sword1.style.height = '5.4rem';
  sword1.style.width = 'auto';
  sword1.style.transform = "rotate(-45deg)";
  cardElem.appendChild(sword1);

  const sword2 = document.createElement("IMG");
  sword2.src = "/public/assets/gui/dragon_TCG-assets/sword_03.png";
  sword2.style.position = 'absolute';
  sword2.style.bottom = '-1.0rem';
  sword2.style.left = '.85rem';
  sword2.style.height = '5.4rem';
  sword2.style.width = 'auto';
  sword2.style.transform = "rotate(45deg)";
  cardElem.appendChild(sword2);

  /*
  const dragon_tail = document.createElement("IMG");
  dragon_tail.src = "/public/assets/gui/dragon_TCG-assets/dragon_tail_03.png";
  dragon_tail.style.position = 'absolute';
  dragon_tail.style.bottom = '0';
  dragon_tail.style.left = '0';
  dragon_tail.style.width = '8rem';
  cardElem.appendChild(dragon_tail);*/

  const dmgBox = document.createElement("IMG");
  dmgBox.src = "/public/assets/gui/dragon_TCG-assets/boxatk03.png";
  dmgBox.style.position = 'absolute';
  //dmgBox.style.height = '4.5rem';
  dmgBox.style.width = '4rem';
  dmgBox.style.bottom = '-1rem';
  dmgBox.style.left = '-1rem';
  cardElem.appendChild(dmgBox);

  const dmgNumber = document.createElement("DIV");
  dmgNumber.innerHTML = displayData.atk !== 0 ? displayData.atk : displayData.healPower;
  //dmgNumber.innerHTML = String(Math.trunc(Math.random() * 10));
  dmgNumber.classList.add("cardNumber");
  dmgNumber.style.position = 'absolute';
  //dmgBox.style.height = '4.5rem';
  dmgNumber.style.width = '4rem';
  dmgNumber.style.bottom = '.25rem';
  dmgNumber.style.left = '.6rem';
  cardElem.appendChild(dmgNumber);

  const hpBox = document.createElement("IMG");
  hpBox.src = "/public/assets/gui/dragon_TCG-assets/shield_03.png";
  hpBox.style.position = 'absolute';
  //dmgBox.style.height = '4.5rem';
  hpBox.style.width = '3.6rem';
  hpBox.style.bottom = '-.72rem';
  hpBox.style.right = '-.75rem';
  cardElem.appendChild(hpBox);

  const hpNumber = document.createElement("DIV");
  hpNumber.innerHTML = displayData.hp
  //hpNumber.innerHTML = String(Math.trunc(Math.random() * 10));
  hpNumber.classList.add("cardNumber");
  hpNumber.style.position = 'absolute';
  //dmgBox.style.height = '4.5rem';
  hpNumber.style.width = '4rem';
  hpNumber.style.bottom = '.25rem';
  hpNumber.style.right = '-2.45rem';
  cardElem.appendChild(hpNumber);


  const mana_gem = document.createElement("IMG");
  mana_gem.src = "/public/assets/gui/dragon_TCG-assets/energy_yellow.png";
  //mana_gem.src = "/public/assets/gui/dragon_TCG-assets/energy_orange.png";
  mana_gem.style.position = 'absolute';
  mana_gem.style.top = '-1.5rem';
  mana_gem.style.left = '-1.4rem';
  mana_gem.style.width = '4.5rem';
  cardElem.appendChild(mana_gem);

  const manaNumber = document.createElement("DIV");
  manaNumber.innerHTML = displayData.mana;
  //manaNumber.innerHTML = String(Math.trunc(Math.random() * 10));
  manaNumber.classList.add("cardNumber");
  manaNumber.style.position = 'absolute';
  manaNumber.style.top = '0rem';
  manaNumber.style.left = '0rem';
  manaNumber.style.width = '4.5rem';
  cardElem.appendChild(manaNumber);


  const cardName = document.createElement("DIV");
  cardName.style.display = "flex";
  cardName.style.justifyContent = 'center';
  cardName.style.width = "100%";
  //cardName.style.border = "1px solid red";
  let name;
  //name = "Iridas, Chromatic Knight";
  //name = "Ravenous Hydra";
  name = displayData.name;
  cardName.innerHTML = name;
  cardName.style.position = 'absolute';
  cardName.style.left = ".15rem";

  let calculatedSize = (Math.log(name.length ** 2) / 3) * (10 / name.length);
  const maxSize = 1.5;
  let size = calculatedSize > maxSize ? maxSize : calculatedSize;
  cardName.style.top = `${.5 * (1 + 1.5 - size)}rem`;
  cardName.style.fontSize = `${size}rem`;

  // calc the font size based number of characters

  cardName.classList.add("cardNumber");
  cardname_container.appendChild(cardName);

  const cardname_decoration_right = document.createElement("IMG");
  cardname_decoration_right.src = "/public/assets/gui/dragon_TCG-assets/02decoration_03.png";
  cardname_decoration_right.style.position = 'absolute';
  cardname_decoration_right.style.left = '-1.25rem';
  cardname_decoration_right.style.top = '-1.1rem';
  cardname_decoration_right.style.width = '3.5rem';
  cardname_container.appendChild(cardname_decoration_right);

  const cardname_decoration_left = document.createElement("IMG");
  cardname_decoration_left.src = "/public/assets/gui/dragon_TCG-assets/02decoration_03.png";
  cardname_decoration_left.style.position = 'absolute';
  cardname_decoration_left.style.right = '-1.25rem';
  cardname_decoration_left.style.top = '-1.1rem';
  cardname_decoration_left.style.width = '3.5rem';
  cardname_decoration_left.style.transform = 'scaleX(-1)';
  cardname_container.appendChild(cardname_decoration_left);


  // events ----------------------------------------------

  // ========================================
  // tooltips


  /*
  if (displayData.special) {
    let infoElem = document.createElement("DIV");
    infoElem.innerHTML = displayData.info;
    infoElem.classList.add("hideTooltip");
    cardElem.classList.add("hasTooltip");
    cardElem.appendChild(infoElem);
  }*/

  const zoomedCard = cardElem.cloneNode(true);
  scene.zoomedCard = zoomedCard;

  cardElem.addEventListener("mouseover", function () {
    zoomedCard.classList.add("zoomCard");
    heroAreas.appendChild(zoomedCard);
  });

  cardElem.addEventListener("mouseout", function () {
    zoomedCard.remove();
  });

  // play card event
  cardElem.addEventListener("click", () => {
    playCallback(handIndex, zoomedCard);
  });

  // =========================================
  cardContainer.appendChild(cardElem);
  cardData.element = cardElem;
}




// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------

// spell cards


function createSpellCard(cardData, handIndex, playCallback) {
  let displayData = Object.assign({}, cardData);

  const cardElem = document.createElement('DIV');
  cardElem.classList.add("cardElement");
  cardElem.classList.add("cardElementSize");

  const basecard = document.createElement("IMG");
  basecard.src = "/public/assets/gui/dragon_TCG-assets/base_card_03.png";
  basecard.style.position = 'absolute';

  const border_card = document.createElement("IMG");
  border_card.src = "/public/assets/gui/dragon_TCG-assets/border_card01.png";
  border_card.style.position = 'absolute';

  // ________________________________________________________________



  const card_image = document.createElement("IMG");
  const icon_path = client_address + `/public/${displayData.icon}`;
  card_image.src = icon_path;
  //card_image.src = `/public/assets/skill_icons/03_fireball.png`;
  card_image.style.position = "absolute";
  card_image.classList.add("cardImage");

  const border_illustration = document.createElement("IMG");
  border_illustration.src = "/public/assets/gui/dragon_TCG-assets/my_card_border_gold.png";
  //border_illustration.src = "/public/assets/gui/dragon_TCG-assets/border_illustration01.png";
  border_illustration.style.position = 'absolute';
  border_illustration.classList.add("cardImageBorder");

  const imageContainer = document.createElement("DIV");
  imageContainer.classList.add("cardImageContainer");

  const dragon_wing_left = document.createElement("IMG");
  dragon_wing_left.src = "/public/assets/gui/dragon_TCG-assets/dragon_wing_03.png";
  dragon_wing_left.style.position = 'absolute';
  dragon_wing_left.style.width = '90%';
  dragon_wing_left.style.left = "-6.5rem";
  dragon_wing_left.style.top = "-4.5rem";
  //imageContainer.appendChild(dragon_wing_left);

  const small_wing_right = document.createElement("IMG");
  small_wing_right.src = "/public/assets/gui/dragon_TCG-assets/01decoration_03.png";
  small_wing_right.classList.add("smallWingStyle");
  cardElem.appendChild(small_wing_right);

  /*const small_wing_left = document.createElement("IMG");
  small_wing_left.src = "/public/assets/gui/dragon_TCG-assets/01decoration_03.png";
  small_wing_left.classList.add("smallWingStyle");
  small_wing_left.classList.add("smallWingStyleLeft");
  cardElem.appendChild(small_wing_left);*/

  const dragon_tail = document.createElement("IMG");
  dragon_tail.src = "/public/assets/gui/dragon_TCG-assets/dragon_tail_03.png";
  dragon_tail.classList.add("dragonTailStyle");
  cardElem.appendChild(dragon_tail);


  const dragon_head_right = document.createElement("IMG");
  dragon_head_right.src = "/public/assets/gui/dragon_TCG-assets/dragon_head_03.png";
  dragon_head_right.style.position = 'absolute';
  dragon_head_right.style.width = '75%';
  dragon_head_right.style.right = "-4.5rem";
  dragon_head_right.style.top = "-6rem";
  //imageContainer.appendChild(dragon_head_right);


  imageContainer.appendChild(card_image);
  imageContainer.appendChild(border_illustration);

  const border_cardname = document.createElement("IMG");
  border_cardname.src = "/public/assets/gui/dragon_TCG-assets/border_cardname01.png";
  border_cardname.style.position = 'absolute';

  const base_cardname = document.createElement("IMG");
  base_cardname.src = "/public/assets/gui/dragon_TCG-assets/base_cardname.png";
  base_cardname.style.position = 'absolute';

  const cardname_container = document.createElement("DIV");
  cardname_container.appendChild(base_cardname);
  cardname_container.appendChild(border_cardname);


  cardname_container.style.position = 'relative';
  cardname_container.style.width = '85%';
  cardname_container.style.margin = '-3.45rem auto 0';


  cardElem.appendChild(basecard);
  cardElem.appendChild(border_card);
  cardElem.appendChild(imageContainer);

  /*
  const dragon_tail = document.createElement("IMG");
  dragon_tail.src = "/public/assets/gui/dragon_TCG-assets/dragon_tail_03.png";
  dragon_tail.classList.add("dragonTailStyle");
  //cardElem.appendChild(dragon_tail);*/

  const text_box = document.createElement("IMG");
  text_box.src = "/public/assets/gui/dragon_TCG-assets/text_paper.png";
  /*text_box.style.width = "90%";
  text_box.style.left = ".55rem";
  text_box.style.marginTop = "-.9rem";
  text_box.style.position = 'absolute';*/

  const textContainer = document.createElement("DIV");
  textContainer.style.width = "90%";
  textContainer.style.left = ".55rem";
  textContainer.style.marginTop = "-.9rem";
  //textContainer.style.display = "flex";
  //textContainer.style.justifyContent = "center";

  textContainer.style.position = 'absolute';

  const textElem = document.createElement("DIV");
  textElem.innerHTML = displayData.info;
  textElem.style.position = 'absolute';
  //textElem.style.border = "1px solid red";
  textElem.style.width = "100%";//textContainer.style.width;
  textElem.style.height = "85%";
  textElem.style.padding = "15px";
  textElem.style.display = "flex";
  textElem.style.justifyContent = "center";
  textElem.style.fontFamily = "Bitter";
  textElem.style.fontSize = "0.5vw";
  textElem.style.boxSizing = "border-box";
  //textElem.style.fontWeight = "700";

  textContainer.appendChild(textElem);
  textContainer.appendChild(text_box);

  cardElem.appendChild(textContainer);
  cardElem.appendChild(cardname_container);





  /*
  const sword1 = document.createElement("IMG");
  sword1.src = "/public/assets/gui/dragon_TCG-assets/sword_03.png";
  sword1.style.position = 'absolute';
  sword1.style.bottom = '-1.1rem';
  sword1.style.left = '-.1rem';
  sword1.style.height = '5.4rem';
  sword1.style.width = 'auto';
  sword1.style.transform = "rotate(-45deg)";
  //cardElem.appendChild(sword1);

  const sword2 = document.createElement("IMG");
  sword2.src = "/public/assets/gui/dragon_TCG-assets/sword_03.png";
  sword2.style.position = 'absolute';
  sword2.style.bottom = '-1.0rem';
  sword2.style.left = '.85rem';
  sword2.style.height = '5.4rem';
  sword2.style.width = 'auto';
  sword2.style.transform = "rotate(45deg)";
  //cardElem.appendChild(sword2);
*/


  const dmgBox = document.createElement("IMG");
  dmgBox.src = "/public/assets/gui/dragon_TCG-assets/boxatk03.png";
  dmgBox.style.position = 'absolute';
  //dmgBox.style.height = '4.5rem';
  dmgBox.style.width = '4rem';
  dmgBox.style.bottom = '-1rem';
  dmgBox.style.left = '-1rem';
  //cardElem.appendChild(dmgBox);

  /*
  const dmgNumber = document.createElement("DIV");
  //dmgNumber.innerHTML = displayData.atk;
  dmgNumber.innerHTML = String(Math.trunc(Math.random() * 10));
  dmgNumber.classList.add("cardNumber");
  dmgNumber.style.position = 'absolute';
  //dmgBox.style.height = '4.5rem';
  dmgNumber.style.width = '4rem';
  dmgNumber.style.bottom = '.25rem';
  dmgNumber.style.left = '.6rem';
  //cardElem.appendChild(dmgNumber);
  */

  /*
  const hpBox = document.createElement("IMG");
  hpBox.src = "/public/assets/gui/dragon_TCG-assets/shield_03.png";
  hpBox.style.position = 'absolute';
  //dmgBox.style.height = '4.5rem';
  hpBox.style.width = '3.6rem';
  hpBox.style.bottom = '-.72rem';
  hpBox.style.right = '-.75rem';
  //cardElem.appendChild(hpBox);


  const hpNumber = document.createElement("DIV");
  //hpNumber.innerHTML = displayData.hp
  hpNumber.innerHTML = String(Math.trunc(Math.random() * 10));
  hpNumber.classList.add("cardNumber");
  hpNumber.style.position = 'absolute';
  //dmgBox.style.height = '4.5rem';
  hpNumber.style.width = '4rem';
  hpNumber.style.bottom = '.25rem';
  hpNumber.style.right = '-2.45rem';
  //cardElem.appendChild(hpNumber);
*/

  const mana_gem = document.createElement("IMG");
  mana_gem.src = "/public/assets/gui/dragon_TCG-assets/energy_blue.png";
  mana_gem.style.position = 'absolute';
  mana_gem.style.top = '-1.5rem';
  mana_gem.style.left = '-1.4rem';
  mana_gem.style.width = '4.5rem';
  cardElem.appendChild(mana_gem);

  const manaNumber = document.createElement("DIV");
  manaNumber.innerHTML = displayData.mana;
  //manaNumber.innerHTML = String(Math.trunc(Math.random() * 10));
  manaNumber.classList.add("cardNumber");
  manaNumber.style.position = 'absolute';
  manaNumber.style.top = '0rem';
  manaNumber.style.left = '0rem';
  manaNumber.style.width = '4.5rem';
  cardElem.appendChild(manaNumber);


  const cardName = document.createElement("DIV");
  cardName.style.display = "flex";
  cardName.style.justifyContent = 'center';
  cardName.style.width = "100%";
  //cardName.style.border = "1px solid red";
  let name;
  //name = "Iridas, Chromatic Knight";
  //name = "Ravenous Hydra";
  name = displayData.name;
  cardName.innerHTML = name;
  cardName.style.position = 'absolute';
  cardName.style.left = ".15rem";

  let calculatedSize = (Math.log(name.length ** 2) / 3) * (10 / name.length);
  const maxSize = 1.5;
  let size = calculatedSize > maxSize ? maxSize : calculatedSize;
  cardName.style.top = `${.5 * (1 + 1.5 - size)}rem`;
  cardName.style.fontSize = `${size}rem`;

  // calc the font size based number of characters

  cardName.classList.add("cardNumber");
  cardname_container.appendChild(cardName);

  const cardname_decoration_right = document.createElement("IMG");
  cardname_decoration_right.src = "/public/assets/gui/dragon_TCG-assets/02decoration_03.png";
  cardname_decoration_right.style.position = 'absolute';
  cardname_decoration_right.style.left = '-1.25rem';
  cardname_decoration_right.style.top = '-1.1rem';
  cardname_decoration_right.style.width = '3.5rem';
  cardname_container.appendChild(cardname_decoration_right);

  const cardname_decoration_left = document.createElement("IMG");
  cardname_decoration_left.src = "/public/assets/gui/dragon_TCG-assets/02decoration_03.png";
  cardname_decoration_left.style.position = 'absolute';
  cardname_decoration_left.style.right = '-1.25rem';
  cardname_decoration_left.style.top = '-1.1rem';
  cardname_decoration_left.style.width = '3.5rem';
  cardname_decoration_left.style.transform = 'scaleX(-1)';
  cardname_container.appendChild(cardname_decoration_left);





  // events ----------------------------------------------

  // ========================================
  // tooltips


  /*
  if (displayData.special) {
    let infoElem = document.createElement("DIV");
    infoElem.innerHTML = displayData.info;
    infoElem.classList.add("hideTooltip");
    cardElem.classList.add("hasTooltip");
    cardElem.appendChild(infoElem);
  }*/

  //const placeHolderElement = document.createElement("DIV");

  const zoomedCard = cardElem.cloneNode(true);
  cardElem.addEventListener("mouseover", function () {
    zoomedCard.classList.add("zoomCard");
    heroAreas.appendChild(zoomedCard);
  });

  cardElem.addEventListener("mouseout", function () {
    zoomedCard.remove();
  });


  // play card event
  cardElem.addEventListener("click", () => {
    playCallback(handIndex, zoomedCard);
    //zoomedCard.remove();
  });

  // ========================================

  cardContainer.appendChild(cardElem);
  cardData.element = cardElem;
}