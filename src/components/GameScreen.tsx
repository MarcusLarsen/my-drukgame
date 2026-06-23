import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../store/session';
import soft from '../data/deck/soft.json';
import party from '../data/deck/party.json';
import spicy from '../data/deck/spicy.json';
import duel from '../data/deck/duel.json';
import type { Action, Card, ChaosRule } from '../store/session';
import {
  commonChaosRules,
  rareChaosRules,
  legendaryChaosRules,
} from '../data/chaosRules';

const teamCards: Card[] = [
  {
    id: 't1',
    text: '{TEAM1} tager 2 slurke.',
    category: 'team',
    level: 1,
    target: 'team',
  },
  {
    id: 't2',
    text: '{TEAM2} tager 2 slurke.',
    category: 'team',
    level: 1,
    target: 'team',
  },
  {
    id: 't3',
    text: '{TEAM1} vælger én spiller fra {TEAM2}, som tager 3 slurke.',
    category: 'team',
    level: 2,
    target: 'team',
  },
  {
    id: 't4',
    text: '{TEAM2} vælger én spiller fra {TEAM1}, som tager 3 slurke.',
    category: 'team',
    level: 2,
    target: 'team',
  },
  {
    id: 't5',
    text: '{TEAM1PLAYER} og {TEAM2PLAYER} spiller sten-saks-papir. Taberens hold tager 2 slurke.',
    category: 'team',
    level: 2,
    target: 'team',
  },
  {
    id: 't6',
    text: 'Begge hold vælger en kaptajn. Kaptajnerne duellerer i sten-saks-papir. Taberholdet tager 3 slurke.',
    category: 'team',
    level: 2,
    target: 'team',
  },
  {
    id: 't7',
    text: 'Første hold der kan nævne 5 bilmærker vinder. Taberholdet tager 2 slurke.',
    category: 'team',
    level: 2,
    target: 'team',
  },
  {
    id: 't8',
    text: 'Første hold der kan nævne 5 lande vinder. Taberholdet tager 2 slurke.',
    category: 'team',
    level: 2,
    target: 'team',
  },
  {
    id: 't9',
    text: '{TEAM1} skal vælge én spiller, der mimer en film. Hvis holdet ikke gætter den på 20 sekunder, tager holdet 3 slurke.',
    category: 'team',
    level: 2,
    target: 'team',
  },
  {
    id: 't10',
    text: '{TEAM2} skal vælge én spiller, der mimer en film. Hvis holdet ikke gætter den på 20 sekunder, tager holdet 3 slurke.',
    category: 'team',
    level: 2,
    target: 'team',
  },
  {
    id: 't11',
    text: 'Alle på {TEAM1} giver highfive til hinanden. Langsomste spiller tager 2 slurke.',
    category: 'team',
    level: 1,
    target: 'team',
  },
  {
    id: 't12',
    text: 'Alle på {TEAM2} giver highfive til hinanden. Langsomste spiller tager 2 slurke.',
    category: 'team',
    level: 1,
    target: 'team',
  },
  {
    id: 't13',
    text: '{TEAM1PLAYER} skal give {TEAM2PLAYER} et kompliment. Hvis det er dårligt, tager {TEAM1} 2 slurke.',
    category: 'team',
    level: 2,
    target: 'team',
  },
  {
    id: 't14',
    text: '{TEAM2PLAYER} skal give {TEAM1PLAYER} et kompliment. Hvis det er dårligt, tager {TEAM2} 2 slurke.',
    category: 'team',
    level: 2,
    target: 'team',
  },
  {
    id: 't15',
    text: 'Begge hold vælger en spiller til duel. Den der kan holde seriøst ansigt længst vinder. Taberholdet tager 3 slurke.',
    category: 'team',
    level: 2,
    target: 'team',
  },
  {
    id: 't16',
    text: '{TEAM1} skal lave en fælles skål.',
    category: 'team',
    level: 1,
    target: 'team',
  },
  {
    id: 't17',
    text: '{TEAM2} skal lave en fælles skål.',
    category: 'team',
    level: 1,
    target: 'team',
  },
  {
    id: 't18',
    text: 'Det hold med færrest spillere tager 2 slurke. Ved lige mange tager begge hold 2 slurke.',
    category: 'team',
    level: 1,
    target: 'team',
  },
  {
    id: 't19',
    text: 'Hvert hold vælger den mest højlydte spiller på modstanderholdet. De valgte spillere tager 2 slurke.',
    category: 'team',
    level: 2,
    target: 'team',
  },
  {
    id: 't20',
    text: 'Første hold der kan nævne 5 ting man finder i et køkken vinder. Taberholdet tager 2 slurke.',
    category: 'team',
    level: 2,
    target: 'team',
  },
];

const baseDeck: Card[] = [
  ...soft,
  ...party,
  ...spicy,
  ...duel,
] as Card[];

function createChaosRule(): ChaosRule | null {
  const roll = Math.random();

  if (roll > 0.35) return null;

  if (roll < 0.05) {
    const text =
      legendaryChaosRules[
        Math.floor(Math.random() * legendaryChaosRules.length)
      ];

    return {
      id: crypto.randomUUID(),
      text,
      turnsLeft: 5,
      rarity: 'legendary',
    };
  }

  if (roll < 0.15) {
    const text =
      rareChaosRules[Math.floor(Math.random() * rareChaosRules.length)];

    return {
      id: crypto.randomUUID(),
      text,
      turnsLeft: 4,
      rarity: 'rare',
    };
  }

  const text =
    commonChaosRules[Math.floor(Math.random() * commonChaosRules.length)];

  return {
    id: crypto.randomUUID(),
    text,
    turnsLeft: 3,
    rarity: 'common',
  };
}

export default function GameScreen() {
  const {
    currentCard,
    currentIndex,
    act,
    undo,
    loadDeck,
    reset,
    gameMode,
    customCards,
    chaosRules,
    addChaosRule,
    history,
    teams,
  } = useSession();

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const currentDeck = useSession.getState().deck;
    const mode = useSession.getState().gameMode;

    if (currentDeck.length === 0) {
      const fullDeck = [...baseDeck, ...customCards];

      let filtered = [...fullDeck];

      if (mode === 'spicy') {
        filtered = fullDeck.filter(
          (c) => c.category === 'spicy' || c.target === 'duel'
        );
      }

      if (mode === 'normal') {
        filtered = fullDeck.filter(
          (c) => c.category !== 'spicy' && c.category !== 'team'
        );
      }

      if (mode === 'chaos') {
        filtered = fullDeck.filter(
          (c) => c.category !== 'soft' && c.category !== 'team'
        );
      }

      if (mode === 'teams') {
        filtered = teamCards;
      }

      loadDeck(filtered);
    }
  }, [loadDeck, gameMode, customCards]);

  function handleAction(action: Action) {
    if (gameMode === 'chaos') {
      const newRule = createChaosRule();

      if (newRule) {
        addChaosRule(newRule);
      }
    }

    act(action);
  }

  const modeEmoji =
    gameMode === 'chaos'
      ? '🔥'
      : gameMode === 'spicy'
      ? '🌶️'
      : gameMode === 'teams'
      ? '👥'
      : '🍺';

  const modeLabel =
    gameMode === 'teams'
      ? 'HOLD MODE'
      : gameMode.toUpperCase();

  const isGameOver = !currentCard && currentIndex > 0;

  const completed = history.filter((h) => h.action === 'do').length;
  const penalties = history.filter((h) => h.action === 'drink').length;
  const skipped = history.filter((h) => h.action === 'skip').length;

  if (isGameOver) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-slate-800 rounded-3xl p-8 flex flex-col items-center gap-6 shadow-2xl">
          <div className="text-3xl font-black text-center">
            🎮 Spillet er slut
          </div>

          <div className="text-slate-400 text-center">
            Alle kort er brugt
          </div>

          <div className="w-full bg-slate-900 rounded-2xl p-5 grid gap-2 text-center">
            <div>✅ Klaret: {completed}</div>
            <div>🍺 Tog straf: {penalties}</div>
            <div>⏭ Sprunget over: {skipped}</div>
            <div>📦 Kort brugt: {history.length}</div>
          </div>

          <button
            onClick={reset}
            className="bg-red-500 hover:bg-red-400 transition px-6 py-3 rounded-xl font-bold"
          >
            🔄 Start nyt spil
          </button>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p className="text-slate-400">Starter spil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-lg flex flex-col gap-6">
        {gameMode === 'teams' && teams.length >= 2 && (
          <div className="grid grid-cols-2 gap-3">
            {teams.map((team) => (
              <div
                key={team.id}
                className="bg-slate-800 rounded-2xl p-4 shadow-xl"
              >
                <div className="font-black text-lg">
                  {team.emoji} {team.name}
                </div>

                <div className="text-sm text-slate-400 mt-2">
                  {team.players.map((p) => p.name).join(', ')}
                </div>
              </div>
            ))}
          </div>
        )}

        {gameMode === 'chaos' && chaosRules.length > 0 && (
          <div className="bg-orange-500/10 border border-orange-500 rounded-2xl p-4">
            <h2 className="font-black text-orange-400 mb-2">
              🔥 Aktive Chaos-regler
            </h2>

            <div className="grid gap-2">
              {chaosRules.map((rule) => (
                <div
                  key={rule.id}
                  className="text-sm text-orange-100 flex justify-between gap-3"
                >
                  <span>{rule.text}</span>
                  <span className="text-orange-300 whitespace-nowrap">
                    {rule.turnsLeft} ture
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-slate-800 p-8 rounded-3xl shadow-2xl"
          >
            <div className="text-slate-400 mb-3">
              {modeEmoji} {modeLabel} • {currentCard.category.toUpperCase()}
            </div>

            <div className="text-3xl font-bold leading-relaxed">
              {currentCard.text}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="grid gap-3">
          <button
            onClick={() => handleAction('do')}
            className="bg-green-600 p-4 rounded-xl font-bold"
          >
            ✅ Næste kort
          </button>

          <button
            onClick={() => handleAction('drink')}
            className="bg-orange-500 p-4 rounded-xl font-bold"
          >
            🍺 Tog straf
          </button>

          <button
            onClick={() => handleAction('skip')}
            className="bg-slate-700 p-4 rounded-xl font-bold"
          >
            ⏭ Spring over
          </button>

          <button onClick={undo} className="text-white/60">
            ↩ Fortryd
          </button>
        </div>
      </div>
    </div>
  );
}