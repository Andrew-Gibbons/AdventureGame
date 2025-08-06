const readline = require("readline-sync");

// =====================
// === Game Variables ===
// =====================

let playerName = "";
let playerHealth = 150;
let playerGold = 100; // Start with 100 gold
let weaponDamage = 0;
let maxInventorySlots = 10; // Inventory has 10 slots

// Start Story Choices
let currentLoc = "village";
let isFirstVisit = true;
let firstVisitVillage = true;
let firstVisitBlacksmithOne = true;
let firstVisitMarket = true;
let firstVisitForest = true;

// Inventory array: stores all player items as objects, max 10 slots
let inventory = []; // Example: [{...sword}, {...healthPotion}]

let gameRunning = true;

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

// =====================
// === Display Section ===
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

function checkStatus() {
    console.log(`Status: Health=${playerHealth}, Gold=${playerGold}`);
    if (inventory.length === 0) {
        console.log("Inventory: (empty)");
    } else {
        let invStr = inventory.map((item, idx) => {
            return `${idx + 1}: ${item.name}`;
        }).join(", ");
        console.log(`Inventory: [${invStr}]`);
    }
}

function showHelp() {
    while (true) {
        console.log("\n=== HELP MENU ===");
        console.log("Select a topic for more information:");
        console.log("1: Commands");
        console.log("2: Navigation");
        console.log("3: Combat");
        console.log("4: Items");
        console.log("5: Quit/Exit");
        console.log("6: Return to game");
        const input = readline.question("Enter your choice (1-6): ");
        switch (input) {
            case "1":
                console.log("\n--- COMMANDS ---");
                console.log("Each location has options to move, check status, check inventory, and quit.");
                console.log("Some locations have special commands (e.g., buy potions in the market).");
                break;
            case "2":
                console.log("\n--- NAVIGATION ---");
                console.log("Press the number that corresponds to the location or action you want.");
                console.log("Example: Press 1 to go to the blacksmith, 2 for the market, etc.");
                break;
            case "3":
                console.log("\n--- COMBAT ---");
                console.log("1: Attack with your weapon.");
                console.log("2: Use a potion (if you have one).");
                console.log("3: Run away from battle.");
                break;
            case "4":
                console.log("\n--- ITEMS ---");
                console.log(`${sword.name}: ${sword.description}`);
                console.log(`${healthPotion.name}: ${healthPotion.description}`);
                break;
            case "5":
                console.log("\n--- QUIT/EXIT ---");
                console.log("Press the last number in the options list to quit the game from any location.");
                break;
            case "6":
                console.log("Returning to the game...");
                return;
            default:
                console.log("Invalid choice. Please enter a number between 1 and 6.");
        }
    }
}

// =====================
// === Utility Section ===
// =====================

function hasItemType(type) {
    return inventory.some(item => item.type === type);
}

// =====================
// === Gameplay Section ===
// =====================

console.log("Welcome to the Adventure Game");
console.log("Prepare yourself for an epic journey!");
console.log("Current player location:", currentLoc);
console.log("Is this the first visit?", isFirstVisit);
console.log("Type of currentLocation:", typeof currentLoc);
console.log("Type of isFirstVisit:", typeof isFirstVisit);

function getPlayerName() {
    playerName = readline.question("What is your name, brave adventurer? ");
    console.log(`Welcome, ${playerName}! Your adventure begins now.`);
}

getPlayerName();
console.log("You start with " + playerGold + " gold.");
console.log("Your current weapon damage is: " + weaponDamage);
console.log("When you buy a sword, your weapon damage will be " + sword.effect + ".");
console.log("You have a healing potion that restores " + healthPotion.effect + " health.");

/**
 * Updates the player's health based on the action.
 * @param {string} action - The action to perform ("potion" or "damage").
 * @return {boolean} True if the action was successful, false otherwise.
 */
function updateHealth(action) {
    if (action === "potion") {
        if (playerHealth === 0) {
            console.log("You are dead and cannot use a potion.");
            return false;
        }
        if (playerHealth >= 150) {
            console.log("Potion fails! Player health over 150 points forbidden.");
            return false;
        }
        let potionIndex = inventory.findIndex(item => item.type === "potion");
        if (potionIndex !== -1) {
            playerHealth += inventory[potionIndex].effect;
            if (playerHealth > 150) playerHealth = 150;
            // Remove potion from inventory
            let usedPotion = inventory.splice(potionIndex, 1)[0];
            console.log(`You use a ${usedPotion.name}. Health is now ${playerHealth}.`);
            if (playerHealth <= 3 && playerHealth > 0) {
                console.log("Warning: Your health is low!");
            }
            return true;
        } else {
            console.log("You have no potions!");
            return false;
        }
    } else if (action === "damage") {
        if (playerHealth > 0) {
            playerHealth -= 15; // Monster deals 15 damage
            if (playerHealth < 0) playerHealth = 0;
            console.log(`You take 15 damage. Health is now ${playerHealth}.`);
            if (playerHealth <= 3 && playerHealth > 0) {
                console.log("Warning: Your health is low!");
            }
            if (playerHealth === 0) {
                console.log("You have reached zero health. You are dead.");
                return false;
            }
            return true;
        } else {
            console.log("You are already dead.");
            return false;
        }
    }
    return false;
}

/**
 * Allows the player to inspect their inventory and view/use items.
 * No parameters.
 * No return value.
 */
function checkInventory() {
    showInventory();
    if (inventory.length === 0) return;
    const slotInput = readline.question("Enter the item number to inspect/use (1-" + inventory.length + ", or 0 to exit): ");
    const slotNum = parseInt(slotInput, 10);
    if (slotNum === 0) {
        console.log("Exiting inventory inspection.");
        return;
    }
    if (slotNum < 1 || slotNum > inventory.length) {
        console.log("Invalid item number.");
        return;
    }
    const item = inventory[slotNum - 1];
    console.log(`You inspect item ${slotNum}: ${item.name} (${item.type})`);
    console.log(item.description);
    if (item.type === "potion") {
        let use = readline.question("Would you like to use this potion? (y/n): ");
        if (use.toLowerCase() === "y") {
            playerHealth += item.effect;
            if (playerHealth > 10) playerHealth = 10;
            inventory.splice(slotNum - 1, 1);
            console.log(`You used a ${item.name}. Health is now ${playerHealth}.`);
        }
    }
}

/**
 * Determines the current location and calls the corresponding function.
 * No parameters.
 * No return value.
 */
function currentLocation() {
    if (currentLoc === "village") {
        village();
    } else if (currentLoc === "blacksmith") {
        blacksmith();
    } else if (currentLoc === "market") {
        market();
    } else if (currentLoc === "forest") {
        forest();
    } else {
        console.log("Error: Invalid current location.");
    }
}

/**
 * Moves the player to a new location if the path is valid.
 * @param {string} destination - The location to move to.
 * @return {object} An object with success status and new location or reason for failure.
 */
function move(destination) {
    // Define valid moves from each location
    const paths = {
        "village": ["blacksmith", "market", "forest"],
        "blacksmith": ["village"],
        "market": ["village"],
        "forest": ["village"]
    };
    if (!paths.hasOwnProperty(currentLoc)) {
        console.log(`Error: Invalid current location "${currentLoc}". Movement failed.`);
        return { success: false, reason: "Invalid current location." };
    }
    if (!paths[currentLoc].includes(destination)) {
        console.log(`Error: No path from ${currentLoc} to ${destination}. Movement failed.`);
        return { success: false, reason: "No path to destination." };
    }
    currentLoc = destination;
    console.log(`Movement successful! You are now at the ${currentLoc}.`);
    return { success: true, newLocation: currentLoc };
}

/**
 * Handles the combat system when the player encounters a monster.
 * Player can attack, use potion, or run away.
 * @return {boolean} True if the player wins, false if they lose or retreat.
 */
function doBattle() {
    console.log("Combat begins!");
    if (!hasItemType("weapon")) {
        console.log("You have no weapon! You retreat to the forest entrance.");
        return false; // Retreat
    }
    let weapon = inventory.find(item => item.type === "weapon");
    let battlePlayerHealth = playerHealth;
    let monsterHealth = 50;
    let round = 1;
    while (battlePlayerHealth > 0 && monsterHealth > 0) {
        console.log(`\n--- Round ${round} ---`);
        console.log(`Your Health: ${battlePlayerHealth} | Monster Health: ${monsterHealth}`);
        console.log("1: Attack");
        console.log("2: Use potion");
        console.log("3: Run away");
        console.log("4: Show inventory");
        console.log("5: Help");
        let action = readline.question("Choose your action (1-5): ");
        if (action === "1") {
            monsterHealth -= weapon.effect;
            console.log(`You attack the monster with your ${weapon.name} for ${weapon.effect} points!`);
            if (monsterHealth <= 0) {
                monsterHealth = 0;
                console.log(`You defeated the beast! You win! Your health: ${battlePlayerHealth}. You gain 10 gold.`);
                playerGold += 10;
                playerHealth = battlePlayerHealth; // Update main health
                return true; // Win, return to forest
            }
        } else if (action === "2") {
            // Use potion
            let potionUsed = false;
            if (battlePlayerHealth > 0 && battlePlayerHealth < 150) {
                let potionIndex = inventory.findIndex(item => item.type === "potion");
                if (potionIndex !== -1) {
                    let potion = inventory[potionIndex];
                    // Temporarily set playerHealth to battlePlayerHealth for updateHealth, then sync back
                    let prevPlayerHealth = playerHealth;
                    playerHealth = battlePlayerHealth;
                    playerHealth += potion.effect;
                    if (playerHealth > 150) playerHealth = 150;
                    inventory.splice(potionIndex, 1);
                    console.log(`You use a ${potion.name}. Health is now ${playerHealth}.`);
                    battlePlayerHealth = playerHealth;
                    playerHealth = prevPlayerHealth;
                    potionUsed = true;
                } else {
                    console.log("You have no potions!");
                }
            } else if (battlePlayerHealth === 0) {
                console.log("You are dead and cannot use a potion.");
            } else {
                console.log("Potion fails! Player health over 150 points forbidden.");
            }
            if (!potionUsed) continue;
        } else if (action === "3") {
            console.log("You run away from the battle!");
            return false;
        } else if (action === "4") {
            showInventory();
            checkInventory();
            continue;
        } else if (action === "5") {
            showHelp();
            continue;
        } else {
            console.log("Invalid choice.");
            continue;
        }
        // Monster attacks
        let prevPlayerHealth = playerHealth;
        playerHealth = battlePlayerHealth;
        updateHealth("damage");
        battlePlayerHealth = playerHealth;
        playerHealth = prevPlayerHealth;

        if (battlePlayerHealth < 0) battlePlayerHealth = 0;
        console.log("The monster attacks you for 15 point!");
        console.log(`Your Health: ${battlePlayerHealth} | Monster Health: ${monsterHealth}`);
        if (battlePlayerHealth <= 3 && battlePlayerHealth > 0) {
            console.log("Warning: Your health is low!");
        }
        if (battlePlayerHealth === 0) {
            console.log("You have reached zero health. You are dead. Game over!");
            playerHealth = 0;
            return false; // Lose
        }
        round++;
    }
    return false;
}

// =====================
// === Location Section ===
// =====================

function village() {
    console.log("\n=== VILLAGE ===");
    if (firstVisitVillage) {
        console.log("Welcome to the village, a bustling hub of activity and friendly faces.");
        firstVisitVillage = false;
    }
    console.log("You see cobblestone streets, villagers going about their day, and shops lining the square.");
    console.log("What would you like to do?");
    console.log("1: Visit the blacksmith");
    console.log("2: Visit the market");
    console.log("3: Enter the forest");
    console.log("4: Check your status");
    console.log("5: Check your inventory");
    console.log("6: Help");
    console.log("7: Quit the game");

    let input = readline.question("Enter your choice (1-7): ");
    let choice = parseInt(input, 10);

    if (choice === 1) {
        move("blacksmith");
    } else if (choice === 2) {
        move("market");
    } else if (choice === 3) {
        move("forest");
    } else if (choice === 4) {
        checkStatus();
    } else if (choice === 5) {
        showInventory();
        checkInventory();
    } else if (choice === 6) {
        showHelp();
    } else if (choice === 7) {
        console.log("Thank you for playing! Goodbye.");
        gameRunning = false;
    } else if (isNaN(choice) || choice < 1 || choice > 7) {
        console.log("Invalid choice. Please enter a number between 1 and 7.");
    }
}

function blacksmith() {
    console.log("\n=== BLACKSMITH ===");
    if (firstVisitBlacksmithOne) {
        console.log("You enter the blacksmith's shop for the first time. You look around at all the weapons and armor.");
        firstVisitBlacksmithOne = false;
    } else {
        console.log("You enter the blacksmith's shop. The sound of hammer on anvil rings out as sparks fly.");
    }
    console.log("What would you like to do?");
    console.log("1: Return to the village");
    console.log(`2: Buy a ${sword.name} (${sword.value} gold)`);
    console.log("3: Check your status");
    console.log("4: Check your inventory");
    console.log("5: Help");
    console.log("6: Quit the game");
    let blacksmithInput = readline.question("Enter your choice (1-6): ");
    let blacksmithChoice = parseInt(blacksmithInput, 10);

    if (blacksmithChoice === 1) {
        move("village");
    } else if (blacksmithChoice === 2) {
        // Buy sword logic
        if (hasItemType("weapon")) {
            console.log("You already have a sword.");
        } else if (inventory.length >= maxInventorySlots) {
            console.log("No space in your inventory for a sword.");
        } else if (playerGold < sword.value) {
            console.log("You do not have enough gold to buy a sword.");
        } else {
            inventory.push({ ...sword });
            playerGold -= sword.value;
            console.log(`You bought a ${sword.name} for ${sword.value} gold.`);
            console.log(`You now have ${playerGold} gold.`);
        }
    } else if (blacksmithChoice === 3) {
        checkStatus();
    } else if (blacksmithChoice === 4) {
        showInventory();
        checkInventory();
    } else if (blacksmithChoice === 5) {
        showHelp();
    } else if (blacksmithChoice === 6) {
        console.log("Thank you for playing! Goodbye.");
        gameRunning = false;
    } else if (isNaN(blacksmithChoice) || blacksmithChoice < 1 || blacksmithChoice > 6) {
        console.log("Invalid choice. Please enter a number between 1 and 6.");
    }
}

function market() {
    console.log("\n=== MARKET ===");
    if (firstVisitMarket) {
        console.log("You arrive at the market for the first time. Stalls are filled with exotic goods and lively merchants.");
        firstVisitMarket = false;
    }
    console.log("You see vendors selling food, potions, and trinkets.");
    console.log("1: Return to the village");
    console.log(`2: Buy a ${healthPotion.name} (${healthPotion.value} gold, heals ${healthPotion.effect} HP)`);
    console.log("3: Check your status");
    console.log("4: Check your inventory");
    console.log("5: Help");
    console.log("6: Quit the game");
    let marketInput = readline.question("Enter your choice (1-6): ");
    let marketChoice = parseInt(marketInput, 10);

    if (marketChoice === 1) {
        move("village");
    } else if (marketChoice === 2) {
        // Buy potion logic
        if (inventory.length >= maxInventorySlots) {
            console.log("No space in your inventory for more potions.");
        } else if (playerGold < healthPotion.value) {
            console.log("You do not have enough gold to buy a potion.");
        } else {
            inventory.push({ ...healthPotion });
            playerGold -= healthPotion.value;
            console.log(`You bought a ${healthPotion.name} for ${healthPotion.value} gold.`);
            console.log(`You now have ${playerGold} gold.`);
        }
    } else if (marketChoice === 3) {
        checkStatus();
    } else if (marketChoice === 4) {
        showInventory();
        checkInventory();
    } else if (marketChoice === 5) {
        showHelp();
    } else if (marketChoice === 6) {
        console.log("Thank you for playing! Goodbye.");
        gameRunning = false;
    } else if (isNaN(marketChoice) || marketChoice < 1 || marketChoice > 6) {
        console.log("Invalid choice. Please enter a number between 1 and 6.");
    }
}

function forest() {
    console.log("\n=== FOREST ===");
    if (firstVisitForest) {
        console.log("You step into the forest for the first time. The trees are tall and the air is thick with mystery.");
        firstVisitForest = false;
    }
    console.log("You hear birds chirping and the rustle of leaves underfoot.");
    console.log("1: Return to the village");
    console.log("2: Check your status");
    console.log("3: Go deeper into the forest");
    console.log("4: Check your inventory");
    console.log("5: Help");
    console.log("6: Quit the game");
    let forestInput = readline.question("Enter your choice (1-6): ");
    let forestChoice = parseInt(forestInput, 10);

    if (forestChoice === 1) {
        move("village");
    } else if (forestChoice === 2) {
        checkStatus();
    } else if (forestChoice === 3) {
        // Start battle deeper in the forest
        let result = doBattle();
        if (result === true) {
            console.log("You return to the forest after your victory.");
        } else if (result === false && playerHealth > 0) {
            console.log("You return to the forest after retreating.");
        } else if (playerHealth === 0) {
            gameRunning = false;
        }
    } else if (forestChoice === 4) {
        showInventory();
        checkInventory();
    } else if (forestChoice === 5) {
        showHelp();
    } else if (forestChoice === 6) {
        console.log("Thank you for playing! Goodbye.");
        gameRunning = false;
    } else if (isNaN(forestChoice) || forestChoice < 1 || forestChoice > 6) {
        console.log("Invalid choice. Please enter a number between 1 and 6.");
    }
}

// =====================
// === Main Game Loop ===
// =====================

while (gameRunning) {
    currentLocation();
}
console.log("Game over. Thank you for playing!");
