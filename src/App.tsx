import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter, Redirect } from 'wouter';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute'; // Ensure this exists!
import AdminPage from './pages/AdminPage';
import HennaPage from './pages/HennaPage';
import AnimePage from './pages/AnimePage';
import OtherPage from './pages/OtherPage';
import ContactPage from './pages/ContactPage';
import NotFound from './pages/not-found';

const queryClient = new QueryClient();

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-[#E0DCBE]">
    <Navbar />
    <main className="grow">{children}</main>
    <Footer />
  </div>
);

function Router() {
  return (
    <Switch>
      <Route path="/"><Redirect to="/henna" /></Route>
    
      {/* Protected Admin Route */}
      <Route path="/admin">
        <ProtectedRoute>
          <AdminPage />
        </ProtectedRoute>
      </Route>
      <Route path="/henna"><PublicLayout><HennaPage /></PublicLayout></Route>
      <Route path="/anime"><PublicLayout><AnimePage /></PublicLayout></Route>
      <Route path="/other"><PublicLayout><OtherPage /></PublicLayout></Route>
      <Route path="/contact"><PublicLayout><ContactPage /></PublicLayout></Route>
      <Route><PublicLayout><NotFound /></PublicLayout></Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;