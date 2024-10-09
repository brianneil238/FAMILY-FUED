// Save player scores when the game ends
function endGame() {
    const player1Name = $('#player1Name').val();
    const player2Name = $('#player2Name').val();
    
    const player1Score = currentScores[0];
    const player2Score = currentScores[1];

    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    // Add players' scores to the leaderboard
    leaderboard.push({ name: player1Name, score: player1Score });
    leaderboard.push({ name: player2Name, score: player2Score });

    // Sort leaderboard by score in descending order
    leaderboard.sort((a, b) => b.score - a.score);

    // Save updated leaderboard back to localStorage
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    // Navigate to the leaderboard page
    window.location.href = 'leaderboard.html';
}

// Call endGame function when the game is over
// This could be inside an if condition in your startRound function or where you handle the game completion
if (currentQuestionIndex >= questions.length) {
    alert("Game Over!");
    endGame();
}
// leaderboard.js

function loadLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    
    const tbody = document.querySelector('#leaderboardTable tbody');
    tbody.innerHTML = ''; // Clear any existing content

    leaderboard.forEach((player, index) => {
        // Create a new row for each player
        const row = document.createElement('tr');

        const rankCell = document.createElement('td');
        rankCell.textContent = index + 1;

        const nameCell = document.createElement('td');
        nameCell.textContent = player.name;

        const scoreCell = document.createElement('td');
        scoreCell.textContent = player.score;

        // Append the cells to the row
        row.appendChild(rankCell);
        row.appendChild(nameCell);
        row.appendChild(scoreCell);

        // Append the row to the table body
        tbody.appendChild(row);
    });
}

// Call loadLeaderboard when the page loads
window.onload = loadLeaderboard;

// Clear leaderboard
function resetLeaderboard() {
    localStorage.removeItem('leaderboard');
    loadLeaderboard(); // Reload to reflect empty leaderboard
}

document.getElementById('resetLeaderboardButton').addEventListener('click', resetLeaderboard);

