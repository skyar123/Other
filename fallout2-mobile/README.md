# Fallout 2: Wasteland Mobile

A mobile-optimized tribute to the classic Fallout 2 RPG, built with HTML5, CSS3, and vanilla JavaScript.

## Overview

Experience the post-apocalyptic wasteland in this mobile-friendly adaptation of Fallout 2. Create your character using the iconic S.P.E.C.I.A.L. system, explore dangerous locations, engage in turn-based combat, complete quests, and survive in the wasteland.

## Features

### Character Creation
- **S.P.E.C.I.A.L. Attributes System**
  - Strength: Raw physical power and melee damage
  - Perception: Sensory awareness and accuracy
  - Endurance: Stamina, health, and damage resistance
  - Charisma: Social influence and dialogue options
  - Intelligence: Mental acuity and skill points
  - Agility: Speed, reflexes, and Action Points
  - Luck: Fortune and critical hit chance

### Core Gameplay
- **Turn-Based Combat**: Strategic combat with Action Points (AP) system
  - Attack: Standard attack (3 AP)
  - Aimed Shot: High-accuracy critical hit (5 AP)
  - Use Item: Consume medical supplies
  - Run: Attempt to flee from battle

- **Exploration**: Discover new locations across the wasteland
  - Arroyo Village (Starting location)
  - Klamath
  - The Den
  - Vault City
  - New California Republic (NCR)

- **Quest System**: Complete missions to progress the story
  - Main Quest: Find the G.E.C.K. (Garden of Eden Creation Kit)
  - NPC interactions and dialogue trees
  - Multiple quest objectives

- **Inventory & Equipment**
  - Weapons: Spear, Pistol, Shotgun, and more
  - Armor: Tribal Outfit, Leather Armor, Combat Armor
  - Items: Stimpaks, Rad-X, Bottle Caps (currency)
  - Weight management system

### Game Systems
- **Experience & Leveling**: Gain XP from combat and level up
- **Health & Action Points**: Manage HP and AP during combat
- **Random Encounters**: Face enemies while exploring
  - Geckos, Giant Rats, Mantis
  - Radscorpions, Bandits, Slavers
- **NPC Dialogues**: Interact with characters like the Elder, Hakunin, and traders
- **Save System**: Auto-save with local storage (continue game option)

## How to Play

### Installation
1. Open `index.html` in any modern web browser
2. For mobile: Add to home screen for best experience

### Getting Started
1. **Start New Game**: Begin your wasteland adventure
2. **Create Character**:
   - Enter your name
   - Distribute 5 bonus points across S.P.E.C.I.A.L. attributes (start at 5 each)
   - Enter the wasteland
3. **Explore**: Use action buttons to interact with the world
   - 🔍 Explore: Search for loot, NPCs, or combat encounters
   - ⛺ Rest: Restore HP and AP
   - 🗺️ Travel: Move to different locations

### Combat Tips
- **Manage AP**: Each action costs Action Points
- **Use Cover**: Aimed shots deal more damage but cost more AP
- **Heal Wisely**: Use Stimpaks when HP is low
- **Know When to Run**: Fleeing is sometimes the best option

### Navigation Tabs
- **📊 Stats**: View your S.P.E.C.I.A.L. attributes and derived stats
- **🎒 Inventory**: Manage items and equipment
- **📋 Quests**: Track active and completed quests
- **🗺️ Map**: View discovered locations

## Technical Details

### Technologies Used
- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript (ES6+)
- LocalStorage for save data

### Mobile Optimization
- Responsive design for all screen sizes
- Touch-optimized controls
- No external dependencies
- Progressive Web App ready
- Optimized for portrait and landscape modes

### Browser Compatibility
- Chrome/Edge (recommended)
- Firefox
- Safari (iOS)
- Any modern mobile browser

## Game Design

### Visual Theme
- Pip-Boy inspired interface
- Retro-futuristic terminal aesthetic
- Vault-Tec green color scheme
- Post-apocalyptic wasteland atmosphere

### Gameplay Balance
- Starting stats: All S.P.E.C.I.A.L. at 5 with 5 bonus points
- Base HP: 50 + (Endurance × 10) + (Strength × 2)
- Base AP: 5 + (Agility ÷ 2)
- Enemy scaling based on location
- XP required per level: Level × 100

## Credits

Inspired by Fallout 2 by Black Isle Studios and Interplay Entertainment.
This is a fan-made tribute project for educational and entertainment purposes.

## License

This project is a non-commercial fan tribute. All Fallout-related trademarks and copyrights belong to their respective owners.

---

**War. War never changes.**

*But now you can experience it on your phone.*
