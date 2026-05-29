import { useState } from 'react';
import { useSession, type Card } from '../store/session';
import InstallButton from './InstallButton';

export default function SetupScreen() {
  const players = useSession((s) => s.players);
  const setPlayers = useSession((s) => s.setPlayers);
  const setScreen = useSession((s) => s.setScreen);
  const addCustomCard = useSession((s) => s.addCustomCard);
  const customCards = useSession((s) => s.customCards);

  const [names, setNames] = useState(
    players.length > 0 ? players.map((p) => p.name) : ['', '']
  );

  const [customText, setCustomText] = useState('');
  const [customCategory, setCustomCategory] =
    useState<Card['category']>('party');

  function updateName(index: number, value: string) {
    const copy = [...names];
    copy[index] = value;
    setNames(copy);
  }

  function addPlayer() {
    setNames([...names, '']);
  }

  function removePlayer(index: number) {
    setNames(names.filter((_, i) => i !== index));
  }

  function handleStart() {
    const cleanNames = names.filter((n) => n.trim().length > 0);

    if (cleanNames.length === 0) {
      alert('Tilføj mindst én spiller');
      return;
    }

    setPlayers(cleanNames);
    setScreen('mode');
  }

  function handleAddCustomCard() {
    if (customText.trim().length < 3) {
      alert('Skriv lidt mere tekst til kortet');
      return;
    }

    const card: Card = {
      id: `custom-${Date.now()}`,
      text: customText.trim(),
      category: customCategory,
      level: 2,
      target: customText.includes('{NAME2}')
        ? 'duel'
        : customText.includes('{NAME}')
        ? 'one'
        : 'all',
    };

    addCustomCard(card);
    setCustomText('');
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
        <h1 className="text-5xl font-black text-center">
          🍻 Drukspil
        </h1>

        <p className="text-center text-slate-400">
          Tilføj spillere for at starte
        </p>

        {names.map((name, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={name}
              placeholder={`Spiller ${index + 1}`}
              onChange={(e) => updateName(index, e.target.value)}
              className="flex-1 bg-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />

            {names.length > 1 && (
              <button
                onClick={() => removePlayer(index)}
                className="bg-red-500 hover:bg-red-400 px-4 rounded-xl"
              >
                ❌
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addPlayer}
          className="bg-slate-700 hover:bg-slate-600 transition rounded-xl py-3 font-bold"
        >
          ➕ Tilføj spiller
        </button>

        <div className="border-t border-slate-700 pt-4 mt-2 flex flex-col gap-3">
          <h2 className="font-black text-lg">
            ✍️ Eget kort
          </h2>

          <p className="text-slate-400 text-sm">
            Vælg hvilken kategori kortet tilhører. Spicy-kort kommer kun med i Spicy mode.
          </p>

          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Skriv dit eget kort... Brug evt. {NAME} eller {NAME2}"
            className="bg-slate-700 rounded-xl px-4 py-3 outline-none min-h-24"
          />

          <select
            value={customCategory}
            onChange={(e) =>
              setCustomCategory(e.target.value as Card['category'])
            }
            className="bg-slate-700 rounded-xl px-4 py-3 outline-none"
          >
            <option value="soft">Soft</option>
            <option value="party">Party</option>
            <option value="spicy">Spicy</option>
          </select>

          <button
            onClick={handleAddCustomCard}
            className="bg-purple-600 hover:bg-purple-500 transition rounded-xl py-3 font-bold"
          >
            ➕ Tilføj eget kort
          </button>

          <p className="text-slate-400 text-sm">
            Egne kort gemt: {customCards.length}
          </p>
        </div>

        <InstallButton />
        
        <button
          onClick={handleStart}
          className="bg-green-600 hover:bg-green-500 transition rounded-xl py-4 text-lg font-black"
        >
          ▶ Start spil
        </button>

      </div>
    </div>
  );
}