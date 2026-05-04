import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';

export default function App() {
  useEffect(() => {
    // Set dark mode by default
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    document.body.style.backgroundColor = savedTheme === 'dark' ? '#0b0d18' : '#f1f5f9';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
  }, []);

  return <RouterProvider router={router} />;
}
