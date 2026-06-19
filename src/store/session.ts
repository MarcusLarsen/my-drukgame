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

export type CustomBottlePrompt = {
  id: string;
  text: string;
  category:
    | 'truth'
    | 'dare'
    | 'challenge'
    | 'drink'
    | 'dating';
};

type HistoryItem = {
  cardId: string;
  action: Action;
  playerIds?: string[];
};

export type Screen =
  | 'setup'
  | 'mode'
  | 'game'
  | 'bottleMode'
  | 'bottle'
  | 'king';

export type GameMode = 'normal' | 'chaos' | 'spicy';

export type BottleMode =
  | 'truth'
  | 'dare'
  | 'truthOrDare'
  | 'challenge'
  | 'drink'
  | 'dating';

type SessionState = {
  screen: Screen;
  gameMode: GameMode;
  bottleMode: BottleMode;
  started: boolean;

  players: Player[];
  deck: Card[];
  customCards: Card[];
  customBottlePrompts: CustomBottlePrompt[];

  currentIndex: number;
  currentCard: Card | null;

  history: HistoryItem[];
  chaosRules: ChaosRule[];

  setScreen: (screen: Screen) => void;
  setGameMode: (mode: GameMode) => void;
  setBottleMode: (mode: BottleMode) => void;
  setPlayers: (names: string[]) => void;

  loadDeck: (cards: Card[]) => void;
  act: (action: Action, playerIds?: string[]) => void;
  undo: () => void;
  reset: () => void;

  addChaosRule: (rule: ChaosRule) => void;
  addCustomCard: (card: Card) => void;
  removeCustomCard: (id: string) => void;

  addCustomBottlePrompt: (prompt: CustomBottlePrompt) => void;
  removeCustomBottlePrompt: (id: string) => void;
};

function prepareCard(
  card: Card | undefined,
  players: Player[]
): Card | null {
  if (!card) return null;

  let text = card.text;

  if (players.length > 0) {
    const shuffled = [...players].sort(() => Math.random() - 0.5);

    const p1 = shuffled[0];
    const p2 = shuffled[1] ?? shuffled[0];
    const p3 = shuffled[2] ?? shuffled[0];

    text = text
      .replaceAll('{NAME}', p1.name)
      .replaceAll('{NAME2}', p2.name)
      .replaceAll('{NAME3}', p3.name);
  }

  return {
    ...card,
    text,
  };
}

function prepareChaosText(text: string, players: Player[]): string {
  if (players.length === 0) return text;

  const shuffled = [...players].sort(() => Math.random() - 0.5);

  const p1 = shuffled[0];
  const p2 = shuffled[1] ?? shuffled[0];
  const p3 = shuffled[2] ?? shuffled[0];

  return text
    .replaceAll('{NAME}', p1.name)
    .replaceAll('{NAME2}', p2.name)
    .replaceAll('{NAME3}', p3.name);
}

export const useSession = create<SessionState>()(
  persist(
    (set, get) => ({
      screen: 'setup',
      gameMode: 'normal',
      bottleMode: 'truth',
      started: false,

      players: [],
      deck: [],
      customCards: [],
      customBottlePrompts: [],

      currentIndex: 0,
      currentCard: null,

      history: [],
      chaosRules: [],

      setScreen: (screen) => set({ screen }),

      setGameMode: (gameMode) => set({ gameMode }),

      setBottleMode: (bottleMode) => set({ bottleMode }),

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

        const preparedDeck = shuffled
          .map((card) => prepareCard(card, get().players))
          .filter((card): card is Card => card !== null);

        set({
          deck: preparedDeck,
          currentIndex: 0,
          currentCard: preparedDeck[0] ?? null,
          history: [],
          chaosRules: [],
          started: true,
        });
      },

      act: (action, playerIds) => {
        const s = get();

        const nextIndex = s.currentIndex + 1;
        const nextCard = s.deck[nextIndex] ?? null;

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

          return {
            ...s,
            currentIndex: previousIndex,
            currentCard: s.deck[previousIndex] ?? null,
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
          chaosRules: [
            ...s.chaosRules,
            {
              ...rule,
              text: prepareChaosText(rule.text, s.players),
            },
          ],
        })),

      addCustomCard: (card) =>
        set((s) => ({
          customCards: [...s.customCards, card],
        })),

      removeCustomCard: (id) =>
        set((s) => ({
          customCards: s.customCards.filter((c) => c.id !== id),
        })),

      addCustomBottlePrompt: (prompt) =>
        set((s) => ({
          customBottlePrompts: [
            ...s.customBottlePrompts,
            prompt,
          ],
        })),

      removeCustomBottlePrompt: (id) =>
        set((s) => ({
          customBottlePrompts:
            s.customBottlePrompts.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'drukgame-session-v5',
      partialize: (state) => ({
        players: state.players,
        customCards: state.customCards,
        customBottlePrompts: state.customBottlePrompts,
        bottleMode: state.bottleMode,
      }),
    }
  )
);