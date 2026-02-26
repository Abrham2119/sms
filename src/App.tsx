import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { PageLoader } from './components/PageLoader';
import { QueryProvider } from './providers/QueryProvider';
import { AuthProvider } from './providers/AuthProvider';

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <Router>
          <PageLoader />
          <AppRoutes />
        </Router>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
