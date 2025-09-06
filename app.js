class SagaRise {
  constructor() {
    console.log('SagaRise initializing...');
    
    this.currentScreen = 'welcomeScreen';
    this.currentGame = null;
    this.currentUser = null;
    this.selectedAvatar = '🧠';
    this.soundEnabled = true;
    this.lives = 3;
    
    // Application data from JSON
    this.appData = {
      avatars: ["🧠", "🎯", "⚡", "🚀", "💎", "👑", "🦾", "🤖", "🌟", "🔥", "🎮", "🏆", "💪", "🔮", "⭐"],
      levels: [
        {"level": 1, "title": "Novice", "xpRequired": 0},
        {"level": 2, "title": "Learner", "xpRequired": 100},
        {"level": 3, "title": "Thinker", "xpRequired": 300},
        {"level": 4, "title": "Strategist", "xpRequired": 600},
        {"level": 5, "title": "Genius", "xpRequired": 1000},
        {"level": 6, "title": "Master", "xpRequired": 2000}
      ],
      achievements: [
        {"id": 1, "name": "Welcome", "desc": "Join SagaRise", "xp": 10, "icon": "🎯"},
        {"id": 2, "name": "First Game", "desc": "Play your first game", "xp": 15, "icon": "🎮"},
        {"id": 3, "name": "Memory Master", "desc": "Score 100+ in Memory", "xp": 25, "icon": "🧠"},
        {"id": 4, "name": "Speed Demon", "desc": "Score 200+ in Reflex", "xp": 25, "icon": "⚡"},
        {"id": 5, "name": "Logic King", "desc": "Score 150+ in Logic", "xp": 25, "icon": "🧩"}
      ],
      brainEfficiencyFormula: {
        memoryWeight: 3,
        reflexWeight: 5,
        logicWeight: 4,
        achievementBonus: 2,
        maxValue: 100,
        startValue: 0
      }
    };

    // ... your existing code continues here ...
    
    // Load saved data
    this.loadUserData();

    this.init();
  }

  // ... All your existing methods like attachAllListeners, handleSignup, handleLogin, etc. ...

  async saveUserProgress() {
    if (!this.currentUser) {
      console.warn('No user logged in, skipping save');
      return;
    }
    try {
      const res = await fetch('/api/save-xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.currentUser.username,
          xp: this.currentUser.totalXP,
          level: this.currentUser.level,
          achievements: this.currentUser.unlockedAchievements,
        }),
      });
      const data = await res.json();
      console.log('Progress saved', data);
    } catch (err) {
      console.error('Failed to save progress', err);
    }
  }

  async loadUserProgress() {
    if (!this.currentUser) {
      console.warn('No user logged in, skipping load');
      return;
    }
    try {
      const res = await fetch(`/api/get-xp?userId=${encodeURIComponent(this.currentUser.username)}`);
      const data = await res.json();
      if (data) {
        this.currentUser.totalXP = data.xp || 0;
        this.currentUser.level = data.level || 1;
        this.currentUser.unlockedAchievements = data.achievements || [];
        this.updateUserProfile();
        this.updateStats();
        this.updateAchievements();
        this.updateBrainEfficiency();
        console.log('Progress loaded', data);
      }
    } catch (err) {
      console.error('Failed to load progress', err);
    }
  }

  loadExistingUser(authUser) {
    // Load saved user data from localStorage
    const savedData = localStorage.getItem(`sagaRiseUserData_${authUser.email || authUser.username}`);
    if (savedData) {
      this.currentUser = JSON.parse(savedData);
      console.log('Loaded existing user data:', this.currentUser);
    } else {
      this.createUserProfile(authUser.username, authUser.email, authUser.isGuest);
    }
    this.updateUserProfile();
    this.updateStats();
    this.updateLeaderboard();
    this.updateAchievements();
    this.updateBrainEfficiency();

    // Load from Neon DB after local load
    this.loadUserProgress();

    this.showMainSection('games');
  }

  endGame(finalScore) {
    console.log('Game ended with final score:', finalScore);
    if (this.currentUser) {
      this.currentUser.gamesPlayed++;
      this.currentUser.totalScore += finalScore;

      if (finalScore > this.currentUser.bestScores[this.currentGame]) {
        this.currentUser.bestScores[this.currentGame] = finalScore;
      }

      let xpMultiplier = 1.0;
      if (this.currentGame === 'memory') xpMultiplier = 1.2;
      else if (this.currentGame === 'logic') xpMultiplier = 1.5;

      const xpEarned = Math.floor(finalScore * 0.12 * xpMultiplier);
      this.currentUser.totalXP += xpEarned;

      this.checkAchievements(this.currentGame, finalScore);
      this.updateUserProfile();
      this.saveUserData();

      this.saveUserProgress();  // Save to Neon DB here

      const xpEarnedEl = document.getElementById('xpEarned');
      if (xpEarnedEl) xpEarnedEl.textContent = `+${xpEarned} XP`;

      // Calculate brain efficiency improvement
      const oldEfficiency = this.calculateBrainEfficiency();
      this.updateBrainEfficiency();
      const newEfficiency = this.calculateBrainEfficiency();

      const efficiencyUpdate = document.getElementById('efficiencyUpdate');
      if (efficiencyUpdate && newEfficiency > oldEfficiency) {
        efficiencyUpdate.textContent = `Brain Efficiency: ${oldEfficiency}% → ${newEfficiency}%`;
      }
    }

    const gameOverTitle = document.getElementById('gameOverTitle');
    if (gameOverTitle) {
      const gameData = this.gameData[this.currentGame];
      if (gameData.lives && gameData.lives <= 0) {
        gameOverTitle.textContent = 'Game Over!';
      } else {
        gameOverTitle.textContent = 'Level Complete!';
      }
    }

    const finalScoreEl = document.getElementById('finalScore');
    if (finalScoreEl) finalScoreEl.textContent = finalScore;

    let message = "Well done!";
    if (finalScore >= 300) message = "Outstanding performance!";
    else if (finalScore >= 200) message = "Excellent work!";
    else if (finalScore >= 100) message = "Great job!";
    else if (finalScore >= 50) message = "Good effort!";

    const scoreMessageEl = document.getElementById('scoreMessage');
    if (scoreMessageEl) scoreMessageEl.textContent = message;

    this.showScreen('gameOver');
  }

  // Other existing methods unchanged ...
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing SagaRise...');
  window.sagaRise = new SagaRise();
});
