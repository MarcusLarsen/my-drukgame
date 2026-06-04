import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Action = 'do' | 'drink' | 'skip';

export type Player = {
  id: string;
  name: string;
};

export type Card = {
  id: string;
  text: string;
  category: 'soft' | 'party' | 'spicy';
  level: 1 | 2 | 3;
  target: 'all' | 'one' | 'vote' | 'rule' | 'duel';
};

export type ChaosRule = {
  id: string;
  text: string;
  turnsLeft: number;
  rarity: 'common' | 'rare' | 'legendary';
};

type HistoryItem = {
  cardId: string;
  action: Action;
  playerIds?: string[];
};

export type Screen = 'setup' | 'mode' | 'game' | 'bottle';
export type GameMode = 'normal' | 'chaos' | 'spicy';

type SessionState = {
  screen: Screen;
  gameMode: GameMode;
  started: boolean;

  players: Player[];
  deck: Card[];
  customCards: Card[];

  currentIndex: number;
  currentCard: Card | null;

  history: HistoryItem[];
  chaosRules: ChaosRule[];

  setScreen: (screen: Screen) => void;
  setGameMode: (mode: GameMode) => void;
  setPlayers: (names: string[]) => void;

  loadDeck: (cards: Card[]) => void;
  act: (action: Action, playerIds?: string[]) => void;
  undo: () => void;
  reset: () => void;

  addChaosRule: (rule: ChaosRule) => void;
  addCustomCard: (card: Card) => void;
  removeCustomCard: (id: string) => void;
};

function prepareCard(card: Card | undefined, players: Player[]): Card | null {
  if (!card) return null;

  let text = card.text;

  if (text.includes('{NAME2}') && players.length >= 2) {
    const shuffled = [...players].sort(() => Math.random() - 0.5);

    text = text
      .replace('{NAME}', shuffled[0].name)
      .replace('{NAME2}', shuffled[1].name);
  } else if (text.includes('{NAME}') && players.length > 0) {
    const p = players[Math.floor(Math.random() * players.length)];
    text = text.replace('{NAME}', p.name);
  }

  return {
    ...card,
    text,
  };
}

export const useSession = create<SessionState>()(
  persist(
    (set, get) => ({
      screen: 'setup',
      gameMode: 'normal',
      started: false,

      players: [],
      deck: [],
      customCards: [],

      currentIndex: 0,
      currentCard: null,

      history: [],
      chaosRules: [],

      setScreen: (screen) => set({ screen }),

      setGameMode: (gameMode) => set({ gameMode }),

      setPlayers: (names) =>
        set({
          players: names
            .map((n, i) => ({
              id: `p${i}`,
              name: n.trim(),
            }))
            .filter((p) => p.name.length > 0),
        }),

      loadDeck: (cards) => {
        const shuffled = [...cards].sort(() => Math.random() - 0.5);
        const firstCard = prepareCard(shuffled[0], get().players);

        set({
          deck: shuffled,
          currentIndex: 0,
          currentCard: firstCard,
          history: [],
          chaosRules: [],
          started: true,
        });
      },

      act: (action, playerIds) => {
        const s = get();

        const nextIndex = s.currentIndex + 1;
        const nextCard = prepareCard(s.deck[nextIndex], s.players);

        set({
          history: [
            ...s.history,
            {
              cardId: s.currentCard?.id ?? '',
              action,
              playerIds,
            },
          ],

          currentIndex: nextIndex,
          currentCard: nextCard,

          chaosRules: s.chaosRules
            .map((rule) => ({
              ...rule,
              turnsLeft: rule.turnsLeft - 1,
            }))
            .filter((rule) => rule.turnsLeft > 0),
        });
      },

      undo: () =>
        set((s) => {
          if (s.currentIndex === 0) return s;

          const previousIndex = s.currentIndex - 1;
          const previousCard = prepareCard(s.deck[previousIndex], s.players);

          return {
            ...s,
            currentIndex: previousIndex,
            currentCard: previousCard,
            history: s.history.slice(0, -1),
          };
        }),

      reset: () =>
        set((s) => ({
          ...s,
          screen: 'setup',
          gameMode: 'normal',
          started: false,
          deck: [],
          currentIndex: 0,
          currentCard: null,
          history: [],
          chaosRules: [],
        })),

      addChaosRule: (rule) =>
        set((s) => ({
          chaosRules: [...s.chaosRules, rule],
        })),

      addCustomCard: (card) =>
        set((s) => ({
          customCards: [...s.customCards, card],
        })),

      removeCustomCard: (id) =>
        set((s) => ({
          customCards: s.customCards.filter((c) => c.id !== id),
        })),
    }),
    {
      name: 'drukgame-session',
      partialize: (state) => ({
        players: state.players,
        customCards: state.customCards,
      }),
    }
  )
);