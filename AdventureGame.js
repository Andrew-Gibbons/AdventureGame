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
let currentLocation = "village";
let gameRunning = true;
let inventory = [];
let weaponDamage = 0;
let swordDamage = 10;
let monsterArmor = 5;
let healingPotionValue = 30;

console.log("You start with " + playerHealth + " health.");
console.log("Your current location is: " + currentLocation);
console.log("Your hero status is: " + gameRunning);
console.log("Your inventory: " + inventory.join(", "));

getPlayerName();
console.log("You start with " + playerGold + " gold.");
console.log("Your current weapon damage is: " + weaponDamage);
console.log("When you buy a sword, your weapon damage will be "+ swordDamage + ".");
console.log("The monster's armor is: " + monsterArmor);
console.log("You have a healing potion that restores " + healingPotionValue + " health.");