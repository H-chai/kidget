import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LoginPage } from './pages/Login';
import { SignupPage } from './pages/Signup';
import { OverviewPage } from './pages/Overview';
import { HistoryPage } from './pages/History';
import { AddTransactionPage } from './pages/AddTransaction';
import { BadgesPage } from './pages/Badges';
import { GoalsPage } from './pages/Goals';

export const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />

        {/* Protected routes — redirect to /login if not authenticated */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="add" element={<AddTransactionPage />} />
            <Route path="badges" element={<BadgesPage />} />
            <Route path="goals" element={<GoalsPage />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);
