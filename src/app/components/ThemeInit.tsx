'use client';

import { useEffect } from 'react';

export function ThemeInit() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    document.body.style.backgroundColor = savedTheme === 'dark' ? '#0b0d18' : '#f1f5f9';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
  }, []);

  return null;
}
