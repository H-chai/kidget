import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import './layout.css';

export const AppLayout = () => (
  <div className="app-layout">
    <Outlet />
    <BottomNav />
  </div>
);
