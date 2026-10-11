// Game Configuration and Choices
const CHOICES = {
    rock: {
        name: 'Rock',
        emoji: '✊',
        beats: 'scissors',
        verb: 'crushes'
    },
    paper: {
        name: 'Paper',
        emoji: '✋',
        beats: 'rock',
        verb: 'covers'
    },
    scissors: {
        name: 'Scissors',
        emoji: '✌️',
        beats: 'paper',
        verb: 'cuts'
    }
};

const CHOICE_KEYS = Object.keys(CHOICES);

// State
let playerScore = 0;
let computerScore = 0;
let tieScore = 0;
let isAnimating = false;

// DOM Elements
const playerScoreEl = document.getElementById('playerScore');
const computerScoreEl = document.getElementById('computerScore');
const tieScoreEl = document.getElementById('tieScore');
const playerHandEl = document.getElementById('playerHand');
const computerHandEl = document.getElementById('computerHand');
const resultBadgeEl = document.getElementById('resultBadge');
const choiceButtons = document.querySelectorAll('.choice-btn');
const resetBtn = document.getElementById('resetBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIconEl = document.getElementById('themeIcon'); 

// Helper to disable/enable choice buttons during animation
function setButtonsDisabled(disabled) {
    choiceButtons.forEach(btn => {
        btn.disabled = disabled;
    });
}

// Play Round Function
function playRound(playerChoiceKey) {
    if (isAnimating) return;

    isAnimating = true;
    setButtonsDisabled(true);

    // Reset hands to neutral fists for the shake animation
    playerHandEl.textContent = '✊';
    computerHandEl.textContent = '✊';

    // Add shaking animation classes
    playerHandEl.classList.add('animating-player');
    computerHandEl.classList.add('animating-computer');

    // Update announcement banner during shake
    resultBadgeEl.className = 'result-badge default';
    resultBadgeEl.textContent = 'Rock... Paper... Scissors...';

    // 900ms countdown/shake duration before reveal
    setTimeout(() => {
        // Remove shaking classes
        playerHandEl.classList.remove('animating-player');
        computerHandEl.classList.remove('animating-computer');

        // Determine Computer Choice
        const randomIndex = Math.floor(Math.random() * CHOICE_KEYS.length);
        const computerChoiceKey = CHOICE_KEYS[randomIndex];

        const player = CHOICES[playerChoiceKey];
        const computer = CHOICES[computerChoiceKey];

        // Reveal chosen emojis
        playerHandEl.textContent = player.emoji;
        computerHandEl.textContent = computer.emoji;

        // Determine winner
        if (playerChoiceKey === computerChoiceKey) {
            tieScore++;
            tieScoreEl.textContent = tieScore;
            resultBadgeEl.className = 'result-badge tie';
            resultBadgeEl.textContent = `It's a Tie! Both chose ${player.name} 🤝`;
        } else if (player.beats === computerChoiceKey) {
            playerScore++;
            playerScoreEl.textContent = playerScore;
            resultBadgeEl.className = 'result-badge win';
            resultBadgeEl.textContent = `You Win! ${player.name} ${player.verb} ${computer.name}! 🎉`;
        } else {
            computerScore++;
            computerScoreEl.textContent = computerScore;
            resultBadgeEl.className = 'result-badge lose';
            resultBadgeEl.textContent = `Computer Wins! ${computer.name} ${computer.verb} ${player.name}! 🤖`;
        }

        isAnimating = false;
        setButtonsDisabled(false);
    }, 900);
}

// Reset Game Function
function resetGame() {
    if (isAnimating) return;

    playerScore = 0;
    computerScore = 0;
    tieScore = 0;

    playerScoreEl.textContent = '0';
    computerScoreEl.textContent = '0';
    tieScoreEl.textContent = '0';

    playerHandEl.textContent = '✊';
    computerHandEl.textContent = '✊';

    resultBadgeEl.className = 'result-badge default';
    resultBadgeEl.textContent = 'Choose your weapon to start!';
}

// Theme Toggle Management
function applyTheme(theme) {
     if (theme === 'light') {
         document.documentElement.setAttribute('data-theme', 'light');
         if (themeIconEl) themeIconEl.textContent = '🌙';
          if (themeToggleBtn) themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
          } else {
             document.documentElement.removeAttribute('data-theme');
        if (themeIconEl) themeIconEl.textContent = '☀️';
        if (themeToggleBtn) themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        applyTheme('light');
    } else {
        applyTheme('dark');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    try {
        localStorage.setItem('theme', newTheme);
    } catch (e) {
        // localStorage might be unavailable in certain sandbox environments
    }
}

// Event Listeners
choiceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const choice = btn.getAttribute('data-choice');
        playRound(choice);
    });
});

resetBtn.addEventListener('click', resetGame);

if (themeToggleBtn) {
       themeToggleBtn.addEventListener('click', toggleTheme);
}

// Initialize theme on load
initTheme();
