import GameScreen from './components/GameScreen';
import SetupScreen from './components/SetupScreen';
import ModeSelectScreen from './components/ModeSelectScreen';
import { useSession } from './store/session';

function App() {
  const screen = useSession((s) => s.screen);

  switch (screen) {
    case 'setup':
      return <SetupScreen />;

    case 'mode':
      return <ModeSelectScreen />;

    case 'game':
      return <GameScreen />;

    default:
      return <SetupScreen />;
  }
}

export default App;