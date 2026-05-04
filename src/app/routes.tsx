import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Scanner } from './pages/Scanner';
import { StockDetail } from './pages/StockDetail';
import { Portfolio } from './pages/Portfolio';
import { SwingOpportunities } from './pages/SwingOpportunities';
import { SectorAnalysis } from './pages/SectorAnalysis';
import { Alerts } from './pages/Alerts';
import { Backtesting } from './pages/Backtesting';
import { Journal } from './pages/Journal';
import { Settings } from './pages/Settings';

export const router = createBrowserRouter([
  { path: '/login', Component: Login },
  { path: '/signup', Component: Signup },
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', Component: Dashboard },
      { path: 'scanner', Component: Scanner },
      { path: 'stock/:symbol', Component: StockDetail },
      { path: 'portfolio', Component: Portfolio },
      { path: 'swing', Component: SwingOpportunities },
      { path: 'sector', Component: SectorAnalysis },
      { path: 'alerts', Component: Alerts },
      { path: 'backtesting', Component: Backtesting },
      { path: 'journal', Component: Journal },
      { path: 'settings', Component: Settings },
      { path: 'watchlist', element: <Navigate to="/dashboard" replace /> },
    ],
  },
  { path: '*', element: <Navigate to="/login" replace /> },
]);
