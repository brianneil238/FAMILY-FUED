// Variables to track player scores, number of rounds, and current answer
let playerScores = [0, 0]; // Scores for Team 1 and Team 2
let currentRound = 1;
const totalRounds = 5; // Total number of rounds in the game
let currentAnswer = '';
let roundAnswers = ['Apple', 'Banana', 'Orange', 'Grape']; // Pre-stored correct answers for the round
let timer; // Variable to store the timer ID

// Function to initialize the game
function startGame() {
    playerScores = [0, 0];
    currentRound = 1;
    document.getElementById('result').innerHTML = '';
    updateScoreTable();
    startRound();
}

// Event listener for the "Start Game" button
document.querySelector('button[type="button"]').addEventListener('click', startGame);

// Function to start a new round
function startRound() {
    currentAnswer = '';
    // Show the countdown timer
    let countdown = 10; // Set the countdown time
    document.getElementById('countdown-timer').style.display = 'block';
    document.getElementById('timer').innerText = countdown;

    timer = setInterval(() => {
        countdown--;
        document.getElementById('timer').innerText = countdown;

        if (countdown <= 0) {
            clearInterval(timer);
            alert('Time is up!');
            checkRoundEnd();
        }
    }, 1000);
}

// Function to validate answers and compare them with pre-stored answers
function validateAnswer(answer) {
    if (roundAnswers.includes(answer)) {
        // Display correct answers
        displayCorrectAnswers(answer);
        updateScores();
        alert('Correct Answer!');
    } else {
        alert('Incorrect Answer! Try again.');
    }
}

// Function to display correct answers in the results section
function displayCorrectAnswers(answer) {
    const resultSection = document.getElementById('result');
    resultSection.innerHTML += `<p>Correct Answer: ${answer}</p>`;
}

// Function to update the player scores in the score table
function updateScores() {
    // Here, you can decide which team scores points
    // For simplicity, we'll assume Team 1 gets the points
    playerScores[0] += 1; // Increment score for Team 1
    updateScoreTable();
}

// Function to update the score table
function updateScoreTable() {
    const scoreTable = document.querySelector('.score-table tbody');
    scoreTable.innerHTML = `
        <tr>
            <td>${playerScores[0]}</td>
            <td>${playerScores[1]}</td>
        </tr>
    `;
}

// Event listener for submitting answers
document.getElementById('answer-form').addEventListener('submit', function(event) {
    event.preventDefault();
    currentAnswer = event.target['user-answer'].value.trim();
    validateAnswer(currentAnswer);
});

// Function to check if the round is over and move to the next round
function checkRoundEnd() {
    if (currentRound < totalRounds) {
        currentRound++;
        startRound(); // Start the next round
    } else {
        endGame(); // End the game
    }
}

// Function to handle the game-over scenario
function endGame() {
    clearInterval(timer);
    document.getElementById('countdown-timer').style.display = 'none';
    let winningTeam = playerScores[0] > playerScores[1] ? 'Team 1' : 'Team 2';
    alert(`${winningTeam} wins the game!`);
    resetGame();
}

// Function to reset the game
function resetGame() {
    playerScores = [0, 0];
    currentRound = 1;
    document.getElementById('result').innerHTML = '';
    updateScoreTable();
}

// Function to simulate buzzer events
function buzz() {
    console.log('Buzzer pressed!'); // Log buzzer event
    alert('Buzzer pressed!'); // Simulate buzzer sound
}

// Random function to stimulate game events
function randomEvent() {
    const eventNum = Math.random();
    if (eventNum < 0.5) {
        buzz(); // Simulate buzzer
    }
}

// Function to handle the timing for the buzzer
function handleBuzzerTiming() {
    setTimeout(() => {
        randomEvent(); // Call random event after a certain time
    }, 5000); // Call after 5 seconds
}

// Start the game on page load
window.onload = () => {
    handleBuzzerTiming(); // Start buzzer timing
};
