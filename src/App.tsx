import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { ProfileGuard } from './components/layout/ProfileGuard';
import { LoginPage } from './pages/Login';
import { SignupPage } from './pages/Signup';
import { OnboardingPage } from './pages/Onboarding';
import { OverviewPage } from './pages/Overview';
import { HistoryPage } from './pages/History';
import { AddTransactionPage } from './pages/AddTransaction';
import { BadgesPage } from './pages/Badges';
import { GoalsPage } from './pages/Goals';
import { SettingsPage } from './pages/Settings';

export const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <ProfileProvider>
        <Routes>
          {/* Public routes */}
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />

          {/* Authenticated routes */}
          <Route element={<ProtectedRoute />}>
            {/* Needs auth but no profile yet */}
            <Route path="onboarding" element={<OnboardingPage />} />

            {/* Needs auth + profile */}
            <Route element={<ProfileGuard />}>
              <Route element={<AppLayout />}>
                <Route index element={<OverviewPage />} />
                <Route path="history" element={<HistoryPage />} />
                <Route path="add" element={<AddTransactionPage />} />
                <Route path="badges" element={<BadgesPage />} />
                <Route path="goals" element={<GoalsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </ProfileProvider>
    </AuthProvider>
  </BrowserRouter>
);
