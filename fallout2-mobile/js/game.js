// Fallout 2 Mobile - Game Logic

// Game State
const gameState = {
    currentScreen: 'loading',
    player: {
        name: 'Vault Dweller',
        level: 1,
        xp: 0,
        hp: 100,
        maxHp: 100,
        ap: 10,
        maxAp: 10,
        special: {
            strength: 5,
            perception: 5,
            endurance: 5,
            charisma: 5,
            intelligence: 5,
            agility: 5,
            luck: 5
        },
        inventory: [
            { id: 'stimpak', name: 'Stimpak', type: 'medical', icon: '💉', effect: { hp: 50 } },
            { id: 'rad-x', name: 'Rad-X', type: 'medical', icon: '🧪', effect: { radiation: -20 } },
            { id: 'bottle-cap', name: 'Bottle Caps', type: 'currency', icon: '🪙', quantity: 50 }
        ],
        equipped: {
            weapon: { id: 'spear', name: 'Spear', damage: '3-8', icon: '🗡️' },
            armor: { id: 'tribal', name: 'Tribal Outfit', ac: 5, icon: '👕' }
        },
        location: 'arroyo'
    },
    currentLocation: null,
    currentEnemy: null,
    inCombat: false,
    currentDialogue: null,
    quests: [],
    locations: {},
    unlockedLocations: ['arroyo']
};

// Location Data
const locations = {
    arroyo: {
        id: 'arroyo',
        name: 'Arroyo Village',
        description: 'Your tribal village. The Elder has tasked you with finding the sacred GECK to save your people.',
        icon: '🏕️',
        encounters: ['gecko', 'mantis'],
        npcs: ['elder', 'hakunin'],
        discovered: true
    },
    klamath: {
        id: 'klamath',
        name: 'Klamath',
        description: 'A small trapping town. The locals are friendly but cautious of strangers.',
        icon: '🏛️',
        encounters: ['gecko', 'rat', 'bandit'],
        npcs: ['trader', 'trapper'],
        discovered: false
    },
    den: {
        id: 'den',
        name: 'The Den',
        description: 'A dangerous town controlled by slavers and drug dealers. Not for the faint of heart.',
        icon: '⚠️',
        encounters: ['slaver', 'junkie', 'thug'],
        npcs: ['metzger', 'flick'],
        discovered: false
    },
    vault_city: {
        id: 'vault_city',
        name: 'Vault City',
        description: 'A pristine pre-war vault that became a xenophobic city-state.',
        icon: '🏛️',
        encounters: [],
        npcs: ['first_citizen', 'lynette'],
        discovered: false
    },
    ncr: {
        id: 'ncr',
        name: 'New California Republic',
        description: 'The largest and most powerful faction in the wasteland.',
        icon: '🏛️',
        encounters: [],
        npcs: ['president', 'ranger'],
        discovered: false
    }
};

// Enemy Data
const enemies = {
    gecko: { name: 'Gecko', hp: 30, maxHp: 30, damage: '2-6', xp: 25, icon: '🦎', loot: ['gecko_pelt'] },
    mantis: { name: 'Mantis', hp: 25, maxHp: 25, damage: '3-7', xp: 30, icon: '🦗', loot: ['mantis_leg'] },
    rat: { name: 'Giant Rat', hp: 15, maxHp: 15, damage: '1-4', xp: 15, icon: '🐀', loot: [] },
    radscorpion: { name: 'Radscorpion', hp: 50, maxHp: 50, damage: '5-12', xp: 50, icon: '🦂', loot: ['scorpion_tail'] },
    bandit: { name: 'Bandit', hp: 40, maxHp: 40, damage: '4-10', xp: 40, icon: '🔫', loot: ['pistol', 'caps'] },
    slaver: { name: 'Slaver', hp: 60, maxHp: 60, damage: '6-14', xp: 60, icon: '⛓️', loot: ['shotgun', 'caps'] }
};

// NPC Dialogues
const dialogues = {
    elder: {
        name: 'The Elder',
        icon: '🧓',
        lines: [
            {
                text: 'Chosen One, our village is dying. The drought has made our lands barren. You must find the Garden of Eden Creation Kit - the GECK. It is our only hope.',
                choices: [
                    { text: '[Accept] I will find the GECK and save our people.', action: 'quest_geck' },
                    { text: '[Ask] Where should I start looking?', next: 1 },
                    { text: '[Leave] I understand.', action: 'end' }
                ]
            },
            {
                text: 'The trader Vic mentioned a place called Vault City. They may have records of other vaults. Start your search there.',
                choices: [
                    { text: '[Accept] I will find the GECK.', action: 'quest_geck' },
                    { text: '[Leave] Thank you, Elder.', action: 'end' }
                ]
            }
        ]
    },
    hakunin: {
        name: 'Hakunin',
        icon: '🧙',
        lines: [
            {
                text: 'The spirits speak to me, Chosen One. I see darkness... but also hope. Take this. It will help you on your journey.',
                choices: [
                    { text: '[Take Gift] Thank you, Hakunin.', action: 'gift_healing' },
                    { text: '[Leave] May the spirits guide me.', action: 'end' }
                ]
            }
        ]
    },
    trader: {
        name: 'Trader Vic',
        icon: '🤠',
        lines: [
            {
                text: 'Looking to buy or sell, traveler? I got the best prices in Klamath!',
                choices: [
                    { text: '[Trade] Let me see your wares.', action: 'open_trade' },
                    { text: '[Ask] Any news from the wasteland?', next: 1 },
                    { text: '[Leave] Not today.', action: 'end' }
                ]
            },
            {
                text: 'Word is the Enclave is up to something. Best stay away from them. Also heard rumors of a GECK in one of the old vaults.',
                choices: [
                    { text: '[Leave] Thanks for the info.', action: 'end' }
                ]
            }
        ]
    }
};

// Quest Data
const questsData = {
    main_geck: {
        id: 'main_geck',
        title: 'Find the GECK',
        description: 'Locate the Garden of Eden Creation Kit to save Arroyo from drought and famine.',
        status: 'active',
        objectives: [
            'Travel to Vault City',
            'Learn about Vault 13',
            'Find Vault 13',
            'Retrieve the GECK'
        ],
        currentObjective: 0
    }
};

// Initialize Game
function initGame() {
    gameState.locations = locations;
    gameState.currentLocation = locations.arroyo;

    // Load saved game if exists
    const saved = localStorage.getItem('fallout2_mobile_save');
    if (saved) {
        const savedState = JSON.parse(saved);
        Object.assign(gameState, savedState);
        document.getElementById('continue-btn').style.display = 'block';
    }

    setupEventListeners();
}

// Event Listeners
function setupEventListeners() {
    // Start screen
    document.getElementById('start-btn').addEventListener('click', () => {
        switchScreen('character');
    });

    document.getElementById('continue-btn').addEventListener('click', () => {
        loadGame();
        switchScreen('game');
        updateGameUI();
    });

    // Character creation
    setupCharacterCreation();

    document.getElementById('create-char-btn').addEventListener('click', () => {
        const name = document.getElementById('char-name').value.trim();
        if (name) {
            gameState.player.name = name;
        }
        calculateDerivedStats();
        initializeQuests();
        switchScreen('game');
        updateGameUI();
        saveGame();
    });

    // Action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            handleAction(action);
        });
    });

    // Combat buttons
    document.querySelectorAll('.combat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            handleCombatAction(action);
        });
    });

    // Navigation tabs
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            toggleTab(tab);
        });
    });

    // Travel
    document.getElementById('cancel-travel').addEventListener('click', () => {
        switchView('exploration');
    });

    // Modal
    document.getElementById('modal-close').addEventListener('click', () => {
        document.getElementById('message-modal').classList.remove('active');
    });
}

// Character Creation
function setupCharacterCreation() {
    const statRows = document.querySelectorAll('.stat-row');
    let availablePoints = 5;

    statRows.forEach(row => {
        const stat = row.dataset.stat;
        const decreaseBtn = row.querySelector('.decrease');
        const increaseBtn = row.querySelector('.increase');
        const valueDisplay = row.querySelector('.stat-value');

        let value = 5;

        decreaseBtn.addEventListener('click', () => {
            if (value > 1) {
                value--;
                availablePoints++;
                valueDisplay.textContent = value;
                updatePointsDisplay(availablePoints);
            }
        });

        increaseBtn.addEventListener('click', () => {
            if (value < 10 && availablePoints > 0) {
                value++;
                availablePoints--;
                valueDisplay.textContent = value;
                updatePointsDisplay(availablePoints);
            }
        });

        // Store value when done
        row.dataset.value = value;
    });

    function updatePointsDisplay(points) {
        document.getElementById('points-left').textContent = points;

        // Update game state
        statRows.forEach(row => {
            const stat = row.dataset.stat;
            const value = parseInt(row.querySelector('.stat-value').textContent);
            gameState.player.special[stat] = value;
        });
    }
}

// Calculate Derived Stats
function calculateDerivedStats() {
    const { strength, endurance, agility } = gameState.player.special;

    gameState.player.maxHp = 50 + (endurance * 10) + (strength * 2);
    gameState.player.hp = gameState.player.maxHp;
    gameState.player.maxAp = 5 + Math.floor(agility / 2);
    gameState.player.ap = gameState.player.maxAp;
}

// Initialize Quests
function initializeQuests() {
    gameState.quests.push(questsData.main_geck);
}

// Screen Management
function switchScreen(screenName) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

    let screenId;
    switch(screenName) {
        case 'loading': screenId = 'loading-screen'; break;
        case 'character': screenId = 'character-screen'; break;
        case 'game': screenId = 'game-screen'; break;
    }

    document.getElementById(screenId).classList.add('active');
    gameState.currentScreen = screenName;
}

function switchView(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(`${viewName}-view`).classList.add('active');
}

// Update UI
function updateGameUI() {
    const player = gameState.player;

    // Update HUD
    document.getElementById('player-name').textContent = player.name;
    document.getElementById('player-level').textContent = `Level ${player.level}`;
    document.getElementById('player-location').textContent = gameState.currentLocation.name;

    updateHealthBar();
    updateAPBar();
    updateStatsPanel();
    updateInventoryPanel();
    updateQuestsPanel();
    updateLocationDisplay();
}

function updateHealthBar() {
    const { hp, maxHp } = gameState.player;
    const percent = (hp / maxHp) * 100;
    document.getElementById('hp-bar').style.width = percent + '%';
    document.getElementById('hp-text').textContent = `${hp}/${maxHp}`;

    if (document.getElementById('player-combat-hp')) {
        document.getElementById('player-combat-hp').style.width = percent + '%';
    }
}

function updateAPBar() {
    const { ap, maxAp } = gameState.player;
    const percent = (ap / maxAp) * 100;
    document.getElementById('ap-bar').style.width = percent + '%';
    document.getElementById('ap-text').textContent = `${ap}/${maxAp}`;
}

function updateStatsPanel() {
    const special = gameState.player.special;
    document.getElementById('display-str').textContent = special.strength;
    document.getElementById('display-per').textContent = special.perception;
    document.getElementById('display-end').textContent = special.endurance;
    document.getElementById('display-cha').textContent = special.charisma;
    document.getElementById('display-int').textContent = special.intelligence;
    document.getElementById('display-agi').textContent = special.agility;
    document.getElementById('display-lck').textContent = special.luck;

    // Derived stats
    document.getElementById('derived-hp').textContent = gameState.player.maxHp;
    document.getElementById('derived-ap').textContent = gameState.player.maxAp;
    document.getElementById('derived-ac').textContent = 10 + gameState.player.equipped.armor.ac;
    document.getElementById('derived-dmg').textContent = special.strength + 2;
}

function updateInventoryPanel() {
    // Update equipped items
    document.getElementById('equipped-weapon').textContent = gameState.player.equipped.weapon.name;
    document.getElementById('equipped-armor').textContent = gameState.player.equipped.armor.name;

    // Update inventory grid
    const grid = document.getElementById('inventory-grid');
    grid.innerHTML = '';

    gameState.player.inventory.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inv-item';
        itemDiv.innerHTML = `
            <span class="item-icon">${item.icon}</span>
            <span>${item.name}</span>
            ${item.quantity ? `<span>(${item.quantity})</span>` : ''}
        `;
        itemDiv.addEventListener('click', () => useItem(item));
        grid.appendChild(itemDiv);
    });

    // Update weight
    const weight = gameState.player.inventory.length * 5;
    const maxWeight = gameState.player.special.strength * 25 + 50;
    document.getElementById('current-weight').textContent = weight;
    document.getElementById('max-weight').textContent = maxWeight;
}

function updateQuestsPanel() {
    const questsList = document.getElementById('quests-list');
    questsList.innerHTML = '';

    gameState.quests.forEach(quest => {
        const questDiv = document.createElement('div');
        questDiv.className = `quest-item ${quest.status === 'completed' ? 'completed' : ''}`;

        const currentObj = quest.objectives[quest.currentObjective] || 'Quest Complete';

        questDiv.innerHTML = `
            <div class="quest-title">${quest.title}</div>
            <div class="quest-desc">${quest.description}</div>
            <div class="quest-desc" style="margin-top: 8px; color: var(--warning-orange);">
                → ${currentObj}
            </div>
        `;
        questsList.appendChild(questDiv);
    });
}

function updateLocationDisplay() {
    const loc = gameState.currentLocation;
    document.getElementById('location-name').textContent = loc.name;
    document.getElementById('location-desc').textContent = loc.description;
}

// Actions
function handleAction(action) {
    switch(action) {
        case 'explore':
            exploreLocation();
            break;
        case 'rest':
            restAtLocation();
            break;
        case 'travel':
            openTravelMap();
            break;
    }
}

function exploreLocation() {
    const loc = gameState.currentLocation;

    // Random encounter chance
    const encounterChance = Math.random();

    if (encounterChance < 0.4 && loc.encounters && loc.encounters.length > 0) {
        // Combat encounter
        const enemyType = loc.encounters[Math.floor(Math.random() * loc.encounters.length)];
        startCombat(enemyType);
    } else if (encounterChance < 0.7 && loc.npcs && loc.npcs.length > 0) {
        // NPC encounter
        const npcId = loc.npcs[Math.floor(Math.random() * loc.npcs.length)];
        startDialogue(npcId);
    } else {
        // Find loot
        const lootMessages = [
            'You found some bottle caps! (+25 caps)',
            'You discovered a hidden stimpak!',
            'You found some ammunition.',
            'You found nothing of interest.',
            'You found some scrap metal.'
        ];
        const message = lootMessages[Math.floor(Math.random() * lootMessages.length)];

        if (message.includes('caps')) {
            const capsItem = gameState.player.inventory.find(i => i.id === 'bottle-cap');
            if (capsItem) capsItem.quantity += 25;
        } else if (message.includes('stimpak')) {
            gameState.player.inventory.push({
                id: 'stimpak',
                name: 'Stimpak',
                type: 'medical',
                icon: '💉',
                effect: { hp: 50 }
            });
        }

        showMessage(message);
        updateInventoryPanel();
    }

    saveGame();
}

function restAtLocation() {
    // Restore HP and AP
    const healAmount = Math.min(20, gameState.player.maxHp - gameState.player.hp);
    gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + 20);
    gameState.player.ap = gameState.player.maxAp;

    updateHealthBar();
    updateAPBar();
    showMessage(`You rest for a while and recover ${healAmount} HP. You feel refreshed.`);
    saveGame();
}

function openTravelMap() {
    const locationsList = document.getElementById('locations-list');
    locationsList.innerHTML = '';

    Object.values(gameState.locations).forEach(loc => {
        const locDiv = document.createElement('div');
        const isUnlocked = gameState.unlockedLocations.includes(loc.id);
        locDiv.className = `location-item ${!isUnlocked ? 'locked' : ''}`;

        locDiv.innerHTML = `
            <h4>${loc.icon} ${loc.name}</h4>
            <p>${isUnlocked ? loc.description : '???'}</p>
        `;

        if (isUnlocked && loc.id !== gameState.currentLocation.id) {
            locDiv.addEventListener('click', () => travelTo(loc.id));
        }

        locationsList.appendChild(locDiv);
    });

    switchView('travel');
}

function travelTo(locationId) {
    gameState.currentLocation = gameState.locations[locationId];

    // Mark as discovered
    if (!gameState.currentLocation.discovered) {
        gameState.currentLocation.discovered = true;
        showMessage(`You have discovered ${gameState.currentLocation.name}!`);
    }

    updateLocationDisplay();
    switchView('exploration');
    saveGame();

    // Random encounter during travel
    if (Math.random() < 0.3) {
        const allEnemies = Object.keys(enemies);
        const enemyType = allEnemies[Math.floor(Math.random() * allEnemies.length)];
        setTimeout(() => {
            showMessage('You encounter something on the road!');
            setTimeout(() => startCombat(enemyType), 1000);
        }, 500);
    }
}

// Combat System
function startCombat(enemyType) {
    gameState.inCombat = true;
    gameState.currentEnemy = { ...enemies[enemyType] };

    // Reset AP
    gameState.player.ap = gameState.player.maxAp;

    document.getElementById('enemy-name').textContent = gameState.currentEnemy.name;
    document.getElementById('enemy-sprite').textContent = gameState.currentEnemy.icon;

    updateCombatUI();
    clearCombatLog();
    addToCombatLog(`A ${gameState.currentEnemy.name} appears!`);

    switchView('combat');
}

function handleCombatAction(action) {
    if (!gameState.inCombat || gameState.player.ap <= 0) return;

    switch(action) {
        case 'attack':
            playerAttack(false);
            break;
        case 'aimed-shot':
            if (gameState.player.ap >= 5) {
                playerAttack(true);
            } else {
                addToCombatLog('Not enough AP for aimed shot!');
            }
            break;
        case 'item':
            useCombatItem();
            break;
        case 'run':
            attemptRun();
            break;
    }
}

function playerAttack(aimed) {
    const apCost = aimed ? 5 : 3;
    if (gameState.player.ap < apCost) {
        addToCombatLog('Not enough AP!');
        return;
    }

    gameState.player.ap -= apCost;

    const { strength, luck } = gameState.player.special;
    const weapon = gameState.player.equipped.weapon;

    // Calculate hit chance
    let hitChance = 0.7;
    if (aimed) hitChance = 0.9;
    hitChance += (luck / 100);

    const hit = Math.random() < hitChance;

    if (hit) {
        // Parse weapon damage (e.g., "3-8")
        const [minDmg, maxDmg] = weapon.damage.split('-').map(Number);
        let damage = Math.floor(Math.random() * (maxDmg - minDmg + 1)) + minDmg;
        damage += Math.floor(strength / 2);

        if (aimed) {
            damage = Math.floor(damage * 1.5);
            addToCombatLog(`Critical hit! You deal ${damage} damage!`);
        } else {
            addToCombatLog(`You hit for ${damage} damage!`);
        }

        gameState.currentEnemy.hp -= damage;

        if (gameState.currentEnemy.hp <= 0) {
            endCombat(true);
            return;
        }
    } else {
        addToCombatLog('Your attack missed!');
    }

    updateCombatUI();

    // Enemy turn
    setTimeout(enemyTurn, 800);
}

function enemyTurn() {
    if (!gameState.inCombat) return;

    const enemy = gameState.currentEnemy;
    const hitChance = 0.6;

    if (Math.random() < hitChance) {
        const [minDmg, maxDmg] = enemy.damage.split('-').map(Number);
        const damage = Math.floor(Math.random() * (maxDmg - minDmg + 1)) + minDmg;

        // Apply armor reduction
        const armorReduction = gameState.player.equipped.armor.ac || 0;
        const finalDamage = Math.max(1, damage - Math.floor(armorReduction / 2));

        gameState.player.hp -= finalDamage;
        addToCombatLog(`${enemy.name} hits you for ${finalDamage} damage!`);

        if (gameState.player.hp <= 0) {
            gameOver();
            return;
        }
    } else {
        addToCombatLog(`${enemy.name} missed!`);
    }

    // Restore some AP at end of round
    gameState.player.ap = Math.min(gameState.player.maxAp, gameState.player.ap + 3);

    updateCombatUI();
}

function useCombatItem() {
    const stimpak = gameState.player.inventory.find(i => i.id === 'stimpak');
    if (stimpak) {
        gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + 50);
        gameState.player.inventory = gameState.player.inventory.filter(i => i !== stimpak);
        addToCombatLog('You used a Stimpak and restored 50 HP!');
        updateCombatUI();
        updateInventoryPanel();

        setTimeout(enemyTurn, 800);
    } else {
        addToCombatLog('You have no items to use!');
    }
}

function attemptRun() {
    const { agility, luck } = gameState.player.special;
    const runChance = 0.5 + (agility / 20) + (luck / 20);

    if (Math.random() < runChance) {
        addToCombatLog('You successfully fled from combat!');
        setTimeout(() => endCombat(false), 1000);
    } else {
        addToCombatLog('Failed to run!');
        gameState.player.ap = Math.max(0, gameState.player.ap - 2);
        setTimeout(enemyTurn, 800);
    }
}

function endCombat(victory) {
    gameState.inCombat = false;

    if (victory) {
        const enemy = gameState.currentEnemy;
        gameState.player.xp += enemy.xp;

        // Level up check
        const xpNeeded = gameState.player.level * 100;
        if (gameState.player.xp >= xpNeeded) {
            levelUp();
        }

        showMessage(`Victory! You earned ${enemy.xp} XP!`);

        // Loot
        if (enemy.loot && enemy.loot.length > 0 && Math.random() < 0.5) {
            const lootItem = enemy.loot[Math.floor(Math.random() * enemy.loot.length)];
            showMessage(`You found: ${lootItem}`);
        }
    }

    gameState.currentEnemy = null;
    switchView('exploration');
    updateGameUI();
    saveGame();
}

function levelUp() {
    gameState.player.level++;
    gameState.player.maxHp += 10;
    gameState.player.hp = gameState.player.maxHp;

    showMessage(`LEVEL UP! You are now level ${gameState.player.level}!`);
    updateGameUI();
}

function gameOver() {
    gameState.player.hp = 0;
    updateHealthBar();
    addToCombatLog('You have died...');

    setTimeout(() => {
        showMessage('GAME OVER\n\nYour adventure ends here in the wasteland...');
        setTimeout(() => {
            localStorage.removeItem('fallout2_mobile_save');
            location.reload();
        }, 3000);
    }, 2000);
}

function updateCombatUI() {
    updateHealthBar();
    updateAPBar();

    if (gameState.currentEnemy) {
        const enemyHpPercent = (gameState.currentEnemy.hp / gameState.currentEnemy.maxHp) * 100;
        document.getElementById('enemy-combat-hp').style.width = enemyHpPercent + '%';
    }
}

function clearCombatLog() {
    document.getElementById('combat-log').innerHTML = '';
}

function addToCombatLog(message) {
    const log = document.getElementById('combat-log');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = message;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

// Dialogue System
function startDialogue(npcId) {
    const dialogue = dialogues[npcId];
    if (!dialogue) return;

    gameState.currentDialogue = {
        npc: npcId,
        lineIndex: 0
    };

    document.getElementById('npc-portrait').textContent = dialogue.icon;
    document.getElementById('dialogue-npc-name').textContent = dialogue.name;

    showDialogueLine(0);
    switchView('dialogue');
}

function showDialogueLine(lineIndex) {
    const dialogue = dialogues[gameState.currentDialogue.npc];
    const line = dialogue.lines[lineIndex];

    document.getElementById('dialogue-text').textContent = line.text;

    const choicesDiv = document.getElementById('dialogue-choices');
    choicesDiv.innerHTML = '';

    line.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice.text;
        btn.addEventListener('click', () => handleDialogueChoice(choice));
        choicesDiv.appendChild(btn);
    });
}

function handleDialogueChoice(choice) {
    if (choice.action) {
        handleDialogueAction(choice.action);
        if (choice.action === 'end') {
            endDialogue();
        }
    } else if (choice.next !== undefined) {
        showDialogueLine(choice.next);
    }
}

function handleDialogueAction(action) {
    switch(action) {
        case 'quest_geck':
            showMessage('Quest Started: Find the GECK');
            // Quest already initialized
            break;
        case 'gift_healing':
            gameState.player.inventory.push({
                id: 'stimpak',
                name: 'Stimpak',
                type: 'medical',
                icon: '💉',
                effect: { hp: 50 }
            });
            showMessage('Received: Stimpak x2');
            gameState.player.inventory.push({
                id: 'stimpak',
                name: 'Stimpak',
                type: 'medical',
                icon: '💉',
                effect: { hp: 50 }
            });
            updateInventoryPanel();
            break;
        case 'open_trade':
            showMessage('Trading system coming soon!');
            break;
    }
}

function endDialogue() {
    gameState.currentDialogue = null;
    switchView('exploration');
}

// Item Usage
function useItem(item) {
    if (item.type === 'medical' && item.effect && item.effect.hp) {
        if (gameState.player.hp < gameState.player.maxHp) {
            gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + item.effect.hp);
            gameState.player.inventory = gameState.player.inventory.filter(i => i !== item);
            showMessage(`Used ${item.name}. Restored ${item.effect.hp} HP.`);
            updateHealthBar();
            updateInventoryPanel();
            saveGame();
        } else {
            showMessage('Your HP is already full.');
        }
    } else if (item.type === 'currency') {
        showMessage(`You have ${item.quantity} ${item.name}.`);
    } else {
        showMessage(`You examine the ${item.name}.`);
    }
}

// Tab Management
let currentTab = null;

function toggleTab(tabName) {
    const tabPanels = document.querySelector('.tab-panels');
    const navBtns = document.querySelectorAll('.nav-btn');
    const panels = document.querySelectorAll('.tab-panel');

    // Update nav buttons
    navBtns.forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // If clicking the same tab, close it
    if (currentTab === tabName) {
        tabPanels.classList.remove('open');
        currentTab = null;
        return;
    }

    // Show selected panel
    panels.forEach(panel => {
        if (panel.id === `${tabName}-panel`) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });

    tabPanels.classList.add('open');
    currentTab = tabName;
}

// Utility Functions
function showMessage(message) {
    document.getElementById('modal-text').textContent = message;
    document.getElementById('message-modal').classList.add('active');
}

function saveGame() {
    localStorage.setItem('fallout2_mobile_save', JSON.stringify(gameState));
}

function loadGame() {
    const saved = localStorage.getItem('fallout2_mobile_save');
    if (saved) {
        const savedState = JSON.parse(saved);
        Object.assign(gameState, savedState);
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', initGame);
