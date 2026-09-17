import React from 'react';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AppRouter } from './router';
import { DemoQuickBar } from './components/common/DemoQuickBar';

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-teal-500 selection:text-white relative">
        <Navbar />
        <main className="flex-1">
          <AppRouter />
        </main>
        <Footer />
        <DemoQuickBar />
      </div>
    </AppProvider>
  );
}