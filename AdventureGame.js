const readline = require("readline-sync");

/*
Adventure Game
This game will be a text-based game where the player will be able
to make choices that affect the outcome of the game.
The player will be able to choose their own path and the story will change
based on their decisions.
*/

// =====================
// === Display Section ===
// =====================

/**
 * Displays the player's inventory in a formatted way.
 * Shows each slot and its contents.
 * No parameters.
 * No return value.
 */
function showInven() {
    console.log("\n=== INVENTORY ===");
    let empty = true;
    for (let i = 0; i < inventorySlots; i++) {
        const item = inventory[i];
        if (item) {
            empty = false;
            if (item === "sword") {
                console.log(`Slot ${i + 1}: Sword (Weapon)`);
            } else if (item === "shield") {
                console.log(`Slot ${i + 1}: Shield (Armor)`);
            } else if (item === "potion") {
                console.log(`Slot ${i + 1}: Potion (Jar)`);
            } else {
                console.log(`Slot ${i + 1}: ${item}`);
            }
        } else {
            console.log(`Slot ${i + 1}: (empty)`);
        }
    }
    if (empty) {
        console.log("Your inventory is empty.");
    }
}

/**
 * Displays the player's current status including health, gold, and inventory.
 * No parameters.
 * No return value.
 */
function checkStatus() {
    console.log(`Status: Health=${playerHealth}, Gold=${playerGold}, Inventory=[${inventory.join(", ")}]`);
}

/**
 * Displays the help menu with information about commands, combat, navigation, and items.
 * Organized into logical categories.
 * No parameters.
 * No return value.
 */
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
                console.log("Sword: Used to attack monsters.");
                console.log("Shield: Provides armor (not yet implemented).");
                console.log("Potion: Heals for 1 point, costs 1 gold, max 10 potions.");
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
// === Gameplay Section ===
// =====================

let playerName = "";
let playerHealth = 10;
let playerGold = 20;
let weaponDamage = 0;
let swordDamage = 10;
let healingPotionValue = 1; // Each potion restores 1 health
let maxPotions = 10;

// Start Story Choices
let currentLoc = "village";
let isFirstVisit = true;
let firstVisitVillage = true;
let firstVisitBlacksmithOne = true;
let firstVisitMarket = true;
let firstVisitForest = true;

// Initialize inventory slots
let inventorySlots = 3;
let inventory = ["sword", "potion", null];

let gameRunning = true;

// === Initialization Section ===

console.log("Welcome to the Adventure Game");
console.log("Prepare yourself for an epic journey!");
console.log("Current player location:", currentLoc);
console.log("Is this the first visit?", isFirstVisit);
console.log("Type of currentLocation:", typeof currentLoc);
console.log("Type of isFirstVisit:", typeof isFirstVisit);

/**
 * Prompts the player for their name and welcomes them.
 * No parameters.
 * No return value.
 */
function getPlayerName() {
    playerName = readline.question("What is your name, brave adventurer? ");
    console.log(`Welcome, ${playerName}! Your adventure begins now.`);
}

getPlayerName();
console.log("You start with " + playerGold + " gold.");
console.log("Your current weapon damage is: " + weaponDamage);
console.log("When you buy a sword, your weapon damage will be "+ swordDamage + ".");
console.log("You have a healing potion that restores " + healingPotionValue + " health.");

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
        if (playerHealth >= 10) {
            console.log("Potion fails! Player health over 10 points forbidden.");
            return false;
        }
        let potionIndex = inventory.indexOf("potion");
        if (potionIndex !== -1) {
            playerHealth += healingPotionValue;
            if (playerHealth > 10) playerHealth = 10;
            inventory[potionIndex] = null;
            console.log(`You use a potion. Health is now ${playerHealth}.`);
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
            playerHealth -= 1;
            if (playerHealth < 0) playerHealth = 0;
            console.log(`You take 1 damage. Health is now ${playerHealth}.`);
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
 * Allows the player to inspect their inventory and view details about each item.
 * No parameters.
 * No return value.
 */
function checkInventory() {
    showInven();
    function checkItemInSlot() {
        const slotInput = readline.question("Enter the slot number to inspect (1-" + inventorySlots + ", or 0 to exit): ");
        const slotNum = parseInt(slotInput, 10);
        if (slotNum === 0) {
            console.log("Exiting inventory inspection.");
            return;
        }
        if (slotNum < 1 || slotNum > inventorySlots) {
            console.log("Invalid slot number.");
            return;
        }
        const item = inventory[slotNum - 1];
        if (item) {
            if (item === "sword") {
                console.log(`You inspect slot ${slotNum}: It contains a Sword (Weapon).`);
            } else if (item === "shield") {
                console.log(`You inspect slot ${slotNum}: It contains a Shield (Armor).`);
            } else if (item === "potion") {
                console.log(`You inspect slot ${slotNum}: It contains a Potion (Jar).`);
            } else {
                console.log(`You inspect slot ${slotNum}: It contains a ${item}.`);
            }
        } else {
            console.log(`Slot ${slotNum} is empty.`);
        }
    }
    checkItemInSlot();
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
    let hasSword = inventory.includes("sword");
    if (!hasSword) {
        console.log("You have no weapon! You retreat to the forest entrance.");
        return false; // Retreat
    }
    let battlePlayerHealth = playerHealth;
    let monsterHealth = 10;
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
            monsterHealth -= 2;
            console.log("You attack the monster for 2 points!");
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
            if (battlePlayerHealth > 0 && battlePlayerHealth < 10) {
                let potionIndex = inventory.indexOf("potion");
                if (potionIndex !== -1) {
                    // Call updateHealth for potion use
                    // Temporarily set playerHealth to battlePlayerHealth for updateHealth, then sync back
                    let prevPlayerHealth = playerHealth;
                    playerHealth = battlePlayerHealth;
                    potionUsed = updateHealth("potion");
                    battlePlayerHealth = playerHealth;
                    playerHealth = prevPlayerHealth;
                } else {
                    console.log("You have no potions!");
                }
            } else if (battlePlayerHealth === 0) {
                console.log("You are dead and cannot use a potion.");
            } else {
                console.log("Potion fails! Player health over 10 points forbidden.");
            }
            if (!potionUsed) continue;
        } else if (action === "3") {
            console.log("You run away from the battle!");
            return false;
        } else if (action === "4") {
            showInven();
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
        // Call updateHealth for taking damage
        let prevPlayerHealth = playerHealth;
        playerHealth = battlePlayerHealth;
        updateHealth("damage");
        battlePlayerHealth = playerHealth;
        playerHealth = prevPlayerHealth;

        if (battlePlayerHealth < 0) battlePlayerHealth = 0;
        console.log("The monster attacks you for 1 point!");
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

/**
 * Handles the village location, presenting options to the player.
 * No parameters.
 * No return value.
 */
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
        showInven();
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

/**
 * Handles the blacksmith location, presenting options to the player.
 * No parameters.
 * No return value.
 */
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
    console.log("2: Check your status");
    console.log("3: Check your inventory");
    console.log("4: Help");
    console.log("5: Quit the game");
    let blacksmithInput = readline.question("Enter your choice (1-5): ");
    let blacksmithChoice = parseInt(blacksmithInput, 10);

    if (blacksmithChoice === 1) {
        move("village");
    } else if (blacksmithChoice === 2) {
        checkStatus();
    } else if (blacksmithChoice === 3) {
        showInven();
        checkInventory();
    } else if (blacksmithChoice === 4) {
        showHelp();
    } else if (blacksmithChoice === 5) {
        console.log("Thank you for playing! Goodbye.");
        gameRunning = false;
    } else if (isNaN(blacksmithChoice) || blacksmithChoice < 1 || blacksmithChoice > 5) {
        console.log("Invalid choice. Please enter a number between 1 and 5.");
    }
}

/**
 * Handles the market location, presenting options to the player.
 * Allows the player to buy potions.
 * No parameters.
 * No return value.
 */
function market() {
    console.log("\n=== MARKET ===");
    if (firstVisitMarket) {
        console.log("You arrive at the market for the first time. Stalls are filled with exotic goods and lively merchants.");
        firstVisitMarket = false;
    }
    console.log("You see vendors selling food, potions, and trinkets.");
    console.log("1: Return to the village");
    console.log("2: Buy a potion (1 gold, max 10 potions)");
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
        let potionCount = inventory.filter(item => item === "potion").length;
        if (potionCount >= maxPotions) {
            console.log("You cannot carry more than 10 potions.");
        } else if (playerGold < 1) {
            console.log("You do not have enough gold to buy a potion.");
        } else {
            // Find first empty slot or expand inventory if needed
            let slot = inventory.indexOf(null);
            if (slot === -1 && inventory.length < maxPotions) {
                inventory.push("potion");
            } else if (slot !== -1) {
                inventory[slot] = "potion";
            } else {
                console.log("No space in your inventory for more potions.");
                return;
            }
            playerGold -= 1;
            console.log("You bought a potion for 1 gold.");
        }
    } else if (marketChoice === 3) {
        checkStatus();
    } else if (marketChoice === 4) {
        showInven();
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

/**
 * Handles the forest location, presenting options to the player.
 * Allows the player to go deeper and enter combat.
 * No parameters.
 * No return value.
 */
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
        showInven();
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
