// Game State
const game = {
    currentScreen: 'title',
    player: null,
    world: null,
    npcs: [],
    enemies: [],
    quests: [],
    dialogueActive: false,
    combatActive: false,
    currentEnemy: null,
    camera: { x: 0, y: 0 },
    keys: {},
    lastUpdate: Date.now()
};

// Constants
const TILE_SIZE = 32;
const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 100;

// Player Class
class Player {
    constructor(name, identity, skills) {
        this.name = name;
        this.identity = identity;
        this.skills = skills;
        this.level = 1;
        this.xp = 0;
        this.xpToLevel = 100;
        this.health = 100;
        this.maxHealth = 100;
        this.energy = 100;
        this.maxEnergy = 100;
        this.hope = 50;
        this.maxHope = 100;
        this.x = 50;
        this.y = 50;
        this.speed = 0.15;
        this.inventory = [
            { name: 'Pride Flag', type: 'item', description: 'A symbol of who you are' },
            { name: 'Journal', type: 'item', description: 'Document your journey' }
        ];
        this.color = '#ff6ec4';
    }

    move(dx, dy, world) {
        const newX = this.x + dx * this.speed;
        const newY = this.y + dy * this.speed;

        if (newX >= 0 && newX < WORLD_WIDTH && newY >= 0 && newY < WORLD_HEIGHT) {
            if (world.getTile(Math.floor(newX), Math.floor(newY)).walkable) {
                this.x = newX;
                this.y = newY;
                return true;
            }
        }
        return false;
    }

    gainXP(amount) {
        this.xp += amount;
        addMessage(`Gained ${amount} XP!`, 'success');

        if (this.xp >= this.xpToLevel) {
            this.levelUp();
        }
        updateUI();
    }

    levelUp() {
        this.level++;
        this.xp -= this.xpToLevel;
        this.xpToLevel = Math.floor(this.xpToLevel * 1.5);
        this.maxHealth += 20;
        this.health = this.maxHealth;
        this.maxEnergy += 10;
        this.energy = this.maxEnergy;

        addMessage(`LEVEL UP! You are now level ${this.level}!`, 'success');
        addMessage('All skills increased!', 'success');

        // Increase all skills
        for (let skill in this.skills) {
            this.skills[skill]++;
        }
        updateUI();
    }

    addItem(item) {
        this.inventory.push(item);
        addMessage(`Received: ${item.name}`, 'success');
        updateUI();
    }
}

// World Class
class World {
    constructor() {
        this.tiles = [];
        this.locations = [];
        this.generate();
    }

    generate() {
        // Generate world tiles
        for (let y = 0; y < WORLD_HEIGHT; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < WORLD_WIDTH; x++) {
                // Create varied terrain
                const rand = Math.random();
                if (rand < 0.1) {
                    this.tiles[y][x] = { type: 'water', walkable: false, color: '#4facfe' };
                } else if (rand < 0.15) {
                    this.tiles[y][x] = { type: 'mountain', walkable: false, color: '#8b7355' };
                } else if (rand < 0.4) {
                    this.tiles[y][x] = { type: 'grass', walkable: true, color: '#4caf50' };
                } else if (rand < 0.6) {
                    this.tiles[y][x] = { type: 'forest', walkable: true, color: '#2d5016' };
                } else {
                    this.tiles[y][x] = { type: 'plains', walkable: true, color: '#8bc34a' };
                }
            }
        }

        // Create key locations across 2025 America
        this.locations = [
            { name: 'San Francisco - Pride District', x: 10, y: 50, type: 'safe-haven', description: 'A beacon of acceptance and community' },
            { name: 'New York - Stonewall Plaza', x: 85, y: 30, type: 'historical', description: 'Where the revolution began' },
            { name: 'Austin - Queer Quarter', x: 40, y: 70, type: 'safe-haven', description: 'A progressive oasis in the south' },
            { name: 'Seattle - Capitol Hill', x: 8, y: 15, type: 'safe-haven', description: 'A thriving LGBTQ+ community' },
            { name: 'Miami - South Beach', x: 90, y: 85, type: 'safe-haven', description: 'Celebration and visibility' },
            { name: 'Washington DC - Capitol', x: 82, y: 40, type: 'political', description: 'The heart of the political battle' },
            { name: 'Nashville - Bible Belt Crossroads', x: 55, y: 60, type: 'hostile', description: 'Where hatred runs deep' },
            { name: 'Dallas - Conservative Stronghold', x: 35, y: 75, type: 'hostile', description: 'Opposition territory' },
            { name: 'Phoenix - Desert Resistance', x: 22, y: 68, type: 'neutral', description: 'A place of growing change' },
            { name: 'Portland - Activist Hub', x: 5, y: 20, type: 'safe-haven', description: 'Where movements are born' }
        ];

        // Make locations walkable and visible
        this.locations.forEach(loc => {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const y = loc.y + dy;
                    const x = loc.x + dx;
                    if (y >= 0 && y < WORLD_HEIGHT && x >= 0 && x < WORLD_WIDTH) {
                        this.tiles[y][x] = {
                            type: 'city',
                            walkable: true,
                            color: loc.type === 'safe-haven' ? '#ffd700' :
                                   loc.type === 'hostile' ? '#ff4444' : '#aaaaaa',
                            location: loc
                        };
                    }
                }
            }
        });
    }

    getTile(x, y) {
        if (x < 0 || x >= WORLD_WIDTH || y < 0 || y >= WORLD_HEIGHT) {
            return { type: 'void', walkable: false, color: '#000000' };
        }
        return this.tiles[y][x];
    }

    getNearbyLocation(x, y, radius = 2) {
        for (let loc of this.locations) {
            const dist = Math.sqrt((loc.x - x) ** 2 + (loc.y - y) ** 2);
            if (dist <= radius) {
                return loc;
            }
        }
        return null;
    }
}

// NPC Class
class NPC {
    constructor(data) {
        Object.assign(this, data);
        this.talked = false;
    }

    interact(player) {
        game.dialogueActive = true;
        showDialogue(this.name, this.dialogue, this.options);
    }
}

// Enemy Class
class Enemy {
    constructor(data) {
        Object.assign(this, data);
    }

    initiateCombat(player) {
        game.combatActive = true;
        game.currentEnemy = this;
        startCombat(this);
    }
}

// Create NPCs (Trans Icons and Allies)
function createNPCs() {
    return [
        new NPC({
            name: 'Laverne Cox',
            x: 85, y: 30,
            type: 'icon',
            dialogue: 'Welcome, friend. Your identity is valid, and your fight matters. I\'ve walked this path too, and I\'m here to help you on your journey.',
            options: [
                { text: 'Thank you. What can you teach me?', action: () => {
                    game.player.skills.resilience += 2;
                    game.player.skills.courage += 2;
                    addMessage('Laverne Cox teaches you about resilience and courage!', 'success');
                    game.player.addItem({ name: 'Orange Wisdom', type: 'book', description: 'Lessons from Laverne\'s journey' });
                    closeDialogue();
                }},
                { text: 'Tell me about your story', action: () => {
                    showDialogue('Laverne Cox', 'My journey taught me that our existence is resistance. Every day we live authentically, we change the world. Remember that.', [
                        { text: 'I\'ll remember that', action: closeDialogue }
                    ]);
                }}
            ],
            color: '#ff6ec4'
        }),

        new NPC({
            name: 'Elliot Page',
            x: 10, y: 50,
            type: 'icon',
            dialogue: 'Living your truth is the most powerful thing you can do. I know the journey is hard, but you\'re not alone.',
            options: [
                { text: 'How do you deal with the hate?', action: () => {
                    game.player.skills.advocacy += 2;
                    game.player.skills.empathy += 1;
                    addMessage('Elliot shares strategies for dealing with adversity!', 'success');
                    game.player.gainXP(50);
                    closeDialogue();
                }},
                { text: 'What\'s your advice for 2025?', action: () => {
                    showDialogue('Elliot Page', 'Stay strong, stay loud, and don\'t let anyone tell you who you are. We\'ve come so far, and we won\'t go back.', [
                        { text: 'Thank you', action: closeDialogue }
                    ]);
                }}
            ],
            color: '#7873f5'
        }),

        new NPC({
            name: 'Janet Mock',
            x: 90, y: 85,
            type: 'icon',
            dialogue: 'You are a whole person deserving of love, respect, and dignity. Never forget that. Your story matters.',
            options: [
                { text: 'Can you help me with my journey?', action: () => {
                    game.player.skills.knowledge += 3;
                    addMessage('Janet Mock shares invaluable knowledge about trans history!', 'success');
                    game.player.addItem({ name: 'Redefining Realness', type: 'book', description: 'Janet\'s autobiography' });
                    closeDialogue();
                }},
                { text: 'What should I know about our history?', action: () => {
                    showDialogue('Janet Mock', 'We stand on the shoulders of giants. Marsha P. Johnson, Sylvia Rivera, and countless others fought for us. Honor them by living freely.', [
                        { text: 'I will honor them', action: closeDialogue }
                    ]);
                }}
            ],
            color: '#ff6ec4'
        }),

        new NPC({
            name: 'Sam Smith',
            x: 40, y: 70,
            type: 'icon',
            dialogue: 'Being non-binary isn\'t a trend, it\'s my truth. And your truth, whatever it is, is valid too.',
            options: [
                { text: 'Teach me about non-binary identities', action: () => {
                    game.player.skills.empathy += 2;
                    game.player.skills.knowledge += 2;
                    addMessage('Sam Smith expands your understanding of gender!', 'success');
                    game.player.gainXP(40);
                    closeDialogue();
                }},
                { text: 'How do you stay authentic?', action: () => {
                    showDialogue('Sam Smith', 'I stopped living for others and started living for myself. It\'s scary, but it\'s freedom.', [
                        { text: 'That\'s inspiring', action: closeDialogue }
                    ]);
                }}
            ],
            color: '#7873f5'
        }),

        new NPC({
            name: 'Chaz Bono',
            x: 8, y: 15,
            type: 'icon',
            dialogue: 'I transitioned when it was even harder than today. Your courage in 2025 continues the fight. Keep going.',
            options: [
                { text: 'What was it like for you?', action: () => {
                    game.player.skills.courage += 3;
                    addMessage('Chaz Bono shares his pioneering story!', 'success');
                    game.player.gainXP(45);
                    closeDialogue();
                }},
                { text: 'Any advice for today\'s battles?', action: () => {
                    showDialogue('Chaz Bono', 'The battles may change, but the core truth remains: be yourself, always. That\'s how we win.', [
                        { text: 'Thank you for paving the way', action: closeDialogue }
                    ]);
                }}
            ],
            color: '#4facfe'
        }),

        new NPC({
            name: 'Indya Moore',
            x: 85, y: 32,
            type: 'icon',
            dialogue: 'Our existence is revolutionary. Especially for trans people of color, every day is an act of defiance.',
            options: [
                { text: 'Tell me about intersectionality', action: () => {
                    game.player.skills.knowledge += 2;
                    game.player.skills.empathy += 2;
                    addMessage('Indya Moore teaches about intersectional struggles!', 'success');
                    game.player.gainXP(50);
                    closeDialogue();
                }},
                { text: 'How do we support each other?', action: () => {
                    showDialogue('Indya Moore', 'We lift each other up. Trans women of color are often the most vulnerable - we protect them, we amplify them, we love them.', [
                        { text: 'Solidarity forever', action: closeDialogue }
                    ]);
                }}
            ],
            color: '#ff6ec4'
        }),

        new NPC({
            name: 'Jazz Jennings',
            x: 91, y: 86,
            type: 'icon',
            dialogue: 'I\'ve been out since I was a kid. The future is ours if we keep fighting for it. Don\'t give up!',
            options: [
                { text: 'How do you stay hopeful?', action: () => {
                    game.player.hope = Math.min(game.player.maxHope, game.player.hope + 30);
                    addMessage('Jazz\'s optimism fills you with hope!', 'success');
                    game.player.gainXP(35);
                    updateUI();
                    closeDialogue();
                }},
                { text: 'What about the next generation?', action: () => {
                    showDialogue('Jazz Jennings', 'Every generation pushes further. We\'re building a world where trans kids can just be kids. That\'s worth everything.', [
                        { text: 'We\'ll build that world', action: closeDialogue }
                    ]);
                }}
            ],
            color: '#7873f5'
        }),

        new NPC({
            name: 'Trans Elder',
            x: 82, y: 40,
            type: 'ally',
            dialogue: 'I\'ve seen decades of this fight. You young folks have more support than we ever did. Use it wisely.',
            options: [
                { text: 'What did you learn?', action: () => {
                    game.player.skills.knowledge += 3;
                    addMessage('The Elder shares decades of wisdom!', 'success');
                    game.player.gainXP(60);
                    closeDialogue();
                }},
                { text: 'We honor you', action: () => {
                    showDialogue('Trans Elder', 'Just keep fighting. That\'s all we ever asked for. Keep fighting and never go back.', [
                        { text: 'We won\'t go back', action: closeDialogue }
                    ]);
                }}
            ],
            color: '#ffd700'
        }),

        new NPC({
            name: 'Ally Organizer',
            x: 5, y: 20,
            type: 'ally',
            dialogue: 'I stand with you all the way. Trans rights are human rights, and I\'ll fight alongside you.',
            options: [
                { text: 'How can allies help?', action: () => {
                    game.player.skills.advocacy += 2;
                    addMessage('You learn effective allyship strategies!', 'success');
                    game.player.gainXP(30);
                    closeDialogue();
                }},
                { text: 'Thank you for your support', action: () => {
                    showDialogue('Ally Organizer', 'This is everyone\'s fight. I won\'t stop until we all have true equality.', [
                        { text: 'Together we\'re stronger', action: closeDialogue }
                    ]);
                }}
            ],
            color: '#4facfe'
        })
    ];
}

// Create Enemies (Trans Antagonists - Politicians & Media)
function createEnemies() {
    return [
        new Enemy({
            name: 'Tucker Carlson',
            x: 55, y: 60,
            type: 'media-antagonist',
            health: 80,
            maxHealth: 80,
            attack: 15,
            defense: 5,
            dialogue: 'Your existence is threatening traditional values!',
            loot: { name: 'Broken TV Remote', type: 'trophy', description: 'Silenced a hateful voice' },
            xpReward: 50,
            color: '#ff4444'
        }),

        new Enemy({
            name: 'Ron DeSantis',
            x: 90, y: 83,
            type: 'politician-antagonist',
            health: 100,
            maxHealth: 100,
            attack: 18,
            defense: 8,
            dialogue: 'I\'ll ban your books, your healthcare, your existence from my state!',
            loot: { name: 'Banned Book', type: 'trophy', description: 'Knowledge they tried to hide' },
            xpReward: 75,
            color: '#ff0000'
        }),

        new Enemy({
            name: 'Marjorie Taylor Greene',
            x: 56, y: 61,
            type: 'politician-antagonist',
            health: 70,
            maxHealth: 70,
            attack: 20,
            defense: 3,
            dialogue: 'Trans people are destroying America!',
            loot: { name: 'Conspiracy Theory Notes', type: 'trophy', description: 'Debunked nonsense' },
            xpReward: 60,
            color: '#ff4444'
        }),

        new Enemy({
            name: 'Matt Walsh',
            x: 36, y: 75,
            type: 'media-antagonist',
            health: 75,
            maxHealth: 75,
            attack: 16,
            defense: 6,
            dialogue: 'What is a woman? I\'ll tell you - it\'s not you!',
            loot: { name: 'Debunked Documentary', type: 'trophy', description: 'Propaganda defeated' },
            xpReward: 55,
            color: '#ff4444'
        }),

        new Enemy({
            name: 'JK Rowling',
            x: 35, y: 76,
            type: 'media-antagonist',
            health: 85,
            maxHealth: 85,
            attack: 14,
            defense: 10,
            dialogue: 'I\'ll tweet my way to erasing you!',
            loot: { name: 'Blocked Twitter Account', type: 'trophy', description: 'Silenced TERF rhetoric' },
            xpReward: 65,
            color: '#ff4444'
        }),

        new Enemy({
            name: 'Greg Abbott',
            x: 37, y: 74,
            type: 'politician-antagonist',
            health: 95,
            maxHealth: 95,
            attack: 17,
            defense: 9,
            dialogue: 'Texas will never accept your agenda!',
            loot: { name: 'Overturned Law', type: 'trophy', description: 'Justice prevails' },
            xpReward: 70,
            color: '#ff0000'
        }),

        new Enemy({
            name: 'Ben Shapiro',
            x: 56, y: 59,
            type: 'media-antagonist',
            health: 65,
            maxHealth: 65,
            attack: 12,
            defense: 4,
            dialogue: 'Facts don\'t care about your feelings! You\'re biologically wrong!',
            loot: { name: 'Outdated Science Book', type: 'trophy', description: 'Science actually supports trans people' },
            xpReward: 45,
            color: '#ff4444'
        }),

        new Enemy({
            name: 'Random Transphobe',
            x: 54, y: 62,
            type: 'civilian-antagonist',
            health: 50,
            maxHealth: 50,
            attack: 10,
            defense: 2,
            dialogue: 'You\'re confused and you\'re confusing our children!',
            loot: { name: 'Changed Mind', type: 'trophy', description: 'Education can work' },
            xpReward: 30,
            color: '#ff6666'
        })
    ];
}

// Create Initial Quests
function createQuests() {
    return [
        {
            id: 'main-1',
            title: 'Find Your Community',
            description: 'Travel to a safe haven city and meet other trans people',
            status: 'active',
            progress: 0,
            goal: 1,
            reward: { xp: 100, item: { name: 'Community Badge', type: 'badge', description: 'You found your people' }},
            checkProgress: () => {
                const quest = game.quests.find(q => q.id === 'main-1');
                if (quest && quest.progress >= quest.goal) {
                    completeQuest('main-1');
                }
            }
        },
        {
            id: 'main-2',
            title: 'Learn from the Icons',
            description: 'Speak with 3 trans icons to learn from their experiences',
            status: 'active',
            progress: 0,
            goal: 3,
            reward: { xp: 150, item: { name: 'Icon\'s Blessing', type: 'badge', description: 'Wisdom from legends' }},
            checkProgress: () => {
                const quest = game.quests.find(q => q.id === 'main-2');
                if (quest && quest.progress >= quest.goal) {
                    completeQuest('main-2');
                }
            }
        },
        {
            id: 'main-3',
            title: 'Stand Against Hate',
            description: 'Defeat 3 transphobes in debate battles',
            status: 'active',
            progress: 0,
            goal: 3,
            reward: { xp: 200, item: { name: 'Activist Medal', type: 'badge', description: 'You stood up for rights' }},
            checkProgress: () => {
                const quest = game.quests.find(q => q.id === 'main-3');
                if (quest && quest.progress >= quest.goal) {
                    completeQuest('main-3');
                }
            }
        },
        {
            id: 'side-1',
            title: 'Journey of Self-Discovery',
            description: 'Explore 5 different cities across America',
            status: 'active',
            progress: 0,
            goal: 5,
            reward: { xp: 120, hope: 20 },
            checkProgress: () => {
                const quest = game.quests.find(q => q.id === 'side-1');
                if (quest && quest.progress >= quest.goal) {
                    completeQuest('side-1');
                }
            }
        }
    ];
}

// Initialize game
function init() {
    setupEventListeners();
    showScreen('title');
}

function setupEventListeners() {
    // Title screen
    document.getElementById('start-button').addEventListener('click', () => {
        showScreen('character-creation');
    });

    // Character creation
    setupCharacterCreation();

    // Game controls
    document.addEventListener('keydown', (e) => {
        game.keys[e.key] = true;

        if (game.currentScreen === 'game') {
            handleGameInput(e.key);
        }
    });

    document.addEventListener('keyup', (e) => {
        game.keys[e.key] = false;
    });
}

function setupCharacterCreation() {
    const skills = {
        advocacy: 2,
        resilience: 2,
        knowledge: 2,
        empathy: 2,
        courage: 2
    };
    let totalPoints = 10;

    const updatePoints = () => {
        const used = Object.values(skills).reduce((a, b) => a + b, 0);
        const remaining = totalPoints - used;
        document.getElementById('points-remaining').textContent = remaining;

        document.getElementById('create-character-button').disabled = remaining !== 0;
    };

    document.querySelectorAll('.skill-plus').forEach(btn => {
        btn.addEventListener('click', () => {
            const skill = btn.dataset.skill;
            const used = Object.values(skills).reduce((a, b) => a + b, 0);
            if (used < totalPoints && skills[skill] < 10) {
                skills[skill]++;
                document.getElementById(`skill-${skill}`).textContent = skills[skill];
                updatePoints();
            }
        });
    });

    document.querySelectorAll('.skill-minus').forEach(btn => {
        btn.addEventListener('click', () => {
            const skill = btn.dataset.skill;
            if (skills[skill] > 0) {
                skills[skill]--;
                document.getElementById(`skill-${skill}`).textContent = skills[skill];
                updatePoints();
            }
        });
    });

    document.getElementById('create-character-button').addEventListener('click', () => {
        const name = document.getElementById('char-name').value.trim() || 'Hero';
        const identity = document.getElementById('char-identity').value;

        startGame(name, identity, skills);
    });

    updatePoints();
}

function startGame(name, identity, skills) {
    // Create player
    game.player = new Player(name, identity, skills);

    // Create world
    game.world = new World();

    // Create NPCs and Enemies
    game.npcs = createNPCs();
    game.enemies = createEnemies();

    // Create quests
    game.quests = createQuests();

    // Setup UI
    document.getElementById('char-name-display').textContent = name;
    document.getElementById('char-identity-display').textContent = identity.replace('-', ' ');

    updateUI();
    showScreen('game');

    addMessage('Welcome to your journey. The world of 2025 America awaits.', 'info');
    addMessage('Use arrow keys to move. Approach NPCs and enemies to interact.', 'info');

    // Start game loop
    requestAnimationFrame(gameLoop);
}

function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    document.getElementById(`${screenName}-screen`).classList.add('active');
    game.currentScreen = screenName;
}

function gameLoop() {
    const now = Date.now();
    const delta = now - game.lastUpdate;
    game.lastUpdate = now;

    if (game.currentScreen === 'game' && !game.dialogueActive && !game.combatActive) {
        update(delta);
        render();
    }

    requestAnimationFrame(gameLoop);
}

function update(delta) {
    // Handle movement
    let moved = false;
    if (game.keys['ArrowUp'] || game.keys['w']) {
        moved = game.player.move(0, -1, game.world);
    }
    if (game.keys['ArrowDown'] || game.keys['s']) {
        moved = game.player.move(0, 1, game.world);
    }
    if (game.keys['ArrowLeft'] || game.keys['a']) {
        moved = game.player.move(-1, 0, game.world);
    }
    if (game.keys['ArrowRight'] || game.keys['d']) {
        moved = game.player.move(1, 0, game.world);
    }

    if (moved) {
        // Check for nearby locations
        const location = game.world.getNearbyLocation(Math.floor(game.player.x), Math.floor(game.player.y));
        if (location) {
            updateLocationDisplay(location);
        } else {
            clearLocationDisplay();
        }

        // Regenerate energy slowly
        game.player.energy = Math.min(game.player.maxEnergy, game.player.energy + 0.01);
        updateUI();
    }

    // Update camera
    game.camera.x = game.player.x;
    game.camera.y = game.player.y;
}

function render() {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const viewWidth = Math.floor(canvas.width / TILE_SIZE);
    const viewHeight = Math.floor(canvas.height / TILE_SIZE);

    const startX = Math.floor(game.camera.x - viewWidth / 2);
    const startY = Math.floor(game.camera.y - viewHeight / 2);

    // Render tiles
    for (let y = 0; y < viewHeight + 1; y++) {
        for (let x = 0; x < viewWidth + 1; x++) {
            const worldX = startX + x;
            const worldY = startY + y;
            const tile = game.world.getTile(worldX, worldY);

            ctx.fillStyle = tile.color;
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

            // Draw location markers
            if (tile.location) {
                ctx.fillStyle = 'white';
                ctx.font = '20px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('⭐', x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2 + 7);
            }
        }
    }

    // Render NPCs
    game.npcs.forEach(npc => {
        const screenX = (npc.x - startX) * TILE_SIZE;
        const screenY = (npc.y - startY) * TILE_SIZE;

        if (screenX >= -TILE_SIZE && screenX <= canvas.width &&
            screenY >= -TILE_SIZE && screenY <= canvas.height) {
            ctx.fillStyle = npc.color;
            ctx.beginPath();
            ctx.arc(screenX + TILE_SIZE / 2, screenY + TILE_SIZE / 2, TILE_SIZE / 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'white';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('♥', screenX + TILE_SIZE / 2, screenY + TILE_SIZE / 2 + 4);
        }
    });

    // Render Enemies
    game.enemies.forEach(enemy => {
        const screenX = (enemy.x - startX) * TILE_SIZE;
        const screenY = (enemy.y - startY) * TILE_SIZE;

        if (screenX >= -TILE_SIZE && screenX <= canvas.width &&
            screenY >= -TILE_SIZE && screenY <= canvas.height) {
            ctx.fillStyle = enemy.color;
            ctx.beginPath();
            ctx.arc(screenX + TILE_SIZE / 2, screenY + TILE_SIZE / 2, TILE_SIZE / 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('×', screenX + TILE_SIZE / 2, screenY + TILE_SIZE / 2 + 4);
        }
    });

    // Render player
    const playerScreenX = (game.player.x - startX) * TILE_SIZE;
    const playerScreenY = (game.player.y - startY) * TILE_SIZE;

    ctx.fillStyle = game.player.color;
    ctx.beginPath();
    ctx.arc(playerScreenX + TILE_SIZE / 2, playerScreenY + TILE_SIZE / 2, TILE_SIZE / 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('★', playerScreenX + TILE_SIZE / 2, playerScreenY + TILE_SIZE / 2 + 6);
}

function handleGameInput(key) {
    if (key === ' ') {
        checkInteractions();
    }
}

function checkInteractions() {
    const px = Math.floor(game.player.x);
    const py = Math.floor(game.player.y);

    // Check NPCs
    for (let npc of game.npcs) {
        const dist = Math.sqrt((npc.x - px) ** 2 + (npc.y - py) ** 2);
        if (dist <= 1.5) {
            npc.interact(game.player);

            // Progress quest if talking to icon
            if (npc.type === 'icon' && !npc.talked) {
                npc.talked = true;
                const quest = game.quests.find(q => q.id === 'main-2');
                if (quest && quest.status === 'active') {
                    quest.progress++;
                    updateUI();
                    quest.checkProgress();
                }
            }
            return;
        }
    }

    // Check Enemies
    for (let enemy of game.enemies) {
        if (enemy.health <= 0) continue;

        const dist = Math.sqrt((enemy.x - px) ** 2 + (enemy.y - py) ** 2);
        if (dist <= 1.5) {
            enemy.initiateCombat(game.player);
            return;
        }
    }

    // Check location
    const location = game.world.getNearbyLocation(px, py, 1);
    if (location) {
        visitLocation(location);
    }
}

function visitLocation(location) {
    addMessage(`You are at ${location.name}`, 'info');
    addMessage(location.description, 'info');

    const quest = game.quests.find(q => q.id === 'side-1');
    if (quest && quest.status === 'active') {
        // Check if this is a new location
        if (!location.visited) {
            location.visited = true;
            quest.progress++;
            updateUI();
            quest.checkProgress();
        }
    }

    if (location.type === 'safe-haven') {
        game.player.hope = Math.min(game.player.maxHope, game.player.hope + 10);
        game.player.energy = game.player.maxEnergy;
        addMessage('You feel safe and recharged here', 'success');
        updateUI();

        const quest1 = game.quests.find(q => q.id === 'main-1');
        if (quest1 && quest1.status === 'active' && quest1.progress === 0) {
            quest1.progress = 1;
            updateUI();
            quest1.checkProgress();
        }
    }
}

function updateLocationDisplay(location) {
    const display = document.getElementById('location-display');
    display.textContent = location.name;
    display.style.display = 'block';
}

function clearLocationDisplay() {
    const display = document.getElementById('location-display');
    display.style.display = 'none';
}

// Dialogue System
function showDialogue(speaker, text, options) {
    const modal = document.getElementById('dialogue-modal');
    document.getElementById('dialogue-speaker').textContent = speaker;
    document.getElementById('dialogue-text').textContent = text;

    const optionsContainer = document.getElementById('dialogue-options');
    optionsContainer.innerHTML = '';

    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'dialogue-option';
        btn.textContent = option.text;
        btn.addEventListener('click', option.action);
        optionsContainer.appendChild(btn);
    });

    modal.classList.add('active');
}

function closeDialogue() {
    document.getElementById('dialogue-modal').classList.remove('active');
    game.dialogueActive = false;
}

// Combat System
function startCombat(enemy) {
    const modal = document.getElementById('combat-modal');

    document.getElementById('player-combat-name').textContent = game.player.name;
    document.getElementById('enemy-combat-name').textContent = enemy.name;

    updateCombatUI(enemy);

    const combatLog = document.getElementById('combat-log');
    combatLog.innerHTML = `<div class="combat-message">${enemy.dialogue}</div>`;
    combatLog.innerHTML += `<div class="combat-message">Battle started!</div>`;

    // Setup combat buttons
    document.getElementById('attack-btn').onclick = () => performAttack(enemy);
    document.getElementById('special-btn').onclick = () => performSpecial(enemy);
    document.getElementById('defend-btn').onclick = () => performDefend(enemy);
    document.getElementById('flee-btn').onclick = () => performFlee(enemy);

    modal.classList.add('active');
}

function updateCombatUI(enemy) {
    document.getElementById('player-combat-health').textContent =
        `Health: ${Math.round(game.player.health)}/${game.player.maxHealth}`;
    document.getElementById('player-health-bar').style.width =
        `${(game.player.health / game.player.maxHealth) * 100}%`;

    document.getElementById('enemy-combat-health').textContent =
        `Health: ${Math.round(enemy.health)}/${enemy.maxHealth}`;
    document.getElementById('enemy-health-bar').style.width =
        `${(enemy.health / enemy.maxHealth) * 100}%`;
}

function logCombat(message) {
    const log = document.getElementById('combat-log');
    const msg = document.createElement('div');
    msg.className = 'combat-message';
    msg.textContent = message;
    log.appendChild(msg);
    log.scrollTop = log.scrollHeight;
}

function performAttack(enemy) {
    const damage = 10 + game.player.skills.advocacy * 2 + Math.floor(Math.random() * 10);
    enemy.health -= damage;

    logCombat(`You debate with facts and compassion for ${damage} damage!`);

    if (enemy.health <= 0) {
        winCombat(enemy);
        return;
    }

    enemyTurn(enemy);
}

function performSpecial(enemy) {
    if (game.player.energy < 30) {
        logCombat('Not enough energy for special ability!');
        return;
    }

    game.player.energy -= 30;
    const damage = 20 + game.player.skills.knowledge * 3 + game.player.skills.courage * 2;
    enemy.health -= damage;

    logCombat(`You unleash your knowledge and courage for ${damage} damage!`);
    updateUI();

    if (enemy.health <= 0) {
        winCombat(enemy);
        return;
    }

    enemyTurn(enemy);
}

function performDefend(enemy) {
    logCombat('You steel yourself with resilience!');
    game.player.health += 10;
    if (game.player.health > game.player.maxHealth) {
        game.player.health = game.player.maxHealth;
    }

    updateCombatUI(enemy);
    updateUI();

    enemyTurn(enemy, 0.5); // Enemy does half damage
}

function performFlee(enemy) {
    if (Math.random() < 0.5) {
        logCombat('You successfully retreat to fight another day!');
        setTimeout(() => {
            endCombat();
        }, 1000);
    } else {
        logCombat('Escape failed!');
        enemyTurn(enemy);
    }
}

function enemyTurn(enemy, damageMultiplier = 1) {
    setTimeout(() => {
        const damage = Math.floor((enemy.attack - game.player.skills.resilience) * damageMultiplier);
        const actualDamage = Math.max(5, damage);

        game.player.health -= actualDamage;

        logCombat(`${enemy.name} attacks with hate for ${actualDamage} damage!`);
        updateCombatUI(enemy);
        updateUI();

        if (game.player.health <= 0) {
            loseCombat();
        }
    }, 800);
}

function winCombat(enemy) {
    logCombat(`Victory! ${enemy.name} has been defeated!`);

    game.player.gainXP(enemy.xpReward);
    game.player.addItem(enemy.loot);
    game.player.hope = Math.min(game.player.maxHope, game.player.hope + 15);

    // Progress quest
    const quest = game.quests.find(q => q.id === 'main-3');
    if (quest && quest.status === 'active') {
        quest.progress++;
        updateUI();
        quest.checkProgress();
    }

    setTimeout(() => {
        endCombat();
    }, 2000);
}

function loseCombat() {
    logCombat('You\'ve been overwhelmed... but this isn\'t the end.');

    setTimeout(() => {
        game.player.health = game.player.maxHealth / 2;
        game.player.hope = Math.max(0, game.player.hope - 20);
        game.player.x = 50;
        game.player.y = 50;

        addMessage('You wake up in a safe place. The fight continues.', 'warning');
        updateUI();
        endCombat();
    }, 2000);
}

function endCombat() {
    document.getElementById('combat-modal').classList.remove('active');
    game.combatActive = false;
    game.currentEnemy = null;
}

// Quest System
function completeQuest(questId) {
    const quest = game.quests.find(q => q.id === questId);
    if (!quest || quest.status === 'completed') return;

    quest.status = 'completed';

    addMessage(`Quest Completed: ${quest.title}!`, 'success');

    if (quest.reward.xp) {
        game.player.gainXP(quest.reward.xp);
    }
    if (quest.reward.item) {
        game.player.addItem(quest.reward.item);
    }
    if (quest.reward.hope) {
        game.player.hope = Math.min(game.player.maxHope, game.player.hope + quest.reward.hope);
    }

    updateUI();
}

// UI Updates
function updateUI() {
    // Top bar
    document.getElementById('char-level').textContent = `Level ${game.player.level}`;
    document.getElementById('health-display').textContent =
        `${Math.round(game.player.health)}/${game.player.maxHealth}`;
    document.getElementById('energy-display').textContent =
        `${Math.round(game.player.energy)}/${game.player.maxEnergy}`;
    document.getElementById('hope-display').textContent =
        `${Math.round(game.player.hope)}/${game.player.maxHope}`;

    // Quests
    const questList = document.getElementById('quest-list');
    questList.innerHTML = '';
    game.quests.forEach(quest => {
        const div = document.createElement('div');
        div.className = `quest-item quest-${quest.status}`;
        div.innerHTML = `
            <strong>${quest.title}</strong><br>
            ${quest.description}<br>
            <small>Progress: ${quest.progress}/${quest.goal}</small>
        `;
        questList.appendChild(div);
    });

    // Skills
    const skillsDisplay = document.getElementById('skills-display');
    skillsDisplay.innerHTML = '';
    for (let skill in game.player.skills) {
        const div = document.createElement('div');
        div.className = 'skill-display-item';
        div.innerHTML = `
            <strong>${skill.charAt(0).toUpperCase() + skill.slice(1)}:</strong> ${game.player.skills[skill]}
        `;
        skillsDisplay.appendChild(div);
    }

    // Inventory
    const inventoryDisplay = document.getElementById('inventory-display');
    inventoryDisplay.innerHTML = '';
    game.player.inventory.forEach(item => {
        const div = document.createElement('div');
        div.className = 'inventory-item';
        div.innerHTML = `
            <strong>${item.name}</strong><br>
            <small>${item.description}</small>
        `;
        inventoryDisplay.appendChild(div);
    });
}

function addMessage(text, type = 'info') {
    const log = document.getElementById('message-log');
    const msg = document.createElement('div');
    msg.className = `message message-${type}`;
    msg.textContent = text;
    log.appendChild(msg);
    log.scrollTop = log.scrollHeight;

    // Keep only last 10 messages
    while (log.children.length > 10) {
        log.removeChild(log.firstChild);
    }
}

// Start the game when page loads
window.addEventListener('load', init);
