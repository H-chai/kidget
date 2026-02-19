import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { OverviewPage } from './pages/Overview';
import { HistoryPage } from './pages/History';
import { AddTransactionPage } from './pages/AddTransaction';
import { BadgesPage } from './pages/Badges';
import { GoalsPage } from './pages/Goals';

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="add" element={<AddTransactionPage />} />
        <Route path="badges" element={<BadgesPage />} />
        <Route path="goals" element={<GoalsPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
