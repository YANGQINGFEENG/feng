import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 类型定义
export interface Skill {
  id: string;
  name: string;
  level: number;
  description: string;
  effects: any[];
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  stats: Record<string, number>;
  rarity: string;
}

export interface Item {
  id: string;
  name: string;
  type: string;
  value: number;
  effects: any[];
  quantity: number;
  position?: { x: number; y: number; z: number };
}

export interface Inventory {
  items: Item[];
  capacity: number;
}

export interface Player {
  id: string;
  name: string;
  level: number;
  experience: number;
  health: number;
  energy: number;
  skills: Skill[];
  equipment: Equipment[];
  inventory: Inventory;
}

export interface Enemy {
  id: string;
  name: string;
  health: number;
  damage: number;
  type: string;
  position: { x: number; y: number; z: number };
}

export interface ExtractionPoint {
  id: string;
  position: { x: number; y: number; z: number };
  activationTime: number;
  isActive: boolean;
}

export interface Room {
  id: string;
  position: { x: number; y: number; z: number };
  enemies: Enemy[];
  items: Item[];
  extractionPoint: ExtractionPoint | null;
}

export interface Dungeon {
  id: string;
  name: string;
  difficulty: number;
  rooms: Room[];
  timeLimit: number;
}

export type GameStatus = 'idle' | 'playing' | 'extracting' | 'completed' | 'failed';

export interface GameState {
  currentDungeon: Dungeon | null;
  players: Player[];
  currentPlayer: Player | null;
  isExtractionActive: boolean;
  timeRemaining: number;
  gameStatus: GameStatus;
  // 动作
  createCharacter: (name: string) => void;
  startDungeon: (dungeonId: string) => void;
  movePlayer: (position: { x: number; y: number; z: number }) => void;
  attackEnemy: (enemyId: string) => void;
  collectItem: (itemId: string) => void;
  activateExtraction: () => void;
  completeExtraction: () => void;
  failExtraction: () => void;
  levelUpSkill: (skillId: string) => void;
  saveGame: () => void;
  loadGame: () => void;
}

// 初始技能
const initialSkills: Skill[] = [
  {
    id: 'skill1',
    name: 'Assault Rifle Mastery',
    level: 1,
    description: 'Increases assault rifle damage by 10%',
    effects: [{ type: 'damage', value: 0.1 }]
  },
  {
    id: 'skill2',
    name: 'Shield Enhancement',
    level: 1,
    description: 'Increases shield capacity by 15%',
    effects: [{ type: 'shield', value: 0.15 }]
  },
  {
    id: 'skill3',
    name: 'Stealth Training',
    level: 1,
    description: 'Reduces enemy detection range by 20%',
    effects: [{ type: 'stealth', value: 0.2 }]
  }
];

// 初始装备
const initialEquipment: Equipment[] = [
  {
    id: 'eq1',
    name: 'Basic Assault Rifle',
    type: 'weapon',
    stats: { damage: 10, accuracy: 80 },
    rarity: 'common'
  },
  {
    id: 'eq2',
    name: 'Standard Shield',
    type: 'armor',
    stats: { defense: 5 },
    rarity: 'common'
  }
];

// 初始地牢
const initialDungeon: Dungeon = {
  id: 'dungeon1',
  name: 'Alpha Facility',
  difficulty: 1,
  rooms: [
    {
      id: 'room1',
      position: { x: 0, y: 0, z: 0 },
      enemies: [
        {
          id: 'enemy1',
          name: 'Security Drone',
          health: 50,
          damage: 5,
          type: 'drone',
          position: { x: 10, y: 0, z: 10 }
        }
      ],
      items: [
        {
          id: 'item1',
          name: 'Energy Cell',
          type: 'consumable',
          value: 10,
          effects: [{ type: 'energy', value: 20 }],
          quantity: 1
        }
      ],
      extractionPoint: null
    },
    {
      id: 'room2',
      position: { x: 20, y: 0, z: 0 },
      enemies: [
        {
          id: 'enemy2',
          name: 'Security Bot',
          health: 100,
          damage: 8,
          type: 'bot',
          position: { x: 30, y: 0, z: 0 }
        }
      ],
      items: [
        {
          id: 'item2',
          name: 'Health Pack',
          type: 'consumable',
          value: 15,
          effects: [{ type: 'health', value: 30 }],
          quantity: 1
        }
      ],
      extractionPoint: {
        id: 'ext1',
        position: { x: 35, y: 0, z: 0 },
        activationTime: 30,
        isActive: false
      }
    }
  ],
  timeLimit: 600 // 10分钟
};

// 创建游戏状态管理
export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      currentDungeon: null,
      players: [],
      currentPlayer: null,
      isExtractionActive: false,
      timeRemaining: 0,
      gameStatus: 'idle',

      createCharacter: (name) => {
        const newPlayer: Player = {
          id: `player_${Date.now()}`,
          name,
          level: 1,
          experience: 0,
          health: 100,
          energy: 100,
          skills: initialSkills,
          equipment: initialEquipment,
          inventory: {
            items: [],
            capacity: 20
          }
        };
        set({ currentPlayer: newPlayer, players: [newPlayer] });
      },

      startDungeon: (dungeonId) => {
        set({
          currentDungeon: initialDungeon,
          timeRemaining: initialDungeon.timeLimit,
          gameStatus: 'playing'
        });
      },

      movePlayer: (position) => {
        set((state) => ({
          players: state.players.map(player => 
            player.id === state.currentPlayer?.id 
              ? { ...player, position } 
              : player
          ),
          currentPlayer: state.currentPlayer 
            ? { ...state.currentPlayer, position } 
            : null
        }));
      },

      attackEnemy: (enemyId) => {
        set((state) => {
          if (!state.currentDungeon) return state;
          
          const updatedRooms = state.currentDungeon.rooms.map(room => {
            const updatedEnemies = room.enemies.map(enemy => {
              if (enemy.id === enemyId) {
                const newHealth = enemy.health - 20; // 假设基础伤害为20
                return { ...enemy, health: newHealth };
              }
              return enemy;
            }).filter(enemy => enemy.health > 0);
            return { ...room, enemies: updatedEnemies };
          });
          
          return {
            currentDungeon: {
              ...state.currentDungeon,
              rooms: updatedRooms
            }
          };
        });
      },

      collectItem: (itemId) => {
        set((state) => {
          if (!state.currentPlayer || !state.currentDungeon) return state;
          
          let collectedItem: Item | null = null;
          const updatedRooms = state.currentDungeon.rooms.map(room => {
            const updatedItems = room.items.filter(item => {
              if (item.id === itemId) {
                collectedItem = item;
                return false;
              }
              return true;
            });
            return { ...room, items: updatedItems };
          });
          
          if (!collectedItem) return state;
          
          const updatedInventory = {
            ...state.currentPlayer.inventory,
            items: [...state.currentPlayer.inventory.items, collectedItem]
          };
          
          const updatedPlayer = {
            ...state.currentPlayer,
            inventory: updatedInventory
          };
          
          return {
            currentDungeon: {
              ...state.currentDungeon,
              rooms: updatedRooms
            },
            currentPlayer: updatedPlayer,
            players: state.players.map(player => 
              player.id === updatedPlayer.id ? updatedPlayer : player
            )
          };
        });
      },

      activateExtraction: () => {
        set((state) => {
          if (!state.currentDungeon) return state;
          
          const updatedRooms = state.currentDungeon.rooms.map(room => {
            if (room.extractionPoint) {
              return {
                ...room,
                extractionPoint: {
                  ...room.extractionPoint,
                  isActive: true
                }
              };
            }
            return room;
          });
          
          return {
            currentDungeon: {
              ...state.currentDungeon,
              rooms: updatedRooms
            },
            isExtractionActive: true,
            gameStatus: 'extracting'
          };
        });
      },

      completeExtraction: () => {
        set((state) => {
          if (!state.currentPlayer) return state;
          
          const updatedPlayer = {
            ...state.currentPlayer,
            experience: state.currentPlayer.experience + 100
          };
          
          return {
            gameStatus: 'completed',
            currentPlayer: updatedPlayer,
            players: state.players.map(player => 
              player.id === updatedPlayer.id ? updatedPlayer : player
            )
          };
        });
      },

      failExtraction: () => {
        set((state) => {
          if (!state.currentPlayer) return state;
          
          // 失败时失去一半物品
          const halfItems = state.currentPlayer.inventory.items.slice(
            0, 
            Math.floor(state.currentPlayer.inventory.items.length / 2)
          );
          
          const updatedPlayer = {
            ...state.currentPlayer,
            inventory: {
              ...state.currentPlayer.inventory,
              items: halfItems
            }
          };
          
          return {
            gameStatus: 'failed',
            currentPlayer: updatedPlayer,
            players: state.players.map(player => 
              player.id === updatedPlayer.id ? updatedPlayer : player
            )
          };
        });
      },

      levelUpSkill: (skillId) => {
        set((state) => {
          if (!state.currentPlayer) return state;
          
          const updatedSkills = state.currentPlayer.skills.map(skill => {
            if (skill.id === skillId) {
              return {
                ...skill,
                level: skill.level + 1
              };
            }
            return skill;
          });
          
          const updatedPlayer = {
            ...state.currentPlayer,
            skills: updatedSkills
          };
          
          return {
            currentPlayer: updatedPlayer,
            players: state.players.map(player => 
              player.id === updatedPlayer.id ? updatedPlayer : player
            )
          };
        });
      },

      saveGame: () => {
        // Zustand persist 会自动处理保存
      },

      loadGame: () => {
        // Zustand persist 会自动处理加载
      }
    }),
    {
      name: 'game-storage',
      partialize: (state) => ({
        currentPlayer: state.currentPlayer,
        players: state.players
      })
    }
  )
);
