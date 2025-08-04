const readline = require("readline-sync");
/*
Adventure Game
This game will be a text-based game where the player will be able
to make choices that affect the outcome of the game.
The player will be able to choose their own path and the story will change
based on their decisions.
*/

// Display the game title
console.log("Welcome to the Adventure Game");

// Add a welcome message
console.log("Prepare yourself for an epic journey!");

let playerName = "";
// Get player name using readline-sync
function getPlayerName() {
  playerName = readline.question("What is your name, brave adventurer? ");
  console.log(`Welcome, ${playerName}! Your adventure begins now.`);
    }

let playerHealth = 100;
let playerGold = 20;
let weaponDamage = 0;
let swordDamage = 10;
let healingPotionValue = 20;

// Start Story Choices
let currentLocation = "village";
let isFirstVisit = true;
let firstVisitVillage = true;
let firstVisitBlacksmithOne = true;
let firstVisitMarket = true;
let firstVisitForest = true;

// Initialize inventory slots
let inventorySlots = 3;
inventory = ["sword", "potion", null];

console.log("Current player location:", currentLocation);
console.log("Is this the first visit?", isFirstVisit);
console.log("Type of currentLocation:", typeof currentLocation);
console.log("Type of isFirstVisit:", typeof isFirstVisit);

getPlayerName();
console.log("You start with " + playerGold + " gold.");
console.log("Your current weapon damage is: " + weaponDamage);
console.log("When you buy a sword, your weapon damage will be "+ swordDamage + ".");
console.log("You have a healing potion that restores " + healingPotionValue + " health.");

function checkInventory() {
    console.log("\n=== INVENTORY ===");
    for (let i = 0; i < inventorySlots; i++) {
        if (inventory[i]) {
            console.log(`Slot ${i + 1}: ${inventory[i]}`);
        } else {
            console.log(`Slot ${i + 1}: (empty)`);
        }
    }

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
            console.log(`You inspect slot ${slotNum}: It contains a ${item}.`);
        } else {
            console.log(`Slot ${slotNum} is empty.`);
        }
    }

    checkItemInSlot();
}

gameRunning = true;
while (gameRunning) {
    if (currentLocation === "village") {
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
        console.log("6: Quit the game");

        let input = readline.question("Enter your choice (1-6): ");
        let choice = parseInt(input, 10);

        if (choice === 1) {
            currentLocation = "blacksmith";
            console.log("You walk to the blacksmith's shop.");
        } else if (choice === 2) {
            currentLocation = "market";
            console.log("You head to the bustling market.");
        } else if (choice === 3) {
            currentLocation = "forest";
            console.log("You venture into the mysterious forest.");
        } else if (choice === 4) {
            console.log(`Status: Health=${playerHealth}, Gold=${playerGold}, Inventory=[${inventory.join(", ")}]`);
        } else if (choice === 5) {
            checkInventory();
        } else if (choice === 6) {
            console.log("Thank you for playing! Goodbye.");
            gameRunning = false;
        } else {
            console.log("Invalid choice. Please enter a number between 1 and 6.");
        }
    } else if (currentLocation === "blacksmith") {
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
        console.log("4: Quit the game");
        let blacksmithInput = readline.question("Enter your choice (1-4): ");
        let blacksmithChoice = parseInt(blacksmithInput, 10);

        if (blacksmithChoice === 1) {
            currentLocation = "village";
            console.log("You return to the village.");
        } else if (blacksmithChoice === 2) {
            console.log(`Status: Health=${playerHealth}, Gold=${playerGold}, Inventory=[${inventory.join(", ")}]`);
        } else if (blacksmithChoice === 3) {
            checkInventory();
        } else if (blacksmithChoice === 4) {
            console.log("Thank you for playing! Goodbye.");
            gameRunning = false;
        } else {
            console.log("Invalid choice. Please enter a number between 1 and 4.");
        }
    } else if (currentLocation === "market") {
        console.log("\n=== MARKET ===");
        if (firstVisitMarket) {
            console.log("You arrive at the market for the first time. Stalls are filled with exotic goods and lively merchants.");
            firstVisitMarket = false;
        }
        console.log("You see vendors selling food, potions, and trinkets.");
        // Add market options here if needed
        console.log("1: Return to the village");
        console.log("2: Check your status");
        console.log("3: Check your inventory");
        console.log("4: Quit the game");
        let marketInput = readline.question("Enter your choice (1-4): ");
        let marketChoice = parseInt(marketInput, 10);

        if (marketChoice === 1) {
            currentLocation = "village";
            console.log("You return to the village.");
        } else if (marketChoice === 2) {
            console.log(`Status: Health=${playerHealth}, Gold=${playerGold}, Inventory=[${inventory.join(", ")}]`);
        } else if (marketChoice === 3) {
            checkInventory();
        } else if (marketChoice === 4) {
            console.log("Thank you for playing! Goodbye.");
            gameRunning = false;
        } else {
            console.log("Invalid choice. Please enter a number between 1 and 4.");
        }
        
    } else if (currentLocation === "forest") {
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
    console.log("5: Quit the game");
    let forestInput = readline.question("Enter your choice (1-5): ");
    let forestChoice = parseInt(forestInput, 10);

    if (forestChoice === 1) {
        currentLocation = "village";
        console.log("You return to the village.");
    } else if (forestChoice === 2) {
        console.log(`Status: Gold=${playerGold}, Inventory=[${inventory.join(", ")}]`);
    } else if (forestChoice === 3) {
        // Start battle deeper in the forest (track monster health each round)
        let monsterHealth = 6;
        console.log("You venture deeper into the forest and encounter a wild beast!");
        battleLoop: while (monsterHealth > 0) {
            console.log(`\n--- Battle ---`);
            console.log(`Monster Health: ${monsterHealth}`);
            console.log("1: Attack");
            console.log("2: Use potion");
            console.log("3: Run away");
            console.log("4: Check your inventory");
            let battleInput = readline.question("Choose your action (1-4): ");
            let battleChoice = parseInt(battleInput, 10);

            if (battleChoice === 1) {
                monsterHealth -= 2;
                console.log("You attack the beast! Its health decreases by 2.");
                if (monsterHealth <= 0) {
                    console.log("You defeated the beast! You find 10 gold.");
                    playerGold += 10;
                    break battleLoop;
                }
            } else if (battleChoice === 2) {
                let potionIndex = inventory.indexOf("potion");
                if (potionIndex !== -1) {
                    inventory[potionIndex] = null;
                    console.log("You use a potion.");
                } else {
                    console.log("You have no potions!");
                }
            } else if (battleChoice === 3) {
                console.log("You run away from the beast and return to the forest entrance.");
                break battleLoop;
            } else if (battleChoice === 4) {
                checkInventory();
            } else {
                console.log("Invalid choice. Please enter a number between 1 and 4.");
            }
        }
    } else if (forestChoice === 4) {
        checkInventory();
    } else if (forestChoice === 5) {
        console.log("Thank you for playing! Goodbye.");
        gameRunning = false;
    } else {
        console.log("Invalid choice. Please enter a number between 1 and 5.");
    }
}
}
