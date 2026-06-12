import { useSession } from '../store/session';

export default function ModeSelectScreen() {
  const setGameMode = useSession(
    (s) => s.setGameMode
  );

  const setScreen = useSession(
    (s) => s.setScreen
  );

  function select(
    mode: 'normal' | 'chaos' | 'spicy'
  ) {
    setGameMode(mode);
    setScreen('game');
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col gap-4">
        <h1 className="text-4xl font-black text-center">
          🎮 Vælg game mode
        </h1>

        <button
          onClick={() => select('normal')}
          className="bg-slate-700 hover:bg-slate-600 transition p-5 rounded-2xl font-black text-xl"
        >
          🍺 Normal
        </button>

        <button
          onClick={() => select('chaos')}
          className="bg-orange-500 hover:bg-orange-400 transition p-5 rounded-2xl font-black text-xl"
        >
          🔥 Chaos
        </button>

        <button
          onClick={() => select('spicy')}
          className="bg-red-500 hover:bg-red-400 transition p-5 rounded-2xl font-black text-xl"
        >
          🌶️ Spicy
        </button>

        <button
          onClick={() => setScreen('bottleMode')}
          className="bg-blue-600 hover:bg-blue-500 transition p-5 rounded-2xl font-black text-xl"
        >
          🍾 Flaskehalsen peger på
        </button>

        <button
          onClick={() => setScreen('setup')}
          className="mt-4 text-slate-400 hover:text-white transition font-bold"
        >
          ← Tilbage til spillere
        </button>
      </div>
    </div>
  );
}