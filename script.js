let balance = 1000;
let betAmount = 0;
let playerHand = [];
let dealerHand = [];
let deck = [];
let gameActive = false;

// Initialize game and event listeners
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("start-game").addEventListener("click", showGameScreen);
    document.querySelectorAll(".chip").forEach(chip => chip.addEventListener("click", placeBet));
    document.getElementById("deal-button").addEventListener("click", startGame);
    document.getElementById("hit-button").addEventListener("click", playerHit);
    document.getElementById("stand-button").addEventListener("click", dealerPlay);
    document.getElementById("restart-button").addEventListener("click", restartGame);
    updateBetUI();
});

// Show game table and hide home screen
function showGameScreen() {
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");
}

// Handle chip betting
function placeBet() {
    if (gameActive) return; // Prevent betting after game starts

    let value = parseInt(this.getAttribute("data-value"));
    if (balance >= value) {
        betAmount += value;
        balance -= value;
        updateBetUI();
        document.getElementById("deal-button").disabled = false;
    }
}

// Start the game by dealing cards
function startGame() {
    if (betAmount <= 0) {
        alert("You must place a bet before dealing!");
        return;
    }

    resetHands();

    deck = createDeck();
    shuffleDeck(deck);

    playerHand.push(drawCard());
    playerHand.push(drawCard());
    dealerHand.push(drawCard());
    dealerHand.push(drawCard());

    gameActive = true;
    updateGameUI();

    document.getElementById("deal-button").disabled = true;
    document.getElementById("hit-button").disabled = false;
    document.getElementById("stand-button").disabled = false;
}

// Create a standard deck of 52 cards
function createDeck() {
    let suits = ["♠", "♥", "♦", "♣"];
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let newDeck = [];
    for (let suit of suits) {
        for (let value of values) {
            newDeck.push({ suit, value });
        }
    }
    return newDeck;
}

// Shuffle the deck randomly
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Draw a card from the deck
function drawCard() {
    return deck.pop();
}

// Handle player hitting (drawing a card)
function playerHit() {
    if (!gameActive) return;
    playerHand.push(drawCard());
    updateGameUI();

    if (calculateScore(playerHand) > 21) {
        endGame("Bust! You lose.");
    }
}

// Dealer's turn after player stands
function dealerPlay() {
    if (!gameActive) return;

    document.getElementById("hit-button").disabled = true;
    document.getElementById("stand-button").disabled = true;

    while (calculateScore(dealerHand) < 17) {
        dealerHand.push(drawCard());
    }

    updateGameUI();
    determineWinner();
}

// Determine the winner
function determineWinner() {
    let playerScore = calculateScore(playerHand);
    let dealerScore = calculateScore(dealerHand);

    if (dealerScore > 21 || playerScore > dealerScore) {
        balance += betAmount * 2;
        endGame("You win!");
    } else if (playerScore === dealerScore) {
        balance += betAmount; // Return bet
        endGame("It's a tie!");
    } else {
        endGame("Dealer wins.");
    }
}

// End the game and reset buttons
function endGame(message) {
    document.getElementById("message").textContent = message;
    document.getElementById("hit-button").disabled = true;
    document.getElementById("stand-button").disabled = true;
    document.getElementById("deal-button").disabled = false;
    gameActive = false;
    betAmount = 0; // Reset bet after round
    updateBetUI();
}

// Restart the entire game
function restartGame() {
    balance = 1000;
    betAmount = 0;
    resetHands();
    gameActive = false;

    document.getElementById("deal-button").disabled = true;
    document.getElementById("hit-button").disabled = true;
    document.getElementById("stand-button").disabled = true;
    document.getElementById("message").textContent = "";

    updateGameUI();
    updateBetUI();
}

// Calculate hand score
function calculateScore(hand) {
    let score = 0;
    let aces = 0;

    hand.forEach(card => {
        if (card.value === "A") {
            aces++;
            score += 11;
        } else if (["J", "Q", "K"].includes(card.value)) {
            score += 10;
        } else {
            score += parseInt(card.value);
        }
    });

    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }

    return score;
}

// Reset hands
function resetHands() {
    playerHand = [];
    dealerHand = [];
    document.getElementById("player-cards").innerHTML = "";
    document.getElementById("dealer-cards").innerHTML = "";
}

// Update game UI
function updateGameUI() {
    document.getElementById("player-cards").innerHTML = playerHand.map(card => `<div class="card">${card.value}${card.suit}</div>`).join("");
    document.getElementById("dealer-cards").innerHTML = dealerHand.map(card => `<div class="card">${card.value}${card.suit}</div>`).join("");

    document.getElementById("player-score").textContent = calculateScore(playerHand);
    document.getElementById("dealer-score").textContent = calculateScore(dealerHand);
}

// Update bet and balance UI
function updateBetUI() {
    document.getElementById("bet-amount").textContent = betAmount;
    document.getElementById("balance").textContent = balance;
}

