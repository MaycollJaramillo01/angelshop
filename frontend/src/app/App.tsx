import { AppRoutes } from './routes';
import { useRealtime } from '../hooks/useRealtime';

const App = () => {
  useRealtime();
  return <AppRoutes />;
};

export default App;
