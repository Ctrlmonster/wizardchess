function createMonsterCard(cardData, handIndex, playCallback, zoomedCardOnly=false, scene=null) {
  let displayData = Object.assign({}, cardData);

  const cardElem = document.createElement('DIV');
  cardElem.classList.add("cardElement");
  cardElem.classList.add("cardElementSize");

  const basecard = document.createElement("IMG");
  basecard.draggable = false;
  basecard.src = client_address + "/public/assets/gui/dragon_TCG-assets/base_card_03.png";
  basecard.style.position = 'absolute';

  const border_card = document.createElement("IMG");
  border_card.draggable = false;
  border_card.src = client_address + "/public/assets/gui/dragon_TCG-assets/border_card01.png";
  border_card.style.position = 'absolute';

  // ________________________________________________________________

  const card_image = document.createElement("IMG");
  card_image.draggable = false;
  const icon_path = client_address  + `/public/${displayData.icon}`;
  card_image.src = icon_path;
  //card_image.src = `/public/assets/character_images/FantasyCardsPack_png/FantasyCardsPack_${num}.png`;
  card_image.style.position = "absolute";
  card_image.classList.add("cardImage");

  const border_illustration = document.createElement("IMG");
  border_illustration.draggable = false;
  border_illustration.src = client_address + "/public/assets/gui/dragon_TCG-assets/my_card_border_gold.png";
  //border_illustration.src = "/public/assets/gui/dragon_TCG-assets/border_illustration01.png";
  border_illustration.style.position = 'absolute';
  border_illustration.classList.add("cardImageBorder");

  const imageContainer = document.createElement("DIV");
  imageContainer.classList.add("cardImageContainer");

  const dragon_wing_left = document.createElement("IMG");
  dragon_wing_left.draggable = false;
  dragon_wing_left.src = client_address + "/public/assets/gui/dragon_TCG-assets/dragon_wing_03.png";
  dragon_wing_left.style.position = 'absolute';
  dragon_wing_left.style.width = '90%';
  dragon_wing_left.style.left = "-6.5rem";
  dragon_wing_left.style.top = "-4.5rem";
  imageContainer.appendChild(dragon_wing_left);

  const dragon_head_right = document.createElement("IMG");
  dragon_head_right.draggable = false;
  dragon_head_right.src = client_address + "/public/assets/gui/dragon_TCG-assets/dragon_head_03.png";
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
  text_box.draggable = false;
  text_box.src = client_address + "/public/assets/gui/dragon_TCG-assets/text_box_04.png";
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
  let textLength = displayData.info != null ? displayData.info.length : 1;
  textElem.innerHTML = `<div>`+ (displayData.info != null) ? displayData.info : '' + `</div>`;
  textElem.style.position = 'absolute';
  //textElem.style.border = "1px solid red";
  textElem.style.width = "100%";//textContainer.style.width;
  textElem.style.height = "7rem";
  textElem.style.padding = "10px 20px 0px 35px";
  textElem.style.display = "flex";
  textElem.style.justifyContent = "center";
  textElem.style.alignItems = "center";
  textElem.style.fontFamily = "Bitter";
  textElem.style.fontSize = "0.5vw";
  textElem.style.boxSizing = "border-box";
  //textElem.style.fontWeight = "700";

  let calculatedInfoSize = (Math.log(textLength ** 2) / 2.8) * (2.25 / Math.sqrt(textLength));
  const maxInfoSize = 0.9;
  let finalSize = calculatedInfoSize > maxInfoSize ? maxInfoSize : calculatedInfoSize;
  //cardName.style.top = `${.5 * (1 + maxSize - size)}rem`;
  textElem.style.fontSize = `${finalSize}rem`;

  textContainer.appendChild(text_box);
  textContainer.appendChild(textElem);

//  cardElem.appendChild(textContainer);

  const border_cardname = document.createElement("IMG");
  border_cardname.draggable = false;
  border_cardname.src = client_address + "/public/assets/gui/dragon_TCG-assets/border_cardname01.png";
  border_cardname.style.position = 'absolute';

  const base_cardname = document.createElement("IMG");
  base_cardname.draggable = false;
  base_cardname.src = client_address + "/public/assets/gui/dragon_TCG-assets/base_cardname.png";
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

/*
  const sword1 = document.createElement("IMG");
  sword1.src = client_address + "/public/assets/gui/dragon_TCG-assets/sword_03.png";
  sword1.style.position = 'absolute';
  sword1.style.bottom = '-1.1rem';
  sword1.style.left = '-.1rem';
  sword1.style.height = '5.4rem';
  sword1.style.width = 'auto';
  sword1.style.transform = "rotate(-45deg)";
  cardElem.appendChild(sword1);

  const sword2 = document.createElement("IMG");
  sword2.src = client_address + "/public/assets/gui/dragon_TCG-assets/sword_03.png";
  sword2.style.position = 'absolute';
  sword2.style.bottom = '-1.0rem';
  sword2.style.left = '.85rem';
  sword2.style.height = '5.4rem';
  sword2.style.width = 'auto';
  sword2.style.transform = "rotate(45deg)";
  cardElem.appendChild(sword2);*/

  /*
  const dragon_tail = document.createElement("IMG");
  dragon_tail.src = "/public/assets/gui/dragon_TCG-assets/dragon_tail_03.png";
  dragon_tail.style.position = 'absolute';
  dragon_tail.style.bottom = '0';
  dragon_tail.style.left = '0';
  dragon_tail.style.width = '8rem';
  cardElem.appendChild(dragon_tail);*/

  /*
  const dmgBox = document.createElement("IMG");
  dmgBox.src = client_address + "/public/assets/gui/dragon_TCG-assets/energy_yellow.png";
  //dmgBox.src = client_address + "/public/assets/gui/dragon_TCG-assets/boxatk03.png";
  dmgBox.style.position = 'absolute';
  //dmgBox.style.height = '4.5rem';
  dmgBox.style.width = '4rem';
  dmgBox.style.bottom = '-1rem';
  dmgBox.style.left = '-1rem';
  cardElem.appendChild(dmgBox);*/

  // check what kind of minion stats exist (atk dmg, spell power, heal power)
  // first case minion has all three

  // ==================================================================================
  // THREE STATS
  // ==================================================================================
  if (displayData.atk > 0 && displayData.healPower > 0 && displayData.magicPower > 0) {
    const atkCrystal = document.createElement("IMG");
    atkCrystal.draggable = false;
    atkCrystal.src = client_address + "/public/assets/gui/dragon_TCG-assets/energy_yellow.png";
    atkCrystal.style.position = 'absolute';
    atkCrystal.style.width = '4rem';
    atkCrystal.style.bottom = '-1rem';
    atkCrystal.style.left = '-1rem';
    cardElem.appendChild(atkCrystal);

    const atkNumber = document.createElement("DIV");
    atkNumber.innerHTML = displayData.atk;
    atkNumber.classList.add("cardNumber");
    atkNumber.style.position = 'absolute';
    //dmgBox.style.height = '4.5rem';
    atkNumber.style.width = '4rem';
    atkNumber.style.bottom = '.25rem';
    atkNumber.style.left = '.6rem';
    cardElem.appendChild(atkNumber);

    // -------------------------------------------

    const magicCrystal = document.createElement("IMG");
    magicCrystal.draggable = false;
    magicCrystal.src = client_address + "/public/assets/gui/dragon_TCG-assets/energy_violet_gimp.png";
    magicCrystal.style.position = 'absolute';
    magicCrystal.style.width = '4rem';
    magicCrystal.style.bottom = '4rem';
    magicCrystal.style.left = '-1rem';
    cardElem.appendChild(magicCrystal);

    const magicNumber = document.createElement("DIV");
    magicNumber.innerHTML = displayData.magicPower;
    magicNumber.classList.add("cardNumber");
    magicNumber.style.position = 'absolute';
    magicNumber.style.width = '4rem';
    magicNumber.style.bottom = '5.4rem';
    magicNumber.style.left = '.6rem';
    cardElem.appendChild(magicNumber);

    // -------------------------------------------

    const healCrystal = document.createElement("IMG");
    healCrystal.draggable = false;
    healCrystal.src = client_address + "/public/assets/gui/dragon_TCG-assets/energy_green.png";
    healCrystal.style.position = 'absolute';
    healCrystal.style.width = '4rem';
    healCrystal.style.bottom = '4rem';
    healCrystal.style.right = '-.75rem';
    cardElem.appendChild(healCrystal);

    const healNumber = document.createElement("DIV");
    healNumber.innerHTML = displayData.healPower;
    healNumber.classList.add("cardNumber");
    healNumber.style.position = 'absolute';
    //dmgBox.style.height = '4.5rem';
    healNumber.style.width = '4rem';
    healNumber.style.bottom = '4rem';
    healNumber.style.right = '-2.35rem';
    cardElem.appendChild(healNumber);
  }

  // ==================================================================================
  // TWO STATS
  // ==================================================================================
  else {
    let twoStatsExist = false;

    // next case: minion has atk and healPower
    if (displayData.atk > 0 && displayData.healPower) {
      const atkCrystal = document.createElement("IMG");
      atkCrystal.draggable = false;
      atkCrystal.src = client_address + "/public/assets/gui/dragon_TCG-assets/energy_yellow.png";
      atkCrystal.style.position = 'absolute';
      atkCrystal.style.width = '4rem';
      atkCrystal.style.bottom = '-1rem';
      atkCrystal.style.left = '-1rem';
      cardElem.appendChild(atkCrystal);

      const atkNumber = document.createElement("DIV");
      atkNumber.innerHTML = displayData.atk;
      atkNumber.classList.add("cardNumber");
      atkNumber.style.position = 'absolute';
      //dmgBox.style.height = '4.5rem';
      atkNumber.style.width = '4rem';
      atkNumber.style.bottom = '.25rem';
      atkNumber.style.left = '.6rem';
      cardElem.appendChild(atkNumber);

      // -------------------------------------------

      const healCrystal = document.createElement("IMG");
      healCrystal.draggable = false;
      healCrystal.src = client_address + "/public/assets/gui/dragon_TCG-assets/energy_green.png";
      healCrystal.style.position = 'absolute';
      healCrystal.style.width = '4rem';
      healCrystal.style.bottom = '4rem';
      healCrystal.style.left = '-1rem';
      cardElem.appendChild(healCrystal);

      const healNumber = document.createElement("DIV");
      healNumber.innerHTML = displayData.healPower;
      healNumber.classList.add("cardNumber");
      healNumber.style.position = 'absolute';
      healNumber.style.width = '4rem';
      healNumber.style.bottom = '5.4rem';
      healNumber.style.left = '.6rem';
      cardElem.appendChild(healNumber);

      twoStatsExist = true;
    }
    // ==================================================================================
    // next case: minion has atk and magicPower
    if (displayData.atk > 0 && displayData.magicPower) {
      const atkCrystal = document.createElement("IMG");
      atkCrystal.draggable = false;
      atkCrystal.src = client_address + "/public/assets/gui/dragon_TCG-assets/energy_yellow.png";
      atkCrystal.style.position = 'absolute';
      atkCrystal.style.width = '4rem';
      atkCrystal.style.bottom = '-1rem';
      atkCrystal.style.left = '-1rem';
      cardElem.appendChild(atkCrystal);

      const atkNumber = document.createElement("DIV");
      atkNumber.innerHTML = displayData.atk;
      atkNumber.classList.add("cardNumber");
      atkNumber.style.position = 'absolute';
      //dmgBox.style.height = '4.5rem';
      atkNumber.style.width = '4rem';
      atkNumber.style.bottom = '.25rem';
      atkNumber.style.left = '.6rem';
      cardElem.appendChild(atkNumber);

      // -------------------------------------------

      const magicCrystal = document.createElement("IMG");
      magicCrystal.draggable = false;
      magicCrystal.src = client_address + "/public/assets/gui/dragon_TCG-assets/energy_violet_gimp.png";
      magicCrystal.style.position = 'absolute';
      magicCrystal.style.width = '4rem';
      magicCrystal.style.bottom = '4rem';
      magicCrystal.style.left = '-1rem';
      cardElem.appendChild(magicCrystal);

      const magicNumber = document.createElement("DIV");
      magicNumber.innerHTML = displayData.magicPower;
      magicNumber.classList.add("cardNumber");
      magicNumber.style.position = 'absolute';
      magicNumber.style.width = '4rem';
      magicNumber.style.bottom = '5.4rem';
      magicNumber.style.left = '.6rem';
      cardElem.appendChild(magicNumber);

      twoStatsExist = true;
    }

    // ==================================================================================
    // next case: minion has healPower and magicPower
    if (displayData.healPower > 0 && displayData.magicPower) {
      const magicCrystal = document.createElement("IMG");
      magicCrystal.draggable = false;
      magicCrystal.src = client_address + "/public/assets/gui/dragon_TCG-assets/energy_violet_gimp.png";
      magicCrystal.style.position = 'absolute';
      magicCrystal.style.width = '4rem';
      magicCrystal.style.bottom = '-1rem';
      magicCrystal.style.left = '-1rem';
      cardElem.appendChild(magicCrystal);

      const magicNumber = document.createElement("DIV");
      magicNumber.innerHTML = displayData.magicPower;
      magicNumber.classList.add("cardNumber");
      magicNumber.style.position = 'absolute';
      //dmgBox.style.height = '4.5rem';
      magicNumber.style.width = '4rem';
      magicNumber.style.bottom = '.25rem';
      magicNumber.style.left = '.6rem';
      cardElem.appendChild(magicNumber);

      // -------------------------------------------

      const healCrystal = document.createElement("IMG");
      healCrystal.draggable = false;
      healCrystal.src = client_address + "/public/assets/gui/dragon_TCG-assets/energy_green.png";
      healCrystal.style.position = 'absolute';
      healCrystal.style.width = '4rem';
      healCrystal.style.bottom = '4rem';
      healCrystal.style.left = '-1rem';
      cardElem.appendChild(healCrystal);

      const healNumber = document.createElement("DIV");
      healNumber.innerHTML = displayData.healPower;
      healNumber.classList.add("cardNumber");
      healNumber.style.position = 'absolute';
      healNumber.style.width = '4rem';
      healNumber.style.bottom = '5.4rem';
      healNumber.style.left = '.6rem';
      cardElem.appendChild(healNumber);

      twoStatsExist = true;
    }

    // ==================================================================================
    // ONE STAT
    // ==================================================================================
    if (!twoStatsExist) {

      // next case: minion has only atk
      if (displayData.atk > 0) {
        const atkCrystal = document.createElement("IMG");
        atkCrystal.draggable = false;
        atkCrystal.src = client_address + "/public/assets/gui/dragon_TCG-assets/energy_yellow.png";
        atkCrystal.style.position = 'absolute';
        atkCrystal.style.width = '4rem';
        atkCrystal.style.bottom = '-1rem';
        atkCrystal.style.left = '-1rem';
        cardElem.appendChild(atkCrystal);

        const atkNumber = document.createElement("DIV");
        atkNumber.innerHTML = displayData.atk;
        atkNumber.classList.add("cardNumber");
        atkNumber.style.position = 'absolute';
        //dmgBox.style.height = '4.5rem';
        atkNumber.style.width = '4rem';
        atkNumber.style.bottom = '.25rem';
        atkNumber.style.left = '.6rem';
        cardElem.appendChild(atkNumber);
      }

      // next case: minion has only healPower
      if (displayData.healPower > 0) {
        const healCrystal = document.createElement("IMG");
        healCrystal.draggable = false;
        healCrystal.src = client_address + "/public/assets/gui/dragon_TCG-assets/energy_green.png";
        healCrystal.style.position = 'absolute';
        healCrystal.style.width = '4rem';
        healCrystal.style.bottom = '-1rem';
        healCrystal.style.left = '-1rem';
        cardElem.appendChild(healCrystal);

        const healNumber = document.createElement("DIV");
        healNumber.innerHTML = displayData.healPower;
        healNumber.classList.add("cardNumber");
        healNumber.style.position = 'absolute';
        //dmgBox.style.height = '4.5rem';
        healNumber.style.width = '4rem';
        healNumber.style.bottom = '.25rem';
        healNumber.style.left = '.6rem';
        cardElem.appendChild(healNumber);
      }

      // next case: minion has only magicPower
      if (displayData.magicPower > 0) {
        const magicCrystal = document.createElement("IMG");
        magicCrystal.draggable = false;
        magicCrystal.src = client_address + "/public/assets/gui/dragon_TCG-assets/energy_violet_gimp.png";
        magicCrystal.style.position = 'absolute';
        magicCrystal.style.width = '4rem';
        magicCrystal.style.bottom = '-1rem';
        magicCrystal.style.left = '-1rem';
        cardElem.appendChild(magicCrystal);

        const magicNumber = document.createElement("DIV");
        magicNumber.innerHTML = displayData.magicPower;
        magicNumber.classList.add("cardNumber");
        magicNumber.style.position = 'absolute';
        //dmgBox.style.height = '4.5rem';
        magicNumber.style.width = '4rem';
        magicNumber.style.bottom = '.25rem';
        magicNumber.style.left = '.6rem';
        cardElem.appendChild(magicNumber);
      }

    }
  }



  const hpCrystal = document.createElement("IMG");
  hpCrystal.draggable = false;
  hpCrystal.src = client_address + "/public/assets/gui/dragon_TCG-assets/energy_red_gimp.png";
  //hpBox.src = client_address + "/public/assets/gui/dragon_TCG-assets/shield_03.png";
  hpCrystal.style.position = 'absolute';
  //dmgBox.style.height = '4.5rem';
  hpCrystal.style.width = '4rem';
  hpCrystal.style.bottom = '-1rem';
  hpCrystal.style.right = '-.75rem';
  cardElem.appendChild(hpCrystal);

  const hpNumber = document.createElement("DIV");
  hpNumber.innerHTML = displayData.hp;
  //hpNumber.innerHTML = String(Math.trunc(Math.random() * 10));
  hpNumber.classList.add("cardNumber");
  hpNumber.style.position = 'absolute';
  //dmgBox.style.height = '4.5rem';
  hpNumber.style.width = '4rem';
  hpNumber.style.bottom = '.25rem';
  hpNumber.style.right = '-2.35rem';
  cardElem.appendChild(hpNumber);


  const mana_gem = document.createElement("IMG");
  mana_gem.draggable = false;
  mana_gem.src = client_address + "/public/assets/gui/dragon_TCG-assets/energy_blue.png";
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


  // monster role (for now tank and non-tank)

  if (displayData.commanderMinion) {
    const commanderIcon = document.createElement("IMG");
    commanderIcon.draggable = false;
    commanderIcon.src = client_address + "/public/assets/gui/dragon_TCG-assets/sword_03.png";
    commanderIcon.style.position = 'absolute';
    //dmgBox.style.height = '4.5rem';
    commanderIcon.style.width = 'auto';
    commanderIcon.style.height = '2rem';
    commanderIcon.style.bottom = '18.7rem';
    commanderIcon.style.left = '6.34rem';
    cardElem.appendChild(commanderIcon);
  }

  if (displayData.monsterType === 'tank') {
    const roleIcon = document.createElement("IMG");
    roleIcon.draggable = false;
    roleIcon.src = client_address + "/public/assets/gui/dragon_TCG-assets/shield_03.png";
    roleIcon.style.position = 'absolute';
    //dmgBox.style.height = '4.5rem';
    roleIcon.style.width = '2rem';
    roleIcon.style.height = 'auto';
    roleIcon.style.bottom = '-0.9rem';
    roleIcon.style.left = '5.8rem';
    cardElem.appendChild(roleIcon);
  }



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

  let calculatedSize = (Math.log(name.length ** 2) / 3) * (9 / name.length);
  const maxSize = 1.3;
  let size = calculatedSize > maxSize ? maxSize : calculatedSize;
  cardName.style.top = `${.5 * (1 + maxSize - size)}rem`;
  cardName.style.fontSize = `${size}rem`;

  // calc the font size based number of characters

  cardName.classList.add("cardName");
  //cardName.classList.add("cardNumber");
  cardname_container.appendChild(cardName);

  const cardname_decoration_right = document.createElement("IMG");
  cardname_decoration_right.draggable = false;
  cardname_decoration_right.src = client_address + "/public/assets/gui/dragon_TCG-assets/02decoration_03.png";
  cardname_decoration_right.style.position = 'absolute';
  cardname_decoration_right.style.left = '-1.25rem';
  cardname_decoration_right.style.top = '-1.1rem';
  cardname_decoration_right.style.width = '3.5rem';
  cardname_container.appendChild(cardname_decoration_right);

  const cardname_decoration_left = document.createElement("IMG");
  cardname_decoration_right.draggable = false;
  cardname_decoration_left.src = client_address + "/public/assets/gui/dragon_TCG-assets/02decoration_03.png";
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

  //let zoomedCard = null;

  if (!zoomedCardOnly) {
    cardElem.addEventListener("mouseover", function () {
      let zoomedCard = cardElem.cloneNode(true);
      scene.updateZoomedCard(zoomedCard);
    });

    cardElem.addEventListener("mouseout", function () {
      scene.removeZoomedCard();
    });

    // play card event
    cardElem.addEventListener("click", () => {
      playCallback(handIndex);
    });

    // =========================================
    cardContainer.appendChild(cardElem);
    cardData.element = cardElem;
  }

  // ----------------------------------------------------
  // zoomed card only (cell monster hover)
  else {
    let zoomedCard = cardElem.cloneNode(true);
    scene.updateZoomedCard(zoomedCard);
    cardElem.remove(); // delete the unnecessary elem
  }
}




// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------

// spell cards


function createSpellCard(cardData, handIndex, playCallback, scene) {
  let displayData = Object.assign({}, cardData);

  const cardElem = document.createElement('DIV');
  cardElem.classList.add("cardElement");
  cardElem.classList.add("cardElementSize");

  const basecard = document.createElement("IMG");
  basecard.draggable = false;
  basecard.src = client_address + "/public/assets/gui/dragon_TCG-assets/base_card_03.png";
  basecard.style.position = 'absolute';

  const border_card = document.createElement("IMG");
  border_card.draggable = false;
  border_card.src = client_address + "/public/assets/gui/dragon_TCG-assets/border_card01.png";
  border_card.style.position = 'absolute';

  // ________________________________________________________________



  const card_image = document.createElement("IMG");
  card_image.draggable = false;
  const icon_path = client_address + `/public/${displayData.icon}`;
  card_image.src = icon_path;
  //card_image.src = `/public/assets/skill_icons/03_fireball.png`;
  card_image.style.position = "absolute";
  card_image.classList.add("cardImage");

  const border_illustration = document.createElement("IMG");
  border_illustration.draggable = false;
  border_illustration.src = client_address + "/public/assets/gui/dragon_TCG-assets/my_card_border_gold.png";
  //border_illustration.src = "/public/assets/gui/dragon_TCG-assets/border_illustration01.png";
  border_illustration.style.position = 'absolute';
  border_illustration.classList.add("cardImageBorder");

  const imageContainer = document.createElement("DIV");
  imageContainer.classList.add("cardImageContainer");

  const dragon_wing_left = document.createElement("IMG");
  dragon_wing_left.draggable = false;
  dragon_wing_left.src = client_address + "/public/assets/gui/dragon_TCG-assets/dragon_wing_03.png";
  dragon_wing_left.style.position = 'absolute';
  dragon_wing_left.style.width = '90%';
  dragon_wing_left.style.left = "-6.5rem";
  dragon_wing_left.style.top = "-4.5rem";
  //imageContainer.appendChild(dragon_wing_left);

  const small_wing_right = document.createElement("IMG");
  small_wing_right.draggable = false;
  small_wing_right.src = client_address + "/public/assets/gui/dragon_TCG-assets/01decoration_03.png";
  small_wing_right.classList.add("smallWingStyle");
  cardElem.appendChild(small_wing_right);

  /*const small_wing_left = document.createElement("IMG");
  small_wing_left.src = "/public/assets/gui/dragon_TCG-assets/01decoration_03.png";
  small_wing_left.classList.add("smallWingStyle");
  small_wing_left.classList.add("smallWingStyleLeft");
  cardElem.appendChild(small_wing_left);*/

  const dragon_tail = document.createElement("IMG");
  dragon_tail.draggable = false;
  dragon_tail.src = client_address + "/public/assets/gui/dragon_TCG-assets/dragon_tail_03.png";
  dragon_tail.classList.add("dragonTailStyle");
  cardElem.appendChild(dragon_tail);


  const dragon_head_right = document.createElement("IMG");
  dragon_head_right.draggable = false;
  dragon_head_right.src = client_address + "/public/assets/gui/dragon_TCG-assets/dragon_head_03.png";
  dragon_head_right.style.position = 'absolute';
  dragon_head_right.style.width = '75%';
  dragon_head_right.style.right = "-4.5rem";
  dragon_head_right.style.top = "-6rem";
  //imageContainer.appendChild(dragon_head_right);


  imageContainer.appendChild(card_image);
  imageContainer.appendChild(border_illustration);

  const border_cardname = document.createElement("IMG");
  border_cardname.draggable = false;
  border_cardname.src = client_address + "/public/assets/gui/dragon_TCG-assets/border_cardname01.png";
  border_cardname.style.position = 'absolute';

  const base_cardname = document.createElement("IMG");
  base_cardname.draggable = false;
  base_cardname.src = client_address + "/public/assets/gui/dragon_TCG-assets/base_cardname.png";
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
  text_box.draggable = false;
  text_box.src = client_address + "/public/assets/gui/dragon_TCG-assets/text_paper.png";
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
  textElem.style.height = "7rem";
  textElem.style.padding = "15px";
  textElem.style.display = "flex";
  textElem.style.justifyContent = "center";
  textElem.style.alignItems = "center";
  textElem.style.fontFamily = "Bitter";
  textElem.style.fontSize = "0.5vw";
  textElem.style.boxSizing = "border-box";
  //textElem.style.fontWeight = "700";


  let calculatedInfoSize = (Math.log(displayData.info.length ** 2) / 2.8) * (2.25 / Math.sqrt(displayData.info.length));
  const maxInfoSize = 0.9;
  let finalSize = calculatedInfoSize > maxInfoSize ? maxInfoSize : calculatedInfoSize;
  //cardName.style.top = `${.5 * (1 + maxSize - size)}rem`;
  textElem.style.fontSize = `${finalSize}rem`;


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


  /*
  const dmgBox = document.createElement("IMG");
  dmgBox.src = client_address + "/public/assets/gui/dragon_TCG-assets/boxatk03.png";
  dmgBox.style.position = 'absolute';
  //dmgBox.style.height = '4.5rem';
  dmgBox.style.width = '4rem';
  dmgBox.style.bottom = '-1rem';
  dmgBox.style.left = '-1rem';
  */
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
  hpNumber.style.right = '-2.35rem';
  //cardElem.appendChild(hpNumber);
*/

  const mana_gem = document.createElement("IMG");
  mana_gem.draggable = false;
  mana_gem.src = client_address + "/public/assets/gui/dragon_TCG-assets/energy_blue.png";
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

  let calculatedSize = (Math.log(name.length ** 2) / 3) * (9 / name.length);
  const maxSize = 1.3;
  let size = calculatedSize > maxSize ? maxSize : calculatedSize;
  cardName.style.top = `${.5 * (1 + maxSize - size)}rem`;
  cardName.style.fontSize = `${size}rem`;

  // calc the font size based number of characters

  cardName.classList.add("cardName");
  cardname_container.appendChild(cardName);

  const cardname_decoration_right = document.createElement("IMG");
  cardname_decoration_right.draggable = false;
  cardname_decoration_right.src = client_address + "/public/assets/gui/dragon_TCG-assets/02decoration_03.png";
  cardname_decoration_right.style.position = 'absolute';
  cardname_decoration_right.style.left = '-1.25rem';
  cardname_decoration_right.style.top = '-1.1rem';
  cardname_decoration_right.style.width = '3.5rem';
  cardname_container.appendChild(cardname_decoration_right);

  const cardname_decoration_left = document.createElement("IMG");
  cardname_decoration_left.draggable = false;
  cardname_decoration_left.src = client_address + "/public/assets/gui/dragon_TCG-assets/02decoration_03.png";
  cardname_decoration_left.style.position = 'absolute';
  cardname_decoration_left.style.right = '-1.25rem';
  cardname_decoration_left.style.top = '-1.1rem';
  cardname_decoration_left.style.width = '3.5rem';
  cardname_decoration_left.style.transform = 'scaleX(-1)';
  cardname_container.appendChild(cardname_decoration_left);





  // events ----------------------------------------------

  // ========================================
  // tooltips


  cardElem.addEventListener("mouseover", function () {
    let zoomedCard = cardElem.cloneNode(true);
    scene.updateZoomedCard(zoomedCard);
  });

  cardElem.addEventListener("mouseout", function () {
    scene.removeZoomedCard();
  });

  // play card event
  cardElem.addEventListener("click", () => {
    playCallback(handIndex);
  });

  // =========================================
  cardContainer.appendChild(cardElem);
  cardData.element = cardElem;
}