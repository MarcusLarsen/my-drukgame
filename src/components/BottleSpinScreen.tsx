import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSession } from '../store/session';
import {
  truthPrompts,
  darePrompts,
  challengePrompts,
  drinkPrompts,
  datingPrompts,
} from '../data/bottlePrompts';

function randomFrom(list: string[]) {
  return list[Math.floor(Math.random() * list.length)];
}

export default function BottleSpinScreen() {
  const players = useSession((s) => s.players);
  const setScreen = useSession((s) => s.setScreen);
  const bottleMode = useSession((s) => s.bottleMode);

  const [rotation, setRotation] = useState(0);
  const [selectedPlayer, setSelectedPlayer] =
    useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [truthOrDareChoice, setTruthOrDareChoice] =
    useState<'truth' | 'dare' | null>(null);

  function getPrompt() {
    if (bottleMode === 'truth') return randomFrom(truthPrompts);
    if (bottleMode === 'dare') return randomFrom(darePrompts);
    if (bottleMode === 'challenge') return randomFrom(challengePrompts);
    if (bottleMode === 'drink') return randomFrom(drinkPrompts);
    if (bottleMode === 'dating') return randomFrom(datingPrompts);

    return null;
  }

  function chooseTruth() {
    setTruthOrDareChoice('truth');
    setPrompt(randomFrom(truthPrompts));
  }

  function chooseDare() {
    setTruthOrDareChoice('dare');
    setPrompt(randomFrom(darePrompts));
  }

  function getModeTitle() {
    if (bottleMode === 'truth') return '😇 Sandhed';
    if (bottleMode === 'dare') return '🔥 Konsekvens';
    if (bottleMode === 'truthOrDare') return '😈 Sandhed eller Konsekvens';
    if (bottleMode === 'challenge') return '🎯 Udfordringer';
    if (bottleMode === 'drink') return '🍺 Druk Flaske';
    if (bottleMode === 'dating') return '💘 Dating / Flirt';

    return '🍾 Flaskehalsen peger på';
  }

  function spinBottle() {
    if (players.length === 0 || isSpinning) return;

    setIsSpinning(true);
    setSelectedPlayer(null);
    setPrompt(null);
    setTruthOrDareChoice(null);

    const randomIndex = Math.floor(
      Math.random() * players.length
    );

    const degreesPerPlayer = 360 / players.length;
    const playerAngle = randomIndex * degreesPerPlayer;

    const currentRotation = rotation % 360;
    const extraSpins = 360 * 6;

    const finalRotation =
      rotation -
      currentRotation +
      extraSpins +
      playerAngle;

    setRotation(finalRotation);

    setTimeout(() => {
      setSelectedPlayer(players[randomIndex].name);

      if (bottleMode !== 'truthOrDare') {
        setPrompt(getPrompt());
      }

      setIsSpinning(false);
    }, 2200);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 gap-6">
      <h1 className="text-4xl font-black text-center">
        {getModeTitle()}
      </h1>

      <div className="relative w-80 h-80 rounded-full border border-slate-700 flex items-center justify-center">
        {players.map((player, index) => {
          const angle =
            (360 / players.length) * index;

          return (
            <div
              key={player.id}
              className={`absolute text-sm font-bold transition ${
                selectedPlayer === player.name
                  ? 'text-green-400 scale-125'
                  : 'text-white'
              }`}
              style={{
                transform: `rotate(${angle}deg) translateY(-145px) rotate(-${angle}deg)`,
              }}
            >
              {player.name}
            </div>
          );
        })}

        <motion.div
          animate={{ rotate: rotation }}
          transition={{
            duration: 2.2,
            ease: 'easeOut',
          }}
          className="w-36 h-36 flex items-center justify-center"
        >
          <svg
            viewBox="0 0 220 220"
            className="w-36 h-36 drop-shadow-2xl"
          >
            <g transform="rotate(0 110 110)">
              <ellipse cx="110" cy="190" rx="38" ry="8" fill="#000000" opacity="0.25" />

              <path
                d="
                  M78 78
                  C78 62 88 56 92 46
                  L92 25
                  C92 19 98 15 110 15
                  C122 15 128 19 128 25
                  L128 46
                  C132 56 142 62 142 78
                  L154 162
                  C157 184 142 196 110 196
                  C78 196 63 184 66 162
                  Z
                "
                fill="#5b2f16"
                stroke="#2a1409"
                strokeWidth="5"
              />

              <path
                d="M93 35 C84 68 82 122 78 166"
                stroke="#fef3c7"
                strokeWidth="6"
                opacity="0.25"
                strokeLinecap="round"
              />

              <path
                d="M94 24 H126 V55 C121 60 99 60 94 55 Z"
                fill="#3b1d0c"
                opacity="0.9"
              />

              <rect
                x="88"
                y="6"
                width="44"
                height="18"
                rx="5"
                fill="#d6b84f"
                stroke="#fef3c7"
                strokeWidth="3"
              />

              {[94, 102, 110, 118, 126].map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1="8"
                  x2={x}
                  y2="22"
                  stroke="#8a6f1e"
                  strokeWidth="2"
                  opacity="0.7"
                />
              ))}

              <path
                d="M86 70 L134 60 L138 78 L90 88 Z"
                fill="#16a34a"
                stroke="#f9fafb"
                strokeWidth="3"
              />

              <path
                d="M88 74 L136 64"
                stroke="#ef4444"
                strokeWidth="7"
              />

              <text
                x="111"
                y="78"
                textAnchor="middle"
                fontSize="13"
                fontWeight="900"
                fill="white"
                transform="rotate(-12 111 78)"
              >
                DRUK
              </text>

              <ellipse
                cx="110"
                cy="134"
                rx="42"
                ry="48"
                fill="#f8fafc"
                stroke="#d6b84f"
                strokeWidth="5"
              />

              <ellipse
                cx="110"
                cy="137"
                rx="34"
                ry="38"
                fill="#166534"
                stroke="#fef3c7"
                strokeWidth="4"
              />

              <path
                d="M76 126 C96 114 124 114 144 126 L139 143 C122 132 98 132 81 143 Z"
                fill="#dc2626"
                stroke="#fef2f2"
                strokeWidth="2"
              />

              <text
                x="110"
                y="139"
                textAnchor="middle"
                fontSize="18"
                fontWeight="900"
                fill="white"
              >
                PARTY
              </text>

              <text
                x="110"
                y="158"
                textAnchor="middle"
                fontSize="12"
                fontWeight="800"
                fill="#fde68a"
              >
                CLASSIC
              </text>

              <circle
                cx="110"
                cy="103"
                r="12"
                fill="#fef3c7"
                stroke="#d6b84f"
                strokeWidth="3"
              />

              <text
                x="110"
                y="108"
                textAnchor="middle"
                fontSize="12"
                fontWeight="900"
                fill="#166534"
              >
                🍻
              </text>
            </g>
          </svg>
        </motion.div>
      </div>

      {selectedPlayer && (
        <div className="text-2xl font-black text-green-400">
          👉 {selectedPlayer}
        </div>
      )}

      {bottleMode === 'truthOrDare' &&
        selectedPlayer &&
        !prompt && (
          <div className="flex gap-4">
            <button
              onClick={chooseTruth}
              className="bg-sky-600 hover:bg-sky-500 px-6 py-3 rounded-xl font-black transition"
            >
              😇 Sandhed
            </button>

            <button
              onClick={chooseDare}
              className="bg-orange-600 hover:bg-orange-500 px-6 py-3 rounded-xl font-black transition"
            >
              🔥 Konsekvens
            </button>
          </div>
        )}

      {prompt && (
        <div className="w-full max-w-md bg-slate-800 rounded-2xl p-5 text-center shadow-2xl">
          <div className="text-slate-400 text-sm mb-2">
            {truthOrDareChoice === 'truth'
              ? 'Sandhed'
              : truthOrDareChoice === 'dare'
              ? 'Konsekvens'
              : 'Opgave'}
          </div>

          <div className="text-xl font-bold">
            {prompt}
          </div>
        </div>
      )}

      <button
        onClick={spinBottle}
        disabled={isSpinning}
        className={`transition rounded-xl px-8 py-4 text-xl font-black ${
          isSpinning
            ? 'bg-slate-600 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-500'
        }`}
      >
        {isSpinning ? 'Drejer...' : 'Drej flasken'}
      </button>

      <button
        onClick={() => setScreen('bottleMode')}
        className="text-slate-400 hover:text-white"
      >
        ← Tilbage til flaske modes
      </button>
    </div>
  );
}