import { useMemo, useState } from 'react';
import { useSession } from '../store/session';

type KingCard = {
  id: string;
  value: string;
  suit: '♠' | '♥' | '♦' | '♣';
  title: string;
  rule: string;
};

const ruleMap: Record<string, { title: string; rule: string }> = {
  A: {
    title: '🌊 Vandfald',
    rule: 'Alle starter med at drikke. Du må først stoppe, når personen før dig stopper.',
  },
  K: {
    title: '👑 Konge',
    rule: 'Lav en ny regel. Hvis det er den 4. konge, skal personen tage 5 slurke.',
  },
  Q: {
    title: '❓ Spørgsmålsmester',
    rule: 'Du er spørgsmålsmester. Hvis nogen svarer på dine spørgsmål, tager de 2 slurke.',
  },
  J: {
    title: '📚 Kategori',
    rule: 'Vælg en kategori. Turen går rundt. Første der går i stå tager 2 slurke.',
  },
  '10': {
    title: '🍻 Social',
    rule: 'Alle tager 2 slurke.',
  },
  '9': {
    title: '🎵 Rim',
    rule: 'Sig et ord. Turen går rundt med rim. Første fejl tager 2 slurke.',
  },
  '8': {
    title: '🤝 Mate',
    rule: 'Vælg en makker. Når du drikker, drikker makkeren også.',
  },
  '7': {
    title: '☝ Heaven',
    rule: 'Alle peger op. Sidste person tager 3 slurke.',
  },
  '6': {
    title: '👦 Drenge',
    rule: 'Alle drenge tager 2 slurke.',
  },
  '5': {
    title: '👧 Piger',
    rule: 'Alle piger tager 2 slurke.',
  },
  '4': {
    title: '👇 Floor',
    rule: 'Alle rører gulvet. Sidste person tager 3 slurke.',
  },
  '3': {
    title: '🙋 Mig',
    rule: 'Du tager 2 slurke.',
  },
  '2': {
    title: '👉 Dig',
    rule: 'Vælg en spiller der tager 2 slurke.',
  },
};

const values = [
  'A',
  'K',
  'Q',
  'J',
  '10',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  '3',
  '2',
];

const suits: KingCard['suit'][] = ['♠', '♥', '♦', '♣'];

function createDeck(): KingCard[] {
  return values.flatMap((value) =>
    suits.map((suit) => ({
      id: `${value}-${suit}`,
      value,
      suit,
      title: ruleMap[value].title,
      rule: ruleMap[value].rule,
    }))
  ).sort(() => Math.random() - 0.5);
}

export default function KingModeScreen() {
  const setScreen = useSession((s) => s.setScreen);

  const startingDeck = useMemo(() => createDeck(), []);

  const [deck, setDeck] = useState<KingCard[]>(startingDeck);
  const [currentCard, setCurrentCard] =
    useState<KingCard | null>(null);
  const [drawnCards, setDrawnCards] = useState<KingCard[]>([]);
  const [kingCount, setKingCount] = useState(0);

  function drawCard() {
    if (deck.length === 0) return;

    const [nextCard, ...rest] = deck;

    setDeck(rest);
    setCurrentCard(nextCard);
    setDrawnCards((cards) => [nextCard, ...cards]);

    if (nextCard.value === 'K') {
      setKingCount((count) => count + 1);
    }
  }

  function resetKingMode() {
    setDeck(createDeck());
    setCurrentCard(null);
    setDrawnCards([]);
    setKingCount(0);
  }

  const isRed =
    currentCard?.suit === '♥' ||
    currentCard?.suit === '♦';

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-lg flex flex-col gap-6">
        <h1 className="text-4xl font-black text-center">
          👑 King Mode
        </h1>

        <div className="bg-slate-800 rounded-3xl p-6 shadow-2xl text-center">
          <div className="text-slate-400 mb-4">
            Kort tilbage: {deck.length} • Konger trukket: {kingCount}/4
          </div>

          {currentCard ? (
            <>
              <div
                className={`mx-auto w-44 h-60 rounded-2xl bg-white flex flex-col items-center justify-center shadow-2xl ${
                  isRed ? 'text-red-600' : 'text-slate-900'
                }`}
              >
                <div className="text-7xl font-black">
                  {currentCard.value}
                </div>

                <div className="text-6xl">
                  {currentCard.suit}
                </div>
              </div>

              <div className="text-3xl font-black mt-6">
                {currentCard.title}
              </div>

              <div className="text-lg mt-3 text-slate-300">
                {currentCard.rule}
              </div>

              {currentCard.value === 'K' && kingCount >= 4 && (
                <div className="mt-4 bg-yellow-500/20 border border-yellow-500 rounded-xl p-4 text-yellow-200 font-bold">
                  👑 4. Konge er trukket! Personen tager 5 slurke.
                </div>
              )}
            </>
          ) : (
            <div className="py-12">
              <div className="text-7xl mb-4">🃏</div>
              <div className="text-xl text-slate-300">
                Tryk på “Træk kort” for at starte.
              </div>
            </div>
          )}
        </div>

        <button
          onClick={drawCard}
          disabled={deck.length === 0}
          className={`p-4 rounded-xl font-black transition ${
            deck.length === 0
              ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
              : 'bg-yellow-600 hover:bg-yellow-500'
          }`}
        >
          {deck.length === 0 ? 'Bunken er tom' : '🃏 Træk kort'}
        </button>

        <button
          onClick={resetKingMode}
          className="bg-slate-700 hover:bg-slate-600 p-4 rounded-xl font-bold"
        >
          🔄 Nyt King spil
        </button>

        {drawnCards.length > 0 && (
          <div className="bg-slate-800 rounded-2xl p-4 max-h-40 overflow-y-auto">
            <div className="font-black mb-2 text-slate-300">
              Trukne kort
            </div>

            <div className="flex flex-wrap gap-2">
              {drawnCards.map((card) => (
                <div
                  key={card.id}
                  className={`bg-white rounded-lg px-3 py-2 font-black ${
                    card.suit === '♥' || card.suit === '♦'
                      ? 'text-red-600'
                      : 'text-slate-900'
                  }`}
                >
                  {card.value}
                  {card.suit}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => setScreen('mode')}
          className="text-slate-400 hover:text-white"
        >
          ← Tilbage
        </button>
      </div>
    </div>
  );
}