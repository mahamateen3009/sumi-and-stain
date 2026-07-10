import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) return null; // Wait for Firebase to finish checking auth state

  // IMPORTANT: Remove any <Redirect> logic here. 
  // Let the user access the /admin route. 
  // The AdminPage.tsx file will handle the "if (!user)" logic.

  return <>{children}</>;
}