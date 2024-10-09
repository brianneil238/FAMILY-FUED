let totalTime = 30;

// Get references to the DOM elements
const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");
const progressBar = document.getElementById("progress-bar");
const questionDisplay = document.getElementById("Game-question");
const answerForm = document.getElementById("answer-form");
const resultMessage = document.getElementById("result-message");
const team1ScoreElement = document.getElementById("team1-score");
const team2ScoreElement = document.getElementById("team2-score");
const incorrectImage = document.getElementById("incorrect-image"); // Image for incorrect answers

let currentQuestionIndex = 0;
let countdownInterval; // Store the interval ID
let team1Score = 0;
let team2Score = 0;
let currentTeam = 1; // Track which team is answering
let incorrectAttempts = 0; // Track incorrect attempts per question
let usedAnswers = []; // Array to track used answers
let playerNames = ["Player 1", "Player 2"]; // Array to store player names

// Function to display welcome message and ask for player names
function displayWelcome() {
    // Display a welcome message
    alert("Welcome to the Family Feud-style game!");

    // Prompt for player names
    playerNames[0] = prompt("Enter the name of Player 1:");
    playerNames[1] = prompt("Enter the name of Player 2:");

    // Start the game after names are entered
    startGame();
}

// Function to start the countdown
function startCountdown() {
    clearInterval(countdownInterval); // Clear any previous interval to avoid overlaps
    totalTime = 30; // Reset the timer for each question

    countdownInterval = setInterval(() => {
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;

        // Update the display
        minutesDisplay.textContent = String(minutes).padStart(2, '0');
        secondsDisplay.textContent = String(seconds).padStart(2, '0');

        // Update the progress bar width based on remaining time
        const progressPercentage = ((30 - totalTime) / 30) * 100; // Calculate filled percentage
        progressBar.style.width = progressPercentage + '%'; // Update the progress bar width

        totalTime--;

        // Stop the countdown when time is up
        if (totalTime < 0) {
            clearInterval(countdownInterval);
            alert("Time's up!");
            showResult(""); // Treat as incorrect answer if no submission
        }
    }, 1000); // Update every second
}

// Function to start the game
function startGame() {
    displayQuestion(); // Display the first question
}

// Function to display the current question
function displayQuestion() {
    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        questionDisplay.innerHTML = `<h2>${currentQuestion.question}</h2>`;
        totalTime = 30; // Reset the timer for each question
        startCountdown(); // Start the countdown for the current question
        incorrectAttempts = 0; // Reset incorrect attempts for a new question
        usedAnswers = []; // Reset used answers for a new question
    } else {
        alert("Game Over!"); // End of game
    }
}

// Function to show the result of the user's answer
function showResult(userAnswer) {
    const currentQuestion = questions[currentQuestionIndex];
    let correct = false;

    // Check if the user's answer matches any correct answer
    for (const answerObj of currentQuestion.answers) {
        if (userAnswer.toLowerCase() === answerObj.answer.toLowerCase() && !usedAnswers.includes(userAnswer.toLowerCase())) {
            // Add the answer to usedAnswers
            usedAnswers.push(userAnswer.toLowerCase());
            resultMessage.textContent = `Correct! You scored ${answerObj.points} points!`;
            correct = true;

            // Update the team score
            if (currentTeam === 1) {
                team1Score += answerObj.points; // Team 1 gets points
                team1ScoreElement.textContent = team1Score; // Update score display
                currentTeam = 2; // Switch to Team 2
            } else {
                team2Score += answerObj.points; // Team 2 gets points
                team2ScoreElement.textContent = team2Score; // Update score display
                currentTeam = 1; // Switch back to Team 1
            }
            break; // Exit the loop once the correct answer is found
        }
    }

    // Handle incorrect answers
    if (!correct) {
        incorrectAttempts++; // Increment incorrect attempts count
        resultMessage.textContent = `Incorrect! The correct answer was: ${currentQuestion.answers[0].answer}.`;
        incorrectImage.style.display = "block"; // Display image for incorrect answer
        currentTeam = currentTeam === 1 ? 2 : 1; // Switch teams
    } else {
        incorrectImage.style.display = "none"; // Hide incorrect answer image when correct
    }

    // Check if both teams have made an incorrect attempt
    if (incorrectAttempts >= 2) {
        incorrectAttempts = 0; // Reset incorrect attempts for the next question
        currentQuestionIndex++; // Move to the next question
        setTimeout(displayQuestion, 2000); // Wait 2 seconds before showing next question
    } else {
        // If less than 2 incorrect attempts, allow the current team to answer again
        setTimeout(() => {
            answerForm.reset(); // Reset the form for next attempt
            answerForm.querySelector("#user-answer").focus(); // Focus on answer input
        }, 2000); // Wait for 2 seconds before allowing next answer
    }
}

// Event listener for the answer form submission
answerForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent form submission
    const userAnswer = document.getElementById("user-answer").value; // Get user answer
    clearInterval(countdownInterval); // Stop countdown
    showResult(userAnswer); // Show the result
    answerForm.reset(); // Reset the answer form
});

// Start the game by displaying the welcome message
document.addEventListener("DOMContentLoaded", () => {
    displayWelcome(); // Start the game flow by displaying the welcome message
});

// Array of questions
const questions = [
    {
        question: "Magbigay ng salitang pwedeng pang-describe sa saging?",
        answers: [
            { answer: "Mahaba", points: 43 },
            { answer: "Masarap", points: 10 },
            { answer: "Matamis", points: 9 },
            { answer: "Dilaw", points: 6 },
            { answer: "Malambot", points: 4 },
            { answer: "Kurbado", points: 4 }
        ]
    },
    {
        question: "Mahirap maging (blank).",
        answers: [
            { answer: "Pogi", points: 60 },
            { answer: "Mahirao", points: 17 },
            { answer: "Mabait", points: 4 },
            { answer: "Pangit", points: 4 },
            { answer: "Single", points: 3 }
        ]
    },
    {
        question: "Ano ang karaniwang ginagawa sa dilim?",
        answers: [
            { answer: "Natutulog", points: 21 },
            { answer: "Kiss", points: 16 },
            { answer: "Nangangapa", points: 11 },
            { answer: "Nagtatago", points: 11 },
            { answer: "Nagse-cellphone", points: 7 }
        ]
    },
    {
        question: "Anong mga pambobola ang sinasabi ng lalaki sa babae?",
        answers: [
            { answer: "Ang ganda mo", points: 32 },
            { answer: "Ikaw lang wala na", points: 31 },
            { answer: "Di kita iiwan", points: 5 },
            { answer: "I miss you", points: 5 },
            { answer: "Ang sexy mo", points: 3 }
        ]
    },
    {
        question: "Magbigay ng tunog na nalilikha ng katawan?",
        answers: [
            { answer: "Utot", points: 24 },
            { answer: "Boses", points: 14 },
            { answer: "Sipol", points: 10 },
            { answer: "Hilik", points: 9 },
            { answer: "Palakpak", points: 5 }
        ]
    },
    {
        question: "Sino kinakausap mo pag may problem ka sa lovelife?",
        answers: [
            { answer: "Friend", points: 51 },
            { answer: "Parents", points: 13 },
            { answer: "Kapatid", points: 6 },
            { answer: "Sarili", points: 4 },
            { answer: "Lord", points: 3 }
        ]
    }
    // More questions can be added here...
];
function flipAnswer(index) {
    const answerList = document.querySelectorAll('#answer-board li');
    answerList[index].classList.toggle('flipped'); // Toggle the flip class
}
