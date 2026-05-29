import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../store/session';
import soft from '../data/deck/soft.json';
import party from '../data/deck/party.json';
import spicy from '../data/deck/spicy.json';
import duel from '../data/deck/dual.json';
import type { Action, Card, ChaosRule } from '../store/session';
import {
  commonChaosRules,
  rareChaosRules,
  legendaryChaosRules,
} from '../data/chaosRules';

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
      turnsLeft: 4,
      rarity: 'legendary',
    };
  }

  if (roll < 0.15) {
    const text =
      rareChaosRules[Math.floor(Math.random() * rareChaosRules.length)];

    return {
      id: crypto.randomUUID(),
      text,
      turnsLeft: 3,
      rarity: 'rare',
    };
  }

  const text =
    commonChaosRules[Math.floor(Math.random() * commonChaosRules.length)];

  return {
    id: crypto.randomUUID(),
    text,
    turnsLeft: 2,
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

      if (mode === 'normal' || mode === 'chaos') {
        filtered = fullDeck.filter((c) => c.category !== 'spicy');
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
    gameMode === 'chaos' ? '🔥' : gameMode === 'spicy' ? '🌶️' : '🍺';

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
              {modeEmoji} {gameMode.toUpperCase()} •{' '}
              {currentCard.category.toUpperCase()}
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