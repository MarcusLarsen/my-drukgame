import { useSession, type BottleMode } from '../store/session';

const bottleModes: {
  mode: BottleMode;
  title: string;
  description: string;
  color: string;
}[] = [
  {
    mode: 'truth',
    title: '😇 Sandhed',
    description: 'Flasken vælger en person, som får et spørgsmål.',
    color: 'bg-sky-600 hover:bg-sky-500',
  },
  {
    mode: 'dare',
    title: '🔥 Konsekvens',
    description: 'Flasken vælger en person, som får en konsekvens.',
    color: 'bg-orange-600 hover:bg-orange-500',
  },
  {
    mode: 'truthOrDare',
    title: '😈 Sandhed eller Konsekvens',
    description: 'Personen vælger selv sandhed eller konsekvens.',
    color: 'bg-purple-600 hover:bg-purple-500',
  },
  {
    mode: 'challenge',
    title: '🎯 Udfordringer',
    description: 'Sjove små challenges uden for meget druk.',
    color: 'bg-green-600 hover:bg-green-500',
  },
  {
    mode: 'drink',
    title: '🍺 Druk Flaske',
    description: 'Flasken vælger hvem der skal drikke eller dele ud.',
    color: 'bg-yellow-600 hover:bg-yellow-500',
  },
  {
    mode: 'dating',
    title: '💘 Dating / Flirt',
    description: 'Mere spicy spørgsmål og flirtende prompts.',
    color: 'bg-pink-600 hover:bg-pink-500',
  },
];

export default function BottleModeSelectScreen() {
  const setBottleMode = useSession((s) => s.setBottleMode);
  const setScreen = useSession((s) => s.setScreen);

  function selectMode(mode: BottleMode) {
    setBottleMode(mode);
    setScreen('bottle');
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col gap-4">
        <h1 className="text-4xl font-black text-center">
          🍾 Vælg flaske-mode
        </h1>

        {bottleModes.map((item) => (
          <button
            key={item.mode}
            onClick={() => selectMode(item.mode)}
            className={`${item.color} transition p-5 rounded-2xl text-left`}
          >
            <div className="font-black text-xl">
              {item.title}
            </div>

            <div className="text-sm opacity-80 mt-1">
              {item.description}
            </div>
          </button>
        ))}

        <button
          onClick={() => setScreen('mode')}
          className="mt-4 text-slate-400 hover:text-white transition font-bold"
        >
          ← Tilbage til game modes
        </button>
      </div>
    </div>
  );
}