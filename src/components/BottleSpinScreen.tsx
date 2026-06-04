import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSession } from '../store/session';

export default function BottleSpinScreen() {
  const players = useSession((s) => s.players);
  const setScreen = useSession((s) => s.setScreen);

  const [rotation, setRotation] = useState(0);
  const [selectedPlayer, setSelectedPlayer] =
    useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  function spinBottle() {
    if (players.length === 0 || isSpinning) return;

    setIsSpinning(true);
    setSelectedPlayer(null);

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
      setIsSpinning(false);
    }, 2200);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 gap-8">
      <h1 className="text-4xl font-black text-center">
        🍾 Flaskehalsen peger på
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
            {/* shadow */}
            <ellipse
                cx="110"
                cy="190"
                rx="38"
                ry="8"
                fill="#000000"
                opacity="0.25"
            />

            {/* bottle body */}
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

            {/* glass highlight */}
            <path
                d="M93 35 C84 68 82 122 78 166"
                stroke="#fef3c7"
                strokeWidth="6"
                opacity="0.25"
                strokeLinecap="round"
            />

            {/* neck dark */}
            <path
                d="M94 24 H126 V55 C121 60 99 60 94 55 Z"
                fill="#3b1d0c"
                opacity="0.9"
            />

            {/* cap */}
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

            {/* cap ridges */}
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

            {/* neck label */}
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

            {/* main label outer */}
            <ellipse
                cx="110"
                cy="134"
                rx="42"
                ry="48"
                fill="#f8fafc"
                stroke="#d6b84f"
                strokeWidth="5"
            />

            {/* main label green */}
            <ellipse
                cx="110"
                cy="137"
                rx="34"
                ry="38"
                fill="#166534"
                stroke="#fef3c7"
                strokeWidth="4"
            />

            {/* red ribbon */}
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

            {/* small seal */}
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
        onClick={() => setScreen('mode')}
        className="text-slate-400 hover:text-white"
      >
        ← Tilbage
      </button>
    </div>
  );
}