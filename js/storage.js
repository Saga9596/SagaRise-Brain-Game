
// js/storage.js
class GameStorage {
  constructor() {
    this.dbName = 'SagariseGameDB';
    this.version = 1;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains('userProgress')) {
          const store = db.createObjectStore('userProgress', { 
            keyPath: 'userId',
            autoIncrement: true 
          });

          store.createIndex('xp', 'xp', { unique: false });
          store.createIndex('level', 'level', { unique: false });
        }
      };
    });
  }

  async saveUserXP(userId, xpData) {
    const transaction = this.db.transaction(['userProgress'], 'readwrite');
    const store = transaction.objectStore('userProgress');

    const userData = {
      userId: userId || 'defaultUser',
      xp: xpData.xp,
      level: xpData.level,
      achievements: xpData.achievements || [],
      lastUpdated: new Date().toISOString()
    };

    await store.put(userData);
    return userData;
  }

  async getUserXP(userId = 'defaultUser') {
    const transaction = this.db.transaction(['userProgress'], 'readonly');
    const store = transaction.objectStore('userProgress');

    return new Promise((resolve, reject) => {
      const request = store.get(userId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

// Export/Import functions
async function exportGameData() {
  try {
    const userData = await gameStorage.getUserXP();
    if (!userData) {
      alert('No save data found to export');
      return;
    }

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'sagarise-save-data.json';
    link.click();
  } catch (error) {
    console.error('Export failed:', error);
  }
}

function importGameData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const userData = JSON.parse(e.target.result);
      await gameStorage.saveUserXP(userData.userId || 'defaultUser', userData);

      // Update your game UI with imported data
      if (typeof updateGameUI === 'function') {
        updateGameUI(userData);
      }
      alert('Game data imported successfully!');
    } catch (error) {
      console.error('Import failed:', error);
      alert('Invalid save file format');
    }
  };
  reader.readAsText(file);
}
