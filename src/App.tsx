import GameScreen from './components/GameScreen';
import SetupScreen from './components/SetupScreen';
import ModeSelectScreen from './components/ModeSelectScreen';
import BottleSpinScreen from './components/BottleSpinScreen';
import BottleModeSelectScreen from './components/BottleModeSelectScreen';
import KingModeScreen from './components/KingModeScreen';
import UpdatePrompt from './components/UpdatePrompt';
import { useSession } from './store/session';

function App() {
  const screen = useSession((s) => s.screen);

  let content;

  switch (screen) {
    case 'setup':
      content = <SetupScreen />;
      break;

    case 'mode':
      content = <ModeSelectScreen />;
      break;

    case 'game':
      content = <GameScreen />;
      break;

    case 'bottleMode':
      content = <BottleModeSelectScreen />;
      break;

    case 'bottle':
      content = <BottleSpinScreen />;
      break;

    case 'king':
      content = <KingModeScreen />;
      break;

    default:
      content = <SetupScreen />;
  }

  return (
    <>
      {content}
      <UpdatePrompt />
    </>
  );
}

export default App;