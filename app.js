// SagaRise Brain Training App Logic

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
        
        // Game data
        this.gameData = {
            memory: {
                sequence: [],
                playerSequence: [],
                level: 1,
                score: 0,
                lives: 3,
                isShowingSequence: false,
                sequenceIndex: 0
            },
            reflex: {
                score: 0,
                timeLeft: 30,
                lives: 3,
                gameActive: false,
                currentTarget: null,
                timer: null
            },
            logic: {
                level: 1,
                score: 0,
                lives: 3,
                currentSequence: [],
                currentAnswer: 0,
                sequences: [
                    { pattern: [2, 4, 6, '?', 10], answer: 8 },
                    { pattern: [1, 3, 5, '?', 9], answer: 7 },
                    { pattern: [5, 10, 15, '?', 25], answer: 20 },
                    { pattern: [1, 4, 9, '?', 25], answer: 16 },
                    { pattern: [3, 6, 9, '?', 15], answer: 12 },
                    { pattern: [10, 20, 30, '?', 50], answer: 40 },
                    { pattern: [2, 6, 18, '?', 162], answer: 54 },
                    { pattern: [1, 1, 2, 3, '?'], answer: 5 },
                    { pattern: [100, 50, 25, '?', 6], answer: 12 },
                    { pattern: [7, 14, 28, '?', 112], answer: 56 }
                ]
            }
        };
        
        this.colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];
        
        // Simulated leaderboard data
        this.leaderboardData = [
            { name: "Alex", avatar: "🚀", level: 5, score: 2450 },
            { name: "Sam", avatar: "🧠", level: 4, score: 2100 },
            { name: "Jordan", avatar: "⚡", level: 4, score: 1890 },
            { name: "Casey", avatar: "💎", level: 3, score: 1650 },
            { name: "Riley", avatar: "🌟", level: 3, score: 1420 }
        ];
        
        // Load saved data
        this.loadUserData();
        
        this.init();
    }
    
    init() {
        console.log('Setting up event listeners...');
        this.attachAllListeners();
        this.showScreen('welcomeScreen');
        console.log('Initialization complete');
    }
    
    attachAllListeners() {
        console.log('Attaching all event listeners...');
        
        // Wait for DOM to be fully ready
        setTimeout(() => {
            // Welcome screen buttons
            this.addClickListener('signupBtn', () => {
                console.log('Signup button clicked');
                this.showScreen('signupScreen');
            });
            
            this.addClickListener('guestBtn', () => {
                console.log('Guest button clicked');
                this.showScreen('guestScreen');
            });
            
            this.addClickListener('loginBtn', () => {
                console.log('Login button clicked');
                this.showScreen('loginScreen');
            });
            
            // Auth screen back buttons
            this.addClickListener('signupBackBtn', () => {
                console.log('Signup back button clicked');
                this.showScreen('welcomeScreen');
            });
            
            this.addClickListener('loginBackBtn', () => {
                console.log('Login back button clicked');
                this.showScreen('welcomeScreen');
            });
            
            this.addClickListener('guestBackBtn', () => {
                console.log('Guest back button clicked');
                this.showScreen('welcomeScreen');
            });
            
            // Auth form submissions
            const signupForm = document.getElementById('signupForm');
            if (signupForm) {
                signupForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    console.log('Signup form submitted');
                    this.handleSignup();
                });
            }
            
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    console.log('Login form submitted');
                    this.handleLogin();
                });
            }
            
            const guestForm = document.getElementById('guestForm');
            if (guestForm) {
                guestForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    console.log('Guest form submitted');
                    this.handleGuestAccount();
                });
            }
            
            // Auth switches
            this.addClickListener('switchToLogin', (e) => {
                e.preventDefault();
                console.log('Switch to login clicked');
                this.showScreen('loginScreen');
            });
            
            this.addClickListener('switchToSignup', (e) => {
                e.preventDefault();
                console.log('Switch to signup clicked');
                this.showScreen('signupScreen');
            });
            
            // Avatar selection
            this.addClickListener('selectAvatarBtn', () => {
                console.log('Select avatar button clicked');
                this.completeAvatarSelection();
            });
            
            document.querySelectorAll('.avatar-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    const avatar = e.target.dataset.avatar;
                    console.log('Avatar selected:', avatar);
                    this.selectAvatar(avatar);
                });
            });
            
            // Navigation tabs
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.addEventListener('click', (e) => {
                    const section = e.target.dataset.section;
                    console.log('Navigation tab clicked:', section);
                    this.showMainSection(section);
                });
            });
            
            // Game mode buttons
            document.querySelectorAll('.mode-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const mode = btn.dataset.mode;
                    console.log('Game mode selected:', mode);
                    this.startGame(mode);
                });
            });
            
            // Main menu controls
            this.addClickListener('logoutBtn', () => {
                console.log('Logout clicked');
                this.logout();
            });
            
            // Game back buttons
            this.addClickListener('memoryBack', () => this.showScreen('mainMenu'));
            this.addClickListener('reflexBack', () => this.showScreen('mainMenu'));
            this.addClickListener('logicBack', () => this.showScreen('mainMenu'));
            
            // Game restart buttons
            this.addClickListener('memoryRestart', () => this.startGame('memory'));
            this.addClickListener('reflexRestart', () => this.startGame('reflex'));
            this.addClickListener('logicRestart', () => this.startGame('logic'));
            
            // Sound toggles
            this.addClickListener('memorySoundToggle', () => this.toggleSound('memorySoundToggle'));
            this.addClickListener('reflexSoundToggle', () => this.toggleSound('reflexSoundToggle'));
            this.addClickListener('logicSoundToggle', () => this.toggleSound('logicSoundToggle'));
            
            // Game over buttons
            this.addClickListener('playAgain', () => this.startGame(this.currentGame));
            this.addClickListener('backToMenu', () => this.showScreen('mainMenu'));
            
            // Logic game
            this.addClickListener('submitAnswer', () => this.checkLogicAnswer());
            
            const answerInput = document.getElementById('answerInput');
            if (answerInput) {
                answerInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.checkLogicAnswer();
                });
            }
            
            // Reflex game color buttons
            document.querySelectorAll('.color-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const color = btn.dataset.color;
                    this.handleColorClick(color);
                });
            });
            
            console.log('All event listeners attached successfully');
        }, 100);
    }
    
    addClickListener(elementId, handler) {
        const element = document.getElementById(elementId);
        if (element) {
            // Remove any existing listeners
            element.onclick = null;
            
            // Add click listener
            element.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                handler(e);
            });
            
            // Also add touch support for mobile
            element.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                handler(e);
            });
            
            console.log(`Added click listener to ${elementId}`);
        } else {
            console.warn(`Element with id '${elementId}' not found`);
        }
    }
    
    // Authentication methods
    handleSignup() {
        console.log('Handling signup...');
        
        const emailEl = document.getElementById('signupEmail');
        const usernameEl = document.getElementById('signupUsername');
        const passwordEl = document.getElementById('signupPassword');
        
        if (!emailEl || !usernameEl || !passwordEl) {
            console.error('Signup form elements not found');
            return;
        }
        
        const email = emailEl.value.trim();
        const username = usernameEl.value.trim();
        const password = passwordEl.value;
        
        console.log('Signup data:', { email, username, password: password ? '[PROVIDED]' : '[EMPTY]' });
        
        // Clear previous errors
        this.clearErrors(['emailError', 'usernameError', 'passwordError']);
        
        let hasError = false;
        
        // Validate email
        if (!email) {
            this.showError('emailError', 'Email is required');
            hasError = true;
        } else if (!this.isValidEmail(email)) {
            this.showError('emailError', 'Please enter a valid email');
            hasError = true;
        }
        
        // Validate username
        if (!username) {
            this.showError('usernameError', 'Username is required');
            hasError = true;
        } else if (username.length < 3) {
            this.showError('usernameError', 'Username must be at least 3 characters');
            hasError = true;
        }
        
        // Validate password
        if (!password) {
            this.showError('passwordError', 'Password is required');
            hasError = true;
        } else if (password.length < 6) {
            this.showError('passwordError', 'Password must be at least 6 characters');
            hasError = true;
        }
        
        if (hasError) {
            console.log('Validation errors found, stopping signup');
            return;
        }
        
        // Check if user already exists
        const existingUsers = this.getStoredUsers();
        if (existingUsers[email]) {
            this.showError('emailError', 'An account with this email already exists');
            return;
        }
        
        // Save user account
        existingUsers[email] = {
            email: email,
            username: username,
            password: password, // In real app, this would be hashed
            isGuest: false
        };
        localStorage.setItem('sagaRiseUsers', JSON.stringify(existingUsers));
        
        // Create user profile
        this.createUserProfile(username, email, false);
        console.log('Signup successful, moving to avatar selection');
        this.showScreen('avatarScreen');
    }
    
    handleLogin() {
        console.log('Handling login...');
        
        const emailEl = document.getElementById('loginEmail');
        const passwordEl = document.getElementById('loginPassword');
        
        if (!emailEl || !passwordEl) {
            console.error('Login form elements not found');
            return;
        }
        
        const email = emailEl.value.trim();
        const password = passwordEl.value;
        
        // Clear previous errors
        this.clearErrors(['loginEmailError', 'loginPasswordError']);
        
        let hasError = false;
        
        if (!email) {
            this.showError('loginEmailError', 'Email is required');
            hasError = true;
        }
        
        if (!password) {
            this.showError('loginPasswordError', 'Password is required');
            hasError = true;
        }
        
        if (hasError) return;
        
        // Check credentials
        const existingUsers = this.getStoredUsers();
        const user = existingUsers[email];
        
        if (!user || user.password !== password) {
            this.showError('loginPasswordError', 'Invalid email or password');
            return;
        }
        
        // Load existing user data
        this.loadExistingUser(user);
        this.showScreen('mainMenu');
    }
    
    handleGuestAccount() {
        console.log('Creating guest account...');
        
        const usernameEl = document.getElementById('guestUsername');
        if (!usernameEl) {
            console.error('Guest username element not found');
            return;
        }
        
        const username = usernameEl.value.trim();
        
        this.clearErrors(['guestUsernameError']);
        
        if (!username) {
            this.showError('guestUsernameError', 'Username is required');
            return;
        }
        
        if (username.length < 3) {
            this.showError('guestUsernameError', 'Username must be at least 3 characters');
            return;
        }
        
        this.createUserProfile(username, null, true);
        this.showScreen('avatarScreen');
    }
    
    createUserProfile(username, email, isGuest) {
        this.currentUser = {
            username: username,
            email: email,
            isGuest: isGuest,
            avatar: this.selectedAvatar,
            totalScore: 0,
            totalXP: 0,
            level: 1,
            gamesPlayed: 0,
            bestScores: {
                memory: 0,
                reflex: 0,
                logic: 0
            },
            unlockedAchievements: [1], // Welcome achievement
            createdAt: Date.now()
        };
        
        // Add welcome XP
        this.currentUser.totalXP += 10;
        
        console.log('User profile created:', this.currentUser);
    }
    
    selectAvatar(avatarEmoji) {
        this.selectedAvatar = avatarEmoji;
        
        document.querySelectorAll('.avatar-option').forEach(option => {
            option.classList.remove('active');
        });
        
        const selectedOption = document.querySelector(`[data-avatar="${avatarEmoji}"]`);
        if (selectedOption) {
            selectedOption.classList.add('active');
        }
    }
    
    completeAvatarSelection() {
        if (this.currentUser) {
            this.currentUser.avatar = this.selectedAvatar;
            this.saveUserData();
            this.updateUserProfile();
            this.updateStats();
            this.updateLeaderboard();
            this.updateAchievements();
            this.updateBrainEfficiency();
            this.showMainSection('games');
            this.showScreen('mainMenu');
        }
    }
    
    loadExistingUser(authUser) {
        // Load saved user data from localStorage
        const savedData = localStorage.getItem(`sagaRiseUserData_${authUser.email || authUser.username}`);
        
        if (savedData) {
            this.currentUser = JSON.parse(savedData);
            console.log('Loaded existing user data:', this.currentUser);
        } else {
            // Create new profile for existing auth user
            this.createUserProfile(authUser.username, authUser.email, authUser.isGuest);
        }
        
        this.updateUserProfile();
        this.updateStats();
        this.updateLeaderboard();
        this.updateAchievements();
        this.updateBrainEfficiency();
        this.showMainSection('games');
    }
    
    // Validation helpers
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
        
        // Also highlight the input field
        const inputId = elementId.replace('Error', '');
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
            inputElement.classList.add('error');
            setTimeout(() => inputElement.classList.remove('error'), 3000);
        }
    }
    
    clearErrors(errorIds) {
        errorIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = '';
        });
    }
    
    getStoredUsers() {
        const stored = localStorage.getItem('sagaRiseUsers');
        return stored ? JSON.parse(stored) : {};
    }
    
    // Data persistence
    saveUserData() {
        if (this.currentUser) {
            const key = `sagaRiseUserData_${this.currentUser.email || this.currentUser.username}`;
            localStorage.setItem(key, JSON.stringify(this.currentUser));
            console.log('User data saved');
        }
    }
    
    loadUserData() {
        // This will be called when loading existing users
        console.log('User data loading handled in loadExistingUser method');
    }
    
    // Brain efficiency calculation
    calculateBrainEfficiency() {
        if (!this.currentUser) return 0;
        
        const formula = this.appData.brainEfficiencyFormula;
        const scores = this.currentUser.bestScores;
        
        // Calculate points from each game type
        const memoryPoints = Math.min(33, Math.floor(scores.memory / formula.memoryWeight));
        const reflexPoints = Math.min(40, Math.floor(scores.reflex / formula.reflexWeight));
        const logicPoints = Math.min(25, Math.floor(scores.logic / formula.logicWeight));
        
        // Add achievement bonus
        const achievementPoints = this.currentUser.unlockedAchievements.length * formula.achievementBonus;
        
        // Calculate total efficiency
        const totalPoints = memoryPoints + reflexPoints + logicPoints + achievementPoints;
        return Math.min(formula.maxValue, totalPoints);
    }
    
    updateBrainEfficiency() {
        const efficiency = this.calculateBrainEfficiency();
        
        const efficiencyScore = document.getElementById('efficiencyScore');
        const efficiencyFill = document.getElementById('efficiencyFill');
        
        if (efficiencyScore) {
            efficiencyScore.textContent = efficiency;
        }
        
        if (efficiencyFill) {
            efficiencyFill.style.background = `conic-gradient(from -90deg, #00d4ff ${efficiency}%, transparent ${efficiency}%)`;
        }
        
        console.log('Brain efficiency updated to:', efficiency + '%');
    }
    
    updateUserProfile() {
        if (!this.currentUser) return;
        
        const userAvatar = document.getElementById('userAvatar');
        const username = document.getElementById('username');
        const userLevel = document.getElementById('userLevel');
        const totalScoreHeader = document.getElementById('totalScoreHeader');
        const livesCount = document.getElementById('livesCount');
        
        if (userAvatar) userAvatar.textContent = this.currentUser.avatar;
        if (username) username.textContent = this.currentUser.username;
        if (totalScoreHeader) totalScoreHeader.textContent = `Score: ${this.currentUser.totalScore}`;
        if (livesCount) livesCount.textContent = this.lives;
        
        if (userLevel) {
            const levelInfo = this.appData.levels.find(l => l.level === this.currentUser.level) || this.appData.levels[0];
            userLevel.textContent = `Level ${this.currentUser.level} • ${this.currentUser.totalXP} XP`;
        }
        
        // Update best scores
        const memoryBest = document.getElementById('memoryBest');
        const reflexBest = document.getElementById('reflexBest');
        const logicBest = document.getElementById('logicBest');
        
        if (memoryBest) memoryBest.textContent = `Best: ${this.currentUser.bestScores.memory}`;
        if (reflexBest) reflexBest.textContent = `Best: ${this.currentUser.bestScores.reflex}`;
        if (logicBest) logicBest.textContent = `Best: ${this.currentUser.bestScores.logic}`;
    }
    
    showMainSection(sectionName) {
        // Update nav tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        const activeTab = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        // Update content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(`${sectionName}Section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Update section-specific data
        if (sectionName === 'leaderboard') {
            this.updateLeaderboard();
        } else if (sectionName === 'stats') {
            this.updateStats();
            this.updateAchievements();
        }
    }
    
    updateStats() {
        if (!this.currentUser) return;
        
        const totalScore = document.getElementById('totalScore');
        const totalXP = document.getElementById('totalXP');
        const gamesPlayed = document.getElementById('gamesPlayed');
        const achievementsCount = document.getElementById('achievementsCount');
        
        if (totalScore) totalScore.textContent = this.currentUser.totalScore;
        if (totalXP) totalXP.textContent = this.currentUser.totalXP;
        if (gamesPlayed) gamesPlayed.textContent = this.currentUser.gamesPlayed;
        if (achievementsCount) achievementsCount.textContent = this.currentUser.unlockedAchievements.length;
    }
    
    updateLeaderboard() {
        const leaderboardList = document.getElementById('leaderboardList');
        if (!leaderboardList) return;
        
        let leaderboard = [...this.leaderboardData];
        if (this.currentUser && this.currentUser.totalScore > 0) {
            leaderboard.push({
                name: this.currentUser.username,
                avatar: this.currentUser.avatar,
                level: this.currentUser.level,
                score: this.currentUser.totalScore
            });
        }
        
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 10);
        
        leaderboardList.innerHTML = '';
        leaderboard.forEach((entry, index) => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'leaderboard-entry';
            entryDiv.innerHTML = `
                <div class="leaderboard-rank">#${index + 1}</div>
                <div class="leaderboard-avatar">${entry.avatar}</div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${entry.name}</div>
                    <div class="leaderboard-level">Level ${entry.level}</div>
                </div>
                <div class="leaderboard-score">${entry.score}</div>
            `;
            leaderboardList.appendChild(entryDiv);
        });
    }
    
    updateAchievements() {
        if (!this.currentUser) return;
        
        const achievementsList = document.getElementById('achievementsList');
        if (!achievementsList) return;
        
        achievementsList.innerHTML = '';
        this.appData.achievements.forEach(achievement => {
            const isUnlocked = this.currentUser.unlockedAchievements.includes(achievement.id);
            const achievementDiv = document.createElement('div');
            achievementDiv.className = `achievement ${isUnlocked ? 'unlocked' : ''}`;
            achievementDiv.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.desc}</div>
                </div>
                <div class="achievement-xp">+${achievement.xp} XP</div>
            `;
            achievementsList.appendChild(achievementDiv);
        });
    }
    
    checkAchievements(gameType, score) {
        if (!this.currentUser) return [];
        
        let newAchievements = [];
        
        // First Game achievement
        if (!this.currentUser.unlockedAchievements.includes(2)) {
            this.currentUser.unlockedAchievements.push(2);
            newAchievements.push(this.appData.achievements[1]);
        }
        
        // Game-specific achievements
        if (gameType === 'memory' && score >= 100 && !this.currentUser.unlockedAchievements.includes(3)) {
            this.currentUser.unlockedAchievements.push(3);
            newAchievements.push(this.appData.achievements[2]);
        }
        
        if (gameType === 'reflex' && score >= 200 && !this.currentUser.unlockedAchievements.includes(4)) {
            this.currentUser.unlockedAchievements.push(4);
            newAchievements.push(this.appData.achievements[3]);
        }
        
        if (gameType === 'logic' && score >= 150 && !this.currentUser.unlockedAchievements.includes(5)) {
            this.currentUser.unlockedAchievements.push(5);
            newAchievements.push(this.appData.achievements[4]);
        }
        
        // Add XP for new achievements
        newAchievements.forEach(achievement => {
            this.currentUser.totalXP += achievement.xp;
        });
        
        // Level up check
        this.checkLevelUp();
        
        return newAchievements;
    }
    
    checkLevelUp() {
        if (!this.currentUser) return;
        
        const nextLevelData = this.appData.levels.find(l => l.level === this.currentUser.level + 1);
        
        if (nextLevelData && this.currentUser.totalXP >= nextLevelData.xpRequired) {
            this.currentUser.level++;
            console.log('Level up! New level:', this.currentUser.level);
            this.playSound('levelUp');
        }
    }
    
    logout() {
        this.saveUserData();
        this.currentUser = null;
        this.lives = 3;
        this.showScreen('welcomeScreen');
    }
    
    showScreen(screenId) {
        console.log('Showing screen:', screenId);
        
        // Clear any running timers
        if (this.gameData.reflex.timer) {
            clearInterval(this.gameData.reflex.timer);
            this.gameData.reflex.timer = null;
        }
        
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
            console.log('Successfully switched to screen:', screenId);
        } else {
            console.error('Screen not found:', screenId);
        }
    }
    
    toggleSound(buttonId) {
        this.soundEnabled = !this.soundEnabled;
        const button = document.getElementById(buttonId);
        if (button) {
            button.textContent = this.soundEnabled ? '🔊' : '🔇';
            button.classList.toggle('muted', !this.soundEnabled);
        }
    }
    
    playSound(type) {
        if (!this.soundEnabled) return;
        
        // Create simple audio feedback with Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            switch (type) {
                case 'correct':
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                    break;
                case 'wrong':
                    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                    break;
                case 'levelUp':
                    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                    break;
                default:
                    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
            }
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            console.log('Audio not supported');
        }
    }
    
    // Game implementations start here
    startGame(gameType) {
        this.currentGame = gameType;
        
        // Reset lives for the game
        this.gameData[gameType].lives = this.lives;
        
        switch (gameType) {
            case 'memory':
                this.startMemoryGame();
                break;
            case 'reflex':
                this.startReflexGame();
                break;
            case 'logic':
                this.startLogicGame();
                break;
        }
    }
    
    // Memory Game
    startMemoryGame() {
        this.showScreen('memoryGame');
        
        this.gameData.memory = {
            sequence: [],
            playerSequence: [],
            level: 1,
            score: 0,
            lives: this.lives,
            isShowingSequence: false,
            sequenceIndex: 0
        };
        
        this.setupMemoryGrid();
        this.updateMemoryStats();
        
        setTimeout(() => {
            this.generateMemorySequence();
        }, 1000);
    }
    
    setupMemoryGrid() {
        const grid = document.getElementById('memoryGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'memory-cell';
            cell.dataset.index = i;
            cell.addEventListener('click', () => this.handleMemoryClick(i));
            grid.appendChild(cell);
        }
    }
    
    generateMemorySequence() {
        const memory = this.gameData.memory;
        const sequenceLength = Math.min(2 + memory.level, 7);
        
        memory.sequence = [];
        for (let i = 0; i < sequenceLength; i++) {
            memory.sequence.push(Math.floor(Math.random() * 9));
        }
        
        this.showMemorySequence();
    }
    
    showMemorySequence() {
        const memory = this.gameData.memory;
        memory.isShowingSequence = true;
        memory.playerSequence = [];
        memory.sequenceIndex = 0;
        
        const statusEl = document.getElementById('memoryStatus');
        if (statusEl) statusEl.textContent = 'Watch the sequence...';
        
        const cells = document.querySelectorAll('.memory-cell');
        cells.forEach(cell => {
            cell.classList.remove('active', 'correct', 'wrong');
        });
        
        let delay = 0;
        memory.sequence.forEach((cellIndex, i) => {
            setTimeout(() => {
                if (cells[cellIndex]) {
                    cells[cellIndex].classList.add('active');
                    setTimeout(() => {
                        cells[cellIndex].classList.remove('active');
                        if (i === memory.sequence.length - 1) {
                            setTimeout(() => {
                                memory.isShowingSequence = false;
                                if (statusEl) statusEl.textContent = 'Repeat the sequence!';
                            }, 500);
                        }
                    }, 600);
                }
            }, delay);
            delay += 800;
        });
    }
    
    handleMemoryClick(cellIndex) {
        const memory = this.gameData.memory;
        
        if (memory.isShowingSequence) return;
        
        const cells = document.querySelectorAll('.memory-cell');
        const cell = cells[cellIndex];
        
        memory.playerSequence.push(cellIndex);
        
        if (cellIndex === memory.sequence[memory.sequenceIndex]) {
            cell.classList.add('correct');
            memory.sequenceIndex++;
            this.playSound('correct');
            
            if (memory.sequenceIndex === memory.sequence.length) {
                memory.score += memory.level * 15;
                memory.level++;
                
                const statusEl = document.getElementById('memoryStatus');
                if (statusEl) statusEl.textContent = 'Perfect! Next level...';
                
                setTimeout(() => {
                    this.updateMemoryStats();
                    if (memory.level <= 10) {
                        this.generateMemorySequence();
                    } else {
                        this.endGame(memory.score);
                    }
                }, 1500);
            }
        } else {
            cell.classList.add('wrong');
            memory.lives--;
            this.playSound('wrong');
            
            const statusEl = document.getElementById('memoryStatus');
            if (statusEl) statusEl.textContent = `Wrong! Lives: ${memory.lives}`;
            
            if (memory.lives <= 0) {
                setTimeout(() => {
                    this.endGame(memory.score);
                }, 1500);
            } else {
                setTimeout(() => {
                    this.showMemorySequence();
                }, 1500);
            }
        }
        
        this.updateMemoryStats();
        
        setTimeout(() => {
            cell.classList.remove('correct', 'wrong');
        }, 500);
    }
    
    updateMemoryStats() {
        const memoryLevel = document.getElementById('memoryLevel');
        const memoryScore = document.getElementById('memoryScore');
        const memoryLives = document.getElementById('memoryLives');
        
        if (memoryLevel) memoryLevel.textContent = this.gameData.memory.level;
        if (memoryScore) memoryScore.textContent = this.gameData.memory.score;
        if (memoryLives) memoryLives.textContent = this.gameData.memory.lives;
    }
    
    // Reflex Game
    startReflexGame() {
        this.showScreen('reflexGame');
        
        this.gameData.reflex = {
            score: 0,
            timeLeft: 30,
            lives: this.lives,
            gameActive: true,
            currentTarget: null,
            timer: null
        };
        
        this.updateReflexStats();
        
        const arena = document.getElementById('reflexArena');
        if (arena) arena.innerHTML = '';
        
        this.gameData.reflex.timer = setInterval(() => {
            this.gameData.reflex.timeLeft--;
            this.updateReflexStats();
            
            if (this.gameData.reflex.timeLeft <= 0) {
                this.endReflexGame();
            }
        }, 1000);
        
        setTimeout(() => {
            this.spawnReflexTarget();
        }, 1000);
    }
    
    spawnReflexTarget() {
        if (!this.gameData.reflex.gameActive) return;
        
        const arena = document.getElementById('reflexArena');
        if (!arena) return;
        
        const target = document.createElement('div');
        target.className = 'reflex-target';
        
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        target.style.background = color;
        target.dataset.color = color;
        target.dataset.spawnTime = Date.now();
        
        const maxX = Math.max(0, arena.offsetWidth - 55);
        const maxY = Math.max(0, arena.offsetHeight - 55);
        target.style.left = Math.random() * maxX + 'px';
        target.style.top = Math.random() * maxY + 'px';
        
        target.addEventListener('click', () => this.handleTargetClick(target));
        
        arena.appendChild(target);
        this.gameData.reflex.currentTarget = target;
        
        setTimeout(() => {
            if (target.parentNode) {
                target.remove();
                if (this.gameData.reflex.currentTarget === target) {
                    this.gameData.reflex.currentTarget = null;
                    // Missed target, lose a life
                    this.gameData.reflex.lives--;
                    this.updateReflexStats();
                    
                    if (this.gameData.reflex.lives <= 0) {
                        this.endReflexGame();
                        return;
                    }
                }
            }
        }, 2500);
        
        if (this.gameData.reflex.gameActive) {
            setTimeout(() => this.spawnReflexTarget(), 1000 + Math.random() * 1200);
        }
    }
    
    handleTargetClick(target) {
        const reactionTime = Date.now() - parseInt(target.dataset.spawnTime);
        const points = Math.max(60 - Math.floor(reactionTime / 25), 15);
        
        this.gameData.reflex.score += points;
        this.playSound('correct');
        this.updateReflexStats();
        
        target.remove();
        if (this.gameData.reflex.currentTarget === target) {
            this.gameData.reflex.currentTarget = null;
        }
    }
    
    handleColorClick(color) {
        if (!this.gameData.reflex.gameActive) return;
        
        document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
        const colorBtn = document.querySelector(`[data-color="${color}"]`);
        if (colorBtn) colorBtn.classList.add('active');
        
        setTimeout(() => {
            document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
        }, 200);
        
        const currentTarget = this.gameData.reflex.currentTarget;
        if (currentTarget && currentTarget.dataset.color === color) {
            this.handleTargetClick(currentTarget);
        }
    }
    
    updateReflexStats() {
        const reflexScore = document.getElementById('reflexScore');
        const reflexTime = document.getElementById('reflexTime');
        const reflexLives = document.getElementById('reflexLives');
        
        if (reflexScore) reflexScore.textContent = this.gameData.reflex.score;
        if (reflexTime) reflexTime.textContent = this.gameData.reflex.timeLeft;
        if (reflexLives) reflexLives.textContent = this.gameData.reflex.lives;
    }
    
    endReflexGame() {
        this.gameData.reflex.gameActive = false;
        if (this.gameData.reflex.timer) {
            clearInterval(this.gameData.reflex.timer);
            this.gameData.reflex.timer = null;
        }
        
        const arena = document.getElementById('reflexArena');
        if (arena) arena.innerHTML = '';
        
        this.endGame(this.gameData.reflex.score);
    }
    
    // Logic Game
    startLogicGame() {
        this.showScreen('logicGame');
        
        this.gameData.logic.level = 1;
        this.gameData.logic.score = 0;
        this.gameData.logic.lives = this.lives;
        
        this.updateLogicStats();
        this.generateLogicPuzzle();
    }
    
    generateLogicPuzzle() {
        const logic = this.gameData.logic;
        const sequenceIndex = (logic.level - 1) % logic.sequences.length;
        const puzzle = logic.sequences[sequenceIndex];
        
        logic.currentSequence = [...puzzle.pattern];
        logic.currentAnswer = puzzle.answer;
        
        this.displayLogicSequence();
        
        const answerInput = document.getElementById('answerInput');
        if (answerInput) {
            answerInput.value = '';
            answerInput.focus();
        }
    }
    
    displayLogicSequence() {
        const display = document.getElementById('sequenceDisplay');
        if (!display) return;
        
        display.innerHTML = '';
        
        this.gameData.logic.currentSequence.forEach(num => {
            const numberDiv = document.createElement('div');
            numberDiv.className = 'sequence-number';
            if (num === '?') {
                numberDiv.classList.add('missing');
            }
            numberDiv.textContent = num;
            display.appendChild(numberDiv);
        });
    }
    
    checkLogicAnswer() {
        const logic = this.gameData.logic;
        const input = document.getElementById('answerInput');
        if (!input) return;
        
        const answer = parseInt(input.value);
        
        if (answer === logic.currentAnswer) {
            logic.score += logic.level * 25;
            logic.level++;
            this.playSound('correct');
            
            const missingCell = document.querySelector('.sequence-number.missing');
            if (missingCell) {
                missingCell.textContent = answer;
                missingCell.classList.remove('missing');
                missingCell.classList.add('success-flash');
            }
            
            setTimeout(() => {
                this.updateLogicStats();
                if (logic.level <= logic.sequences.length) {
                    this.generateLogicPuzzle();
                } else {
                    this.endGame(logic.score);
                }
            }, 1500);
        } else {
            logic.lives--;
            this.playSound('wrong');
            
            input.style.borderColor = '#ff6b6b';
            input.style.background = 'rgba(255, 107, 107, 0.1)';
            
            this.updateLogicStats();
            
            if (logic.lives <= 0) {
                setTimeout(() => {
                    this.endGame(logic.score);
                }, 1500);
            } else {
                setTimeout(() => {
                    input.style.borderColor = '';
                    input.style.background = '';
                    input.focus();
                }, 500);
            }
        }
    }
    
    updateLogicStats() {
        const logicLevel = document.getElementById('logicLevel');
        const logicScore = document.getElementById('logicScore');
        const logicLives = document.getElementById('logicLives');
        
        if (logicLevel) logicLevel.textContent = this.gameData.logic.level;
        if (logicScore) logicScore.textContent = this.gameData.logic.score;
        if (logicLives) logicLives.textContent = this.gameData.logic.lives;
    }
    
    // Game End
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
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing SagaRise...');
    window.sagaRise = new SagaRise();
});