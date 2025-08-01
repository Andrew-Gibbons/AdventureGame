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

console.log("You start with " + playerHealth + " health.");
console.log("Your current location is: " + currentLocation);
console.log("Your hero status is: " + gameRunning);
console.log("Your inventory: " + inventory.join(", "));

getPlayerName();
console.log("You start with " + playerGold + " gold.");