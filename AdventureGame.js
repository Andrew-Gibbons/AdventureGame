const readline = require("readline-sync");

// =====================
// === Item Templates ===
// =====================

const healthPotion = {
    name: "Health Potion",
    type: "potion",
    value: 5,
    effect: 30,
    description: "A magical potion that restores 30 health when used."
};

const sword = {
    name: "Sword",
    type: "weapon",
    value: 10,
    effect: 10,
    description: "A sharp blade that deals 10 damage to enemies."
};

const steelSword = {
    name: "Steel Sword",
    type: "weapon",
    value: 25,
    effect: 20,
    description: "A finely crafted steel sword that deals 20 damage to enemies."
};

const woodenShield = {
    name: "Wooden Shield",
    type: "armor",
    value: 8,
    effect: 5,
    description: "Reduces damage taken in combat."
};

const ironShield = {
    name: "Iron Shield",
    type: "armor",
    value: 18,
    effect: 10,
    description: "A sturdy iron shield that greatly reduces damage taken."
};

// =====================
// === Game Variables ===
// =====================

let playerName = "";
let playerHealth = 150;
let playerGold = 100;
let maxInventorySlots = 10;
let inventory = [];
let currentLoc = "village";
let gameRunning = true;
let dragonDefeated = false;

// =====================
// === Helper Functions ===
// =====================

function getItemsByType(type) {
    return inventory.filter(item => item.type === type);
}

function getBestItem(type) {
    const items = getItemsByType(type);
    if (items.length === 0) return null;
    return items.reduce((best, item) => item.effect > best.effect ? item : best, items[0]);
}

function hasGoodEquipment() {
    const weapon = getBestItem("weapon");
    const armor = getBestItem("armor");
    return weapon && weapon.name === "Steel Sword" && armor;
}

function isValidChoice(input, min, max) {
    const num = Number(input);
    return Number.isInteger(num) && num >= min && num <= max;
}

// =====================
// === Input Handling ===
// =====================

function getChoice(prompt, min, max) {
    while (true) {
        try {
            const input = readline.question(prompt);
            if (isValidChoice(input, min, max)) return Number(input);
            console.log(`Invalid choice. Enter a number between ${min} and ${max}.`);
        } catch (e) {
            console.log("Input error. Please try again.");
        }
    }
}

// =====================
// === Equipment Display ===
// =====================

function showEquipment() {
    const weapon = getBestItem("weapon");
    const armor = getBestItem("armor");
    console.log(`Equipped Weapon: ${weapon ? weapon.name : "None"} (${weapon ? weapon.effect : 0} dmg)`);
    console.log(`Equipped Armor: ${armor ? armor.name : "None"} (${armor ? armor.effect : 0} prot)`);
}

// =====================
// === Combat System ===
// =====================

function handleCombat(isDragon = false) {
    const weapon = getBestItem("weapon");
    const armor = getBestItem("armor");
    if (!weapon) {
        console.log("You have no weapon! You cannot fight.");
        return false;
    }
    if (isDragon && (!hasGoodEquipment())) {
        console.log("You are not well-equipped to face the dragon! You flee in terror.");
        return false;
    }
    let monsterHealth = isDragon ? 50 : 20;
    let monsterDamage = isDragon ? 20 : 10;
    let monsterName = isDragon ? "Dragon" : "Monster";
    console.log(`\n--- ${monsterName} Battle ---`);
    showEquipment();
    while (playerHealth > 0 && monsterHealth > 0) {
        console.log(`Your Health: ${playerHealth} | ${monsterName} Health: ${monsterHealth}`);
        console.log("1: Attack\n2: Use potion\n3: Run\n4: Show inventory");
        let action = getChoice("Choose your action (1-4): ", 1, 4);
        if (action === 1) {
            monsterHealth -= weapon.effect;
            console.log(`You attack with your ${weapon.name} for ${weapon.effect} damage!`);
        } else if (action === 2) {
            let potion = inventory.find(item => item.type === "potion");
            if (potion) {
                playerHealth += potion.effect;
                if (playerHealth > 150) playerHealth = 150;
                inventory.splice(inventory.indexOf(potion), 1);
                console.log(`You use a ${potion.name}. Health is now ${playerHealth}.`);
            } else {
                console.log("You have no potions!");
                continue;
            }
        } else if (action === 3) {
            console.log("You run away!");
            return false;
        } else if (action === 4) {
            showInventory();
            continue;
        }
        if (monsterHealth <= 0) {
            console.log(`You defeated the ${monsterName}!`);
            if (isDragon) {
                dragonDefeated = true;
                playerGold += 100;
                console.log("You loot the dragon's hoard! +100 gold.");
            } else {
                playerGold += 10;
                console.log("You gain 10 gold.");
            }
            return true;
        }
        // Monster attacks
        let protection = armor ? armor.effect : 0;
        let damageTaken = monsterDamage - protection;
        if (damageTaken < 1) damageTaken = 1;
        playerHealth -= damageTaken;
        if (playerHealth < 0) playerHealth = 0;
        console.log(`${monsterName} attacks! You take ${damageTaken} damage. (Protection: ${protection})`);
        if (playerHealth <= 0) {
            console.log("You have died!");
            return false;
        }
    }
    return false;
}

// =====================
// === Inventory Display ===
// =====================

function showInventory() {
    console.log("\n=== INVENTORY ===");
    if (inventory.length === 0) {
        console.log("Your inventory is empty.");
        return;
    }
    inventory.forEach((item, idx) => {
        console.log(`${idx + 1}: ${item.name} (${item.type}) - ${item.description}`);
    });
}

// =====================
// === Shopping Functions ===
// =====================

function buyFromBlacksmith() {
    console.log("\n--- Blacksmith Shop ---");
    const shopItems = [sword, steelSword, woodenShield, ironShield];
    shopItems.forEach((item, idx) => {
        console.log(`${idx + 1}: ${item.name} (${item.value} gold) - ${item.description}`);
    });
    console.log(`${shopItems.length + 1}: Exit shop`);
    let choice = getChoice("Choose an item to buy: ", 1, shopItems.length + 1);
    if (choice === shopItems.length + 1) return;
    let item = shopItems[choice - 1];
    if (inventory.length >= maxInventorySlots) {
        console.log("No space in your inventory.");
        return;
    }
    if (playerGold < item.value) {
        console.log("Not enough gold.");
        return;
    }
    if (item.type === "weapon" && getItemsByType("weapon").some(i => i.name === item.name)) {
        console.log("You already own this weapon.");
        return;
    }
    if (item.type === "armor" && getItemsByType("armor").some(i => i.name === item.name)) {
        console.log("You already own this armor.");
        return;
    }
    inventory.push({ ...item });
    playerGold -= item.value;
    console.log(`You bought a ${item.name}.`);
}

function buyFromMarket() {
    console.log("\n--- Market ---");
    console.log(`1: ${healthPotion.name} (${healthPotion.value} gold) - ${healthPotion.description}`);
    console.log("2: Exit shop");
    let choice = getChoice("Choose an item to buy: ", 1, 2);
    if (choice === 2) return;
    if (inventory.length >= maxInventorySlots) {
        console.log("No space in your inventory.");
        return;
    }
    if (playerGold < healthPotion.value) {
        console.log("Not enough gold.");
        return;
    }
    inventory.push({ ...healthPotion });
    playerGold -= healthPotion.value;
    console.log(`You bought a ${healthPotion.name}.`);
}

// =====================
// === Location System ===
// =====================

function showLocation() {
    console.log(`\n=== ${currentLoc.toUpperCase()} ===`);
    if (currentLoc === "village") {
        console.log("1: Visit Blacksmith");
        console.log("2: Visit Market");
        console.log("3: Enter Forest");
        console.log("4: Check Status");
        console.log("5: Inventory");
        console.log("6: Quit");
        let choice = getChoice("Choose: ", 1, 6);
        if (choice === 1) currentLoc = "blacksmith";
        else if (choice === 2) currentLoc = "market";
        else if (choice === 3) currentLoc = "forest";
        else if (choice === 4) checkStatus();
        else if (choice === 5) showInventory();
        else if (choice === 6) gameRunning = false;
    } else if (currentLoc === "blacksmith") {
        console.log("1: Buy Weapons/Armor");
        console.log("2: Return to Village");
        let choice = getChoice("Choose: ", 1, 2);
        if (choice === 1) buyFromBlacksmith();
        else if (choice === 2) currentLoc = "village";
    } else if (currentLoc === "market") {
        console.log("1: Buy Potions");
        console.log("2: Return to Village");
        let choice = getChoice("Choose: ", 1, 2);
        if (choice === 1) buyFromMarket();
        else if (choice === 2) currentLoc = "village";
    } else if (currentLoc === "forest") {
        console.log("1: Fight Monster");
        console.log("2: Go Deeper (Dragon's Lair)");
        console.log("3: Return to Village");
        let choice = getChoice("Choose: ", 1, 3);
        if (choice === 1) handleCombat(false);
        else if (choice === 2) {
            if (!hasGoodEquipment()) {
                console.log("You need a Steel Sword and any armor to face the dragon!");
            } else {
                if (handleCombat(true)) {
                    showVictory();
                    gameRunning = false;
                }
            }
        } else if (choice === 3) currentLoc = "village";
    }
}

function checkStatus() {
    console.log(`Health: ${playerHealth}/150 | Gold: ${playerGold}`);
    showEquipment();
}

// =====================
// === Victory Screen ===
// =====================

function showVictory() {
    console.log("\n=== VICTORY! ===");
    console.log(`Congratulations, ${playerName}! You have slain the dragon and saved the land!`);
    console.log(`Final Stats: Health: ${playerHealth}, Gold: ${playerGold}`);
    showEquipment();
}

// =====================
// === Game Start ===
// =====================

function startGame() {
    playerName = readline.question("What is your name, brave adventurer? ");
    console.log(`Welcome, ${playerName}! Your adventure begins now.`);
    while (gameRunning && playerHealth > 0 && !dragonDefeated) {
        showLocation();
    }
    if (!dragonDefeated) console.log("Game over. Thank you for playing!");
}

startGame();
