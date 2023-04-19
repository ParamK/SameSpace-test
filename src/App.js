import './App.css';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import MainMusicComp from './components/MainMusicComp';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainMusicComp />
    </QueryClientProvider>

  );
}

export default App;
