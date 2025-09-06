
// js/game.js
// Global variables
let gameStorage;
let gameState = {
    xp: 0,
    level: 1,
    achievements: [],
    isDirty: false
};

// Initialize game and storage
async function initGame() {
    try {
        gameStorage = new GameStorage();
        await gameStorage.init();
        console.log('Game storage initialized');

        // Load existing user data
        const userData = await gameStorage.getUserXP();
        if (userData) {
            gameState.xp = userData.xp || 0;
            gameState.level = userData.level || 1;
            gameState.achievements = userData.achievements || [];
            updateGameUI(userData);
        }
    } catch (error) {
        console.error('Failed to initialize storage:', error);
        // Continue with default values
    }

    // Start auto-save
    startAutoSave();
}

// Update UI with current game state
function updateGameUI(userData) {
    document.getElementById('xp-value').textContent = userData.xp || gameState.xp;
    document.getElementById('level-value').textContent = userData.level || gameState.level;
}

// Save progress function
async function saveCurrentProgress() {
    try {
        await gameStorage.saveUserXP('defaultUser', {
            xp: gameState.xp,
            level: gameState.level,
            achievements: gameState.achievements
        });
        console.log('Progress saved successfully');
        gameState.isDirty = false;
    } catch (error) {
        console.error('Failed to save progress:', error);
    }
}

// Function to add XP (call this when user earns points)
function addXP(points) {
    gameState.xp += points;
    gameState.isDirty = true;

    // Update UI
    document.getElementById('xp-value').textContent = gameState.xp;

    // Check for level up
    checkLevelUp();

    // Auto-save for important milestones
    if (gameState.xp % 100 === 0) {
        saveCurrentProgress();
    }
}

// Level up logic
function checkLevelUp() {
    const newLevel = Math.floor(gameState.xp / 1000) + 1;
    if (newLevel > gameState.level) {
        gameState.level = newLevel;
        document.getElementById('level-value').textContent = gameState.level;
        saveCurrentProgress(); // Save immediately on level up
    }
}

// Auto-save functionality
function startAutoSave() {
    setInterval(async () => {
        if (gameState.isDirty) {
            await saveCurrentProgress();
        }
    }, 30000); // Save every 30 seconds
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', initGame);

// Your existing game logic goes here...
// Example: button click handlers, game mechanics, etc.
